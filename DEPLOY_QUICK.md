# 🚀 Quick Deploy Guide

## Fastest Way: Vercel (5 minutes)

### Step 1: Push to GitHub
```bash
cd /Users/macos/Documents/summary/career-gps
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Deploy Backend
1. Go to [vercel.com](https://vercel.com) → Sign in
2. **New Project** → Import from GitHub
3. Select your repo
4. **Root Directory**: `server`
5. **Environment Variables**:
   - `ANTHROPIC_API_KEY` = `sk-ant-...`
6. **Deploy**
7. Copy the deployment URL (e.g., `https://career-gps-api.vercel.app`)

### Step 3: Deploy Frontend
1. In Vercel, **New Project** again
2. Import same repo
3. **Root Directory**: `.` (root)
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment Variables**:
   - `VITE_API_URL` = your backend URL from Step 2
7. **Deploy**

### Done! 🎉
Your app is live at the frontend URL!

---

## Alternative: Railway (Full Stack)

1. Go to [railway.app](https://railway.app)
2. **New Project** → Deploy from GitHub
3. Add **two services**:

   **Service 1: Backend**
   - Root: `server`
   - Start: `npm start`
   - Env: `ANTHROPIC_API_KEY`

   **Service 2: Frontend**
   - Root: `.`
   - Build: `npm run build`
   - Serve: `dist`
   - Env: `VITE_API_URL` = backend service URL

4. Deploy both!

---

## Test Locally First

```bash
# Build
npm run build

# Preview production build
npm run preview
```

Visit http://localhost:4173 to test the production build locally.

