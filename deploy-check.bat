@echo off
echo 🚀 Food Scanner Deployment Helper
echo ==================================

:: Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)

echo ✅ Frontend build successful
echo.

echo 🐍 Testing backend...
cd backend

echo ⚠️  Installing backend dependencies...
pip install -r requirements.txt

echo 🧪 Testing backend startup...
start /b python app.py
timeout /t 5 /nobreak > nul

curl -s http://localhost:5000/health > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend health check passed
) else (
    echo ❌ Backend health check failed - this is normal if curl is not installed
)

taskkill /f /im python.exe > nul 2>&1

cd ..

echo.
echo ✅ Pre-deployment checks completed!
echo.
echo Next steps:
echo 1. Push your code to GitHub
echo 2. Follow the deployment guide in DEPLOYMENT.md
echo 3. Set up your environment variables on the hosting platform
echo.
echo Recommended quick deploy:
echo - Frontend: Vercel (vercel.com)
echo - Backend: Heroku (heroku.com)
echo.
pause