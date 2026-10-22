// ===== My Orders - order history + cancel =====
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { getMyOrders, cancelOrder } from '../../services/api'

const STATUS_COLOR = {
  Pending: 'warning',
  Confirmed: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'error',
}

// Sirf Pending/Confirmed order cancel ho sakta hai (backend ka rule)
const canCancel = (order) => order.status === 'Pending' || order.status === 'Confirmed'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState(null) // cancel hone wala order
  const [busy, setBusy] = useState(false)

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await getMyOrders()
      setOrders(data.orders || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load your orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleCancel = async () => {
    if (!confirm) return
    setBusy(true)
    try {
      const { data } = await cancelOrder(confirm._id)
      // Response me updated order aata hai - list me replace kar do
      setOrders((prev) => prev.map((o) => (o._id === data.order._id ? data.order : o)))
      setConfirm(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel the order')
      setConfirm(null)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', px: 3, py: 6 }}>
      <Typography
        variant="h4"
        sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700 }}
      >
        My Orders
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 4 }}>
        {orders.length} order{orders.length === 1 ? '' : 's'} placed
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 56, opacity: 0.4 }}>
            receipt_long
          </span>
          <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.primary' }}>
            You have not placed any order yet
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 3 }}>
            Browse collection
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {orders.map((order) => (
            <Box
              key={order._id}
              className="fade-up"
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: 3,
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <Box sx={{ flex: 1, minWidth: 160 }}>
                  <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {order.orderNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>

                <Chip
                  label={order.status}
                  color={STATUS_COLOR[order.status] || 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
                <Chip
                  label={order.paymentMethod}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />

                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Rs {Number(order.totalPrice).toLocaleString()}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {order.items.map((item) => (
                  <Typography key={item.productId} variant="body2" color="text.secondary">
                    {item.name} × {item.quantity}
                  </Typography>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1.5, mt: 2, flexWrap: 'wrap' }}>
                <Button
                  component={RouterLink}
                  to={`/order/${order._id}`}
                  variant="outlined"
                  size="small"
                >
                  View details
                </Button>
                {canCancel(order) && (
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => setConfirm(order)}
                  >
                    Cancel order
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Cancel confirmation */}
      <Dialog open={!!confirm} onClose={() => !busy && setConfirm(null)}>
        <DialogTitle>Cancel this order?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Order <b>{confirm?.orderNumber}</b> cancel kar diya jayega aur stock wapas
            add kar diya jayega. Ye action undo nahi hoga.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm(null)} disabled={busy}>
            Keep order
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={busy}
            startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {busy ? 'Cancelling...' : 'Yes, cancel it'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
