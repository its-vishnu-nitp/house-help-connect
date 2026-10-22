import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markNotificationRead);

export default router;
