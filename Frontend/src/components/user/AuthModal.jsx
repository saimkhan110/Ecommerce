import { useEffect, useState } from 'react'

const fields = {
  login: [
    { label: 'Email', type: 'email', name: 'email', placeholder: 'you@example.com' },
    { label: 'Password', type: 'password', name: 'password', placeholder: '••••••••' },
  ],
  register: [
    { label: 'Full Name', type: 'text', name: 'name', placeholder: 'Your name' },
    { label: 'Email', type: 'email', name: 'email', placeholder: 'you@example.com' },
    { label: 'Password', type: 'password', name: 'password', placeholder: '••••••••' },
    { label: 'Confirm Password', type: 'password', name: 'confirm', placeholder: '••••••••' },
  ],
}

export default function AuthModal({ open, onClose }) {
  const [tab, setTab] = useState('login')

  useEffect(() => {
    if (!open) return

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const isLogin = tab === 'login'
  const active = fields[tab]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isLogin ? 'Login' : 'Register'}
        className="w-full max-w-md bg-cream rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand text-cream px-7 py-5 flex items-center justify-between">
          <div>
            <p className="text-gold text-xs tracking-widest uppercase">ANTIQOR</p>
            <h2 className="font-display text-2xl font-semibold">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-cream/70 hover:text-gold transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-black/10">
          {['login', 'register'].map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`py-3 text-sm font-medium capitalize transition-colors ${
                tab === key
                  ? 'text-brand border-b-2 border-gold'
                  : 'text-ink/50 hover:text-ink'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Form */}
        <form
          key={tab}
          className="px-7 py-6 space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {active.map(({ label, type, name, placeholder }) => (
            <div key={name}>
              <label
                htmlFor={`auth-${name}`}
                className="block text-xs font-medium text-ink/70 mb-1.5"
              >
                {label}
              </label>
              <input
                id={`auth-${name}`}
                name={name}
                type={type}
                required
                placeholder={placeholder}
                className="w-full rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
          ))}

          {isLogin && (
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-ink/70">
                <input type="checkbox" name="remember" className="accent-brand" />
                Remember me
              </label>
              <button type="button" className="text-brand hover:underline">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand text-cream py-2.5 text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-ink/50">
            {isLogin ? (
              <>
                New here?{' '}
                <button
                  type="button"
                  onClick={() => setTab('register')}
                  className="text-brand font-medium hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setTab('login')}
                  className="text-brand font-medium hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  )
}
