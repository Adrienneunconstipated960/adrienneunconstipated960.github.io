# Hall and Van der Pauw transport analysis

## Original experiment and reconstructed model

The EE421 report describes the M91 FastHall, a four-contact Van der Pauw specimen holder, an electromagnet and MeasureLINK software. No raw instrument export survives in the currently available files. The Python source in this folder reconstructs **general equations**, not the instrument's proprietary algorithms.

## Hall voltage and carrier properties

For one dominant charge-carrier type under a uniform perpendicular magnetic field and consistent electrode polarity:

\[
R_H = \frac{V_H t}{I B}, \qquad n = \frac{1}{q\,|R_H|}, \qquad
\mu_H = \frac{|R_H|}{\rho}.
\]

- \(V_H\) Hall voltage in volts
- \(t\) sample thickness in meters
- \(I\) excitation current in amperes
- \(B\) magnetic flux density in tesla
- \(q=1.602176634\times10^{-19}\) C
- \(R_H\) Hall coefficient in m³/C
- \(n\) carrier density in m⁻³
- \(\mu_H\) Hall mobility in m²/(V·s)
- \(\rho\) bulk resistivity in Ω·m

Unit conversion: \(n[\mathrm{cm}^{-3}] = n[\mathrm{m}^{-3}]/10^6\), and \(\mu[\mathrm{cm^2/(V\,s)}] = 10^4\mu[\mathrm{m^2/(V\,s)}]\). The sign of \(R_H\) can indicate carrier polarity only with a known current, field and voltage polarity convention; simple lead reversal flips it.

## Van der Pauw resistivity

For two measured four-terminal resistances \(R_A,R_B>0\), a thin, simply connected and isotropic specimen with sufficiently small perimeter ohmic contacts satisfies:

\[
\exp\left(-\frac{\pi R_A}{R_s}\right)
+
\exp\left(-\frac{\pi R_B}{R_s}\right)=1.
\]

The recovery Python calculator obtains sheet resistance \(R_s\) (Ω/square) by bisection, then uses \(\rho=R_s t\). For \(R_A=R_B=R\), the analytic special case is \(R_s=\pi R/\ln 2\). The physical model requires a proper test geometry, not merely algebraically valid input values.

## Dimensional check from the reported central values

The original conclusion lists central estimates:

\[
n=1.99\times10^{15}\ \mathrm{cm}^{-3},\qquad
\mu=2.90\times10^5\ \mathrm{cm^2/(V\,s)}.
\]

Under a one-carrier approximation,

\[
\rho_\mathrm{implied} = \frac{1}{qn\mu}
\approx 0.0108\ \Omega\cdot\mathrm{cm}
= 10.8\ \mathrm{m}\Omega\cdot\mathrm{cm}.
\]

This is *numerically consistent* with the **11 mΩ** central figure in the report if the omitted length unit was cm. The report does not confirm that interpretation. It is not appropriate to relabel the original value silently.

## Why this is not a complete result reconstruction

The document does not provide the wafer thickness, original \(R_A,R_B\), Hall voltages, current, magnetic fields, signed Hall coefficients, repeated individual readings or underlying error model. Therefore **none** of these measured values should be reconstructed by solving backward from already-reported n and μ.

The new Python functions can be used on **new** verified input measurements. Their synthetic tests validate dimensional conversions and numerical root solving, not laboratory precision, material identity or the 2025 data.
