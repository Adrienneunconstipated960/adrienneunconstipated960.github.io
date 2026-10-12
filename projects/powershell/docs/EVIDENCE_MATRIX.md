# Source and reported-result matrix

**Original private sources:** `CS646_Lab1_Alarcon.pdf` (10 pages), `CS646_Lab2_Alarcon.pdf` (12 pages), `CS646_Lab3_Alarcon.pdf` (7 pages), `CS646_Lab4_Alarcon.pdf` (7 pages), and the original `memory-audit.ps1`. The reports are owned by the user and are not redistributed here.

| Lab | Source evidence | Result as reported | Status now |
|---|---|---|---|
| Lab 1 | Lab 1 pp. 2–3, 6–9 | CPU, memory, storage, OS, network and Debian package inventory; missing-tool handling | Original report recovered; original `inventory.ps1` not located |
| Lab 1 | Lab 1 p. 6 | 16 logical CPUs seen, 15 GiB reported, `cpu.max` = `max 100000`; `lspci` unavailable | Historical system observations, not present container resource reservations |
| Lab 2 | Lab 2 pp. 2–6 | Whole-record CSV sorting, multi-key Department/Name, stable ties, source SHA256 and append-only log | Report recovered; original sorter missing; new basic reference added |
| Lab 2 | Lab 2 pp. 7–8 | 300,000 records, serial 10.04 s; parallel 7.19 s | Reported benchmark only; underlying CSV and scripts not available |
| Lab 2 | Lab 2 pp. 8–10 | Quoted embedded comma accepted; short, long and unterminated-quote records rejected in a separate robust implementation | Original robust sorter not recovered; reference sorter must not be mistaken for it |
| Lab 3 | Lab 3 pp. 2–3 | 102 requests against example.com/org/net with `ForEach-Object -Parallel -ThrottleLimit 10`; shared log had 102 entries | Source report recovered; original `.ps1` script and log absent |
| Lab 3 | Lab 3 p. 3 | Serial 8.69 s, concurrent 1.68 s | Reported benchmark; speedup computed as 5.173× |
| Lab 3 | Lab 3 pp. 4–5 | `ps -L`, context switches, 258 clone/clone3 observations, normal 2.89 s vs single CPU 4.39 s | Historical OS observations not independently rerun |
| Lab 3 | Lab 3 p. 5 | 20 `flock` writers, 20 complete lines | Historical report; raw write logs unavailable |
| Lab 3 | Lab 3 pp. 5–6 | Unlocked counter 2, locked counter 100, target 100 | Historical race demonstration; not a new live test |
| Lab 4 | Lab 4 pp. 2–5, original `.ps1` | Repeated per-process RSS/VSZ, per-user grouping, per-run append-only CSV | **Original script recovered and published**; runtime and CSV not retested |
| Lab 4 | Lab 4 pp. 5–6 | `VmRSS`, `VmSize`, PSS and cgroup `memory.current` used in investigation | Methods documented; individual numeric values absent from report text |

## Discrepancies and limits

- Lab 3 conclusion contains a typo saying 10 requests, while design, test and detailed figures consistently specify **102**. The more extensively corroborated figure is used.
- Lab 4 report broadly mentions high or rapidly changing memory; the actual recovered script implements an **absolute RSS threshold** and a periodic CSV, not a rate-of-change anomaly detector.
- The Lab 2 source reports numeric-aware edge sorting (`2`, `9`, `09`, `10`, `100`) and robust malformed-row rejection in additional versions. The new `safe-sort-reconstruction.ps1` is deliberately a simpler string-sort demonstration and should **not** be claimed as the missing original extension.
- Lab 3 performance observations cannot be treated as CPU scaling results without controlling service latency and workload variability.
- Private student reports and screenshots are not republished; metric CSV contains **reported summaries only**.

See [verification status](VERIFICATION.md) before publishing claims of replicated results.
