/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Core dark surfaces
        'dark-bg':       '#07091299',
        'dark-base':     '#070912',
        'dark-surface':  '#0D1526',
        'dark-elevated': '#131D35',
        'dark-border':   'rgba(255,255,255,0.07)',

        // Primary violet
        violet: {
          DEFAULT: '#7C3AED',
          bright:  '#8B5CF6',
          deep:    '#5B21B6',
          glow:    'rgba(124,58,237,0.35)',
        },

        // Accent palette
        'neon-blue':  '#3B82F6',
        'neon-cyan':  '#06B6D4',
        'neon-green': '#10B981',
        'neon-rose':  '#F43F5E',
        'neon-amber': '#F59E0B',

        // Legacy aliases kept for compatibility
        sidebar: '#0D0A1E',
        accent: {
          DEFAULT: '#7C3AED',
          hover:   '#6D28D9',
          light:   'rgba(124,58,237,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'violet-glow':       'radial-gradient(ellipse at top, rgba(109,40,217,0.3) 0%, transparent 60%)',
        'sidebar-gradient':  'linear-gradient(180deg, #0D0A1E 0%, #100C24 50%, #0A0E1A 100%)',
        'card-gradient':     'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        'button-gradient':   'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        'button-hover':      'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
        'stat-gradient-1':   'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(59,130,246,0.1) 100%)',
        'stat-gradient-2':   'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(16,185,129,0.1) 100%)',
        'stat-gradient-3':   'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(244,63,94,0.15) 100%)',
        'stat-gradient-4':   'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(245,158,11,0.1) 100%)',
      },
      boxShadow: {
        'glass':       '0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-hover': '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)',
        'violet-glow': '0 0 30px rgba(124,58,237,0.4)',
        'violet-sm':   '0 0 12px rgba(124,58,237,0.25)',
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
