# VNA recovery log

**2026-10-11: initial recovery**.

## What can be confirmed
- The portfolio project [Virtual Network Analyzer](../../vna.html) describes a MATLAB-driven two-port VNA with S-parameter visualization and stated 100 MHz to 6 GHz analysis range.
- It explicitly describes **12-term SOLT calibration** as part of the original project approach.
- No corresponding GitHub project repository, original source code, standards data, instrument logs or original S2P measurement file was located in the repositories and ChatGPT library documents inspected during this pass.

## What was recreated
- New MATLAB base-language Touchstone analyzer and reflection-coefficient-plane plots.
- New Python offline analyzer, JSON summaries and unit tests.
- Artificial S2P training data with 100 MHz, 1 GHz, and 6 GHz records, labeled **SYNTHETIC**.
- RF equations, calibration recovery strategy, and separate source/test traceability documentation.

## What remains unavailable
- Original MATLAB instrument-control code and any GUI.
- VNA instrument model, remote-control commands and calibration-kit data.
- Measured S11, S21, S12, S22 results or raw DUT fixture information.
- Verified 12-term correction implementation and physical reference comparison.

Nothing in this new archive should be represented as recovered original calibration or a re-run of the 2025 measurements.
