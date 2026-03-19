# Vercel Deployment Guide

## 🚀 Deploy PakBizBranches to Vercel

### Prerequisites
- Vercel account (free)
- GitHub repository
- Firebase project configured
- Environment variables ready

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `branches` repository

### Step 2: Configure Build Settings
Vercel will automatically detect Next.js and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`
- **Framework**: Next.js

### Step 3: Environment Variables
Add these environment variables in Vercel dashboard:

#### Firebase Configuration (Public)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Firebase Admin Configuration (Private)
```
FIREBASE_ADMIN_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
Your_Private_Key_Here
-----END PRIVATE KEY-----
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=your_project_id
```

#### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SITE_NAME=PakBizBranches
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `https://your-domain.vercel.app`

### Step 5: Custom Domain (Optional)
1. Go to Vercel dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

### Step 6: Post-Deployment Checklist
- [ ] Test all pages are loading
- [ ] Check Firebase connectivity
- [ ] Test business submission form
- [ ] Verify admin panel works
- [ ] Check sitemap.xml accessibility
- [ ] Test search functionality
- [ ] Verify mobile responsiveness

### 🌐 Important URLs After Deployment
- **Website**: `https://your-domain.vercel.app`
- **Admin Panel**: `https://your-domain.vercel.app/admin`
- **Sitemap**: `https://your-domain.vercel.app/sitemap.xml`
- **Robots**: `https://your-domain.vercel.app/robots.txt`

### 🔧 Environment Setup Tips

#### Getting Firebase Credentials
1. Go to Firebase Console → Project Settings
2. General tab → Your apps → Web app → Firebase SDK snippet → Config
3. Service Accounts tab → Generate new private key

#### Environment Variable Format
- Private keys should be on one line with `\n` for newlines
- All NEXT_PUBLIC_ variables are accessible in browser
- Admin variables are server-side only

### 🚨 Troubleshooting

#### Build Errors
- Check all environment variables are set
- Verify Firebase configuration
- Ensure package.json has correct scripts

#### Runtime Errors
- Check Firebase connectivity
- Verify environment variables in production
- Check browser console for errors

#### Performance Issues
- Enable Vercel Analytics
- Check Core Web Vitals
- Optimize images and assets

### 📊 Monitoring
- Vercel Analytics for performance
- Firebase Console for database usage
- Google Search Console for SEO
- Vercel Logs for debugging

### 🔄 Automatic Deployments
- Push to `main` branch → Auto-deploy to production
- Push to other branches → Preview deployments
- Environment variables sync automatically

### 💡 Pro Tips
1. Use preview branches for testing
2. Set up custom domain for branding
3. Enable Vercel Analytics for insights
4. Monitor build times and optimize
5. Use environment-specific configurations

### 🎯 Production Optimizations
- Image optimization enabled
- Static generation where possible
- Caching headers configured
- CDN distribution via Vercel
- Automatic HTTPS certificates

Your PakBizBranches website is now ready for production on Vercel! 🚀
