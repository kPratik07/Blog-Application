# 🚀 Deployment Guide

Complete guide to deploy your Blog Application to production.

---

## 📋 Prerequisites

- GitHub account (to push your code)
- Render account (for backend): https://render.com
- Vercel account (for frontend): https://vercel.com

---

## 🔧 Part 1: Deploy Backend to Render

### **Step 1: Push Code to GitHub**

```bash
cd Blog-Application
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/blog-app.git
git push -u origin main
```

### **Step 2: Create Render Account**

1. Go to: https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### **Step 3: Create New Web Service**

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your `blog-app` repository

### **Step 4: Configure Service**

**Basic Settings:**
- **Name**: `blog-app-backend` (or any name)
- **Region**: Choose closest to you
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0$/month)

### **Step 5: Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

```
MONGODB_URL = mongodb+srv://kpratik071997_db_user:E41kly8DqrJWy6IJ@cluster0.hdx8xph.mongodb.net/BlogApp

JWT_SECRET = mysecretkey_change_this_in_production

PORT = 4000

USE_REAL_EMAIL = true

EMAIL_USER = kpratik071997@gmail.com

EMAIL_PASS = fenabhyhanpfxsjw

EMAIL_FROM = Blog App <kpratik071997@gmail.com>

FRONTEND_URL = https://your-app.vercel.app
```

**Note:** You'll update `FRONTEND_URL` after deploying frontend.

### **Step 6: Deploy**

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. Once deployed, copy your backend URL (e.g., `https://blog-app-backend.onrender.com`)

### **Step 7: Test Backend**

Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{"message": "Api is working"}
```

---

## 🎨 Part 2: Deploy Frontend to Vercel

### **Step 1: Install Vercel CLI (Optional)**

```bash
npm install -g vercel
```

Or use Vercel Dashboard (easier).

### **Step 2: Deploy via Vercel Dashboard**

1. Go to: https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New"** → **"Project"**
4. Import your GitHub repository
5. Select your `blog-app` repository

### **Step 3: Configure Project**

**Framework Preset:** Vite

**Root Directory:** `frontend`

**Build Settings:**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### **Step 4: Add Environment Variables**

Click **"Environment Variables"**

Add:
```
Name: VITE_API_BASE_URL
Value: https://your-backend-url.onrender.com
```

Replace with your actual Render backend URL.

### **Step 5: Deploy**

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Vercel will give you a URL (e.g., `https://blog-app-xyz.vercel.app`)

---

## 🔄 Part 3: Connect Frontend & Backend

### **Step 1: Update Backend CORS**

Go back to **Render Dashboard**:

1. Select your backend service
2. Go to **"Environment"**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL = https://your-app-xyz.vercel.app
   ```
4. Click **"Save Changes"**
5. Service will auto-redeploy

### **Step 2: Test Your App**

1. Visit your Vercel URL: `https://your-app-xyz.vercel.app`
2. Test signup, login, blogs, password reset
3. Everything should work! ✅

---

## 📝 Quick Checklist

### Backend (Render):
- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Environment variables added (7 variables)
- [ ] Service deployed successfully
- [ ] `/health` endpoint working

### Frontend (Vercel):
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_BASE_URL` environment variable added
- [ ] Project deployed successfully
- [ ] App loads in browser

### Connection:
- [ ] Backend `FRONTEND_URL` updated with Vercel URL
- [ ] Backend redeployed
- [ ] Tested signup/login
- [ ] Tested password reset
- [ ] Tested blog CRUD operations

---

## 🐛 Common Issues

### **Issue 1: CORS Error**

**Error:** "Access to fetch has been blocked by CORS policy"

**Fix:**
- Check `FRONTEND_URL` in Render environment variables
- Make sure it matches your Vercel URL exactly
- Redeploy backend after updating

### **Issue 2: API Calls Failing**

**Error:** "Failed to fetch" or "Network error"

**Fix:**
- Check `VITE_API_BASE_URL` in Vercel environment variables
- Make sure backend URL is correct
- Redeploy frontend after updating

### **Issue 3: Email Not Sending**

**Error:** Email service fails in production

**Fix:**
- Verify all email environment variables are set in Render
- Check Gmail App Password is correct
- No spaces in `EMAIL_PASS`

### **Issue 4: MongoDB Connection Failed**

**Error:** "Error connecting to MongoDB"

**Fix:**
- Check `MONGODB_URL` in Render
- Whitelist Render's IP in MongoDB Atlas (or allow all: 0.0.0.0/0)
- Go to MongoDB Atlas → Network Access → Add IP Address

---

## 🔒 Security Checklist

Before going live:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Whitelist only necessary IPs in MongoDB
- [ ] Use strong passwords
- [ ] Don't commit `.env` files to GitHub
- [ ] Enable HTTPS (Render & Vercel do this automatically)
- [ ] Test all features in production

---

## 💡 Tips

### **Free Tier Limits:**

**Render Free:**
- ✅ 750 hours/month
- ⚠️ Spins down after 15 min inactivity (first request takes 30s)
- ✅ Auto-deploy on git push

**Vercel Free:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Instant deploys
- ✅ Auto-deploy on git push

### **Keep Backend Alive:**

Render free tier sleeps after inactivity. To keep it alive:
- Use a service like **UptimeRobot** (free) to ping your backend every 5 minutes
- Or upgrade to paid plan ($7/month)

### **Custom Domain (Optional):**

**Vercel:**
- Settings → Domains → Add custom domain
- Update DNS records

**Render:**
- Settings → Custom Domain → Add domain
- Update DNS records

---

## 🎯 Deployment URLs

After deployment, you'll have:

- **Backend**: `https://blog-app-backend.onrender.com`
- **Frontend**: `https://blog-app-xyz.vercel.app`

Update these in your environment variables!

---

## 🔄 Auto-Deploy Setup

Both Render and Vercel support auto-deploy:

1. Push code to GitHub
2. Both services auto-detect changes
3. Auto-deploy new version
4. Takes 2-5 minutes

**Workflow:**
```bash
git add .
git commit -m "Update feature"
git push origin main
# Auto-deploys to Render & Vercel! 🚀
```

---

## 📞 Need Help?

If you get stuck:
1. Check the error logs in Render/Vercel dashboard
2. Verify all environment variables are set
3. Test backend `/health` endpoint first
4. Then test frontend

---

**Ready to deploy? Follow the steps above!** 🚀
