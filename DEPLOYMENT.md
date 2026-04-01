# Backend Deployment Guide

## Quick Deploy to Render (Recommended)

### Step 1: Create GitHub Repository (2 minutes)
1. Go to https://github.com/new
2. Create repo name: `israel-campaigns-dashboard`
3. Click "Create repository"
4. In your terminal:
```bash
cd C:\Users\Local PC\israel-campaigns-dashboard
git remote add origin https://github.com/YOUR_USERNAME/israel-campaigns-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Render (1 click)
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub account & select your repo
4. Render will auto-detect `render.yaml` config
5. Click "Deploy"
6. In settings, add environment variable:
   - `ANTHROPIC_API_KEY` = (your API key)
7. Wait ~2 minutes for deployment
8. Copy your API URL: `https://your-app.onrender.com`

### Step 3: Connect Frontend to Backend
1. Go to Vercel dashboard: https://vercel.com/yarivtenta-4933s-projects/israel-campaigns-dashboard
2. Settings → Environment Variables
3. Add: `REACT_APP_API_URL` = `https://your-app.onrender.com`
4. Redeploy (push any commit or click "Deploy")

---

## Alternative: Deploy to Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select repo & api folder
4. Add `ANTHROPIC_API_KEY` environment variable
5. Deploy
6. Copy URL and follow Step 3 above

---

## Local Testing

```bash
# Terminal 1 - Backend
cd api
npm install
npm start

# Terminal 2 - Frontend
cd dashboard
npm start
# Visits http://localhost:3002
```

---

## Troubleshooting

**"Cannot find module"** → Run `npm ci` in api folder
**"Port already in use"** → Change PORT env var or kill process
**"API calls failing"** → Check REACT_APP_API_URL is set in Vercel
