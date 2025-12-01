// backend/Routes/ChatRouter.js
import express from "express";
import { chatWithOpenRouter, clearChatHistory } from "../Controllers/ChatController.js";

const router = express.Router();

router.post("/", chatWithOpenRouter);
router.post("/clear", clearChatHistory);

export default router;
