# DMX512 engineering calculations and source timing

This document is a **source-derived calculation**, not a packet capture, oscilloscope record or fixture characterization.

## DMX channel map

| DMX slot (array index) | Content |
|---|---|
| 0 | DMX start code, fixed 0 |
| 1 | R (red intensity) |
| 2 | G (green intensity) |
| 3 | B (blue intensity) |
| 4 | W (white intensity) |
| 5–512 | Unused, set to zero |

This particular firmware always writes all **513** bytes. It does not shorten the frame to five slots. The luminaire must be set to an appropriate DMX personality and start address, and the output must use a suitable differential DMX physical interface.

The code's `scaleValue` performs integer arithmetic:

```text
DMX_value = floor(base_channel_value * brightness_percent / 100)
```

For an active channel with base byte 255:

| Brightness | Output byte |
|---:|---:|
| 0% | 0 |
| 1% | 2 |
| 10% | 25 |
| 50% | 127 |
| 100% | 255 |

These are **digital DMX intensity values**. The fixture's PWM transfer function, photometry, electrical current and optical flux are not established by these numbers. See [derived output CSV](../data/calculated_scene_values.csv).

## Frame timing from the firmware

The Arduino calls `Serial1.begin(250000, SERIAL_8N2)`, so a transmitted byte occupies **1 start + 8 data + 2 stop = 11 bits**. Including 512 channels and one start code, serialization time is:

```text
t_slots = 513 slots * 11 bits/slot / 250000 bits/s
        = 0.022572 s = 22.572 ms
```

The firmware then specifies:

```text
BREAK   = 120 us
MAB     = 16 us
t_frame_min = 22.572 ms + 0.120 ms + 0.016 ms
            = 22.708 ms
```

Its main loop calls `delay(25)` after a frame:

```text
t_nominal_loop = 22.708 ms + 25 ms = 47.708 ms
f_nominal_loop ≈ 20.96 frames/s
```

The **~21 Hz** estimate excludes Serial1 reinitialization, parsing, computations, other runtime delays and physical measurement effects. It is not a verified DMX refresh rate.

`sendStableFrames(300)` and startup `sendStableFrames(3000)` send repeated frames synchronously. The latter also delays the ready message after boot.

## Firmware scene and animation logic

- `red`, `green`, `blue`, `white` assign one channel full-scale (255); `off` sets all to zero.
- `gradient` blends successive entries through Red, Yellow, Green, Cyan, Blue and Magenta, wrapping to Red. The configured interval is **3000 ms per transition**, or **18,000 ms** for six transitions at nominal software timing.
- `demo` chooses Red for the first **2500 ms**, then Green 2500 ms, Blue 2500 ms, White 2500 ms, a Gradient segment of **10,000 ms**, then Off, for a nominal **20-second** sequence.
- Actual transition times depend on how frequently `runDemo()` / `runGradient()` run. The original sketch increments a gradient step **once** when elapsed exceeds 3000 ms; it does not necessarily catch up multiple elapsed intervals after an interruption.

**Additional source caveat:** `runDemo()` initializes `lastEffectTime` when the entire demo starts, not when the 10-second gradient segment begins. On entering the gradient segment, `runDemoGradientSegment()` will normally see more than 3 seconds elapsed and increment `effectStep` once before calculating the color. Consequently, the firmware's first demo-gradient frame may begin at **Yellow**, rather than the Red first point of an idealized gradient-from-zero preview. This must be tested or fixed on hardware before claiming precise sequence fidelity.

The new standalone `dmx_reference.cjs` reproduces an idealized timeline and channel values for *offline testing*. It is not a bit-accurate microcontroller emulator. The reference utility intentionally starts its idealized demo-gradient phase at Red and does not reproduce this state-carryover behavior.

## Pin assignment from original code

```text
Arduino Mega TX1 = digital pin 18 (DMX TX)
DMX_ENABLE_PIN   = 2 (RS-485 drive enable, original code sets high)
LED_PIN          = 13 (status toggle)
Serial USB       = 115200 baud text commands
Serial1 DMX      = 250000 baud, 8 data, no parity, 2 stop
```

Validate wiring, termination, transceiver electrical levels, grounding/isolation and connector orientation against the exact shield and fixture datasheets before powering any real system.
