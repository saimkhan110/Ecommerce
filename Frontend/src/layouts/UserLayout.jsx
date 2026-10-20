import { Outlet } from 'react-router-dom'
import Navbar from '../components/user/Navbar.jsx'
import Snowfall from '../components/user/Snowfall.jsx'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Snowfall />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer CTA */}
      <footer className="bg-brand text-cream">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-xl">Elegant Spaces. Better Living.</p>
          <p className="text-sm text-cream/60">
            © 2026 Antiqor Furniture. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
