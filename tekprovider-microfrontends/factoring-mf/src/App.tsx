import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { FactoringListPage } from './pages/FactoringListPage'
import { CreateFactoringPage } from './pages/CreateFactoringPage'
import { FactoringDetailsPage } from './pages/FactoringDetailsPage'

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<FactoringListPage />} />
      <Route path="create" element={<CreateFactoringPage />} />
      <Route path=":id" element={<FactoringDetailsPage />} />
    </Routes>
  )
}

export default App