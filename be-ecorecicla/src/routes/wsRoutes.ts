import express from 'express';
import expressWs from 'express-ws';
import { handleWSConnection } from '../controllers/ws/connectionController';

const tempApp = express();
const { applyTo } = expressWs(tempApp);

const router = express.Router();
applyTo(router);

router.ws('/:barcode', handleWSConnection);

export const wsRoutes = router;
