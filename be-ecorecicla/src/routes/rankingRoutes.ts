import express from 'express';
import authenticate from '../utils/middleware/authenticate';
import { getLeaderboard } from '../controllers/rankingController';

const router = express.Router();

router.get('/', authenticate, getLeaderboard);

export const rankingRoutes = router;