<#
  Script: check-signing.ps1
  Objectif: Vérifier rapidement la conformité de la clé d'upload (keystore) et de la signature d'un APK
           avec l'empreinte SHA-1 attendue par Google Play.

  Utilisation basique:
    pwsh ./scripts/check-signing.ps1 -ExpectedSha1 "25:25:7B:2B:DA:48:1B:34:EA:1E:F5:0B:C4:B9:D9:04:F9:A3:04:F0"

  Avec APK:
    pwsh ./scripts/check-signing.ps1 -ApkPath "android/app/build/outputs/apk/release/app-release.apk" -ExpectedSha1 "25:25:7B:2B:DA:48:1B:34:EA:1E:F5:0B:C4:B9:D9:04:F9:A3:04:F0"

  Variables d'environnement supportées (fallback si paramètres non fournis):
    RW_STORE_FILE, RW_KEY_ALIAS, RW_STORE_PASSWORD, RW_KEY_PASSWORD

  Codes de sortie:
    0 = OK / Correspondance
    1 = Avertissement / APK non fourni ou info partielle
    2 = Mismatch SHA-1
    3 = Erreur (keystore introuvable / commande échouée)
  Ne jamais commiter un keystore ou mot de passe dans un dépôt public.
#>

param(
  [string]$KeystorePath = $env:RW_STORE_FILE,
  [string]$Alias = $env:RW_KEY_ALIAS,
  [string]$StorePassword = $env:RW_STORE_PASSWORD,
  [string]$KeyPassword = $env:RW_KEY_PASSWORD, # Non requis pour lecture d'empreinte
  [string]$ApkPath,
  [string]$ExpectedSha1
)

function Write-Section($title) {
  Write-Host "`n=== $title ===" -ForegroundColor Cyan
}

function Fail($msg, $code = 3) {
  Write-Error $msg
  exit $code
}

if (-not $KeystorePath) { Fail "KeystorePath non fourni (paramètre ou RW_STORE_FILE)." }
if (-not (Test-Path $KeystorePath)) { Fail "Keystore introuvable: $KeystorePath" }
if (-not $Alias) { Fail "Alias non fourni (paramètre ou RW_KEY_ALIAS)." }
if (-not $StorePassword) { Fail "StorePassword non fourni (paramètre ou RW_STORE_PASSWORD)." }

Write-Section "Empreinte keystore"
try {
  $keytoolOutput = & keytool -list -v -keystore "$KeystorePath" -alias "$Alias" -storepass "$StorePassword" 2>&1
} catch {
  Fail "Echec d'exécution keytool: $($_.Exception.Message)"
}

if ($LASTEXITCODE -ne 0) { Fail "keytool a retourné un code $LASTEXITCODE" }

$keystoreSha1 = ($keytoolOutput | Select-String -Pattern "SHA1:" | ForEach-Object { $_.ToString().Trim() })
if (-not $keystoreSha1) { Fail "Impossible de détecter SHA1 dans la sortie keytool." }
Write-Host $keystoreSha1 -ForegroundColor Green

if ($ExpectedSha1) {
  $normalizedExpected = $ExpectedSha1.ToUpper()
  $normalizedActual = ($keystoreSha1 -replace 'SHA1:\s*','').ToUpper()
  if ($normalizedActual -eq $normalizedExpected) {
    Write-Host "Correspondance keystore SHA-1 OK" -ForegroundColor Green
  } else {
    Write-Host "Mismatch keystore SHA-1. Attendu: $normalizedExpected / Actuel: $normalizedActual" -ForegroundColor Yellow
    $keystoreMismatch = $true
  }
}

if ($ApkPath) {
  Write-Section "Empreinte APK ($ApkPath)"
  if (-not (Test-Path $ApkPath)) { Fail "APK introuvable: $ApkPath" }
  try {
    $apkCert = & keytool -printcert -jarfile "$ApkPath" 2>&1
  } catch {
    Fail "Echec keytool -printcert: $($_.Exception.Message)"
  }
  if ($LASTEXITCODE -ne 0) { Fail "keytool -printcert a retourné un code $LASTEXITCODE" }
  $apkSha1Line = ($apkCert | Select-String -Pattern "SHA1:" | ForEach-Object { $_.ToString().Trim() })
  if ($apkSha1Line) {
    Write-Host $apkSha1Line -ForegroundColor Green
    if ($ExpectedSha1) {
      $apkActual = ($apkSha1Line -replace 'SHA1:\s*','').ToUpper()
      if ($apkActual -eq $normalizedExpected) {
        Write-Host "Correspondance APK SHA-1 OK" -ForegroundColor Green
      } else {
        Write-Host "Mismatch APK SHA-1. Attendu: $normalizedExpected / Actuel: $apkActual" -ForegroundColor Yellow
        $apkMismatch = $true
      }
    }
  } else {
    Write-Host "SHA1 non trouvé dans le certificat APK." -ForegroundColor Yellow
    $apkMissing = $true
  }
} else {
  Write-Host "APK non fourni - skip vérification APK" -ForegroundColor DarkGray
}

Write-Section "Résultat"
if ($keystoreMismatch -or $apkMismatch) {
  Write-Host "Au moins une empreinte ne correspond pas." -ForegroundColor Yellow
  exit 2
}
if ($apkMissing) {
  Write-Host "Empreinte APK manquante (keystore OK)." -ForegroundColor Yellow
  exit 1
}
Write-Host "Toutes les vérifications terminées avec succès." -ForegroundColor Green
exit 0
