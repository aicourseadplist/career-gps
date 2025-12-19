# 🚀 Vercel Deployment Steps

## ✅ Step 1: Push to GitHub (Do this first!)

### 1.1 Create GitHub Repository
1. Go to [github.com](https://github.com) and sign in
2. Click **"+"** → **"New repository"**
3. Repository name: `career-gps` (or your choice)
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### 1.2 Push Your Code
Copy the commands GitHub shows you, or run these (replace YOUR_USERNAME):

```bash
cd /Users/macos/Documents/summary/career-gps
git remote add origin https://github.com/YOUR_USERNAME/career-gps.git
git branch -M main
git push -u origin main
```

---

## ✅ Step 2: Deploy Backend to Vercel

### 2.1 Create Backend Project
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository** → Select `career-gps`
4. Click **"Import"**

### 2.2 Configure Backend
1. **Project Name**: `career-gps-api` (or your choice)
2. **Root Directory**: Click **"Edit"** → Type: `server`
3. **Framework Preset**: Other
4. **Build Command**: Leave empty (or `npm install`)
5. **Output Directory**: Leave empty
6. **Install Command**: `npm install`

### 2.3 Add Environment Variables
Click **"Environment Variables"** and add:

- **Name**: `ANTHROPIC_API_KEY`
- **Value**: `your_anthropic_api_key_here`
- **Environment**: Production, Preview, Development (check all)
- Click **"Save"**

### 2.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. **Copy the deployment URL** (e.g., `https://career-gps-api.vercel.app`)
   - This is your backend URL!

---

## ✅ Step 3: Deploy Frontend to Vercel

### 3.1 Create Frontend Project
1. In Vercel, click **"Add New..."** → **"Project"** again
2. **Import Git Repository** → Select `career-gps` (same repo)
3. Click **"Import"**

### 3.2 Configure Frontend
1. **Project Name**: `career-gps` (or your choice)
2. **Root Directory**: `.` (leave as root)
3. **Framework Preset**: Vite (should auto-detect)
4. **Build Command**: `npm run build` (should auto-fill)
5. **Output Directory**: `dist` (should auto-fill)
6. **Install Command**: `npm install`

### 3.3 Add Environment Variables
Click **"Environment Variables"** and add:

- **Name**: `VITE_API_URL`
- **Value**: Your backend URL from Step 2.4 (e.g., `https://career-gps-api.vercel.app`)
- **Environment**: Production, Preview, Development (check all)
- Click **"Save"**

### 3.4 Deploy
1. Click **"Deploy"**
2. Wait for deployment (1-2 minutes)
3. **Your app is live!** 🎉

---

## ✅ Step 4: Test Your Live App

1. Visit your frontend URL (e.g., `https://career-gps.vercel.app`)
2. Go through the full flow:
   - Enter direction and background
   - See "You Are Here" assessment
   - Get mentor recommendation
   - Generate execution plan
   - Download PDF

---

## 🔧 Troubleshooting

### Backend not working?
- Check environment variable `ANTHROPIC_API_KEY` is set
- Check Vercel function logs (in Vercel dashboard)
- Make sure root directory is `server`

### Frontend can't connect to backend?
- Check `VITE_API_URL` environment variable matches backend URL
- Make sure backend URL ends with `/api` in the frontend env var
- Check browser console for CORS errors

### Need to update code?
1. Make changes locally
2. `git add .`
3. `git commit -m "Your message"`
4. `git push`
5. Vercel auto-deploys! ✨

---

## 🎉 You're Live!

Your Cago is now accessible to the world!

