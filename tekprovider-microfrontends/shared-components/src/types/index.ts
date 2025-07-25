export interface User {
  id: number
  companyName: string
  rfc: string
  email: string
  phone?: string
  providerCode: string
  isActive: boolean
}

export interface Invoice {
  id: number
  folio: string
  clientName: string
  clientRFC?: string
  amount: number
  issueDate: string
  dueDate: string
  status: 'Issued' | 'Paid' | 'Overdue' | 'Cancelled'
  description?: string
  userId: number
  // Nuevos campos para factoraje
  operationType: 'Provider' | 'Client' // Por Proveedor o por Cliente
  resourceType: 'WithRecourse' | 'WithoutRecourse' // Con recurso o sin recurso
  assignor?: string // Cedente
  payer?: string // Pagador
  relationship?: string // Relación entre cedente y pagador
}

export interface FactoringRequest {
  id: number
  requestNumber: string
  userId: number
  totalAmount: number
  status: 'InProcess' | 'Approved' | 'Rejected' | 'Paid'
  // Información de cotización
  advancePercentage?: number // % de Adelanto
  retentionPercentage?: number // % de Retención
  interestRate?: number // Tasa de interés
  commissionPercentage?: number // % de Comisión
  termDays?: number // Plazo en días
  // Montos calculados
  advanceAmount?: number // Monto de adelanto
  retentionAmount?: number // Monto de retención
  commissionAmount?: number // Monto de comisión
  netAmount?: number // Monto neto a recibir
  paymentDate?: string
  notes?: string
  createdAt: string
  quotationDate?: string // Fecha de cotización
  invoices: Invoice[]
  payments?: Payment[] // Tabla de pagos
}

export interface Payment {
  id: number
  factoringRequestId: number
  paymentNumber: number
  dueDate: string
  amount: number
  status: 'Pending' | 'Paid' | 'Overdue'
  paymentDate?: string
  description?: string
}

export interface FactoringQuotation {
  id: number
  factoringRequestId: number
  cedente: string // Cedente
  pagador: string // Pagador
  operationType: 'Provider' | 'Client'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
  totalAmount: number
  termDays: number
  advancePercentage: number
  retentionPercentage: number
  interestRate: number
  commissionPercentage: number
  advanceAmount: number
  retentionAmount: number
  commissionAmount: number
  netAmount: number
  createdAt: string
}

export interface SupportTicket {
  id: number
  ticketNumber: string
  subject: string
  description: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'Open' | 'InProgress' | 'Closed'
  userId: number
  assignedTo?: string
  attachmentPath?: string
  createdAt: string
  updatedAt?: string
  closedAt?: string
}

export interface Notification {
  id: number
  title: string
  message: string
  type: 'Info' | 'Success' | 'Warning' | 'Error'
  userId: number
  isRead: boolean
  createdAt: string
  readAt?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}