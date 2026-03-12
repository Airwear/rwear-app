# Quick Backend URL Checker
# Run this anytime: .\check-backend-url.ps1

Write-Host "
🌐 BACKEND URL CONFIGURATION
" -ForegroundColor Cyan

# Read .env file
$envFile = "c:\Dev\.env"
if (Test-Path $envFile) {
    $content = Get-Content $envFile
    $apiUrl = ($content | Select-String "EXPO_PUBLIC_API_URL" | Where-Object { $_ -notmatch "^#" } | Select-Object -First 1).ToString()
    
    if ($apiUrl) {
        $url = $apiUrl -replace ".*=", ""
        Write-Host "✅ Current Backend URL:" -ForegroundColor Green
        Write-Host "   $url
" -ForegroundColor Yellow
        
        # Check if it's local or production
        if ($url -match "localhost|127.0.0.1|192.168|10.0") {
            Write-Host "📍 Mode: LOCAL DEVELOPMENT" -ForegroundColor Cyan
            Write-Host "   Make sure Laravel is running: php artisan serve
" -ForegroundColor White
        } else {
            Write-Host "📍 Mode: PRODUCTION/REMOTE" -ForegroundColor Magenta
            Write-Host "   Using remote server
" -ForegroundColor White
        }
    }
} else {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
}

Write-Host "📝 To change URL:" -ForegroundColor Yellow
Write-Host "   1. Edit: c:\Dev\.env" -ForegroundColor White
Write-Host "   2. Update EXPO_PUBLIC_API_URL" -ForegroundColor White
Write-Host "   3. Restart: npx expo start --clear
" -ForegroundColor White

Write-Host "💡 Quick Options:" -ForegroundColor Yellow
Write-Host "   [1] Local:      http://localhost:8000" -ForegroundColor Cyan
Write-Host "   [2] Production: https://api.airwear.com" -ForegroundColor Cyan
Write-Host "   [3] Custom IP:  http://YOUR_IP:8000
" -ForegroundColor Cyan

Write-Host "📚 Full guide: BACKEND_URL_GUIDE.md
" -ForegroundColor Green
