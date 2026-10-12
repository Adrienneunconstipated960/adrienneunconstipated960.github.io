#!/usr/bin/env python3
"""Offline QA summary for exported Thermal Logger CSV files.

R1 recovery utility, separate from the original acquisition application.
Reads existing exports without requiring the Pico TC-08, Arduino, or proprietary data.
It never alters the input file and cannot establish sensor accuracy or sample timing.
"""

from __future__ import annotations

import argparse
import csv
import json
import math
import statistics
from pathlib import Path
from typing import Any


def _number(value: str) -> float | None:
    try:
        n = float(value)
    except (ValueError, TypeError):
        return None
    return n if math.isfinite(n) else None


def audit_csv(path: Path, window: int = 10, band_c: float = 3.0) -> dict[str, Any]:
    """Summarize a logger CSV and the most recent window of available readings.

    A 'stable' window here means (maximum - minimum) <= band_c. This is
    identical in kind to the original display's range check, and is not
    an instrument calibration or scientifically validated stability criterion.
    """
    if window < 2:
        raise ValueError("window must be >= 2")
    if not (math.isfinite(band_c) and band_c > 0):
        raise ValueError("band_c must be finite and > 0")

    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.reader(handle))

    header_idx = next((i for i, row in enumerate(rows) if row and row[0].strip() == "Data_Sample"), None)
    if header_idx is None:
        raise ValueError("Missing Data_Sample header; not a recognized Thermal Logger export")

    header = rows[header_idx]
    temperature_cols = [(index, name) for index, name in enumerate(header) if name.endswith("_C")]
    if not temperature_cols:
        raise ValueError("No '_C' temperature columns found")

    histories: dict[str, list[float]] = {name: [] for _, name in temperature_cols}
    indices: list[int] = []
    malformed_rows = 0
    for row in rows[header_idx + 1:]:
        if not row or not any(cell.strip() for cell in row):
            continue
        try:
            index = int(row[0])
            if index <= 0:
                raise ValueError("sample index must be positive")
        except (ValueError, IndexError):
            malformed_rows += 1
            continue
        indices.append(index)
        for column_index, name in temperature_cols:
            value = _number(row[column_index]) if column_index < len(row) else None
            if value is not None:
                histories[name].append(value)

    result: dict[str, Any] = {
        "input_file": path.name,
        "source_type": "existing Thermal Logger CSV; provenance not independently verified",
        "sample_rows": len(indices),
        "malformed_rows": malformed_rows,
        "first_sample": indices[0] if indices else None,
        "last_sample": indices[-1] if indices else None,
        "nonconsecutive_sample_steps": sum((b - a) != 1 for a, b in zip(indices, indices[1:])),
        "window_points": window,
        "stability_band_c": band_c,
        "columns": {},
        "limitations": [
            "Sample numbers are not acquisition timestamps; actual sampling interval and drift are unknown.",
            "The rolling range check is descriptive only, not a verified instrument tolerance.",
            "Sensor calibration, hardware connection, tubing or thermal fixture conditions cannot be inferred from CSV alone."
        ]
    }
    for name, values in histories.items():
        if values:
            recent = values[-window:]
            result["columns"][name] = {
                "valid_values": len(values),
                "mean_c": round(statistics.fmean(values), 4),
                "min_c": round(min(values), 4),
                "max_c": round(max(values), 4),
                "sample_stdev_c": round(statistics.stdev(values), 4) if len(values) > 1 else None,
                "last_window_count": len(recent),
                "last_window_range_c": round(max(recent) - min(recent), 4),
                "last_window_delta_c": round(recent[-1] - recent[0], 4),
                "last_window_within_band": (max(recent) - min(recent) <= band_c) if len(recent) >= window else None,
            }
        else:
            result["columns"][name] = {"valid_values": 0, "last_window_within_band": None}
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_file", type=Path, help="Existing logger CSV file")
    parser.add_argument("--window", type=int, default=10, help="Last N valid points (default: 10)")
    parser.add_argument("--band-c", type=float, default=3.0, help="Range limit in degrees C (default: 3)")
    parser.add_argument("--output", type=Path, help="Save JSON summary to this path; otherwise print to stdout")
    args = parser.parse_args()
    data = json.dumps(audit_csv(args.csv_file, args.window, args.band_c), indent=2) + "\n"
    if args.output:
        args.output.write_text(data, encoding="utf-8")
        print(f"Saved {args.output}")
    else:
        print(data, end="")


if __name__ == "__main__":
    main()
