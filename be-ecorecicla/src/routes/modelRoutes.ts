import express from 'express';
import authApi from '../utils/middleware/apitoken';
import { cancelScan, cancelScanError, completeTransaction, getBarcodeScan, getImagesByTransaction, getTransactionHistory, verifyImage, verifyMachine } from '../controllers/model/modelController';
import authenticate from '../utils/middleware/authenticate';
import { upload } from '../utils/upload';

const router = express.Router();

router.post('/cancel', authenticate, cancelScan);
router.post('/cancel-error', authenticate, cancelScanError);
router.post('/verify-machine/:barcode', authApi, verifyMachine);
router.post('/upload/image', upload.single('image'), authApi, verifyImage);
router.post('/complete-scan', authApi, completeTransaction);
router.get('/images', authenticate, getImagesByTransaction);
router.get('/history', authenticate, getTransactionHistory);

router.post('/:barcode', authApi, getBarcodeScan);


export const modelRoutes = router;