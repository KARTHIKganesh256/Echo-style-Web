# Echo Style Assistant Web

<div align="center">

**Your Style, Powered by AI**

A stunning full-stack web application for personalized style recommendations based on skin tone and seasonal color analysis.

</div>

## ✨ Features

### Core Features
- 🎨 **Skin Tone Analysis** - Advanced two-step questionnaire to determine undertone and depth
- 🌈 **Seasonal Color System** - Spring, Summer, Autumn, Winter palette matching
- 🛍️ **Smart Recommendations** - Personalized product suggestions based on your season
- 👤 **User Profiles** - Save your analysis results and favorite products
- 🎭 **Beautiful UI** - Glassmorphism design with smooth Framer Motion animations
- 🖱️ **Custom Cursor** - Glowing cursor effect with hover interactions
- 🌙 **Theme Toggle** - Light/Dark mode preference
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile

### 🤖 NEW: AI Style Studio
An all-in-one AI-powered fashion hub with 6 cutting-edge features:

- 📸 **AI Mirror Mode** - Real-time webcam filters showing how seasonal palettes look on you
- 👔 **Virtual Closet** - Upload clothes, get AI color analysis and outfit pairing suggestions
- 🧬 **AI Style DNA** - Your personalized style fingerprint with animated visual profile
- ✨ **AI Outfit Generator** - Create beautiful outfit combinations with fashion sketches
- 🌟 **AR Palette Glow** - Augmented reality filters with seasonal color glows (mobile optimized)
- 💖 **Palette Memory Wall** - Save, name, and share your favorite color palettes

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management with persistence
- **Axios** - API requests
- **Vite** - Fast build tool
- **TensorFlow.js** - Machine learning ready
- **MediaPipe** - Face detection & AR filters
- **Canvas API** - Real-time image & video processing
- **WebRTC** - Camera access for AI features

### Backend
- **Node.js & Express** - RESTful API
- **MongoDB & Mongoose** - Database
- **JWT** - Secure authentication
- **bcryptjs** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Echo k"
```

### 2. Set Up Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echo-style-assistant
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### 3. Set Up Frontend

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed the Database (Optional)

```bash
cd server
node data/seedDatabase.js
```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Analysis
- `POST /api/analyze-tone` - Analyze skin tone (protected)
- `GET /api/analyze-tone/palette/:season` - Get season palette info

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/season/:season` - Get products by season
- `GET /api/products/recommended` - Get recommended products (protected)
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/save` - Save product to favorites (protected)
- `DELETE /api/products/:id/save` - Remove from favorites (protected)

## 🎨 Color Analysis Logic

The application uses a rule-based seasonal color analysis system:

```javascript
if (undertone === "Warm" && (depth === "Fair" || depth === "Light")) 
  → Spring

if (undertone === "Warm" && (depth === "Medium" || depth === "Deep" || depth === "Olive")) 
  → Autumn

if (undertone === "Cool" && (depth === "Fair" || depth === "Light")) 
  → Summer

if (undertone === "Cool" && (depth === "Medium" || depth === "Deep" || depth === "Olive")) 
  → Winter

else 
  → Neutral
```

## 🎯 Project Structure

```
Echo k/
├── client/                 # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand state management
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── server/                # Backend Node.js application
    ├── config/            # Database configuration
    ├── controllers/       # Route controllers
    ├── data/              # Seed data
    ├── middleware/        # Custom middleware
    ├── models/            # Mongoose models
    ├── routes/            # API routes
    ├── utils/             # Utilities
    ├── package.json
    └── server.js          # Entry point
```

## 🌟 Key Features Explained

### Seasonal Color Analysis
Users answer two questions to determine their season:
1. **Undertone Test** - Vein test & jewelry preference
2. **Skin Depth** - Fair to Ebony scale

### Product Recommendation Engine
- Products are tagged with season, undertone, hue, chroma, and value
- Algorithm matches products primarily by season
- Neutral undertones get balanced recommendations

### 🤖 AI Style Studio (NEW!)
A comprehensive AI-powered fashion playground:

#### 1. AI Mirror Mode
- Real-time webcam with seasonal color filters
- Live palette switching (Spring, Summer, Autumn, Winter)
- Glow effects and custom color overlays
- See how colors look on you instantly

#### 2. Virtual Closet Organizer
- Upload photos of your clothes
- AI extracts dominant colors automatically
- Season categorization and color analysis
- Smart pairing suggestions based on color harmony

#### 3. AI Style DNA
- Learns from your interactions across all features
- Creates a unique "Style DNA Card"
- Animated gradient ring visualization
- Percentage breakdown by seasonal preference
- Personalized style personality description

#### 4. AI Outfit Generator
- Select season + mood (Casual, Formal, Artistic, Energetic)
- Generates 3 unique outfit combinations
- Minimal SVG fashion sketches (not product images)
- Save and export your favorite looks

#### 5. AR Palette Glow
- Augmented reality filters for mobile
- Radial gradient overlays matching your season
- Vignette and sparkle effects
- Live color ambiance transformation

#### 6. Palette Memory Wall
- Create and name custom color palettes
- Mark favorites with animated badges
- Share via unique links (clipboard copy)
- Beautiful animated color swatches

**Tech Behind AI Studio:**
- Canvas API for real-time image processing
- WebRTC for camera access
- Zustand with persistence for data storage
- Framer Motion for smooth animations
- Custom color algorithms (RGB distance, dominant color extraction)
- TensorFlow.js ready for ML enhancements

### Beautiful Animations
- Smooth page transitions with Framer Motion
- Hover effects on cards and buttons
- Parallax scrolling on landing page
- Custom glowing cursor effect
- Animated AI Studio components

### User Experience
- Glassmorphism design for modern aesthetic
- Soft gradients and blurred backgrounds
- Responsive design for all devices
- Loading states and skeleton UIs
- Protected routes for authenticated features

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes on both frontend and backend
- CORS enabled for cross-origin requests

## 🎨 Design Philosophy

The UI follows a **natural, elegant, and modern** design approach:
- Soft pastel gradients
- Glassmorphism effects
- Subtle animations (not flashy)
- Warm, welcoming color palette
- Minimalistic typography (Poppins, DM Sans)

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables
2. Connect to MongoDB Atlas
3. Deploy the `server` directory

### Frontend Deployment (e.g., Vercel, Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/dist` directory
3. Set `VITE_API_URL` to your backend URL

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built with ❤️ for Echo Style Assistant

---

<div align="center">

**Discover Your Perfect Palette Today!** 🎨

</div>
