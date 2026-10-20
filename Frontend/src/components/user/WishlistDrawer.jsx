// ===== Wishlist Drawer - saved products =====
import { useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { useWishlist } from '../../context/WishlistContext'
import { useCart } from '../../context/CartContext'
import { imageUrl } from '../../services/api'

export default function WishlistDrawer({ open, onClose }) {
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [toast, setToast] = useState('')

  const moveToCart = (item) => {
    addToCart(item, 1)
    removeFromWishlist(item._id)
    setToast(`"${item.name}" moved to cart ✨`)
  }

  return (
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: { xs: '88vw', sm: 380 },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'primary.main',
              color: '#fff',
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontFamily: 'var(--font-display)', color: 'secondary.main' }}
            >
              Wishlist
            </Typography>
            <IconButton onClick={onClose} sx={{ color: '#fff' }} aria-label="Close wishlist">
              <span className="material-symbols-outlined">close</span>
            </IconButton>
          </Box>

          {/* Items */}
          <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
            {items.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.4 }}>
                  favorite
                </span>
                <Typography sx={{ mt: 1 }}>Your wishlist is empty</Typography>
              </Box>
            ) : (
              items.map((item) => (
                <Box
                  key={item._id}
                  className="fade-up"
                  sx={{ display: 'flex', gap: 2, py: 1.5, alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
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
                      Rs {Number(item.price).toLocaleString()}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => moveToCart(item)}
                        startIcon={
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                            add_shopping_cart
                          </span>
                        }
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => removeFromWishlist(item._id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
                      delete
                    </span>
                  </IconButton>
                </Box>
              ))
            )}
          </Box>

          {/* Footer */}
          {items.length > 0 && (
            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Button fullWidth onClick={clearWishlist}>
                Clear wishlist
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}
