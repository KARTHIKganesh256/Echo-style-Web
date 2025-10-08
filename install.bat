@echo off
echo 🎨 Echo Style Assistant - Installation Script
echo ==============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    exit /b 1
)

node -v
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed successfully
cd ..

echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed successfully
cd ..

echo.
echo ==============================================
echo ✨ Installation Complete!
echo.
echo Next steps:
echo 1. Configure environment variables (see SETUP_GUIDE.md)
echo 2. Start MongoDB
echo 3. Seed the database: cd server ^&^& node data/seedDatabase.js
echo 4. Run 'npm run dev' in both server and client directories
echo.
echo For detailed instructions, see SETUP_GUIDE.md
echo ==============================================
pause
