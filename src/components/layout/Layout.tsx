import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const titles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/pos': 'Point of Sale',
  '/products': 'Products',
  '/categories': 'Categories',
  '/inventory': 'Inventory',
  '/sales': 'Sales History',
  '/customers': 'Customers',
  '/vouchers': 'Vouchers & Gift Cards',
  '/payments': 'Payments',
  '/branches': 'Branches',
  '/shifts': 'Shifts',
  '/expenses': 'Expenses',
  '/suppliers': 'Suppliers',
  '/reports': 'Reports',
  '/targets': 'Targets',
  '/forecasting': 'Forecasting',
  '/staff': 'Staff',
  '/notifications': 'Notifications',
  '/audit': 'Audit Logs',
  '/integrations': 'Integrations',
  '/settings': 'Settings',
}

export default function Layout() {
  const { pathname } = useLocation()
  const base = '/' + pathname.split('/')[1]
  const title = titles[base] || 'VaultPoint'

  // POS keeps dark full-screen layout
  if (pathname === '/pos') {
    return (
      <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#080E1A' }}>
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: '#F5F7FA' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar title={title} />
        <main
          className="flex-1 overflow-y-auto p-6"
          style={{ background: '#F5F7FA' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
