import { useQuery } from '@tanstack/react-query'
import { getStoreForecast, getStockoutRisk } from '../api/misc'
import { PageSpinner } from '../components/ui/Spinner'
import { TrendingUp, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Forecasting() {
  const { data: storeData, isLoading } = useQuery({ queryKey: ['store-forecast'], queryFn: getStoreForecast, retry: 1 })
  const { data: riskData } = useQuery({ queryKey: ['stockout-risk'], queryFn: getStockoutRisk, retry: 1 })

  const forecast = storeData?.data || {}
  const risks = riskData?.data?.results || riskData?.data || []

  if (isLoading) return <PageSpinner />

  const chartData = Array.isArray(forecast)
    ? forecast
    : Object.entries(forecast).map(([period, value]) => ({ period, value: Number(value) }))

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Forecasting</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-accent" />
            <p className="font-semibold text-gray-900">Store Sales Forecast</p>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-400 text-sm py-12">No forecast data yet. Run forecasting to generate data.</p>
          )}
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <p className="font-semibold text-gray-900">Stockout Risk</p>
          </div>
          <table className="w-full">
            <thead><tr className="border-b border-gray-100"><th className="th">Product</th><th className="th">Current Stock</th><th className="th">Days Left</th><th className="th">Risk</th></tr></thead>
            <tbody>
              {risks.map((r: any, i: number) => (
                <tr key={i} className="tr">
                  <td className="td font-medium">{r.product_name || r.product}</td>
                  <td className="td">{r.current_stock || r.quantity}</td>
                  <td className="td">{r.days_until_stockout || '—'}</td>
                  <td className="td">
                    <span className={r.risk_level === 'high' ? 'badge-red' : r.risk_level === 'medium' ? 'badge-yellow' : 'badge-green'}>
                      {r.risk_level || 'medium'}
                    </span>
                  </td>
                </tr>
              ))}
              {risks.length === 0 && <tr><td colSpan={4} className="td text-center text-gray-400 py-8">No stockout risks detected</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
