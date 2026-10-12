param(
    [int]$Samples = 5,
    [int]$IntervalSeconds = 5,
    [string]$CsvPath = "/work/memory-audit.csv",
    [double]$AnomalyThresholdMB = 150
)

# ------------------------------------------------------------
# CS 646 Memory Audit
# Collects physical (RSS) and virtual (VSZ) memory usage
# by process and by user, repeats measurements periodically,
# and appends results to a CSV file so data persists across runs.
# ------------------------------------------------------------

# Confirm that the Linux ps command is available.
if (-not (Get-Command ps -ErrorAction SilentlyContinue)) {
    Write-Error "The 'ps' command was not found. This script must run in the CS 646 Linux container."
    exit 1
}

# Make sure the output directory exists.
$csvDirectory = Split-Path -Parent $CsvPath
if ($csvDirectory -and -not (Test-Path $csvDirectory)) {
    New-Item -ItemType Directory -Path $csvDirectory -Force | Out-Null
}

Write-Host ""
Write-Host "==============================================="
Write-Host "          CS 646 MEMORY AUDIT"
Write-Host "==============================================="
Write-Host "Samples:            $Samples"
Write-Host "Interval:           $IntervalSeconds second(s)"
Write-Host "CSV output:         $CsvPath"
Write-Host "Anomaly threshold:  $AnomalyThresholdMB MB RSS"
Write-Host ""

for ($sample = 1; $sample -le $Samples; $sample++) {

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

    # --------------------------------------------------------
    # PROCESS MEMORY COLLECTION
    # ps reports:
    #   RSS = resident set size in KiB (physical memory)
    #   VSZ = virtual memory size in KiB
    # --------------------------------------------------------
    $rawProcesses = & ps -eo pid=,user=,comm=,rss=,vsz=

    $processData = foreach ($line in $rawProcesses) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $parts = ($line.Trim() -split '\s+', 5)

        if ($parts.Count -lt 5) {
            continue
        }

        $pidValue  = 0
        $rssKB     = 0.0
        $vszKB     = 0.0

        if (-not [int]::TryParse($parts[0], [ref]$pidValue)) {
            continue
        }

        if (-not [double]::TryParse($parts[3], [ref]$rssKB)) {
            continue
        }

        if (-not [double]::TryParse($parts[4], [ref]$vszKB)) {
            continue
        }

        $rssMB = [math]::Round($rssKB / 1024, 2)
        $vszMB = [math]::Round($vszKB / 1024, 2)

        $status = if ($rssMB -ge $AnomalyThresholdMB) {
            "HIGH MEMORY"
        }
        else {
            "Normal"
        }

        [PSCustomObject]@{
            Timestamp  = $timestamp
            Sample     = $sample
            PID        = $pidValue
            User       = $parts[1]
            Process    = $parts[2]
            RSS_MB     = $rssMB
            VSZ_MB     = $vszMB
            Status     = $status
        }
    }

    # --------------------------------------------------------
    # PROCESS-LEVEL REPORT
    # Shows the processes using the most physical memory first.
    # --------------------------------------------------------
    Write-Host "===== SAMPLE $sample of $Samples : $timestamp ====="
    Write-Host ""
    Write-Host "MEMORY BY PROCESS"
    Write-Host "-----------------"

    $processData |
        Sort-Object RSS_MB -Descending |
        Select-Object PID, User, Process, RSS_MB, VSZ_MB, Status |
        Format-Table -AutoSize

    # --------------------------------------------------------
    # USER-LEVEL REPORT
    # Groups all processes owned by the same user and totals
    # their physical and virtual memory usage.
    # --------------------------------------------------------
    $userSummary = $processData |
        Group-Object User |
        ForEach-Object {
            [PSCustomObject]@{
                User          = $_.Name
                Processes     = $_.Count
                Total_RSS_MB  = [math]::Round(($_.Group | Measure-Object RSS_MB -Sum).Sum, 2)
                Total_VSZ_MB  = [math]::Round(($_.Group | Measure-Object VSZ_MB -Sum).Sum, 2)
            }
        } |
        Sort-Object Total_RSS_MB -Descending

    Write-Host ""
    Write-Host "MEMORY BY USER"
    Write-Host "--------------"

    $userSummary |
        Format-Table User, Processes, Total_RSS_MB, Total_VSZ_MB -AutoSize

    # --------------------------------------------------------
    # ANOMALY REPORT
    # Flags any process whose RSS meets or exceeds the chosen
    # threshold. This is a simple stretch feature.
    # --------------------------------------------------------
    $anomalies = $processData | Where-Object { $_.Status -eq "HIGH MEMORY" }

    Write-Host ""
    Write-Host "ANOMALY CHECK"
    Write-Host "-------------"

    if ($anomalies) {
        $anomalies |
            Sort-Object RSS_MB -Descending |
            Select-Object PID, User, Process, RSS_MB, Status |
            Format-Table -AutoSize
    }
    else {
        Write-Host "No processes exceeded $AnomalyThresholdMB MB RSS."
    }

    # --------------------------------------------------------
    # PERSISTENT CSV OUTPUT
    # Append is used so measurements from previous runs remain.
    # Export-Csv adds the header only when the file is new.
    # --------------------------------------------------------
    if (Test-Path $CsvPath) {
        $processData | Export-Csv -Path $CsvPath -NoTypeInformation -Append
    }
    else {
        $processData | Export-Csv -Path $CsvPath -NoTypeInformation
    }

    Write-Host ""
    Write-Host "Saved sample $sample to $CsvPath"

    # Wait before the next sample unless this was the final one.
    if ($sample -lt $Samples) {
        Write-Host "Waiting $IntervalSeconds second(s) for the next sample..."
        Write-Host ""
        Start-Sleep -Seconds $IntervalSeconds
    }
}

Write-Host ""
Write-Host "==============================================="
Write-Host "Memory audit complete."
Write-Host "Persistent data file: $CsvPath"
Write-Host "==============================================="
