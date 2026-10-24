import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'  // real user data ke liye
import Snowfall from '../components/user/Snowfall.jsx'

const links = [
  { to: '/admin', end: true, label: 'Dashboard', icon: 'dashboard' },
  { to: '/admin/categories', label: 'Categories', icon: 'category' },
  { to: '/admin/products', label: 'Products', icon: 'inventory_2' },
  { to: '/admin/orders', label: 'Orders', icon: 'receipt_long' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()   // logged-in admin ka data
  const navigate = useNavigate()

  // Logout: session clear -> login page
  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen">
      <Snowfall />
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-brand text-cream flex flex-col">
        <div className="flex items-center gap-2 px-6 py-6 border-b border-brand-light">
          <span className="material-symbols-outlined text-gold">storefront</span>
          <span className="font-display text-xl font-semibold text-gold">
            ANTIQOR
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, end, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gold text-brand-dark shadow-lg shadow-gold/20'
                    : 'text-cream/80 hover:bg-brand-light hover:text-cream hover:translate-x-1'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl transition-transform group-hover:scale-110">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-brand-light text-xs text-cream/60">
          © 2026 Admin Panel
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-8 py-4 bg-white/95 backdrop-blur-sm border-b border-black/10 sticky top-0 z-10 shadow-sm">
          <h1 className="font-display text-lg font-semibold text-brand">
            Admin Panel
          </h1>

          {/* ===== Real user info ===== */}
          <div className="flex items-center gap-3 text-sm">
            <div className="text-right leading-tight">
              <p className="font-medium text-ink">{user?.name || 'Admin'}</p>
              <p className="text-xs text-ink/50">{user?.email}</p>
            </div>
            {/* Avatar: user ka pehla letter */}
            <span className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark text-brand-dark grid place-content-center font-semibold shadow-md">
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </span>
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-base">logout</span>
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 bg-gradient-to-br from-cream/30 to-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}