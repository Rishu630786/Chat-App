import express from "express";
import { protectRoute } from "../middleware/Auth.js";
import { getUserForSidebar , getMessages, markMessageAsSeen, sendMessage, deleteChat } from "../controllers/messageController.js";


const messageRouter = express.Router();


messageRouter.get("/users", protectRoute, getUserForSidebar);
messageRouter.get("/:id", protectRoute,getMessages);
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen );
messageRouter.post("/send/:id", protectRoute,sendMessage);
messageRouter.delete("/delete_chat/:receiver_id/", protectRoute, deleteChat)


export default messageRouter;