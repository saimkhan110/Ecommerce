// ===== Navbar - MUI AppBar + login state + cart =====
import { useEffect, useRef, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import CartDrawer from './CartDrawer.jsx'
import WishlistDrawer from './WishlistDrawer.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const [anchorEl, setAnchorEl] = useState(null) // avatar dropdown
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const navigate = useNavigate()

  // Cart count badhne par icon ko bounce karo
  const prevCount = useRef(count)
  useEffect(() => {
    if (count > prevCount.current) {
      setCartBump(true)
      const t = setTimeout(() => setCartBump(false), 500)
      prevCount.current = count
      return () => clearTimeout(t)
    }
    prevCount.current = count
  }, [count])

  const handleLogout = () => {
    logout()
    setAnchorEl(null)
    navigate('/')
  }

  const iconSx = { color: 'rgba(255,255,255,.85)', '&:hover': { color: '#fff' } }

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'primary.main' }}>
        <Toolbar
          sx={{ maxWidth: 1152, width: '100%', mx: 'auto', gap: 1, px: { xs: 2, md: 3 } }}
        >
          {/* Logo */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexGrow: 1,
              textDecoration: 'none',
            }}
          >
            <span className="material-symbols-outlined floaty" style={{ color: '#8ecae6' }}>
              ac_unit
            </span>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 20,
                color: 'secondary.main',
              }}
            >
              ANTIQOR FURNITURE
            </Typography>
          </Box>

          <Button component={RouterLink} to="/" sx={{ color: '#fff' }}>
            Home
          </Button>

          <IconButton sx={iconSx} aria-label="Search">
            <span className="material-symbols-outlined">search</span>
          </IconButton>

          {/* Wishlist + count badge */}
          <IconButton
            sx={iconSx}
            aria-label="Wishlist"
            onClick={() => setWishOpen(true)}
          >
            <Badge badgeContent={wishCount} color="secondary" overlap="circular">
              <span className="material-symbols-outlined">favorite</span>
            </Badge>
          </IconButton>

          {/* Cart + count badge */}
          <IconButton
            sx={iconSx}
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
          >
            <Badge badgeContent={count} color="secondary" overlap="circular">
              <span className={`material-symbols-outlined ${cartBump ? 'cart-bump' : ''}`}>
                shopping_cart
              </span>
            </Badge>
          </IconButton>

          {/* Account: login ya avatar dropdown */}
          {user ? (
            <>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Account menu"
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: 'secondary.main',
                    color: 'primary.main',
                    fontWeight: 700,
                  }}
                >
                  {(user.name || 'U').charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem disabled sx={{ opacity: '1 !important' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </MenuItem>

                {user.role === 'admin' && (
                  <MenuItem
                    component={RouterLink}
                    to="/admin"
                    onClick={() => setAnchorEl(null)}
                  >
                    <span className="material-symbols-outlined" style={{ marginRight: 8 }}>
                      dashboard
                    </span>
                    Admin Dashboard
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>
                  <span className="material-symbols-outlined" style={{ marginRight: 8 }}>
                    logout
                  </span>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              startIcon={<span className="material-symbols-outlined">person</span>}
              sx={{
                color: 'secondary.main',
                borderColor: 'secondary.main',
                '&:hover': { color: '#fff', borderColor: '#fff' },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <WishlistDrawer open={wishOpen} onClose={() => setWishOpen(false)} />
    </>
  )
}
