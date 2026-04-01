import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, BarChart3, Shield, TrendingUp } from 'lucide-react'
import { login } from '../api/auth'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const features = [
  { icon: BarChart3, label: 'Real-time Analytics', desc: 'Live dashboards & reporting' },
  { icon: Shield,    label: 'Enterprise Security', desc: 'Role-based access control' },
  { icon: TrendingUp, label: 'Smart Forecasting', desc: 'AI-powered demand prediction' },
]

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore(s => s.setAuth)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(username, password)
      setAuth(data.user, data.access, data.refresh)
      navigate('/')
    } catch {
      toast.error('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex"
      style={{ background: '#070912' }}
    >
      {/* ── Left panel ─────────────────────────────────── */}
      <div
        className="hidden lg:flex w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0D0A1E 0%, #12102B 50%, #0A0E1A 100%)',
          borderRight: '1px solid rgba(124,58,237,0.15)',
        }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-0 left-0 w-full h-80 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(124,58,237,0.25) 0%, transparent 65%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(59,130,246,0.15) 0%, transparent 65%)' }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3 z-10">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 20px rgba(124,58,237,0.5)' }}
          >
            <Zap size={19} className="text-white" fill="white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight">SwiftPOS</span>
            <p className="text-[9px] text-violet-400 font-bold tracking-widest uppercase">Pro Suite</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-violet-300 mb-6"
            style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)' }}
          >
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-pulse" />
            Industrial-Grade POS Platform
          </div>
          <h2
            className="text-4xl font-bold text-white leading-tight tracking-tight mb-4"
          >
            The future of<br />
            <span
              style={{ background: 'linear-gradient(135deg, #A78BFA 0%, #60A5FA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              retail commerce.
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Manage sales, inventory, staff, and analytics — all in one ultra-fast, enterprise-grade interface.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-3">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.2)' }}
                >
                  <Icon size={15} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { label: 'Transactions', value: '10k+' },
            { label: 'Uptime', value: '99.9%' },
            { label: 'Branches', value: 'Multi' },
          ].map(s => (
            <div
              key={s.label}
              className="rounded-xl p-4 text-center"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p
                className="font-bold text-xl"
                style={{ background: 'linear-gradient(135deg, #A78BFA, #60A5FA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {s.value}
              </p>
              <p className="text-slate-500 text-[11px] mt-1 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ──────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', boxShadow: '0 4px 16px rgba(124,58,237,0.4)' }}
            >
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-white">SwiftPOS</span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                Username
              </label>
              <input
                className="input"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                Password
              </label>
              <div className="relative">
                <input
                  className="input pr-11"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </>
                ) : 'Sign in to SwiftPOS'}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6 font-medium">
            Secured with enterprise-grade encryption
          </p>
        </div>
      </div>
    </div>
  )
}
