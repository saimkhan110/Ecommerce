// ===== STEP 6: ProtectedRoute - sirf allowed users ko andar aane do =====
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ allowedRoles }) {
  const { user, loading } = useAuth()

  // Token verify ho raha hai (/me call) - thoda ruko
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-ink/50">
        Loading...
      </div>
    )
  }

  // Bina login -> /login bhejo
  if (!user) return <Navigate to="/login" replace />

  // Login hai lekin role allow nahi hai -> home bhejo
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Sab theek -> andar ka content (Outlet) render karo
  return <Outlet />
}