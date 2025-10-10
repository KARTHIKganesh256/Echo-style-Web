# Railway Deployment Fix Guide

## 🚨 **Problem**: Railway showing Redis instead of your repository

## 🔧 **Solutions**

### **Solution 1: Railway Web Interface (Recommended)**

1. **Go to [railway.app](https://railway.app)**
2. **Sign in with your GitHub account**
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **If your repo `Echo-style-Web` doesn't show:**
   - Click "Configure GitHub App" 
   - Make sure Railway has access to ALL repositories
   - Refresh the page
   - Your repo should appear

### **Solution 2: Direct Repository URL**

1. **Go to your GitHub repository**: `https://github.com/KARTHIKganesh256/Echo-style-Web`
2. **Copy the repository URL**
3. **In Railway, click "Deploy from GitHub repo"**
4. **Paste the repository URL directly**
5. **Select the repository when it appears**

### **Solution 3: Use Heroku (Alternative)**

1. **Go to [heroku.com](https://heroku.com)**
2. **Create a new app**
3. **Connect your GitHub repository**
4. **Deploy the `server` folder**
5. **Set environment variables**

### **Solution 4: Use Render (Alternative)**

1. **Go to [render.com](https://render.com)**
2. **Create a new Web Service**
3. **Connect your GitHub repository**
4. **Select the `server` folder as root directory**
5. **Set build command**: `npm install`
6. **Set start command**: `npm start`

## 🔑 **Environment Variables to Set**

Once deployed, add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

## 📝 **Deployment Checklist**

- [ ] Repository is public or Railway has access
- [ ] `server/package.json` has correct start script
- [ ] `server/server.js` is the main file
- [ ] Environment variables are configured
- [ ] MongoDB Atlas connection string is set
- [ ] CORS is configured for your frontend domain

## 🌐 **Frontend Deployment (Vercel)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repository**
3. **Select the `client` folder as root**
4. **Deploy automatically**

## 🔗 **After Deployment**

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update frontend environment variables**:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
3. **Redeploy frontend**
4. **Test the live application**

## 🆘 **Still Having Issues?**

If Railway still doesn't show your repository:
1. **Check if repository is private** - make it public temporarily
2. **Revoke and re-grant Railway access** to GitHub
3. **Try using a different browser**
4. **Clear browser cache and cookies**
