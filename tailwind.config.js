/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core dark surfaces — deep navy palette
        'dark-bg':       '#080E1A',
        'dark-base':     '#080E1A',
        'dark-surface':  '#0D1829',
        'dark-elevated': '#122035',

        // Primary navy palette (Sentinel's Vault)
        navy: {
          DEFAULT: '#1B263B',
          mid:     '#415A77',
          light:   '#778DA9',
          bg:      '#080E1A',
        },

        // Accent blue
        blue: {
          DEFAULT: '#0077B6',
          bright:  '#0096C7',
          deep:    '#005F8E',
          glow:    'rgba(0,119,182,0.35)',
          light:   '#90CAF9',
        },

        // Accent palette (unchanged functional colors)
        'neon-green': '#10B981',
        'neon-rose':  '#F43F5E',
        'neon-amber': '#F59E0B',
        'neon-cyan':  '#06B6D4',

        // Legacy aliases
        sidebar: '#080E1A',
        accent: {
          DEFAULT: '#0077B6',
          hover:   '#005F8E',
          light:   'rgba(0,119,182,0.15)',
        },
      },
      fontFamily: {
        sans:     ['Inter', 'system-ui', 'sans-serif'],
        display:  ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'blue-glow':         'radial-gradient(ellipse at top, rgba(0,119,182,0.3) 0%, transparent 60%)',
        'sidebar-gradient':  'linear-gradient(180deg, #080E1A 0%, #0D1829 50%, #080E1A 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'button-gradient':   'linear-gradient(135deg, #0077B6 0%, #1B263B 100%)',
        'button-hover':      'linear-gradient(135deg, #0096C7 0%, #415A77 100%)',
        'stat-gradient-1':   'linear-gradient(135deg, rgba(0,119,182,0.2) 0%, rgba(65,90,119,0.1) 100%)',
        'stat-gradient-2':   'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 100%)',
        'stat-gradient-3':   'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(244,63,94,0.15) 100%)',
        'stat-gradient-4':   'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(245,158,11,0.1) 100%)',
      },
      boxShadow: {
        'glass':       '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-hover': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        'blue-glow':   '0 0 30px rgba(0,119,182,0.4)',
        'blue-sm':     '0 0 12px rgba(0,119,182,0.25)',
        'card':        '0 2px 20px rgba(0,0,0,0.3)',
        'modal':       '0 25px 80px rgba(0,0,0,0.7)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
