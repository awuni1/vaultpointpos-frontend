import { useQuery } from '@tanstack/react-query'
import { getNotificationLogs, sendDailySummary } from '../api/misc'
import { PageSpinner } from '../components/ui/Spinner'
import { Bell, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Notifications() {
  const { data, isLoading } = useQuery({ queryKey: ['notification-logs'], queryFn: getNotificationLogs, retry: 1 })
  const logs = data?.data?.results || data?.data || []

  const handleDailySummary = async () => {
    try { await sendDailySummary(); toast.success('Daily summary sent') }
    catch { toast.error('Failed to send') }
  }

  const STATUS_COLOR: Record<string, string> = { sent: 'badge-green', failed: 'badge-red', pending: 'badge-yellow' }

  if (isLoading) return <PageSpinner />

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <button type="button" className="btn-primary" onClick={handleDailySummary}><Send size={15} />Send Daily Summary</button>
      </div>
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Bell size={15} className="text-accent" />
          <p className="font-semibold text-gray-900">Notification Log</p>
        </div>
        <table className="w-full">
          <thead><tr className="border-b border-gray-100"><th className="th">Type</th><th className="th">Recipient</th><th className="th">Message</th><th className="th">Status</th><th className="th">Sent At</th></tr></thead>
          <tbody>
            {logs.map((log: any) => (
              <tr key={log.id} className="tr">
                <td className="td capitalize"><span className="badge-indigo">{log.notification_type || log.type}</span></td>
                <td className="td">{log.recipient || log.email || '—'}</td>
                <td className="td text-gray-500 text-xs max-w-xs truncate">{log.message || log.subject || '—'}</td>
                <td className="td"><span className={STATUS_COLOR[log.status] || 'badge-gray'}>{log.status}</span></td>
                <td className="td text-gray-400 text-xs">{log.created_at ? new Date(log.created_at).toLocaleString() : '—'}</td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan={5} className="td text-center text-gray-400 py-8">No notifications sent yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
