import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        currentChatId: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        createNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdated: new Date().toISOString(),
            }
        },

        addNewMessage: (state, action) => {
            const { chatId, id, content, role } = action.payload
            state.chats[chatId].messages.push({ id, content, role })
        },

        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages.push(...messages)
        },

        setMessages: (state, action) => {
            const { chatId, messages } = action.payload
            if (state.chats[chatId]) {
                state.chats[chatId].messages = messages
            }
        },

        setChats: (state, action) => {
            state.chats = action.payload
        },

        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },

        deleteChat: (state, action) => {
            const chatId = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },

        setLoading: (state, action) => {
            state.isLoading = action.payload
        },

        setError: (state, action) => {
            state.error = action.payload
        },
    }
})

export const {
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    createNewChat,
    addNewMessage,
    setMessages,
    addMessages,
    deleteChat,
} = chatSlice.actions

export default chatSlice.reducer