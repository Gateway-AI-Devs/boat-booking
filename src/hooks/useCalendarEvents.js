import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchCalendarEvents } from '../lib/ghl'

const CACHE_TTL = 10_000
const fetchCache = new Map()

export function useCalendarEvents(calendarIdOrIds) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)
  const requestIdRef = useRef(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  const idKey = Array.isArray(calendarIdOrIds) ? calendarIdOrIds.join(',') : (calendarIdOrIds ?? '')

  useEffect(() => {
    if (!calendarIdOrIds) return

    const ids = [...new Set((Array.isArray(calendarIdOrIds) ? calendarIdOrIds : [calendarIdOrIds]).filter(Boolean))]
    if (ids.length === 0) return

    const locationId = import.meta.env.VITE_GHL_LOCATION_ID
    const cacheKey = `${idKey}:${locationId}`
    const now = Date.now()
    const debounceMs = 150
    const startTime = new Date(now - 90 * 24 * 60 * 60 * 1000)
    const endTime = new Date(now + 365 * 24 * 60 * 60 * 1000)
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const cached = fetchCache.get(cacheKey)
    if (cached && cached.expiry > now) {
      setAppointments(cached.data)
      setLoading(false)
      setError(null)
      return undefined
    }

    let cancelled = false
    let timer = null

    const finish = (results) => {
      if (cancelled || requestIdRef.current !== requestId) return
      const merged = results.flat()
      merged.sort((a, b) => new Date(a.startTime ?? a.start) - new Date(b.startTime ?? b.start))
      fetchCache.set(cacheKey, { expiry: Date.now() + CACHE_TTL, data: merged })
      setAppointments(merged)
      setError(null)
      setLoading(false)
    }

    const handleError = (err) => {
      if (cancelled || requestIdRef.current !== requestId) return
      setError(err.message)
      setLoading(false)
    }

    setLoading(true)
    setError(null)

    timer = setTimeout(() => {
      if (cancelled || requestIdRef.current !== requestId) return

      Promise.all(
        ids.map((calendarId) => fetchCalendarEvents({ calendarId, locationId, startTime, endTime }))
      )
        .then(finish)
        .catch(handleError)
    }, debounceMs)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [idKey, tick]) // eslint-disable-line react-hooks/exhaustive-deps

  return { appointments, loading, error, refetch }
}