@echo off
echo 🚀 ExamTrack360 Setup Script for Windows
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v16 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1,2,3 delims=." %%a in ('node --version') do set NODE_VERSION=%%a
set NODE_VERSION=%NODE_VERSION:~1%
if %NODE_VERSION% LSS 16 (
    echo ❌ Node.js version 16 or higher is required. Current version: 
    node --version
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Backend setup
echo.
echo 📦 Setting up Backend...
cd backend

REM Install dependencies
echo Installing backend dependencies...
call npm install

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    copy env.example .env
    echo ⚠️  Please edit backend\.env with your configuration
) else (
    echo ✅ .env file already exists
)

cd ..

REM Frontend setup
echo.
echo 📦 Setting up Frontend...
cd frontend

REM Install dependencies
echo Installing frontend dependencies...
call npm install

cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your MongoDB connection and JWT secret
echo 2. Start the backend server: cd backend ^&^& npm run dev
echo 3. Start the frontend server: cd frontend ^&^& npm run dev
echo 4. Access the application at http://localhost:3000
echo.
echo 🔧 Default credentials (you can create these users):
echo - Admin: admin@examtrack360.com / password123
echo - Teacher: teacher@examtrack360.com / password123
echo - Student: student@examtrack360.com / password123
echo.
echo 📚 For more information, check the README.md file
echo.
pause 