import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FileText, Calendar, DollarSign } from 'lucide-react'
import { 
  Button, 
  Card, 
  StatusBadge,
  useApi,
  API_ENDPOINTS,
  FactoringRequest,
  formatCurrency,
  formatDate
} from '@tekprovider/shared-components'

export const FactoringDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [activeTab, setActiveTab] = useState<'details' | 'quotation' | 'payments'>('details')

  const { data: request, loading, error } = useApi<FactoringRequest>(`${API_ENDPOINTS.FACTORING}/${id}`)
  const { data: payments } = useApi<Payment[]>(`${API_ENDPOINTS.FACTORING_PAYMENTS(Number(id))}`)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar la solicitud: {error}</p>
        <Button onClick={() => navigate('/factoring')} className="mt-4">
          Volver a Solicitudes
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
          onClick={() => navigate('/factoring')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Solicitud {request.requestNumber}
          </h1>
          <p className="text-gray-600">Detalles de la solicitud de factoraje</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Detalles
          </button>
          <button
            onClick={() => setActiveTab('quotation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Cotización
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Tabla de Pagos
          </button>
        </nav>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Content */}
          {activeTab === 'details' && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Información General</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Número de Solicitud</p>
                    <p className="font-semibold">{request.requestNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estatus</p>
                    <StatusBadge status={request.status} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fecha de Creación</p>
                    <p className="font-semibold">{formatDate(request.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monto Total</p>
                    <p className="font-semibold text-green-600">
                      {formatCurrency(request.totalAmount)}
                    </p>
                  </div>
                </div>

                {request.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Notas</p>
                    <p className="mt-1 p-3 bg-gray-50 rounded-lg">{request.notes}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'quotation' && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Información de Cotización</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Condiciones</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Plazo</p>
                        <p className="font-semibold">{request.termDays || 30} días</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">% Adelanto</p>
                        <p className="font-semibold text-green-600">{request.advancePercentage || 80}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">% Retención</p>
                        <p className="font-semibold text-yellow-600">{request.retentionPercentage || 15}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Tasa</p>
                        <p className="font-semibold text-blue-600">{request.interestRate || 2.5}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">% Comisión</p>
                        <p className="font-semibold text-red-600">{request.commissionPercentage || 3.0}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Montos Calculados</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Monto Total:</span>
                        <span className="font-semibold">{formatCurrency(request.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Adelanto:</span>
                        <span className="font-semibold text-green-600">
                          {formatCurrency(request.advanceAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Retención:</span>
                        <span className="font-semibold text-yellow-600">
                          {formatCurrency(request.retentionAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Comisión:</span>
                        <span className="font-semibold text-red-600">
                          {formatCurrency(request.commissionAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Neto a Recibir:</span>
                        <span className="font-bold text-blue-600">
                          {formatCurrency(request.netAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Información de Partes</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Cedente</p>
                        <p className="font-semibold">{request.invoices?.[0]?.assignor || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Pagador</p>
                        <p className="font-semibold">{request.invoices?.[0]?.payer || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Relación</p>
                        <p className="font-semibold">{request.invoices?.[0]?.relationship || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tipo de Operación</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Modalidad</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.invoices?.[0]?.operationType === 'Provider' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {request.invoices?.[0]?.operationType === 'Provider' ? 'Por Proveedor' : 'Por Cliente'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Recurso</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.invoices?.[0]?.resourceType === 'WithRecourse' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {request.invoices?.[0]?.resourceType === 'WithRecourse' ? 'Con Recurso' : 'Sin Recurso'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'payments' && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Tabla de Pagos</h3>
              </div>
              <div className="p-4">
                {payments && payments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pago #
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Vencimiento
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha Pago
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {payments.map((payment) => (
                          <tr key={payment.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {payment.paymentNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(payment.dueDate)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={payment.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paymentDate ? formatDate(payment.paymentDate) : 'Pendiente'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay pagos programados</p>
                    <p className="text-sm text-gray-400">Los pagos aparecerán cuando la solicitud sea aprobada</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Invoices - Always visible */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">
                Facturas Incluidas ({request.invoices?.length || 0})
              </h3>
            </div>
            <div className="p-4">
              {request.invoices && request.invoices.length > 0 ? (
                <div className="space-y-3">
                  {request.invoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-400" />
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
                      
                      <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Cedente: </span>
                          <span className="font-medium">{invoice.assignor || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Pagador: </span>
                          <span className="font-medium">{invoice.payer || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Tipo: </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            invoice.operationType === 'Provider' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {invoice.operationType === 'Provider' ? 'Por Proveedor' : 'Por Cliente'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Recurso: </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            invoice.resourceType === 'WithRecourse' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {invoice.resourceType === 'WithRecourse' ? 'Con Recurso' : 'Sin Recurso'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No hay facturas asociadas
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div>
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Resumen</h3>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Facturas</p>
                  <p className="font-semibold">{request.invoices?.length || 0}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Monto Total</p>
                  <p className="font-semibold">{formatCurrency(request.totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-semibold">{formatDate(request.createdAt)}</p>
                </div>
              </div>

              {request.advanceAmount && (
                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Anticipo Recibido</p>
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(request.advanceAmount)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Status Timeline */}
          <Card className="mt-4">
            <div className="p-4 border-b">
              <h4 className="font-medium">Estado de la Solicitud</h4>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Solicitud Creada</p>
                    <p className="text-xs text-gray-500">{formatDate(request.createdAt)}</p>
                  </div>
                </div>
                
                {request.status !== 'InProcess' && (
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      request.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium">
                        {request.status === 'Approved' ? 'Aprobada' : 'Rechazada'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.paymentDate ? formatDate(request.paymentDate) : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                )}

                {request.status === 'Paid' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Pagada</p>
                      <p className="text-xs text-gray-500">
                        {request.paymentDate ? formatDate(request.paymentDate) : 'Fecha no disponible'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}