#requires -Version 5.1
<#
.SYNOPSIS
  One-time SFTP upload of strmanuals PDFs into the Hostinger /dl/{HASH}/ tree.

.DESCRIPTION
  CI cannot ship /dl/ because private/manuals/**/*.pdf is gitignored.
  This script reads STRMANUALS_DOWNLOAD_HASH from STRManuals/site/.env, then
  uploads the 5 manual PDFs + free magnet to
    /home/u470667024/domains/strmanuals.com/public_html/dl/{HASH}/...
  via scp over port 65002. The deploy workflow excludes /dl/ from rsync
  --delete, so files survive subsequent CI deploys.

  Run from any directory. Requires OpenSSH scp on PATH (built into Windows 11).
  SSH key location: ~/.ssh/id_ed25519 (same key the GH Action uses).

.PARAMETER KeyPath
  SSH private key path. Defaults to ~/.ssh/hostinger_ed25519 (matches the
  STR_SSH_KEY GitHub Actions secret used by the deploy workflow).

.PARAMETER DryRun
  Print the scp commands but do not execute.
#>
[CmdletBinding()]
param(
    [string]$KeyPath = (Join-Path $HOME ".ssh\hostinger_ed25519"),
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$RepoRoot   = "C:\Users\Kebron\Desktop\Claude OS\Wealth\Businesses\Excel-Templates"
$EnvFile    = Join-Path $RepoRoot "STRManuals\site\.env"
$PrivateDir = Join-Path $RepoRoot "STRManuals\site\private"
$SshUser    = "u470667024"
$SshHost    = "195.35.15.247"
$SshPort    = 65002
$RemoteRoot = "/home/u470667024/domains/strmanuals.com/public_html/dl"

if (-not (Test-Path $EnvFile)) { throw ".env not found at $EnvFile" }
$hashLine = Select-String -Path $EnvFile -Pattern '^STRMANUALS_DOWNLOAD_HASH=' | Select-Object -First 1
if (-not $hashLine) { throw "STRMANUALS_DOWNLOAD_HASH missing from $EnvFile" }
$Hash = ($hashLine.Line -split '=', 2)[1].Trim()
if ($Hash -notmatch '^[a-f0-9]{16,}$') { throw "Hash format invalid: $Hash" }

if (-not (Test-Path $KeyPath)) { throw "SSH key not found at $KeyPath" }

$files = @(
    @{ Local = "manuals\str-tax-loophole-playbook\v1.pdf";          Remote = "str-tax-loophole-playbook/v1.pdf" }
    @{ Local = "manuals\material-participation-survival-kit\v1.pdf"; Remote = "material-participation-survival-kit/v1.pdf" }
    @{ Local = "manuals\why-bookings-down\v1.pdf";                  Remote = "why-bookings-down/v1.pdf" }
    @{ Local = "manuals\direct-bookings-starter\v1.pdf";            Remote = "direct-bookings-starter/v1.pdf" }
    @{ Local = "manuals\permit-regulation-survival\v1.pdf";         Remote = "permit-regulation-survival/v1.pdf" }
    @{ Local = "free\tax-loophole-explainer.pdf";                   Remote = "free/tax-loophole-explainer.pdf" }
)

Write-Host "Hash:        $Hash"
Write-Host "Remote root: $RemoteRoot/$Hash/"
Write-Host "Key:         $KeyPath"
Write-Host ""

$sshOpts = @("-i", $KeyPath, "-P", $SshPort, "-o", "StrictHostKeyChecking=accept-new")
$sshExec = @("-i", $KeyPath, "-p", $SshPort, "-o", "StrictHostKeyChecking=accept-new")

# Pre-create remote directories in one ssh call.
$mkdirs = $files | ForEach-Object {
    $dir = Split-Path $_.Remote -Parent
    "mkdir -p '$RemoteRoot/$Hash/$dir'"
} | Sort-Object -Unique
$mkdirCmd = ($mkdirs -join " && ")
Write-Host "[1/2] Creating remote directories..."
if ($DryRun) {
    Write-Host "  DRYRUN: ssh $($sshExec -join ' ') $SshUser@$SshHost `"$mkdirCmd`""
} else {
    & ssh @sshExec "$SshUser@$SshHost" $mkdirCmd
    if ($LASTEXITCODE -ne 0) { throw "Remote mkdir failed (exit $LASTEXITCODE)" }
}

Write-Host "[2/2] Uploading PDFs..."
foreach ($f in $files) {
    $localPath = Join-Path $PrivateDir $f.Local
    if (-not (Test-Path $localPath)) {
        Write-Warning "  SKIP missing: $localPath"
        continue
    }
    $remotePath = "$SshUser@${SshHost}:$RemoteRoot/$Hash/$($f.Remote)"
    $sizeKB = [math]::Round((Get-Item $localPath).Length / 1024, 1)
    Write-Host "  -> $($f.Remote) ($sizeKB KB)"
    if ($DryRun) {
        Write-Host "    DRYRUN: scp $($sshOpts -join ' ') `"$localPath`" `"$remotePath`""
        continue
    }
    & scp @sshOpts $localPath $remotePath
    if ($LASTEXITCODE -ne 0) { throw "scp failed for $($f.Local) (exit $LASTEXITCODE)" }
}

Write-Host ""
Write-Host "Done. Verify by hitting:"
Write-Host "  https://strmanuals.com/dl/$Hash/free/tax-loophole-explainer.pdf"
