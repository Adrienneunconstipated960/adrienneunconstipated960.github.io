"""
IVerify R1: parametric CONCEPT reconstruction (mm).

Reference: IVerify Final Report, Spring 2026, and Group07 Technical Design Report.
The original design has no reproducible mechanical drawings in the provided reports.
This CAD is an engineering starting point and is NOT the original part, a
functioning spring/preload mechanism, or a clinical device.

CAD can be regenerated with: python iverify_cad.py
Requires: cadquery, OCP

Reference tubing OD 3.0 mm selected at the top of the original prototype's
1-3 mm target range. End users must measure the actual tubing and sensor.
"""
from pathlib import Path
import cadquery as cq

OUT = Path(__file__).resolve().parent
# -- PARAMETER SET --
TUBE_OD = 3.0                 # mm; ASSUMED selected prototype OD
TUBE_RADIAL_CLEARANCE = 0.20 # mm; ASSUMED
MAIN_LENGTH_X = 34.0         # mm
COVER_LENGTH_X = 12.0        # mm
WIDTH_Y = 30.0               # mm
DEPTH_Z = 18.0               # mm
BOLT_Y = 10.0                # mm (two clearance bores in the detachable cover)
BOLT_DIAM_COVER = 3.4        # mm, ASSUMED M3 clearance
BOLT_PILOT_MAIN = 2.5        # mm, ASSUMED pilot only, not thread geometry
PLUNGER_DIAM = 3.2           # mm, ASSUMED shaft diameter
SPRING_ENVELOPE_DIAM = 4.0   # mm, two modeled cavities only
EDGE_FILLET = 2.0            # mm
# Tube axis is Z. The split interface is x=-8.
TUBE_X, TUBE_Y = -8.0, 0.0

V = cq.Vector

def cyl(r, h, center_start, direction=(0, 0, 1)):
    return cq.Solid.makeCylinder(r, h, V(*center_start), V(*direction))

def fillet_vertical(shape, r):
    return shape.edges('|Z').fillet(r)

# Fixed jaw with semi-circular channel
main = cq.Workplane('XY').box(MAIN_LENGTH_X, WIDTH_Y, DEPTH_Z).translate((9.0, 0, 0))
main = fillet_vertical(main, EDGE_FILLET)
main = main.cut(cyl(TUBE_OD/2+TUBE_RADIAL_CLEARANCE, DEPTH_Z+2,
                    (TUBE_X,TUBE_Y,-DEPTH_Z/2-1)))
for y in (-BOLT_Y, BOLT_Y):
    main = main.cut(cyl(BOLT_PILOT_MAIN/2, 14.0, (TUBE_X-0.05,y,0),(1,0,0)))
# Plunger guide, opening toward tube and ending in the service pocket
main = main.cut(cyl(PLUNGER_DIAM/2+0.25, 22.0, (-7.95,0,0),(1,0,0)))
# Side-by-side spring cavities. Their physical spring shapes remain unspecified.
for y in (-7.0, 7.0):
    main = main.cut(cyl(SPRING_ENVELOPE_DIAM/2, 20.0, (4.0,y,0),(1,0,0)))
# Accessible service cavity at the far end, no exact original sensor dimensions available
main = main.cut(cq.Workplane('XY').box(13.0,11.0,11.0).translate((20.0,0,0)))

# Detachable jaw: allows installation without threading tubing through the device.
cover = cq.Workplane('XY').box(COVER_LENGTH_X, WIDTH_Y, DEPTH_Z).translate((-14.0,0,0))
cover = fillet_vertical(cover, EDGE_FILLET)
cover = cover.cut(cyl(TUBE_OD/2+TUBE_RADIAL_CLEARANCE, DEPTH_Z+2,
                      (TUBE_X,TUBE_Y,-DEPTH_Z/2-1)))
for y in (-BOLT_Y, BOLT_Y):
    cover = cover.cut(cyl(BOLT_DIAM_COVER/2, COVER_LENGTH_X+2,(-21.0,y,0),(1,0,0)))

# Stylized contact plunger and sensor block. No force calibration is implied.
shaft = cyl(PLUNGER_DIAM/2, 18.0, (-6.4,0,0), (1,0,0))
button = cyl(1.5, 0.4, (-6.8,0,0), (1,0,0))
head = cyl(2.7, 1.3, (11.4,0,0), (1,0,0))
plunger = shaft.fuse(button).fuse(head)
sensor_placeholder = cq.Workplane('XY').box(4.0,8.5,8.5).translate((17.4,0,0))
# Concept indicator PCB sits above main jaw. Original bench prototype used 2 LEDs.
indicator_board = cq.Workplane('XY').box(23,21,1.6).translate((12,0,10.7))
for x in (5,12,19):
    indicator_board = indicator_board.cut(cyl(1.0,2.0,(x,0,9.8)))
leds = {name:cyl(1.5,2.8,(x,0,11.45)) for name,x in
        [('normal',5.0),('partial',12.0),('occluded',19.0)]}
# Reference tube geometry ONLY; never an intended fluid-contact mechanism.
tube = cyl(TUBE_OD/2, 42.0, (TUBE_X,TUBE_Y,-21.0))

objects = {
    'Fixed_Jaw':main.val(),
    'Removable_Jaw':cover.val(),
    'Contact_Plunger':plunger,
    'Force_Sensor_PLACEHOLDER':sensor_placeholder.val(),
    'Indicator_PCB_PLACEHOLDER':indicator_board.val(),
    'LED_Normal_CONCEPT':leds['normal'],
    'LED_Partial_CONCEPT':leds['partial'],
    'LED_Occluded_CONCEPT':leds['occluded'],
    'Reference_Tubing_3mm':tube,
}
colors = {
    'Fixed_Jaw':cq.Color(.20,.29,.37),
    'Removable_Jaw':cq.Color(.40,.48,.57),
    'Contact_Plunger':cq.Color(.82,.70,.42),
    'Force_Sensor_PLACEHOLDER':cq.Color(.91,.88,.80),
    'Indicator_PCB_PLACEHOLDER':cq.Color(.12,.38,.28),
    'LED_Normal_CONCEPT':cq.Color(.20,.87,.36),
    'LED_Partial_CONCEPT':cq.Color(1.0,.65,.10),
    'LED_Occluded_CONCEPT':cq.Color(.95,.19,.18),
    'Reference_Tubing_3mm':cq.Color(.7,.86,.93,.48),
}

assembly = cq.Assembly(name='IVerify_R1_Concept')
for key, solid in objects.items():
    assembly.add(solid, name=key, color=colors[key])
assembly.save(str(OUT/'IVerify_Concept_Assembly.step'))

for k, part in objects.items():
    cq.exporters.export(part, str(OUT/(k+'.stl')), tolerance=0.09, angularTolerance=0.12)
# Assembly STL convenient for viewer. Assemblies contain physical interferences
# by design and NOT yet usable for additive manufacturing.
allsolids = cq.Compound.makeCompound(list(objects.values()))
cq.exporters.export(allsolids, str(OUT/'IVerify_Concept_Assembly.stl'))
print('STEP assembly exported; STL components:',len(objects))
