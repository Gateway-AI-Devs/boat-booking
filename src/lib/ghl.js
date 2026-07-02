import { supabase } from './supabase'

export async function fetchCalendarEvents({ calendarId, locationId, startTime, endTime }) {
  const { data: { session } } = await supabase.auth.getSession()
  const headers = session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : undefined

  const { data, error } = await supabase.functions.invoke('ghl-calendar-event', {
    body: {
      calendarId,
      locationId,
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
    },
    headers,
  })

  if (error) throw new Error(`GHL proxy error: ${error.message}`)
  return data.events ?? []
}
