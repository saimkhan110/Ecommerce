// ===== User Home - categories + products grid + add to cart =====
import { useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { getProducts, getCategories, imageUrl } from '../../services/api.js'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'

export default function Home() {
  const { addToCart } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCat, setActiveCat] = useState('All') // filhal selected category
  const [toast, setToast] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [prodRes, catRes] = await Promise.all([getProducts(), getCategories()])
        if (!active) return
        setProducts((prodRes.data.data || []).filter((p) => p.isActive !== false))
        setCategories((catRes.data.data || []).filter((c) => c.isActive !== false))
      } catch {
        if (active) setError('Could not load data. Is the backend running?')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  // active category ke hisaab se products filter
  const visible =
    activeCat === 'All'
      ? products
      : products.filter((p) => p.category === activeCat)

  const handleAdd = (product) => {
    addToCart(product)
    setToast(`"${product.name}" added to cart ✨`)
  }

  const handleWishlist = (product) => {
    const wasSaved = isWishlisted(product._id)
    toggleWishlist(product)
    setToast(wasSaved ? 'Removed from wishlist' : `"${product.name}" added to wishlist ♥`)
  }

  return (
    <>
      {/* Hero */}
      <Box
        className="fade-up frost-gradient"
        sx={{ position: 'relative', textAlign: 'center', px: 3, pt: 8, pb: 6, overflow: 'hidden' }}
      >
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <span className="material-symbols-outlined floaty" style={{ color: '#5fa8c9' }}>
            ac_unit
          </span>
          <Typography
            variant="overline"
            sx={{ color: '#3d7ea6', letterSpacing: 4, fontWeight: 700 }}
          >
            Winter Furniture Collection
          </Typography>
          <span className="material-symbols-outlined floaty" style={{ color: '#5fa8c9' }}>
            ac_unit
          </span>
        </Box>
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'var(--font-display)',
            color: 'primary.main',
            fontWeight: 700,
            mt: 1,
          }}
        >
          Elegant Spaces. Better Living.
        </Typography>
        <Typography sx={{ color: 'text.secondary', mt: 1 }}>
          Handpicked pieces to warm your home this winter.
        </Typography>
      </Box>

      <Box sx={{ maxWidth: 1152, mx: 'auto', px: 3, pb: 10 }}>
        {/* ===== Categories - sirf naam, click par uske products ===== */}
        {!loading && !error && categories.length > 0 && (
          <Box sx={{ mb: 6 }} className="fade-up">
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}
            >
              Categories
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Chip
                label="All"
                onClick={() => setActiveCat('All')}
                color={activeCat === 'All' ? 'primary' : 'default'}
                variant={activeCat === 'All' ? 'filled' : 'outlined'}
                sx={{ fontWeight: 600, px: 1 }}
              />

              {categories.map((cat) => (
                <Chip
                  key={cat._id}
                  label={cat.name}
                  onClick={() => setActiveCat(cat.name)}
                  color={activeCat === cat.name ? 'primary' : 'default'}
                  variant={activeCat === cat.name ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600, px: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* ===== Products ===== */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 600, color: 'primary.main' }}
          >
            {activeCat === 'All' ? 'Our Collection' : activeCat}
          </Typography>
          {activeCat !== 'All' && (
            <Button size="small" onClick={() => setActiveCat('All')}>
              Clear filter ✕
            </Button>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : visible.length === 0 ? (
          <Alert severity="info">
            {activeCat === 'All'
              ? 'No products available yet. Add a product from the admin panel.'
              : 'No products in this category.'}
          </Alert>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
            }}
          >
            {visible.map((product, i) => (
              <Card
                key={product._id}
                className="fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
                elevation={0}
                sx={{
                  position: 'relative',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform .2s, box-shadow .2s',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
                }}
              >
                {/* Wishlist heart */}
                <IconButton
                  onClick={() => handleWishlist(product)}
                  aria-label="Toggle wishlist"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 2,
                    bgcolor: 'rgba(255,255,255,.9)',
                    '&:hover': { bgcolor: '#fff' },
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: 20,
                      color: isWishlisted(product._id) ? '#d32f2f' : '#555',
                      fontVariationSettings: isWishlisted(product._id)
                        ? "'FILL' 1"
                        : "'FILL' 0",
                    }}
                  >
                    favorite
                  </span>
                </IconButton>

                <CardActionArea component={RouterLink} to={`/product/${product._id}`}>
                  {imageUrl(product.image) ? (
                    <CardMedia
                      component="img"
                      image={imageUrl(product.image)}
                      alt={product.name}
                      sx={{ aspectRatio: '4 / 3', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ aspectRatio: '4 / 3', bgcolor: 'grey.100', display: 'grid', placeItems: 'center' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 44, opacity: 0.35 }}>
                        chair
                      </span>
                    </Box>
                  )}

                  <CardContent>
                    <Chip
                      label={product.category || 'Uncategorized'}
                      size="small"
                      sx={{
                        mb: 1,
                        bgcolor: 'rgba(142,202,230,.22)',
                        color: 'primary.main',
                        fontWeight: 600,
                      }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }} noWrap>
                      {product.name}
                    </Typography>
                    <Typography sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                      Rs {Number(product.price).toLocaleString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>

                {/* Add to cart - card ke bahar (link ke andar nahi) */}
                <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleAdd(product)}
                    startIcon={
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    }
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Add to cart feedback */}
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
