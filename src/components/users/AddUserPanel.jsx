import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ROLE_OPTIONS, ROLE_META } from '../../constants/roles'
import PasswordInput from '../ui/PasswordInput'

export default function AddUserPanel({ isOpen, onClose, onAdded }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role,     setRole]     = useState('puravida-captain')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess('')
    setSaving(true)

    const { data, error: fnError } = await supabase.functions.invoke('create-user', {
      body: { email, password, role, full_name: fullName },
    })

    setSaving(false)
    if (fnError || data?.error) {
      setError(fnError?.message ?? data?.error ?? 'Failed to create user.')
      return
    }
    setSuccess(`${email} added!`)
    setEmail(''); setPassword(''); setFullName(''); setRole('puravida-captain')
    onAdded()
    setTimeout(() => { setSuccess(''); onClose() }, 1200)
  }

  function clearMessages() { setError(''); setSuccess('') }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(4px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col bg-white"
        style={{
          boxShadow: '-12px 0 40px rgba(0,0,0,0.12)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-6" style={{ borderBottom: '1px solid #ede8e0' }}>
          <div>
            <h2 className="text-[17px] font-semibold" style={{ color: '#1c1c1a' }}>Add Team Member</h2>
            <p className="mt-0.5 text-[13px]" style={{ color: '#aaa' }}>Create a new crew account</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-2"
            style={{ color: '#aaa', background: '#f4f4f2' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#1c1c1a'; e.currentTarget.style.background = '#ede8e0' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#aaa'; e.currentTarget.style.background = '#f4f4f2' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <form id="add-user-form" onSubmit={handleSubmit} className="space-y-5">
            {[
              { label: 'Full Name',     value: fullName, setter: setFullName, type: 'text',  placeholder: 'e.g. John Smith',     required: false },
              { label: 'Email Address', value: email,    setter: setEmail,    type: 'email', placeholder: 'captain@example.com', required: true  },
            ].map(({ label, value, setter, type, placeholder, required }) => (
              <div key={label}>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
                  {label}{required && <span style={{ color: '#a07d2e' }}> *</span>}
                </label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => { setter(e.target.value); clearMessages() }}
                  placeholder={placeholder}
                  required={required}
                  className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 text-[14px] outline-none"
                  style={{ borderColor: '#e2ddd5', color: '#1c1c1a' }}
                  onFocus={(e) => { e.target.style.borderColor = '#a07d2e'; e.target.style.boxShadow = '0 0 0 3px rgba(160,125,46,0.12)' }}
                  onBlur={(e)  => { e.target.style.borderColor = '#e2ddd5'; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
                Password <span style={{ color: '#a07d2e' }}>*</span>
              </label>
              <PasswordInput
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearMessages() }}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
                Role <span style={{ color: '#a07d2e' }}>*</span>
              </label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map((r) => {
                  const m = ROLE_META[r.value]
                  const active = role === r.value
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left"
                      style={{
                        borderColor: active ? '#a07d2e' : '#e2ddd5',
                        background:  active ? 'rgba(160,125,46,0.04)' : '#fafaf9',
                        boxShadow:   active ? '0 0 0 3px rgba(160,125,46,0.12)' : 'none',
                      }}
                    >
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: m?.dot }} />
                      <span className="text-[13.5px] font-medium" style={{ color: active ? '#a07d2e' : '#555' }}>
                        {r.label}
                      </span>
                      {active && (
                        <span className="ml-auto">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {error && (
              <div className="rounded-xl px-4 py-3 text-[13px]" style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl px-4 py-3 text-[13px]" style={{ background: '#f0faf1', color: '#1e7e34', border: '1px solid #bbf7d0' }}>
                {success}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-7 py-5" style={{ borderTop: '1px solid #ede8e0' }}>
          <button
            type="submit"
            form="add-user-form"
            disabled={saving}
            className="w-full rounded-xl py-3.5 text-[13.5px] font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)', boxShadow: '0 4px 14px rgba(160,125,46,0.3)' }}
          >
            {saving ? 'Creating account…' : 'Create Account'}
          </button>
        </div>
      </div>
    </>
  )
}
