// ===== Login page - premium winter design =====
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import { useAuth } from '../../context/AuthContext'
import AuthShell from '../../components/user/AuthShell.jsx'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Already logged in ho to login page ki zaroorat nahi
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError('')
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your account"
      footer={
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Don't have an account?{' '}
          <Typography
            component={Link}
            to="/register"
            variant="body2"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'border-color .2s',
              '&:hover': { borderColor: 'primary.main' },
            }}
          >
            Register here
          </Typography>
        </Typography>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2.5 }}>
        {error && (
          <Alert severity="error" className="fade-up">
            {error}
          </Alert>
        )}

        <TextField
          className="fade-up"
          style={{ animationDelay: '60ms' }}
          name="email"
          type="email"
          label="Email"
          required
          fullWidth
          value={form.email}
          onChange={handleChange}
        />

        <TextField
          className="fade-up"
          style={{ animationDelay: '120ms' }}
          name="password"
          type={showPw ? 'text' : 'password'}
          label="Password"
          required
          fullWidth
          value={form.password}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPw((s) => !s)}
                  edge="end"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                    {showPw ? 'visibility_off' : 'visibility'}
                  </span>
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          className="fade-up"
          style={{ animationDelay: '180ms' }}
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            py: 1.3,
            background: 'linear-gradient(135deg, #12324f 0%, #24507a 100%)',
            boxShadow: '0 10px 24px rgba(18,50,79,.28)',
            transition: 'transform .2s, box-shadow .2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 14px 30px rgba(18,50,79,.34)',
            },
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </AuthShell>
  )
}
