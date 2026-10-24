// ===== Admin Dashboard - real counts (MUI cards) =====
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { getProducts, getCategories, getAllOrdersAdmin } from '../../services/api.js'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: '—', categories: '—', orders: '—' })

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
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const cards = [
    { label: 'Categories', value: stats.categories },
    { label: 'Products', value: stats.products },
    { label: 'Orders', value: stats.orders },
  ]

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ fontFamily: 'var(--font-display)', color: 'primary.main', fontWeight: 700 }}
      >
        Dashboard
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          mt: 3,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
        }}
      >
        {cards.map((card) => (
          <Card
            key={card.label}
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}
          >
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.label}
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'var(--font-display)',
                  color: 'primary.main',
                  mt: 1,
                }}
              >
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  )
}
