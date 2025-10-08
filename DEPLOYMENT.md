# Deployment Guide

## Frontend (GitHub Pages)

Your frontend is configured to deploy to GitHub Pages at:
**https://karthikganesh256.github.io/Echo-style-Web/**

### Automatic Deployment

Every time you push to the `main` branch, you can deploy by running:

```bash
cd client
npm install
npm run deploy
```

This will:
1. Build the React app
2. Push the build to the `gh-pages` branch
3. GitHub Pages will automatically serve from that branch

### Manual Setup (if needed)

1. Go to your repository: https://github.com/KARTHIKganesh256/Echo-style-Web
2. Click **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Under "Branch", select **gh-pages** and **/ (root)**
5. Click **Save**

## Backend Deployment

Your backend needs to be deployed separately. Here are recommended options:

### Option 1: Render (Recommended - Free tier available)

1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: `production`
6. Deploy!

### Option 2: Railway

1. Go to [railway.app](https://railway.app)
2. Create a new project from GitHub repo
3. Set root directory to `server`
4. Add environment variables (same as above)
5. Deploy!

### Option 3: Heroku

```bash
cd server
heroku create your-app-name
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set NODE_ENV=production
git subtree push --prefix server heroku master
```

## After Backend Deployment

Once your backend is deployed, update the frontend API URL:

1. Edit `client/.env.production`:
```env
VITE_API_URL=https://your-backend-url.com/api
```

2. Rebuild and redeploy the frontend:
```bash
cd client
npm run deploy
```

## MongoDB Setup

Make sure you have MongoDB Atlas set up:

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist all IP addresses (0.0.0.0/0) for production
5. Get your connection string
6. Add it to your backend deployment environment variables

## Testing Your Deployment

1. Frontend: Visit https://karthikganesh256.github.io/Echo-style-Web/
2. Backend: Test your API endpoints using Postman or curl
3. Make sure CORS is properly configured in your backend for the frontend URL

---

**Note**: Since this is a full-stack app, both frontend and backend need to be running for full functionality.
