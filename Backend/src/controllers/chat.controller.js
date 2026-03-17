import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message ,chat: chatId } = req.body;

  let title = null, chat = null;

    if (!chatId) {
        title = await generateChatTitle(message);
        chat = await chatModel.create({
            user: req.user.id,
            title
        })
    }

  const userMessage = await messageModel.create({
    chat: chat.id,
    content: message,
    role: "user",
  });

//    const messages = await messageModel.find({ chat: chatId })

  const aiMessage = await messageModel.create({
    chat: chat.id,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    aiMessage: result,
    title,
    chat,
    aiMessage,
  });
}

// export async function getChats(req, res){

// }

// export async function getMessages(req, res) {

// }

// export async function deleteChat(req, res) {

// }
