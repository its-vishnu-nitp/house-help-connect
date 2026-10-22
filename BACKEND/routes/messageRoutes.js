import { Router } from "express";
import {
  sendMessage,
  getConversation,
  markAsRead,
  getConversations,
} from "../controllers/messageController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// Every messaging route requires a logged-in user.
router.use(protect);

// Conversation list (chat inbox) — must be declared before /:otherUserId.
router.get("/", getConversations);

// Send a new message
router.post("/", sendMessage);

// Conversation history with one user (oldest → newest)
router.get("/:otherUserId", getConversation);

// Mark a conversation as read
router.put("/:otherUserId/read", markAsRead);

export default router;
