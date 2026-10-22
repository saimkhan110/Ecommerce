// ===== Cart Drawer - live backend cart (API based) =====
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'
import Collapse from '@mui/material/Collapse'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import { useCart } from '../../context/CartContext'
import { imageUrl } from '../../services/api'

const FREE_SHIPPING = 50000 // Rs — is se upar shipping free
const SHIPPING_FEE = 2500 // Rs — free-shipping threshold se neeche flat fee

export default function CartDrawer({ open, onClose }) {
  const { items, count, total, updateQty, removeItem, clearCart } = useCart()
  const [busyId, setBusyId] = useState(null) // jis item par kaam chal raha hai
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Backend ka error message uthao (user ko asli reason dikhe)
  const errMsg = (err) =>
    err?.response?.data?.message || 'Something went wrong. Please try again.'

  const handleQty = async (item, qty) => {
    if (qty < 1) return
    setBusyId(item.productId)
    setError('')
    try {
      await updateQty(item.productId, qty)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleRemove = async (item) => {
    setBusyId(item.productId)
    setError('')
    try {
      await removeItem(item.productId)
    } catch (err) {
      setError(errMsg(err))
    } finally {
      setBusyId(null)
    }
  }

  const handleClear = async () => {
    setError('')
    try {
      await clearCart()
    } catch (err) {
      setError(errMsg(err))
    }
  }

  const handleCheckout = () => {
    onClose()
    navigate('/checkout')
  }

  const remaining = Math.max(0, FREE_SHIPPING - total)
  const progress = Math.min(100, (total / FREE_SHIPPING) * 100)
  const goalReached = remaining === 0
  const shipping = goalReached ? 0 : SHIPPING_FEE
  const grandTotal = total + shipping

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderTopLeftRadius: { sm: 20 }, borderBottomLeftRadius: { sm: 20 } },
      }}
    >
      <Box
        sx={{
          width: { xs: '90vw', sm: 400 },
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'primary.main',
            color: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <span className="material-symbols-outlined" style={{ color: '#8ecae6' }}>
              shopping_bag
            </span>
            <Typography
              variant="h6"
              sx={{ fontFamily: 'var(--font-display)', color: 'secondary.main' }}
            >
              Your Cart
            </Typography>
            {count > 0 && (
              <Chip
                label={count}
                size="small"
                className="pop"
                sx={{ bgcolor: 'secondary.main', color: 'primary.main', fontWeight: 700 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#fff' }} aria-label="Close cart">
            <span className="material-symbols-outlined">close</span>
          </IconButton>
        </Box>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <Box sx={{ px: 3, py: 2, bgcolor: 'background.paper' }}>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              {goalReached ? (
                <span style={{ color: '#2e7d32' }}>🎉 Free shipping unlocked!</span>
              ) : (
                <>
                  Add{' '}
                  <b>Rs {remaining.toLocaleString()}</b> more for free shipping
                </>
              )}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5,
                bgcolor: 'rgba(18,50,79,.12)',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 5,
                  backgroundColor: goalReached ? '#2e7d32' : 'secondary.main',
                  transition: 'transform .5s ease, background-color .3s',
                },
              }}
            />
          </Box>
        )}

        {/* Error (stock / validation) */}
        {error && (
          <Box sx={{ px: 3, py: 1.5, bgcolor: 'error.main', color: '#fff' }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        {/* Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          {items.length === 0 ? (
            <Box
              className="fade-up"
              sx={{ textAlign: 'center', py: 9, px: 2, color: 'text.secondary' }}
            >
              <span
                className="material-symbols-outlined floaty"
                style={{ fontSize: 56, opacity: 0.4 }}
              >
                shopping_bag
              </span>
              <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.primary' }}>
                Your cart is empty
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Add some beautiful pieces to get started.
              </Typography>
              <Button variant="outlined" sx={{ mt: 3 }} onClick={onClose}>
                Continue shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'grid', gap: 1.5 }}>
              {items.map((item) => (
                <Collapse key={item.productId} in timeout={260}>
                  <Card
                    className="fade-up"
                    elevation={0}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 3,
                      p: 1.5,
                      display: 'flex',
                      gap: 1.5,
                      transition: 'box-shadow .2s, border-color .2s',
                      '&:hover': { boxShadow: 3, borderColor: 'secondary.main' },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        width: 68,
                        height: 68,
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
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform .3s',
                            '&:hover': { transform: 'scale(1.08)' },
                          }}
                        />
                      ) : (
                        <span className="material-symbols-outlined" style={{ opacity: 0.35 }}>
                          chair
                        </span>
                      )}
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {item.name}
                        </Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemove(item)}
                          disabled={busyId === item.productId}
                          aria-label={`Remove ${item.name}`}
                          sx={{ mt: -0.5, mr: -0.5 }}
                        >
                          {busyId === item.productId ? (
                            <CircularProgress size={14} color="inherit" />
                          ) : (
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                              close
                            </span>
                          )}
                        </IconButton>
                      </Box>

                      <Typography variant="caption" color="text.secondary">
                        Rs {Number(item.price).toLocaleString()} each
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mt: 0.5,
                        }}
                      >
                        {/* Qty stepper */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 5,
                            bgcolor: '#fff',
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item, item.quantity - 1)}
                            disabled={item.quantity <= 1 || busyId === item.productId}
                            aria-label="Decrease quantity"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                              remove
                            </span>
                          </IconButton>
                          <Typography
                            key={item.quantity}
                            className="pop"
                            sx={{
                              minWidth: 20,
                              textAlign: 'center',
                              fontSize: 14,
                              fontWeight: 600,
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item, item.quantity + 1)}
                            disabled={busyId === item.productId}
                            aria-label="Increase quantity"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                              add
                            </span>
                          </IconButton>
                        </Box>

                        <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>
                          Rs {Number(item.price * item.quantity).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Collapse>
              ))}
            </Box>
          )}
        </Box>

        {/* Footer / totals */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 2.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2">Rs {Number(total).toLocaleString()}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" color="text.secondary">
                Shipping
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: goalReached ? 'success.main' : 'text.primary', fontWeight: 600 }}
              >
                {goalReached ? 'Free' : `Rs ${shipping.toLocaleString()}`}
              </Typography>
            </Box>

            <Divider sx={{ mb: 1.5 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography sx={{ fontWeight: 700, color: 'primary.main', fontSize: 18 }}>
                Rs {Number(grandTotal).toLocaleString()}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              className="pop"
              onClick={handleCheckout}
              startIcon={<span className="material-symbols-outlined">checkout</span>}
            >
              Checkout
            </Button>
            <Button fullWidth sx={{ mt: 1 }} onClick={handleClear}>
              Clear cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}
