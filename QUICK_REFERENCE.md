# 🚀 Echo Style Assistant - Quick Reference

## ⚡ Installation Commands

### Automated Installation
```bash
# Unix/Mac/Linux
bash install.sh

# Windows
install.bat

# Or using npm (from root)
npm install
npm run install-all
```

### Manual Installation
```bash
cd server && npm install
cd ../client && npm install
```

## 🎯 Running the Application

### Development Mode (Recommended)

**Option 1: Two separate terminals**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

**Option 2: Concurrent (if concurrently is installed)**
```bash
# From root directory
npm run dev
```

### Production Mode
```bash
# Backend
cd server
npm start

# Frontend (build first)
cd client
npm run build
npm run preview
```

## 🗄️ Database Commands

### Start MongoDB (Local)
```bash
# Windows
mongod

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### Seed Database
```bash
cd server
node data/seedDatabase.js
```

### Reset Database
```bash
# In MongoDB shell
mongo
use echo-style-assistant
db.dropDatabase()
exit

# Then re-seed
cd server
node data/seedDatabase.js
```

## 🔧 Common Tasks

### Clear Node Modules & Reinstall
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Clear Vite Cache
```bash
cd client
rm -rf node_modules/.vite
npm run dev
```

### View Logs
```bash
# Backend logs (in terminal running npm run dev)
# Frontend logs (in browser console - F12)
```

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | `http://localhost:3000` | React application |
| Backend API | `http://localhost:5000` | Express server |
| MongoDB | `mongodb://localhost:27017` | Database (local) |

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echo-style-assistant
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

### Client (.env) - Optional
```env
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing the Application

### 1. Test Authentication
```bash
# Register a new user
POST http://localhost:5000/api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Test Analysis
```bash
# Analyze tone (requires auth token)
POST http://localhost:5000/api/analyze-tone
Headers: { "Authorization": "Bearer <token>" }
{
  "undertone": "Warm",
  "depth": "Medium"
}
```

### 3. Test Products
```bash
# Get all products
GET http://localhost:5000/api/products

# Get by season
GET http://localhost:5000/api/products/season/Autumn

# With filters
GET http://localhost:5000/api/products?season=Spring&hue=Pink
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Or change PORT in server/.env
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows
tasklist | findstr mongod

# Mac/Linux
ps aux | grep mongod

# If not running, start it (see Database Commands)
```

### CORS Issues
```bash
# Make sure both servers are running
# Check VITE_API_URL in client/.env
# Verify CORS is enabled in server/server.js
```

### Module Not Found
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📦 Package Management

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install <package>@latest
```

### Add New Package
```bash
# Backend
cd server
npm install <package-name>

# Frontend
cd client
npm install <package-name>
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy /client/dist directory
```

### Backend (Heroku/Railway/Render)
```bash
# Deploy /server directory
# Set environment variables on platform
# Connect to MongoDB Atlas
```

### MongoDB (Atlas)
```bash
# 1. Create account at mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Get connection string
# 4. Update MONGODB_URI in .env
```

## 📚 Useful Commands

### Check Versions
```bash
node -v          # Node.js version
npm -v           # npm version
mongod --version # MongoDB version
```

### Project Info
```bash
npm list         # List installed packages
npm run          # List available scripts
```

### Clean Build
```bash
cd client
npm run build    # Build for production
```

## 🎨 Development Workflow

1. Start MongoDB
2. Run backend: `cd server && npm run dev`
3. Run frontend: `cd client && npm run dev`
4. Open browser: `http://localhost:3000`
5. Make changes (hot reload enabled)
6. Test features
7. Commit changes

## 🔑 Default Credentials

**Note:** No default users exist. Create accounts via signup page.

## 📞 Getting Help

1. Check `SETUP_GUIDE.md` for detailed setup
2. Check `README.md` for comprehensive docs
3. Check `FEATURES.md` for feature list
4. Check browser console for frontend errors
5. Check terminal for backend errors

## 🎯 Quick Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] MongoDB connection successful
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Can complete skin tone analysis
- [ ] Can view products with filters
- [ ] Can save products to favorites
- [ ] Can view profile with saved data
- [ ] Can logout and login again

## 💡 Pro Tips

1. **Use nodemon**: Automatically restarts server on changes
2. **Use React DevTools**: Debug React components
3. **Use MongoDB Compass**: Visual database browser
4. **Clear browser cache**: If styles don't update
5. **Check console**: First place to look for errors
6. **Hot reload**: Changes apply automatically in dev mode

---

**Need more help?** See full documentation in README.md
