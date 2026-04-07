import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { MessageBubble, ChatInput, LoadingDots } from '../components'

// ChatView — shown at /chat/:chatId
const ChatView = () => {
  const { chatId } = useParams()
  const [chatInput, setChatInput] = useState('')
  const [proSearch, setProSearch] = useState(false)
  // ID of the most recently received AI message — drives the typewriter animation
  const [latestAiMessageId, setLatestAiMessageId] = useState(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  const { handleSendMessage, handleOpenChat, handleUpdateMessage } = useChat()
  const chats = useSelector((state) => state.chat.chats)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const currentMessages = chats[chatId]?.messages ?? []

  // When chat changes, clear animation state
  useEffect(() => {
    setLatestAiMessageId(null)
    if (chatId) handleOpenChat(chatId)
  }, [chatId])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages.length, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const msg = chatInput.trim()
    if (!msg || isLoading) return
    setChatInput('')
    setLatestAiMessageId(null) // clear old animation

    const { aiMessageId } = await handleSendMessage({ message: msg, chatId, proSearch })
    if (aiMessageId) setLatestAiMessageId(aiMessageId)
  }

  const handleEditMessage = (messageId, newContent) => {
    setLatestAiMessageId(null)
    handleUpdateMessage(messageId, newContent, chatId, proSearch)
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Scrollable message list */}
      <div className="flex-1 pb-44 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-2">
          {currentMessages.map((msg) => {
            const msgId = msg._id || msg.id
            return (
              <MessageBubble
                key={msgId}
                id={msgId}
                role={msg.role}
                content={msg.content}
                isNew={msg.role === 'ai' && msgId === latestAiMessageId}
                onEdit={msg.role === 'user' ? handleEditMessage : null}
              />
            )
          })}

          {isLoading && <LoadingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onSubmit={handleSubmit}
        disabled={isLoading}
        proSearch={proSearch}
        onProSearchToggle={() => setProSearch((p) => !p)}
      />
    </div>
  )
}

export default ChatView
