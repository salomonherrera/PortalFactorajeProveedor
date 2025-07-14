import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<DashboardPage />} />
    </Routes>
  )
}

export default App