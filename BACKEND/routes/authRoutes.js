import { Router } from "express";

const router = Router();
import { register, login, logout, getProfile } from "../controllers/authController.js"; 
import { protect } from "../middlewares/authMiddleware.js";

router.get('/', (req, res) => {
    return res.json({ message: 'Auth API is running...' });
});
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', protect, getProfile);
export default router;