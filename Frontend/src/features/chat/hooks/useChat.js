import { initializedSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat, updateMessage } from "../service/chat.api";
import {setChats,setCurrentChatId,setLoading,setError,createNewChat,addNewMessage,addMessages,setMessages,deleteChat as deleteChatAction, } from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch()
    const chats = useSelector((state) => state.chat.chats)

    // ── Send Message ─────────────────────────────
    async function handleSendMessage({ message, chatId }) {
        dispatch(setLoading(true))

        if (chatId) {
            dispatch(addNewMessage({
                chatId,
                id: `temp-${Date.now()}`,
                content: message,
                role: "user",
            }))
        }

        try {
            const data = await sendMessage({ message, chatId })
            const { chat, aiMessage } = data

            if (!chatId) {
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
                dispatch(addNewMessage({
                    chatId: chat._id,
                    id: `user-${Date.now()}`,
                    content: message,
                    role: "user",
                }))
            }
            dispatch(addNewMessage({
                chatId: chat._id,
                id: aiMessage._id,
                content: aiMessage.content,
                role: aiMessage.role,
            }))

            dispatch(setCurrentChatId(chat._id))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Something went wrong"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ── Get All Chats (sidebar) ───────────────────
    async function handleGetChats() {
        dispatch(setLoading(true))
        try {
            const data = await getChats()
            const { chats } = data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdated: chat.updatedAt,
                }
                return acc
            }, {})))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to load chats"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ── Open Chat (load messages) ─────────────────
    async function handleOpenChat(chatId) {
        if (chats[chatId]?.messages?.length > 0) {
            dispatch(setCurrentChatId(chatId))
            return
        }

        try {
            const data = await getMessages(chatId)
            const { messages } = data
            dispatch(addMessages({
                chatId,
                messages: messages.map(msg => ({
                    id: msg._id,
                    content: msg.content,
                    role: msg.role,
                })),
            }))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to load messages"))
        } finally {
            dispatch(setCurrentChatId(chatId))
        }
    }

    // ── Delete Chat ───────────────────────────────
    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId)
            dispatch(deleteChatAction(chatId))  
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to delete chat"))
        }
    }

    // ── Update Message ────────────────────────────
    async function handleUpdateMessage(messageId, newContent, chatId) {
        dispatch(setLoading(true))
        try {
            await updateMessage(messageId, newContent)
            // Refresh chat history because editing a message might delete subsequent messages on backend
            const data = await getMessages(chatId)
            dispatch(setMessages({ chatId, messages: data.messages }))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to update message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ── New Chat (reset current) ──────────────────
    function handleNewChat() {
        dispatch(setCurrentChatId(null))
    }

    return {
        initializedSocketConnection,
        handleSendMessage,
        handleOpenChat,
        handleGetChats,
        handleDeleteChat,
        handleUpdateMessage,
        handleNewChat,
    }
}