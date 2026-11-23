import { Navigate, Route, Routes } from 'react-router-dom'
import { AgentApp } from './pages/AgentApp'
import { ClinicWeb } from './pages/ClinicWeb'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AgentApp />} />
      <Route path="/web" element={<ClinicWeb />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
