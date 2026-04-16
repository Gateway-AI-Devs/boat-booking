import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    to: '/',
    end: true,
    label: 'Schedule',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    to: '/new-booking',
    end: false,
    label: 'New Booking',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
  },
]

export default function Sidebar() {
  const { roleLabel, signOut } = useAuth()

  return (
    <aside className="fixed inset-y-0 left-0 flex w-56 flex-col border-r border-[#e2ddd5] bg-white">

      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center border-b border-[#e2ddd5] px-5">
        <img
          src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
          alt="Logo"
          className="h-9 object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[rgba(160,125,46,0.08)] text-brand-gold'
                  : 'text-[#666] hover:bg-brand-bg hover:text-brand-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-brand-gold' : 'text-[#aaa]'}>
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#e2ddd5] px-4 py-4 space-y-3">
        <div
          className="w-full rounded-lg px-3 py-2 text-center text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{ background: 'rgba(160,125,46,0.08)', color: '#a07d2e' }}
        >
          {roleLabel}
        </div>

        <button
          onClick={signOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[#999] transition-colors hover:bg-brand-bg hover:text-brand-text"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign out
        </button>
      </div>

    </aside>
  )
}
