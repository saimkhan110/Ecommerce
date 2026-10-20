// ===== Product Detail - details + add to cart =====
import { useEffect, useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { getProduct, imageUrl } from '../../services/api.js'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await getProduct(id)
        if (active) setProduct(res.data.data)
      } catch (err) {
        if (active) setError(err.response?.data?.message || 'Product not found')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [id])

  const handleAdd = () => {
    addToCart(product, qty)
    setToast(`"${product.name}" added to cart ✨`)
  }

  const handleWishlist = () => {
    const wasSaved = isWishlisted(product._id)
    toggleWishlist(product)
    setToast(wasSaved ? 'Removed from wishlist' : `"${product.name}" added to wishlist ♥`)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !product) {
    return (
      <Box sx={{ maxWidth: 700, mx: 'auto', px: 3, py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button component={RouterLink} to="/" variant="contained">
          Back to collection
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 6 }}>
      <Button
        component={RouterLink}
        to="/"
        startIcon={<span className="material-symbols-outlined">arrow_back</span>}
        sx={{ mb: 3 }}
      >
        Back to collection
      </Button>

      <Box
        className="fade-up"
        sx={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          alignItems: 'start',
        }}
      >
        {imageUrl(product.image) ? (
          <Box
            component="img"
            src={imageUrl(product.image)}
            alt={product.name}
            sx={{
              width: '100%',
              borderRadius: 3,
              objectFit: 'cover',
              aspectRatio: '4 / 3',
              boxShadow: 3,
            }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: 'grey.100',
              aspectRatio: '4 / 3',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 56, opacity: 0.35 }}>
              chair
            </span>
          </Box>
        )}

        <Box>
          <Chip
            label={product.category || 'Uncategorized'}
            sx={{
              bgcolor: 'rgba(142,202,230,.22)',
              color: 'primary.main',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'var(--font-display)',
              color: 'primary.main',
              fontWeight: 700,
              mt: 2,
            }}
          >
            {product.name}
          </Typography>
          <Typography variant="h5" sx={{ color: 'secondary.main', fontWeight: 700, mt: 1 }}>
            Rs {Number(product.price).toLocaleString()}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 3 }}>
            {product.description || 'A considered addition to your space.'}
          </Typography>
          <Typography
            sx={{
              mt: 2,
              fontWeight: 600,
              color: product.stock > 0 ? 'success.main' : 'error.main',
            }}
          >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Typography>

          {/* Qty + Add to cart */}
          {product.stock > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <IconButton onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  <span className="material-symbols-outlined">remove</span>
                </IconButton>
                <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 600 }}>
                  {qty}
                </Typography>
                <IconButton
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase"
                >
                  <span className="material-symbols-outlined">add</span>
                </IconButton>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleAdd}
                startIcon={<span className="material-symbols-outlined">add_shopping_cart</span>}
              >
                Add to Cart
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={handleWishlist}
                startIcon={
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: isWishlisted(product._id) ? '#d32f2f' : 'inherit',
                      fontVariationSettings: isWishlisted(product._id)
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                }
              >
                {isWishlisted(product._id) ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </Box>
          )}

          {/* Out of stock par bhi wishlist allowed */}
          {product.stock <= 0 && (
            <Box sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleWishlist}
                startIcon={
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: isWishlisted(product._id) ? '#d32f2f' : 'inherit',
                      fontVariationSettings: isWishlisted(product._id)
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                }
              >
                {isWishlisted(product._id) ? 'Wishlisted' : 'Add to Wishlist'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      <Snackbar
        open={!!toast}
        autoHideDuration={2000}
        onClose={() => setToast('')}
        message={toast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  )
}
