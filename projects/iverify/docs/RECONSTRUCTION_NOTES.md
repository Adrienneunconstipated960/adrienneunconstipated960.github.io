# IVerify R1 | Reconstruction design basis and verification needs

This directory documents an AI-assisted reconstruction informed by Spring 2026 IVerify/VeriFlow Systems team design reports and the capstone portfolio description.

## Project overview
- Proposed non-invasive clip-on accessory for post-drip-chamber gravity-fed IV tubing.
- External preload creates a reaction force on the tube, measured by a force sensor.
- Analog conditioning and two threshold comparators provide candidate restriction signals.
- Microcontroller supervises events and controls a visual indicator.
- Original bench prototype used **two LEDs**. Three colored LEDs in this CAD show a future product concept, not hardware that was built or clinically evaluated.

## Original project specifications (targets, not validated outcomes)
| Parameter | Specified |
|---|---|
| Full-product tubing outer diameter | 3-5 mm |
| Reduced-prototype selected tubing diameter | 1-3 mm |
| Nominal preload | 5 N |
| Adjustable preload target | 3-8 N |
| Force-sensor range target | 0-20 N |
| Sampling target | >=50 Hz |
| Non-invasive installation | No puncture, cutting, or fluid contact |

## R1 CAD assumptions
| Item | Value | Status |
|---|---|---|
| Tube OD | 3.0 mm | assumed representative sample |
| Tube radial channel clearance | 0.20 mm | assumed |
| Fixed jaw | 34 x 30 x 18 mm | invented |
| Removable jaw | 12 x 30 x 18 mm | invented |
| Combined jaw envelope | 46 x 30 x 18 mm | invented |
| Cover fastener clearance | 3.4 mm | assumed M3 |
| Fixed-jaw pilot diameter | 2.5 mm | assumed |
| Plunger shaft diameter | 3.2 mm | invented |
| Spring cavity diameter | 4.0 mm | empty envelope only |
| Sensor and PCB | geometric placeholders | no component selected |

The original report's mechanical concept included a spring-loaded contact ring. The reconstructed clamshell-style jaw is a *new illustration*, not an exact replica of that physical design. The STEP assembly contains **nine** solids, including reference tubing, electronics, and indicators. It does not include a proven latch, actual spring, calibrated sensor, electrical interconnects, or usable tolerance stack-up.

## Preliminary spring example (not a selected spring)
A 5 N preload and 2 mm hypothetical working spring deflection would imply k = F/x = 2.5 N/mm for an idealized linear spring. This is only a sizing illustration. Geometry, preload adjustment, sensor overload, hysteresis, tubing strain, and clinical suitability remain unverified.

## Signal-chain concept
Tubing and preload -> external force sensor -> low-noise gain/filter -> candidate partial / occlusion threshold comparison -> microcontroller time supervision -> indicator.

Relative signal percentages in the original product specification require re-calibration. Whether force rises or falls with a restriction depends on the actual sensor, mounting, fluid system, and circuit. **Do not treat drafted thresholds as a clinically valid classifier.**

## Proposed verification checklist
1. Measure actual tubing OD, wall thickness, and contact-area compliance.
2. Confirm clamp installation without cutting, puncturing, leakage, or damage.
3. Record force-gauge preload measurements over repeated installations.
4. Select a sensor and characterize transfer function, noise, drift, hysteresis, and overload.
5. Measure amplifier/comparator response and threshold stability.
6. Validate firmware debounce, sample rate, fault states, tare, and reset.
7. Record normal, restricted, and occluded *benchtop* time series under controlled reference conditions.
8. Check handling artifacts, false indications, and variability across tubing.

## Attribution and public release
This work is a later AI-assisted reconstruction of a student team capstone. It is *not* recovered original CAD. The reconstruction does not claim to be the original mechanical designer's work. Original team reports and any unpublished measurements are excluded from this public repository.

**Safety:** Educational engineering reconstruction only. Not a regulated, clinically validated, or approved medical device. Not for use with patients or IV therapy.
