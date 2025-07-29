#!/bin/bash

echo "🚀 ExamTrack360 Setup Script"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Install dependencies
echo "Installing backend dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
else
    echo "✅ .env file already exists"
fi

cd ..

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

cd ..

echo ""
echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Edit backend/.env with your MongoDB connection and JWT secret"
echo "2. Start the backend server: cd backend && npm run dev"
echo "3. Start the frontend server: cd frontend && npm run dev"
echo "4. Access the application at http://localhost:3000"
echo ""
echo "🔧 Default credentials (you can create these users):"
echo "- Admin: admin@examtrack360.com / password123"
echo "- Teacher: teacher@examtrack360.com / password123"
echo "- Student: student@examtrack360.com / password123"
echo ""
echo "📚 For more information, check the README.md file" 