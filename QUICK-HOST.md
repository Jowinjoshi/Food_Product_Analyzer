# 🚀 Quick Hosting Guide for Food Scanner App

## Fastest Way to Host (Free Options)

### Step 1: Prepare Your Code
```bash
# Run the deployment check
./deploy-check.bat  # Windows
# or
./deploy-check.sh   # Mac/Linux
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy Frontend (Vercel - FREE)
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Set environment variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.herokuapp.com` (you'll get this in step 4)
6. Deploy!

### Step 4: Deploy Backend (Heroku - FREE)
1. Go to [heroku.com](https://heroku.com)
2. Sign up and install Heroku CLI
3. In your terminal:
```bash
cd backend
heroku create your-food-scanner-api
git add .
git commit -m "Deploy backend"
git push heroku main
```
4. Copy the URL Heroku gives you
5. Go back to Vercel and update the `NEXT_PUBLIC_API_URL` with this URL

### Step 5: Update CORS (Important!)
In your backend `app.py`, update line with your Vercel URL:
```python
CORS(app, origins=[
    "https://your-app-name.vercel.app",  # Your Vercel URL here
])
```

### Step 6: Test Your Live App! 🎉
Your app should now be live at:
- Frontend: `https://your-app-name.vercel.app`
- Backend: `https://your-food-scanner-api.herokuapp.com`

## Alternative Free Options

### Railway (Backend)
- Easier than Heroku
- Go to [railway.app](https://railway.app)
- Connect GitHub and deploy

### Netlify (Frontend)  
- Alternative to Vercel
- Go to [netlify.com](https://netlify.com)
- Drag and drop your `out` folder after running `npm run build`

## Need Help?

### Common Issues:
1. **Build fails**: Run `npm run build` locally first
2. **API not connecting**: Check environment variables
3. **CORS errors**: Update backend with your frontend URL

### Environment Variables:
- Frontend needs: `NEXT_PUBLIC_API_URL`
- Backend needs: `FLASK_ENV=production`

## Cost: $0
Both Vercel and Heroku have generous free tiers perfect for this app!

## What You Get:
- ✅ Live web app accessible from anywhere
- ✅ HTTPS security
- ✅ Automatic deployments from GitHub
- ✅ OCR food label scanning
- ✅ AI food analysis

Ready to go live? Start with Step 1! 🚀