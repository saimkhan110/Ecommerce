// ===== Admin Manage Orders - all users orders =====
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { getAllOrdersAdmin, updateOrderStatusAdmin } from '../../services/api'

const STATUS_COLOR = {
  Pending: 'warning',
  Confirmed: 'info',
  Shipped: 'primary',
  Delivered: 'success',
  Cancelled: 'error',
}

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']

export default function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [updatingId, setUpdatingId] = useState(null)
  const [viewOrder, setViewOrder] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      const { data } = await getAllOrdersAdmin()
      setOrders(data.orders || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (orderId, status) => {
    setUpdatingId(orderId)
    setError('')
    setSuccess('')
    try {
      const { data } = await updateOrderStatusAdmin(orderId, status)
      setOrders((prev) => prev.map((o) => (o._id === data.order._id ? data.order : o)))
      setSuccess('Order status updated')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status')
    } finally {
      setUpdatingId(null)
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography
            variant="h5"
            sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700 }}
          >
            Orders
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {orders.length} order{orders.length === 1 ? '' : 's'} from all users
          </Typography>
        </Box>
        <Button variant="outlined" onClick={load}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.4 }}>
            receipt_long
          </span>
          <Typography sx={{ mt: 1.5, fontWeight: 600, color: 'text.primary' }}>
            No orders yet
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          {orders.map((order) => (
            <Box
              key={order._id}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                p: 3,
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {order.orderNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {order.user?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.user?.email}
                  </Typography>
                </Box>

                <Chip label={order.paymentMethod} variant="outlined" size="small" />
                <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Rs {Number(order.totalPrice).toLocaleString()}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Select
                    size="small"
                    value={order.status}
                    disabled={updatingId === order._id}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    sx={{ minWidth: 140 }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                  {updatingId === order._id && <CircularProgress size={18} />}
                </Box>

                <Chip
                  label={order.status}
                  color={STATUS_COLOR[order.status] || 'default'}
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                  {order.items.length} item{order.items.length === 1 ? '' : 's'} • {order.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
                </Typography>
                <Button size="small" variant="outlined" onClick={() => setViewOrder(order)}>
                  View details
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Order details dialog */}
      <Dialog open={!!viewOrder} onClose={() => setViewOrder(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Order details</DialogTitle>
        <DialogContent dividers>
          {viewOrder && (
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2">Order</Typography>
                <Typography>{viewOrder.orderNumber}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(viewOrder.createdAt).toLocaleString()}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Customer</Typography>
                <Typography>{viewOrder.user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">{viewOrder.user?.email}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Shipping address</Typography>
                <Typography>{viewOrder.shippingAddress?.fullName} • {viewOrder.shippingAddress?.phone}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {viewOrder.shippingAddress?.address}, {viewOrder.shippingAddress?.city} {viewOrder.shippingAddress?.postalCode}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2">Items</Typography>
                {viewOrder.items.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                    <Typography variant="body2">{item.name} × {item.quantity}</Typography>
                    <Typography variant="body2">Rs {Number(item.price * item.quantity).toLocaleString()}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 600 }}>Total</Typography>
                  <Typography sx={{ fontWeight: 600 }}>Rs {Number(viewOrder.totalPrice).toLocaleString()}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={`Payment: ${viewOrder.paymentMethod}`} size="small" />
                <Chip label={`Status: ${viewOrder.status}`} color={STATUS_COLOR[viewOrder.status]} size="small" />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewOrder(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
