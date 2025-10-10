import express from 'express';
import {
  analyzeSkinCare,
  getSkinCareAnalysis,
  updateSkinCareAnalysis,
  deleteSkinCareAnalysis
} from '../controllers/skinCareController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// POST /api/skin-care/analyze - Create new skin care analysis
router.post('/analyze', analyzeSkinCare);

// GET /api/skin-care/analysis - Get user's skin care analysis
router.get('/analysis', getSkinCareAnalysis);

// PUT /api/skin-care/analysis - Update user's skin care analysis
router.put('/analysis', updateSkinCareAnalysis);

// DELETE /api/skin-care/analysis - Delete user's skin care analysis
router.delete('/analysis', deleteSkinCareAnalysis);

export default router;
