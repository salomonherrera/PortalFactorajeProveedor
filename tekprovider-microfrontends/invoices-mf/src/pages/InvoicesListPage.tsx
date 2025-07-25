import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  Trash2,
  Search,
  Calendar
} from 'lucide-react'
import { 
  Button, 
  Card, 
  Input, 
  DataTable, 
  StatusBadge,
  useApi,
  formatCurrency,
  formatDate,
  API_ENDPOINTS,
  Invoice
} from '@tekprovider/shared-components'

export const InvoicesListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const { data: invoices, loading, error, refetch } = useApi<Invoice[]>(API_ENDPOINTS.INVOICES)

  const filteredInvoices = invoices?.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.folio.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || invoice.status === statusFilter
    const matchesDateFrom = !dateFrom || new Date(invoice.issueDate) >= new Date(dateFrom)
    const matchesDateTo = !dateTo || new Date(invoice.issueDate) <= new Date(dateTo)
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
  })?.sort((a, b) => {
    const dateA = new Date(a.issueDate).getTime()
    const dateB = new Date(b.issueDate).getTime()
    return sortOrder === 'desc' ? dateB - dateA : dateA - dateB
  }) || []

  const columns = [
    {
      key: 'folio' as keyof Invoice,
      header: 'Folio',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
    },
    {
      key: 'clientName' as keyof Invoice,
      header: 'Cliente'
    },
    {
      key: 'operationType' as keyof Invoice,
      header: 'Tipo Operación',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'Provider' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {value === 'Provider' ? 'Por Proveedor' : 'Por Cliente'}
        </span>
      )
    },
    {
      key: 'resourceType' as keyof Invoice,
      header: 'Recurso',
      render: (value: string) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'WithRecourse' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {value === 'WithRecourse' ? 'Con Recurso' : 'Sin Recurso'}
        </span>
      )
    },
    {
      key: 'amount' as keyof Invoice,
      header: 'Monto',
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'issueDate' as keyof Invoice,
      header: (
        <div className="flex items-center space-x-1">
          <span>Fecha Emisión</span>
          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="text-gray-400 hover:text-gray-600"
          >
            {sortOrder === 'desc' ? '↓' : '↑'}
          </button>
        </div>
      ),
      render: (value: string) => formatDate(value)
    },
    {
      key: 'dueDate' as keyof Invoice,
      header: 'Fecha Vencimiento',
      render: (value: string) => formatDate(value)
    },
    {
      key: 'assignor' as keyof Invoice,
      header: 'Cedente',
      render: (value: string | undefined) => value || 'N/A'
    },
    {
      key: 'payer' as keyof Invoice,
      header: 'Pagador',
      render: (value: string | undefined) => value || 'N/A'
    },
    {
      key: 'status' as keyof Invoice,
      header: 'Estatus',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'id' as keyof Invoice,
      header: 'Acciones',
      render: (value: number, invoice: Invoice) => (
        <div className="flex space-x-2">
          <Link to={`/invoices/edit/${value}`}>
            <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
              Editar
            </Button>
          </Link>
          <Button 
            variant="danger" 
            size="sm" 
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(value)}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ]

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      // TODO: Implement delete functionality
      console.log('Delete invoice:', id)
    }
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export invoices')
  }

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
        <p className="text-red-600">Error al cargar las facturas: {error}</p>
        <Button onClick={refetch} className="mt-4">Reintentar</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Facturas</h1>
          <p className="text-gray-600">Gestiona tus facturas y selecciona las que deseas enviar a factoraje</p>
        </div>
        <Link to="/invoices/create">
          <Button icon={<Plus className="w-4 h-4" />}>
            Nueva Factura
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Input
            placeholder="Buscar por folio o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4 text-gray-400" />}
          />
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todos los estatus</option>
            <option value="Issued">Emitida</option>
            <option value="Paid">Pagada</option>
            <option value="Overdue">Vencida</option>
            <option value="Cancelled">Cancelada</option>
          </select>

          <Input
            type="date"
            placeholder="Fecha desde"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <Input
            type="date"
            placeholder="Fecha hasta"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            icon={<Calendar className="w-4 h-4 text-gray-400" />}
          />

          <Button
            variant="outline"
            onClick={handleExport}
            icon={<Download className="w-4 h-4" />}
          >
            Exportar
          </Button>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{filteredInvoices.length}</p>
            <p className="text-sm text-gray-600">Total Facturas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0))}
            </p>
            <p className="text-sm text-gray-600">Monto Total</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {filteredInvoices.filter(inv => inv.status === 'Issued').length}
            </p>
            <p className="text-sm text-gray-600">Emitidas</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {filteredInvoices.filter(inv => inv.status === 'Overdue').length}
            </p>
            <p className="text-sm text-gray-600">Vencidas</p>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <DataTable
          data={filteredInvoices}
          columns={columns}
        />
      </Card>
    </div>
  )
}