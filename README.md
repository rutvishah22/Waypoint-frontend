# Waypoint Frontend

Beautiful, modern frontend for Waypoint - the market intelligence platform for founders.

## 🎨 Design Features

- **Custom Color Palette**: Oceanic teal + Indigo + Nectarine accent
- **Responsive**: Mobile-first design that works on all devices
- **Smooth Animations**: Fade-ins, progress bars, and transitions
- **Tabbed Dashboard**: Clean navigation through analysis sections
- **Modern UI**: Built with Tailwind CSS for consistency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Your Waypoint backend running on `http://localhost:8000`

### Installation

```bash
# 1. Navigate to the frontend directory
cd waypoint-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## 📁 Project Structure

```
waypoint-frontend/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx      # Homepage with hero section
│   │   ├── AnalysisForm.jsx     # Product idea submission form
│   │   ├── ProcessingView.jsx   # Loading state with progress
│   │   └── Dashboard.jsx        # Tabbed results interface
│   ├── utils/
│   │   └── api.js               # API communication functions
│   ├── App.jsx                  # Main app with routing
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles + Tailwind
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## 🎯 User Flow

1. **Landing Page** (`/`)
   - Hero section with value proposition
   - Clear CTA to start analysis

2. **Analysis Form** (`/analyze`)
   - Select stage (pre-launch / post-launch)
   - Enter product idea
   - Provide email

3. **Processing View** (`/analyzing/:jobId`)
   - Real-time progress updates
   - Estimated time remaining
   - Auto-redirect when complete

4. **Dashboard** (`/results/:jobId`)
   - Tabbed interface with 10 sections:
     - Overview
     - Category Diagnosis
     - Market Reality
     - Competitive Landscape
     - User Needs
     - Strategy & Positioning
     - MVP Blueprint
     - Pricing & Monetization
     - Go-to-Market
     - Risks & Unknowns

## 🏗️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to:
# 1. Link to your Vercel account
# 2. Set project name
# 3. Configure environment variables (VITE_API_URL)
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod

# Set environment variable in Netlify dashboard:
# VITE_API_URL = your_backend_url
```

### Environment Variables for Production

In your deployment platform (Vercel/Netlify), set:

```
VITE_API_URL=https://your-backend-api.com
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to change the color palette:

```js
colors: {
  oceanic: { /* Your primary color */ },
  indigo: { /* Your secondary color */ },
  nectarine: { /* Your accent color */ },
  // ... etc
}
```

### Backend API URL

Update `.env` file:

```env
VITE_API_URL=http://your-backend-url:port
```

### Styling

All component styles use Tailwind utility classes. Global styles and custom classes are in `src/index.css`.

## 🔧 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

All components are fully responsive and tested on:
- iPhone SE (375px)
- iPad (768px)
- Desktop (1920px)

## 🐛 Troubleshooting

### API Connection Issues

**Problem**: Can't connect to backend

**Solution**: 
1. Make sure your backend is running
2. Check `.env` file has correct `VITE_API_URL`
3. Verify CORS is enabled in your FastAPI backend

Add to your FastAPI `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Build Errors

**Problem**: `npm install` fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Styling Issues

**Problem**: Tailwind styles not applying

**Solution**:
```bash
# Rebuild Tailwind
npm run dev
# Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
```

## 📄 License

This project is part of the Waypoint platform.

## 🤝 Support

For issues or questions:
1. Check this README
2. Review component code comments
3. Check browser console for errors

---

Built with ❤️ for founders who want to win.
