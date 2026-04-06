import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'indigo' | 'green' | 'amber' | 'red'
}

const configs = {
  indigo: {
    gradient: 'linear-gradient(135deg, rgba(0,119,182,0.2) 0%, rgba(65,90,119,0.1) 100%)',
    iconBg: 'linear-gradient(135deg, #0077B6 0%, #1B263B 100%)',
    iconShadow: '0 4px 16px rgba(0,119,182,0.45)',
    border: 'rgba(0,119,182,0.28)',
    valueColor: '#90CAF9',
    glowColor: 'rgba(0,119,182,0.1)',
  },
  green: {
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.1) 100%)',
    iconBg: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    iconShadow: '0 4px 16px rgba(16,185,129,0.45)',
    border: 'rgba(16,185,129,0.25)',
    valueColor: '#34D399',
    glowColor: 'rgba(16,185,129,0.08)',
  },
  amber: {
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(244,63,94,0.1) 100%)',
    iconBg: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    iconShadow: '0 4px 16px rgba(245,158,11,0.45)',
    border: 'rgba(245,158,11,0.25)',
    valueColor: '#FCD34D',
    glowColor: 'rgba(245,158,11,0.08)',
  },
  red: {
    gradient: 'linear-gradient(135deg, rgba(244,63,94,0.2) 0%, rgba(245,158,11,0.1) 100%)',
    iconBg: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
    iconShadow: '0 4px 16px rgba(244,63,94,0.45)',
    border: 'rgba(244,63,94,0.25)',
    valueColor: '#FB7185',
    glowColor: 'rgba(244,63,94,0.08)',
  },
}

export default function StatCard({ label, value, sub, icon, trend, trendValue, color = 'indigo' }: StatCardProps) {
  const cfg = configs[color]

  return (
    <div
      className="rounded-2xl p-5 relative overflow-hidden transition-all duration-300"
      style={{
        background: cfg.gradient,
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {/* Background glow blob */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
        style={{ background: cfg.glowColor, filter: 'blur(20px)' }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: cfg.iconBg, boxShadow: cfg.iconShadow }}
        >
          <span className="text-white [&>*]:stroke-white">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400 font-medium tracking-wide">{label}</p>
          <p className="text-2xl font-bold mt-0.5 tracking-tight" style={{ color: cfg.valueColor }}>{value}</p>
          {(sub || trendValue) && (
            <p className={`text-xs mt-1.5 font-medium flex items-center gap-1 ${
              trend === 'up'   ? 'text-emerald-400' :
              trend === 'down' ? 'text-rose-400'    :
              'text-slate-500'
            }`}>
              {trendValue && (
                <span className="flex items-center gap-0.5">
                  {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
                  {trendValue}
                </span>
              )}
              {sub && <span className="text-slate-500">{sub}</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
