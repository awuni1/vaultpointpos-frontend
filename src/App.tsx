import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'

import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Inventory from './pages/Inventory'
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
// import Branches from './pages/Branches'
import Shifts from './pages/Shifts'
import Expenses from './pages/Expenses'
// import Suppliers from './pages/Suppliers'
import Vouchers from './pages/Vouchers'
import Staff from './pages/Staff'
import Targets from './pages/Targets'
// import Forecasting from './pages/Forecasting'
import Audit from './pages/Audit'
// import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

// Routes each role can access
const ROLE_ROUTES: Record<string, string[]> = {
  cashier: ['/pos', '/sales', '/customers', '/vouchers'],
  manager: [
    '/dashboard', '/pos', '/products', '/categories', '/inventory',
    '/sales', '/customers', '/payments', '/vouchers', '/reports',
    '/shifts', '/expenses', '/suppliers',
    '/staff', '/targets', '/forecasting', '/notifications',
  ],
  admin: ['*'], // all routes
}

function canAccess(role: string | undefined, path: string): boolean {
  if (!role) return false
  const allowed = ROLE_ROUTES[role]
  if (!allowed) return false
  if (allowed[0] === '*') return true
  return allowed.includes(path)
}

function homeFor(role: string | undefined): string {
  if (role === 'cashier') return '/pos'
  return '/dashboard'
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

function RequireRole({ path, children }: { path: string; children: ReactNode }) {
  const { user } = useAuthStore()
  if (!canAccess(user?.role, path)) {
    return <Navigate to={homeFor(user?.role)} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/dashboard"    element={<RequireRole path="/dashboard"><Dashboard /></RequireRole>} />
            <Route path="/pos"          element={<POS />} />
            <Route path="/products"     element={<RequireRole path="/products"><Products /></RequireRole>} />
            <Route path="/categories"   element={<RequireRole path="/categories"><Categories /></RequireRole>} />
            <Route path="/inventory"    element={<RequireRole path="/inventory"><Inventory /></RequireRole>} />
            <Route path="/customers"    element={<RequireRole path="/customers"><Customers /></RequireRole>} />
            <Route path="/sales"        element={<RequireRole path="/sales"><Sales /></RequireRole>} />
            <Route path="/payments"     element={<RequireRole path="/payments"><Payments /></RequireRole>} />
            <Route path="/reports"      element={<RequireRole path="/reports"><Reports /></RequireRole>} />
            {/* <Route path="/branches"     element={<RequireRole path="/branches"><Branches /></RequireRole>} /> */}
            <Route path="/shifts"       element={<RequireRole path="/shifts"><Shifts /></RequireRole>} />
            <Route path="/expenses"     element={<RequireRole path="/expenses"><Expenses /></RequireRole>} />
            {/* <Route path="/suppliers"    element={<RequireRole path="/suppliers"><Suppliers /></RequireRole>} /> */}
            <Route path="/vouchers"     element={<RequireRole path="/vouchers"><Vouchers /></RequireRole>} />
            <Route path="/staff"        element={<RequireRole path="/staff"><Staff /></RequireRole>} />
            <Route path="/targets"      element={<RequireRole path="/targets"><Targets /></RequireRole>} />
            {/* <Route path="/forecasting"  element={<RequireRole path="/forecasting"><Forecasting /></RequireRole>} /> */}
            <Route path="/audit"        element={<RequireRole path="/audit"><Audit /></RequireRole>} />
            {/* <Route path="/integrations" element={<RequireRole path="/integrations"><Integrations /></RequireRole>} /> */}
            <Route path="/settings"     element={<RequireRole path="/settings"><Settings /></RequireRole>} />
            <Route path="/notifications" element={<RequireRole path="/notifications"><Notifications /></RequireRole>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: '12px', fontSize: '13px', fontWeight: 500 },
        }}
      />
    </QueryClientProvider>
  )
}
