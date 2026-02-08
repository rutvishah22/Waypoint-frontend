# Waypoint Frontend - Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd waypoint-frontend
npm install
```

This will install:
- React 18
- React Router (for navigation)
- Tailwind CSS (for styling)
- Vite (build tool)

### Step 2: Configure Backend URL

The `.env` file is already created with:
```
VITE_API_URL=http://localhost:8000
```

**If your backend runs on a different port**, edit `.env`:
```
VITE_API_URL=http://localhost:YOUR_PORT
```

### Step 3: Enable CORS in Backend

Add this to your FastAPI `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add after: app = FastAPI(...)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser!

## 🎉 You're Done!

The app should now be running. Try:

1. Go to homepage
2. Click "Start Your Analysis"
3. Fill in the form
4. Submit and watch the progress

## 📋 Pre-Flight Checklist

Before deploying to production:

- [ ] Backend is running and accessible
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] Test the full flow (submit → process → results)
- [ ] Test on mobile device
- [ ] Test in different browsers

## 🚀 Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Build the project
npm run build

# 3. Deploy
vercel

# 4. Set environment variable in Vercel dashboard:
#    VITE_API_URL = your_production_backend_url
```

## 💡 Tips

- Use Chrome DevTools to debug API calls
- Check Network tab for failed requests
- Console will show any JavaScript errors
- Use React DevTools extension for component debugging

## 🆘 Common Issues

**Issue**: Blank screen after npm run dev
**Fix**: Check console for errors, verify all files were created

**Issue**: Can't submit form
**Fix**: Verify backend is running and CORS is enabled

**Issue**: Processing page stuck
**Fix**: Check backend logs, verify analysis is running

**Issue**: Results not displaying
**Fix**: Check job_id in URL matches backend records

---

Need help? Check the full README.md for detailed documentation.
