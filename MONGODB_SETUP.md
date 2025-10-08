# 🗄️ MongoDB Setup - Quick Guide

## ✅ Current Status
- ✅ Frontend: Running on http://localhost:3000
- ✅ Backend: Running on http://localhost:5000
- ⚠️ Database: Not connected (optional for frontend testing)

## 🚀 Option 1: MongoDB Atlas (Recommended - Free & Fast)

### Setup in 5 Minutes:

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google or email (free)

2. **Create Free Cluster**
   - Choose **M0 FREE** tier
   - Select a cloud provider (AWS recommended)
   - Choose region closest to you
   - Click "Create"
   - Wait 3-5 minutes for cluster creation

3. **Configure Access**
   - Click "Database Access" → "Add New Database User"
   - Username: `echouser`
   - Password: Create a strong password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Allow Network Access**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get Connection String**
   - Go back to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://echouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update .env File**
   - Open `server/.env`
   - Replace `<password>` in the connection string with your actual password
   - Update line 2:
   ```
   MONGODB_URI=mongodb+srv://echouser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/echo-style-assistant?retryWrites=true&w=majority
   ```

7. **Restart Backend**
   - The server should automatically restart (nodemon)
   - You should see: `✅ MongoDB Connected: cluster0-xxxxx.mongodb.net`

## 🖥️ Option 2: Local MongoDB (Windows)

### Quick Install:

1. **Download**
   - Go to: https://www.mongodb.com/try/download/community
   - Choose Windows
   - Version: 7.0 or latest
   - Package: MSI

2. **Install**
   - Run the installer
   - Choose "Complete" installation
   - Check "Install MongoDB as a Service"
   - Click "Install"

3. **Verify**
   - Open Command Prompt
   - Run: `mongod --version`
   - If installed, restart the backend server

4. **Start MongoDB Service**
   ```
   net start MongoDB
   ```

## 🧪 Test Database Connection

After setting up, test the connection:

```bash
cd server
npm run dev
```

Look for:
- ✅ `MongoDB Connected: ...` = Success!
- ❌ `MongoDB Connection Error` = Check your connection string

## 📊 Seed Sample Products (Optional)

Once MongoDB is connected:

```bash
cd server
node data/seedDatabase.js
```

This adds 20+ sample products to the database.

## ⚡ Quick Start Without Database

The frontend works without database! You can:
- ✅ View the beautiful landing page
- ✅ See animations and effects
- ✅ Test the UI/UX
- ❌ Can't login/signup (needs database)
- ❌ Can't save products (needs database)

## 🆘 Troubleshooting

### "Could not connect to MongoDB"
- Check internet connection (for Atlas)
- Verify connection string format
- Check username/password
- Ensure IP is whitelisted in Atlas

### "ECONNREFUSED localhost:27017"
- MongoDB service not running locally
- Start service: `net start MongoDB` (Windows)

### "Authentication failed"
- Check password in connection string
- Verify database user in Atlas

## 📞 Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Community: https://community.mongodb.com/

---

**Recommendation:** Use MongoDB Atlas for quickest setup (5 minutes) ⚡
