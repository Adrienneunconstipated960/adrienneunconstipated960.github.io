# ProDriver Sim | Verification matrix

| ID | Check | Status | Evidence or outstanding requirement |
|---|---|---|---|
| P01 | Recovered source directory and available JSON files | Confirmed | Connected public ProDriver-Sim repo |
| P02 | Reconstructed interpolation at interior curve point | Synthetic test passed | Linear blend |
| P03 | Endpoint clamping for out-of-range lookup | Synthetic test passed | Never extrapolate silently |
| P04 | V × I and output/input power balance | Synthetic test passed | Independent reference calculator |
| P05 | 120 vs 277 V efficiency-curve selection | Synthetic test passed | Distinct synthetic curve values |
| P06 | Driver + module current violations | Synthetic test passed | Warnings do not change calculation |
| P07 | Invalid negative command current | Synthetic test passed | Reject invalid inputs |
| P08 | No efficiency tables | Synthetic test passed | Model 0.85 default |
| P09 | Duplicate curve input abscissa | Synthetic test passed | Reference checker rejects repeated x |
| P10 | Original Python CLI on real source | Not executed | Run both original and reference on same JSON inputs |
| P11 | PyQt6 GUI | Not executed | Interactive run, path handling and limit display |
| P12 | Driver efficiency vs calibrated bench input power | Not executed | Traceable power analyzer with uncertainty |
| P13 | Module V-I reference comparison | Not executed | Bench current sweep and thermal soak |
| P14 | Operating-limit enforcement | Not implemented | Source only reports issues, no automatic clipping |
| P15 | Grid voltage, thermal and AC loss modeling | Not implemented in current path | Require new requirements and code |

**Scope of reported test success:** Eight synthetic Python tests of the new independent calculation routine were exercised during recovery, not original app or hardware tests. The published test suite is for reproducibility. There are no claims of real driver performance confirmation.
