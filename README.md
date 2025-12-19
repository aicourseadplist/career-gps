# Cago 🧭

A calm, AI-powered career clarity tool. Designed for people who have already picked a direction but feel unsure, underprepared, or unclear what that really means.

## Philosophy

- Clarity comes before recommendation
- Reflection comes before action
- Progress should feel calm, not overwhelming

## Features

- **You Are Here**: AI-generated assessment of your current position (no judgment, just observation)
- **Mentor Match**: Personalized mentor recommendation with specific session prep
- **Execution Plan**: Detailed 90-day roadmap with interactive checkboxes and progress tracking
- **PDF Export**: Beautiful, downloadable journey document

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Express.js
- **AI**: Anthropic Claude (claude-sonnet-4-20250514)
- **PDF**: @react-pdf/renderer

## Quick Start (Local)

### 1. Install dependencies

```bash
# Frontend
npm install

# Backend
cd server && npm install
```

### 2. Configure API key

Create `server/.env`:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Get your key at [console.anthropic.com](https://console.anthropic.com/)

### 3. Run locally

```bash
# Terminal 1: Backend (port 3001)
cd server && npm run dev

# Terminal 2: Frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Deploy to Production 🚀

### Option 1: Vercel (Recommended)

#### Deploy Frontend
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repository
4. Root Directory: `career-gps` (or leave as root)
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://career-gps-api.vercel.app`)
8. Deploy!

#### Deploy Backend
1. In Vercel, create another project
2. Root Directory: `career-gps/server`
3. Add Environment Variable:
   - `ANTHROPIC_API_KEY` = your API key
4. Deploy!

### Option 2: Netlify + Railway

#### Frontend (Netlify)
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add env var: `VITE_API_URL` = backend URL

#### Backend (Railway)
1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Select `server/` folder
4. Add env var: `ANTHROPIC_API_KEY`
5. Deploy!

### Option 3: Full Stack on Railway

1. Go to [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Add two services:
   - **Frontend**: Root directory, build `npm run build`, serve `dist/`
   - **Backend**: `server/` directory, start `npm start`
4. Add env vars:
   - Backend: `ANTHROPIC_API_KEY`
   - Frontend: `VITE_API_URL` = backend service URL

## Environment Variables

### Frontend
```
VITE_API_URL=https://your-backend-url.com
```

### Backend
```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

## Project Structure

```
career-gps/
├── src/
│   ├── components/      # Reusable components
│   ├── steps/           # Main flow steps
│   ├── api/             # API client
│   └── App.jsx          # Main app
├── server/              # Express backend
│   ├── index.js         # API routes + Claude integration
│   └── package.json
├── dist/                # Production build (generated)
└── package.json
```

## Design Principles

- Clean, minimal, airy layout
- Soft neutral colors (off-white, warm gray, muted terracotta)
- Editorial typography (Cormorant Garamond + DM Sans)
- No loud gradients or aggressive CTAs
- Short sentences, no exclamation marks, no buzzwords

This should feel like a thoughtful notebook, not a bootcamp landing page.

## Core Flow

1. User selects a direction
2. System shows "You Are Here" (current state clarity)
3. User confirms or adjusts
4. System recommends a mentor with personalized prep
5. System generates a detailed execution plan

## License

MIT

---

**Built with care for clarity over hype.** ✨
