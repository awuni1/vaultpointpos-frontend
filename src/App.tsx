import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import type { ReactNode } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Inventory from './pages/Inventory'
import Customers from './pages/Customers'
import Sales from './pages/Sales'
import Payments from './pages/Payments'
import Reports from './pages/Reports'
import Branches from './pages/Branches'
import Shifts from './pages/Shifts'
import Expenses from './pages/Expenses'
import Suppliers from './pages/Suppliers'
import Vouchers from './pages/Vouchers'
import Staff from './pages/Staff'
import Targets from './pages/Targets'
import Forecasting from './pages/Forecasting'
import Audit from './pages/Audit'
import Integrations from './pages/Integrations'
import Settings from './pages/Settings'
import Notifications from './pages/Notifications'

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/shifts" element={<Shifts />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/vouchers" element={<Vouchers />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/targets" element={<Targets />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
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
