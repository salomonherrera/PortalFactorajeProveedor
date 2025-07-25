import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { 
  Button, 
  Card, 
  Input,
  useAuth,
  useApi,
  API_ENDPOINTS,
  Invoice,
  formatCurrency,
  StatusBadge
} from '@tekprovider/shared-components'

export const CreateFactoringPage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [selectedInvoices, setSelectedInvoices] = useState<number[]>([])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showQuotation, setShowQuotation] = useState(false)
  
  // Quotation fields
  const [quotation, setQuotation] = useState({
    termDays: 30,
    advancePercentage: 80,
    retentionPercentage: 15,
    interestRate: 2.5,
    commissionPercentage: 3.0,
    cedente: '',
    pagador: '',
    operationType: 'Provider' as 'Provider' | 'Client',
    resourceType: 'WithRecourse' as 'WithRecourse' | 'WithoutRecourse'
  })

  const { data: invoices, loading } = useApi<Invoice[]>(API_ENDPOINTS.INVOICES)

  // Filter only issued invoices that can be factored
  const availableInvoices = invoices?.filter(invoice => 
    invoice.status === 'Issued' || invoice.status === 'Overdue'
  ) || []

  const handleInvoiceToggle = (invoiceId: number) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const getTotalAmount = () => {
    return availableInvoices
      .filter(invoice => selectedInvoices.includes(invoice.id))
      .reduce((sum, invoice) => sum + invoice.amount, 0)
  }

  const calculateQuotation = () => {
    const totalAmount = getTotalAmount()
    const advanceAmount = totalAmount * (quotation.advancePercentage / 100)
    const retentionAmount = totalAmount * (quotation.retentionPercentage / 100)
    const commissionAmount = totalAmount * (quotation.commissionPercentage / 100)
    const netAmount = advanceAmount - commissionAmount
    
    return {
      totalAmount,
      advanceAmount,
      retentionAmount,
      commissionAmount,
      netAmount
    }
  }

  const calculatedAmounts = calculateQuotation()

  const handleSubmit = async () => {
    if (selectedInvoices.length === 0) {
      alert('Debe seleccionar al menos una factura')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('https://localhost:5000/api/factoring', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          invoiceIds: selectedInvoices,
          notes,
          quotation: {
            ...quotation,
            ...calculatedAmounts
          }
        })
      })

      if (response.ok) {
        navigate('/factoring')
      } else {
        throw new Error('Error al crear la solicitud')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al crear la solicitud de factoraje')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/factoring')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Solicitud de Factoraje</h1>
          <p className="text-gray-600">Selecciona las facturas que deseas enviar a factoraje</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Invoices */}
        <div className="lg:col-span-2">
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Facturas Disponibles</h3>
              <p className="text-sm text-gray-600">
                Selecciona las facturas que deseas incluir en la solicitud
              </p>
            </div>
            <div className="p-4">
              {availableInvoices.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay facturas disponibles para factoraje</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedInvoices.includes(invoice.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInvoiceToggle(invoice.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => handleInvoiceToggle(invoice.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <div>
                            <p className="font-medium">{invoice.folio}</p>
                            <p className="text-sm text-gray-600">{invoice.clientName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(invoice.amount)}</p>
                          <StatusBadge status={invoice.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Summary and Form */}
        <div>
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Resumen de Solicitud</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Facturas seleccionadas:</p>
                <p className="text-2xl font-bold text-blue-600">{selectedInvoices.length}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Monto total:</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(getTotalAmount())}
                </p>
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowQuotation(!showQuotation)}
                  className="w-full mb-4"
                >
                  {showQuotation ? 'Ocultar' : 'Mostrar'} Cotización
                </Button>

                {showQuotation && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900">Simulador de Cotización</h4>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Plazo (días)
                        </label>
                        <input
                          type="number"
                          value={quotation.termDays}
                          onChange={(e) => setQuotation({...quotation, termDays: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          % Adelanto
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={quotation.advancePercentage}
                          onChange={(e) => setQuotation({...quotation, advancePercentage: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          % Retención
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={quotation.retentionPercentage}
                          onChange={(e) => setQuotation({...quotation, retentionPercentage: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tasa %
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={quotation.interestRate}
                          onChange={(e) => setQuotation({...quotation, interestRate: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          % Comisión
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={quotation.commissionPercentage}
                          onChange={(e) => setQuotation({...quotation, commissionPercentage: Number(e.target.value)})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Cedente
                        </label>
                        <input
                          type="text"
                          value={quotation.cedente}
                          onChange={(e) => setQuotation({...quotation, cedente: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Nombre del cedente"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Pagador
                        </label>
                        <input
                          type="text"
                          value={quotation.pagador}
                          onChange={(e) => setQuotation({...quotation, pagador: e.target.value})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                          placeholder="Nombre del pagador"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tipo Operación
                        </label>
                        <select
                          value={quotation.operationType}
                          onChange={(e) => setQuotation({...quotation, operationType: e.target.value as 'Provider' | 'Client'})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="Provider">Por Proveedor</option>
                          <option value="Client">Por Cliente</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Tipo Recurso
                        </label>
                        <select
                          value={quotation.resourceType}
                          onChange={(e) => setQuotation({...quotation, resourceType: e.target.value as 'WithRecourse' | 'WithoutRecourse'})}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                        >
                          <option value="WithRecourse">Con Recurso</option>
                          <option value="WithoutRecourse">Sin Recurso</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Adelanto ({quotation.advancePercentage}%):</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(calculatedAmounts.advanceAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Retención ({quotation.retentionPercentage}%):</span>
                        <span className="font-semibold text-yellow-600">
                          {formatCurrency(calculatedAmounts.retentionAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Comisión ({quotation.commissionPercentage}%):</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(calculatedAmounts.commissionAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t pt-2">
                        <span>Neto a Recibir:</span>
                        <span className="text-blue-600">
                          {formatCurrency(calculatedAmounts.netAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Comentarios adicionales sobre la solicitud..."
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={selectedInvoices.length === 0}
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Crear Solicitud
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/factoring')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </Card>

          {/* Selected Invoices List */}
          {selectedInvoices.length > 0 && (
            <Card className="mt-4">
              <div className="p-4 border-b">
                <h4 className="font-medium">Facturas Seleccionadas</h4>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {availableInvoices
                    .filter(invoice => selectedInvoices.includes(invoice.id))
                    .map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between text-sm">
                        <span>{invoice.folio}</span>
                        <div className="flex items-center space-x-2">
                          <span>{formatCurrency(invoice.amount)}</span>
                          <button
                            onClick={() => handleInvoiceToggle(invoice.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}