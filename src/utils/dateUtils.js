export const TIMEZONE = 'Europe/Madrid'

export function getMadridDateStr(date) {
  return date.toLocaleDateString('en-CA', { timeZone: TIMEZONE })
}

function daysBetween(a, b) {
  const [y1, m1, d1] = a.split('-').map(Number)
  const [y2, m2, d2] = b.split('-').map(Number)
  return Math.round((Date.UTC(y2, m2 - 1, d2) - Date.UTC(y1, m1 - 1, d1)) / 86400000)
}

export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formattedDate() {
  return new Date().toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    timeZone: TIMEZONE,
  })
}

export function getDayLabel(date) {
  const todayStr = getMadridDateStr(new Date())
  const dateStr = getMadridDateStr(date)
  if (dateStr === todayStr) return 'Today'

  const diff = daysBetween(todayStr, dateStr)
  if (diff === 1) return 'Tomorrow'
  if (diff > 1 && diff <= 6) return date.toLocaleDateString('en', { timeZone: TIMEZONE, weekday: 'long' })
  return date.toLocaleDateString('en', { timeZone: TIMEZONE, weekday: 'long', month: 'short', day: 'numeric' })
}

export function getDateSubLabel(date) {
  const todayStr = getMadridDateStr(new Date())
  const dateStr = getMadridDateStr(date)
  const diff = daysBetween(todayStr, dateStr)
  if (dateStr === todayStr || diff === 1) {
    return date.toLocaleDateString('en', { timeZone: TIMEZONE, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }
  return date.toLocaleDateString('en', { timeZone: TIMEZONE, month: 'long', day: 'numeric', year: 'numeric' })
}

export function applyFilter(appts, filter) {
  const now = new Date()
  const todayStr = getMadridDateStr(now)
  const [y, m, d] = todayStr.split('-').map(Number)
  const todayStart = new Date(Date.UTC(y, m - 1, d))
  const weekEnd = new Date(todayStart.getTime() + 7 * 86_400_000)

  return appts
    .filter((a) => {
      const t = new Date(a.startTime ?? a.start ?? a.appointmentTime)
      if (filter === 'today') {
        return getMadridDateStr(t) === todayStr
      }
      if (filter === 'week') {
        const tStr = getMadridDateStr(t)
        const [ty, tm, td] = tStr.split('-').map(Number)
        const tDate = new Date(Date.UTC(ty, tm - 1, td))
        return tDate >= todayStart && tDate < weekEnd
      }
      if (filter === 'upcoming') return t >= now
      return true
    })
    .sort((a, b) => new Date(a.startTime ?? a.start) - new Date(b.startTime ?? b.start))
}
