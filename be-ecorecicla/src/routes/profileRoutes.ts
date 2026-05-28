import express from 'express';
import authenticate from '../utils/middleware/authenticate';
import { getProfile, getMyProfile } from '../controllers/profileController';

const router = express.Router();

router.get('/:id', authenticate, getProfile);
router.get('/', authenticate, getMyProfile);

export const profileRoutes = router;