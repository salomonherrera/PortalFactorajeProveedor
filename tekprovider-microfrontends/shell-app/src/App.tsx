import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { Layout } from './components/Layout'
import { LoadingSpinner } from '@tekprovider/shared-components'
import { useAuth } from '@tekprovider/shared-components'

// Lazy load microfrontends
const AuthMF = React.lazy(() => import('auth-mf/App'))
const DashboardMF = React.lazy(() => import('dashboard-mf/App'))
const InvoicesMF = React.lazy(() => import('invoices-mf/App'))
const FactoringMF = React.lazy(() => import('factoring-mf/App'))
const SupportMF = React.lazy(() => import('support-mf/App'))

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  
  return <>{children}</>
}

const AppRoutes: React.FC = () => {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route 
        path="/auth/*" 
        element={
          user ? <Navigate to="/dashboard" replace /> : (
            <Suspense fallback={<LoadingSpinner />}>
              <AuthMF />
            </Suspense>
          )
        } 
      />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route 
          path="dashboard/*" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardMF />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="invoices/*" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <InvoicesMF />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="factoring/*" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <FactoringMF />
              </Suspense>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="support/*" 
          element={
            <ProtectedRoute>
              <Suspense fallback={<LoadingSpinner />}>
                <SupportMF />
              </Suspense>
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App