// ===== Register page - premium winter design =====
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

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Already logged in hai to register page ki zaroorat nahi
  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, confirmPassword } = form

    // ----- Client-side validation -----
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setLoading(true)
      setError('')
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Password show/hide toggle (dono password fields ke liye)
  const pwAdornment = (
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
  )

  return (
    <AuthShell
      title="Create account"
      subtitle="Join Antiqor and start your winter collection"
      footer={
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Already have an account?{' '}
          <Typography
            component={Link}
            to="/login"
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
            Login here
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
          style={{ animationDelay: '50ms' }}
          name="name"
          label="Full Name"
          required
          fullWidth
          value={form.name}
          onChange={handleChange}
        />

        <TextField
          className="fade-up"
          style={{ animationDelay: '100ms' }}
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
          style={{ animationDelay: '150ms' }}
          name="password"
          type={showPw ? 'text' : 'password'}
          label="Password"
          required
          fullWidth
          helperText="Minimum 6 characters"
          value={form.password}
          onChange={handleChange}
          InputProps={{ endAdornment: pwAdornment }}
        />

        <TextField
          className="fade-up"
          style={{ animationDelay: '200ms' }}
          name="confirmPassword"
          type={showPw ? 'text' : 'password'}
          label="Confirm Password"
          required
          fullWidth
          value={form.confirmPassword}
          onChange={handleChange}
          InputProps={{ endAdornment: pwAdornment }}
        />

        <Button
          className="fade-up"
          style={{ animationDelay: '250ms' }}
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
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </Box>
    </AuthShell>
  )
}
