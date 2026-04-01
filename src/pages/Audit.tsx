import { useQuery } from '@tanstack/react-query'
import { getAuditLogs, getAnomalies } from '../api/misc'
import { PageSpinner } from '../components/ui/Spinner'
import { AlertTriangle } from 'lucide-react'

export default function Audit() {
  const { data, isLoading } = useQuery({ queryKey: ['audit-logs'], queryFn: getAuditLogs, retry: 1 })
  const { data: anomalyData } = useQuery({ queryKey: ['anomalies'], queryFn: getAnomalies, retry: 1 })

  const logs = data?.data?.results || data?.data || []
  const anomalies = anomalyData?.data?.results || anomalyData?.data || []

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs</h1>
          <p className="text-sm text-gray-400 mt-0.5">Full system activity trail</p>
        </div>
        <a href={`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'}/audit/export/`} target="_blank" rel="noreferrer" className="btn-secondary">Export</a>
      </div>

      {anomalies.length > 0 && (
        <div className="card mb-5 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={15} className="text-amber-600" />
            <p className="font-semibold text-amber-800">Anomalies Detected ({anomalies.length})</p>
          </div>
          <div className="space-y-2">
            {anomalies.map((a: any, i: number) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="badge-yellow">{a.type || 'anomaly'}</span>
                <span className="text-amber-800">{a.description || a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Action</th><th className="th">User</th><th className="th">Resource</th><th className="th">Details</th><th className="th">Time</th></tr></thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="tr">
                <td className="td"><span className="badge-indigo font-mono text-[10px]">{log.action}</span></td>
                <td className="td font-medium">{log.user_name || log.user}</td>
                <td className="td text-gray-500 capitalize">{log.resource_type || log.model}</td>
                <td className="td text-gray-400 text-xs max-w-xs truncate">{log.details || log.description || '—'}</td>
                <td className="td text-gray-400 text-xs">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No audit logs</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
