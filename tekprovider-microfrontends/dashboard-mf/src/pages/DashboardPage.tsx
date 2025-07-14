import React from 'react'
import { 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  KPICard,
  formatCurrency 
} from '@tekprovider/shared-components'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const monthlyData = [
  { month: 'Ene', facturas: 120, anticipos: 850000 },
  { month: 'Feb', facturas: 135, anticipos: 920000 },
  { month: 'Mar', facturas: 150, anticipos: 1050000 },
  { month: 'Abr', facturas: 128, anticipos: 890000 },
  { month: 'May', facturas: 165, anticipos: 1150000 },
  { month: 'Jun', facturas: 142, anticipos: 980000 }
]

const statusData = [
  { name: 'Aprobadas', value: 75, color: '#10b981' },
  { name: 'En Proceso', value: 20, color: '#f59e0b' },
  { name: 'Rechazadas', value: 5, color: '#ef4444' }
]

const recentActivity = [
  { id: 1, type: 'invoice', description: 'Factura F001 creada', time: '2 min ago', status: 'success' },
  { id: 2, type: 'factoring', description: 'Solicitud REQ-123 aprobada', time: '15 min ago', status: 'success' },
  { id: 3, type: 'payment', description: 'Pago recibido $125,000', time: '1 hora ago', status: 'success' },
  { id: 4, type: 'ticket', description: 'Ticket TKT-456 cerrado', time: '2 horas ago', status: 'info' }
]

export const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen de tu actividad en factoraje</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Facturas Emitidas"
          value="1,247"
          icon={<FileText className="w-6 h-6" />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Monto Factorizado"
          value={formatCurrency(2400000)}
          icon={<DollarSign className="w-6 h-6" />}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Anticipos Recibidos"
          value={formatCurrency(1800000)}
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
        <KPICard
          title="Tasa de Aprobación"
          value="87%"
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
          trend={{ value: 3, isPositive: false }}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución Mensual</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'anticipos' ? formatCurrency(value as number) : value,
                    name === 'anticipos' ? 'Anticipos' : 'Facturas'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="facturas" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {statusData.map((item) => (
                <div key={item.name} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anticipos Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Anticipos por Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
                <Tooltip formatter={(value) => [formatCurrency(value as number), 'Anticipos']} />
                <Bar 
                  dataKey="anticipos" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}