import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ConfigurationPage } from './pages/ConfigurationPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ConfigurationPage />} />
    </Routes>
  )
}

export default App