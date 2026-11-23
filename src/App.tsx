import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminApp } from './pages/AdminApp'
import { AdminLogin } from './pages/AdminLogin'
import { AgentApp } from './pages/AgentApp'
import { ClinicWeb } from './pages/ClinicWeb'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AgentApp />} />
      <Route path="/web" element={<ClinicWeb />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
