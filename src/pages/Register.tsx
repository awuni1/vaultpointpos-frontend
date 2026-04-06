import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, AtSign, Lock, Shield, Activity } from 'lucide-react'
import { registerUser } from '../api/auth'
import toast from 'react-hot-toast'

const FEATURES = [
  {
    icon: Shield,
    title: 'Bank-Grade Protection',
    desc: 'End-to-end encryption for every transaction and vault access.',
  },
  {
    icon: Activity,
    title: 'Real-Time Auditing',
    desc: 'Immutable activity logs, cash flow, and terminal health.',
  },
]

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', full_name: '', email: '', role: 'cashier', password: '', confirm_password: '' })
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!agreed) { toast.error('Please accept the terms to continue'); return }
    if (form.password !== form.confirm_password) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      await registerUser(form)
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err: any) {
      const data = err?.response?.data
      const msg = typeof data === 'string' ? data
        : data?.username?.[0] || data?.email?.[0] || data?.password?.[0]
        || data?.non_field_errors?.[0] || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh', width: '100%',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'Inter, system-ui, sans-serif',
        background: '#080E1A',
      }}
    >
      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── LEFT dark panel ───────────────────────────────── */}
        <div
          style={{
            display: 'none',
            width: '45%', flexShrink: 0,
            background: '#0D1829',
            position: 'relative', overflow: 'hidden',
            flexDirection: 'column', justifyContent: 'space-between',
            padding: '40px 48px',
          }}
          className="register-left"
        >
          {/* Ambient glows */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', top: '-20%', left: '-20%', width: '70%', height: '70%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,119,182,0.18) 0%, transparent 70%)' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,38,59,0.6) 0%, transparent 70%)' }} />
            {/* Grid lines */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#90CAF9" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            {/* Concentric circles */}
            <svg style={{ position: 'absolute', bottom: '5%', right: '-10%', opacity: 0.08 }} width="420" height="420" viewBox="0 0 420 420">
              {[60, 110, 160, 210].map(r => (
                <circle key={r} cx="210" cy="210" r={r} fill="none" stroke="#90CAF9" strokeWidth="1" />
              ))}
            </svg>
          </div>

          {/* Small branding */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0077B6' }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#415A77' }}>
                VaultPoint POS
              </span>
            </div>
          </div>

          {/* Center content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2
              style={{
                fontFamily: 'Manrope, Inter, sans-serif',
                fontSize: 42, fontWeight: 800,
                lineHeight: 1.1, color: '#E2E8F0',
                margin: '0 0 16px',
              }}
            >
              The Sentinel's<br />Vault
            </h2>
            <p style={{ fontSize: 13, color: '#415A77', lineHeight: 1.7, margin: '0 0 40px', maxWidth: 320 }}>
              Secure your point of commerce with architectural precision. Start your enterprise journey today.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: 'rgba(0,119,182,0.15)',
                      border: '1px solid rgba(0,119,182,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Icon size={16} color="#90CAF9" />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#E2E8F0', margin: '0 0 3px' }}>{title}</p>
                    <p style={{ fontSize: 11, color: '#415A77', margin: 0, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VAULT watermark */}
          <div style={{ position: 'absolute', bottom: -10, right: -10, zIndex: 0, userSelect: 'none' }}>
            <span
              style={{
                fontFamily: 'Manrope, Inter, sans-serif',
                fontSize: 96, fontWeight: 900,
                color: 'rgba(255,255,255,0.03)',
                letterSpacing: '-0.02em',
              }}
            >
              VAULT
            </span>
          </div>
        </div>

        {/* ── RIGHT light panel (form) ──────────────────────── */}
        <div
          style={{
            flex: 1,
            background: 'white',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '40px 0',
          }}
        >
          <div
            style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              padding: '0 48px',
            }}
          >
            <div style={{ width: '100%', maxWidth: 420 }}>
              {/* Heading */}
              <h1
                style={{
                  fontFamily: 'Manrope, Inter, sans-serif',
                  fontSize: 26, fontWeight: 800,
                  color: '#1B263B', margin: '0 0 6px',
                }}
              >
                Create Account
              </h1>
              <p style={{ fontSize: 12, color: '#415A77', margin: '0 0 32px' }}>
                Join VaultPoint POS for enterprise retail operations.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Username */}
                <Field label="Username" icon={<AtSign size={13} color="#778DA9" />}>
                  <input
                    value={form.username}
                    onChange={set('username')}
                    placeholder="e.g. john_doe"
                    required
                    autoFocus
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>

                {/* Full Name */}
                <Field label="Full Name" icon={<User size={13} color="#778DA9" />}>
                  <input
                    value={form.full_name}
                    onChange={set('full_name')}
                    placeholder="John Doe"
                    required
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>

                {/* Email */}
                <Field label="Email" icon={<AtSign size={13} color="#778DA9" />}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="john@store.com"
                    style={inputStyle}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                </Field>

                {/* Role */}
                <div>
                  <label style={{ display: 'block', fontSize: 9, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#778DA9', marginBottom: 7 }}>
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={set('role')}
                    required
                    style={{ ...inputStyle, paddingLeft: 14, appearance: 'none' }}
                    onFocus={focusStyle as any}
                    onBlur={blurStyle as any}
                  >
                    <option value="cashier">Cashier</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Password */}
                <Field label="Password" icon={<Lock size={13} color="#778DA9" />}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={set('password')}
                    placeholder="••••••••••••"
                    required
                    minLength={8}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#778DA9', padding: 0, display: 'flex' }}
                  >
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </Field>

                {/* Confirm Password */}
                <Field label="Confirm Password" icon={<Lock size={13} color="#778DA9" />}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirm_password}
                    onChange={set('confirm_password')}
                    placeholder="••••••••••••"
                    required
                    minLength={8}
                    style={{ ...inputStyle, paddingRight: 40 }}
                    onFocus={focusStyle}
                    onBlur={blurStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(v => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#778DA9', padding: 0, display: 'flex' }}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </Field>

                {/* Terms checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={e => setAgreed(e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: '#1B263B', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 11, color: '#415A77', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <span style={{ color: '#0077B6', fontWeight: 600, cursor: 'pointer' }}>Terms of Service</span>
                    {' '}and{' '}
                    <span style={{ color: '#0077B6', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', padding: '13px',
                    background: loading ? '#415A77' : '#1B263B',
                    border: 'none', borderRadius: 10,
                    fontSize: 13, fontWeight: 700,
                    color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.15s',
                    boxShadow: '0 4px 16px rgba(27,38,59,0.2)',
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#0077B6' }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = '#1B263B' }}
                >
                  {loading ? (
                    <>
                      <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                      Creating Account…
                    </>
                  ) : 'Create Account'}
                </button>
              </form>

              {/* Sign in link */}
              <p style={{ textAlign: 'center', fontSize: 12, color: '#415A77', marginTop: 20 }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{ fontSize: 12, fontWeight: 700, color: '#1B263B', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0077B6'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#1B263B'}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '0 48px' }}>
            {['Privacy Policy', 'Terms of Service', 'Security Architecture', 'Support'].map(link => (
              <button
                key={link}
                type="button"
                style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer',
                  transition: 'color 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#415A77'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#94A3B8'}
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (min-width: 768px) {
          .register-left { display: flex !important; }
        }
      `}</style>
    </div>
  )
}

/* ── Shared field wrapper ──────────────────────────────────────── */
function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          display: 'block', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: '#778DA9', marginBottom: 7,
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex' }}>
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box',
  padding: '10px 12px 10px 34px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: 10, fontSize: 13,
  color: '#1B263B', outline: 'none',
  fontFamily: 'Inter, sans-serif',
  transition: 'border-color 0.15s',
}

const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#0077B6'
  e.target.style.background = '#F0F6FF'
}

const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.target.style.borderColor = '#E2E8F0'
  e.target.style.background = '#F8FAFC'
}
