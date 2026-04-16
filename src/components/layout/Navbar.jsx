import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { role, roleLabel, signOut } = useAuth()

  return (
    <header className="border-b border-[#e2ddd5] bg-white px-6 py-3.5 flex items-center justify-between">

      {/* Logo */}
      <Link to="/">
        <img
          src="https://assets.cdn.filesafe.space/H5rfWkaGUSkf4Mrb0wo5/media/69839edb26ea64f202a8aefc.png"
          alt="Logo"
          className="h-11 object-contain"
          style={{ mixBlendMode: 'multiply' }}
        />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3.5">
        {role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors ${
                isActive ? 'text-brand-gold' : 'text-[#888] hover:text-brand-gold'
              }`
            }
          >
            Admin
          </NavLink>
        )}

        <span
          className="rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em]"
          style={{
            background: 'rgba(160,125,46,0.1)',
            color: '#a07d2e',
            borderColor: 'rgba(160,125,46,0.4)',
          }}
        >
          {roleLabel}
        </span>

        <button
          onClick={signOut}
          className="text-[12px] text-[#888] underline hover:text-brand-text transition-colors bg-none border-none cursor-pointer"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}
