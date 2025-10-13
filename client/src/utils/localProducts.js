// Local products data for when Supabase is not available
export const localProducts = [
  {
    id: 1,
    name: "Coral Blush",
    brand: "Beauty Co",
    category: "Makeup",
    price: 24.99,
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    description: "Warm coral blush perfect for spring complexions",
    season: "Spring",
    undertone: "Warm",
    hue: "Orange",
    chroma: "Medium",
    value: "Light",
    tags: ["blush", "coral", "spring", "warm"],
    rating: 4.5
  },
  {
    id: 2,
    name: "Cool Pink Lipstick",
    brand: "Makeup Pro",
    category: "Makeup",
    price: 19.99,
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    description: "Cool-toned pink lipstick for summer vibes",
    season: "Summer",
    undertone: "Cool",
    hue: "Pink",
    chroma: "Medium",
    value: "Medium",
    tags: ["lipstick", "pink", "summer", "cool"],
    rating: 4.2
  },
  {
    id: 3,
    name: "Warm Bronze Eyeshadow",
    brand: "Glam Beauty",
    category: "Makeup",
    price: 32.99,
    image_url: "https://images.unsplash.com/photo-1515688594390-b649af70d282?w=400",
    description: "Rich bronze eyeshadow for autumn warmth",
    season: "Autumn",
    undertone: "Warm",
    hue: "Brown",
    chroma: "High",
    value: "Dark",
    tags: ["eyeshadow", "bronze", "autumn", "warm"],
    rating: 4.7
  },
  {
    id: 4,
    name: "Deep Berry Lipstick",
    brand: "Lux Cosmetics",
    category: "Makeup",
    price: 28.99,
    image_url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
    description: "Deep berry lipstick for winter elegance",
    season: "Winter",
    undertone: "Cool",
    hue: "Purple",
    chroma: "High",
    value: "Dark",
    tags: ["lipstick", "berry", "winter", "cool"],
    rating: 4.6
  },
  {
    id: 5,
    name: "Peachy Foundation",
    brand: "Skin Perfect",
    category: "Foundation",
    price: 45.99,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Light peach foundation for warm undertones",
    season: "Spring",
    undertone: "Warm",
    hue: "Peach",
    chroma: "Low",
    value: "Light",
    tags: ["foundation", "peach", "spring", "warm"],
    rating: 4.3
  },
  {
    id: 6,
    name: "Cool Concealer",
    brand: "Cover All",
    category: "Foundation",
    price: 22.99,
    image_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400",
    description: "Cool-toned concealer for brightening",
    season: "Summer",
    undertone: "Cool",
    hue: "Beige",
    chroma: "Low",
    value: "Light",
    tags: ["concealer", "cool", "summer", "brightening"],
    rating: 4.1
  }
];

export const getProducts = (filters = {}) => {
  let filteredProducts = [...localProducts];
  
  // Apply filters
  if (filters.season && filters.season !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.season === filters.season);
  }
  
  if (filters.hue && filters.hue !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.hue === filters.hue);
  }
  
  if (filters.productType && filters.productType !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.category === filters.productType);
  }
  
  if (filters.chroma && filters.chroma !== 'All') {
    filteredProducts = filteredProducts.filter(p => p.chroma === filters.chroma);
  }
  
  return filteredProducts;
};

export const getProductById = (id) => {
  return localProducts.find(p => p.id === parseInt(id));
};

export const searchProducts = (query) => {
  if (!query) return localProducts;
  
  const lowercaseQuery = query.toLowerCase();
  return localProducts.filter(p => 
    p.name.toLowerCase().includes(lowercaseQuery) ||
    p.brand.toLowerCase().includes(lowercaseQuery) ||
    p.description.toLowerCase().includes(lowercaseQuery) ||
    p.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};






