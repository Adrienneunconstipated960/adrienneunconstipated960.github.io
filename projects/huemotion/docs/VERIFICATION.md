# HueMotion | Recovery and verification matrix

| ID | Requirement or property | Evidence | Recovery status |
|---|---|---|---|
| HM01 | Original source exists | Public `server.casambi.js` + README | Recovered |
| HM02 | Original manual exists | `HueMotion_Manual.pdf` in original repository | Located, not independently validated |
| HM03 | Existing demo video preserved | Portfolio page `../assets/huemotion-demo.mp4` | Linked on page; playback not independently verified |
| HM04 | Eight gesture-to-scene mappings | Original client + server allowlist | Verified by source inspection |
| HM05 | Client stabilization thresholds | Original `stabilizeGesture` | Verified by source inspection |
| HM06 | 2,500 ms trigger cooldown | Original browser logic | Verified by source inspection |
| HM07 | 750 ms Off hold and post-scene blocks | Original browser logic | Verified by source inspection |
| HM08 | Isolated gesture policy checks | 11 authored Node test scenarios, executed via JS assertion harness | Passed, synthetic |
| HM09 | MediaPipe camera recognition | Real webcam/gesture test | Not rerun |
| HM10 | Measured false positives and accuracy | Labeled real gesture data | Not available |
| HM11 | Preview color channel rendering | Real browser UI interaction | Not rerun |
| HM12 | Actual Casambi scene change | Authorized network and fixture | Not rerun |
| HM13 | Server endpoint authentication | Original server source | Not implemented (security gap) |
| HM14 | Server-side timing and repeat protection | Original server source | Not implemented (security gap) |
| HM15 | Remote API/session robustness | Fault/reconnect testing | Not rerun |
| HM16 | Supply chain / vulnerability check | Lockfile, updated dependency audit | Not conducted |
| HM17 | Prevent future `.env` source commits | New original-repo `.gitignore` | Added, existing tracked files unaffected |

Eleven synthetic test scenarios executed successfully with an assertion shim against the published reconstruction module; the repository includes a `node:test` suite for normal Node execution. These results are **not** tests of the original webcam gesture classifier or the real Casambi bridge.
