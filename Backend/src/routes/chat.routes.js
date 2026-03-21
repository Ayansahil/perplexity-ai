import { Router } from "express";
import {sendMessage,getChats,getMessages,updateMessage,deleteChat} from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
import { aiModelLimiter } from "../middlewares/rateLimit.middleware.js";


const chatRouter = Router();



chatRouter.post("/message", authUser, aiModelLimiter, sendMessage)

chatRouter.get("/", authUser, getChats)

chatRouter.get("/:chatId/messages", authUser, getMessages)

chatRouter.patch("/update/:messageId",authUser,updateMessage)

chatRouter.delete("/delete/:chatId", authUser, deleteChat)



export default chatRouter;