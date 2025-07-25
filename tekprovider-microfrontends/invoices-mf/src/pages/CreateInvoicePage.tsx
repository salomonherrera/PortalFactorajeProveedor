import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save } from 'lucide-react'
import { 
  Button, 
  Card, 
  Input,
  useAuth
} from '@tekprovider/shared-components'

interface InvoiceForm {
  folio: string
  clientName: string
  clientRFC: string
  amount: number
  issueDate: string
  dueDate: string
  description: string
  operationType: 'Provider' | 'Client'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
  assignor: string
  payer: string
  relationship: string
}

export const CreateInvoicePage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InvoiceForm>()

  const onSubmit = async (data: InvoiceForm) => {
    try {
      const response = await fetch('https://localhost:5000/api/invoices', {
        method: 'POST',
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
        throw new Error('Error al crear la factura')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la factura')
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Nueva Factura</h1>
          <p className="text-gray-600">Crea una nueva factura para tu cliente</p>
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
                Tipo de Operación *
              </label>
              <select
                {...register('operationType', { required: 'El tipo de operación es requerido' })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar tipo</option>
                <option value="Provider">Por Proveedor</option>
                <option value="Client">Por Cliente</option>
              </select>
              {errors.operationType && (
                <p className="text-sm text-red-600 mt-1">{errors.operationType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Recurso *
              </label>
              <select
                {...register('resourceType', { required: 'El tipo de recurso es requerido' })}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Seleccionar recurso</option>
                <option value="WithRecourse">Con Recurso</option>
                <option value="WithoutRecourse">Sin Recurso</option>
              </select>
              {errors.resourceType && (
                <p className="text-sm text-red-600 mt-1">{errors.resourceType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Cedente *"
              {...register('assignor', { required: 'El cedente es requerido' })}
              error={errors.assignor?.message}
              placeholder="Nombre del cedente"
            />

            <Input
              label="Pagador *"
              {...register('payer', { required: 'El pagador es requerido' })}
              error={errors.payer?.message}
              placeholder="Nombre del pagador"
            />

            <Input
              label="Relación"
              {...register('relationship')}
              error={errors.relationship?.message}
              placeholder="Relación entre cedente y pagador"
            />
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
              Crear Factura
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}