# 🚀 Deployment Guide for Echo Style Assistant

## Quick Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend) - RECOMMENDED

#### 🌐 Frontend Deployment (Vercel)

1. **Go to [Vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository:** `KARTHIKganesh256/Echo-style-Web`
5. **Configure Project:**
   - **Root Directory:** `client`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

6. **Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.railway.app/api
   ```

7. **Click "Deploy"**

#### 🖥️ Backend Deployment (Railway)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose your repository:** `KARTHIKganesh256/Echo-style-Web`
6. **Configure Project:**
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

7. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   ```

8. **Deploy**

### Option 2: Netlify (Frontend) + Heroku (Backend)

#### 🌐 Frontend Deployment (Netlify)

1. **Go to [Netlify.com](https://netlify.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New site from Git"**
4. **Connect to GitHub** and select your repository
5. **Build settings:**
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

6. **Environment Variables:**
   ```
   VITE_API_URL=https://your-heroku-app.herokuapp.com/api
   ```

#### 🖥️ Backend Deployment (Heroku)

1. **Go to [Heroku.com](https://heroku.com)**
2. **Sign up/Login**
3. **Create new app**
4. **Connect to GitHub** and select your repository
5. **Configure buildpacks:**
   - Add Node.js buildpack
   - Set root directory to `server`

6. **Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   NODE_ENV=production
   ```

### Option 3: All-in-One with Render

1. **Go to [Render.com](https://render.com)**
2. **Sign up/Login** with GitHub
3. **Create two services:**

#### Frontend Service:
- **Type:** Static Site
- **Build Command:** `cd client && npm run build`
- **Publish Directory:** `client/dist`
- **Environment:** `VITE_API_URL=https://your-backend.onrender.com/api`

#### Backend Service:
- **Type:** Web Service
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  ```
  PORT=5000
  MONGODB_URI=your_mongodb_atlas_connection_string
  JWT_SECRET=your_super_secret_jwt_key
  NODE_ENV=production
  ```

## 🗄️ Database Setup (MongoDB Atlas)

1. **Go to [MongoDB Atlas](https://cloud.mongodb.com)**
2. **Create free cluster**
3. **Create database user**
4. **Get connection string**
5. **Add to environment variables**

## 🔧 Pre-Deployment Checklist

### Frontend Updates Needed:

1. **Update API URL in client/src/utils/api.js:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.com/api';
```

2. **Build the frontend:**
```bash
cd client
npm run build
```

### Backend Updates Needed:

1. **Update server.js for production:**
```javascript
// Add this for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}
```

2. **Add start script in server/package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

## 🚀 Quick Deploy Commands

### For Vercel CLI:
```bash
npm install -g vercel
cd client
vercel --prod
```

### For Netlify CLI:
```bash
npm install -g netlify-cli
cd client
npm run build
netlify deploy --prod --dir=dist
```

## 📱 Your Live URLs

After deployment, you'll get URLs like:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.railway.app`

## 🔄 Auto-Deploy

All platforms support auto-deploy when you push to GitHub main branch!

## 📞 Support

If you need help with deployment, check the platform documentation or contact support.

---

**Recommended:** Start with Vercel + Railway for the easiest setup!
