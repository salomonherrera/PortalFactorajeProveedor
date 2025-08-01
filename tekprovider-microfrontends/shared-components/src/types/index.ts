export interface User {
  id: number
  companyName: string
  rfc: string
  email: string
  phone?: string
  providerCode: string
  isActive: boolean
  userType: 'Provider' | 'Client' // Tipo de usuario
  factoringConfig?: FactoringConfig // Configuración de factoraje
}

export interface FactoringConfig {
  id: number
  userId: number
  factoringType: 'ClientFactoring' | 'ProviderFactoring' // Factoraje de clientes o proveedores
  resourceType: 'WithRecourse' | 'WithoutRecourse' // Con recurso o sin recurso
  defaultTermDays: number // Plazo por defecto
  defaultAdvancePercentage: number // % Adelanto por defecto
  defaultRetentionPercentage: number // % Retención por defecto
  defaultInterestRate: number // Tasa por defecto
  defaultCommissionPercentage: number // % Comisión por defecto
  isActive: boolean
  createdAt: string
  updatedAt?: string
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
  // Información de factoraje
  assignor: string // Cedente (quien cede la factura)
  payer: string // Pagador (quien debe pagar la factura)
  relationship?: string // Relación comercial entre cedente y pagador
  // Campos calculados basados en configuración
  operationType?: 'ClientFactoring' | 'ProviderFactoring'
  resourceType?: 'WithRecourse' | 'WithoutRecourse'
}

export interface FactoringRequest {
  id: number
  requestNumber: string
  userId: number
  totalAmount: number
  status: 'InProcess' | 'Approved' | 'Rejected' | 'Paid'
  factoringType: 'ClientFactoring' | 'ProviderFactoring' // Tipo de factoraje
  resourceType: 'WithRecourse' | 'WithoutRecourse' // Tipo de recurso
  quotation?: FactoringQuotation // Cotización detallada
  paymentDate?: string
  notes?: string
  createdAt: string
  invoices: Invoice[]
  payments?: Payment[]
  financialQuote?: FinancialQuote // Cotización con financiera
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
  // Información de partes
  assignor: string // Cedente
  payer: string // Pagador
  relationship?: string // Relación comercial
  // Tipo de operación
  factoringType: 'ClientFactoring' | 'ProviderFactoring'
  resourceType: 'WithRecourse' | 'WithoutRecourse'
  // Condiciones financieras
  totalAmount: number
  termDays: number
  advancePercentage: number
  retentionPercentage: number
  interestRate: number
  commissionPercentage: number
  // Montos calculados
  advanceAmount: number
  retentionAmount: number
  commissionAmount: number
  netAmount: number
  // Información adicional
  cat: number // CAT (Costo Anual Total)
  createdAt: string
}

export interface FinancialQuote {
  id: number
  factoringRequestId: number
  financialInstitution: string // Institución financiera
  quotationNumber: string // Número de cotización
  totalAmount: number
  termDays: number
  interestRate: number
  commissionPercentage: number
  cat: number // CAT
  netAmount: number
  status: 'Pending' | 'Approved' | 'Rejected'
  validUntil: string // Vigencia de la cotización
  notes?: string
  createdAt: string
  approvedAt?: string
}

export interface InvoiceUpload {
  id: number
  fileName: string
  originalName: string
  fileSize: number
  mimeType: string
  uploadedBy: number
  factoringRequestId?: number
  status: 'Uploaded' | 'Processing' | 'Processed' | 'Error'
  processedData?: Partial<Invoice> // Datos extraídos del archivo
  errorMessage?: string
  uploadedAt: string
  processedAt?: string
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