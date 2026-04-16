import { useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { useCalendarEvents } from '../../hooks/useCalendarEvents'
import BookingModal from './BookingModal'
import Spinner from '../ui/Spinner'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
})

export default function BookingCalendar({ calendarId, title }) {
  const { events, loading, error } = useCalendarEvents(calendarId)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const eventPropGetter = useMemo(() => () => ({
    style: { backgroundColor: '#a07d2e', borderColor: '#8a6b25' },
  }), [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-brand-text/60">Loading bookings…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-red-200 bg-red-50 p-8">
        <div className="text-center">
          <p className="font-semibold text-red-700">Failed to load bookings</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-brand-muted bg-brand-bg p-4">
      {title && (
        <h2 className="mb-4 text-lg font-bold text-brand-text flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-brand-gold inline-block" />
          {title}
          <span className="ml-auto text-xs font-normal text-brand-text/50">{events.length} booking{events.length !== 1 ? 's' : ''}</span>
        </h2>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        defaultView="month"
        views={['month', 'week', 'day', 'agenda']}
        style={{ height: 620 }}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(ev) => setSelectedEvent(ev)}
        popup
      />

      {selectedEvent && (
        <BookingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  )
}
