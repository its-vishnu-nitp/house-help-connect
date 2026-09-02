import { Router } from "express";
import { 
  getUserProfile, 
  updateMyProfile,
  searchWorkers,
  getWorkerProfileById,
  toggleSaveProfessional
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();
console.log("Profile routes loaded");

// 1. PUBLIC ROUTES (Allow search & profile view without strict session lock)
router.get("/search", searchWorkers);
router.get("/worker/:id", getWorkerProfileById);

// 2. PROTECTED ROUTES (Require valid JWT/session)
router.use(protect); 

// Base profile fetches (Handles page reloads in SettingsView)
router.get("/", getUserProfile);
router.get("/me", getUserProfile);

// Profile persistence update endpoint
router.put("/update", updateMyProfile);

// Client actions
router.post("/save-worker", toggleSaveProfessional);

export default router;