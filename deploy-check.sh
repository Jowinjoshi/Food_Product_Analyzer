#!/bin/bash

# Food Scanner Deployment Script

echo "🚀 Food Scanner Deployment Helper"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

echo ""
echo "🐍 Testing backend..."
cd backend

# Check if Python dependencies are installed
python -c "import flask, flask_cors, pandas, numpy, sklearn, xgboost, nltk, spacy, PIL, cv2" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies verified"
else
    echo "⚠️  Installing backend dependencies..."
    pip install -r requirements.txt
fi

# Test backend startup
echo "🧪 Testing backend startup..."
timeout 10s python app.py &
sleep 5

if curl -s http://localhost:5000/health > /dev/null; then
    echo "✅ Backend health check passed"
    pkill -f "python app.py"
else
    echo "❌ Backend health check failed"
    pkill -f "python app.py"
    exit 1
fi

cd ..

echo ""
echo "✅ Pre-deployment checks completed successfully!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Follow the deployment guide in DEPLOYMENT.md"
echo "3. Set up your environment variables on the hosting platform"
echo ""
echo "Recommended quick deploy:"
echo "- Frontend: Vercel (vercel.com)"
echo "- Backend: Heroku (heroku.com)"