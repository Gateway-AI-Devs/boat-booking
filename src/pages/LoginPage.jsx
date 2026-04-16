import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  { id: 'puravida-captain', label: 'PuraVida Captain',  code: 'puravida2026' },
  { id: 'fantasea-captain', label: 'FantaSea Captain',  code: 'fantasea2026' },
  { id: 'admin',            label: 'Admin',             code: 'admin2026'    },
]

export default function LoginPage() {
  const { role, signIn } = useAuth()
  const [pin, setPin]     = useState('')
  const [error, setError] = useState('')

  if (role) return <Navigate to="/" replace />

  function handleSubmit(e) {
    e.preventDefault()
    const match = ROLES.find((r) => r.code === pin.trim())
    if (match) {
      signIn(match.id)
    } else {
      setError('Incorrect access code. Try again.')
      setPin('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <div className="w-full max-w-[380px] rounded-2xl border border-brand-gold bg-white px-9 py-10 text-center shadow-sm">

        {/* Logo */}
        <img
          src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
          alt="Logo"
          className="mx-auto mb-5 h-14 object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />

        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-[22px] font-normal text-[#111] mb-1.5">
          Captain's Schedule
        </h1>
        <p className="mb-7 text-[13px] text-[#888]">Enter your access code to view bookings</p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError('') }}
            placeholder="••••••••••"
            maxLength={30}
            className="mb-3 w-full rounded-lg border border-brand-muted bg-[#fafaf9] px-4 py-3 text-center text-sm tracking-[0.15em] text-[#111] outline-none transition-colors focus:border-brand-gold"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          />

          {error && (
            <p className="mb-3 text-[12px] text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-brand-gold py-3 text-[13px] font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c09840]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View Schedule
          </button>
        </form>

        <p className="mt-5 text-[11px] text-[#bbb]">
          puravida2026 · fantasea2026 · admin2026
        </p>
      </div>
    </div>
  )
}
