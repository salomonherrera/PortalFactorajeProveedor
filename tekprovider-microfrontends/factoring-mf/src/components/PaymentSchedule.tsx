import React from 'react'
import { Calendar, DollarSign, Clock } from 'lucide-react'
import { Card, StatusBadge, formatCurrency, formatDate } from '@tekprovider/shared-components'

interface Payment {
  id: number
  paymentNumber: number
  dueDate: string
  amount: number
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
  description?: string
}

interface PaymentScheduleProps {
  payments: Payment[]
  totalAmount: number
  className?: string
}

export const PaymentSchedule: React.FC<PaymentScheduleProps> = ({
  payments,
  totalAmount,
  className
}) => {
  const getStatusStats = () => {
    return {
      pending: payments.filter(p => p.status === 'Pending').length,
      paid: payments.filter(p => p.status === 'Paid').length,
      overdue: payments.filter(p => p.status === 'Overdue').length,
      totalPaid: payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.amount, 0),
      totalPending: payments.filter(p => p.status !== 'Paid').reduce((sum, p) => sum + p.amount, 0)
    }
  }

  const stats = getStatusStats()

  if (!payments || payments.length === 0) {
    return (
      <Card className={className}>
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Tabla de Pagos</h3>
        </div>
        <div className="p-8 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No hay pagos programados
          </h4>
          <p className="text-gray-600">
            Los pagos aparecerán cuando la solicitud sea aprobada y se genere el cronograma
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Tabla de Pagos</h3>
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              {payments.length} pagos programados
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-b bg-gray-50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Pendientes</span>
            </div>
            <p className="text-lg font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-500">{formatCurrency(stats.totalPending)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Pagados</span>
            </div>
            <p className="text-lg font-bold text-green-600">{stats.paid}</p>
            <p className="text-xs text-gray-500">{formatCurrency(stats.totalPaid)}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-red-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Vencidos</span>
            </div>
            <p className="text-lg font-bold text-red-600">{stats.overdue}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Total</span>
            </div>
            <p className="text-lg font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Payment Table */}
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
                Fecha Pago Real
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment, index) => {
              const isOverdue = payment.status === 'Pending' && new Date(payment.dueDate) < new Date()
              
              return (
                <tr key={payment.id} className={isOverdue ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        payment.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        isOverdue ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.paymentNumber}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        Pago {payment.paymentNumber}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(payment.dueDate)}</div>
                    {isOverdue && (
                      <div className="text-xs text-red-600 font-medium">Vencido</div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge 
                      status={isOverdue ? 'Overdue' : payment.status} 
                      variant={
                        payment.status === 'Paid' ? 'success' :
                        isOverdue ? 'danger' : 'warning'
                      }
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentDate ? formatDate(payment.paymentDate) : '-'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.description || `Pago ${index + 1} de ${payments.length}`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Payment Progress */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progreso de Pagos</span>
          <span className="text-sm text-gray-600">
            {stats.paid} de {payments.length} pagos completados
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(stats.paid / payments.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Pagado: {formatCurrency(stats.totalPaid)}</span>
          <span>Pendiente: {formatCurrency(stats.totalPending)}</span>
        </div>
      </div>
    </Card>
  )
}