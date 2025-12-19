# Deploy Career GPS

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

#### Frontend (Vite/React)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variable: `VITE_API_URL` = your backend URL
5. Deploy!

#### Backend (Express)
1. Go to [vercel.com](https://vercel.com)
2. Create new project from `server/` folder
3. Add environment variable: `ANTHROPIC_API_KEY` = your API key
4. Deploy!

### Option 2: Netlify

#### Frontend
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. New site from Git → Select repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Add env var: `VITE_API_URL`

#### Backend
- Use Railway, Render, or Fly.io for Node.js backend

### Option 3: Railway (Full Stack)

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add two services:
   - Frontend: Root directory, build command `npm run build`
   - Backend: `server/` directory, start command `npm start`
4. Add env vars to backend: `ANTHROPIC_API_KEY`
5. Add env var to frontend: `VITE_API_URL` = backend URL

## Environment Variables

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

## Build Commands

```bash
# Frontend
cd career-gps
npm run build

# Backend
cd career-gps/server
npm start
```

## Quick Deploy Script

Run this to build everything:

```bash
cd career-gps
npm run build
cd server
npm install --production
```

Then upload `dist/` and `server/` to your hosting.

