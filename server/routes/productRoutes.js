import express from 'express';
import { 
  getProducts, 
  getProductsBySeason, 
  getProductById,
  getRecommendedProducts,
  saveProduct,
  unsaveProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/recommended', protect, getRecommendedProducts);
router.get('/season/:season', getProductsBySeason);
router.get('/:id', getProductById);
router.route('/:id/save')
  .post(protect, saveProduct)
  .delete(protect, unsaveProduct);

export default router;
