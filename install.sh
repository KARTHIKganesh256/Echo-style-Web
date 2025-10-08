#!/bin/bash

echo "🎨 Echo Style Assistant - Installation Script"
echo "=============================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed successfully"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed successfully"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo "=============================================="
echo "✨ Installation Complete!"
echo ""
echo "Next steps:"
echo "1. Configure environment variables (see SETUP_GUIDE.md)"
echo "2. Start MongoDB"
echo "3. Seed the database: cd server && node data/seedDatabase.js"
echo "4. Run 'npm run dev' in both server and client directories"
echo ""
echo "For detailed instructions, see SETUP_GUIDE.md"
echo "=============================================="
