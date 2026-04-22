const GHL_HEADERS = {
  Authorization: `Bearer ${import.meta.env.VITE_GHL_API_KEY}`,
  Version: '2021-04-15',
  Accept:  'application/json',
}

async function fetchContact(contactId) {
  try {
    const res = await fetch(
      `https://services.leadconnectorhq.com/contacts/${contactId}`,
      { headers: GHL_HEADERS }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.contact ?? data ?? null
  } catch {
    return null
  }
}

export async function fetchCalendarEvents({ calendarId, locationId, startTime, endTime }) {
  const params = new URLSearchParams({
    locationId,
    calendarId,
    startTime: startTime.getTime().toString(),
    endTime:   endTime.getTime().toString(),
  })

  const res = await fetch(
    `https://services.leadconnectorhq.com/calendars/events?${params}`,
    { headers: GHL_HEADERS }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`GHL API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const events = data.events ?? data.appointments ?? data.items ?? data.data ?? []

  // Collect all unique contactIds so we can always get custom fields
  const uniqueIds = [...new Set(events.filter((e) => e.contactId).map((e) => e.contactId))]

  if (uniqueIds.length === 0) return events

  // Fetch contacts in parallel
  const contacts = await Promise.all(uniqueIds.map(fetchContact))
  const contactMap = Object.fromEntries(
    uniqueIds.map((id, i) => [id, contacts[i]]).filter(([, c]) => c)
  )

  const GUESTS_FIELD_ID = 'WVXo4yNQ40VRNzFDFm0m'

  // Merge contact data into events
  return events.map((e) => {
    const enriched = contactMap[e.contactId]
    if (!enriched) return e
    if (enriched.customFields?.length) console.log('[GHL] customFields for', e.contactId, enriched.customFields)
    const guestsField = (enriched.customFields ?? []).find(
      (f) => f.id === GUESTS_FIELD_ID || f.fieldId === GUESTS_FIELD_ID
    )
    const numberOfGuests = guestsField?.value ?? guestsField?.fieldValue ?? null
    return {
      ...e,
      numberOfGuests,
      contact: {
        name:      enriched.name      ?? enriched.firstName ? `${enriched.firstName} ${enriched.lastName ?? ''}`.trim() : '',
        firstName: enriched.firstName ?? '',
        lastName:  enriched.lastName  ?? '',
        email:     enriched.email     ?? '',
        phone:     enriched.phone     ?? '',
        ...e.contact,
      },
    }
  })
}
