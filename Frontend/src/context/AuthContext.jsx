// ===== STEP 2: Auth Context - login/register state poori app me =====
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { loginUser, registerUser, getMe } from '../services/api'

// Context banaya (initial value null, Provider se milega)
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Initial state sessionStorage se - page reload pe bhi login bana rahe
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('user'))
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => sessionStorage.getItem('token'))
  const [loading, setLoading] = useState(false)

  // Session me save karne ka helper (state + sessionStorage dono update)
  const persist = (newToken, newUser) => {
    sessionStorage.setItem('token', newToken)
    sessionStorage.setItem('user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  // ---- LOGIN ----
  // API se token + user aata hai, phir session me save
  const login = async (email, password) => {
    const { data } = await loginUser({ email, password })
    persist(data.token, data.user)
    return data.user
  }

  // ---- REGISTER (backend token bhi deta hai - auto login) ----
  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password })
    persist(data.token, data.user)
    return data.user
  }

  // ---- LOGOUT ----
  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  // ---- Mount pe token verify ----
  // Stored token hai to /me se fresh user le aao (role/profile update ke liye)
  // didInit ref = StrictMode me double API call se bachne ke liye
  const didInit = useRef(false)
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    if (!token) return

    ;(async () => {
      try {
        setLoading(true)
        const { data } = await getMe()
        setUser(data.user)
      } catch {
        // 401 pe interceptor storage saaf kar dega - state bhi theek kar do
        setUser(null)
        setToken(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook - anywhere: const { user, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)