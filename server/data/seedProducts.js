// Sample product data for seeding the database
const products = [
  // Spring Products
  {
    name: "Coral Sunset Blouse",
    description: "Light and breezy coral blouse with delicate pleating, perfect for warm spring days.",
    price: 48,
    imageUrl: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500",
    undertone: "Warm",
    season: "Spring",
    hue: "Pink",
    chroma: "Bright",
    value: "Light",
    productType: "Top",
    inStock: true
  },
  {
    name: "Peach Breeze Sundress",
    description: "Flowing peach sundress with soft yellow undertones, ideal for bright spring afternoons.",
    price: 68,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    undertone: "Warm",
    season: "Spring",
    hue: "Orange",
    chroma: "Bright",
    value: "Light",
    productType: "Dress",
    inStock: true
  },
  {
    name: "Golden Daffodil Cardigan",
    description: "Warm golden yellow cardigan with soft knit texture.",
    price: 72,
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
    undertone: "Warm",
    season: "Spring",
    hue: "Yellow",
    chroma: "Bright",
    value: "Light",
    productType: "Outerwear",
    inStock: true
  },
  {
    name: "Mint Fresh Pants",
    description: "Light mint green casual pants with a modern fit.",
    price: 54,
    imageUrl: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
    undertone: "Warm",
    season: "Spring",
    hue: "Green",
    chroma: "Bright",
    value: "Light",
    productType: "Bottom",
    inStock: true
  },

  // Summer Products
  {
    name: "Lavender Dream Blouse",
    description: "Soft lavender blouse with cool undertones, perfect for summer elegance.",
    price: 52,
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500",
    undertone: "Cool",
    season: "Summer",
    hue: "Purple",
    chroma: "Soft",
    value: "Light",
    productType: "Top",
    inStock: true
  },
  {
    name: "Powder Blue Midi Dress",
    description: "Elegant powder blue dress with delicate draping and cool sophistication.",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
    undertone: "Cool",
    season: "Summer",
    hue: "Blue",
    chroma: "Soft",
    value: "Light",
    productType: "Dress",
    inStock: true
  },
  {
    name: "Rose Mauve Sweater",
    description: "Cozy mauve sweater with subtle cool pink tones.",
    price: 64,
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    undertone: "Cool",
    season: "Summer",
    hue: "Pink",
    chroma: "Soft",
    value: "Light",
    productType: "Top",
    inStock: true
  },
  {
    name: "Periwinkle Silk Pants",
    description: "Flowing silk pants in a beautiful periwinkle shade.",
    price: 78,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
    undertone: "Cool",
    season: "Summer",
    hue: "Blue",
    chroma: "Soft",
    value: "Medium",
    productType: "Bottom",
    inStock: true
  },

  // Autumn Products
  {
    name: "Rust Orange Turtleneck",
    description: "Rich rust orange turtleneck with deep warm tones, perfect for autumn.",
    price: 58,
    imageUrl: "https://images.unsplash.com/photo-1620799140188-3b2a7c2e0e12?w=500",
    undertone: "Warm",
    season: "Autumn",
    hue: "Orange",
    chroma: "Muted",
    value: "Deep",
    productType: "Top",
    inStock: true
  },
  {
    name: "Olive Green Sweater",
    description: "Soft wool sweater in earthy olive tones with warm golden undertones.",
    price: 59,
    imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500",
    undertone: "Warm",
    season: "Autumn",
    hue: "Green",
    chroma: "Muted",
    value: "Deep",
    productType: "Top",
    inStock: true
  },
  {
    name: "Caramel Brown Coat",
    description: "Luxurious caramel brown coat with rich depth and warmth.",
    price: 145,
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    undertone: "Warm",
    season: "Autumn",
    hue: "Brown",
    chroma: "Muted",
    value: "Deep",
    productType: "Outerwear",
    inStock: true
  },
  {
    name: "Burgundy Velvet Dress",
    description: "Deep burgundy velvet dress with warm red undertones.",
    price: 98,
    imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500",
    undertone: "Warm",
    season: "Autumn",
    hue: "Red",
    chroma: "Muted",
    value: "Deep",
    productType: "Dress",
    inStock: true
  },

  // Winter Products
  {
    name: "Crimson Red Blazer",
    description: "Bold crimson red blazer with cool undertones and striking presence.",
    price: 125,
    imageUrl: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=500",
    undertone: "Cool",
    season: "Winter",
    hue: "Red",
    chroma: "Bright",
    value: "Deep",
    productType: "Outerwear",
    inStock: true
  },
  {
    name: "Royal Blue Silk Blouse",
    description: "Stunning royal blue silk blouse with vivid cool tones.",
    price: 82,
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500",
    undertone: "Cool",
    season: "Winter",
    hue: "Blue",
    chroma: "Bright",
    value: "Deep",
    productType: "Top",
    inStock: true
  },
  {
    name: "Emerald Cocktail Dress",
    description: "Elegant emerald green dress with cool blue-green undertones.",
    price: 135,
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500",
    undertone: "Cool",
    season: "Winter",
    hue: "Green",
    chroma: "Bright",
    value: "Deep",
    productType: "Dress",
    inStock: true
  },
  {
    name: "Jet Black Turtleneck",
    description: "Classic jet black turtleneck with crisp, cool undertones.",
    price: 48,
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    undertone: "Cool",
    season: "Winter",
    hue: "Black",
    chroma: "Bright",
    value: "Deep",
    productType: "Top",
    inStock: true
  },

  // Neutral Products
  {
    name: "Classic White Shirt",
    description: "Timeless white button-up shirt suitable for all seasons.",
    price: 45,
    imageUrl: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500",
    undertone: "Neutral",
    season: "Neutral",
    hue: "White",
    chroma: "Soft",
    value: "Light",
    productType: "Top",
    inStock: true
  },
  {
    name: "Soft Gray Sweater",
    description: "Versatile soft gray sweater that complements any undertone.",
    price: 58,
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
    undertone: "Neutral",
    season: "Neutral",
    hue: "Gray",
    chroma: "Soft",
    value: "Medium",
    productType: "Top",
    inStock: true
  },
  {
    name: "Beige Trench Coat",
    description: "Classic beige trench coat with neutral sophistication.",
    price: 165,
    imageUrl: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500",
    undertone: "Neutral",
    season: "Neutral",
    hue: "Beige",
    chroma: "Soft",
    value: "Light",
    productType: "Outerwear",
    inStock: true
  },
  {
    name: "Taupe Midi Skirt",
    description: "Elegant taupe midi skirt with balanced neutral tones.",
    price: 62,
    imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500",
    undertone: "Neutral",
    season: "Neutral",
    hue: "Beige",
    chroma: "Soft",
    value: "Medium",
    productType: "Bottom",
    inStock: true
  }
];

export default products;
