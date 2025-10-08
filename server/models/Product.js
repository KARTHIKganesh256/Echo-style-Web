import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  imageUrl: {
    type: String,
    required: true
  },
  undertone: {
    type: String,
    enum: ['Warm', 'Cool', 'Neutral'],
    required: true
  },
  season: {
    type: String,
    enum: ['Spring', 'Summer', 'Autumn', 'Winter', 'Neutral'],
    required: true
  },
  hue: {
    type: String,
    enum: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Brown', 'Beige', 'Gray', 'Black', 'White'],
    required: true
  },
  chroma: {
    type: String,
    enum: ['Bright', 'Muted', 'Soft'],
    required: true
  },
  value: {
    type: String,
    enum: ['Light', 'Medium', 'Deep'],
    required: true
  },
  productType: {
    type: String,
    enum: ['Top', 'Bottom', 'Dress', 'Outerwear', 'Accessory', 'Shoes'],
    required: true
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
