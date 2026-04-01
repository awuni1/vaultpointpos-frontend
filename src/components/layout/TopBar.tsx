import { Bell, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

interface TopBarProps {
  title: string
}

export default function TopBar({ title }: TopBarProps) {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <header
      className="h-16 px-6 flex items-center justify-between shrink-0 relative"
      style={{
        background: 'rgba(7,9,18,0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Subtle top glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.3) 50%, transparent 100%)',
        }}
      />

      {/* Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-1.5 h-6 rounded-full"
          style={{ background: 'linear-gradient(180deg, #7C3AED 0%, #3B82F6 100%)' }}
        />
        <h1 className="text-base font-bold text-white tracking-tight">{title}</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('/products')}
          title="Search products"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <Search size={14} />
        </button>

        <button
          type="button"
          onClick={() => navigate('/notifications')}
          title="Notifications"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 relative"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'
            ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
          }}
        >
          <Bell size={14} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: '#F43F5E', boxShadow: '0 0 6px rgba(244,63,94,0.7)' }}
          />
        </button>

        <div className="flex items-center gap-2.5 pl-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)',
              boxShadow: '0 2px 12px rgba(124,58,237,0.4)',
            }}
          >
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-white leading-tight">{user?.full_name}</p>
            <p className="text-[10px] text-slate-500 capitalize font-medium">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
