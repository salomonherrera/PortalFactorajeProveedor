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
  amount: number
  issueDate: string
  dueDate: string
  status: 'Issued' | 'Paid' | 'Overdue' | 'Cancelled'
  description?: string
  clientRFC?: string
  userId: number
}

export interface FactoringRequest {
  id: number
  requestNumber: string
  userId: number
  totalAmount: number
  status: 'InProcess' | 'Approved' | 'Rejected' | 'Paid'
  commissionRate?: number
  commissionAmount?: number
  advanceAmount?: number
  paymentDate?: string
  notes?: string
  createdAt: string
  invoices: Invoice[]
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