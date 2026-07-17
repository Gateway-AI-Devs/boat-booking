import { useState, useMemo, useEffect } from 'react'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import { useAuth } from '../../context/AuthContext'
import AppointmentCard from './AppointmentCard'
import Spinner from '../ui/Spinner'
import { greeting, formattedDate, applyFilter, TIMEZONE, getMadridDateStr, getDayLabel, getDateSubLabel } from '../../utils/dateUtils'

export default function AppointmentList({
  calendarId, calendarIds, title, showGreeting = true,
  filter: externalFilter, search: externalSearch,
  startDate: externalStartDate, endDate: externalEndDate,
}) {
  const { profile, role } = useAuth()
  const { appointments, loading, error, refetch } = useCalendarEvents(calendarIds ?? calendarId)

  // Use external filter state when provided (admin/agent), internal otherwise (captain)
  const [internalFilter, setInternalFilter] = useState('upcoming')
  const [internalSearch, setInternalSearch] = useState('')
  const [internalStartDate, setInternalStartDate] = useState('')
  const [internalEndDate, setInternalEndDate] = useState('')

  const filter = externalFilter ?? internalFilter
  const search = externalSearch ?? internalSearch
  const startDate = externalStartDate ?? internalStartDate
  const endDate = externalEndDate ?? internalEndDate

  const [page, setPage] = useState(1)
  const PAGE_SIZE = 12

  const matchesDateRange = (appt) => {
    const rawDate = appt.startTime ?? appt.start ?? appt.appointmentTime ?? appt.date ?? appt.datetime
    if (!rawDate) return true
    const dateValue = new Date(rawDate)
    if (Number.isNaN(dateValue.getTime())) return true
    const bookingDate = getMadridDateStr(dateValue)
    if (startDate && bookingDate < startDate) return false
    if (endDate && bookingDate > endDate) return false
    return true
  }

  const filtered = useMemo(() => {
    const base = filter === 'all' ? appointments : applyFilter(appointments, filter)
    const filteredBase = filter === 'all' && (startDate || endDate)
      ? base.filter(matchesDateRange)
      : base
    if (!search.trim()) return filteredBase
    const q = search.trim().toLowerCase()
    return filteredBase.filter((a) => {
      const t = (a.title ?? a.name ?? a.eventTitle ?? '').toLowerCase()
      const c = (a.contact?.name ?? a.contact?.firstName ?? a.contactName ?? '').toLowerCase()
      return t.includes(q) || c.includes(q)
    })
  }, [appointments, filter, search, startDate, endDate])

  useEffect(() => { setPage(1) }, [filter, search, startDate, endDate])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pagedAppointments = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const grouped = useMemo(() => {
    const groups = {}
    pagedAppointments.forEach((appt) => {
      const raw = appt.startTime ?? appt.start ?? appt.appointmentTime
      const dt = new Date(raw)
      const key = Number.isNaN(dt.getTime()) ? 'unknown' : getMadridDateStr(dt)
      if (!groups[key]) groups[key] = { date: dt, items: [], key }
      groups[key].items.push(appt)
    })
    return Object.values(groups).sort((a, b) => {
      if (a.key === 'unknown') return 1
      if (b.key === 'unknown') return -1
      return a.date - b.date
    })
  }, [pagedAppointments])

  const displayName = profile?.full_name?.split(' ')[0] || profile?.email?.split('@')[0] || ''

  const hasControls = externalFilter === undefined

  return (
    <div>
      {/* Page header */}
      {showGreeting && (
        <div className="mb-6">
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

      {/* Inline controls for captain view (no external filter) */}
      {hasControls && (
        <div className="mb-5 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={internalSearch}
              onChange={(e) => setInternalSearch(e.target.value)}
              placeholder="Search bookings…"
              className="flex-1 rounded-xl border bg-[#fefcf9] px-4 py-2 text-[13px] outline-none"
              style={{ borderColor: '#e8e3db', color: '#1c1c1a' }}
              onFocus={(e) => { e.target.style.borderColor = '#a07d2e' }}
              onBlur={(e) => { e.target.style.borderColor = '#e8e3db' }}
            />
          </div>
          <div className="flex items-center gap-1">
            {['upcoming', 'today', 'week', 'all'].map((id) => (
              <button
                key={id}
                onClick={() => setInternalFilter(id)}
                className="rounded-lg px-3 py-1 text-[12px] font-medium"
                style={{
                  background: internalFilter === id ? '#a07d2e' : 'transparent',
                  color: internalFilter === id ? '#fff' : '#888',
                }}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-20">
          <Spinner size="lg" />
          <p className="text-sm" style={{ color: '#aaa' }}>Loading schedule…</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl px-8 py-12 text-center" style={{ background: '#fff1f2', border: '1px solid #fecdd3' }}>
          <p className="text-3xl mb-3">⚠️</p>
          <p className="font-semibold" style={{ color: '#be123c' }}>Could not load appointments</p>
          <p className="mt-1 text-sm" style={{ color: '#e11d48' }}>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'rgba(160,125,46,0.08)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a07d2e" strokeWidth="1.5">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: '#1c1c1a' }}>No bookings found</p>
          <p className="text-sm" style={{ color: '#aaa' }}>
            {search ? `No results for "${search}"` : 'Try switching to "All" to see past bookings.'}
          </p>
        </div>
      )}

      {/* Schedule grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-[12px]" style={{ color: '#888' }}>
            <span>
              Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            {filtered.length > PAGE_SIZE && (
              <span>Page {page} of {totalPages}</span>
            )}
          </div>

          {grouped.map((group) => (
            <div key={group.key}>
              <div className="flex items-center justify-between mb-2.5 mt-1 first:mt-0">
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: group.key !== 'unknown' && getMadridDateStr(group.date) === getMadridDateStr(new Date()) ? '#a07d2e' : '#dededb' }}
                  />
                  <div>
                    <h3 className="text-[13px] font-semibold leading-tight" style={{ color: '#1c1c1a' }}>
                      {group.key !== 'unknown' ? getDayLabel(group.date) : 'Unknown date'}
                    </h3>
                    {group.key !== 'unknown' && (
                      <p className="text-[11px]" style={{ color: '#aaa' }}>{getDateSubLabel(group.date)}</p>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-medium rounded-full px-2.5 py-0.5" style={{ background: 'rgba(160,125,46,0.07)', color: '#a07d2e' }}>
                  {group.items.length} booking{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {group.items.map((appt) => (
                  <AppointmentCard key={appt.id ?? appt.startTime} appt={appt} showContact={role === 'admin'} />
                ))}
              </div>
            </div>
          ))}

          {filtered.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3" style={{ borderColor: '#e8e3db', background: '#fefcf9' }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-40 cursor-pointer"
                style={{ background: '#f7f2e8', color: '#7a5f22' }}
              >
                Previous
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className="h-8 min-w-8 rounded-lg text-[13px] font-semibold cursor-pointer"
                    style={page === pageNumber
                      ? { background: '#a07d2e', color: '#fff' }
                      : { background: '#f7f2e8', color: '#7a5f22' }
                    }
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-40 cursor-pointer"
                style={{ background: '#f7f2e8', color: '#7a5f22' }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
