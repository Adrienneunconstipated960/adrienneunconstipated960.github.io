# Two-port 12-term SOLT reconstruction plan

**Not an implemented calibration solver.** The website describes a 12-term SOLT calibration workflow, but the original calibration kit model, standards measurements, firmware/SCPI sequences and solver code were not recovered. This document defines the work needed to rebuild that part faithfully.

## Reported principle

A conventional two-port **12-term error model** describes systematic forward and reverse measurement errors. In each direction it accounts for quantities commonly termed directivity, source match, reflection tracking, load match, transmission tracking and isolation. These corrections depend on frequency and the measurement setup. The terms cannot be reliably recreated using only an S2P DUT file.

SOLT calibration uses characterized **Short, Open, Load and Thru** standards with appropriate port connections and kit definitions. A real open is not simply +1 and a real short not simply -1 at every frequency; parasitics and delay may matter over 6 GHz.

## Information needed before writing original-equivalent calibration code

1. Exact two-port VNA manufacturer and model, available SCPI/USB/VISA transport and MATLAB version/toolboxes.
2. Calibration kit part number, reference impedance, open capacitance, short inductance, delay, load match and frequency range, or certified standards file.
3. Standard-connection order for both ports and thru path, plus optional isolation measurement procedure.
4. Raw complex error-standard data at every frequency, in forward and reverse directions.
5. Port mappings, power, IF bandwidth, sweep points, averaging, temperature and test-cable stability.
6. Reference DUT measurements and independently verified instrument calibration to cross-check results.
7. The original scripts, lab report, figures, or calibration logs if available.

## Proposed staged implementation

- **Stage A, done:** Build offline S2P importer, correctly implement SI frequency conversion and RI/MA/DB, derive return loss, VSWR and complex input impedance. Unit test with *synthetic* values.
- **Stage B, not done:** Identify original VNA/kit, confirm remote-control transport and save raw, uncorrected standards separately from calibrated DUT records.
- **Stage C, not done:** Implement and numerically validate the appropriate forward/reverse calibration equations against a trusted commercial VNA export or RF Toolbox/reference implementation.
- **Stage D, not done:** Verify calibration using a known attenuator, mismatched load and thru; compare S11/S21 and repeat after reconnection.
- **Stage E, not done:** Reconstruct the original MATLAB GUI/automation and correlate results with archived original figures where available.

## Safety and engineering provenance

Never label the synthetic `examples/synthetic_twoport.s2p` file as real RF data. The nominal 100 MHz to 6 GHz range in the portfolio is historical project scope, not proof of a specific instrument's calibrated range. Do not fabricate calibration constants, trace plots, or test outcomes.
