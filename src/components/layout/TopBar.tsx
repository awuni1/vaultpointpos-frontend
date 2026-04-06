import { Bell, Search, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps { title: string }

export default function TopBar({ title: _title }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      style={{
        height: 56, padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'white',
        borderBottom: '1px solid #E2E8F0',
        flexShrink: 0,
        gap: 16,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: '#1B263B',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="4" width="20" height="18" rx="3.5" stroke="white" strokeWidth="1.8"/>
            <circle cx="13" cy="13" r="4" stroke="white" strokeWidth="1.8"/>
            <circle cx="13" cy="13" r="1.8" fill="white"/>
            <line x1="13" y1="9" x2="13" y2="6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="17" y1="13" x2="19.5" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <span
          style={{
            fontFamily: 'Manrope, Inter, sans-serif',
            fontWeight: 800, fontSize: 13,
            letterSpacing: '0.06em', color: '#1B263B',
          }}
        >
          VaultPoint POS
        </span>
      </div>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 380, position: 'relative' }}>
        <Search size={13} color="#94A3B8" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        <input
          placeholder="Search analytics..."
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: '7px 12px 7px 32px',
            background: '#F5F7FA',
            border: '1px solid #E2E8F0',
            borderRadius: 9, fontSize: 12,
            color: '#1B263B', outline: 'none',
            fontFamily: 'Inter, sans-serif',
          }}
          onFocus={e => { e.target.style.borderColor = '#1B263B'; e.target.style.background = 'white' }}
          onBlur={e =>  { e.target.style.borderColor = '#E2E8F0'; e.target.style.background = '#F5F7FA' }}
        />
      </div>

      {/* Right actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {[
          { icon: Bell,     action: () => navigate('/notifications'), badge: true },
          { icon: Settings, action: () => navigate('/settings'),      badge: false },
        ].map(({ icon: Icon, action, badge }, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={action}
              style={{
                width: 32, height: 32, borderRadius: 8,
                background: '#F5F7FA', border: '1px solid #E2E8F0',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#415A77', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#1B263B'; (e.currentTarget as HTMLElement).style.color = '#1B263B' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
            >
              <Icon size={14} />
            </button>
            {badge && (
              <span style={{ position: 'absolute', top: 3, right: 3, width: 7, height: 7, borderRadius: '50%', background: '#F43F5E', border: '1.5px solid white' }} />
            )}
          </div>
        ))}

      </div>
    </header>
  )
}
