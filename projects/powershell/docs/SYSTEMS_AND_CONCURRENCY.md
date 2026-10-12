# Systems engineering: data integrity and concurrency

## Inventory and container boundary

The Lab 1 report describes using PowerShell running **inside a Debian Linux course container**, while calling Linux tools and kernel interfaces. `nproc`, `/proc/cpuinfo`, `free`, `df`, `ip`, and `dpkg-query` can provide useful observations; they do not necessarily describe exclusively allocated hardware. Containers share the Linux kernel, and host-wide or differently namespaced readings can be misleading. Check cgroup CPU quota in `cpu.max` and memory limits in `memory.max` when interpreting capacity.

## CSV sorting and file integrity

A sorting operation must reorder **complete records**, not sort each field independently. The original Lab 2 report used `Import-Csv`, `Sort-Object`, `Export-Csv`, new-output-only writing, file count validation and SHA256 before/after on the input. It also described stable ties, numeric-aware comparisons and malformed records in separate tests.

Hash equality from a before/after file check is evidence that the input bytes did not change during that run; it does not by itself show every output record was preserved. Verify output fields, record counts, and stable ordering separately. A CSV parser must correctly handle embedded commas inside quoted fields. Malformed rows should be quarantined with a documented policy rather than silently repaired.

The **new basic** `safe-sort-reconstruction.ps1` implements string sorting of complete imported objects with `-Stable`; it intentionally does **not** reproduce the original numeric-aware extension or strict malformed-row rejection. Its status is unexecuted in this recovery environment.

## Bounded concurrency and synchronization

Lab 3 reports **102** web requests across three services with `ForEach-Object -Parallel -ThrottleLimit 10`. Safe shared-log appends required synchronization; the report used `flock` in a multi-writer test. File locks protect an append's critical section; they do not order records by request number. Task start/end times and thread evidence help substantiate overlap. CPU-bound parallelism and I/O-bound concurrency are separate performance mechanisms.

For a read-modify-write shared counter, the sequence `read -> increment -> write` must be atomic with respect to competing workers. The original lab observed a final value of 2 after 100 **unlocked** operations, and 100 after locking. The chart is an authentic **reported outcome**, not newly collected task data.

Historical performance computations:

| Comparison | Durations | Derived ratio |
|---|---|---|
| 300,000-row sorter | 10.04 s / 7.19 s | **1.396×** faster |
| 102-request workload | 8.69 s / 1.68 s | **5.173×** faster |
| Throttled run under CPU restriction | 4.39 s / 2.89 s | **1.519×** slower with one CPU, from a separate test |

These are simple ratios, not confidence intervals or universally reproducible speedups. The source does not provide enough repetitions or underlying data to assess benchmark variation.

## New local concurrency reference

`bounded-concurrency-demo.ps1` runs synthetic local waits using runspaces and a .NET monitor lock for one-process append protection. It **does not** recreate the original HTTP workload and has not been executed here. A mutex or `flock` mechanism would be needed for truly separate processes, with appropriate deadlock and error cleanup.

## Runtime and auditing

On an authorized lab machine: record PowerShell version, CPU count and quota, process/thread snapshots (`ps -L`), context switches from `/proc`, `strace` for I/O and clones, wall-clock timing, repeated trials and the exact input data hash. Do not describe one timing comparison as a calibrated performance benchmark.
