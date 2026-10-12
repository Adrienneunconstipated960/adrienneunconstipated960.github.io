#!/usr/bin/env python3
"""Hall / Van der Pauw recovery calculator.

Reconstructed analysis code based on documented EE421 laboratory methodology.
Does NOT recreate the original M91/FastHall raw data or uncertainty budget.
Standard library only; units checked explicitly.
"""
from __future__ import annotations

import argparse
import json
import math

Q_COULOMB = 1.602176634e-19


def van_der_pauw_sheet_resistance(r_a_ohm: float, r_b_ohm: float) -> float:
    """Solve exp(-pi Ra/Rs)+exp(-pi Rb/Rs)=1 using bisection."""
    if not all(math.isfinite(x) and x > 0 for x in (r_a_ohm, r_b_ohm)):
        raise ValueError("Both Van der Pauw resistances must be positive and finite")
    low = 0.0
    high = max(r_a_ohm, r_b_ohm) * 100.0
    for _ in range(180):
        mid = (low + high) / 2.0
        if mid == 0:
            raise ValueError("Resistance underflow")
        f = math.exp(-math.pi * r_a_ohm / mid) + math.exp(-math.pi * r_b_ohm / mid) - 1
        if f > 0:
            high = mid
        else:
            low = mid
    return (low + high) / 2.0


def characterize(
    r_a_ohm: float,
    r_b_ohm: float,
    thickness_mm: float,
    hall_voltage_uv: float,
    current_ma: float,
    magnetic_field_t: float,
) -> dict:
    """Calculate sheet resistance, resistivity, signed Hall coefficient and mobility.

    For conventional sign orientation, negative RH indicates electrons and
    positive RH holes. Reversed lead/field orientation reverses apparent sign.
    """
    measurements = (thickness_mm, current_ma, magnetic_field_t, hall_voltage_uv)
    if not all(math.isfinite(x) for x in measurements):
        raise ValueError("Inputs must be finite")
    if thickness_mm <= 0 or current_ma == 0 or magnetic_field_t == 0 or hall_voltage_uv == 0:
        raise ValueError("Thickness and Hall voltage must be nonzero; thickness positive; current and field nonzero")
    rs = van_der_pauw_sheet_resistance(r_a_ohm, r_b_ohm)
    thickness_m = thickness_mm * 1e-3
    rho_ohm_m = rs * thickness_m
    rho_ohm_cm = rho_ohm_m * 100
    vh_v = hall_voltage_uv * 1e-6
    current_a = current_ma * 1e-3
    hall_m3_per_c = vh_v * thickness_m / (current_a * magnetic_field_t)
    carrier_cm3 = 1 / (Q_COULOMB * abs(hall_m3_per_c)) / 1e6
    mobility_cm2_vs = (abs(hall_m3_per_c) / rho_ohm_m) * 1e4
    return {
        "input_ra_ohm": r_a_ohm,
        "input_rb_ohm": r_b_ohm,
        "thickness_mm": thickness_mm,
        "sheet_resistance_ohm_per_square": rs,
        "resistivity_ohm_cm": rho_ohm_cm,
        "hall_coefficient_m3_per_C": hall_m3_per_c,
        "majority_carrier_concentration_cm_minus3": carrier_cm3,
        "hall_mobility_cm2_per_Vs": mobility_cm2_vs,
        "hall_coefficient_sign": "positive" if hall_m3_per_c > 0 else "negative",
        "carrier_sign_interpretation": ("p-like, subject to wiring/field orientation" if hall_m3_per_c > 0 else "n-like, subject to wiring/field orientation"),
        "provenance": "CALCULATED from user-supplied measurements, not recovered original raw data",
        "limitations": "Single-carrier, thin isotropic sample and valid Van der Pauw contacts assumed. No Hall factor or uncertainty propagation applied.",
    }


def reported_summary() -> dict:
    """Transcribe historical conclusion without inventing raw values."""
    n = 1.99e15
    mu = 2.9e5
    return {
        "origin": "EE421 Lab 2: Hall Measurements, 2025-12-07, conclusion page 5",
        "resistivity": {"central": 11, "uncertainty": 177, "unit_as_written": "mOhm", "note": "Bulk resistivity needs a length unit; original report ambiguous"},
        "carrier_concentration": {"central": n, "uncertainty": 3.04e15, "unit": "cm^-3"},
        "hall_mobility": {"central": mu, "uncertainty": 4.62e5, "unit": "cm^2/(V*s)"},
        "classification_counts": {"n_type": 15, "p_type": 15},
        "rho_implied_by_nominal_n_mu_ohm_cm": 1 / (Q_COULOMB * n * mu),
        "warning": "Reported uncertainties exceed central estimates; counts do not demonstrate intrinsic or undoped material. Raw observations and uncertainty method unavailable.",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ra-ohm", type=float)
    parser.add_argument("--rb-ohm", type=float)
    parser.add_argument("--thickness-mm", type=float)
    parser.add_argument("--hall-voltage-uv", type=float)
    parser.add_argument("--current-ma", type=float)
    parser.add_argument("--field-tesla", type=float)
    parser.add_argument("--output")
    args = parser.parse_args()
    keys = ("ra_ohm", "rb_ohm", "thickness_mm", "hall_voltage_uv", "current_ma", "field_tesla")
    entered = [getattr(args, key) for key in keys]
    if any(x is not None for x in entered):
        if not all(x is not None for x in entered):
            parser.error("Provide all six measured inputs for a new calculation, or none for historical summary")
        result = characterize(*entered)
    else:
        result = reported_summary()
    output = json.dumps(result, indent=2, allow_nan=False) + "\n"
    if args.output:
        from pathlib import Path
        Path(args.output).write_text(output, encoding="utf-8")
    else:
        print(output, end="")


if __name__ == "__main__":
    main()
