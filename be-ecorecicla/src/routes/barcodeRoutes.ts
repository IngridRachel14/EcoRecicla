import express from 'express';
import { getBarcode, readBarcode } from '../controllers/barcodeController';
import authenticate from '../utils/middleware/authenticate';

const router = express.Router();

router.get('/barcode', authenticate, getBarcode);
router.post('/barcode/:uuid', authenticate, readBarcode);

export const barcodeRoutes = router;