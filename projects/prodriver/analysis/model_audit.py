#!/usr/bin/env python3
"""Offline ProDriver calculation cross-check using archived JSON profiles.

New recovery utility, not original ProDriver code. Profile values are unverified;
outputs are predicted numbers, not measurements or safe driver settings.
"""
import argparse
import json
import math
from pathlib import Path


def interp(xs, ys, x):
    """Piecewise linear interpolation, clamped to the end points."""
    points = sorted((float(a), float(b)) for a, b in zip(xs, ys))
    if not points:
        return None
    if any(not math.isfinite(v) for pair in points for v in pair):
        raise ValueError("Non-finite curve point")
    if len({p[0] for p in points}) != len(points):
        raise ValueError("Duplicate curve x values")
    if x <= points[0][0]:
        return points[0][1]
    if x >= points[-1][0]:
        return points[-1][1]
    for (x0, y0), (x1, y1) in zip(points, points[1:]):
        if x0 <= x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    raise RuntimeError("Curve lookup failed")


def curve(profile, name, xkey, ykey, x):
    values = profile.get("curves", {}).get(name) or {}
    return interp(values.get(xkey, []), values.get(ykey, []), x)


def get(info, *names, default=None):
    return next((info[n] for n in names if info.get(n) is not None), default)


def evaluate(driver, module, current=None, input_v=120.0):
    """Reference to deterministic subset of original source's simulate() logic."""
    d, m = driver.get("info", {}), module.get("info", {})
    series, parallel = int(m.get("series_count") or 1), int(m.get("parallel_count") or 1)
    if min(series, parallel) < 1:
        raise ValueError("Series/parallel count must be positive")
    if current is None:
        current = get(m, "nominal_current", default=None)
        if current is None and m.get("nominal_current_per_led") is not None:
            current = float(m["nominal_current_per_led"]) * parallel
        if current is None:
            current = 0.5
    current, input_v = float(current), float(input_v)
    if not math.isfinite(current) or not math.isfinite(input_v) or current <= 0 or input_v <= 0:
        raise ValueError("Current and input voltage must be positive and finite")
    led_v = curve(module, "iv_curve_led", "current_amps", "volts_per_led", current / parallel)
    if led_v is None:
        led_v = get(m, "typical_voltage_per_led", "v_f", "vf")
    if led_v is not None:
        vout = float(led_v) * series
    else:
        total = get(m, "typical_voltage_total", "module_voltage", "v_module")
        if total is not None:
            vout = float(total)
        else:
            nominal = get(m, "typical_voltage", "typical_voltage_v", "typ_voltage")
            vout = float(nominal) * (series if series > 1 else 1) if nominal is not None else 0
    if vout <= 0:
        raise ValueError("No positive module voltage available")
    pout = vout * current
    max_power = float(get(d, "max_power", "pout_max", default=0))
    ep = curve(driver, "efficiency_vs_output_power", "power_w", "efficiency", pout)
    ev = curve(driver, "efficiency_vs_vout_277" if input_v >= 200 else "efficiency_vs_vout_120", "vout_v", "efficiency", vout)
    el = curve(driver, "efficiency_vs_load", "load_percent", "efficiency",
               min(150, max(0, 100 * pout / max_power))) if max_power > 0 else None
    candidates = [v for v in (ep, ev, el) if v is not None]
    if candidates:
        primary = ep if ep is not None else ev if ev is not None else el
        others = ([v for v in (ev, el) if v is not None] if ep is not None
                  else [el] if ev is not None and el is not None else [])
        weight = float(d.get("efficiency_blend_weight") or 1)
        estimate = ((primary * weight + sum(others) / len(others)) / (weight + 1)
                    if others and weight > 0 else sum(candidates) / len(candidates))
        eta = max(0.5, min(0.98, estimate))
    else:
        eta = 0.85
    issues = []
    bounds = [
        ("Input below minimum", input_v, get(d, "min_input_volts", "vin_min"), True),
        ("Input above maximum", input_v, get(d, "max_input_volts", "vin_max"), False),
        ("Output below minimum", vout, get(d, "min_voltage", "vout_min"), True),
        ("Output above maximum", vout, get(d, "max_voltage", "vout_max"), False),
        ("Output power above maximum", pout, get(d, "max_power", "pout_max"), False),
    ]
    for label, value, limit, low in bounds:
        if limit is not None and float(limit) > 0 and ((value < float(limit)) if low else (value > float(limit))):
            issues.append(label)
    module_limit = get(m, "max_current")
    if module_limit is None and m.get("max_current_per_led") is not None:
        module_limit = float(m["max_current_per_led"]) * parallel
    if module_limit is not None and current > float(module_limit):
        issues.append("Module current above maximum")
    if m.get("max_current_per_led") is not None and current / parallel > float(m["max_current_per_led"]):
        issues.append("LED string current above maximum")
    return {
        "driver": d.get("model") or d.get("brand") or "Unspecified",
        "module": m.get("model") or m.get("name") or "Unspecified",
        "input_voltage_V": input_v,
        "module_current_A": current,
        "module_voltage_V": vout,
        "output_power_W": pout,
        "estimated_efficiency": eta,
        "estimated_input_power_W": pout / eta,
        "issues": issues,
        "status": "OK" if not issues else "OUT_OF_RANGE",
        "provenance": "New source-informed reference calculation; profile accuracy and bench correlation not verified"
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--driver", type=Path, required=True)
    parser.add_argument("--module", type=Path, required=True)
    parser.add_argument("--current", type=float)
    parser.add_argument("--input-v", type=float, default=120.0)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    result = evaluate(json.loads(args.driver.read_text()), json.loads(args.module.read_text()),
                      args.current, args.input_v)
    payload = json.dumps(result, indent=2, allow_nan=False) + "\n"
    if args.output:
        args.output.write_text(payload, encoding="utf-8")
        print("Saved", args.output)
    else:
        print(payload, end="")


if __name__ == "__main__":
    main()
