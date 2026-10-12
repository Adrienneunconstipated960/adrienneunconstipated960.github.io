<#
New source-informed reconstruction of CS646 Lab 2 CSV sorting.
NOT the original student submission. Requires PowerShell 7.
Example:
  pwsh -NoProfile -File ./safe-sort-reconstruction.ps1 -InputCsv ./input.csv -OutputCsv ./sorted.csv -Primary Department -Secondary Name -LogPath ./sort.log
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory)][string]$InputCsv,
    [Parameter(Mandatory)][string]$OutputCsv,
    [Parameter(Mandatory)][string]$Primary,
    [Parameter(Mandatory)][string]$Secondary,
    [string]$LogPath = "./sort.log"
)
$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest
$sourcePath = [IO.Path]::GetFullPath($InputCsv)
$resultPath = [IO.Path]::GetFullPath($OutputCsv)
$logFilePath = [IO.Path]::GetFullPath($LogPath)
if ($sourcePath -eq $resultPath) { throw "Input and output must be different files." }
if ($sourcePath -eq $logFilePath -or $resultPath -eq $logFilePath) {
    throw "Log path cannot equal input or output path."
}
if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
    throw "Source CSV does not exist."
}
$before = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
$records = @(Import-Csv -LiteralPath $sourcePath)
if ($records.Count -eq 0) { throw "Source CSV contains no data rows." }
$headers = @($records[0].PSObject.Properties.Name)
if ($Primary -notin $headers -or $Secondary -notin $headers) {
    throw "One or both sort fields are absent from the CSV header."
}
# Sort-Object -Stable preserves exact-tie order and complete record objects.
# This new minimal reference sorts strings, unlike the original report's
# additional numeric-aware and malformed-row testing extensions.
$sorted = @($records | Sort-Object -Property $Primary, $Secondary -Stable)
$outputDir = Split-Path -Parent $resultPath
if ($outputDir -and -not (Test-Path -LiteralPath $outputDir)) {
    New-Item -Path $outputDir -ItemType Directory -Force | Out-Null
}
$sorted | Export-Csv -LiteralPath $resultPath -Encoding UTF8 -NoTypeInformation
$after = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash
if ($before -ne $after) {
    throw "Source CSV changed during the run; investigate before accepting output."
}
$verified = @(Import-Csv -LiteralPath $resultPath)
if ($verified.Count -ne $records.Count) {
    throw "Output row count does not match input row count."
}
$entry = [PSCustomObject]@{
    timestamp_utc = (Get-Date).ToUniversalTime().ToString("o")
    input = $sourcePath
    output = $resultPath
    primary = $Primary
    secondary = $Secondary
    row_count = $records.Count
    source_sha256 = $before
    input_unchanged = $true
}
$entry | ConvertTo-Json -Compress | Add-Content -LiteralPath $logFilePath
Write-Output $entry
