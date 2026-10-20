// ===== Auth shell - premium split-screen layout for Login / Register =====
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Snowfall from './Snowfall.jsx'

const FEATURES = [
  { icon: 'local_shipping', text: 'Fast, free-shipping furniture delivery' },
  { icon: 'verified', text: 'Curated, premium winter collection' },
  { icon: 'favorite', text: 'Save favourites & build your wishlist' },
]

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <Box
      className="frost-gradient"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
      }}
    >
      {/* Decorative blurred blobs (VIP glow) */}
      <Box
        className="floaty"
        sx={{
          position: 'absolute',
          width: 380,
          height: 380,
          borderRadius: '50%',
          top: -120,
          right: -80,
          background: 'radial-gradient(circle, rgba(142,202,230,.55), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />
      <Box
        className="floaty"
        sx={{
          position: 'absolute',
          width: 320,
          height: 320,
          borderRadius: '50%',
          bottom: -120,
          left: -60,
          background: 'radial-gradient(circle, rgba(18,50,79,.35), transparent 70%)',
          filter: 'blur(10px)',
        }}
      />

      {/* ===== Left brand panel ===== */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2,
          width: '46%',
          p: 8,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg, #0b2239 0%, #12324f 55%, #24507a 100%)',
          color: '#fff',
        }}
      >
        <Snowfall contained />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <span
              className="material-symbols-outlined floaty"
              style={{ color: '#8ecae6', fontSize: 40 }}
            >
              ac_unit
            </span>
            <Typography
              sx={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                letterSpacing: 3,
                color: '#8ecae6',
              }}
            >
              ANTIQOR
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{ fontFamily: 'var(--font-display)', fontWeight: 700, lineHeight: 1.15 }}
          >
            Elegant spaces,
            <br />
            winter warmth.
          </Typography>

          <Typography sx={{ color: 'rgba(255,255,255,.72)', mt: 2, maxWidth: 380 }}>
            Sign in to explore handpicked furniture crafted to make your home feel like you.
          </Typography>

          <Box sx={{ mt: 4, display: 'grid', gap: 1.5 }}>
            {FEATURES.map((f) => (
              <Box key={f.text} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <span className="material-symbols-outlined" style={{ color: '#8ecae6' }}>
                  {f.icon}
                </span>
                <Typography sx={{ color: 'rgba(255,255,255,.85)' }}>{f.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* ===== Right form panel ===== */}
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          placeItems: 'center',
          px: { xs: 2, md: 6 },
          py: 6,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Card
          className="fade-up"
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 440,
            borderRadius: 4,
            overflow: 'hidden',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 24px 60px rgba(18,50,79,.18)',
            bgcolor: 'background.paper',
          }}
        >
          {/* Card header */}
          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              px: 4,
              py: 3.5,
              background: 'linear-gradient(135deg, #0b2239 0%, #24507a 100%)',
              color: '#fff',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span className="material-symbols-outlined" style={{ color: '#8ecae6' }}>
                ac_unit
              </span>
              <Typography
                variant="overline"
                sx={{ color: '#8ecae6', letterSpacing: 3, fontWeight: 700 }}
              >
                ANTIQOR
              </Typography>
            </Box>
            <Typography
              variant="h5"
              sx={{ fontFamily: 'var(--font-display)', fontWeight: 600, mt: 0.5 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.72)' }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Form body */}
          <Box sx={{ p: 4 }}>{children}</Box>

          {/* Footer link */}
          {footer && <Box sx={{ px: 4, pb: 4, mt: -1, textAlign: 'center' }}>{footer}</Box>}
        </Card>
      </Box>
    </Box>
  )
}
