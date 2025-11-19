# Script de build APK Release pour Rwear App
Write-Host "Demarrage du build APK Release..." -ForegroundColor Green
Write-Host ""

$ErrorActionPreference = "Continue"
$AndroidPath = $PSScriptRoot

Set-Location $AndroidPath

Write-Host "Repertoire: $AndroidPath" -ForegroundColor Cyan
Write-Host "Le build peut prendre 5-10 minutes..." -ForegroundColor Yellow
Write-Host ""

# Lancer Gradle
& ".\gradlew.bat" ":app:assembleRelease"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "BUILD REUSSI !" -ForegroundColor Green
    Write-Host ""
    Write-Host "APK genere:" -ForegroundColor Cyan
    $apkPath = Join-Path $AndroidPath "app\build\outputs\apk\release\app-release.apk"
    Write-Host "   $apkPath" -ForegroundColor White
    Write-Host ""
    
    if (Test-Path $apkPath) {
        $apkSize = (Get-Item $apkPath).Length / 1MB
        $sizeRounded = [math]::Round($apkSize, 2)
        Write-Host "   Taille: $sizeRounded MB" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "BUILD ECHOUE" -ForegroundColor Red
    Write-Host "Verifiez les erreurs ci-dessus" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Appuyez sur une touche pour fermer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
