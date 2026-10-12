"""Synthetic unit tests for the independent ProDriver offline cross-check."""
import unittest
from model_audit import evaluate, interp

D = {"info": {"model": "SYNTHETIC DRIVER", "min_input_volts": 90,
              "max_input_volts": 305, "min_voltage": 10, "max_voltage": 54,
              "max_power": 85, "efficiency_blend_weight": 1},
     "curves": {"efficiency_vs_load": {"load_percent": [0, 100], "efficiency": [.8, .9]},
                "efficiency_vs_output_power": {"power_w": [0, 85], "efficiency": [.8, .9]},
                "efficiency_vs_vout_120": {"vout_v": [10, 54], "efficiency": [.8, .9]},
                "efficiency_vs_vout_277": {"vout_v": [10, 54], "efficiency": [.85, .95]}}}
M = {"info": {"model": "SYNTHETIC MODULE", "series_count": 1,
              "nominal_current": .6, "max_current": 1.2},
     "curves": {"iv_curve_led": {"current_amps": [.3, .6, 1.2],
                                 "volts_per_led": [40, 45, 50]}}}


class Tests(unittest.TestCase):
    def test_interpolation(self):
        self.assertAlmostEqual(interp([0, 2], [1, 5], 1), 3)

    def test_curve_clamping(self):
        self.assertEqual(interp([0, 2], [1, 5], -1), 1)
        self.assertEqual(interp([0, 2], [1, 5], 4), 5)

    def test_ohms_law_power(self):
        result = evaluate(D, M)
        self.assertAlmostEqual(result["output_power_W"], 27)
        self.assertAlmostEqual(result["estimated_input_power_W"],
                               27 / result["estimated_efficiency"])

    def test_voltage_efficiency_curve_switch(self):
        self.assertGreater(evaluate(D, M, input_v=277)["estimated_efficiency"],
                           evaluate(D, M, input_v=120)["estimated_efficiency"])

    def test_driver_and_module_limits(self):
        result = evaluate(D, M, current=1.3, input_v=80)
        self.assertEqual(result["status"], "OUT_OF_RANGE")
        self.assertIn("Input below minimum", result["issues"])
        self.assertIn("Module current above maximum", result["issues"])

    def test_invalid_current(self):
        with self.assertRaises(ValueError):
            evaluate(D, M, current=-0.1)

    def test_no_efficiency_curves(self):
        r = evaluate({"info": {}}, {"info": {"typical_voltage": 24,
                                           "nominal_current": .5}})
        self.assertAlmostEqual(r["estimated_efficiency"], .85)

    def test_duplicate_curve_points(self):
        with self.assertRaises(ValueError):
            interp([1, 1], [2, 3], 1)


if __name__ == "__main__":
    unittest.main()
