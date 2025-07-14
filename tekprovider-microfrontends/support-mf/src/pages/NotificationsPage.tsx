import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bell, Check, Trash2 } from 'lucide-react'
import { 
  Button, 
  Card,
  useApi,
  useAuth,
  API_ENDPOINTS,
  Notification,
  formatDate
} from '@tekprovider/shared-components'

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate()
  const { token } = useAuth()
  const { data: notifications, loading, refetch } = useApi<Notification[]>(API_ENDPOINTS.NOTIFICATIONS)

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(`https://localhost:5000${API_ENDPOINTS.MARK_READ(notificationId)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      refetch()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch(`https://localhost:5000${API_ENDPOINTS.MARK_ALL_READ}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      refetch()
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      await fetch(`https://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      refetch()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'Success': return '✅'
      case 'Warning': return '⚠️'
      case 'Error': return '❌'
      default: return 'ℹ️'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'Success': return 'border-green-200 bg-green-50'
      case 'Warning': return 'border-yellow-200 bg-yellow-50'
      case 'Error': return 'border-red-200 bg-red-50'
      default: return 'border-blue-200 bg-blue-50'
    }
  }

  const unreadCount = notifications?.filter(n => !n.isRead).length || 0

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
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/support')}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones están leídas'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <Button
            variant="outline"
            onClick={markAllAsRead}
            icon={<Check className="w-4 h-4" />}
          >
            Marcar todas como leídas
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications && notifications.length > 0 ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 ${
                notification.isRead 
                  ? 'bg-white border-gray-200' 
                  : `${getNotificationColor(notification.type)} border-l-4`
              }`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${
                          notification.isRead ? 'text-gray-900' : 'text-gray-900 font-semibold'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.createdAt)}
                        </span>
                        {notification.readAt && (
                          <span className="text-xs text-gray-500">
                            Leída: {formatDate(notification.readAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.isRead && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        icon={<Check className="w-3 h-3" />}
                      >
                        Marcar como leída
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      icon={<Trash2 className="w-3 h-3" />}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card>
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes notificaciones
              </h3>
              <p className="text-gray-600">
                Cuando tengas nuevas notificaciones aparecerán aquí
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}