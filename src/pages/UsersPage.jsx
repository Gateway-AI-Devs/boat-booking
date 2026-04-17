import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { uploadAvatar } from '../lib/storage'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import Spinner from '../components/ui/Spinner'
import PasswordInput from '../components/ui/PasswordInput'

const ROLE_OPTIONS = [
  { value: 'puravida-captain', label: 'PuraVida Captain' },
  { value: 'fantasea-captain', label: 'FantaSea Captain' },
  { value: 'admin',            label: 'Admin' },
]

const ROLE_META = {
  'puravida-captain': { bg: '#f0faf1', color: '#1e7e34', dot: '#22c55e' },
  'fantasea-captain': { bg: '#eff6ff', color: '#1d4ed8', dot: '#3b82f6' },
  'admin':            { bg: '#fffbeb', color: '#b45309', dot: '#f59e0b' },
}

function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [message, onDone])

  return (
    <div
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 rounded-2xl px-5 py-3.5 text-[13.5px] font-medium"
      style={{
        background: '#111',
        color: '#fff',
        boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
        pointerEvents: message ? 'auto' : 'none',
        opacity: message ? 1 : 0,
        transform: message ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.22s, transform 0.22s',
      }}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ background: '#22c55e' }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </span>
      {message}
    </div>
  )
}

function DeleteConfirmModal({ user, onConfirm, onCancel, deleting }) {
  const [typed, setTyped] = useState('')
  const confirmName = user?.full_name || user?.email?.split('@')[0] || ''
  const match = typed.trim().toLowerCase() === confirmName.toLowerCase()

  if (!user) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div
          className="pointer-events-auto w-full max-w-[420px] rounded-2xl bg-white p-7"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)', border: '1px solid #ede8e0' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl mb-5" style={{ background: '#fff1f2' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e11d48" strokeWidth="1.8" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
          </div>

          <h2 className="text-[17px] font-semibold mb-1" style={{ color: '#1c1c1a' }}>Remove team member</h2>
          <p className="text-[13.5px] mb-5" style={{ color: '#888' }}>
            This will permanently delete <span className="font-semibold" style={{ color: '#1c1c1a' }}>{user.email}</span> and cannot be undone.
          </p>

          <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
            Type <span style={{ color: '#1c1c1a', fontStyle: 'italic' }}>{confirmName}</span> to confirm
          </label>
          <input
            autoFocus
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && match) onConfirm() }}
            placeholder={confirmName}
            className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 text-[14px] outline-none mb-5"
            style={{ borderColor: typed && match ? '#22c55e' : '#e2ddd5', color: '#1c1c1a' }}
            onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px rgba(225,29,72,0.10)' }}
            onBlur={(e)  => { e.target.style.boxShadow = 'none' }}
          />

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 rounded-xl border py-2.5 text-[13.5px] font-medium"
              style={{ borderColor: '#e2ddd5', color: '#666', background: '#fafaf9' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#f4f4f2' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#fafaf9' }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!match || deleting}
              className="flex-1 rounded-xl py-2.5 text-[13.5px] font-semibold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)', boxShadow: match ? '0 4px 14px rgba(225,29,72,0.3)' : 'none' }}
            >
              {deleting ? 'Removing…' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function RoleBadge({ role }) {
  const m = ROLE_META[role] ?? { bg: '#f4f4f2', color: '#666', dot: '#aaa' }
  const label = ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide"
          style={{ background: m.bg, color: m.color }}>
      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: m.dot }} />
      {label}
    </span>
  )
}

function UserCard({ user, isSelf, onAvatarUpdated, onDeleteRequest }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(user.avatar_url)

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadAvatar(user.id, file)
      setAvatarSrc(url)
      onAvatarUpdated(user.id, url)
    } catch (err) { console.error(err) }
    finally { setUploading(false); e.target.value = '' }
  }

  return (
    <div
      className="group relative rounded-2xl bg-white p-5 flex flex-col gap-4"
      style={{ border: '1px solid #ede8e0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s, border-color 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d4b96a'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(160,125,46,0.08)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ede8e0'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      {/* Delete btn */}
      {!isSelf && (
        <button
          onClick={() => onDeleteRequest(user)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 rounded-lg p-1.5 transition-opacity"
          style={{ color: '#ccc', background: '#f9f9f8' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#e11d48'; e.currentTarget.style.background = '#fff1f2' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#ccc'; e.currentTarget.style.background = '#f9f9f8' }}
          title="Remove user"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </button>
      )}

      {/* Avatar + name */}
      <div className="flex items-center gap-3.5">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="relative group/av shrink-0 cursor-pointer"
          title="Change photo"
        >
          <Avatar src={avatarSrc} name={user.full_name} email={user.email} size="lg"
                  className={uploading ? 'opacity-50' : ''} />
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 group-hover/av:opacity-100">
            {uploading
              ? <Spinner size="sm" />
              : <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4" fill="white"/>
                </svg>
            }
          </span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold truncate" style={{ color: '#1c1c1a' }}>
            {user.full_name || '—'}
            {isSelf && <span className="ml-2 text-[10px] font-normal" style={{ color: '#aaa' }}>you</span>}
          </p>
          <p className="text-[12px] truncate mt-0.5" style={{ color: '#aaa' }}>{user.email}</p>
        </div>
      </div>

      {/* Role + joined */}
      <div className="flex items-center justify-between">
        <RoleBadge role={user.role} />
        <span className="text-[11px]" style={{ color: '#ccc' }}>
          {new Date(user.created_at).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  )
}

/* ── Slide-over panel for adding a new user ── */
function AddUserPanel({ isOpen, onClose, onAdded }) {
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
                  onChange={(e) => { setter(e.target.value); setError(''); setSuccess('') }}
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
                onChange={(e) => { setPassword(e.target.value); setError(''); setSuccess('') }}
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

/* ── Main page ── */
export default function UsersPage() {
  const { profile: currentProfile } = useAuth()
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [panelOpen,  setPanelOpen]  = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting,   setDeleting]   = useState(false)
  const [toast,      setToast]      = useState('')

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setUsers(data ?? [])
    setLoading(false)
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    const name = deleteTarget.full_name || deleteTarget.email?.split('@')[0] || 'User'
    await supabase.functions.invoke('delete-user', { body: { userId: deleteTarget.id } })
    setUsers((prev) => prev.filter((x) => x.id !== deleteTarget.id))
    setDeleting(false)
    setDeleteTarget(null)
    setToast(`${name} has been removed`)
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-[30px] leading-tight font-normal"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1c1c1a', letterSpacing: '-0.02em' }}
          >
            Team Members
          </h1>
          <p className="mt-1 text-[13.5px]" style={{ color: '#aaa' }}>
            {loading ? 'Loading…' : `${users.length} member${users.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        <button
          onClick={() => setPanelOpen(true)}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[13.5px] font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)', boxShadow: '0 4px 14px rgba(160,125,46,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(160,125,46,0.45)' }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(160,125,46,0.3)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Member
        </button>
      </div>

      {/* User cards grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(160,125,46,0.08)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: '#1c1c1a' }}>No team members yet</p>
          <p className="text-sm" style={{ color: '#aaa' }}>Click "Add Member" to create the first account.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              isSelf={u.id === currentProfile?.id}
              onAvatarUpdated={(id, url) =>
                setUsers((prev) => prev.map((x) => x.id === id ? { ...x, avatar_url: url } : x))
              }
              onDeleteRequest={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <AddUserPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onAdded={loadUsers}
      />

      <DeleteConfirmModal
        user={deleteTarget}
        deleting={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast} onDone={() => setToast('')} />
    </div>
  )
}
