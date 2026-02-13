# Workflow Guide: Updating Your Website

## Quick Update Process

When you make changes to your website, follow these steps to update both GitHub and your deployment:

### Step 1: Make Your Changes
Edit your files (e.g., `src/App.jsx`, `src/App.css`, etc.)

### Step 2: Stage Your Changes
```bash
git add .
```
Or stage specific files:
```bash
git add src/App.jsx src/App.css
```

### Step 3: Commit Your Changes
```bash
git commit -m "Description of your changes"
```
Examples:
- `git commit -m "Update birthday message"`
- `git commit -m "Change color scheme"`
- `git commit -m "Add new animation"`

### Step 4: Push to GitHub
```bash
git push
```

### Step 5: Deployment (Automatic if connected to Vercel)
If you've connected your GitHub repo to Vercel, **deployment happens automatically** when you push to the `main` branch!

## Complete Workflow Example

```bash
# 1. Make your changes in your code editor

# 2. Check what changed
git status

# 3. Stage all changes
git add .

# 4. Commit with a descriptive message
git commit -m "Update birthday title and add new animations"

# 5. Push to GitHub
git push

# 6. Vercel automatically deploys (if connected)
# Check your Vercel dashboard for deployment status
```

## Setting Up Automatic Deployments on Vercel

### Option 1: Connect GitHub Repository (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select `rendell-padu02/Birthday-website`
5. Click **"Import"**
6. Vercel will auto-detect settings (Vite framework)
7. Click **"Deploy"**

**Result:** Every time you `git push`, Vercel will automatically deploy your changes!

### Option 2: Manual Deployment (if not connected)

If you haven't connected GitHub to Vercel, you can deploy manually:

```bash
# Make sure you're in your project directory
cd c:\Users\rende\Desktop\Website

# Deploy to Vercel
vercel --prod
```

## Checking Deployment Status

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub:** Check your commits at https://github.com/rendell-padu02/Birthday-website

## Tips

- ✅ **Always commit with descriptive messages** - helps track changes
- ✅ **Test locally first** - run `npm run dev` before pushing
- ✅ **Check Vercel logs** - if deployment fails, check the build logs
- ✅ **Use branches** - for major changes, consider using feature branches

## Common Commands Reference

```bash
# View changes
git status

# See what files changed
git diff

# Stage all changes
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes (if working on multiple machines)
git pull

# View commit history
git log --oneline
```
