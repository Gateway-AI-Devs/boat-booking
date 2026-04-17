import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/ui/PasswordInput'

export default function LoginPage() {
  const { session, signIn } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  if (session) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
    } catch {
      setError('Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">

      {/* ── Left panel — brand ── */}
      <div
        className="hidden lg:flex w-[44%] shrink-0 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1c1714 0%, #0f0d0b 100%)' }}
      >
        {/* Radial glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 60% 30%, rgba(160,125,46,0.18) 0%, transparent 70%)' }}
        />

        {/* Subtle grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-14">
          <img
            src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
            alt="Logo"
            className="h-16 object-contain mb-10"
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
          />

          <h1
            className="text-[34px] font-normal leading-tight mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: 'rgba(255,255,255,0.92)', letterSpacing: '-0.02em' }}
          >
            Captain's Schedule
          </h1>

          <p className="text-[14px] leading-relaxed max-w-[260px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Your complete view of PuraVida &amp; FantaSea bookings — all in one place.
          </p>

          {/* Decorative dots */}
          <div className="flex items-center gap-2 mt-12">
            <span className="h-px w-16 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#a07d2e' }} />
            <span className="h-px w-16 rounded" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>
        </div>

        {/* Bottom badge */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span
            className="rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em]"
            style={{ background: 'rgba(160,125,46,0.15)', color: '#c9a24a', border: '1px solid rgba(160,125,46,0.25)' }}
          >
            Internal Use Only
          </span>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-brand-bg px-8 py-12">

        {/* Mobile logo */}
        <img
          src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
          alt="Logo"
          className="lg:hidden h-12 object-contain mb-8"
          style={{ mixBlendMode: 'multiply' }}
        />

        <div className="w-full max-w-[380px]">
          <div className="mb-8">
            <h2
              className="text-[26px] font-normal"
              style={{ fontFamily: "'Playfair Display', serif", color: '#1c1c1a', letterSpacing: '-0.02em' }}
            >
              Welcome back
            </h2>
            <p className="mt-1 text-[13.5px]" style={{ color: '#999' }}>Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder="captain@example.com"
                required
                className="w-full rounded-xl border bg-white px-4 py-3 text-[14px] outline-none"
                style={{ borderColor: '#e2ddd5', color: '#1c1c1a', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
                onFocus={(e) => { e.target.style.borderColor = '#a07d2e'; e.target.style.boxShadow = '0 0 0 3px rgba(160,125,46,0.12)' }}
                onBlur={(e)  => { e.target.style.borderColor = '#e2ddd5'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
                Password
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••"
                required
                inputStyle={{ background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
              />
            </div>

            {error && (
              <div
                className="rounded-xl px-4 py-3 text-[13px]"
                style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-xl py-3.5 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-white disabled:opacity-60"
              style={{
                background: loading ? '#a07d2e' : 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)',
                boxShadow: '0 4px 14px rgba(160,125,46,0.35)',
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.boxShadow = '0 6px 20px rgba(160,125,46,0.45)' }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(160,125,46,0.35)' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}
