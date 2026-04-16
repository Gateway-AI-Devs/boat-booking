import { useState, useEffect } from 'react'
import { fetchCalendarEvents } from '../lib/ghl'

export function useCalendarEvents(calendarId) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (!calendarId) return

    const now       = Date.now()
    const startTime = new Date(now - 180 * 24 * 60 * 60 * 1000) // 6 months ago
    const endTime   = new Date(now + 548 * 24 * 60 * 60 * 1000) // 18 months ahead

    setLoading(true)
    setError(null)

    fetchCalendarEvents({
      calendarId,
      locationId: import.meta.env.VITE_GHL_LOCATION_ID,
      startTime,
      endTime,
    })
      .then((data) => setAppointments(data))
      .catch((err)  => setError(err.message))
      .finally(()   => setLoading(false))
  }, [calendarId])

  return { appointments, loading, error }
}
