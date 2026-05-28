import express from 'express';
import { getProduct } from '../controllers/productController';
import authenticate from '../utils/middleware/authenticate';
import { redeemProduct, getUserRedemptions, markRedemptionAsDelivered } from '../controllers/redeemController';

const router = express.Router();

router.get('/', authenticate, getProduct);
router.post('/redeem', authenticate, redeemProduct);
router.get('/users/redemptions', authenticate, getUserRedemptions);
router.patch('/redemptions/:redemptionId/deliver', authenticate, markRedemptionAsDelivered);

export const productRoutes = router;