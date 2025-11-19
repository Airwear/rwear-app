param(
    [string]$Variant = "release",
    [switch]$SkipBuild,
    [switch]$SkipLaunch,
    [string]$AdbPath,
    [string]$ApkPath
)

$ErrorActionPreference = 'Stop'

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Warn($msg){ Write-Host "[WARN] $msg" -ForegroundColor Yellow }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

function Resolve-Adb(){
    if($AdbPath){
        if(Test-Path $AdbPath){ return $AdbPath } else { Write-Err "AdbPath fourni introuvable: $AdbPath"; exit 1 }
    }
    $adb = Get-Command adb -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source
    if(-not $adb){ Write-Err "ADB introuvable. Installez Platform Tools: https://developer.android.com/tools/releases/platform-tools et ajoutez au PATH ou utilisez -AdbPath"; exit 1 }
    return $adb
}

function Get-ConnectedDevice($adb){
    $devices = & $adb devices | Select-String "\tdevice$" | ForEach-Object { ($_ -split '\t')[0] }
    if(-not $devices){ Write-Err "Aucun device connecté (adb devices vide)."; exit 1 }
    if($devices.Count -gt 1){ Write-Warn "Plusieurs devices détectés, utilisation du premier: $($devices[0])" }
    return $devices[0]
}

function Resolve-ApplicationId(){
    $buildFile = Join-Path $PSScriptRoot "app\\build.gradle"
    if(-not (Test-Path $buildFile)){ Write-Err "build.gradle introuvable: $buildFile"; exit 1 }
    $line = Get-Content $buildFile | Select-String -Pattern "^\s*applicationId\s+['\"]([A-Za-z0-9_.]+)['\"]" -AllMatches | Select-Object -First 1
    if(-not $line){ Write-Err "applicationId non trouvé dans app/build.gradle"; exit 1 }
    $appId = $line.Matches[0].Groups[1].Value
    return $appId
}

function Build-IfNeeded(){
    if($SkipBuild){ Write-Info "Skip build demandé"; return }
    Write-Info "Construction APK variant=$Variant";
    Push-Location $PSScriptRoot
    try {
        & ./gradlew ":app:assemble$($Variant.Substring(0,1).ToUpper()+$Variant.Substring(1))" --no-daemon
    } catch {
        Write-Err "Echec build: $($_.Exception.Message)"; exit 1
    } finally { Pop-Location }
}

function Resolve-ApkPath(){
    if($ApkPath){ if(Test-Path $ApkPath){ return $ApkPath } else { Write-Err "ApkPath fourni introuvable: $ApkPath"; exit 1 } }
    $outDir = Join-Path $PSScriptRoot "app\\build\\outputs\\apk\\$Variant"
    $apk = Get-ChildItem $outDir -Filter "*.apk" -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if(-not $apk){ Write-Err "APK introuvable dans $outDir"; exit 1 }
    return $apk.FullName
}

function Install-APK($adb,$device,$apk){
    Write-Info "Installation APK sur $device: $apk"
    & $adb -s $device install -r "$apk" | Tee-Object -Variable installOut
    if($installOut -notmatch "Success"){ Write-Err "Installation échouée"; exit 1 }
}

function Launch-App($adb,$device,$appId){
    if($SkipLaunch){ Write-Info "Skip launch demandé"; return }
    Write-Info "Lancement app: $appId"
    & $adb -s $device shell monkey -p $appId 1 | Out-Null
}

Write-Info "Script démarré"
$adb = Resolve-Adb
$device = Get-ConnectedDevice $adb
$appId = Resolve-ApplicationId
Build-IfNeeded
$apk = Resolve-ApkPath
Install-APK $adb $device $apk
Launch-App $adb $device $appId
Write-Info "Terminé: $appId installé sur $device"
