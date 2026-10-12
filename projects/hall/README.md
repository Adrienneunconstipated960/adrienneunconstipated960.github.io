# Hall-Effect Wafer Measurements | Engineering Recovery

**Project 12 / 16 | EE421 Lab 2 | December 7, 2025**

This is a source-informed reconstruction of the semiconductor transport analysis from the original five-page **EE421 Lab 2: Hall Measurements** report. The report survives in the user's private archive. The engineering utilities and figures published here are new work. The original M91 FastHall/MeasureLINK raw data and exported plots were not recovered.

## What is verified from the original report

The report documents:
- M91 FastHall Measurement Controller, Van der Pauw stage, electromagnet, and MeasureLINK software.
- Contact verification, four-contact resistivity measurement, magnetic field application, and Hall transport characterization.
- Reported values: resistivity **11 ± 177 mΩ (unit written exactly this way)**, carrier concentration **(1.99 ± 3.04) × 10^15 cm^-3**, mobility **(2.90 ± 4.62) × 10^5 cm²/(V·s)**, and **15 n-type / 15 p-type classifications**.

The uncertainty exceeds each central estimate. The carrier-type counts are evenly split, and the report does **not** provide a defensible dominant carrier sign or verified doping classification. The resistivity unit in the conclusion is dimensionally ambiguous: bulk resistivity requires a length unit, for example Ω·cm.

## Reconstructed engineering files

| File | Purpose |
|---|---|
| [Wafer setup diagram](visuals/wafer_setup.svg) | Conceptual four-contact wafer and measurement hardware |
| [Reported values figure](visuals/reported_results.svg) | Clear display of historical nominal values and their large uncertainties |
| [Reported results CSV](data/reported_results.csv) | Transcription of **published summary values, not raw M91 data** |
| [Hall analysis Python](analysis/hall_analysis.py) | Numerical Van der Pauw equation, resistivity, Hall coefficient, one-carrier density and Hall mobility |
| [Calculator tests](analysis/test_hall_analysis.py) | Seven synthetic equation/units checks |
| [Theory and dimensional checks](docs/THEORY.md) | Derivation, geometry assumptions and dimensional consistency |
| [Uncertainty and source limitations](docs/SOURCE_AND_UNCERTAINTY.md) | Careful handling of questionable units, results and provenance |
| [Verification matrix](docs/VERIFICATION.md) | What is numerically checkable versus missing hardware evidence |

## Use the calculator

Requires Python 3.10+ only. The default mode prints the **historical report summary** and a clearly labeled derived nominal consistency check:

```bash
python projects/hall/analysis/hall_analysis.py
```

For a **new** measurement, supply **all six** raw inputs:

```bash
python projects/hall/analysis/hall_analysis.py --ra-ohm 1 --rb-ohm 1 --thickness-mm 0.1 --hall-voltage-uv -10 --current-ma 1 --field-tesla 0.5
```

The values in that command are **synthetic demonstration inputs, not original wafer data**. This function computes under a simplified single-carrier Van der Pauw model; it does not reproduce the M91 device's uncertainty model or calibration.

To run tests:

```bash
cd projects/hall/analysis
python -m unittest -v
```

## Integrity and limitations

Do not interpret an uncertainty range extending below zero as a physical negative carrier concentration or resistivity. It indicates poor constraint under a symmetric error expression. The reported sign counts do not prove the wafer was undoped or intrinsic. Cross-checking the reported nominal n and μ gives roughly **0.0108 Ω·cm** resistivity, numerically close to **11 mΩ·cm**, but this does **not** establish whether the original missing 'cm' is a typographical error.

**Original raw files, individual readings, wafer thickness, contact resistances, Hall voltage, magnetic field values, and calibration outputs were unavailable.** No traces, statistics, device values, or measurement accuracy were fabricated.

Back to [Hall-effect project page](../hall.html).
