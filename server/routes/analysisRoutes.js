import express from 'express';
import { analyzeTone, getSeasonPalette } from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, analyzeTone);
router.get('/palette/:season', getSeasonPalette);

export default router;
