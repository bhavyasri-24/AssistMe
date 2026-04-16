# Basic Full Stack Application

## Deployment Guide

### Repository Structure
**Recommended: Monorepo (current setup)**
- Keep both frontend and backend in one repository
- Easier to manage and deploy
- Vercel and Render can deploy from subdirectories

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=10000
MONGO_URI=your-mongodb-connection-string
ACCESS_SECRET_KEY=your-jwt-secret
REFRESH_SECRET_KEY=your-refresh-secret
FRONTEND_URL=https://your-vercel-app.vercel.app
```

#### Frontend (.env)
```env
VITE_BACKEND_URL=https://your-backend.onrender.com
```

### Deployment Steps

#### 1. Deploy Backend on Render
1. Connect your GitHub repository to Render
2. Set root directory: `backend`
3. Add environment variables
4. Deploy - will get URL like: `https://your-app.onrender.com`

#### 2. Deploy Frontend on Vercel
1. Connect your GitHub repository to Vercel
2. Set root directory: `frontend`
3. Add environment variable: `VITE_BACKEND_URL`
4. Deploy - will get URL like: `https://your-app.vercel.app`

#### 3. Update CORS Origins
After deployment, add your Vercel URL to:
- Backend CORS origins in `server.js`
- Render environment variable `FRONTEND_URL`

### NODE_ENV = Production
- **Development**: `NODE_ENV=development` (default)
- **Production**: `NODE_ENV=production`
- **Effects**:
  - Cookies become `secure: true` (HTTPS only)
  - Error messages become less verbose
  - Performance optimizations enabled

### Alternative Free Hosting Options
- **Backend**: Railway, Fly.io, Heroku (limited free tier)
- **Frontend**: Netlify, GitHub Pages (no server-side)
- **Database**: MongoDB Atlas (free tier), Supabase

### WebSocket Support
- ✅ Render supports WebSockets on free tier
- ✅ Vercel supports WebSocket connections
- Make sure URLs use `https://` and `wss://` in production
