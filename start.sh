#!/bin/bash

# ACM Co-Founder Platform Startup Script
echo "🚀 Starting ACM Co-Founder Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
    echo "⚠️  Please edit backend/.env and add your API keys"
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🎉 Setup complete!"
echo ""
echo "To start the platform:"
echo "1. Edit backend/.env and add your API keys"
echo "2. Run: ./start.sh dev"
echo ""
echo "Or start manually:"
echo "Backend: cd backend && npm run dev"
echo "Frontend: cd frontend && npm run dev"
