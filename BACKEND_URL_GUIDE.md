# 🌐 Backend URL Configuration Guide

## 📍 Your Current Setup

### Frontend (React Native App)
**Location:** c:\Dev\.env
**Current URL:** https://api.airwear.com

### Backend (Laravel API)
**Location:** c:\Dev\ (Laravel project root)
**Default URL:** http://localhost:8000 (when running locally)

---

## 🔧 How to Configure Your Backend URL

### Option 1: Local Development (Recommended for Testing)

#### Step 1: Start Your Laravel Backend
`ash
# Navigate to your project root (you're already there)
cd c:\Dev

# Start Laravel development server
php artisan serve
`

This will start Laravel at: **http://127.0.0.1:8000** or **http://localhost:8000**

#### Step 2: Update Frontend .env File
Edit c:\Dev\.env:
`nv
# For local development - UNCOMMENT THIS LINE:
EXPO_PUBLIC_API_URL=http://localhost:8000

# Comment out production URL:
# EXPO_PUBLIC_API_URL=https://api.airwear.com
`

#### Step 3: Restart Expo
`ash
# Stop expo (Ctrl+C) and restart
npx expo start --clear
`

---

### Option 2: Using Your Computer's IP (For Testing on Real Device)

If you want to test on a real phone (not emulator), you need your computer's IP address.

#### Step 1: Find Your Computer's IP Address
`ash
# Run this command:
ipconfig
`

Look for **IPv4 Address** under your active network adapter (usually starts with 192.168.x.x or 10.0.x.x)

Example output:
`
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
`

#### Step 2: Start Laravel on All Interfaces
`ash
php artisan serve --host=0.0.0.0 --port=8000
`

#### Step 3: Update Frontend .env
`nv
# Replace with YOUR computer's IP address:
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000
`

---

### Option 3: Production/Staging Server

If you have a deployed backend:

`nv
# Production
EXPO_PUBLIC_API_URL=https://api.airwear.com

# Or staging
EXPO_PUBLIC_API_URL=https://staging-api.airwear.com
`

---

## 🧪 How to Test Your Backend Connection

### Method 1: Check in the App
1. Start your Laravel backend: php artisan serve
2. Start your React Native app: 
px expo start
3. Try to login - check the console for API calls

### Method 2: Test API Directly
`ash
# Test if backend is running
curl http://localhost:8000/api/login

# Or open in browser:
# http://localhost:8000/api/login
`

### Method 3: Check in Code
The API service automatically uses the URL from .env:

**File:** c:\Dev\src\services\api.ts
`	ypescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
`

---

## 📱 Complete Setup Example

### For Local Development:

**Terminal 1 - Start Laravel Backend:**
`ash
cd c:\Dev
php artisan serve
`
Output: Laravel development server started: http://127.0.0.1:8000

**Terminal 2 - Start React Native App:**
`ash
cd c:\Dev
npx expo start
`

**Edit .env:**
`nv
EXPO_PUBLIC_API_URL=http://localhost:8000
EXPO_PUBLIC_ENV=development
`

---

## 🔍 How to See/Verify Your Current Backend URL

### Method 1: Check .env File
`ash
# View the file
cat c:\Dev\.env

# Or open in VS Code
code c:\Dev\.env
`

### Method 2: Check at Runtime (Add Console Log)
Edit c:\Dev\src\services\api.ts temporarily:

`	ypescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
console.log('🌐 Backend URL:', API_URL); // Add this line
`

Then check the console when you run the app.

### Method 3: Create a Debug Screen
I can create a settings screen that shows the current backend URL if you want!

---

## ⚠️ Important Notes

### 1. Restart Required
After changing .env, you MUST restart Expo:
`ash
# Stop with Ctrl+C, then:
npx expo start --clear
`

### 2. CORS Configuration
Make sure your Laravel backend allows requests from your app. Check config/cors.php:

`php
'allowed_origins' => ['*'], // For development
`

### 3. HTTPS vs HTTP
- **Local development:** Use http://
- **Production:** Use https://

### 4. Port Numbers
- Laravel default: :8000
- If port 8000 is busy, Laravel will use :8001, :8002, etc.

---

## 🚀 Quick Start Commands

`ash
# 1. Start Laravel backend
php artisan serve

# 2. In another terminal, start React Native app
npx expo start

# 3. Make sure .env has:
# EXPO_PUBLIC_API_URL=http://localhost:8000
`

---

## 🐛 Troubleshooting

### "Network Error" when trying to login
- ✅ Check Laravel is running: php artisan serve
- ✅ Check .env has correct URL
- ✅ Restart Expo: 
px expo start --clear
- ✅ Check Laravel CORS settings

### "Connection refused"
- ✅ Laravel server is not running
- ✅ Wrong port number in .env
- ✅ Firewall blocking the connection

### Testing on real device not working
- ✅ Use computer's IP address (not localhost)
- ✅ Phone and computer on same WiFi network
- ✅ Start Laravel with: php artisan serve --host=0.0.0.0

---

## 📝 Current Configuration Summary

**Frontend .env location:** c:\Dev\.env
**Current backend URL:** https://api.airwear.com

**To switch to local development:**
1. Edit c:\Dev\.env
2. Change to: EXPO_PUBLIC_API_URL=http://localhost:8000
3. Start Laravel: php artisan serve
4. Restart Expo: 
px expo start --clear

---

Need help with any of these steps? Let me know! 🚀
