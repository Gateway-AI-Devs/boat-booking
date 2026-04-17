import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { uploadAvatar } from '../lib/storage'
import { useAuth } from '../context/AuthContext'
import Avatar from '../components/ui/Avatar'
import Spinner from '../components/ui/Spinner'
import PasswordInput from '../components/ui/PasswordInput'

const ROLE_META = {
  'puravida-captain': { label: 'PuraVida Captain', bg: '#f0faf1', color: '#1e7e34' },
  'fantasea-captain': { label: 'FantaSea Captain', bg: '#eff6ff', color: '#1d4ed8' },
  'admin':            { label: 'Admin',            bg: '#fffbeb', color: '#b45309' },
}

function Section({ title, subtitle, children }) {
  return (
    <div
      className="rounded-2xl bg-white p-7"
      style={{ border: '1px solid #ede8e0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <div className="mb-6" style={{ borderBottom: '1px solid #f2ede6', paddingBottom: '20px' }}>
        <h2 className="text-[15px] font-semibold" style={{ color: '#1c1c1a' }}>{title}</h2>
        {subtitle && <p className="mt-0.5 text-[13px]" style={{ color: '#aaa' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] mb-2" style={{ color: '#999' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border bg-[#fafaf9] px-4 py-3 text-[14px] outline-none"
      style={{ borderColor: '#e2ddd5', color: '#1c1c1a' }}
      onFocus={(e) => { e.target.style.borderColor = '#a07d2e'; e.target.style.boxShadow = '0 0 0 3px rgba(160,125,46,0.12)' }}
      onBlur={(e)  => { e.target.style.borderColor = '#e2ddd5'; e.target.style.boxShadow = 'none' }}
    />
  )
}

function Toast({ type, message }) {
  if (!message) return null
  const styles = {
    success: { bg: '#f0faf1', color: '#1e7e34', border: '#bbf7d0' },
    error:   { bg: '#fff1f2', color: '#be123c', border: '#fecdd3' },
  }
  const s = styles[type]
  return (
    <div
      className="rounded-xl px-4 py-3 text-[13px] font-medium"
      style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}
    >
      {message}
    </div>
  )
}

export default function ProfilePage() {
  const { session, profile, refreshProfile } = useAuth()
  const fileRef = useRef(null)

  // Info form
  const [fullName, setFullName]     = useState(profile?.full_name ?? '')
  const [infoSaving, setInfoSaving] = useState(false)
  const [infoMsg,    setInfoMsg]    = useState({ type: '', text: '' })

  // Password form
  const [currentPw, setCurrentPw]   = useState('')
  const [newPw,     setNewPw]       = useState('')
  const [confirmPw, setConfirmPw]   = useState('')
  const [pwSaving,  setPwSaving]    = useState(false)
  const [pwMsg,     setPwMsg]       = useState({ type: '', text: '' })

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarSrc, setAvatarSrc] = useState(profile?.avatar_url)

  const roleMeta = ROLE_META[profile?.role] ?? { label: profile?.role, bg: '#f4f4f2', color: '#666' }

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return
    setAvatarUploading(true)
    try {
      const url = await uploadAvatar(session.user.id, file)
      setAvatarSrc(url)
      await refreshProfile()
    } catch (err) {
      console.error(err)
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  async function handleInfoSave(e) {
    e.preventDefault()
    setInfoSaving(true)
    setInfoMsg({ type: '', text: '' })
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', session.user.id)
    if (error) {
      setInfoMsg({ type: 'error', text: error.message })
    } else {
      await refreshProfile()
      setInfoMsg({ type: 'success', text: 'Profile updated successfully.' })
    }
    setInfoSaving(false)
  }

  async function handlePasswordSave(e) {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })
    if (newPw !== confirmPw) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (newPw.length < 6) {
      setPwMsg({ type: 'error', text: 'Password must be at least 6 characters.' })
      return
    }
    setPwSaving(true)
    // Re-authenticate to verify current password
    const { error: reAuthError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: currentPw,
    })
    if (reAuthError) {
      setPwMsg({ type: 'error', text: 'Current password is incorrect.' })
      setPwSaving(false)
      return
    }
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      setPwMsg({ type: 'error', text: error.message })
    } else {
      setPwMsg({ type: 'success', text: 'Password changed successfully.' })
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    }
    setPwSaving(false)
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-[30px] leading-tight font-normal"
          style={{ fontFamily: "'Playfair Display', serif", color: '#1c1c1a', letterSpacing: '-0.02em' }}
        >
          My Profile
        </h1>
        <p className="mt-1 text-[13.5px]" style={{ color: '#aaa' }}>Manage your account information</p>
      </div>

      <div className="space-y-5">

        {/* ── Avatar section ── */}
        <Section title="Photo" subtitle="Click your avatar to upload a new photo">
          <div className="flex items-center gap-6">
            <button
              onClick={() => fileRef.current?.click()}
              disabled={avatarUploading}
              className="relative group shrink-0 cursor-pointer"
              title="Change photo"
            >
              <Avatar src={avatarSrc} name={profile?.full_name} email={profile?.email} size="xl"
                      className={avatarUploading ? 'opacity-60' : ''} />
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/35 opacity-0 group-hover:opacity-100">
                {avatarUploading
                  ? <Spinner size="sm" />
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4" fill="white"/>
                    </svg>
                }
              </span>
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

            <div>
              <p className="font-semibold text-[15px]" style={{ color: '#1c1c1a' }}>
                {profile?.full_name || profile?.email?.split('@')[0] || '—'}
              </p>
              <p className="text-[13px] mt-0.5" style={{ color: '#aaa' }}>{profile?.email}</p>
              <span
                className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide"
                style={{ background: roleMeta.bg, color: roleMeta.color }}
              >
                {roleMeta.label}
              </span>
            </div>
          </div>
        </Section>

        {/* ── Profile info ── */}
        <Section title="Personal Information" subtitle="Update your display name">
          <form onSubmit={handleInfoSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Email address">
                <Input type="email" value={profile?.email ?? ''} readOnly
                  style={{ opacity: 0.6, cursor: 'not-allowed' }} />
              </Field>
            </div>

            <Toast type={infoMsg.type} message={infoMsg.text} />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={infoSaving}
                className="rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)', boxShadow: '0 2px 8px rgba(160,125,46,0.3)' }}
              >
                {infoSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Section>

        {/* ── Change password ── */}
        <Section title="Change Password" subtitle="Use a strong password of at least 6 characters">
          <form onSubmit={handlePasswordSave} className="space-y-4">
            <Field label="Current password">
              <PasswordInput value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" required />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="New password">
                <PasswordInput value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="••••••••" required />
              </Field>
              <Field label="Confirm new password">
                <PasswordInput value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" required />
              </Field>
            </div>

            <Toast type={pwMsg.type} message={pwMsg.text} />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={pwSaving}
                className="rounded-xl px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #c9a24a 0%, #a07d2e 100%)', boxShadow: '0 2px 8px rgba(160,125,46,0.3)' }}
              >
                {pwSaving ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </Section>

      </div>
    </div>
  )
}
