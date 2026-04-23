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
  if (events.length > 0) console.log('[GHL] raw event sample', JSON.stringify(events[0], null, 2))

  // Collect all unique contactIds so we can always get custom fields
  const uniqueIds = [...new Set(events.filter((e) => e.contactId).map((e) => e.contactId))]

  if (uniqueIds.length === 0) return events

  // Fetch contacts in parallel
  const contacts = await Promise.all(uniqueIds.map(fetchContact))
  const contactMap = Object.fromEntries(
    uniqueIds.map((id, i) => [id, contacts[i]]).filter(([, c]) => c)
  )

  const CUSTOM_FIELDS = {
    boat:              'NZOqzQUxQL6ldTnIXPki',
    timeSlot:          'FWauLNmJYGKiiZRTKYSL',
    package:           'eVhK0he8FdQg8P0UYyB3',
    season:            'PU79ma3hTAYNg2snbFHj',
    date:              'qD26KYH1zQa52uMCNYHw',
    guests:            'WVXo4yNQ40VRNzFDFm0m',
    notes:             '8lgFS1WHLeg82xQP2yyN',
    depositAmount:     'TVbici5uQ9tI12HSTyj3',
    totalPackageValue: 'LTz2GL8Qc0DTRHP6B8Bp',
  }

  const UPSELL_FIELDS = [
    { key: 'djDecks',          id: 'WGB43kgq4j1MIvKPAJfR', label: 'DJ Decks'               },
    { key: 'jetSki',           id: 'Hja2qmE2cuOWgk68omJ3', label: 'Jet Ski Hire'            },
    { key: 'islandTransfers',  id: '7rMtrXfgQouKlEn3lZEw', label: 'Island Transfers'        },
    { key: 'clubPackage',      id: 'AQ3b66J7a4dQ5NLJQEYq', label: 'Club Package / Tickets'  },
    { key: 'villa',            id: '9ERNIsMps7MywQvXwC4c', label: 'Villa'                   },
  ]

  // Merge contact data into events
  return events.map((e) => {
    const enriched = contactMap[e.contactId]
    if (!enriched) return e

    console.log('[GHL] contact customFields for', e.contactId, enriched.customFields)
    const fields = enriched.customFields ?? []
    const pick = (id) => {
      const f = fields.find((f) => f.id === id || f.fieldId === id)
      return f?.value ?? f?.fieldValue ?? null
    }

    const customData = Object.fromEntries(
      Object.entries(CUSTOM_FIELDS).map(([key, id]) => [key, pick(id)])
    )

    const upsells = UPSELL_FIELDS
      .filter(({ id }) => {
        const val = pick(id)
        return val === true || val === 'true'
      })
      .map(({ label }) => label)

    return {
      ...e,
      customData,
      upsells,
      contact: {
        name:      enriched.name ?? (enriched.firstName ? `${enriched.firstName} ${enriched.lastName ?? ''}`.trim() : ''),
        firstName: enriched.firstName ?? '',
        lastName:  enriched.lastName  ?? '',
        email:     enriched.email     ?? '',
        phone:     enriched.phone     ?? '',
        ...e.contact,
      },
    }
  })
}
