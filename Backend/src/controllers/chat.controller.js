import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  

  const { message, content, chat: chatId } = req.body;
  const finalContent = content || message;

  if (!finalContent || typeof finalContent !== "string" || finalContent.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Message content is required",
    });
  }

  if (!req.user || !req.user.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  let title = null;
  let chat = null;
  let currentChatId = chatId;

  if (!currentChatId) {
    title = await generateChatTitle(finalContent);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
    currentChatId = chat.id;
  } else {
    chat = await chatModel.findById(currentChatId);
    if (!chat) {
       return res.status(404).json({
         success: false,
         message: "Chat not found",
       });
    }
  }

  await messageModel.create({
    chat: currentChatId,
    content: finalContent,
    role: "user",
  });

  const messages = await messageModel.find({ chat: currentChatId });

  const result = await generateResponse(messages);

  const aiMessage = await messageModel.create({
    chat: currentChatId,
    content: result,
    role: "ai",
  });

  res.status(201).json({
    title,
    chat,
    aiMessage,
  });
}

export async function getChats(req, res) {
  const user = req.user;
  const chats = await chatModel.find({ user: user.id });
  res.status(200).json({
    message: "Chats retrieved successfully",
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel.find({
    chat: chatId,
  });

  res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
  });
}

export async function updateMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const message = await messageModel.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    message.content = content;
    await message.save();

    await messageModel.deleteMany({
      chat: message.chat,
      role: "ai",
      createdAt: { $gt: message.createdAt },
    });

    const messages = await messageModel.find({ chat: message.chat })

    const aiText = await generateResponse(messages);

    const newAIMessage = await messageModel.create({
      chat: message.chat,
      content: aiText,
      role: "ai",
    });

    return res.status(200).json({
      success: true,
      data: {
        updatedMessage: message,
        aiMessage: newAIMessage,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function deleteChat(req, res) {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({ 
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  await chatModel.findByIdAndDelete(chatId);  
  await messageModel.deleteMany({ chat: chatId });

  res.status(200).json({
    message: "Chat deleted successfully",
    success: true,
  });
}