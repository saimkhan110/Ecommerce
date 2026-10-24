// ===== Admin Dashboard - real counts (MUI cards) =====
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { getProducts, getCategories, getAllOrdersAdmin } from '../../services/api.js'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: '—', categories: '—', orders: '—' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [p, c, o] = await Promise.all([getProducts(), getCategories(), getAllOrdersAdmin()])
        if (active) {
          setStats({
            products: p.data.total ?? (p.data.data || []).length,
            categories: c.data.total ?? (c.data.data || []).length,
            orders: o.data.count ?? (o.data.orders || []).length,
          })
        }
      } catch {
        // counts load na ho to '—' hi rehne do
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const cards = [
    { label: 'Categories', value: stats.categories, icon: 'category', color: '#8ecae6' },
    { label: 'Products', value: stats.products, icon: 'inventory_2', color: '#5fa8c9' },
    { label: 'Orders', value: stats.orders, icon: 'receipt_long', color: '#2e7d32' },
  ]

  return (
    <Box className="fade-up">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Overview of your store performance
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.label}
            className="fade-up"
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              animationDelay: `${index * 0.08}s`,
              position: 'relative',
              '&:hover': {
                boxShadow: '0 16px 50px -16px rgba(18, 50, 79, 0.2)',
                borderColor: card.color,
                transform: 'translateY(-4px)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: `linear-gradient(90deg, ${card.color}, ${card.color}aa)`,
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
                    {card.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    sx={{
                      fontFamily: 'var(--font-display)',
                      color: 'primary.main',
                      fontWeight: 700,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {loading ? '—' : card.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2.5,
                    bgcolor: `${card.color}15`,
                    display: 'grid',
                    placeItems: 'center',
                    color: card.color,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 28 }}>
                    {card.icon}
                  </span>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
