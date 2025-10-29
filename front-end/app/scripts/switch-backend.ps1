# Switch Backend URL Helper
# Usage: .\switch-backend.ps1 local
#    or: .\switch-backend.ps1 production

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet('local', 'production', 'custom')]
    [string]$mode
)

$envFile = "c:\Dev\.env"

function Show-Menu {
    Write-Host "
🔄 SWITCH BACKEND URL
" -ForegroundColor Cyan
    Write-Host "Select backend mode:" -ForegroundColor Yellow
    Write-Host "  [1] Local Development (http://localhost:8000)" -ForegroundColor White
    Write-Host "  [2] Production (https://api.airwear.com)" -ForegroundColor White
    Write-Host "  [3] Custom URL" -ForegroundColor White
    Write-Host "  [Q] Quit
" -ForegroundColor White
    
    $choice = Read-Host "Enter choice"
    return $choice
}

function Update-EnvFile {
    param([string]$newUrl)
    
    if (Test-Path $envFile) {
        $content = Get-Content $envFile
        $newContent = @()
        
        foreach ($line in $content) {
            if ($line -match "^EXPO_PUBLIC_API_URL=") {
                $newContent += "EXPO_PUBLIC_API_URL=$newUrl"
            } else {
                $newContent += $line
            }
        }
        
        $newContent | Out-File -FilePath $envFile -Encoding utf8
        
        Write-Host "
✅ Backend URL updated to: $newUrl" -ForegroundColor Green
        Write-Host "
⚠️  IMPORTANT: Restart Expo for changes to take effect:" -ForegroundColor Yellow
        Write-Host "   npx expo start --clear
" -ForegroundColor White
    } else {
        Write-Host "
❌ .env file not found!
" -ForegroundColor Red
    }
}

# Main logic
if (-not $mode) {
    $choice = Show-Menu
    
    switch ($choice) {
        "1" { $mode = "local" }
        "2" { $mode = "production" }
        "3" { $mode = "custom" }
        "Q" { exit }
        "q" { exit }
        default { 
            Write-Host "
❌ Invalid choice
" -ForegroundColor Red
            exit 
        }
    }
}

switch ($mode) {
    "local" {
        Update-EnvFile "http://localhost:8000"
        Write-Host "💡 Don't forget to start Laravel:" -ForegroundColor Cyan
        Write-Host "   php artisan serve
" -ForegroundColor White
    }
    "production" {
        Update-EnvFile "https://api.airwear.com"
    }
    "custom" {
        Write-Host "
" -NoNewline
        $customUrl = Read-Host "Enter custom backend URL (e.g., http://192.168.1.100:8000)"
        if ($customUrl) {
            Update-EnvFile $customUrl
        } else {
            Write-Host "
❌ No URL provided
" -ForegroundColor Red
        }
    }
}
