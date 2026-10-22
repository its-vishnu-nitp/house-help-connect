/**
 * ============================================================================
 * FILE: messageController.js
 * PURPOSE: Handles saving and fetching chat history between clients and workers.
 * MODELS USED: Message, User
 * ============================================================================
 */

import Message from "../models/Message.js";
import User from "../models/User.js";
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

// @desc    List my conversations: one entry per chat partner with the
//          last message and my unread count, latest activity first.
// @route   GET /api/messages
// @access  Private
export const getConversations = asyncHandler(async (req, res, next) => {
  const me = req.user._id;

  // Group every message I'm part of by the OTHER participant, keeping
  // the newest message per partner.
  const grouped = await Message.aggregate([
    {
      $match: { $or: [{ sender: me }, { receiver: me }] },
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: [{ $eq: ["$sender", me] }, "$receiver", "$sender"],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    { $sort: { "lastMessage.createdAt": -1 } },
  ]);

  const partnerIds = grouped.map((g) => g._id);

  // Unread counts per partner (messages they sent me that I haven't read)
  const unreadRows = await Message.aggregate([
    { $match: { receiver: me, isRead: false, sender: { $in: partnerIds } } },
    { $group: { _id: "$sender", count: { $sum: 1 } } },
  ]);
  const unreadByPartner = new Map(unreadRows.map((r) => [r._id.toString(), r.count]));

  const partners = await User.find({ _id: { $in: partnerIds } }).select("name role");
  const partnerById = new Map(partners.map((p) => [p._id.toString(), p]));

  const conversations = grouped
    .filter((g) => partnerById.has(g._id.toString()))
    .map((g) => {
      const partner = partnerById.get(g._id.toString());
      const last = g.lastMessage;
      return {
        user: { _id: partner._id, name: partner.name, role: partner.role },
        lastMessage: {
          content: last.content,
          createdAt: last.createdAt,
          sender: last.sender,
        },
        unreadCount: unreadByPartner.get(g._id.toString()) || 0,
      };
    });

  res.status(200).json({
    success: true,
    conversations,
  });
});