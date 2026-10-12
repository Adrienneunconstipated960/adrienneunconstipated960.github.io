<#
New bounded concurrency teaching example, NOT the original Lab 3
web request script. Requires PowerShell 7 and .NET. No HTTP calls.
Writes only synthetic task records, not historical measurement evidence.
Example:
  pwsh -NoProfile -File ./bounded-concurrency-demo.ps1 -OutputLog ./synthetic-tasks.jsonl -Count 102 -ThrottleLimit 10
#>
[CmdletBinding()]
param(
    [string]$OutputLog = "./synthetic-tasks.jsonl",
    [ValidateRange(1,10000)][int]$Count = 102,
    [ValidateRange(1,64)][int]$ThrottleLimit = 10
)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$path = [IO.Path]::GetFullPath($OutputLog)
$folder = Split-Path -Parent $path
if ($folder -and -not (Test-Path -LiteralPath $folder)) {
    New-Item -Path $folder -ItemType Directory -Force | Out-Null
}
if (Test-Path -LiteralPath $path) {
    throw "Refusing to overwrite an existing task log."
}
# This .NET lock protects runspaces in a single pwsh process.
# Different processes require OS-level locking instead.
$sync = [object]::new()
$services = @("synthetic-A","synthetic-B","synthetic-C")
1..$Count | ForEach-Object -Parallel {
    $i = $_
    $names = $using:services
    $log = $using:path
    $locker = $using:sync
    $start = [DateTimeOffset]::UtcNow
    Start-Sleep -Milliseconds (10 + ($i % 5) * 8)
    $row = [PSCustomObject]@{
        kind = "SYNTHETIC_LOCAL_TASK"
        task = $i
        service = $names[($i - 1) % 3]
        thread_id = [System.Environment]::CurrentManagedThreadId
        started_utc = $start.ToString("o")
        ended_utc = [DateTimeOffset]::UtcNow.ToString("o")
    }
    $line = $row | ConvertTo-Json -Compress
    [System.Threading.Monitor]::Enter($locker)
    try {
        [IO.File]::AppendAllText($log, $line + [Environment]::NewLine)
    } finally {
        [System.Threading.Monitor]::Exit($locker)
    }
} -ThrottleLimit $ThrottleLimit
$lines = @(Get-Content -LiteralPath $path)
if ($lines.Count -ne $Count) {
    throw "Expected $Count complete lines, observed $($lines.Count)."
}
$rows = @($lines | ForEach-Object { $_ | ConvertFrom-Json })
if ((@($rows.task | Sort-Object -Unique)).Count -ne $Count) {
    throw "Missing or duplicated synthetic task numbers."
}
Write-Output ([PSCustomObject]@{
    kind = "SYNTHETIC_ONLY"
    tasks = $Count
    throttle_limit = $ThrottleLimit
    complete_lines = $lines.Count
    output = $path
})
