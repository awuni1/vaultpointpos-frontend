import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { getDailyReport, getWeeklyReport, getMonthlyReport, getPaymentMethodReport, getCashierPerformance, getCategoryRevenue } from '../api/reports'

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export default function Reports() {
  const [tab, setTab] = useState<'daily' | 'weekly' | 'monthly' | 'cashiers' | 'payment' | 'category'>('daily')

  const { data: daily } = useQuery({ queryKey: ['report-daily'], queryFn: () => getDailyReport(), retry: 1 })
  const { data: weekly } = useQuery({ queryKey: ['report-weekly'], queryFn: () => getWeeklyReport(), retry: 1 })
  const { data: monthly } = useQuery({ queryKey: ['report-monthly'], queryFn: () => getMonthlyReport(), retry: 1 })
  const { data: cashiers } = useQuery({ queryKey: ['report-cashiers'], queryFn: () => getCashierPerformance(), retry: 1 })
  const { data: payment } = useQuery({ queryKey: ['report-payment'], queryFn: () => getPaymentMethodReport(), retry: 1 })
  const { data: category } = useQuery({ queryKey: ['report-category'], queryFn: () => getCategoryRevenue(), retry: 1 })

  const tabs = [
    { key: 'daily', label: 'Daily' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
    { key: 'cashiers', label: 'Cashiers' },
    { key: 'payment', label: 'Payments' },
    { key: 'category', label: 'Categories' },
  ]

  const renderReport = () => {

    // ── DAILY ──────────────────────────────────────────────────────────────
    if (tab === 'daily') {
      // Backend fields: date, total_sales (count), completed_sales (count),
      // total_revenue, net_revenue, total_discount, total_tax,
      // voided_sales, refunded_sales, top_products, hourly_breakdown
      const d = daily?.data || {}
      const revenue = Number(d.total_revenue || 0)
      const completed = Number(d.completed_sales || 0)
      const avgSale = completed > 0 ? revenue / completed : 0

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `GHS ${revenue.toFixed(2)}` },
              { label: 'Completed Sales', value: completed },
              { label: 'Avg Sale Value', value: `GHS ${avgSale.toFixed(2)}` },
              { label: 'Date', value: d.date ? new Date(d.date).toLocaleDateString() : '—' },
            ].map(item => (
              <div key={item.label} className="card">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Hourly breakdown chart */}
          {(d.hourly_breakdown?.length ?? 0) > 0 && (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-4">Hourly Sales Breakdown</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={d.hourly_breakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Top products */}
          {(d.top_products?.length ?? 0) > 0 && (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-4">Top Products Today</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="th">Product</th>
                    <th className="th">Qty Sold</th>
                    <th className="th">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {d.top_products.map((p: any) => (
                    <tr key={p.product_id} className="tr">
                      <td className="td font-medium">{p.product_name}</td>
                      <td className="td">{p.quantity_sold}</td>
                      <td className="td font-semibold">GHS {Number(p.revenue).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(d.completed_sales === undefined) && (
            <div className="card text-center text-gray-400 py-10">No data for today yet</div>
          )}
        </div>
      )
    }

    // ── WEEKLY ─────────────────────────────────────────────────────────────
    if (tab === 'weekly') {
      // Backend fields: start_date, end_date, total_sales, total_revenue,
      // average_daily_revenue, daily_breakdown: [{date, sales_count, revenue}]
      const d = weekly?.data || {}
      const breakdown: any[] = d.daily_breakdown || []
      const chartData = breakdown.map(item => ({
        date: item.date ? new Date(item.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' }) : '—',
        revenue: Number(item.revenue || 0),
        sales: Number(item.sales_count || 0),
      }))

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'Total Revenue', value: `GHS ${Number(d.total_revenue || 0).toFixed(2)}` },
              { label: 'Total Transactions', value: d.total_sales || 0 },
              { label: 'Avg Daily Revenue', value: `GHS ${Number(d.average_daily_revenue || 0).toFixed(2)}` },
            ].map(item => (
              <div key={item.label} className="card">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-gray-900 mb-1">Daily Revenue This Week</p>
            <p className="text-xs text-gray-400 mb-4">{d.start_date} — {d.end_date}</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 text-sm py-10">No sales this week yet</p>
            )}
          </div>
        </div>
      )
    }

    // ── MONTHLY ────────────────────────────────────────────────────────────
    if (tab === 'monthly') {
      // Backend fields: year, month, month_name, total_sales, total_revenue,
      // net_revenue, total_discount, total_tax, average_transaction_value,
      // daily_breakdown: [{date, sales_count, revenue}]
      const d = monthly?.data || {}
      const breakdown: any[] = d.daily_breakdown || []
      const chartData = breakdown.map(item => ({
        date: item.date ? new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : '—',
        revenue: Number(item.revenue || 0),
        sales: Number(item.sales_count || 0),
      }))

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Revenue', value: `GHS ${Number(d.total_revenue || 0).toFixed(2)}` },
              { label: 'Net Revenue', value: `GHS ${Number(d.net_revenue || 0).toFixed(2)}` },
              { label: 'Total Transactions', value: d.total_sales || 0 },
              { label: 'Avg Transaction', value: `GHS ${Number(d.average_transaction_value || 0).toFixed(2)}` },
            ].map(item => (
              <div key={item.label} className="card">
                <p className="text-xs text-gray-400">{item.label}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="card">
            <p className="text-sm font-semibold text-gray-900 mb-1">Daily Revenue — {d.month_name} {d.year}</p>
            <p className="text-xs text-gray-400 mb-4">Total discount: GHS {Number(d.total_discount || 0).toFixed(2)} · Tax: GHS {Number(d.total_tax || 0).toFixed(2)}</p>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']} />
                  <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 text-sm py-10">No sales this month yet</p>
            )}
          </div>
        </div>
      )
    }

    // ── CASHIERS ───────────────────────────────────────────────────────────
    if (tab === 'cashiers') {
      // Backend fields: { start_date, end_date, cashiers: [{user_id, username,
      //   full_name, role, total_sales (count), total_revenue, average_transaction}] }
      const list: any[] = cashiers?.data?.cashiers || []

      return (
        <div className="card">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Cashier Performance
            {cashiers?.data?.start_date && (
              <span className="text-xs text-gray-400 font-normal ml-2">
                {cashiers.data.start_date} — {cashiers.data.end_date}
              </span>
            )}
          </p>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="th">Cashier</th>
                <th className="th">Role</th>
                <th className="th">Transactions</th>
                <th className="th">Total Revenue</th>
                <th className="th">Avg Sale</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? list.map((c: any) => (
                <tr key={c.user_id} className="tr">
                  <td className="td">
                    <p className="font-medium text-gray-900">{c.full_name}</p>
                    <p className="text-xs text-gray-400">{c.username}</p>
                  </td>
                  <td className="td capitalize text-gray-500">{c.role}</td>
                  <td className="td">{c.total_sales}</td>
                  <td className="td font-semibold">GHS {Number(c.total_revenue).toFixed(2)}</td>
                  <td className="td">GHS {Number(c.average_transaction).toFixed(2)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No cashier data for this period</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )
    }

    // ── PAYMENT METHODS ────────────────────────────────────────────────────
    if (tab === 'payment') {
      // Backend fields: { start_date, end_date, total_revenue, total_transactions,
      //   payment_methods: [{method, label, transaction_count, total_amount, percentage}] }
      const methods: any[] = payment?.data?.payment_methods || []
      const chartData = methods
        .filter(m => m.total_amount > 0)
        .map(m => ({ name: m.label, value: Number(m.total_amount) }))

      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <p className="text-xs text-gray-400">Total Revenue</p>
              <p className="text-xl font-bold text-gray-900 mt-1">GHS {Number(payment?.data?.total_revenue || 0).toFixed(2)}</p>
            </div>
            <div className="card">
              <p className="text-xs text-gray-400">Total Transactions</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{payment?.data?.total_transactions || 0}</p>
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-4">Revenue by Payment Method</p>
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" outerRadius={100} dataKey="value"
                      label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                      {chartData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : null}

          <div className="card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="th">Method</th>
                  <th className="th">Transactions</th>
                  <th className="th">Total Amount</th>
                  <th className="th">Share</th>
                </tr>
              </thead>
              <tbody>
                {methods.length > 0 ? methods.map((m: any) => (
                  <tr key={m.method} className="tr">
                    <td className="td font-medium capitalize">{m.label}</td>
                    <td className="td">{m.transaction_count}</td>
                    <td className="td font-semibold">GHS {Number(m.total_amount).toFixed(2)}</td>
                    <td className="td">{Number(m.percentage).toFixed(1)}%</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No payment data for this period</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    // ── CATEGORY REVENUE ───────────────────────────────────────────────────
    if (tab === 'category') {
      // Backend fields: { start_date, end_date, total_revenue,
      //   categories: [{category_id, category_name, total_revenue,
      //                 total_quantity_sold, transaction_count, percentage}] }
      const cats: any[] = category?.data?.categories || []
      const chartData = cats.map(c => ({
        name: c.category_name,
        revenue: Number(c.total_revenue),
      }))

      return (
        <div className="space-y-4">
          {chartData.length > 0 ? (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-4">Revenue by Category</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} formatter={(v: any) => [`GHS ${Number(v).toFixed(2)}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#4F46E5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : null}

          <div className="card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="th">Category</th>
                  <th className="th">Qty Sold</th>
                  <th className="th">Transactions</th>
                  <th className="th">Revenue</th>
                  <th className="th">Share</th>
                </tr>
              </thead>
              <tbody>
                {cats.length > 0 ? cats.map((c: any) => (
                  <tr key={c.category_id} className="tr">
                    <td className="td font-medium">{c.category_name}</td>
                    <td className="td">{c.total_quantity_sold}</td>
                    <td className="td">{c.transaction_count}</td>
                    <td className="td font-semibold">GHS {Number(c.total_revenue).toFixed(2)}</td>
                    <td className="td">{Number(c.percentage).toFixed(1)}%</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No category data for this period</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <a
          href={`${BASE_URL}/reports/export/?report=${tab}&format=csv`}
          target="_blank"
          rel="noreferrer"
          className="btn-secondary"
        >
          Export CSV
        </a>
      </div>

      <div className="flex gap-1 mb-5 bg-white rounded-xl p-1 border border-gray-100 w-fit flex-wrap">
        {tabs.map(t => (
          <button
            type="button"
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t.key ? 'bg-accent text-white' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {renderReport()}
    </div>
  )
}
