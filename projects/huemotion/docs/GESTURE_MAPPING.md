# Original HueMotion gesture mapping and timing

**Source inspection:** original public `server.casambi.js` gesture mapping and browser state logic. Source code is preserved separately. This table is **not** a test result from live RGBW hardware.

| Browser gesture name | Scene | Endpoint key | On-screen RGBW preview |
|---|---|---|---|
| `Heart` | Red | `r` | [100, 0, 0, 0] |
| `Crying` | Blue | `b` | [0, 0, 100, 0] |
| `Jazz hands` | Yellow | `y` | [100, 100, 0, 0] |
| `Open palm` | White | `w` | [0, 0, 0, 100] |
| `Thumbs Up` | Green | `g` | [0, 100, 0, 0] |
| `Peace Sign` | Purple | `p` | [100, 0, 100, 0] |
| `Shaka` | Gradient | `x` | Browser gradient cycling |
| `Fist` (Hold Fist) | Off | `o` | [0, 0, 0, 0] |

Each RGBW entry is **percentages** for [R, G, B, W] channels in the preview. A real Casambi scene is selected using private environment variables and may differ from the preview values. No scene IDs are published here.

## Original stabilization frame counts

| Raw gesture | Consecutive frames needed |
|---|---:|
| Default classified gesture | 4 |
| Unknown | 8 |
| Heart | 2 |
| Crying | 1 |
| Thumbs Up | 2 |
| Shaka | 3 |
| Fist | 3 |
| Fist following a stable Thumbs Up | 4 |
| Fist following a stable Crying | 5 |

These are *frame counts*, not times. Delay in milliseconds depends on actual frame rate and browser processing time.

## Original client-side send restrictions

- **Repeat trigger cooldown:** 2,500 ms when the same gesture was last sent.
- **Off hold:** Fist must remain the stable gesture for at least 750 ms before sending Off.
- **Off after recent Green:** Off blocked until at least 1,200 ms after the last triggered Thumbs Up.
- **Off after recent Blue:** Off blocked until at least 900 ms after the last triggered Crying.
- **Preview mode:** The browser does not initiate scene requests unless the Casambi option is enabled.
- **Important:** Holding a gesture past the cooldown can re-send the same scene; the code does not require a new state transition for every send.
- **Security:** None of these restrictions are rechecked by the Node HTTP endpoint. A direct request can bypass them.

The new isolated `analysis/gesture_policy.cjs` reconstructs these rules with a single monotonic clock for deterministic tests. The browser source uses `performance.now()` for the Fist stability duration and `Date.now()` for trigger timestamps. Do not claim the reconstructed model fully reproduces browser timing or MediaPipe classification accuracy.
