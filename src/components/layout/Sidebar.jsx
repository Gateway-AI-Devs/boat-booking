import { useRef, useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Avatar from '../ui/Avatar'
import { uploadAvatar } from '../../lib/storage'
import logo from '../../assets/Logo-oneway-ibiza-main.png'

const NAV_GROUPS = [
  {
    id: 'internal',
    label: 'Internal Bookings',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2.5"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    items: [
      {
        to: '/', end: true,
        label: 'Schedule',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2.5"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        ),
      },
      {
        to: '/new-booking', end: false,
        label: 'New Booking',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14"/>
            <rect x="3" y="3" width="18" height="18" rx="2.5"/>
          </svg>
        ),
      },
      {
        to: '/users', end: false, adminOnly: true,
        label: 'Team',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        ),
      },
    ],
  },
  {
    id: 'enquiries',
    label: 'Enquiries',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    items: [
      {
        to: '/enquiries/club-tickets', end: false,
        label: 'Club Tickets & VIP Tickets',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
          </svg>
        ),
      },
      {
        to: '/enquiries/villas-hotel', end: false,
        label: 'Villas & Hotel',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        to: '/enquiries/island-transfer', end: false,
        label: 'Island Transfer',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 17l4-8 4 4 4-6 4 10H3z"/>
            <path d="M3 20h18"/>
          </svg>
        ),
      },
      {
        to: '/enquiries/car-hire', end: false,
        label: 'Car Hire',
        icon: (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-2"/>
            <circle cx="7.5" cy="17.5" r="2.5"/>
            <circle cx="17.5" cy="17.5" r="2.5"/>
          </svg>
        ),
      },
    ],
  },
]

function ChevronIcon({ open }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
        flexShrink: 0,
      }}
    >
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  )
}

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { session, profile, role, roleLabel, signOut, refreshProfile } = useAuth()
  const { pathname } = useLocation()
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [openGroups, setOpenGroups] = useState({
    internal: true,
    enquiries: pathname.startsWith('/enquiries'),
  })

  useEffect(() => {
    if (pathname.startsWith('/enquiries')) {
      setOpenGroups(prev => ({ ...prev, enquiries: true }))
    }
  }, [pathname])

  function toggleGroup(id) {
    setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }))
  }

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
      className="app-sidebar fixed inset-y-0 left-0 z-30 flex w-[240px] flex-col"
      style={{
        background: 'linear-gradient(180deg, #2e2208 0%, #1e1605 100%)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {/* Logo + mobile close button */}
      <div className="flex h-[80px] shrink-0 items-center justify-between px-6" style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
        <img src={logo} alt="Logo" className="h-12 object-contain" />
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-lg p-1.5 lg:hidden"
          style={{ color: '#888', background: '#f4f4f2' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      {/* Nav section label */}
      <div className="px-5 pb-1.5 pt-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: 'rgba(255,255,255,0.25)' }}>
          Navigation
        </p>
      </div>

      {/* Nav groups */}
      <nav className="sidebar-scroll flex-1 overflow-y-auto px-3 space-y-0.5 pb-4">
        {NAV_GROUPS.map((group) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || role === 'admin')
          const isOpen = openGroups[group.id]

          return (
            <div key={group.id}>
              {/* Group header / toggle */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold select-none cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.65)', background: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.65)' }}
              >
                <span style={{ color: 'rgba(255,255,255,0.35)' }}>{group.icon}</span>
                <span className="flex-1 text-left">{group.label}</span>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>
                  <ChevronIcon open={isOpen} />
                </span>
              </button>

              {/* Group items */}
              {isOpen && (
                <div className="mt-0.5 space-y-0.5" style={{ paddingLeft: '10px' }}>
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className="block"
                      onClick={onClose}
                    >
                      {({ isActive }) => (
                        <span
                          className="flex items-center gap-3 rounded-xl px-3 py-2 text-[13px] font-medium select-none cursor-pointer"
                          style={
                            isActive
                              ? { background: 'rgba(160,125,46,0.18)', color: '#c9a24a' }
                              : { color: 'rgba(255,255,255,0.45)' }
                          }
                          onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' } }}
                          onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}
                        >
                          <span style={{ color: isActive ? '#c9a24a' : 'rgba(255,255,255,0.25)' }}>
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
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0 16px' }} />

      {/* User footer */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3.5">

        {/* Avatar with upload overlay */}
        <div className="relative shrink-0 group/av">
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <Avatar
              src={profile?.avatar_url}
              name={profile?.full_name}
              email={profile?.email}
              size="md"
            />
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); fileRef.current?.click() }}
            disabled={uploading}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover/av:opacity-100"
            title="Change photo"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4" fill="white"/>
            </svg>
          </button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

        {/* Name + role */}
        <Link to="/profile" className="flex-1 min-w-0" style={{ textDecoration: 'none' }}>
          <p className="text-[13px] font-medium leading-tight truncate" style={{ color: 'rgba(255,255,255,0.88)' }}>
            {displayName}
          </p>
          <p className="mt-0.5 text-[11px] font-medium truncate" style={{ color: '#c9a24a' }}>
            {roleLabel}
          </p>
        </Link>

        {/* Sign out icon button */}
        <button
          onClick={signOut}
          title="Sign out"
          className="shrink-0 flex items-center justify-center rounded-lg p-2 cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}
