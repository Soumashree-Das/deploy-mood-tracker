import {Router} from "express";
import {chatBotController,chatWithBot} from "../controllers/chatbot.controller.js";

const router = Router();

// router.post("/startchat",startChat);
router.post("/chatbot",chatBotController);

export default router;
