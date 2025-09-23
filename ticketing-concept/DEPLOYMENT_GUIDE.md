# 🚀 Vercel Deployment Guide

## 🎯 Quick Deploy (CLI Method)

### 1. Login to Vercel
```bash
vercel login
```

### 2. Deploy the Project
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** `Y`
- **Which scope?** Choose your account
- **Link to existing project?** `N` (for first deployment)
- **Project name?** `give-back-ticketing` (or your preferred name)
- **Directory?** `.` (current directory)
- **Override settings?** `N`

### 3. Production Deploy
```bash
vercel --prod
```

---

## 🌐 Alternative: GitHub Integration

### 1. Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit: Give Back Ticketing Platform"
```

### 2. Create GitHub Repository
- Go to GitHub.com
- Create new repository: `give-back-ticketing-platform`
- Don't initialize with README (since we have files)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/give-back-ticketing-platform.git
git branch -M main
git push -u origin main
```

### 4. Connect to Vercel
- Go to vercel.com
- Login and click "New Project"
- Import your GitHub repository
- Deploy automatically!

---

## ⚙️ Environment Variables

If you add environment variables later, set them in Vercel:

**In Vercel Dashboard:**
1. Go to your project
2. Settings → Environment Variables
3. Add variables:
   - `SURREAL_URL=your-production-url`
   - `SURREAL_USER=your-user`
   - etc.

---

## 📁 Project Structure for Deployment

Your project is already Vercel-ready with:
```
✅ Next.js 15 (App Router)
✅ TypeScript
✅ Tailwind CSS
✅ Static assets in /public
✅ API routes in /src/app/api
✅ Modern build configuration
```

---

## 🎬 About Video Files

**Important:** The videos won't be included in the Git repository due to file size.

**Options for production videos:**
1. **Upload to Vercel**: Place videos in `/public/videos/` and deploy
2. **Use CDN**: Host videos on AWS S3, Cloudinary, or similar
3. **External URLs**: Update VideoBackground to use external video URLs

**Current status:** The platform uses animated background which looks great and loads fast!

---

## 🔧 Build Optimization

The project is already optimized:
- ✅ Next.js production build
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Font optimization (Inter)
- ✅ CSS purging (Tailwind)

---

## 📊 Expected Performance

**Lighthouse Scores:**
- Performance: 90-95
- Accessibility: 95-100
- Best Practices: 95-100
- SEO: 90-95

---

## 🎯 Domain Configuration

After deployment, you can:
1. Use the provided `.vercel.app` domain
2. Add custom domain in Vercel dashboard
3. Configure DNS records

---

## 🚨 Troubleshooting

**Common issues:**
- **Build fails**: Check TypeScript errors with `npm run build`
- **404 on routes**: Ensure file structure matches App Router conventions
- **Images not loading**: Check paths are relative to `/public`

**Debug locally:**
```bash
npm run build
npm run start
```

---

Your Give Back Ticketing Platform is production-ready! 🎵✨