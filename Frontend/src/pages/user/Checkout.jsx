// ===== Checkout - shipping address + payment method + order place =====
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { placeOrder } from '../../services/api'

export default function Checkout() {
  const { items, total, refresh } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [error, setError] = useState('')
  const [placing, setPlacing] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Backend bhi validate karta hai, par yahan pehle rok dete hain
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      setError('Please fill in all the required fields.')
      return
    }

    setPlacing(true)
    try {
      const { data } = await placeOrder({
        shippingAddress: form,
        paymentMethod,
      })
      // Page turant badal do, cart refresh background me
      navigate(`/order/${data.order._id}`, { state: { justPlaced: true } })
      // Backend pe cart khali ho chuka hai - local state bhi refresh kar do
      refresh()
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Could not place the order. Please try again.'
      )
    } finally {
      setPlacing(false)
    }
  }

  // Cart khaali hai -> checkout ka koi matlab nahi
  if (items.length === 0) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', px: 3, py: 10, textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 56, opacity: 0.4 }}>
          shopping_bag
        </span>
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 700, color: 'primary.main' }}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Add something to your cart before checking out.
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
          Browse collection
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 6 }}>
      <Typography
        variant="h4"
        sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700 }}
      >
        Checkout
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        Where should we deliver your order?
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 1fr' },
          alignItems: 'start',
        }}
      >
        {/* ===== Address form ===== */}
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Shipping address
          </Typography>

          <Box sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Phone number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              fullWidth
              placeholder="03XX-XXXXXXX"
            />
            <TextField
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={2}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Postal code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                fullWidth
              />
            </Box>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 700, mt: 4, mb: 1 }}>
            Payment method
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel
              value="COD"
              control={<Radio />}
              label="Cash on Delivery"
            />
            <FormControlLabel value="Card" control={<Radio />} label="Card" />
          </RadioGroup>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={placing}
            className={placing ? '' : 'pop'}
            sx={{
              mt: 3,
              borderRadius: 2,
              py: 1.5,
              fontWeight: 600,
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 30px -10px rgba(18, 50, 79, 0.4)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
            startIcon={
              placing ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <span className="material-symbols-outlined">local_shipping</span>
              )
            }
          >
            {placing ? 'Placing order...' : 'Place Order'}
          </Button>
        </Box>

        {/* ===== Order summary ===== */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            bgcolor: 'background.paper',
            position: { md: 'sticky' },
            top: { md: 100 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Order summary
          </Typography>

          {items.map((item) => (
            <Box key={item.productId} sx={{ display: 'flex', gap: 1.5, py: 1 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.quantity} × Rs {Number(item.price).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Rs {Number(item.price * item.quantity).toLocaleString()}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>
              Rs {Number(total).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
