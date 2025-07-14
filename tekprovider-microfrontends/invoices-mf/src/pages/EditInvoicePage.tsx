import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'
import { 
  Button, 
  Card, 
  Input,
  useAuth,
  useApi,
  API_ENDPOINTS,
  Invoice
} from '@tekprovider/shared-components'

interface InvoiceForm {
  folio: string
  clientName: string
  clientRFC: string
  amount: number
  issueDate: string
  dueDate: string
  description: string
  status: string
}

export const EditInvoicePage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { token } = useAuth()
  
  const { data: invoice, loading } = useApi<Invoice>(`${API_ENDPOINTS.INVOICES}/${id}`)
  
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<InvoiceForm>()

  useEffect(() => {
    if (invoice) {
      reset({
        folio: invoice.folio,
        clientName: invoice.clientName,
        clientRFC: invoice.clientRFC || '',
        amount: invoice.amount,
        issueDate: invoice.issueDate.split('T')[0],
        dueDate: invoice.dueDate.split('T')[0],
        description: invoice.description || '',
        status: invoice.status
      })
    }
  }, [invoice, reset])

  const onSubmit = async (data: InvoiceForm) => {
    try {
      const response = await fetch(`https://localhost:5000/api/invoices/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...data,
          amount: Number(data.amount)
        })
      })

      if (response.ok) {
        navigate('/invoices')
      } else {
        throw new Error('Error al actualizar la factura')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al actualizar la factura')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Factura no encontrada</p>
        <Button onClick={() => navigate('/invoices')} className="mt-4">
          Volver a Facturas
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/invoices')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Factura</h1>
          <p className="text-gray-600">Modifica los datos de la factura {invoice.folio}</p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Folio *"
              {...register('folio', { required: 'El folio es requerido' })}
              error={errors.folio?.message}
              placeholder="Ej: F001"
            />

            <Input
              label="Cliente *"
              {...register('clientName', { required: 'El nombre del cliente es requerido' })}
              error={errors.clientName?.message}
              placeholder="Nombre de la empresa"
            />

            <Input
              label="RFC del Cliente"
              {...register('clientRFC')}
              error={errors.clientRFC?.message}
              placeholder="RFC123456789"
            />

            <Input
              label="Monto *"
              type="number"
              step="0.01"
              {...register('amount', { 
                required: 'El monto es requerido',
                min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
              })}
              error={errors.amount?.message}
              placeholder="0.00"
            />

            <Input
              label="Fecha de Emisión *"
              type="date"
              {...register('issueDate', { required: 'La fecha de emisión es requerida' })}
              error={errors.issueDate?.message}
            />

            <Input
              label="Fecha de Vencimiento *"
              type="date"
              {...register('dueDate', { required: 'La fecha de vencimiento es requerida' })}
              error={errors.dueDate?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estatus *
              </label>
              <select
                {...register('status', { required: 'El estatus es requerido' })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Issued">Emitida</option>
                <option value="Paid">Pagada</option>
                <option value="Overdue">Vencida</option>
                <option value="Cancelled">Cancelada</option>
              </select>
              {errors.status && (
                <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Descripción de los servicios o productos..."
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/invoices')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isSubmitting}
              icon={<Save className="w-4 h-4" />}
            >
              Actualizar Factura
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}