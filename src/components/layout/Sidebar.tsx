import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShoppingCart, Package, BarChart3, Users, Receipt,
  Building2, Clock, Wallet, Truck, Tag, Target,
  TrendingUp, Shield, Plug, Settings, LogOut, ChevronDown, ChevronRight,
  Boxes, Bell, Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { logout } from '../../api/auth'

const navGroups = [
  {
    label: 'Main',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
    ],
  },
  {
    label: 'Catalogue',
    items: [
      { to: '/products', icon: Package, label: 'Products' },
      { to: '/categories', icon: Boxes, label: 'Categories' },
      { to: '/inventory', icon: Boxes, label: 'Inventory' },
    ],
  },
  {
    label: 'Sales',
    items: [
      { to: '/sales', icon: Receipt, label: 'Sales History' },
      { to: '/customers', icon: Users, label: 'Customers' },
      { to: '/vouchers', icon: Tag, label: 'Vouchers' },
      { to: '/payments', icon: Wallet, label: 'Payments' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/branches', icon: Building2, label: 'Branches' },
      { to: '/shifts', icon: Clock, label: 'Shifts' },
      { to: '/expenses', icon: Wallet, label: 'Expenses' },
      { to: '/suppliers', icon: Truck, label: 'Suppliers' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { to: '/reports', icon: BarChart3, label: 'Reports' },
      { to: '/targets', icon: Target, label: 'Targets' },
      { to: '/forecasting', icon: TrendingUp, label: 'Forecasting' },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/staff', icon: Users, label: 'Staff' },
      { to: '/notifications', icon: Bell, label: 'Notifications' },
      { to: '/audit', icon: Shield, label: 'Audit Logs' },
      { to: '/integrations', icon: Plug, label: 'Integrations' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]

export default function Sidebar() {
  const { user, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

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

  return (
    <aside
      className="sidebar-shell w-60 shrink-0 flex flex-col h-screen overflow-y-auto relative"
    >
      {/* Ambient glow at top */}
      <div className="sidebar-top-glow absolute top-0 left-0 right-0 h-40 pointer-events-none" />

      {/* Logo */}
      <div className="sidebar-logo-border relative px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="sidebar-logo-icon w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative">
            <Zap size={17} className="text-white" fill="white" />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight">SwiftPOS</span>
            <p className="text-[9px] text-violet-400 font-medium tracking-widest uppercase mt-0.5">Pro Suite</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <button
              type="button"
              onClick={() => toggle(group.label)}
              className="flex items-center justify-between w-full px-2 mb-1.5 group"
            >
              <span className="text-[9px] uppercase tracking-[0.15em] font-bold text-slate-600">
                {group.label}
              </span>
              {collapsed[group.label]
                ? <ChevronRight size={10} className="text-slate-600" />
                : <ChevronDown size={10} className="text-slate-600" />}
            </button>
            {!collapsed[group.label] && (
              <div className="space-y-0.5">
                {group.items.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `sidebar-item ${isActive ? 'active' : ''}`
                    }
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

      {/* Glow divider */}
      <div className="glow-divider mx-3" />

      {/* User */}
      <div className="relative px-3 py-4">
        <div
          className="sidebar-user-card flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
        >
          <div className="sidebar-avatar w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.full_name || 'User'}</p>
            <p className="text-slate-500 text-[10px] capitalize font-medium">{user?.role}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="text-slate-500 hover:text-rose-400 transition-colors p-1 rounded-lg hover:bg-rose-500/10"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </aside>
  )
}
