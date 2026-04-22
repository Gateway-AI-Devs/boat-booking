import { useState, useEffect } from 'react'
import { fetchCalendarEvents } from '../lib/ghl'

export function useCalendarEvents(calendarIdOrIds) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (!calendarIdOrIds) return

    const ids = Array.isArray(calendarIdOrIds) ? calendarIdOrIds : [calendarIdOrIds]
    if (ids.length === 0) return

    const now       = Date.now()
    const startTime = new Date(now - 180 * 24 * 60 * 60 * 1000)
    const endTime   = new Date(now + 548 * 24 * 60 * 60 * 1000)
    const locationId = import.meta.env.VITE_GHL_LOCATION_ID

    setLoading(true)
    setError(null)

    Promise.all(
      ids.map((calendarId) => fetchCalendarEvents({ calendarId, locationId, startTime, endTime }))
    )
      .then((results) => {
        const merged = results.flat()
        merged.sort((a, b) => new Date(a.startTime ?? a.start) - new Date(b.startTime ?? b.start))
        setAppointments(merged)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [Array.isArray(calendarIdOrIds) ? calendarIdOrIds.join(',') : calendarIdOrIds]) // eslint-disable-line react-hooks/exhaustive-deps

  return { appointments, loading, error }
}
