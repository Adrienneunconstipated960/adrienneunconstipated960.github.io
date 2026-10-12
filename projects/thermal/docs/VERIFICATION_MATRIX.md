# Thermal Controller & Logger | Recovery verification matrix

All device-dependent tests below are **not executed** during this recovery pass. A checked source-inspection item means code exists, not that real hardware performance has been verified.

| ID | Subsystem | Procedure | Evidence required | Status |
|---|---|---|---|---|
| T01 | Startup | Launch `py main_ui.pyw` on target Windows computer | GUI opens; no import or DLL errors | Not run |
| T02 | Hardware detection | Connect Pico TC-08 and check successful unit open and close | Driver/device identifier, no crash | Not run |
| T03 | Sensor channels | Exercise each populated channel 1-8 with known temperature stimuli | Channel mapping and temperatures | Not run |
| T04 | Cold junction | Compare optional CH0 to device expected CJ behavior | Numeric output and vendor reference | Not run |
| T05 | Cadence | Compare actual timestamped observations to nominal 1 s scheduler | External or instrumented timing measurements | Not run |
| T06 | Long-duration stability | Run sustained acquisition for intended duration | CSV continuity, UI responsiveness and memory | Not run |
| T07 | Trend algorithm | Inject controlled sequences into an isolated test environment | Correct rolling range and delta | Not run |
| T08 | Metadata | Log test name, operator, fixture and notes | CSV preamble exactly matches input | Not run |
| T09 | CSV export | Record channels and stop | Readable nonempty CSV, correct columns and count | Not run |
| T10 | Excel export | Generate workbook with `openpyxl` | Column mapping and intact values | Not run |
| T11 | Arduino transport | Use known-good serial firmware, 9600 baud | SET and AMB commands, valid replies | Not run |
| T12 | Setpoint steps | Configure a short nonhazardous stepped schedule | Verified sequence, dwell times and final stop | Not run |
| T13 | Fault response | Disconnect TC-08 or invalid ambient input in a safe bench setup | Clear errors and appropriate actuator state | Not run |
| T14 | Calibration | Compare temperatures to traceable reference over range | Calibrated error and uncertainty budget | Not run |
| T15 | Safety | Verify heater limits, wiring, fuse, watchdog and safe shutdown | Independent electrical/thermal inspection | Not run |
| T16 | Offline CSV audit | Run isolated synthetic tests of recovery audit script | 4 passing Python unit tests | **Passed, synthetic** |

## Acceptance criteria pending real hardware

Do not claim instrument accuracy, sampling rate or controller stability before numerical acceptance thresholds are established by the project owner and measured on the actual configuration. Vendor software/hardware and heater safety must be checked before an unattended run.

## Physical test record template

For each new run record: date, instrument model/serial and firmware, TC-08 driver version, Python version, channel-to-probe mapping, reference thermometer calibration, ambient/controller configuration, run start/stop UTC timestamps, verification script version, actual CSV/XLSX artifacts, results, deviations and engineer approval.

No synthetic measurements should be presented as 2025–2026 experimental evidence.
