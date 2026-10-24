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
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
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
      setSuccess('Order status updated successfully')
      setTimeout(() => setSuccess(''), 2500)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update order status')
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 12 }}>
        <Box className="fade-in" sx={{ textAlign: 'center' }}>
          <CircularProgress size={48} />
          <Typography sx={{ mt: 2, color: 'text.secondary' }}>Loading orders...</Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box className="fade-up">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700, letterSpacing: '-0.02em' }}
          >
            Orders Management
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all customer orders and update their status
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={load}
          startIcon={<span className="material-symbols-outlined">refresh</span>}
          sx={{ borderRadius: 2, px: 3 }}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card
          className="scale-in"
          elevation={0}
          sx={{ textAlign: 'center', py: 10, border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper' }}
        >
          <span className="material-symbols-outlined floaty" style={{ fontSize: 64, opacity: 0.3, color: 'primary.main' }}>
            receipt_long
          </span>
          <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.primary', fontSize: '1.1rem' }}>
            No orders yet
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Orders will appear here once customers place them
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gap: 2.5 }}>
          {orders.map((order, index) => (
            <Card
              key={order._id}
              className="fade-up"
              elevation={0}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                animationDelay: `${index * 0.05}s`,
                '&:hover': {
                  boxShadow: '0 12px 40px -12px rgba(18, 50, 79, 0.15)',
                  borderColor: 'rgba(142, 202, 230, 0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                  <Box sx={{ flex: 1, minWidth: 220 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'primary.main' }}>
                        tag
                      </span>
                      <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}>
                        {order.orderNumber}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(order.createdAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'primary.main',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.9rem',
                      }}
                    >
                      {(order.user?.name || 'U').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {order.user?.name || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.user?.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={order.paymentMethod}
                    variant="outlined"
                    size="small"
                    sx={{ borderRadius: 1.5, fontWeight: 600 }}
                  />
                  <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1.1rem' }}>
                    Rs {Number(order.totalPrice).toLocaleString()}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Select
                      size="small"
                      value={order.status}
                      disabled={updatingId === order._id}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      sx={{
                        minWidth: 150,
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: STATUS_COLOR[s] === 'success' ? '#2e7d32' : STATUS_COLOR[s] === 'error' ? '#d32f2f' : STATUS_COLOR[s] === 'warning' ? '#ed6c02' : STATUS_COLOR[s] === 'info' ? '#0288d1' : '#1976d2',
                              }}
                            />
                            {s}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {updatingId === order._id && <CircularProgress size={20} />}
                  </Box>

                  <Chip
                    label={order.status}
                    color={STATUS_COLOR[order.status] || 'default'}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: 1.5, px: 0.5 }}
                  />
                </Box>

                <Divider />

                <Box sx={{ p: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center', bgcolor: 'rgba(234, 242, 250, 0.3)' }}>
                  <Box sx={{ flex: 1, minWidth: 200 }}>
                    <Typography variant="body2" color="text.secondary">
                      <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {order.items.length}
                      </Box>{' '}
                      item{order.items.length === 1 ? '' : 's'}
                      {' • '}
                      {order.items.slice(0, 2).map((i) => i.name).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </Typography>
                  </Box>
                  <Tooltip title="View full order details">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setViewOrder(order)}
                      startIcon={<span className="material-symbols-outlined" style={{ fontSize: 18 }}>visibility</span>}
                      sx={{ borderRadius: 2 }}
                    >
                      View details
                    </Button>
                  </Tooltip>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Order details dialog */}
      <Dialog
        open={!!viewOrder}
        onClose={() => setViewOrder(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: '#fff', display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <span className="material-symbols-outlined">receipt_long</span>
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Order Details</Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {viewOrder?.orderNumber}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {viewOrder && (
            <Box sx={{ display: 'grid', gap: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'primary.main' }}>
                    person
                  </span>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Customer Information
                  </Typography>
                </Box>
                <Box sx={{ pl: 3, display: 'grid', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 600 }}>{viewOrder.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{viewOrder.user?.email}</Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'primary.main' }}>
                    local_shipping
                  </span>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Shipping Address
                  </Typography>
                </Box>
                <Box sx={{ pl: 3, display: 'grid', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 600 }}>{viewOrder.shippingAddress?.fullName} • {viewOrder.shippingAddress?.phone}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewOrder.shippingAddress?.address}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {viewOrder.shippingAddress?.city}
                    {viewOrder.shippingAddress?.postalCode && `, ${viewOrder.shippingAddress.postalCode}`}
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'primary.main' }}>
                    shopping_bag
                  </span>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Order Items
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  {viewOrder.items.map((item, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 1.5,
                        bgcolor: 'rgba(234, 242, 250, 0.4)',
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Qty: {item.quantity} × Rs {Number(item.price).toLocaleString()}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        Rs {Number(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Total Amount</Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: 'primary.main' }}>
                      Rs {Number(viewOrder.totalPrice).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Chip
                  icon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>payments</span>}
                  label={`Payment: ${viewOrder.paymentMethod}`}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
                <Chip
                  icon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>info</span>}
                  label={`Status: ${viewOrder.status}`}
                  color={STATUS_COLOR[viewOrder.status]}
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                />
                <Chip
                  icon={<span className="material-symbols-outlined" style={{ fontSize: 16 }}>schedule</span>}
                  label={new Date(viewOrder.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  variant="outlined"
                  sx={{ borderRadius: 2 }}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setViewOrder(null)} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
