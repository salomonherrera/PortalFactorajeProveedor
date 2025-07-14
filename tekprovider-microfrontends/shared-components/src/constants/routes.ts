export const ROUTES = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Main App
  DASHBOARD: '/dashboard',
  INVOICES: '/invoices',
  FACTORING: '/factoring',
  SUPPORT: '/support',
  PROFILE: '/profile',
  
  // Invoices
  INVOICES_CREATE: '/invoices/create',
  INVOICES_EDIT: (id: string) => `/invoices/edit/${id}`,
  
  // Factoring
  FACTORING_CREATE: '/factoring/create',
  FACTORING_DETAILS: (id: string) => `/factoring/${id}`,
  
  // Support
  SUPPORT_CREATE: '/support/create',
  SUPPORT_TICKET: (id: string) => `/support/ticket/${id}`,
  NOTIFICATIONS: '/support/notifications'
}