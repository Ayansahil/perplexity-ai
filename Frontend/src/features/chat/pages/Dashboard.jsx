import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { Icon } from '../components'
import LogoutButton from '../../auth/pages/LogoutButton'

const NAV_ITEMS = [
  { icon: 'explore',  label: 'Discover',  path: '/'        },
  { icon: 'history',  label: 'History',   path: '/history' },
  { icon: 'settings', label: 'Settings',  path: '/settings'},
]

const Sidebar = ({ user, chats, currentChatId, onOpenChat, onDeleteChat, onNewChat, className = '', onCloseMobile }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
    if (onCloseMobile) onCloseMobile()
  }

  return (
    <aside className={`h-screen w-64 fixed left-0 top-0 bg-[#131313] flex flex-col py-6 px-4 z-50 border-r border-white/[0.04] ${className}`}>
      {/* Brand */}
      <div className="mb-8 px-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#9ffe9a] flex items-center justify-center flex-shrink-0">
            <Icon name="auto_awesome" fill className="text-[#006319] text-xl" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#9ffe9a] tracking-tight leading-none">The Curator</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#adaaaa] font-medium opacity-50 mt-0.5">
              Intelligence Pro
            </p>
          </div>
        </div>
        {/* Close button for mobile */}
        <button onClick={onCloseMobile} className="md:hidden p-1 text-[#adaaaa] hover:text-white">
          <Icon name="close" className="text-2xl" />
        </button>
      </div>

      {/* New Thread CTA */}
      <button
        onClick={() => {
          onNewChat()
          if (onCloseMobile) onCloseMobile()
        }}
        className="mb-6 w-full py-2.5 px-4 bg-[#9ffe9a] text-[#006319] cursor-pointer rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(160,255,155,0.3)] active:scale-95 transition-all duration-200"
      >
        <Icon name="add_comment" className="text-sm" />
        New Thread
      </button>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:w-0">
        {NAV_ITEMS.map(({ icon, label, path }) => {
          const isActive = path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(path)
          return (
            <button
              key={label}
              onClick={() => handleNavigation(path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-150 text-left ${
                isActive
                  ? 'text-[#9ffe9a] font-semibold bg-[#9ffe9a]/8'
                  : 'text-[#adaaaa] hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </button>
          )
        })}

        {/* Recent threads */}
        {Object.values(chats).length > 0 && (
          <>
            <div className="pt-6 pb-2 px-3 text-[10px] font-bold text-[#adaaaa] uppercase tracking-widest opacity-30">
              Recent Threads
            </div>
            {Object.values(chats)
              .sort((a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0))
              .slice(0, 15)
              .map((c) => (
                <div
                  key={c.id}
                  className={`group flex items-center gap-1 rounded-xl transition-all ${
                    c.id === currentChatId ? 'bg-[#9ffe9a]/8' : 'hover:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => {
                      onOpenChat(c.id)
                      if (onCloseMobile) onCloseMobile()
                    }}
                    className={`flex-1 text-left px-3 py-2 text-xs truncate transition-all ${
                      c.id === currentChatId ? 'text-[#9ffe9a] font-medium' : 'text-[#adaaaa] hover:text-white'
                    }`}
                  >
                    {c.title}
                  </button>
                  <button
                    onClick={() => onDeleteChat(c.id)}
                    className="opacity-0 group-hover:opacity-100 pr-2 text-[#adaaaa] hover:text-red-400 transition-all"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="mt-auto space-y-0.5">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-xs text-[#adaaaa] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
        >
          <Icon name="help" />
          <span>Support</span>
        </a>

        {/* ── Logout ── */}
        <LogoutButton />

        {/* User chip → /account */}
        <button
          onClick={() => navigate('/account')}
          className="w-full mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-[#9ffe9a]/10 border border-[#9ffe9a]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#9ffe9a]">
              {(user?.username ?? 'U').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-bold text-white truncate">{user?.username ?? 'Account'}</p>
            <p className="text-[10px] text-[#adaaaa]/60 truncate">{user?.email ?? ''}</p>
          </div>
          <Icon name="chevron_right" className="text-[#adaaaa]/40 text-sm group-hover:text-[#adaaaa] transition-colors" />
        </button>
      </div>
    </aside>
  )
}

const TopBar = ({ onMenuClick }) => (
  <header className="fixed top-0 right-0 w-full md:w-[calc(100%-16rem)] h-14 px-4 md:px-8 flex justify-between items-center bg-[#0e0e0e]/80 backdrop-blur-xl z-40 border-b border-white/[0.04]">
    <div className="flex items-center gap-4 text-sm font-medium">
      {/* Hamburger for mobile */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-1 -ml-2 mr-2 text-[#adaaaa] hover:text-white"
      >
        <Icon name="menu" className="text-xl" />
      </button>
      <button className="text-white font-bold flex items-center gap-2 text-sm">
        <Icon name="target" fill className="text-sm text-[#9ffe9a]" />
        Focus
      </button>
      <button className="text-[#adaaaa] hover:text-[#9ffe9a] transition-colors flex items-center gap-2 text-sm">
        <Icon name="source" className="text-sm" />
        Sources
      </button>
    </div>
    <div className="flex items-center gap-3">
      <button className="px-4 py-1.5 bg-[#1a1919] border border-white/8 text-white text-xs rounded-full hover:border-white/15 transition-colors">
        Share
      </button>
      <button className="p-2 text-[#adaaaa] hover:text-[#9ffe9a] transition-colors">
        <Icon name="more_horiz" />
      </button>
    </div>
  </header>
)

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#131313] border-t border-white/[0.04] flex justify-around items-center z-50 pb-safe">
      {NAV_ITEMS.map(({ icon, label, path }) => {
        const isActive = path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(path)

        return (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              isActive ? 'text-[#9ffe9a]' : 'text-[#adaaaa]'
            }`}
          >
            <Icon name={icon} className="text-xl" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </div>
  )
}

const Layout = () => {
  const navigate = useNavigate()
  const chat = useChat()
  const { user } = useSelector((state) => state.auth)
  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    chat.initializedSocketConnection()
    chat.handleGetChats()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#0e0e0e] text-white font-['Inter']">
      {/* Desktop Sidebar */}
      <Sidebar
        user={user}
        chats={chats}
        currentChatId={currentChatId}
        onOpenChat={(chatId) => navigate(`/chat/${chatId}`)}
        onDeleteChat={(chatId) => chat.handleDeleteChat(chatId)}
        onNewChat={() => navigate('/')}
        className="hidden md:flex"
      />

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <Sidebar
            user={user}
            chats={chats}
            currentChatId={currentChatId}
            onOpenChat={(chatId) => navigate(`/chat/${chatId}`)}
            onDeleteChat={(chatId) => chat.handleDeleteChat(chatId)}
            onNewChat={() => navigate('/')}
            className="flex shadow-2xl w-[85%] max-w-[300px]"
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 relative flex flex-col bg-[#0e0e0e] overflow-hidden md:ml-64">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="flex-1 mt-14 overflow-hidden">
          <Outlet />
        </div>
        <BottomNav />
      </main>
    </div>
  )
}

export default Layout