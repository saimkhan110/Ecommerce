/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      /* ========================================
         COLORS - Aurelia Brand Palette
         ======================================== */
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faf0dd',
          200: '#f4e0bb',
          300: '#ebca8f',
          400: '#e0b05e',
          500: '#D4A537',
          600: '#b8882e',
          700: '#966d28',
          800: '#755324',
          900: '#5d421f',
          950: '#33230f',
        },
        secondary: {
          50: '#fdf8f9',
          100: '#faecf1',
          200: '#f4d6e1',
          300: '#ebbac4',
          400: '#e090a1',
          500: '#D47A8E',
          600: '#b85f71',
          700: '#964a59',
          800: '#753c47',
          900: '#5d3139',
          950: '#33181c',
        },
        accent: {
          50: '#f4f0f6',
          100: '#e8dcef',
          200: '#d2b9df',
          300: '#b78cc9',
          400: '#9d66b0',
          500: '#8B4FA0',
          600: '#753f87',
          700: '#61336e',
          800: '#4e2a57',
          900: '#3d2343',
          950: '#1f1121',
        },
        surface: {
          0: '#FFFFFF',
          50: '#FAFAF9',
          100: '#F5F3F1',
          200: '#E8E4E0',
          300: '#D4CED8',
          400: '#B8B0AD',
          500: '#9A908A',
          600: '#7D726B',
          700: '#5E534C',
          800: '#3D3530',
          900: '#241E1A',
          950: '#120E0C',
        },
        success: {
          light: '#F0FDF4',
          DEFAULT: '#059669',
          dark: '#065F46',
        },
        warning: {
          light: '#FFFAEB',
          DEFAULT: '#D97706',
          dark: '#92400E',
        },
        error: {
          light: '#FEF2F2',
          DEFAULT: '#DC2626',
          dark: '#991B1B',
        },
      },

      /* ========================================
         FONTS
         ======================================== */
      fontFamily: {
        display: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        heading: ['DM Sans', 'Inter', '-apple-system', 'sans-serif'],
        body: ['DM Sans', 'Inter', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },

      /* ========================================
         FONT SIZES
         ======================================== */
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5', letterSpacing: '0' }],
        sm: ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        base: ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.6', letterSpacing: '0' }],
        xl: ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
        '2xl': ['1.5rem', { lineHeight: '1.375', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.025em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.025em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '8xl': ['6rem', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
      },

      /* ========================================
         SPACING
         ======================================== */
      spacing: {
        '0': '0',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },

      /* ========================================
         BORDER RADIUS
         ======================================== */
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        full: '9999px',
        organic: '1.5rem 1rem 1.5rem 1rem / 1rem 1.5rem 1rem 1.5rem',
      },

      /* ========================================
         BOX SHADOWS
         ======================================== */
      boxShadow: {
        '0': 'none',
        '1': '0 1px 2px 0 rgba(18,14,12,0.03), 0 1px 3px 0 rgba(18,14,12,0.02)',
        '2': '0 4px 8px -2px rgba(18,14,12,0.05), 0 2px 4px -2px rgba(18,14,12,0.03)',
        '3': '0 12px 24px -4px rgba(18,14,12,0.08), 0 4px 8px -4px rgba(18,14,12,0.04)',
        '4': '0 24px 48px -8px rgba(18,14,12,0.1), 0 8px 16px -8px rgba(18,14,12,0.05)',
        '5': '0 32px 64px -12px rgba(18,14,12,0.15)',
        'glow-primary': '0 0 60px -15px rgba(212,165,55,0.25)',
        'glow-secondary': '0 0 60px -15px rgba(212,122,142,0.2)',
        'glow-accent': '0 0 60px -15px rgba(139,79,160,0.2)',
        inner: 'inset 0 2px 4px 0 rgba(18,14,12,0.03)',
        'inner-strong': 'inset 0 4px 8px 0 rgba(18,14,12,0.06)',
        'card-hover': '0 20px 40px -12px rgba(18,14,12,0.12), 0 8px 16px -8px rgba(18,14,12,0.06)',
      },

      /* ========================================
         ANIMATIONS
         ======================================== */
      animation: {
        'fade-in': 'fadeIn var(--duration-normal) var(--easing-out)',
        'slide-up': 'slideUp var(--duration-slower) var(--easing-spring-gentle)',
        'slide-down': 'slideDown var(--duration-slower) var(--easing-spring-gentle)',
        'slide-left': 'slideLeft var(--duration-slower) var(--easing-spring-gentle)',
        'slide-right': 'slideRight var(--duration-slower) var(--easing-spring-gentle)',
        'scale-in': 'scaleIn var(--duration-normal) var(--easing-spring)',
        'scale-in-spring': 'scaleInSpring var(--duration-entrance) var(--easing-spring)',
        'bounce-in': 'bounceIn var(--duration-slower) var(--easing-spring)',
        shimmer: 'shimmer 2.5s infinite linear',
        float: 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        rotate: 'rotate 1s linear infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        blink: 'blink 1.5s ease-in-out infinite',
        marquee: 'marquee 20s linear infinite',
        entrance: 'slideUp var(--duration-entrance) var(--easing-expo-out)',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleInSpring: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '60%': { opacity: '1', transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '60%': { opacity: '1', transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%': { transform: 'translateY(-20px) rotate(1deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,165,55,0)' },
          '50%': { boxShadow: '0 0 30px -5px rgba(212,165,55,0.4)' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0) rotate(0deg)' },
          '40%': { opacity: '1', transform: 'scale(1) rotate(90deg)' },
          '80%': { opacity: '0', transform: 'scale(0) rotate(180deg)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      /* ========================================
         TRANSITIONS
         ======================================== */
      transitionDuration: {
        instant: '0ms',
        fast: '150ms',
        normal: '250ms',
        slow: '350ms',
        slower: '500ms',
        slowest: '700ms',
        entrance: '800ms',
      },
      transitionTimingFunction: {
        linear: 'linear',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring-gentle': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'spring-sharp': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'expo-in-out': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },

      /* ========================================
         BACKGROUND IMAGES (Gradients)
         ======================================== */
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #D4A537 0%, #C8962E 50%, #D4A537 100%)',
        'gradient-primary-hover': 'linear-gradient(135deg, #C8962E 0%, #B8882E 50%, #C8962E 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #D47A8E 0%, #C86A7E 100%)',
        'gradient-accent': 'linear-gradient(135deg, #8B4FA0 0%, #753F87 100%)',
        'gradient-surface': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAF9 100%)',
        'gradient-hero': 'linear-gradient(145deg, #FDFAF6 0%, #FDF8F9 40%, #F4F0F6 100%)',
        'gradient-card': 'linear-gradient(145deg, #FFFFFF 0%, #FAFAF9 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(212,165,55,0.12) 0%, transparent 70%)',
        'gradient-glow-secondary': 'radial-gradient(ellipse at center, rgba(212,122,142,0.1) 0%, transparent 70%)',
        'gradient-glow-accent': 'radial-gradient(ellipse at center, rgba(139,79,160,0.1) 0%, transparent 70%)',
        'gradient-shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        'gradient-text': 'linear-gradient(135deg, #241E1A 0%, #5E534C 100%)',
        'gradient-text-gold': 'linear-gradient(135deg, #D4A537 0%, #F0D9A5 50%, #D4A537 100%)',
      },

      /* ========================================
         Z-INDEX
         ======================================== */
      zIndex: {
        hide: '-1',
        base: '0',
        dropdown: '1000',
        sticky: '1100',
        modal: '1300',
        popover: '1400',
        tooltip: '1500',
        toast: '1700',
      },

      /* ========================================
         CONTAINER
         ======================================== */
      container: {
        center: true,
        padding: {
          DEFAULT: '1.75rem',
          sm: '2rem',
          lg: '2.5rem',
          xl: '3rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1320px',
        },
      },

      /* ========================================
         SCREENS
         ======================================== */
      screens: {
        xs: '320px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}