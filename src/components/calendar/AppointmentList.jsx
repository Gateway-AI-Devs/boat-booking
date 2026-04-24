import { useState, useMemo } from 'react'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import { useAuth } from '../../context/AuthContext'
import AppointmentCard from './AppointmentCard'
import Spinner from '../ui/Spinner'
import { greeting, formattedDate, applyFilter } from '../../utils/dateUtils'

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming'  },
  { id: 'today',    label: 'Today'     },
  { id: 'week',     label: 'This week' },
  { id: 'all',      label: 'All'       },
]

export default function AppointmentList({ calendarId, calendarIds, title, showGreeting = true }) {
  const { profile, role } = useAuth()
  const { appointments, loading, error } = useCalendarEvents(calendarIds ?? calendarId)
  const [filter, setFilter] = useState('upcoming')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const base = applyFilter(appointments, filter)
    if (!search.trim()) return base
    const q = search.trim().toLowerCase()
    return base.filter((a) => {
      const t = (a.title ?? a.name ?? a.eventTitle ?? '').toLowerCase()
      const c = (a.contact?.name ?? a.contact?.firstName ?? a.contactName ?? '').toLowerCase()
      return t.includes(q) || c.includes(q)
    })
  }, [appointments, filter, search])

  const displayName = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || ''

  return (
    <div>
      {/* Page header */}
      {showGreeting && (
        <div className="mb-8">
          <p className="text-sm font-medium mb-1" style={{ color: '#a07d2e', letterSpacing: '0.02em' }}>
            {formattedDate()}
          </p>
          <h1
            className="text-[30px] leading-tight font-normal"
            style={{ fontFamily: "'Playfair Display', serif", color: '#1c1c1a', letterSpacing: '-0.02em' }}
          >
            {greeting()}{displayName ? `, ${displayName}` : ''}
          </h1>
          {title && (
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: '#a07d2e' }} />
              <p className="text-[13.5px] font-medium" style={{ color: '#888' }}>{title}</p>
            </div>
          )}
        </div>
      )}

      {/* Controls bar */}
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Segmented filter control */}
          <div
            className="inline-flex rounded-xl p-1 gap-0.5 overflow-x-auto max-w-full"
            style={{ background: '#fff', border: '1px solid #e8e3db', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
          >
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="rounded-lg px-4 py-1.5 text-[13px] font-medium"
                style={
                  filter === f.id
                    ? { background: '#a07d2e', color: '#fff', boxShadow: '0 1px 3px rgba(160,125,46,0.35)' }
                    : { color: '#888' }
                }
                onMouseEnter={(e) => { if (filter !== f.id) e.currentTarget.style.color = '#1c1c1a' }}
                onMouseLeave={(e) => { if (filter !== f.id) e.currentTarget.style.color = '#888' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Count pill */}
          {!loading && !error && (
            <span
              className="rounded-full px-3 py-1 text-[12px] font-semibold"
              style={{ background: 'rgba(160,125,46,0.1)', color: '#a07d2e' }}
            >
              {filtered.length} booking{filtered.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center" style={{ color: '#bbb' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by booking name or guest…"
            className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-10 text-[13.5px] outline-none"
            style={{ borderColor: '#e8e3db', color: '#1c1c1a', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}
            onFocus={(e) => { e.target.style.borderColor = '#a07d2e'; e.target.style.boxShadow = '0 0 0 3px rgba(160,125,46,0.12)' }}
            onBlur={(e)  => { e.target.style.borderColor = '#e8e3db'; e.target.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)' }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-3.5 flex items-center"
              style={{ color: '#bbb' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#888' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#bbb' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: '#aaa' }}>Loading schedule…</p>
        </div>
      )}

      {error && (
        <div className="rounded-2xl px-8 py-12 text-center" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <p className="text-3xl mb-3">⚠️</p>
          <p className="font-semibold" style={{ color: '#be123c' }}>Could not load appointments</p>
          <p className="mt-1 text-sm" style={{ color: '#e11d48' }}>{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(160,125,46,0.08)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: '#1c1c1a' }}>No bookings found</p>
          <p className="text-sm" style={{ color: '#aaa' }}>
            {search ? `No results for "${search}"` : 'Try switching to "All" to see past bookings.'}
          </p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((appt) => (
            <AppointmentCard key={appt.id ?? appt.startTime} appt={appt} showContact={role === 'admin'} />
          ))}
        </div>
      )}
    </div>
  )
}
