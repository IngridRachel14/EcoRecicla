import express from 'express';
import { loginUser, registerUser, requestPasswordReset, resetPassword, validateToken } from '../controllers/authController';
import authenticate from '../utils/middleware/authenticate';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);
router.get('/validate-token', authenticate, validateToken)

export const authRoutes = router;