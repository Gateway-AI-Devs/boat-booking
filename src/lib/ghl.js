import { supabase } from './supabase'

export async function fetchCalendarEvents({ calendarId, locationId, startTime, endTime }) {
  const { data, error } = await supabase.functions.invoke('ghl-calendar-event', {
    body: {
      calendarId,
      locationId,
      startTime: startTime.getTime(),
      endTime:   endTime.getTime(),
    },
  })

  if (error) throw new Error(`GHL proxy error: ${error.message}`)
  return data.events ?? []
}
