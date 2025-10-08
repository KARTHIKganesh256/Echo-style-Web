import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get all products with optional filters
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { season, hue, productType, undertone } = req.query;
    
    let query = {};

    if (season && season !== 'All') {
      query.season = season;
    }
    
    if (hue && hue !== 'All') {
      query.hue = hue;
    }
    
    if (productType && productType !== 'All') {
      query.productType = productType;
    }

    if (undertone && undertone !== 'All') {
      query.undertone = undertone;
    }

    const products = await Product.find(query);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get products by season
// @route   GET /api/products/season/:season
// @access  Public
export const getProductsBySeason = async (req, res) => {
  try {
    const { season } = req.params;
    
    const products = await Product.find({ season });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended products for user
// @route   GET /api/products/recommended
// @access  Private
export const getRecommendedProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || !user.skinAnalysis || !user.skinAnalysis.season) {
      return res.status(400).json({ message: 'Please complete skin tone analysis first' });
    }

    const { season, undertone } = user.skinAnalysis;

    // Primary recommendations: match season
    const primaryProducts = await Product.find({ season });

    // Secondary recommendations: for neutral, also include complementary seasons
    let secondaryProducts = [];
    if (season === 'Neutral' || undertone === 'Neutral') {
      secondaryProducts = await Product.find({ 
        season: { $ne: season },
        chroma: 'Soft'
      }).limit(10);
    }

    const allProducts = [...primaryProducts, ...secondaryProducts];

    res.json(allProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save product to user's favorites
// @route   POST /api/products/:id/save
// @access  Private
export const saveProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (user.savedProducts.includes(product._id)) {
      return res.status(400).json({ message: 'Product already saved' });
    }

    user.savedProducts.push(product._id);
    await user.save();

    res.json({ message: 'Product saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from user's favorites
// @route   DELETE /api/products/:id/save
// @access  Private
export const unsaveProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.savedProducts = user.savedProducts.filter(
      id => id.toString() !== req.params.id
    );

    await user.save();

    res.json({ message: 'Product removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
