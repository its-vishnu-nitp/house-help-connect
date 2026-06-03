// --- routes/profileRoutes.js ---
import { Router } from "express";
import { getUserProfile, updateProfile } from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

// All profile routes require the user to be logged in
router.use(protect); 

router.get("/", getUserProfile);
router.post("/update", updateProfile);

export default router;