import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import './index.css'
import App from './App.jsx'

// MUI theme - site ke brand colors (WINTER: deep frost blue + ice + snow)
const theme = createTheme({
  palette: {
    primary: { main: '#12324f', dark: '#0b2239', light: '#24507a' },
    secondary: { main: '#8ecae6', dark: '#5fa8c9', light: '#cfe8f5' },
    background: { default: '#eaf2fa', paper: '#ffffff' },
    text: { primary: '#0f2233', secondary: '#4a6274' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
