import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { Icon } from '../components'

// Date grouping helpers
const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const startOfWeek = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - 7)
  return d
}

const startOfMonth = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - 30)
  return d
}

function groupChats(chats) {
  const today = startOfToday()
  const week = startOfWeek()
  const month = startOfMonth()

  const groups = { Today: [], 'This Week': [], 'This Month': [], Older: [] }

  chats.forEach((c) => {
    const d = new Date(c.lastUpdated || 0)
    if (d >= today) groups['Today'].push(c)
    else if (d >= week) groups['This Week'].push(c)
    else if (d >= month) groups['This Month'].push(c)
    else groups['Older'].push(c)
  })

  return groups
}

// HistoryPage — shown at /history
const HistoryPage = () => {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const { handleDeleteChat } = useChat()

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)

  const allChats = useMemo(
    () =>
      Object.values(chats).sort(
        (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
      ),
    [chats]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return allChats
    const q = search.toLowerCase()
    return allChats.filter((c) => c.title?.toLowerCase().includes(q))
  }, [allChats, search])

  const groups = useMemo(() => groupChats(filtered), [filtered])

  const openChat = (id) => navigate(`/chat/${id}`)

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
      <div className="max-w-3xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[#9ffe9a] text-xs font-bold uppercase tracking-widest mb-2 opacity-60">Navigation</p>
          <h1 className="text-3xl font-bold text-white mb-2">Thread History</h1>
          <p className="text-[#adaaaa] text-sm">All your conversations, searchable and organized by date.</p>
        </div>

        {/* Search */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Icon name="search" className="text-[#adaaaa] text-xl" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search threads..."
            className="w-full bg-[#1a1919] border border-white/5 focus:border-[#9ffe9a]/40 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-[#adaaaa]/40 outline-none transition-colors text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-4 flex items-center text-[#adaaaa] hover:text-white transition-colors"
            >
              <Icon name="close" className="text-lg" />
            </button>
          )}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1919] border border-white/5 flex items-center justify-center mx-auto mb-4">
              <Icon name="forum" className="text-[#adaaaa] text-3xl" />
            </div>
            <p className="text-[#adaaaa] font-medium">
              {search ? 'No threads match your search.' : 'No conversations yet.'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/')}
                className="mt-4 px-5 py-2 bg-[#9ffe9a] text-[#006319] text-sm font-bold rounded-full hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] transition-all"
              >
                Start a thread
              </button>
            )}
          </div>
        )}

        {/* Grouped results */}
        {Object.entries(groups).map(([label, items]) => {
          if (items.length === 0) return null
          return (
            <div key={label} className="mb-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#adaaaa] opacity-40 mb-3 px-1">
                {label}
              </div>
              <div className="space-y-2">
                {items.map((c) => (
                  <div
                    key={c.id}
                    className={`group flex items-center gap-4 px-5 py-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      c.id === currentChatId
                        ? 'bg-[#9ffe9a]/8 border-[#9ffe9a]/20'
                        : 'bg-[#1a1919] border-white/5 hover:border-white/10 hover:bg-[#1e1e1e]'
                    }`}
                    onClick={() => openChat(c.id)}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      c.id === currentChatId ? 'bg-[#9ffe9a]/15' : 'bg-[#262626]'
                    }`}>
                      <Icon
                        name="chat_bubble"
                        className={c.id === currentChatId ? 'text-[#9ffe9a]' : 'text-[#adaaaa]'}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate text-sm ${
                        c.id === currentChatId ? 'text-[#9ffe9a]' : 'text-white'
                      }`}>
                        {c.title || 'Untitled thread'}
                      </p>
                      <p className="text-xs text-[#adaaaa] mt-0.5">{formatDate(c.lastUpdated)}</p>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); openChat(c.id) }}
                        className="p-1.5 text-[#adaaaa] hover:text-[#9ffe9a] hover:bg-[#9ffe9a]/10 rounded-lg transition-colors"
                      >
                        <Icon name="open_in_new" className="text-sm" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(c.id) }}
                        className="p-1.5 text-[#adaaaa] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <Icon name="delete" className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default HistoryPage
