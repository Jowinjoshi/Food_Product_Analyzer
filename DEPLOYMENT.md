# Food Scanner Application Deployment Guide

## Overview
Your food scanner application consists of:
- **Frontend**: Next.js application
- **Backend**: Python Flask API with OCR capabilities

## Hosting Options

### Option 1: Vercel (Frontend) + Heroku (Backend) - Recommended for beginners

#### Frontend Deployment (Vercel)
1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (e.g., `https://your-app.herokuapp.com`)

#### Backend Deployment (Heroku)
1. **Install Heroku CLI**: Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Deploy to Heroku**:
   ```bash
   cd backend
   heroku create your-food-scanner-api
   heroku buildpacks:add --index 1 https://github.com/heroku/heroku-buildpack-apt
   heroku config:set FLASK_ENV=production
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

3. **Set up Tesseract on Heroku**:
   Create `Aptfile` in backend folder:
   ```
   tesseract-ocr
   tesseract-ocr-eng
   ```

### Option 2: Netlify (Frontend) + Railway (Backend)

#### Frontend Deployment (Netlify)
1. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop your build folder, or connect GitHub
   - Set environment variables in Site Settings

#### Backend Deployment (Railway)
1. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select the backend folder
   - Add environment variables

### Option 3: Docker Deployment (VPS/Cloud)

#### Build and Deploy
```bash
# Backend
cd backend
docker build -t food-scanner-api .
docker run -p 5000:5000 food-scanner-api

# Frontend
cd ..
docker build -t food-scanner-frontend .
docker run -p 3000:3000 food-scanner-frontend
```

## Environment Variables Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_ENV=production
```

### Backend
```
FLASK_ENV=production
PORT=5000
```

## Pre-Deployment Checklist

### Frontend
- [ ] Update API URLs to use environment variables
- [ ] Test production build: `npm run build`
- [ ] Configure CORS in backend for your frontend domain

### Backend
- [ ] Ensure all dependencies are in requirements.txt
- [ ] Test API endpoints locally
- [ ] Configure file upload limits
- [ ] Set up proper error handling

## Local Testing

### Test Production Build
```bash
# Frontend
npm run build
npm start

# Backend
cd backend
export FLASK_ENV=production
python app.py
```

## Troubleshooting

### Common Issues:
1. **CORS errors**: Update backend CORS configuration
2. **File upload fails**: Check file size limits
3. **OCR not working**: Ensure Tesseract is installed on server
4. **API connection fails**: Verify environment variables

### Debugging:
- Check browser console for frontend errors
- Check server logs for backend errors
- Test API endpoints with tools like Postman

## Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **File Uploads**: Validate file types and sizes
3. **CORS**: Only allow your frontend domain in production
4. **Rate Limiting**: Consider adding rate limiting to API

## Monitoring

- Set up health check endpoints
- Monitor server resources
- Track API response times
- Set up error logging

## Cost Estimates (Monthly)

- **Vercel + Heroku**: $0-7 (free tiers available)
- **Netlify + Railway**: $0-5 (free tiers available)
- **VPS (DigitalOcean)**: $5-20 depending on specs

Choose the option that best fits your technical expertise and budget!