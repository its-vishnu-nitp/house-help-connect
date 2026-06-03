// --- routes/authRoutes.js ---
import { Router } from "express";
import { register, login, logout } from "../controllers/authController.js"; 

const router = Router();

router.get('/', (req, res) => {
    return res.json({ message: 'Auth API is running...' });
});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Notice: getProfile is GONE from here!

export default router;