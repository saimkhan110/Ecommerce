// ===== Order Confirmation - placed order ki details =====
import { useEffect, useState } from 'react'
import { useParams, Link as RouterLink, useLocation } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import { getOrderById, imageUrl } from '../../services/api'

// Status ka colour + label
const STATUS_COLOR = {
  Pending: 'warning',
  Confirmed: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'error',
}

export default function OrderConfirmation() {
  const { id } = useParams()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const justPlaced = location.state?.justPlaced

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await getOrderById(id)
        if (active) setOrder(res.data.order)
      } catch (err) {
        if (active)
          setError(err.response?.data?.message || 'Could not load this order')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !order) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', px: 3, py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button component={RouterLink} to="/orders" variant="contained">
          My orders
        </Button>
      </Box>
    )
  }

  const addr = order.shippingAddress || {}

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 6 }}>
      {justPlaced && (
        <Alert severity="success" variant="filled" sx={{ mb: 3 }}>
          Order placed successfully ✨ Thank you for shopping with us!
        </Alert>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#2e7d32' }}>
          check_circle
        </span>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700 }}
          >
            Order Confirmation
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Order number:{' '}
            <b style={{ color: 'primary.main' }}>{order.orderNumber}</b>
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Chip
          label={order.status}
          color={STATUS_COLOR[order.status] || 'default'}
          sx={{ fontWeight: 700 }}
        />
      </Box>

      <Box
        sx={{
          mt: 4,
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' },
          alignItems: 'start',
        }}
      >
        {/* ===== Items ===== */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Items ({order.items.length})
          </Typography>

          {order.items.map((item) => (
            <Box key={item.productId} sx={{ display: 'flex', gap: 2, py: 1.5 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  overflow: 'hidden',
                  bgcolor: 'grey.100',
                  flexShrink: 0,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {imageUrl(item.image) ? (
                  <Box
                    component="img"
                    src={imageUrl(item.image)}
                    alt={item.name}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span className="material-symbols-outlined" style={{ opacity: 0.35 }}>
                    chair
                  </span>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.quantity} × Rs {Number(item.price).toLocaleString()}
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Rs {Number(item.price * item.quantity).toLocaleString()}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>
              Rs {Number(order.totalPrice).toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* ===== Address + payment ===== */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Delivery address
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {addr.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {addr.phone}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {addr.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {addr.city}
            {addr.postalCode ? ` - ${addr.postalCode}` : ''}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Payment
          </Typography>
          <Typography variant="body2">
            Method: <b>{order.paymentMethod}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Status: {order.paymentStatus}
          </Typography>

          <Button
            component={RouterLink}
            to="/orders"
            variant="outlined"
            fullWidth
            sx={{ mt: 3 }}
          >
            View all orders
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
