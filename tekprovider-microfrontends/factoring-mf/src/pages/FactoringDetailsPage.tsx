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

  const { data: request, loading, error } = useApi<FactoringRequest>(`${API_ENDPOINTS.FACTORING}/${id}`)

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Info */}
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

          {/* Financial Details */}
          {(request.commissionRate || request.advanceAmount) && (
            <Card>
              <div className="p-4 border-b">
                <h3 className="text-lg font-semibold">Detalles Financieros</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  {request.commissionRate && (
                    <div>
                      <p className="text-sm text-gray-600">Tasa de Comisión</p>
                      <p className="font-semibold">{request.commissionRate}%</p>
                    </div>
                  )}
                  {request.commissionAmount && (
                    <div>
                      <p className="text-sm text-gray-600">Monto de Comisión</p>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(request.commissionAmount)}
                      </p>
                    </div>
                  )}
                  {request.advanceAmount && (
                    <div>
                      <p className="text-sm text-gray-600">Anticipo Recibido</p>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(request.advanceAmount)}
                      </p>
                    </div>
                  )}
                  {request.paymentDate && (
                    <div>
                      <p className="text-sm text-gray-600">Fecha de Pago</p>
                      <p className="font-semibold">{formatDate(request.paymentDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Invoices */}
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
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
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