import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Eye, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { 
  Button, 
  Card, 
  DataTable, 
  StatusBadge,
  useApi,
  formatCurrency,
  formatDate,
  API_ENDPOINTS,
  FactoringRequest
} from '@tekprovider/shared-components'

export const FactoringListPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('')

  const { data: requests, loading, error, refetch } = useApi<FactoringRequest[]>(API_ENDPOINTS.FACTORING)

  const filteredRequests = requests?.filter(request => {
    return !statusFilter || request.status === statusFilter
  }) || []

  const columns = [
    {
      key: 'requestNumber' as keyof FactoringRequest,
      header: 'Número',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'totalAmount' as keyof FactoringRequest,
      header: 'Monto Total',
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'invoices' as keyof FactoringRequest,
      header: 'Facturas',
      render: (invoices: any[]) => (
        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
          {invoices?.length || 0} facturas
        </span>
      )
    },
    {
      key: 'status' as keyof FactoringRequest,
      header: 'Estatus',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'commissionRate' as keyof FactoringRequest,
      header: 'Comisión',
      render: (value: number | undefined) => 
        value ? `${value}%` : 'N/A'
    },
    {
      key: 'advanceAmount' as keyof FactoringRequest,
      header: 'Anticipo',
      render: (value: number | undefined) => 
        value ? formatCurrency(value) : 'Pendiente'
    },
    {
      key: 'createdAt' as keyof FactoringRequest,
      header: 'Fecha',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'id' as keyof FactoringRequest,
      header: 'Acciones',
      render: (value: number) => (
        <Link to={`/factoring/${value}`}>
          <Button variant="outline" size="sm" icon={<Eye className="w-4 h-4" />}>
            Ver Detalles
          </Button>
        </Link>
      )
    }
  ]

  const getStatusStats = () => {
    if (!requests) return { inProcess: 0, approved: 0, rejected: 0, paid: 0 }
    
    return {
      inProcess: requests.filter(r => r.status === 'InProcess').length,
      approved: requests.filter(r => r.status === 'Approved').length,
      rejected: requests.filter(r => r.status === 'Rejected').length,
      paid: requests.filter(r => r.status === 'Paid').length
    }
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar las solicitudes: {error}</p>
        <Button onClick={refetch} className="mt-4">Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Factoraje</h1>
          <p className="text-gray-600">Gestiona tus solicitudes de factoraje y su estatus</p>
        </div>
        <Link to="/factoring/create">
          <Button icon={<Plus className="w-4 h-4" />}>
            Nueva Solicitud
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-yellow-600">{stats.inProcess}</p>
              <p className="text-sm text-gray-600">En Proceso</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-sm text-gray-600">Aprobadas</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <XCircle className="w-8 h-8 text-red-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Rechazadas</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <p className="text-2xl font-bold text-blue-600">{stats.paid}</p>
              <p className="text-sm text-gray-600">Pagadas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filtrar por estatus:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="InProcess">En Proceso</option>
            <option value="Approved">Aprobadas</option>
            <option value="Rejected">Rechazadas</option>
            <option value="Paid">Pagadas</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <DataTable
          data={filteredRequests}
          columns={columns}
        />
      </Card>
    </div>
  )
}