import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, Users, Receipt,
  Clock, Wallet, Tag, Target,
  Shield, Settings, LogOut, ChevronDown, ChevronRight,
  Boxes, Bell,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { logout } from '../../api/auth'

// Which roles can see each route
const ROLE_ROUTES: Record<string, string[]> = {
  cashier: ['/pos', '/sales', '/customers', '/vouchers'],
  manager: [
    '/dashboard', '/pos', '/products', '/categories', '/inventory',
    '/sales', '/customers', '/payments', '/vouchers', '/reports',
    '/branches', '/shifts', '/expenses', '/suppliers',
    '/staff', '/targets', '/forecasting', '/notifications',
  ],
  admin: ['*'],
}

function canSee(role: string | undefined, path: string): boolean {
  if (!role) return false
  const allowed = ROLE_ROUTES[role]
  if (!allowed) return false
  if (allowed[0] === '*') return true
  return allowed.includes(path)
}

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/pos',       icon: ShoppingCart,    label: 'Point of Sale' },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/products',   icon: Package, label: 'Products' },
      { to: '/categories', icon: Boxes,   label: 'Categories' },
      { to: '/inventory',  icon: Boxes,   label: 'Inventory' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/sales',     icon: Receipt, label: 'Sales History' },
      { to: '/customers', icon: Users,   label: 'Customers' },
      { to: '/vouchers',  icon: Tag,     label: 'Vouchers' },
      { to: '/payments',  icon: Wallet,  label: 'Payments' },
    ],
  },
  {
    label: 'Operations',
    items: [
      // { to: '/branches',  icon: Building2, label: 'Branches' },
      { to: '/shifts',    icon: Clock,     label: 'Shifts' },
      { to: '/expenses',  icon: Wallet,    label: 'Expenses' },
      // { to: '/suppliers', icon: Truck,     label: 'Suppliers' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { to: '/reports',     icon: BarChart3,  label: 'Reports' },
      { to: '/targets',     icon: Target,     label: 'Targets' },
      // { to: '/forecasting', icon: TrendingUp, label: 'Forecasting' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/staff',        icon: Users,    label: 'Staff' },
      { to: '/notifications',icon: Bell,     label: 'Notifications' },
      { to: '/audit',        icon: Shield,   label: 'Audit Logs' },
      // { to: '/integrations', icon: Plug,     label: 'Integrations' },
      { to: '/settings',     icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token') || ''
      await logout(refresh)
    } finally {
      logoutStore()
      navigate('/login')
    }
  }

  const toggle = (label: string) =>
    setCollapsed(prev => ({ ...prev, [label]: !prev[label] }))

  // Filter groups — skip items the role can't access, skip empty groups
  const visibleGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => canSee(user?.role, item.to)),
    }))
    .filter(group => group.items.length > 0)

  return (
    <aside className="sidebar-shell w-60 shrink-0 flex flex-col h-screen overflow-y-auto relative">
      <div className="sidebar-top-glow absolute top-0 left-0 right-0 h-40 pointer-events-none" />

      {/* Logo */}
      <div className="sidebar-logo-border relative px-5 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="sidebar-logo-icon w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 26 26" fill="none">
              <rect x="3" y="4" width="20" height="18" rx="3.5" stroke="white" strokeWidth="1.8"/>
              <circle cx="13" cy="13" r="4" stroke="white" strokeWidth="1.8"/>
              <circle cx="13" cy="13" r="1.8" fill="white"/>
              <line x1="13" y1="9" x2="13" y2="6.5" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
              <line x1="17" y1="13" x2="19.5" y2="13" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-extrabold text-sm tracking-wide" style={{ fontFamily: 'Manrope, Inter, sans-serif' }}>
            VaultPoint POS
          </span>
        </div>
        {/* User info */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '7px 10px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8', margin: '0 0 2px' }}>
            {user?.full_name || user?.username || 'User'}
          </p>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'capitalize', color: '#415A77', margin: 0 }}>
            {user?.role || 'Staff'}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggle(group.label)}
              className="flex items-center justify-between w-full px-2 mb-1.5"
            >
              <span style={{ fontSize: 9, letterSpacing: '0.18em', fontWeight: 700, textTransform: 'uppercase', color: '#334155' }}>
                {group.label}
              </span>
              {collapsed[group.label]
                ? <ChevronRight size={9} style={{ color: '#334155' }} />
                : <ChevronDown  size={9} style={{ color: '#334155' }} />}
            </button>
            {!collapsed[group.label] && (
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/dashboard'}
                    className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="glow-divider mx-3" />

      {/* User footer */}
      <div className="relative px-3 py-4">
        <div className="sidebar-user-card flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200">
          <div className="sidebar-avatar w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'User'}</p>
            <p className="text-slate-500 text-[10px] capitalize font-medium">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            aria-label="Sign out"
            title="Sign out"
            className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(27,38,59,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            style={{
              background: '#FFFFFF', borderRadius: 16,
              border: '1px solid #E2E8F0',
              boxShadow: '0 20px 60px rgba(27,38,59,0.18)',
              padding: '28px 28px 22px', width: 320, textAlign: 'center',
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FFF1F2', border: '1px solid #FECDD3', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <LogOut size={20} color="#E11D48" />
            </div>
            <p style={{ fontFamily: 'Manrope, Inter, sans-serif', fontSize: 15, fontWeight: 700, color: '#1B263B', margin: '0 0 6px' }}>
              Sign Out?
            </p>
            <p style={{ fontSize: 12, color: '#778DA9', margin: '0 0 22px', lineHeight: 1.5 }}>
              You will be returned to the login screen. Any unsaved changes will be lost.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: '#F5F7FA', border: '1px solid #E2E8F0',
                  fontSize: 13, fontWeight: 600, color: '#415A77', cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  flex: 1, padding: '10px', borderRadius: 10,
                  background: '#E11D48', border: 'none',
                  fontSize: 13, fontWeight: 700, color: '#FFFFFF', cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
