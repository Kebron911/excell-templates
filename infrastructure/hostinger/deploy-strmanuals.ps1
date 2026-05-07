<#
.SYNOPSIS
    Deploy STRManuals SSR build to Hostinger Node.js Web App.

.DESCRIPTION
    Builds (optional), bundles dist + runtime files into a tarball, SCPs to
    the remote app root, swaps the old dist aside for rollback, runs
    `npm ci --omit=dev`, and requests a Passenger restart.

    Defaults to DRY-RUN. Pass -Execute to actually push.

.PARAMETER SkipBuild
    Skip `npm run build` (use existing dist/).

.PARAMETER Execute
    Actually upload + deploy. Without this, prints the plan and exits.

.PARAMETER EnvFile
    Path to the Hostinger env file. Defaults to:
      $env:USERPROFILE\Desktop\Claude OS\.secrets\hostinger.env

.EXAMPLE
    # Plan only (default)
    pwsh ./deploy-strmanuals.ps1

.EXAMPLE
    # Push it
    pwsh ./deploy-strmanuals.ps1 -Execute

.NOTES
    Requires: OpenSSH client (ssh, scp), tar, npm. SSH key per env file.
    Stripe / n8n / HMAC env vars must be set in hPanel -> Node.js -> Environment.
    The `.env` file is intentionally NOT shipped.
#>
[CmdletBinding()]
param(
    [switch]$SkipBuild,
    [switch]$Execute,
    [string]$EnvFile
)

$ErrorActionPreference = 'Stop'
$ProgressPreference    = 'SilentlyContinue'

# ----- Paths --------------------------------------------------------------
$repoRoot   = (Resolve-Path (Join-Path $PSScriptRoot '..\..')).Path
$siteDir    = Join-Path $repoRoot 'STRManuals\site'
$distDir    = Join-Path $siteDir 'dist'
$privateDir = Join-Path $siteDir 'private'

if (-not $EnvFile) {
    $EnvFile = Join-Path $env:USERPROFILE 'Desktop\Claude OS\.secrets\hostinger.env'
}

# ----- Env loader ---------------------------------------------------------
function Read-EnvFile {
    param([string]$Path)
    if (-not (Test-Path -LiteralPath $Path)) { throw "Env file not found: $Path" }
    $map = @{}
    foreach ($raw in Get-Content -LiteralPath $Path) {
        $line = $raw.Trim()
        if (-not $line -or $line.StartsWith('#')) { continue }
        $idx = $line.IndexOf('=')
        if ($idx -lt 1) { continue }
        $k = $line.Substring(0, $idx).Trim()
        $v = $line.Substring($idx + 1)
        # Strip trailing inline comments (only when '#' is preceded by whitespace).
        $v = ($v -replace '\s+#.*$', '').Trim()
        $map[$k] = $v
    }
    return $map
}

$envMap = Read-EnvFile -Path $EnvFile

$required = @(
    'STRMANUALS_SSH_HOST',
    'STRMANUALS_SSH_USER',
    'STRMANUALS_SSH_PORT',
    'STRMANUALS_SSH_KEY_PATH',
    'STRMANUALS_NODE_APP_ROOT'
)
$missing = $required | Where-Object { -not $envMap.ContainsKey($_) -or -not $envMap[$_] }
if ($missing) { throw "Missing required env vars: $($missing -join ', ')" }

$sshHost = $envMap['STRMANUALS_SSH_HOST']
$sshUser = $envMap['STRMANUALS_SSH_USER']
$sshPort = $envMap['STRMANUALS_SSH_PORT']
$sshKey  = $envMap['STRMANUALS_SSH_KEY_PATH']
$appRoot = $envMap['STRMANUALS_NODE_APP_ROOT']

if (-not (Test-Path -LiteralPath $sshKey)) { throw "SSH key not found: $sshKey" }

# ----- Build --------------------------------------------------------------
if (-not $SkipBuild) {
    Write-Host '==> Building STRManuals' -ForegroundColor Cyan
    Push-Location $siteDir
    try {
        npm run build
        if ($LASTEXITCODE -ne 0) { throw 'npm run build failed' }
    } finally {
        Pop-Location
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $distDir 'server\entry.mjs'))) {
    throw 'Missing dist/server/entry.mjs - run a build first (or omit -SkipBuild)'
}

# ----- Package ------------------------------------------------------------
$stamp      = Get-Date -Format 'yyyyMMdd-HHmmss'
$releaseId  = "release-$stamp"
$stagingDir = Join-Path $env:TEMP "strmanuals-deploy-$stamp"
$tarball    = Join-Path $env:TEMP "strmanuals-$releaseId.tar.gz"

Write-Host "==> Staging release $releaseId" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $stagingDir | Out-Null

Copy-Item -Recurse -Force -LiteralPath $distDir -Destination (Join-Path $stagingDir 'dist')
Copy-Item -Force -LiteralPath (Join-Path $siteDir 'package.json')      -Destination $stagingDir
Copy-Item -Force -LiteralPath (Join-Path $siteDir 'package-lock.json') -Destination $stagingDir
if (Test-Path -LiteralPath $privateDir) {
    Copy-Item -Recurse -Force -LiteralPath $privateDir -Destination (Join-Path $stagingDir 'private')
}

Write-Host "==> Creating tarball" -ForegroundColor Cyan
Push-Location $stagingDir
try {
    tar -czf $tarball .
    if ($LASTEXITCODE -ne 0) { throw 'tar failed' }
} finally {
    Pop-Location
}
$tarMB = [math]::Round((Get-Item -LiteralPath $tarball).Length / 1MB, 1)
Write-Host "    Tarball : $tarball ($tarMB MB)"

# ----- Remote command -----------------------------------------------------
$remoteTar = "$appRoot/__deploy/$releaseId.tar.gz"
$remoteCmd = @"
set -euo pipefail
mkdir -p '$appRoot/__deploy' '$appRoot/tmp'
echo '--> snapshotting current dist (for rollback)'
if [ -d '$appRoot/dist' ]; then
  rm -rf '$appRoot/__deploy/dist.previous'
  mv '$appRoot/dist' '$appRoot/__deploy/dist.previous'
fi
echo '--> extracting release'
tar -xzf '$remoteTar' -C '$appRoot'
echo '--> installing prod deps'
cd '$appRoot' && npm ci --omit=dev
echo '--> requesting passenger restart'
touch '$appRoot/tmp/restart.txt'
echo '--> done'
"@

# ----- Plan ---------------------------------------------------------------
Write-Host ''
Write-Host '==> Deploy plan' -ForegroundColor Yellow
Write-Host "    SSH target  : $sshUser@$($sshHost):$sshPort"
Write-Host "    App root    : $appRoot"
Write-Host "    Upload to   : $remoteTar"
Write-Host ''
Write-Host 'Remote commands:' -ForegroundColor Yellow
Write-Host $remoteCmd

if (-not $Execute) {
    Write-Host ''
    Write-Host 'DRY-RUN -- pass -Execute to actually push.' -ForegroundColor Magenta
    Write-Host "Tarball preserved at: $tarball"
    return
}

# ----- Upload + remote install -------------------------------------------
$sshArgs = @(
    '-i', $sshKey,
    '-p', $sshPort,
    '-o', 'StrictHostKeyChecking=accept-new',
    "$sshUser@$sshHost"
)
$scpArgs = @(
    '-i', $sshKey,
    '-P', $sshPort,
    '-o', 'StrictHostKeyChecking=accept-new'
)

Write-Host ''
Write-Host '==> Ensuring remote __deploy directory exists' -ForegroundColor Cyan
& ssh @sshArgs "mkdir -p '$appRoot/__deploy'"
if ($LASTEXITCODE -ne 0) { throw 'remote mkdir failed' }

Write-Host '==> Uploading tarball' -ForegroundColor Cyan
& scp @scpArgs $tarball "${sshUser}@${sshHost}:$remoteTar"
if ($LASTEXITCODE -ne 0) { throw 'scp upload failed' }

Write-Host '==> Running remote install + restart' -ForegroundColor Cyan
$remoteCmd | & ssh @sshArgs 'bash -s'
if ($LASTEXITCODE -ne 0) { throw 'remote deploy failed' }

Write-Host ''
Write-Host "==> Deployed $releaseId" -ForegroundColor Green
Write-Host '    Smoke test : curl -I https://strmanuals.com/'
Write-Host "    Rollback   : ssh -i `"$sshKey`" -p $sshPort $sshUser@$sshHost \`"rm -rf '$appRoot/dist' && mv '$appRoot/__deploy/dist.previous' '$appRoot/dist' && touch '$appRoot/tmp/restart.txt'\`""
