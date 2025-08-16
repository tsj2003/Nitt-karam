# 🚀 TaskFlow Deployment Guide

## 🎯 **Deploy Your AI-Powered Task Management App**

### **Option 1: Vercel (Recommended - Free & Easy)**

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name: `taskflow-ai`
   - Deploy to production

### **Option 2: Netlify (Free & Easy)**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Drag & Drop:**
   - Go to [netlify.com](https://netlify.com)
   - Drag your `dist` folder to deploy
   - Get instant live URL

### **Option 3: GitHub Pages**

1. **Add to package.json:**
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

2. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

### **Option 4: Firebase Hosting**

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login & Initialize:**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Build & Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

## 🔧 **Environment Variables (Optional)**

Create `.env` file for production:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_HUGGING_FACE_TOKEN=your_hugging_face_token
```

## 📱 **Custom Domain (Optional)**

- **Vercel:** Add custom domain in dashboard
- **Netlify:** Custom domain support included
- **Firebase:** Custom domain configuration

## 🎉 **Your App is Live!**

After deployment, you'll get a public URL like:
- `https://taskflow-ai.vercel.app`
- `https://your-app.netlify.app`
- `https://your-app.web.app`

## 🔐 **API Keys Security**

- API keys are stored in browser localStorage
- Users enter their own keys in the app
- No server-side storage of sensitive data

## 📊 **Performance Tips**

- **Vercel:** Automatic edge optimization
- **Netlify:** CDN and image optimization
- **Firebase:** Global CDN and caching

---

**Choose Vercel for the easiest deployment experience!** 🚀
