import express from "express"
import {handleGetMessages, handleSendMessage} from "../controllers/messageController.js"
import {auth} from "../middleware/auth.middleware.js"


const messageRouter = new express.Router()

messageRouter.get("/:roomId",auth, handleGetMessages)
messageRouter.post("/:roomId", auth, handleSendMessage)

export default messageRouter;