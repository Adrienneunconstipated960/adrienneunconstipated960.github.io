# Verification and recovery status

| Test ID | Description | Status / evidence |
|---|---|---|
| OS01 | Original student Lab 1 report | Recovered privately |
| OS02 | Original student Lab 2 report | Recovered privately |
| OS03 | Original student Lab 3 report | Recovered privately |
| OS04 | Original student Lab 4 report | Recovered privately |
| OS05 | Original Lab 4 PowerShell script | **Recovered and published** as `original/memory-audit.ps1` |
| OS06 | Original Labs 1–3 `.ps1` sources | Not located; do not label replacements as original |
| OS07 | Historical timing values transcribed | Lab 2 and Lab 3 reports; raw benchmark logs missing |
| OS08 | Sorting and concurrency speedup calculations | **Reconstructed, 10 synthetic tests passed** |
| OS09 | Reference stable row sorting | Synthetic object/record integrity test passed; no original CSV processing |
| OS10 | New PowerShell CSV sort reference | **Not executed**; PowerShell runtime unavailable |
| OS11 | New PowerShell local concurrency demo | **Not executed**; PowerShell runtime unavailable |
| OS12 | Original PowerShell memory audit execution | **Not rerun**; course container and raw outputs unavailable |
| OS13 | 300,000-row benchmark reproduction | Not rerun; original source/dataset unavailable |
| OS14 | 102-request benchmark reproduction | Not rerun; network conditions, scripts, responses/log unavailable |
| OS15 | 100-increment race reproduction | Not rerun; no original counter artifact |
| OS16 | Memory time-series and PSS analysis | Original output CSV absent; no measurements constructed |

## Reproducible verification commands

~~~bash
node projects/powershell/analysis/lab_results_audit.cjs
node --test projects/powershell/analysis/lab_results_audit.test.cjs
~~~

The tests passed in a JavaScript assertion harness in the recovery environment. They check arithmetic, preserved record objects, historic reported constants, and invalid arguments. **They do not execute PowerShell or validate the operating system's concurrency behavior.**

Future PowerShell testing should use a clean, pinned CS646 container or a compatible Linux PowerShell 7 installation. Capture version, test input checksums, runtime stderr/stdout, output hashes and process metrics, then update this matrix. Avoid uploading personal process listings or usernames without reviewing privacy.
