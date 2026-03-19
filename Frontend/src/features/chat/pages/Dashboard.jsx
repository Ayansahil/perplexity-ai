import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

// ─────────────────────────────────────────────
// Static sidebar nav items
// ─────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: 'explore',      label: 'Discover',  active: true  },
  { icon: 'auto_stories', label: 'Library',   active: false },
  { icon: 'history',      label: 'History',   active: false },
]

const FOOTER_NAV = [
  { icon: 'help',     label: 'Support'  },
  { icon: 'settings', label: 'Settings' },
]

// ─────────────────────────────────────────────
// Sub-components (single-file for now, extract
// to their own files in your component layer)
// ─────────────────────────────────────────────

const Icon = ({ name, fill = false, className = '' }) => (
  <span
    className={`material-symbols-outlined select-none ${className}`}
    style={{ fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24` }}
  >
    {name}
  </span>
)

// ── Sidebar ──────────────────────────────────
const Sidebar = ({ user, chats, currentChatId, onOpenChat, onDeleteChat, onNewChat }) => (
  <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1a1919] flex flex-col py-6 px-4 z-50">
    {/* Brand */}
    <div className="mb-8 px-2 flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#9ffe9a] flex items-center justify-center flex-shrink-0">
        <Icon name="auto_awesome" fill className="text-[#006319] text-xl" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[#9ffe9a] tracking-tight leading-none">The Curator</h1>
        <p className="text-[10px] uppercase tracking-widest text-[#adaaaa] font-medium opacity-60 mt-0.5">
          Intelligence Pro
        </p>
      </div>
    </div>

    {/* New Chat CTA */}
    <button
      onClick={onNewChat}
      className="mb-8 w-full py-3 px-4 bg-[#9ffe9a] text-[#006319] cursor-pointer rounded-full font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] active:scale-95 transition-all duration-200"
    >
      <Icon name="add_comment" className="text-sm" />
      New Chat
    </button>

    {/* Nav */}
    <nav className="flex-1 space-y-1 overflow-y-auto">
      {NAV_ITEMS.map(({ icon, label, active }) => (
        <a
          key={label}
          href="#"
          className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 ${
            active
              ? 'text-[#9ffe9a] font-semibold border-r-2 border-[#9ffe9a] bg-[#262626]'
              : 'text-[#adaaaa] hover:text-white hover:bg-[#262626]'
          }`}
        >
          <Icon name={icon} />
          <span>{label}</span>
        </a>
      ))}

      {/* Dynamic: real chats from Redux */}
      {Object.values(chats).length > 0 && (
        <>
          <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest opacity-40">
            Recent Threads
          </div>
          {Object.values(chats).map((c) => (
            <div
              key={c.id}
              className={`group flex items-center gap-1 rounded-lg transition-all ${
                c.id === currentChatId ? 'bg-[#262626]' : 'hover:bg-[#262626]'
              }`}
            >
              <button
                onClick={() => onOpenChat(c.id)}
                className={`flex-1 text-left px-3 py-2 text-sm truncate transition-all ${
                  c.id === currentChatId ? 'text-[#9ffe9a]' : 'text-[#adaaaa] hover:text-white'
                }`}
              >
                {c.title}
              </button>
              <button
                onClick={() => onDeleteChat(c.id)}
                className="opacity-0 group-hover:opacity-100 pr-2 text-[#adaaaa] hover:text-red-400 transition-all"
              >
                <Icon name="delete" className="text-sm" />
              </button>
            </div>
          ))}
        </>
      )}
    </nav>

    {/* Footer */}
    <div className="mt-auto space-y-1">
      {FOOTER_NAV.map(({ icon, label }) => (
        <a
          key={label}
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-[#adaaaa] hover:text-white hover:bg-[#262626] transition-colors"
        >
          <Icon name={icon} />
          <span>{label}</span>
        </a>
      ))}

      {/* Dynamic: user info from Redux auth */}
      <div className="mt-4 flex items-center gap-3 px-3 py-2">
        <div className="w-8 h-8 rounded-full bg-[#262626] flex items-center justify-center overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
          ) : (
            <Icon name="person" className="text-[#adaaaa] text-sm" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate">{user?.name ?? 'Account'}</p>
        </div>
      </div>
    </div>
  </aside>
)

// ── Top Header ────────────────────────────────
const TopBar = () => (
  <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 px-8 flex justify-between items-center bg-[#0e0e0e]/80 backdrop-blur-xl z-40">
    <div className="flex items-center gap-4 text-sm font-medium">
      <button className="text-white font-bold flex items-center gap-2">
        <Icon name="target" fill className="text-sm" />
        Focus
      </button>
      <button className="text-[#adaaaa] hover:text-[#9ffe9a] transition-colors flex items-center gap-2">
        <Icon name="source" className="text-sm" />
        Sources
      </button>
    </div>

    <div className="flex items-center gap-4">
      <button className="px-4 py-1.5 bg-[#262626] text-white text-sm rounded-full hover:bg-[#2c2c2c] transition-colors">
        Share
      </button>
      <button className="p-2 text-[#adaaaa] hover:text-[#9ffe9a] transition-colors">
        <Icon name="more_horiz" />
      </button>
      <button className="p-2 text-[#adaaaa] hover:text-[#9ffe9a] transition-colors">
        <Icon name="person" />
      </button>
    </div>
  </header>
)

// ── Chat Input ────────────────────────────────
const ChatInput = ({ value, onChange, onSubmit }) => (
  <div className="absolute bottom-0 left-0 w-full px-8 pb-8 pt-4 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/90 to-transparent">
    <div className="max-w-4xl mx-auto">
      <form onSubmit={onSubmit}>
        <div className="relative group">
          {/* Glow layer */}
          <div className="absolute inset-0 bg-[#9ffe9a]/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative bg-[#1a1919] rounded-2xl p-2 border border-white/5 group-focus-within:border-[#9ffe9a]/40 transition-all duration-300">
            <textarea
              value={value}
              onChange={onChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSubmit(e)
                }
              }}
              rows={2}
              placeholder="Ask anything..."
              className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-[#adaaaa]/50 resize-none min-h-[56px] py-3 px-4 outline-none"
            />
            <div className="flex items-center justify-between px-2 pb-2 pt-1">
              <div className="flex items-center gap-1">
                {['attachment', 'image', 'mic'].map((ic) => (
                  <button key={ic} type="button" className="p-2 text-[#adaaaa] hover:text-white transition-colors">
                    <Icon name={ic} />
                  </button>
                ))}
                <div className="h-4 w-px bg-white/10 mx-2" />
                <button type="button" className="px-3 py-1 flex items-center gap-2 rounded-lg bg-[#262626] text-xs text-[#adaaaa] hover:text-white transition-colors border border-white/5">
                  <Icon name="public" fill className="text-sm" />
                  Pro Search
                </button>
              </div>

              <button
                type="submit"
                disabled={!value.trim()}
                className="w-10 h-10 bg-[#9ffe9a] text-[#006319] rounded-xl flex items-center justify-center hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Icon name="arrow_upward" className="font-bold" />
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="mt-4 flex justify-center gap-6 text-[10px] text-[#adaaaa] font-bold uppercase tracking-[0.2em] opacity-30">
        <span>Precision Mode Active</span>
        <span>Sources Synchronized</span>
        <span>AI Model: Curator-v4</span>
      </div>
    </div>
  </div>
)

// ── Welcome / Empty State (shown when no active chat) ──
const WelcomeState = ({ userName }) => (
  <div className="max-w-4xl mx-auto px-8 py-16 flex flex-col items-start justify-center min-h-[60vh]">
    <p className="text-[#9ffe9a] text-sm font-semibold uppercase tracking-widest mb-3 opacity-70">
      Good day{userName ? `, ${userName}` : ''}
    </p>
    <h2 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
      What shall we<br />
      <span className="text-[#9ffe9a]">curate</span> today?
    </h2>
    <p className="text-[#adaaaa] text-lg max-w-xl mt-2">
      Ask anything — research, design, code, or ideas. I synthesize sources and surface what matters.
    </p>

    {/* Static suggestion chips */}
    <div className="mt-8 flex flex-wrap gap-3">
      {[
        'Summarize AI trends this week',
        'Design a landing page',
        'Explain RAG architecture',
        'Write a pitch deck outline',
      ].map((s) => (
        <button
          key={s}
          className="px-4 py-2 rounded-full bg-[#1a1919] border border-white/10 text-sm text-[#adaaaa] hover:text-white hover:border-[#9ffe9a]/40 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)

// ── Message Bubble ────────────────────────────
const MessageBubble = ({ id, role, content, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const handleSave = () => {
    if (editContent.trim() !== content) {
      onEdit(id, editContent)
    }
    setIsEditing(false)
  }

  if (role === 'user') {
    return (
      <div className="flex justify-end mb-8">
        <div className="bg-[#262626] px-6 py-4 rounded-2xl rounded-tr-sm max-w-[80%] text-white shadow-lg group relative">
          {!isEditing ? (
            <>
              <p>{content}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-[#adaaaa] hover:text-white transition-all p-2"
              >
                <Icon name="edit" className="text-sm" />
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 min-w-[300px]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-[#1a1919] text-white p-2 rounded-lg outline-none resize-none text-sm border border-[#9ffe9a]/30 focus:border-[#9ffe9a]"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="text-xs text-[#adaaaa] hover:text-white px-2 py-1">Cancel</button>
                <button onClick={handleSave} className="text-xs bg-[#9ffe9a] text-black font-bold px-3 py-1 rounded-md">Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6 mb-8">
      <div className="w-10 h-10 rounded-full bg-[#9ffe9a]/10 flex-shrink-0 flex items-center justify-center border border-[#9ffe9a]/20">
        <Icon name="bolt" fill className="text-[#9ffe9a] text-xl" />
      </div>
      <div className="flex-1 text-[#e0e0e0] leading-relaxed">
        <ReactMarkdown
          components={{
            p:    ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
            ul:   ({ children }) => <ul className="mb-2 list-disc pl-5">{children}</ul>,
            ol:   ({ children }) => <ol className="mb-2 list-decimal pl-5">{children}</ol>,
            code: ({ children }) => <code className="rounded bg-white/10 px-1 py-0.5 text-sm">{children}</code>,
            pre:  ({ children }) => <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">{children}</pre>,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Main Dashboard Component
// ─────────────────────────────────────────────
const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')

  const { user } = useSelector((state) => state.auth)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const isLoading = useSelector((state) => state.chat.isLoading)

  const currentMessages = currentChatId ? (chats[currentChatId]?.messages ?? []) : []
  const hasMessages = currentMessages.length > 0

  useEffect(() => {
    chat.initializedSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return
    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }

  const handleEditMessage = (messageId, newContent) => {
    chat.handleUpdateMessage(messageId, newContent, currentChatId)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0e0e] text-white font-['Inter']">
      <Sidebar
        user={user}
        chats={chats}
        currentChatId={currentChatId}
        onOpenChat={openChat}
        onDeleteChat={(chatId) => chat.handleDeleteChat(chatId)}
        onNewChat={() => chat.handleNewChat()}
      />

      <main className="ml-64 flex-1 relative flex flex-col bg-[#0e0e0e] overflow-hidden">
        <TopBar />

        {/* Scrollable content area */}
        <div className="flex-1 mt-16 pb-40 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
          {!hasMessages ? (
            <WelcomeState userName={user?.name} />
          ) : (
            <div className="max-w-4xl mx-auto px-8 py-12 space-y-2">
              {currentMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  id={msg.id}
                  role={msg.role}
                  content={msg.content}
                  onEdit={handleEditMessage}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex gap-6 mb-8">
                  <div className="w-10 h-10 rounded-full bg-[#9ffe9a]/10 flex-shrink-0 flex items-center justify-center border border-[#9ffe9a]/20">
                    <Icon name="bolt" fill className="text-[#9ffe9a] text-xl" />
                  </div>
                  <div className="flex items-center gap-1 pt-3">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[#9ffe9a]/60 animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <ChatInput
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onSubmit={handleSubmitMessage}
        />
      </main>
    </div>
  )
}

export default Dashboard