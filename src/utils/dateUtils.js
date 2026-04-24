export function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formattedDate() {
  return new Date().toLocaleDateString('en', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
}

export function applyFilter(appts, filter) {
  const now        = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd   = new Date(todayStart.getTime() + 86_400_000)
  const weekEnd    = new Date(todayStart.getTime() + 7 * 86_400_000)

  return appts
    .filter((a) => {
      const t = new Date(a.startTime ?? a.start ?? a.appointmentTime)
      if (filter === 'today')    return t >= todayStart && t < todayEnd
      if (filter === 'week')     return t >= todayStart && t < weekEnd
      if (filter === 'upcoming') return t >= now
      return true
    })
    .sort((a, b) => new Date(a.startTime ?? a.start) - new Date(b.startTime ?? b.start))
}
