# Memory audit metrics and original recovered PowerShell source

**Original recovered code:** [memory-audit.ps1](../original/memory-audit.ps1). This script was found in the user's prior file archive and published as original code, unlike the new educational references in `reconstructed/`.

## Original script behavior

- Inputs: number of samples (default 5), sample interval in seconds (5), CSV path (`/work/memory-audit.csv`), and anomaly RSS threshold (150 MB).
- Uses Linux `ps -eo pid=,user=,comm=,rss=,vsz=` to collect process records; skip malformed lines.
- Converts `ps` resident and virtual sizes from KiB to MB using division by 1024, then logs Timestamp, Sample, PID, User, Process, RSS_MB, VSZ_MB and Status.
- Groups records by User and sums process RSS/VSZ for an aggregate summary.
- Uses an **absolute** `RSS_MB >= AnomalyThresholdMB` flag; it does not calculate trends or growth rates.
- Appends process sample rows to an existing CSV via `Export-Csv -Append`, otherwise creates the file. Samples are timestamped and additional runs append.
- Requires PowerShell inside a Linux environment with the `ps` tool. No original output CSV, individual memory readings or CLI execution results were recovered in this turn.

## Distinct memory concepts

| Metric | Meaning | Major limitation |
|---|---|---|
| VSZ or VmSize | Virtual address space mapped or reserved by process | Includes pages that may not be resident in physical RAM |
| RSS or VmRSS | Resident pages physically present | Shared pages counted in **every process** reporting them; sums overstate unique physical memory |
| PSS (from `/proc/PID/smaps_rollup`) | Resident shared pages divided proportionately among mapping processes | More representative attribution but may incur measurement overhead and still depends on accounting policy |
| cgroup memory.current | Memory currently charged to the container's memory cgroup | Not equivalent to summed process RSS/PSS or host-wide available RAM |
| cgroup memory.max | Limit on cgroup memory usage, if enforced | `max` means no limit via that setting, not infinite physical RAM |

**Example concept, not actual wafer or course measurement:** if two processes each map the same 10 MiB shared library and no private pages, they might each report approximately 10 MiB RSS, yielding 20 MiB when summed. Their proportional PSS contributions may each be 5 MiB, totaling 10 MiB. This demonstrates double-counting; kernel details and mapped pages affect reality.

### Considerations before use

- Do not use the script's per-user summed RSS as a billing figure without accounting for shared pages and cross-process attribution.
- `RSS_MB` and `VSZ_MB` fields are rounded to two decimals before aggregation, so totals may differ slightly from exact byte totals.
- The script has no built-in rotation, CSV schema evolution, duplicate run identification or automatic scheduled execution.
- The original command name `ps` works on Linux and is tested for presence; use the required Debian container or an equivalent environment, not generic Windows PowerShell.
- The user report discussed PSS and cgroup limits separately; **the recovered `.ps1` does not write PSS**.
- Source is preserved here, but PowerShell execution was unavailable in the recovery runtime. The student's original course report describes testing; this recovery did not rerun it.
