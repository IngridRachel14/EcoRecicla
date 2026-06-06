import express from 'express';
import multer from 'multer';
import { getProduct, createProduct, uploadProductImage } from '../controllers/productController';
import authenticate from '../utils/middleware/authenticate';
import { redeemProduct, getUserRedemptions, markRedemptionAsDelivered } from '../controllers/redeemController';

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.get('/', authenticate, getProduct);
router.post('/', authenticate, createProduct);
router.post('/:productId/images', authenticate, upload.single('image'), uploadProductImage);
router.post('/redeem', authenticate, redeemProduct);
router.get('/users/redemptions', authenticate, getUserRedemptions);
router.patch('/redemptions/:redemptionId/deliver', authenticate, markRedemptionAsDelivered);

export const productRoutes = router;