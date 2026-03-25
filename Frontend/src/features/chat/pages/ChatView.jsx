import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { MessageBubble, ChatInput, LoadingDots } from '../components'

// ChatView — shown at /chat/:chatId
const ChatView = () => {
  const { chatId } = useParams()
  const [chatInput, setChatInput] = useState('')
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  const { handleSendMessage, handleOpenChat, handleUpdateMessage } = useChat()
  const chats = useSelector((state) => state.chat.chats)
  const isLoading = useSelector((state) => state.chat.isLoading)
  const currentMessages = chats[chatId]?.messages ?? []

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) handleOpenChat(chatId)
  }, [chatId])

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentMessages.length, isLoading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const msg = chatInput.trim()
    if (!msg || isLoading) return
    setChatInput('')
    await handleSendMessage({ message: msg, chatId })
  }

  const handleEditMessage = (messageId, newContent) => {
    handleUpdateMessage(messageId, newContent, chatId)
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Scrollable message list */}
      <div className="flex-1 pb-44 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-[#262626] [&::-webkit-scrollbar-thumb]:rounded-full">
        <div className="max-w-4xl mx-auto px-8 py-12 space-y-2">
          {currentMessages.map((msg) => (
            <MessageBubble
              key={msg.id}
              id={msg._id || msg.id}
              role={msg.role}
              content={msg.content}
              onEdit={msg.role === 'user' ? handleEditMessage : null}
            />
          ))}

          {isLoading && <LoadingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      <ChatInput
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
        onSubmit={handleSubmit}
        disabled={isLoading}
      />
    </div>
  )
}

export default ChatView
