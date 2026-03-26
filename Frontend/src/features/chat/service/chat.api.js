import axios from "axios";

const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const sendMessage = async ({ message: content, chatId }) => {
  const payload = { content };
  if (chatId) payload.chat = chatId;
  const response = await api.post("/api/chats/message", payload);
  return response.data;
};

export const getChats = async () => {
  const response = await api.get("/api/chats");
  return response.data;
};

export const getMessages = async (chatId) => {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
};

export const updateMessage =async (messageId,content)=>{
const response =await api.patch(`/api/chats/update/${messageId}`,{content})
return response.data
}

export const deleteChat = async (chatId) => {
  const response = await api.delete(`/api/chats/delete/${chatId}`);
  return response.data;
};
