# DMX Controller | Recovery verification matrix

| ID | Test or evidence | Recovery status | Required evidence |
|---|---|---|---|
| DM01 | Original Flask application located | Recovered | `app.py` source |
| DM02 | Original Arduino sketch located | Recovered | `LUX_DMX_Controller_Working.ino` |
| DM03 | Sketch initial `fconst` corrected | Source fixed | `const int DMX_TX_PIN` now first declaration |
| DM04 | Flask default LAN exposure reduced | Source fixed | Defaults to `127.0.0.1` |
| DM05 | Serial port configurable | Source fixed | `DMX_ARDUINO_PORT` env override |
| DM06 | Scene name validation | Confirmed by inspection and offline model | Seven supported scenes |
| DM07 | Brightness validation, 0–100 | Confirmed by inspection and offline model | Range and new-line formatting |
| DM08 | RGBW slot order and frame length | Synthetic tests passed | 513 slots, start code zero, first four RGBW |
| DM09 | Brightness byte truncation | Synthetic tests passed | 255 at 1% = 2; 10% =25; 50% =127 |
| DM10 | Gradient keyframes and timing | Synthetic tests passed | Six-color nominal 3 s transitions |
| DM11 | Demo sequence transitions | Synthetic tests passed | 4 × 2.5 s + 10 s = 20 s |
| DM12 | DMX analytical timing | Synthetic tests passed | 22.708 ms frame + 25 ms loop delay |
| DM13 | New independent test suite | **13 passed, synthetic** | JavaScript assertion-harness, with `node:test` suite in repo |
| DM14 | Original Flask route integration | Not rerun | Mock serial and inspect HTTP status codes |
| DM15 | Arduino build and flashing | Not rerun | Compile/upload on board-supported IDE |
| DM16 | DMX packet electrical timing | Not rerun | Oscilloscope / DMX analyzer trace |
| DM17 | Real RGBW luminaire response | Not rerun | Device address and fixture mapping validation |
| DM18 | Brightness vs real electrical current | Not verified | Calibrated electrical instrumentation and fixture specification |
| DM19 | Access control for remote network use | Not implemented | Auth/CSRF controls required before deployment |

**Important:** 13 passing tests concern a new independent, offline calculation model. They are not evidence that Arduino firmware builds, actual DMX frames comply with timing standards, or a luminaire changed state.
