"""Synthetic offline fixtures only. No real test measurements are bundled."""
import csv
import tempfile
import unittest
from pathlib import Path

from thermal_csv_audit import audit_csv


class ThermalCsvAuditTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.path = Path(self.temp.name) / "synthetic.csv"

    def tearDown(self):
        self.temp.cleanup()

    def write(self, rows):
        with self.path.open("w", newline="", encoding="utf-8") as output:
            csv.writer(output).writerows(rows)

    def test_two_channels_and_stability(self):
        self.write([["Test: Synthetic fixture"], [], ["Data_Sample", "CH1_C", "CH2_C"],
                    *[[i, 20.0 + 0.05 * i, 20.0 + 2 * i] for i in range(1, 11)]])
        r = audit_csv(self.path, window=5, band_c=0.5)
        self.assertEqual(r["sample_rows"], 10)
        self.assertTrue(r["columns"]["CH1_C"]["last_window_within_band"])
        self.assertFalse(r["columns"]["CH2_C"]["last_window_within_band"])

    def test_missing_values_not_invented(self):
        self.write([["Data_Sample", "CH1_C"], [1, ""], [2, "NaN"], [3, "24.0"]])
        r = audit_csv(self.path)
        self.assertEqual(r["columns"]["CH1_C"]["valid_values"], 1)
        self.assertIsNone(r["columns"]["CH1_C"]["last_window_within_band"])

    def test_header_required(self):
        self.write([["timestamp", "temperature"], [0, 20]])
        with self.assertRaises(ValueError):
            audit_csv(self.path)

    def test_missing_sample_steps(self):
        self.write([["Data_Sample", "CJ_C"], [1, 20], [4, 21]])
        r = audit_csv(self.path)
        self.assertEqual(r["nonconsecutive_sample_steps"], 1)


if __name__ == "__main__":
    unittest.main()
