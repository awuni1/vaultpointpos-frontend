import { useQuery } from '@tanstack/react-query'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { DollarSign, ShoppingBag, Users, AlertTriangle, TrendingUp } from 'lucide-react'
import { getDailyReport, getWeeklyReport, getPaymentMethodReport } from '../api/reports'
import { getLowStock } from '../api/inventory'
import { getCustomers } from '../api/customers'
import StatCard from '../components/ui/StatCard'
import { PageSpinner } from '../components/ui/Spinner'

const COLORS = ['#7C3AED', '#06B6D4', '#F59E0B', '#F43F5E']

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function yesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function calcTrend(today: number, prev: number): { dir: 'up' | 'down' | 'neutral'; label: string } {
  if (!prev) return { dir: 'neutral', label: '—' }
  const pct = ((today - prev) / prev) * 100
  return {
    dir: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
    label: `${Math.abs(pct).toFixed(1)}%`,
  }
}

const customTooltipStyle = {
  background: 'rgba(19,29,53,0.95)',
  border: '1px solid rgba(124,58,237,0.3)',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
  fontSize: 12,
  color: '#E2E8F0',
  backdropFilter: 'blur(12px)',
}

export default function Dashboard() {
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
  const { data: payMethods } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => getPaymentMethodReport(),
    retry: 1,
  })
  const { data: lowStock } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => getLowStock(),
    retry: 1,
  })
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: () => getCustomers(),
    retry: 1,
  })

  if (isLoading) return <PageSpinner />

  const today = todayData?.data || {}
  const prev = yesterdayData?.data || {}

  const todayRevenue = Number(today.total_revenue || 0)
  const todayTxns = Number(today.completed_sales || 0)
  const prevRevenue = Number(prev.total_revenue || 0)
  const prevTxns = Number(prev.completed_sales || 0)

  const revenueTrend = calcTrend(todayRevenue, prevRevenue)
  const txnTrend = calcTrend(todayTxns, prevTxns)

  const dailyBreakdown: { date: string; sales_count: number; revenue: number }[] =
    weeklyData?.data?.daily_breakdown || []

  const weekChartData = DAY_NAMES.map((dayName, idx) => {
    const match = dailyBreakdown.find(d => {
      if (!d.date) return false
      return new Date(d.date).getDay() === idx
    })
    return { day: dayName, sales: match ? match.revenue : 0 }
  })

  const rawPayment = payMethods?.data?.payment_methods || []
  const pmChartData: { name: string; value: number }[] = Array.isArray(rawPayment)
    ? rawPayment
        .filter((m: any) => m.total_amount > 0)
        .map((m: any) => ({ name: m.label || m.method, value: Number(m.total_amount) }))
    : []

  const totalCustomers = customers?.data?.count ?? customers?.data?.length ?? 0
  const lowStockCount = Array.isArray(lowStock?.data) ? lowStock.data.length : (lowStock?.data?.count ?? 0)

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Overview</h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-violet-300"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.25)',
          }}
        >
          <TrendingUp size={14} />
          Live Data
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's Revenue"
          value={`GHS ${todayRevenue.toFixed(2)}`}
          icon={<DollarSign size={18} />}
          color="indigo"
          trend={revenueTrend.dir}
          trendValue={revenueTrend.label}
          sub="vs yesterday"
        />
        <StatCard
          label="Transactions"
          value={todayTxns}
          icon={<ShoppingBag size={18} />}
          color="green"
          trend={txnTrend.dir}
          trendValue={txnTrend.label}
          sub="vs yesterday"
        />
        <StatCard
          label="Total Customers"
          value={totalCustomers}
          icon={<Users size={18} />}
          color="amber"
        />
        <StatCard
          label="Low Stock Items"
          value={lowStockCount}
          icon={<AlertTriangle size={18} />}
          color="red"
          sub="need reorder"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly revenue trend */}
        <div className="card col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-bold text-white tracking-tight">Weekly Revenue</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {weeklyData?.data?.start_date
                  ? `${weeklyData.data.start_date} — ${weeklyData.data.end_date}`
                  : 'This week'}
              </p>
            </div>
            <span
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-violet-300"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}
            >
              GHS {Number(weeklyData?.data?.total_revenue || 0).toFixed(2)}
            </span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={weekChartData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"  stopColor="#7C3AED" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={customTooltipStyle}
                formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']}
                cursor={{ stroke: 'rgba(124,58,237,0.2)', strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="url(#strokeGrad)"
                strokeWidth={2.5}
                fill="url(#salesGrad)"
                dot={{ fill: '#7C3AED', strokeWidth: 0, r: 3 }}
                activeDot={{ fill: '#A78BFA', strokeWidth: 0, r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment methods */}
        <div className="card">
          <p className="text-sm font-bold text-white mb-1 tracking-tight">Payment Methods</p>
          <p className="text-xs text-slate-500 mb-5 font-medium">Last 30 days</p>
          {pmChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={pmChartData}
                  cx="50%"
                  cy="44%"
                  innerRadius={52}
                  outerRadius={72}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pmChartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      opacity={0.9}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}
                />
                <Tooltip
                  contentStyle={customTooltipStyle}
                  formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-slate-600">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <DollarSign size={20} className="opacity-40" />
              </div>
              <p className="text-sm font-medium">No payment data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Today's top products */}
      {(today.top_products?.length ?? 0) > 0 && (
        <div className="card">
          <p className="text-sm font-bold text-white mb-5 tracking-tight">Top Products Today</p>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="th">Product</th>
                <th className="th">Qty Sold</th>
                <th className="th">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {today.top_products.slice(0, 5).map((item: any) => (
                <tr key={item.product_id} className="tr">
                  <td className="td font-semibold text-white">{item.product_name}</td>
                  <td className="td">
                    <span className="badge-indigo">{item.quantity_sold}</span>
                  </td>
                  <td className="td">
                    <span className="font-bold text-emerald-400">GHS {Number(item.revenue).toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Low stock alert */}
      {lowStockCount > 0 && (
        <div className="card" style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-2.5 mb-5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.25)' }}
            >
              <AlertTriangle size={14} className="text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Low Stock Alert</p>
              <p className="text-[10px] text-amber-500 font-medium">{lowStockCount} items need attention</p>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <th className="th">Product</th>
                <th className="th">Current Qty</th>
                <th className="th">Reorder Level</th>
                <th className="th">Status</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(lowStock?.data) ? lowStock.data : []).slice(0, 5).map((item: any) => (
                <tr key={item.product_id || item.id} className="tr">
                  <td className="td font-semibold text-white">{item.product_name || item.product}</td>
                  <td className="td">
                    <span className="font-bold text-rose-400">{item.quantity}</span>
                  </td>
                  <td className="td text-slate-400">{item.reorder_level}</td>
                  <td className="td"><span className="badge-red">Low Stock</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
