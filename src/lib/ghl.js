/**
 * Fetches calendar events directly from GHL API.
 * GHL supports CORS from browsers — same approach as the existing HTML page.
 */
export async function fetchCalendarEvents({ calendarId, locationId, startTime, endTime }) {
  const params = new URLSearchParams({
    locationId,
    calendarId,
    startTime: startTime.getTime().toString(),
    endTime:   endTime.getTime().toString(),
  })

  const res = await fetch(
    `https://services.leadconnectorhq.com/calendars/events?${params}`,
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GHL_API_KEY}`,
        Version: '2021-04-15',
        Accept:  'application/json',
      },
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`GHL API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  // GHL may return events under different keys depending on the endpoint version
  return data.events ?? data.appointments ?? data.items ?? data.data ?? []
}
