import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, User, Calendar, AlertTriangle } from 'lucide-react'
import { 
  Button, 
  Card, 
  StatusBadge,
  useApi,
  API_ENDPOINTS,
  SupportTicket,
  formatDate
} from '@tekprovider/shared-components'

export const TicketDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const { data: ticket, loading, error } = useApi<SupportTicket>(`${API_ENDPOINTS.TICKETS}/${id}`)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar el ticket: {error}</p>
        <Button onClick={() => navigate('/support')} className="mt-4">
          Volver a Soporte
        </Button>
      </div>
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate('/support')}
          icon={<ArrowLeft className="w-4 h-4" />}
        >
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ticket {ticket.ticketNumber}
          </h1>
          <p className="text-gray-600">{ticket.subject}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          <Card>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Detalles del Ticket</h3>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <div className="p-4">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>
          </Card>

          {/* Comments/Updates Section */}
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Historial de Actualizaciones</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">Sistema</span>
                      <span className="text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Ticket creado y asignado a {ticket.assignedTo || 'equipo de soporte'}
                    </p>
                  </div>
                </div>

                {ticket.status !== 'Open' && (
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {ticket.assignedTo || 'Equipo de Soporte'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {ticket.updatedAt ? formatDate(ticket.updatedAt) : formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {ticket.status === 'InProgress' && 'Ticket en proceso de revisión'}
                        {ticket.status === 'Closed' && 'Ticket resuelto y cerrado'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Información</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Número de Ticket</p>
                <p className="font-semibold">{ticket.ticketNumber}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <StatusBadge status={ticket.status} />
              </div>

              <div>
                <p className="text-sm text-gray-600">Prioridad</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {ticket.priority}
                </span>
              </div>

              <div>
                <p className="text-sm text-gray-600">Asignado a</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium">
                    {ticket.assignedTo || 'Sin asignar'}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Fecha de Creación</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              {ticket.updatedAt && (
                <div>
                  <p className="text-sm text-gray-600">Última Actualización</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formatDate(ticket.updatedAt)}</span>
                  </div>
                </div>
              )}

              {ticket.closedAt && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Cierre</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{formatDate(ticket.closedAt)}</span>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          {ticket.status !== 'Closed' && (
            <Card className="mt-4">
              <div className="p-4 border-b">
                <h4 className="font-medium">Acciones</h4>
              </div>
              <div className="p-4 space-y-2">
                <Button variant="outline" className="w-full">
                  Agregar Comentario
                </Button>
                {ticket.status === 'Open' && (
                  <Button variant="danger" className="w-full">
                    Cerrar Ticket
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}