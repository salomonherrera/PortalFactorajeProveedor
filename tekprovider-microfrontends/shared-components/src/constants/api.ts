export const API_BASE_URL = 'https://localhost:5000'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  ME: '/api/auth/me',
  
  // Invoices
  INVOICES: '/api/invoices',
  INVOICES_BY_STATUS: (status: string) => `/api/invoices/status/${status}`,
  INVOICES_TOTAL: '/api/invoices/total',
  
  // Factoring
  FACTORING: '/api/factoring',
  FACTORING_BY_STATUS: (status: string) => `/api/factoring/status/${status}`,
  FACTORING_CONFIG: '/api/factoring/config',
  FACTORING_CONFIG_UPDATE: '/api/factoring/config',
  FACTORING_QUOTATION: (id: number) => `/api/factoring/${id}/quotation`,
  FACTORING_FINANCIAL_QUOTE: (id: number) => `/api/factoring/${id}/financial-quote`,
  FACTORING_PAYMENTS: (id: number) => `/api/factoring/${id}/payments`,
  FACTORING_APPROVE: (id: number) => `/api/factoring/${id}/approve`,
  FACTORING_REJECT: (id: number) => `/api/factoring/${id}/reject`,
  FACTORING_TOTAL: '/api/factoring/total',
  
  // Invoice Upload
  INVOICE_UPLOAD: '/api/invoices/upload',
  INVOICE_UPLOAD_STATUS: (id: number) => `/api/invoices/upload/${id}/status`,
  
  // Support
  TICKETS: '/api/support/tickets',
  TICKETS_BY_STATUS: (status: string) => `/api/support/tickets/status/${status}`,
  CLOSE_TICKET: (id: number) => `/api/support/tickets/${id}/close`,
  
  // Notifications
  NOTIFICATIONS: '/api/notifications',
  MARK_READ: (id: number) => `/api/notifications/${id}/read`,
  MARK_ALL_READ: '/api/notifications/read-all',
  UNREAD_COUNT: '/api/notifications/unread-count'
}