import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Eye, 
  MessageCircle,
  Clock,
  CheckCircle,
  AlertTriangle,
  Bell
} from 'lucide-react'
import { 
  Button, 
  Card, 
  DataTable, 
  StatusBadge,
  useApi,
  formatDate,
  API_ENDPOINTS,
  SupportTicket,
  Notification
} from '@tekprovider/shared-components'

export const SupportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'notifications'>('tickets')

  const { data: tickets, loading: ticketsLoading } = useApi<SupportTicket[]>(`${API_ENDPOINTS.TICKETS}`)
  const { data: notifications, loading: notificationsLoading } = useApi<Notification[]>(API_ENDPOINTS.NOTIFICATIONS)

  const ticketColumns = [
    {
      key: 'ticketNumber' as keyof SupportTicket,
      header: 'Número',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'subject' as keyof SupportTicket,
      header: 'Asunto',
      render: (value: string) => (
        <span className="font-medium">{value}</span>
      )
    },
    {
      key: 'priority' as keyof SupportTicket,
      header: 'Prioridad',
      render: (value: string) => {
        const colors = {
          'High': 'bg-red-100 text-red-800',
          'Medium': 'bg-yellow-100 text-yellow-800',
          'Low': 'bg-green-100 text-green-800'
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[value as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        )
      }
    },
    {
      key: 'status' as keyof SupportTicket,
      header: 'Estado',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'assignedTo' as keyof SupportTicket,
      header: 'Asignado a',
      render: (value: string | undefined) => value || 'Sin asignar'
    },
    {
      key: 'createdAt' as keyof SupportTicket,
      header: 'Fecha',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id' as keyof SupportTicket,
      header: 'Acciones',
      render: (value: number) => (
        <Link to={`/support/ticket/${value}`}>
          <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
            Ver
          </Button>
        </Link>
      )
    }
  ]

  const getTicketStats = () => {
    if (!tickets) return { open: 0, inProgress: 0, closed: 0 }
    
    return {
      open: tickets.filter(t => t.status === 'Open').length,
      inProgress: tickets.filter(t => t.status === 'InProgress').length,
      closed: tickets.filter(t => t.status === 'Closed').length
    }
  }

  const stats = getTicketStats()
  const unreadNotifications = notifications?.filter(n => !n.isRead).length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mesa de Ayuda</h1>
          <p className="text-gray-600">Gestiona tus tickets de soporte y notificaciones</p>
        </div>
        <div className="flex space-x-3">
          <Link to="/support/notifications">
            <Button variant="outline" icon={<Bell className="w-4 h-4" />}>
              Notificaciones {unreadNotifications > 0 && (
                <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                  {unreadNotifications}
                </span>
              )}
            </Button>
          </Link>
          <Link to="/support/create">
            <Button icon={<Plus className="w-4 h-4" />}>
              Nuevo Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{tickets?.length || 0}</p>
              <p className="text-sm text-gray-600">Total Tickets</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              <p className="text-sm text-gray-600">Abiertos</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-600">En Proceso</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.closed}</p>
              <p className="text-sm text-gray-600">Cerrados</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mis Tickets
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Notificaciones
            {unreadNotifications > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {unreadNotifications}
              </span>
            )}
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'tickets' && (
        <Card>
          {ticketsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <DataTable
              data={tickets || []}
              columns={ticketColumns}
            />
          )}
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card>
          {notificationsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="p-4">
              {notifications && notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg ${
                        notification.isRead ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No tienes notificaciones</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  )
}