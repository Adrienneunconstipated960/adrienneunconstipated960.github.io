"""Synthetic numerical checks. No original wafer raw data are included."""
import math
import unittest
from hall_analysis import (
    Q_COULOMB, characterize, reported_summary, van_der_pauw_sheet_resistance
)


class HallAnalysisTests(unittest.TestCase):
    def test_symmetric_vdp_analytic_solution(self):
        r = 100.0
        self.assertAlmostEqual(van_der_pauw_sheet_resistance(r, r), math.pi*r/math.log(2), places=9)

    def test_asymmetric_vdp_root_residual(self):
        ra, rb = 70., 110.
        rs = van_der_pauw_sheet_resistance(ra, rb)
        self.assertAlmostEqual(math.exp(-math.pi*ra/rs) + math.exp(-math.pi*rb/rs), 1, places=12)

    def test_rejects_nonphysical_resistance(self):
        with self.assertRaises(ValueError):
            van_der_pauw_sheet_resistance(0, 10)

    def test_resistivity_conversion(self):
        d = characterize(1, 1, 0.1, 1, 1, 0.5)
        self.assertAlmostEqual(d["resistivity_ohm_cm"], (math.pi/math.log(2))*0.01, places=10)

    def test_carrier_density_and_mobility_units(self):
        d = characterize(1, 1, 0.1, -10, 1, 0.5)
        rh = (-10e-6) * 1e-4 / (1e-3*0.5)
        n = 1/(Q_COULOMB*abs(rh))/1e6
        self.assertAlmostEqual(d["majority_carrier_concentration_cm_minus3"]/n, 1, places=10)
        self.assertEqual(d["hall_coefficient_sign"], "negative")
        self.assertTrue(d["hall_mobility_cm2_per_Vs"] > 0)

    def test_reported_nominal_cross_check(self):
        d = reported_summary()
        self.assertEqual(d["classification_counts"], {"n_type":15, "p_type":15})
        self.assertAlmostEqual(d["rho_implied_by_nominal_n_mu_ohm_cm"], 0.0108, delta=0.0001)

    def test_raw_inputs_required_together(self):
        with self.assertRaises(ValueError):
            characterize(1, 1, 0, 1, 1, 1)


if __name__ == "__main__":
    unittest.main()
