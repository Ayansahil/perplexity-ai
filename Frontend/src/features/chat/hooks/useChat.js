import { initializedSocketConnection } from "../service/chat.socket";
import { sendMessage, getChats, getMessages, deleteChat, updateMessage } from "../service/chat.api";
import { setChats, setCurrentChatId, setLoading, setError, createNewChat, addNewMessage, addMessages, setMessages, deleteChat as deleteChatAction, } from "../chat.slice";
import { useDispatch, useSelector } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch()
    const chats = useSelector((state) => state.chat.chats)
    const currentChatId = useSelector((state) => state.chat.currentChatId)

    // ── Send Message ──
    async function handleSendMessage({ message, chatId, proSearch = false }) {
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
            const data = await sendMessage({ message, chatId, proSearch })
            const { chat, aiMessage, userMessage } = data

            if (!chatId) {
                // FIRST: Create chat entry in Redux
                dispatch(createNewChat({
                    chatId: chat._id,
                    title: chat.title,
                }))
                
                // SECOND: Add User message with REAL _id
                dispatch(addNewMessage({
                    chatId: chat._id,
                    id: userMessage._id,
                    content: message,
                    role: "user",
                }))

                // THIRD: Add AI message
                dispatch(addNewMessage({
                    chatId: chat._id,
                    id: aiMessage._id,
                    content: aiMessage.content,
                    role: aiMessage.role,
                }))

                // LAST: Set as current chat
                dispatch(setCurrentChatId(chat._id))
            } else {
                // For existing chats, just add the AI message 
                // User message was already added as temp- above
                dispatch(addNewMessage({
                    chatId: chat._id,
                    id: aiMessage._id,
                    content: aiMessage.content,
                    role: aiMessage.role,
                }))
            }

            return chat._id
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Something went wrong"))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ── Get All Chats (sidebar) ──
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

    // ── Open Chat (load messages) ──
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

    // ── Delete Chat ──
    async function handleDeleteChat(chatId) {
        try {
            await deleteChat(chatId)
            dispatch(deleteChatAction(chatId))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to delete chat"))
        }
    }

    // ── Update Message ──
    async function handleUpdateMessage(messageId, newContent, chatId, proSearch = false) {
        const targetChatId = chatId || currentChatId

        dispatch(setLoading(true))
        try {
            await updateMessage(messageId, newContent, proSearch)
            if (!targetChatId) return
            const data = await getMessages(targetChatId)
            dispatch(setMessages({
                chatId: targetChatId,
                messages: data.messages.map(msg => ({
                    id: msg._id,
                    content: msg.content,
                    role: msg.role,
                })),
            }))
        } catch (error) {
            dispatch(setError(error?.response?.data?.message ?? "Failed to update message"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    // ── New Chat (reset current) ──
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