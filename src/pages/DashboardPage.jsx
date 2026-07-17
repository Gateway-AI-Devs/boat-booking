import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import AppointmentList from '../components/calendar/AppointmentList'
import { BRAND_TABS, CAPTAIN_CALENDAR } from '../constants/brands'

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'all', label: 'All' },
]

export default function DashboardPage() {
  const { role } = useAuth()
  const [activeTab, setActiveTab] = useState('all')
  const [filter, setFilter] = useState('upcoming')
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  if (role === 'admin' || role === 'agent') {
    const visibleTabs = BRAND_TABS.filter((tab) => role === 'admin' || tab.id !== 'other-boats')
    const tab = visibleTabs.find((t) => t.id === activeTab) ?? visibleTabs[0]

    return (
      <div className="flex gap-0 -ml-2 sm:-ml-6" style={{ minHeight: 'calc(100vh - 120px)' }}>
        {/* Left panel: tabs + filters */}
        <div
          className="shrink-0 w-[185px] flex flex-col gap-5 overflow-y-auto"
          style={{ borderRight: '1px solid #ede8e0' }}
        >
          <div className="pl-4 sm:pl-6 pr-3 pt-1 pb-4 flex flex-col gap-5">
            {/* Brand tabs */}
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#bbb' }}>Boats</p>
              {visibleTabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-2 rounded-lg px-2 py-2 text-[12.5px] font-medium text-left"
                  style={{
                    background: activeTab === t.id ? '#fff' : 'transparent',
                    color: activeTab === t.id ? '#a07d2e' : '#888',
                    boxShadow: activeTab === t.id ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
                    transition: 'background 0.15s, color 0.15s',
                  }}
                  onMouseEnter={(e) => { if (activeTab !== t.id) { e.currentTarget.style.background = '#f8f6f2'; e.currentTarget.style.color = '#1c1c1a' } }}
                  onMouseLeave={(e) => { if (activeTab !== t.id) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#888' } }}
                >
                  <span style={{ opacity: 0.85, fontSize: '14px' }}>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#bbb' }}>Search</p>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center" style={{ color: '#bbb' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Guest or title…"
                  className="w-full rounded-lg border bg-[#fefcf9] py-1.5 pl-7 pr-7 text-[12px] outline-none"
                  style={{ borderColor: '#e8e3db', color: '#1c1c1a' }}
                  onFocus={(e) => { e.target.style.borderColor = '#a07d2e' }}
                  onBlur={(e) => { e.target.style.borderColor = '#e8e3db' }}
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute inset-y-0 right-1.5 flex items-center" style={{ color: '#bbb' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Filter */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#bbb' }}>Filter</p>
              <div className="flex flex-col gap-0.5">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className="rounded-lg px-2 py-1.5 text-[12px] font-medium text-left"
                    style={{
                      background: filter === f.id ? 'rgba(160,125,46,0.1)' : 'transparent',
                      color: filter === f.id ? '#a07d2e' : '#888',
                      transition: 'background 0.15s, color 0.15s',
                    }}
                    onMouseEnter={(e) => { if (filter !== f.id) e.currentTarget.style.color = '#1c1c1a' }}
                    onMouseLeave={(e) => { if (filter !== f.id) e.currentTarget.style.color = '#888' }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date range — only when filter is 'all' */}
            {filter === 'all' && (
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#bbb' }}>Date range</p>
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center" style={{ color: '#bbb' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="date-range-input w-full rounded-lg border bg-[#fefcf9] pl-7 pr-2 py-1.5 text-[11px] outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4c5a0, transparent)' }} />
                    <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#bbb' }}>to</span>
                    <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, #d4c5a0, transparent)' }} />
                  </div>

                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-2 flex items-center" style={{ color: '#bbb' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="date-range-input w-full rounded-lg border bg-[#fefcf9] pl-7 pr-2 py-1.5 text-[11px] outline-none"
                    />
                  </div>

                  {(startDate || endDate) && (
                    <button
                      onClick={() => { setStartDate(''); setEndDate('') }}
                      className="flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-[10.5px] font-semibold cursor-pointer"
                      style={{
                        background: 'rgba(160,125,46,0.1)',
                        color: '#a07d2e',
                        border: '1px solid rgba(160,125,46,0.2)',
                        transition: 'background 0.15s, box-shadow 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(160,125,46,0.18)'
                        e.currentTarget.style.boxShadow = '0 1px 4px rgba(160,125,46,0.2)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(160,125,46,0.1)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right panel: calendar */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-6">
          <AppointmentList
            calendarIds={tab.calendarIds}
            calendarId={tab.calendarId}
            title={`${tab.label} Bookings`}
            showGreeting={false}
            filter={filter}
            search={search}
            startDate={startDate}
            endDate={endDate}
            onFilterChange={setFilter}
          />
        </div>
      </div>
    )
  }

  const captain = CAPTAIN_CALENDAR[role]
  return <AppointmentList calendarId={captain?.calendarId} title={captain?.title} />
}
