import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { InvoicesListPage } from './pages/InvoicesListPage'
import { CreateInvoicePage } from './pages/CreateInvoicePage'
import { EditInvoicePage } from './pages/EditInvoicePage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<InvoicesListPage />} />
      <Route path="create" element={<CreateInvoicePage />} />
      <Route path="edit/:id" element={<EditInvoicePage />} />
    </Routes>
  )
}

export default App