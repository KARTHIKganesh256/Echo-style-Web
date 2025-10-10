# 🚨 Railway Environment Variables Setup Guide

## ⚠️ **Issue: Backend 502 Error**

Your Railway backend is returning a **502 error** which means the application is failing to start. This is most likely due to **missing or incorrect environment variables**.

---

## 🔧 **Required Environment Variables**

### **Step 1: Go to Railway Dashboard**

1. Visit [railway.app](https://railway.app)
2. Go to your project: **Echo-style-Web**
3. Click on your service (should show "Echo-style-Web")
4. Click the **"Variables"** tab

### **Step 2: Add ALL These Environment Variables**

**Add each variable one by one:**

#### **1. NODE_ENV**
- **Key**: `NODE_ENV`
- **Value**: `production`

#### **2. PORT**
- **Key**: `PORT`  
- **Value**: `5000`

#### **3. MONGODB_URI** (⚠️ Important: Use this exact name!)
- **Key**: `MONGODB_URI`
- **Value**: Your MongoDB Atlas connection string
- **Example**: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/echo-style-web?retryWrites=true&w=majority`

**📝 How to get MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in to your account
3. Click **"Connect"** on your cluster
4. Select **"Drivers"**
5. Select **"Node.js"** as driver
6. Copy the connection string
7. Replace `<password>` with your actual database password
8. Replace `<dbname>` with `echo-style-web`

#### **4. JWT_SECRET**
- **Key**: `JWT_SECRET`
- **Value**: Create a random secret key (at least 32 characters)
- **Example**: `echo-style-web-super-secret-jwt-key-12345-production-2024`

**💡 Generate a strong JWT_SECRET:**
- Use random characters, numbers, and special characters
- Minimum 32 characters long
- Keep it secret, never share it publicly

#### **5. CORS_ORIGIN** (Optional but recommended)
- **Key**: `CORS_ORIGIN`
- **Value**: Your Vercel frontend URL
- **Example**: `https://echo-style-web.vercel.app`

---

## ✅ **Complete Environment Variables List**

After adding all variables, your Railway Variables section should have:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/echo-style-web?retryWrites=true&w=majority
JWT_SECRET=echo-style-web-super-secret-jwt-key-12345-production-2024
CORS_ORIGIN=https://echo-style-web.vercel.app
```

---

## 🔄 **Step 3: Redeploy**

After adding all environment variables:

1. **Go back to the "Deployments" tab** in Railway
2. **Click the three dots (⋮)** on the latest deployment
3. **Click "Redeploy"** or wait for automatic redeployment

**OR**

Simply push a new commit to GitHub to trigger a redeploy:
```bash
git commit --allow-empty -m "Trigger Railway redeploy with correct env vars"
git push origin main
```

---

## 🧪 **Step 4: Test the Backend**

After redeployment (wait 2-3 minutes), test your backend:

### **Test 1: Check if Backend is Running**
Open in browser:
```
https://echo-style-web-production.up.railway.app/
```

**Expected Response:**
```json
{
  "message": "Echo Style Assistant API is running"
}
```

### **Test 2: Check Railway Logs**

1. Go to Railway Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. **Look for these success messages:**
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   🚀 =====================================
   ✅ Echo Style Assistant Server Running
   📡 Port: 5000
   ```

**If you see errors:**
- Look for MongoDB connection errors → Check `MONGODB_URI`
- Look for port binding errors → Check `PORT` variable
- Look for any other errors and share them

---

## 🚨 **Common Errors & Solutions**

### **Error: "MONGODB_URI not found"**
**Solution**: Add `MONGODB_URI` environment variable (not `MONGO_URI`)

### **Error: "Connection refused" or "ECONNREFUSED"**
**Solution**: 
1. Check MongoDB Atlas network access
2. Allow connections from `0.0.0.0/0` (all IPs)
3. Go to MongoDB Atlas → Network Access → Add IP Address → Allow Access from Anywhere

### **Error: "Authentication failed"**
**Solution**: 
1. Check your MongoDB username and password
2. Make sure password doesn't have special characters that need URL encoding
3. If password has special characters, encode them:
   - `@` → `%40`
   - `#` → `%23`
   - `$` → `%24`

### **Error: "Module not found"**
**Solution**: Railway needs to install dependencies properly
- Check that `package.json` exists in `/server` directory
- Redeploy after adding environment variables

---

## 📋 **After Backend is Working**

Once your backend shows the success message, update your frontend:

### **Update Vercel Environment Variable**

1. Go to [vercel.com](https://vercel.com)
2. Go to your project
3. Go to **Settings** → **Environment Variables**
4. Make sure `VITE_API_URL` is set to:
   ```
   https://echo-style-web-production.up.railway.app/api
   ```
5. **Redeploy** the frontend

---

## 🎯 **Quick Checklist**

Before testing, make sure:

- [ ] Railway has `NODE_ENV=production`
- [ ] Railway has `PORT=5000`
- [ ] Railway has `MONGODB_URI` (with correct MongoDB connection string)
- [ ] Railway has `JWT_SECRET` (random secret key)
- [ ] MongoDB Atlas allows connections from anywhere (`0.0.0.0/0`)
- [ ] Railway service is redeployed after adding variables
- [ ] Backend URL returns success message
- [ ] Vercel has `VITE_API_URL` pointing to Railway backend
- [ ] Vercel is redeployed after updating environment variable

---

## 🆘 **Still Not Working?**

If your backend still shows 502 error after completing all steps:

1. **Check Railway Logs** for specific error messages
2. **Verify MongoDB Connection String** is correct
3. **Test MongoDB Connection** separately
4. **Share the error logs** so I can help debug

Once the backend is working, we can proceed to test all the features of your live application!

