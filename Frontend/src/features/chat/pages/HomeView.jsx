import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { ChatInput, LoadingDots } from '../components'

const SUGGESTIONS = [
  'Summarize AI trends this week',
  'Explain RAG architecture',
  'Write a pitch deck outline',
  'Design a landing page',
]

const WelcomeState = ({ userName, onSuggestionClick }) => (
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

    <div className="mt-8 flex flex-wrap gap-3">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          onClick={() => onSuggestionClick(s)}
          className="px-4 py-2 rounded-full bg-[#1a1919] border border-white/10 text-sm text-[#adaaaa] hover:text-white hover:border-[#9ffe9a]/40 hover:bg-[#1a1919]/80 transition-all"
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)

// HomeView — shown at /
const HomeView = () => {
  const [chatInput, setChatInput] = useState('')
  const { handleSendMessage } = useChat()
  const isLoading = useSelector((state) => state.chat.isLoading)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const msg = chatInput.trim()
    if (!msg || isLoading) return
    setChatInput('')
    const chatId = await handleSendMessage({ message: msg, chatId: null })
    if (chatId) navigate(`/chat/${chatId}`)
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 pb-44 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
        {isLoading ? (
          <div className="max-w-4xl mx-auto px-8 py-12">
            <LoadingDots />
          </div>
        ) : (
          <WelcomeState
            userName={user?.username}
            onSuggestionClick={(s) => setChatInput(s)}
          />
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onSubmit={handleSubmit}
        disabled={isLoading}
        placeholder="Ask anything to start a new thread..."
      />
    </div>
  )
}

export default HomeView
