const PURAVIDA_ID = import.meta.env.VITE_GHL_PURAVIDA_CALENDAR_ID
const FANTASEA_ID = import.meta.env.VITE_GHL_FANTASEA_CALENDAR_ID

export const BRAND_TABS = [
  { id: 'all',      label: 'All',      icon: '🗓', calendarIds: [PURAVIDA_ID, FANTASEA_ID] },
  { id: 'puravida', label: 'Puravida', icon: '🌿', calendarId: PURAVIDA_ID },
  { id: 'fantasea', label: 'Fantasea', icon: '🌊', calendarId: FANTASEA_ID },
]

export const CAPTAIN_CALENDAR = {
  'puravida-captain': { calendarId: PURAVIDA_ID, title: 'PuraVida Bookings' },
  'fantasea-captain': { calendarId: FANTASEA_ID, title: 'FantaSea Bookings' },
}
