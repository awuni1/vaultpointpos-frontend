import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import {
  AlertTriangle, ExternalLink, Package, BarChart3,
  Users, CreditCard, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import { getDailyReport, getWeeklyReport } from '../api/reports'
import { getLowStock } from '../api/inventory'
import { getSales } from '../api/sales'
import { PageSpinner } from '../components/ui/Spinner'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function pct(a: number, b: number) {
  if (!b) return null
  return ((a - b) / b) * 100
}

/* ── Light card wrapper ─────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid #E2E8F0',
        borderRadius: 14,
        boxShadow: '0 1px 8px rgba(27,38,59,0.06)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── KPI Card ────────────────────────────────────────────────── */
function KpiCard({
  label, value, sub, change, icon,
}: {
  label: string; value: string; sub?: string; change?: number | null; icon: React.ReactNode
}) {
  const up   = change !== null && change !== undefined && change > 0
  const down = change !== null && change !== undefined && change < 0

  return (
    <Card style={{ padding: '20px 22px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#778DA9', margin: 0 }}>
          {label}
        </p>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#F5F7FA', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#415A77' }}>
          {icon}
        </div>
      </div>
      <p style={{ fontFamily: 'Manrope, Inter, sans-serif', fontSize: 26, fontWeight: 800, color: '#1B263B', margin: '0 0 6px' }}>
        {value}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {change !== null && change !== undefined && (
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 2,
              fontSize: 11, fontWeight: 700,
              color: up ? '#10B981' : down ? '#F43F5E' : '#778DA9',
              background: up ? '#F0FDF4' : down ? '#FFF1F2' : '#F5F7FA',
              padding: '2px 6px', borderRadius: 6,
            }}
          >
            {up ? <ArrowUpRight size={11} /> : down ? <ArrowDownRight size={11} /> : null}
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
        {sub && <span style={{ fontSize: 11, color: '#94A3B8' }}>{sub}</span>}
      </div>
    </Card>
  )
}

/* ══════════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const { data: todayData, isLoading } = useQuery({
    queryKey: ['daily-report-today'],
    queryFn: () => getDailyReport(),
    retry: 1,
  })
  const { data: yesterdayData } = useQuery({
    queryKey: ['daily-report-yesterday'],
    queryFn: () => getDailyReport({ date: yesterday() }),
    retry: 1,
  })
  const { data: weeklyData } = useQuery({
    queryKey: ['weekly-report'],
    queryFn: () => getWeeklyReport(),
    retry: 1,
  })
  const { data: lowStockData } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => getLowStock(),
    retry: 1,
  })
  const { data: salesData } = useQuery({
    queryKey: ['recent-sales'],
    queryFn: () => getSales({ limit: 8 }),
    retry: 1,
  })

  if (isLoading) return <PageSpinner />

  const today   = todayData?.data   || {}
  const prev    = yesterdayData?.data || {}

  const revenue      = Number(today.total_revenue    || 0)
  const txns         = Number(today.completed_sales  || 0)
  const prevRevenue  = Number(prev.total_revenue     || 0)
  const prevTxns     = Number(prev.completed_sales   || 0)

  const revChange  = pct(revenue, prevRevenue)
  const txnChange  = pct(txns,    prevTxns)

  const dailyBreakdown = weeklyData?.data?.daily_breakdown || []
  const barData = DAY_NAMES.map((day, i) => {
    const match = dailyBreakdown.find((d: any) => d.date && new Date(d.date).getDay() === i)
    return { day, value: match ? Number(match.revenue) : 0 }
  })
  const maxBar = Math.max(...barData.map(d => d.value), 1)

  const lowStockItems: any[] = Array.isArray(lowStockData?.data) ? lowStockData.data.slice(0, 4) : []
  const recentSales: any[]   = salesData?.data?.results ?? salesData?.data ?? []

  const quickActions = [
    { icon: Package,  label: 'Stock Count',  sub: 'Inventory sync',   color: '#EFF6FF', border: '#BFDBFE', iconColor: '#3B82F6' },
    { icon: BarChart3, label: 'Reports',     sub: 'Export data',      color: '#F0FDF4', border: '#BBF7D0', iconColor: '#10B981' },
    { icon: Users,    label: 'Team',          sub: 'Staff schedule',   color: '#FFF7ED', border: '#FED7AA', iconColor: '#F59E0B' },
    { icon: CreditCard, label: 'Payouts',    sub: 'Bank reconcile',   color: '#FFF1F2', border: '#FECDD3', iconColor: '#F43F5E' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', color: '#1B263B' }}>

      {/* ── Header ────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#778DA9', margin: '0 0 4px' }}>
            Overview
          </p>
          <h1 style={{ fontFamily: 'Manrope, Inter, sans-serif', fontSize: 26, fontWeight: 800, color: '#1B263B', margin: 0 }}>
            Manager's Dashboard
          </h1>
        </div>

        {/* Period toggle */}
        <div style={{ display: 'flex', background: 'white', border: '1px solid #E2E8F0', borderRadius: 10, padding: 3, gap: 2 }}>
          {(['daily', 'weekly', 'monthly'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                padding: '5px 14px', borderRadius: 7, border: 'none',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                textTransform: 'capitalize',
                background: period === p ? '#1B263B' : 'transparent',
                color: period === p ? 'white' : '#778DA9',
                transition: 'all 0.15s',
              }}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI Row ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
        <KpiCard
          label="Real-Time Revenue"
          value={`GHS ${revenue.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`}
          sub="vs yesterday"
          change={revChange}
          icon={<BarChart3 size={15} />}
        />
        <KpiCard
          label="Store Traffic"
          value={txns.toLocaleString()}
          sub="transactions today"
          change={txnChange}
          icon={<Users size={15} />}
        />
        <KpiCard
          label="Avg Basket"
          value={txns > 0 ? `GHS ${(revenue / txns).toFixed(2)}` : 'GHS 0.00'}
          sub="per transaction"
          change={null}
          icon={<CreditCard size={15} />}
        />
      </div>

      {/* ── Main grid ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* ── LEFT column ───────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Critical Alerts */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={14} color="#F43F5E" />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#1B263B' }}>Critical Alerts</span>
                {lowStockItems.length > 0 && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: '#FFF1F2', color: '#F43F5E', border: '1px solid #FECDD3', padding: '1px 7px', borderRadius: 999 }}>
                    {lowStockItems.length} items
                  </span>
                )}
              </div>
            </div>

            <div>
              {lowStockItems.length > 0 ? lowStockItems.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 20px',
                    borderTop: '1px solid #F1F5F9',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F8FAFC'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', background: '#FFF7ED', color: '#F59E0B', border: '1px solid #FED7AA', padding: '2px 6px', borderRadius: 4 }}>SKU</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#1B263B', margin: 0 }}>{item.product_name || item.product}</p>
                    <p style={{ fontSize: 10, color: item.quantity === 0 ? '#F43F5E' : '#F59E0B', margin: 0 }}>
                      {item.quantity === 0 ? 'Out of stock' : `${item.quantity} units remaining`}
                    </p>
                  </div>
                  <ArrowUpRight size={13} color="#CBD5E1" />
                </div>
              )) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: '#94A3B8', margin: 0 }}>No critical alerts</p>
                </div>
              )}
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9' }}>
              <button
                style={{
                  width: '100%', padding: '9px', borderRadius: 8,
                  background: '#F5F7FA', border: '1px solid #E2E8F0',
                  fontSize: 11, fontWeight: 600, color: '#415A77',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1B263B'; (e.currentTarget as HTMLElement).style.color = 'white' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#F5F7FA'; (e.currentTarget as HTMLElement).style.color = '#415A77' }}
              >
                <ExternalLink size={12} /> Open Inventory Management
              </button>
            </div>
          </Card>

          {/* Performance by Terminal — bar chart */}
          <Card style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#1B263B', margin: '0 0 14px' }}>Performance by Terminal</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={barData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((d, i) => (
                    <Cell key={i} fill={d.value === maxBar ? '#1B263B' : '#E2E8F0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* ── RIGHT column ──────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Live Transaction Log */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 10px' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1B263B' }}>Live Transaction Log</span>
              <button style={{ fontSize: 10, fontWeight: 600, color: '#0077B6', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                View Full History <ExternalLink size={10} />
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Ref #', 'Terminal', 'Cashier', 'Items', 'Total'].map(h => (
                    <th key={h} style={{ padding: '6px 20px 8px', textAlign: 'left', fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.length > 0 ? recentSales.slice(0, 6).map((s: any, i: number) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #F8FAFC', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F8FAFC'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <td style={{ padding: '9px 20px', fontSize: 11, fontWeight: 600, color: '#415A77' }}>TX-{String(s.id || i + 9277).padStart(4, '0')}</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, color: '#778DA9' }}>Term {String(s.branch || '01').slice(-2)}</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, color: '#778DA9' }}>{s.cashier_name || s.cashier || '—'}</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, color: '#778DA9' }}>{s.item_count ?? s.items_count ?? '—'} items</td>
                    <td style={{ padding: '9px 20px', fontSize: 11, fontWeight: 700, color: '#1B263B' }}>GHS {Number(s.total_amount || s.total || 0).toFixed(2)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: '#94A3B8' }}>No transactions yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>

          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickActions.map(({ icon: Icon, label, sub, color, border, iconColor }) => (
              <Card
                key={label}
                style={{
                  padding: '16px', cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <div
                  style={{ width: 36, height: 36, borderRadius: 10, background: color, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}
                >
                  <Icon size={16} color={iconColor} />
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#1B263B', margin: '0 0 2px' }}>{label}</p>
                <p style={{ fontSize: 10, color: '#94A3B8', margin: 0 }}>{sub}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
