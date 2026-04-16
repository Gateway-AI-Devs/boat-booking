import { useState, useMemo } from 'react'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import AppointmentCard from './AppointmentCard'
import Spinner from '../ui/Spinner'

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'today',    label: 'Today'    },
  { id: 'week',     label: 'This week' },
  { id: 'all',      label: 'All'      },
]

function applyFilter(appts, filter) {
  const now        = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd   = new Date(todayStart.getTime() + 86_400_000)
  const weekEnd    = new Date(todayStart.getTime() + 7 * 86_400_000)

  return appts
    .filter((a) => {
      const t = new Date(a.startTime ?? a.start ?? a.appointmentTime)
      if (filter === 'today')    return t >= todayStart && t < todayEnd
      if (filter === 'week')     return t >= todayStart && t < weekEnd
      if (filter === 'upcoming') return t >= now
      return true
    })
    .sort((a, b) =>
      new Date(a.startTime ?? a.start) - new Date(b.startTime ?? b.start)
    )
}

export default function AppointmentList({ calendarId, title }) {
  const { appointments, loading, error } = useCalendarEvents(calendarId)
  const [filter, setFilter] = useState('upcoming')

  const filtered = useMemo(
    () => applyFilter(appointments, filter),
    [appointments, filter]
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-1">
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}
            className="text-[26px] font-normal text-brand-text">
          {title ?? 'Upcoming Bookings'}
        </h1>
        <p className="mt-1 text-sm text-[#888]">
          {loading
            ? 'Loading appointments…'
            : `${filtered.length} booking${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="mt-5 mb-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
              filter === f.id
                ? 'border-brand-gold bg-brand-gold text-white'
                : 'border-brand-muted bg-white text-[#666] hover:border-brand-gold hover:text-brand-gold'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading && (
        <div className="flex flex-col items-center gap-4 py-16 text-[#888]">
          <Spinner size="lg" />
          <p className="text-sm">Loading schedule…</p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
          <p className="text-2xl mb-3">⚠️</p>
          <p className="font-semibold text-red-700">Could not load appointments</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-[#888]">
          <p className="text-4xl">📅</p>
          <p className="text-sm">No bookings found for this period.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {filtered.map((appt) => (
            <AppointmentCard key={appt.id ?? appt.startTime} appt={appt} />
          ))}
        </div>
      )}
    </div>
  )
}
