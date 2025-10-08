# 🚀 Quick Setup Guide - Echo Style Assistant Web

Follow these steps to get the application running on your machine.

## Step 1: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Step 2: Configure Environment Variables

### Backend Environment (`server/.env`)
Create a `.env` file in the `server` directory with:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/echo-style-assistant
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Important:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your connection string
- Change `JWT_SECRET` to a secure random string for production

### Frontend Environment (`client/.env`) - Optional
Create a `.env` file in the `client` directory with:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Start MongoDB

Make sure MongoDB is running on your machine:

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

**Or use MongoDB Atlas (Cloud):**
- Sign up at https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get your connection string
- Update `MONGODB_URI` in `server/.env`

## Step 4: Seed the Database (Optional but Recommended)

This adds sample products to the database:

```bash
cd server
node data/seedDatabase.js
```

You should see:
```
Products cleared
Products seeded
Database seeded successfully!
```

## Step 5: Start the Application

### Terminal 1 - Start Backend
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### Terminal 2 - Start Frontend
```bash
cd client
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜  Local:   http://localhost:3000/
```

## Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎉 You're All Set!

### First Steps:
1. Click "Get Started" or "Sign Up"
2. Create an account with your email
3. Go to "Analyze" to discover your season
4. Answer the two-step questionnaire
5. Explore products matched to your palette!

## 🐛 Troubleshooting

### MongoDB Connection Issues
- **Error:** `MongooseServerSelectionError`
- **Solution:** Make sure MongoDB is running. Check the connection string in `.env`

### Port Already in Use
- **Error:** `Port 5000 is already in use`
- **Solution:** Either stop the process using port 5000, or change `PORT` in `server/.env`

### Module Not Found
- **Error:** `Cannot find module...`
- **Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again

### CORS Issues
- **Error:** `Access to fetch blocked by CORS policy`
- **Solution:** Make sure both frontend and backend are running. Check `VITE_API_URL` in client `.env`

### Vite Build Issues
- **Error:** Build fails or white screen
- **Solution:** Clear cache: `rm -rf client/node_modules/.vite` and restart dev server

## 📝 Default Test Accounts

After seeding, you can create your own accounts. No default accounts are provided for security.

## 🔄 Resetting the Database

To clear all data and start fresh:

```bash
# In MongoDB shell
use echo-style-assistant
db.dropDatabase()

# Then re-seed
cd server
node data/seedDatabase.js
```

## 🌐 Production Deployment

See `README.md` for detailed deployment instructions to:
- Vercel/Netlify (Frontend)
- Heroku/Railway/Render (Backend)
- MongoDB Atlas (Database)

## 💡 Tips

- Use **Chrome DevTools** to see the custom cursor effect
- Try the **parallax scroll** on the landing page
- Test **responsive design** by resizing your browser
- Enable **React DevTools** for debugging

---

Need help? Check the main `README.md` or open an issue!
