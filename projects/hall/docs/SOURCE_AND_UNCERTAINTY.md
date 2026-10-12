# Source integrity, uncertainty and conclusions

**Source:** `423_LabProject2.pdf`, *EE421 Lab 2: Hall Measurements*, December 7, 2025, pp. 1–5. The original report remains private and is **not** copied into this public repository.

## Exact historical summary transcription

| Quantity | Central estimate | Reported uncertainty | Report wording |
|---|---:|---:|---|
| Resistivity | 11 | 177 | mΩ |
| Carrier concentration | 1.99 × 10¹⁵ | 3.04 × 10¹⁵ | cm⁻³ |
| Carrier mobility | 2.9 × 10⁵ | 4.62 × 10⁵ | cm²/(V·s) |
| Type counts | 15 n | 15 p | sign/classification counts |

**Important distinction:** The report refers to a resistivity, but prints **mΩ**, a resistance unit. Bulk resistivity should be Ω·m or Ω·cm. No correction to the source is assumed.

The original report describes the wafer as effectively undoped, but an equal 15:15 sign split with uncertainties larger than the nominal quantities is **not evidence** of an intrinsically undoped wafer. It could indicate noisy or polarity-sensitive data, measurement setup effects, or other causes that cannot be determined without raw data.

## Uncertainty

Reported relative uncertainties:
- Resistivity: 177 / 11 = **1609%**
- Carrier concentration: 3.04 / 1.99 ≈ **153%**
- Mobility: 4.62 / 2.90 ≈ **159%**

The statistical meaning of the `±` values is **not specified** by the summary: they could represent an instrument-reported standard deviation, spread, fit error or something else. They must not be labeled 1σ or 95% confidence intervals without an original data legend.

Symmetric error bars would cross zero for all three parameters. Physically, positive resistivity, concentration and mobility cannot be negative. This makes Gaussian linear uncertainty propagation and nominal-value material conclusions unreliable.

## Missing underlying records

- Raw Hall voltage vs. magnetic field or current traces, including reversed field/current direction.
- Original sample thickness, contact location, resistance (R_A/R_B), lead convention and contamination records.
- Controller measurement setup, current and magnet settings, instrument calibration logs and uncertainty computation.
- Sample part number, material and actual doping reference standard.

## Proper follow-up verification

Recheck four-point ohmic contact behavior and contact symmetry; repeat current reversal and both magnetic polarities to isolate offset; check wafer thickness and geometry; repeat across different sample positions; document calibration of the magnetic field and reference equipment. Report signed (R_H), sheet resistance, confidence methodology, and device uncertainties before claiming carrier type or doping concentration.

The newly created plots use **reported summary values only**, not inferred samples or fabricated raw instrument points.
