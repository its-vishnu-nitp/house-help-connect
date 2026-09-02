/**
 * ============================================================================
 * FILE: notificationController.js
 * PURPOSE: Handles system alerts for the user dashboard.
 * MODELS USED: Notification
 * ============================================================================
 */

import Notification from "../models/Notification.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = asyncHandler(async (req, res, next) => {
  const notifications = await Notification.find({ recipient: req.user.id })
    .sort("-createdAt"); // Newest first

  // Calculate unread count for the UI badge
  const unreadCount = notifications.filter(n => !n.isRead).length;

  res.status(200).json({
    success: true,
    count: notifications.length,
    unreadCount,
    notifications
  });
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError("Notification not found", 404));
  }

  // Ensure the notification belongs to the logged-in user
  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError("Not authorized", 403));
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    notification
  });
});

// @desc    Mark all notifications as read (for a "Clear All" button)
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = asyncHandler(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read"
  });
});