# IVerify | Engineering Reconstruction R1

**Conceptual, source-informed reconstruction** of the Spring 2026 IVerify student capstone project. **Not** the original team CAD, functioning occlusion detector, or a clinically validated medical device.

The archived project aimed to detect possible flow restrictions in gravity-fed IV tubing using external mechanical preload, force sensing, analog threshold detection, microcontroller supervision, and a status indicator. The documented bench prototype used two LEDs. The three-LED indicator and detachable-jaw construction here are **conceptual upgrades/assumptions**.

## Available files in this repository

| File | Description |
|---|---|
| [CAD STEP assembly](cad/IVerify_Concept_Assembly.step) | Nine-solid 3D reference concept, importable into FreeCAD, Fusion 360, SolidWorks |
| [Parametric CAD script](cad/iverify_cad.py) | CadQuery Python source used to generate the STEP and individual STL files |
| [OpenSCAD visualization](cad/assembly_preview.scad) | Exploded/assembled preview, requires STLs generated locally |
| [Engineering design basis](docs/RECONSTRUCTION_NOTES.md) | Documented original specifications, reconstruction assumptions, and verification plan |
| [Validation metadata](docs/VALIDATION.json) | STEP import and geometry checks from the generated R1 package |

### Recreate CAD parts and STLs

Install Python and [CadQuery](https://cadquery.readthedocs.io/), then run:

```bash
cd projects/iverify/cad
python iverify_cad.py
```

This produces the assembly STEP, assembly STL and separate STLs for all nine solids. To preview, open `assembly_preview.scad` in OpenSCAD after generating the STLs.

## Source vs reconstruction

Original capstone documentation describes a spring-loaded force sensor and clamp, but no precise CAD dimensions were recoverable. This reconstruction assumes 3.0 mm tubing and an invented two-part jaw (46 x 30 x 18 mm). It includes placeholder sensor and electronics shapes. **There is no modeled functional preload mechanism or validated occlusion classification.** Dimensions must be verified against actual hardware before fabrication.

See [reconstruction notes](docs/RECONSTRUCTION_NOTES.md) for detailed assumptions, evidence status, and proposed bench testing.

## Ethics, attribution, and publication

Developed later as an AI-assisted educational reconstruction informed by team documents. It is **not the original 2026 CAD** and is not to be credited as the original mechanical designer's work. The original team reports and raw data are intentionally omitted from this public repository.

**Not for patient use, IV therapy, or clinical decision making.**
