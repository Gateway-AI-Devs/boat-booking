import { useState, useEffect, useCallback } from 'react'
import { fetchCalendarEvents } from '../lib/ghl'

export function useCalendarEvents(calendarIdOrIds) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [tick, setTick]                 = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  const idKey = Array.isArray(calendarIdOrIds) ? calendarIdOrIds.join(',') : (calendarIdOrIds ?? '')

  useEffect(() => {
    if (!calendarIdOrIds) return

    const ids = [...new Set((Array.isArray(calendarIdOrIds) ? calendarIdOrIds : [calendarIdOrIds]).filter(Boolean))]
    if (ids.length === 0) return

    const now       = Date.now()
    const startTime = new Date(now - 90  * 24 * 60 * 60 * 1000)
    const endTime   = new Date(now + 365 * 24 * 60 * 60 * 1000)
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
  }, [idKey, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  return { appointments, loading, error, refetch }
}
