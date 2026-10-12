// IVerify R1 concept reconstruction - visualization only, not original CAD
// Run python iverify_cad.py before previewing. Toggle exploded=true.
exploded=false;

color([0.26,0.38,0.51]) translate([0,0,0]) import("Fixed_Jaw.stl");
color([0.59,0.66,0.72]) translate([(exploded ? -12 : 0),0,0]) import("Removable_Jaw.stl");
color([0.88,0.73,0.34]) translate([0,0,0]) import("Contact_Plunger.stl");
color([0.94,0.90,0.77]) translate([0,0,0]) import("Force_Sensor_PLACEHOLDER.stl");
color([0.15,0.48,0.31]) translate([0,0,(exploded ? 11 : 0)]) import("Indicator_PCB_PLACEHOLDER.stl");
color([0.20,0.88,0.33]) translate([0,0,0]) import("LED_Normal_CONCEPT.stl");
color([0.99,0.67,0.13]) translate([0,0,0]) import("LED_Partial_CONCEPT.stl");
color([0.94,0.17,0.17]) translate([0,0,0]) import("LED_Occluded_CONCEPT.stl");
color([0.52,0.85,0.94,0.7]) translate([0,0,0]) import("Reference_Tubing_3mm.stl");
