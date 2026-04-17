import { useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { uploadAvatar } from '../../lib/storage'

const NAV_ALL = [
  {
    to: '/', end: true,
    label: 'Schedule',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2.5"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    to: '/new-booking', end: false,
    label: 'New Booking',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14"/>
        <rect x="3" y="3" width="18" height="18" rx="2.5"/>
      </svg>
    ),
  },
  {
    to: '/users', end: false, adminOnly: true,
    label: 'Team',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { session, profile, role, roleLabel, signOut, refreshProfile } = useAuth()
  const fileRef   = useRef(null)
  const [uploading, setUploading] = useState(false)

  const links = NAV_ALL.filter((n) => !n.adminOnly || role === 'admin')

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0]
    if (!file || !session?.user?.id) return
    setUploading(true)
    try {
      await uploadAvatar(session.user.id, file)
      await refreshProfile()
    } catch (err) {
      console.error('Avatar upload failed:', err)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || '—'

  return (
    <aside
      className="fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col"
      style={{ background: 'linear-gradient(180deg, #1c1714 0%, #171310 100%)' }}
    >
      {/* Logo */}
      <div className="flex h-[68px] shrink-0 items-center px-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <img
          src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
          alt="Logo"
          className="h-9 object-contain"
          style={{ filter: 'brightness(0) invert(1) drop-shadow(0 0 6px rgba(255,255,255,0.4))', opacity: 1 }}
        />
      </div>

      {/* Nav section label */}
      <div className="px-5 pb-1.5 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Navigation
        </p>
      </div>

      {/* Nav links */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className="block"
          >
            {({ isActive }) => (
              <span
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium select-none cursor-pointer"
                style={
                  isActive
                    ? { background: 'rgba(160,125,46,0.18)', color: '#c9a24a' }
                    : { color: 'rgba(255,255,255,0.5)' }
                }
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
                onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' } }}
              >
                <span style={{ color: isActive ? '#c9a24a' : 'rgba(255,255,255,0.3)' }}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: '#c9a24a' }} />
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* User footer */}
      <div className="shrink-0 p-4 space-y-3">

        {/* Avatar + info — links to profile page */}
        <Link
          to="/profile"
          className="flex items-center gap-3 rounded-xl px-2 py-2 group/profile"
          style={{ textDecoration: 'none' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
        >
          <div className="relative shrink-0">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              email={profile?.email}
              size="md"
            />
            {/* Upload overlay — clicking avatar area opens file input */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileRef.current?.click() }}
              disabled={uploading}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/profile:opacity-100"
              title="Change photo"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4" fill="white"/>
              </svg>
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium leading-tight truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {displayName}
            </p>
            <p className="mt-0.5 text-[11px] font-medium truncate" style={{ color: '#c9a24a' }}>
              {roleLabel}
            </p>
          </div>

          {/* Chevron */}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
               className="shrink-0 opacity-0 group-hover/profile:opacity-100"
               style={{ color: 'rgba(255,255,255,0.4)' }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </Link>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        {/* Sign out */}
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-[13px] font-medium cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.35)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>
    </aside>
  )
}
