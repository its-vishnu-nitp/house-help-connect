/**
 * ============================================================================
 * FILE: messageController.js
 * PURPOSE: Handles saving and fetching chat history between clients and workers.
 * MODELS USED: Message, User
 * ============================================================================
 */

import Message from "../models/Message.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
export const sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId, content, bookingReference } = req.body;

  if (!receiverId || !content) {
    return next(new AppError("Receiver ID and message content are required", 400));
  }

  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    content,
    bookingReference // Optional: if the chat is linked to a specific job
  });

  res.status(201).json({
    success: true,
    message
  });
});

// @desc    Get conversation history between logged-in user and another user
// @route   GET /api/messages/:otherUserId
// @access  Private
export const getConversation = asyncHandler(async (req, res, next) => {
  const { otherUserId } = req.params;

  // Find messages where (Sender=Me & Receiver=Them) OR (Sender=Them & Receiver=Me)
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: otherUserId },
      { sender: otherUserId, receiver: req.user.id }
    ]
  }).sort("createdAt"); // Oldest to newest (standard chat UI flow)

  res.status(200).json({
    success: true,
    count: messages.length,
    messages
  });
});

// @desc    Mark all messages in a conversation as read
// @route   PUT /api/messages/:otherUserId/read
// @access  Private
export const markAsRead = asyncHandler(async (req, res, next) => {
  const { otherUserId } = req.params;

  // Update messages sent BY the other user TO me, where isRead is false
  await Message.updateMany(
    { sender: otherUserId, receiver: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: "Messages marked as read"
  });
});