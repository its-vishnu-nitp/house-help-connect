import { Router } from "express";
import { 
  getUserProfile, 
  updateMyProfile,
  searchWorkers,
  getWorkerProfileById,
  toggleSaveProfessional,
  verifyAadhaar,
  updateAvailability
} from "../controllers/profileController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

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

// Demo Aadhaar e-KYC — persists the number + verified flag
router.put("/verify-aadhaar", verifyAadhaar);

// Worker availability toggle (pauses/resumes visibility in search)
router.put("/availability", updateAvailability);

// Client actions
router.post("/save-worker", toggleSaveProfessional);

export default router;