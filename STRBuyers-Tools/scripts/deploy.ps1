# Deploy STRBuyers-Tools static dist/ to Hostinger via SFTP (SSH key auth).
#
# Phase 6 Task 33 (rewrite). The original FTP variant in commit 7efa1e5
# could not authenticate -- the FTP sub-account u470667024.strbuyers.tools
# is not provisioned on Hostinger. The shared cluster SSH key on the main
# u470667024 account already has access to all sister-site doc roots, so
# we pivot to SFTP for parity with deploy-strops.ps1.
#
# Usage (from STRBuyers-Tools/):
#   .\scripts\deploy.ps1                # full deploy
#   .\scripts\deploy.ps1 -SkipBackup    # skip remote backup (faster, riskier)
#   .\scripts\deploy.ps1 -Verify        # smoke a deployed site (no upload)
#   .\scripts\deploy.ps1 -Force         # ignore .deploy-last-hash
#
# Requirements:
#   - SSH key at the path in hostinger.env STRBUYERS_SSH_KEY_PATH
#     (default: C:\Users\Kebron\.ssh\hostinger_ed25519). Key must be
#     authorized on the main u470667024 Hostinger account.
#   - Either:
#       (preferred) WinSCP .NET assembly at
#         C:\Program Files (x86)\WinSCP\WinSCPnet.dll
#         (winget install WinSCP.WinSCP)
#       (fallback) OpenSSH scp.exe + ssh.exe on PATH
#         (built into Windows 10+).
#   - dist/ already built (`pnpm build` from STRBuyers-Tools/).
#
# Idempotent: if local dist/ hash matches the SHA stored in
# .deploy-last-hash, the script reports "no changes" and exits 0 without
# touching the remote.
#
# ASCII-only on purpose (PS 5.1 + Windows-1252 chokes on smart punctuation).

param(
  [switch]$SkipBackup,
  [switch]$Verify,
  [switch]$Force,
  [string]$Domain = 'strbuyers.tools'
)

$ErrorActionPreference = 'Stop'

# --- Resolve paths ---
$projectRoot = Split-Path -Parent $PSScriptRoot       # .../STRBuyers-Tools
$distDir     = Join-Path $projectRoot 'dist'
$hashFile    = Join-Path $projectRoot 'scripts\.deploy-last-hash'
$secretsEnv  = 'C:\Users\Kebron\Desktop\Claude OS\.secrets\hostinger.env'

if (-not (Test-Path $secretsEnv)) {
  throw "hostinger.env not found at $secretsEnv"
}

# --- Parse env file (KEY=VAL with optional inline # comment) ---
$cfg = @{}
foreach ($line in (Get-Content $secretsEnv)) {
  if ($line -match '^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)$') {
    $key = $matches[1]; $val = $matches[2].Trim()
    if ($val -match '^([^#]*?)\s+#') { $val = $matches[1].Trim() }
    $cfg[$key] = $val
  }
}

$sshHost  = $cfg.STRBUYERS_SSH_HOST
$sshUser  = $cfg.STRBUYERS_SSH_USER
$sshPort  = $cfg.STRBUYERS_SSH_PORT
$keyPath  = $cfg.STRBUYERS_SSH_KEY_PATH
$docRoot  = $cfg.STRBUYERS_DOC_ROOT

if (-not $sshHost -or -not $sshUser -or -not $sshPort -or -not $keyPath -or -not $docRoot) {
  throw "Missing STRBUYERS_SSH_* vars in $secretsEnv (HOST/USER/PORT/KEY_PATH/DOC_ROOT all required)"
}
if (-not (Test-Path $keyPath)) {
  throw "SSH key not found at STRBUYERS_SSH_KEY_PATH = '$keyPath'"
}

# --- Smoke verify ---
function Test-Site {
  $checks = @(
    @{ url = "https://$Domain/";                            needle = 'STR Buyers' },
    @{ url = "https://$Domain/dscr-loan-calculator";        needle = 'DSCR' },
    @{ url = "https://$Domain/cities/austin-tx";            needle = 'Austin' },
    @{ url = "https://$Domain/cities";                      needle = 'cities' },
    @{ url = "https://$Domain/disclosures";                 needle = 'disclosure' },
    @{ url = "https://$Domain/sitemap-index.xml";           needle = '<sitemapindex' },
    @{ url = "https://$Domain/robots.txt";                  needle = 'User-agent' }
  )
  $allOk = $true
  foreach ($c in $checks) {
    try {
      $resp = Invoke-WebRequest -Uri $c.url -UseBasicParsing -TimeoutSec 20 -MaximumRedirection 5
      $found = $resp.Content -match [Regex]::Escape($c.needle)
      $okStatus = $resp.StatusCode -eq 200
      $tag = if ($found -and $okStatus) { 'OK  ' } else { 'FAIL' }
      if (-not ($found -and $okStatus)) { $allOk = $false }
      Write-Output ("  {0}  HTTP {1}  {2,7}b  {3}" -f $tag, $resp.StatusCode, $resp.Content.Length, $c.url)
    } catch {
      $allOk = $false
      Write-Output ("  FAIL  ERR        -  {0}  {1}" -f $c.url, $_.Exception.Message)
    }
  }
  return $allOk
}

if ($Verify) {
  Write-Output "=== Smoke verify $Domain ==="
  $ok = Test-Site
  if ($ok) { Write-Output 'All smoke checks passed.'; exit 0 }
  else     { Write-Output 'Smoke checks FAILED.'; exit 1 }
}

# --- Pre-flight ---
if (-not (Test-Path $distDir)) {
  throw "dist/ not found at $distDir - run 'pnpm build' first"
}
if (-not (Test-Path (Join-Path $distDir 'index.html'))) {
  throw "dist/index.html missing - build incomplete"
}

# --- Idempotence check: hash dist tree ---
function Get-DistHash {
  $files = Get-ChildItem -Path $distDir -Recurse -File | Sort-Object FullName
  $sb = New-Object System.Text.StringBuilder
  foreach ($f in $files) {
    $h = Get-FileHash -Path $f.FullName -Algorithm SHA1
    [void]$sb.AppendLine("$($f.FullName.Substring($distDir.Length))|$($h.Hash)")
  }
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($sb.ToString())
  $sha = [System.Security.Cryptography.SHA256]::Create()
  $hash = $sha.ComputeHash($bytes)
  return ([System.BitConverter]::ToString($hash) -replace '-', '').ToLower()
}

$currentHash = Get-DistHash
$lastHash = if (Test-Path $hashFile) { (Get-Content $hashFile -Raw -ErrorAction SilentlyContinue) } else { '' }
if (-not $Force -and $currentHash.Trim() -eq $lastHash.Trim() -and $lastHash) {
  Write-Output "dist/ unchanged since last deploy (hash $($currentHash.Substring(0,12))). Skipping upload."
  Write-Output "Use -Force to deploy anyway."
  exit 0
}

$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = "$docRoot.backup-$timestamp"
$fileCount = (Get-ChildItem $distDir -Recurse -File).Count

# --- SSH/SCP helpers (used by both modes for remote shell ops) ---
$sshOpts = @('-o','BatchMode=yes','-o','StrictHostKeyChecking=accept-new','-o','ConnectTimeout=20')

function Invoke-RemoteSsh {
  param([string]$RemoteCmd)
  & ssh -i $keyPath -p $sshPort @sshOpts "$sshUser@$sshHost" $RemoteCmd
  if ($LASTEXITCODE -ne 0) { throw "ssh failed (exit $LASTEXITCODE) for: $RemoteCmd" }
}

# --- Detect upload backend ---
# WinSCP .NET assembly cannot parse OpenSSH-format ed25519 private keys
# (it wants PuTTY .ppk). Detect that case and fall through to scp.exe.
$winscpDll = 'C:\Program Files (x86)\WinSCP\WinSCPnet.dll'
$keyHeader = (Get-Content $keyPath -TotalCount 1)
$keyIsOpenSshNew = $keyHeader -match 'BEGIN OPENSSH PRIVATE KEY'
$useWinscp = (Test-Path $winscpDll) -and (-not $keyIsOpenSshNew)
if ($useWinscp) {
  Write-Output "Backend: WinSCP .NET assembly ($winscpDll)"
} else {
  if ($keyIsOpenSshNew) {
    Write-Output "Backend: OpenSSH scp.exe (key is OpenSSH ed25519 -- WinSCP needs .ppk)"
  } else {
    Write-Output "Backend: OpenSSH scp.exe (WinSCPnet.dll not found)"
  }
  $scpExe = (Get-Command scp.exe -ErrorAction SilentlyContinue).Source
  if (-not $scpExe) { throw "scp.exe not found. Install OpenSSH Client (Windows Optional Feature)." }
}

# --- Backup remote (always via ssh mv -- atomic on same filesystem) ---
if (-not $SkipBackup) {
  Write-Output "=== Backing up remote $docRoot -> $backupRoot ==="
  try {
    Invoke-RemoteSsh "set -e; if [ -d '$docRoot' ]; then mv '$docRoot' '$backupRoot'; fi; mkdir -p '$docRoot'"
  } catch {
    throw "Remote backup failed: $($_.Exception.Message). Aborting before any upload."
  }
  Write-Output "  Backup created at $backupRoot"
} else {
  Write-Output "=== Skipping backup (per -SkipBackup) ==="
}

# --- Upload dist/* -> docRoot ---
Write-Output "=== Uploading $fileCount files from dist/ -> $Domain ==="

if ($useWinscp) {
  # WinSCP .NET assembly path: SFTP synchronize (mirror local -> remote).
  # Hostinger SFTP uses the same SSH endpoint (host:65002).
  Add-Type -Path $winscpDll
  $sessionOptions = New-Object WinSCP.SessionOptions -Property @{
    Protocol             = [WinSCP.Protocol]::Sftp
    HostName             = $sshHost
    UserName             = $sshUser
    PortNumber           = [int]$sshPort
    SshPrivateKeyPath    = $keyPath
    GiveUpSecurityAndAcceptAnySshHostKey = $true
  }
  $session = New-Object WinSCP.Session
  try {
    $session.Open($sessionOptions)
    $transferOptions = New-Object WinSCP.TransferOptions
    $transferOptions.TransferMode = [WinSCP.TransferMode]::Binary
    # synchronizeMode = Remote means "mirror local -> remote".
    $syncResult = $session.SynchronizeDirectories(
      [WinSCP.SynchronizationMode]::Remote,
      $distDir,
      $docRoot,
      $false,              # removeFiles -- we already wiped the docroot via backup-mv
      $false,              # mirror
      [WinSCP.SynchronizationCriteria]::Time,
      $transferOptions
    )
    $syncResult.Check()
    Write-Output ("  Uploaded {0} files via WinSCP SFTP." -f $syncResult.Uploads.Count)
  } finally {
    $session.Dispose()
  }
} else {
  # OpenSSH fallback: scp -r each top-level dist/ entry into the docroot.
  $entries = Get-ChildItem -Path $distDir -Force
  foreach ($entry in $entries) {
    & scp -i $keyPath -P $sshPort @sshOpts -r -q $entry.FullName "${sshUser}@${sshHost}:$docRoot/"
    if ($LASTEXITCODE -ne 0) {
      throw "scp failed (exit $LASTEXITCODE) on $($entry.FullName). Backup remains at $backupRoot."
    }
  }
  Write-Output "  Uploaded via scp."
}

# --- Fix permissions ---
# scp -r from Windows transfers files with Windows-mode perms; subdirs land
# at 0700 which Apache cannot traverse (returns 403 on subroute index.html).
# Force docroot to 755 dirs / 644 files so Apache can serve every page.
Write-Output "=== Normalizing remote permissions (755 dirs, 644 files) ==="
Invoke-RemoteSsh "cd '$docRoot' && find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +"

# --- Persist hash ---
Set-Content -Path $hashFile -Value $currentHash -NoNewline -Encoding ascii

# --- Smoke verify ---
Write-Output ""
Write-Output "=== Smoke verify $Domain ==="
Start-Sleep -Seconds 5
$ok = Test-Site
if (-not $ok) {
  Write-Warning "Smoke checks failed. Backup is at $backupRoot."
  Write-Warning "  To revert via SSH: ssh -i '$keyPath' -p $sshPort $sshUser@$sshHost 'rm -rf `"$docRoot`" && mv `"$backupRoot`" `"$docRoot`"'"
  exit 2
}

Write-Output ""
Write-Output "Deployed to https://$Domain/"
Write-Output "Backup: $backupRoot (delete once you verify the live site)"
exit 0
