import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SupportDashboard } from './pages/SupportDashboard'
import { CreateTicketPage } from './pages/CreateTicketPage'
import { TicketDetailsPage } from './pages/TicketDetailsPage'
import { NotificationsPage } from './pages/NotificationsPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<SupportDashboard />} />
      <Route path="create" element={<CreateTicketPage />} />
      <Route path="ticket/:id" element={<TicketDetailsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
    </Routes>
  )
}

export default App