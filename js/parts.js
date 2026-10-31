// 3D part registry for the UNO Q Arcade Bundle guide.
// See viewer.js for what each field means.
//
// "enclosure" parts (base, button-pad, cover, cover-with-ties) were exported
// together from one assembly, so their coordinates already line up perfectly
// -- exact:true, no transform needed.
// "electronics" parts (uno-q, modulino-*) come from Arduino's separate STEP
// downloads (docs.arduino.cc). Their positions -- and every screw's -- are
// the real ones from a FreeCAD assembly (complete-project.FCStd), exported
// with tools/fc_export_placements.py in the private workshop repo. Each
// `placement` is a FreeCAD Placement: rotate the STL about its own origin,
// then translate (see viewer.js). Screws are one model placed many times
// via `instances`. Re-exported 2026-09-27 after the FreeCAD assembly was
// corrected: only 2 screws in the whole build are M3x10 (both through the
// Button Pad's spacer lugs) -- the Cover and Joystick, previously M3x10/1x
// M3x6 respectively, are M3x6 like everything else.

// Exploded view (overview step) stacks bottom to top, in Z:
//   base 0 | boards 20 | board screws 40 | pad 75 | pad screws 95 | cover 115 | cover screws 135

export const PARTS = {
  base: {
    label: 'Base',
    file: 'models/base.stl',
    exact: true,
    color: 0xcfcac0,
  },
  buttonPad: {
    label: 'Button Pad',
    file: 'models/button-pad.stl',
    exact: true,
    color: 0x2f8f8a,
    explodeLift: 75,
  },
  // Same pad with both spacer lugs folded 180 degrees back under the bar
  // (made from button-pad.stl; the fold line is diagonal because the pad
  // sits rotated 45 deg -- hinge centre w=61.58 in rotated coords, pivot at
  // the bar underside z=4.21). Same coordinate frame, so still exact:true.
  // Used for every assembled scene; the flat original is only the
  // "As printed" side of the prep step's toggle.
  buttonPadBent: {
    label: 'Button Pad',
    file: 'models/button-pad-bent.stl',
    exact: true,
    color: 0x2f8f8a,
    explodeLift: 75,
  },
  cover: {
    label: 'Cover',
    file: 'models/cover.stl',
    exact: true,
    color: 0xe4e0d4,
    explodeLift: 115,
  },
  coverTies: {
    label: 'Cover',
    file: 'models/cover-with-ties.stl',
    exact: true,
    color: 0xe4e0d4,
    explodeLift: 115,
  },
  // -- electronics: real placements from the FreeCAD assembly -------------
  unoQ: {
    label: 'Arduino UNO Q',
    explodeLift: 20,
    file: 'models/uno-q.stl',
    color: 0x1c7a3e,
    placement: { pos: [431, -111, -15], axis: [0, 0, 1], angle: 0 },
  },
  modButtons: {
    label: 'Modulino Buttons',
    explodeLift: 20,
    file: 'models/modulino-buttons.stl',
    color: 0x2f6fb0,
    placement: { pos: [51, -37, 2], axis: [0, 0, 1], angle: 45 },
  },
  modMovement: {
    label: 'Modulino Movement',
    explodeLift: 20,
    file: 'models/modulino-movement.stl',
    color: 0xb0562f,
    placement: { pos: [-21, -30, 20], axis: [-1, 0, 0], angle: 90 },
  },
  modJoystick: {
    label: 'Modulino Joystick',
    explodeLift: 20,
    file: 'models/modulino-joystick.stl',
    color: 0x8a2fb0,
    placement: { pos: [-77, -27, 1], axis: [0, 0, 1], angle: 0 },
  },

  // -- screws (origin = head top centre, tip toward -Z) ---------------------
  // Screw heads rest 1.3-1.5 above the surface they clamp: the holes are plain (no
  // countersink), so the cone head sits on top instead of sinking into the part.
  // M3x6: 2 hold the UNO Q, 2 hold the Modulino Buttons, 2 hold the Joystick,
  // 6 close the Cover
  screwsUnoQ: {
    label: 'M3×6 screws · UNO Q',
    explodeLift: 40,
    file: 'models/m3x6-flathead-screw.stl',
    color: 0xb8bec4,
    instances: [
      { pos: [31, 9, 3.4] },
      { pos: [-20, -24, 3.4] },
    ],
  },
  screwsButtons: {
    label: 'M3×6 screws · Buttons',
    explodeLift: 40,
    file: 'models/m3x6-flathead-screw.stl',
    color: 0xb8bec4,
    instances: [
      { pos: [39, -19, 3.5] },
      { pos: [63, 3, 3.5] },
    ],
  },
  screwsJoystick: {
    label: 'M3×6 screws · Joystick',
    explodeLift: 40,
    file: 'models/m3x6-flathead-screw.stl',
    color: 0xb8bec4,
    instances: [
      { pos: [-73, -22, 2.5] },
      { pos: [-40, -6.4, 2.5] },
    ],
  },
  // M3x10: only these 2, through the Button Pad's spacer lugs. Every other
  // fastener in the assembly is M3x6.
  screwsPad: {
    label: 'M3×10 screws · Button Pad',
    file: 'models/m3x10-flathead-screw.stl',
    color: 0xb8bec4,
    explodeLift: 95, // rides above the Button Pad
    instances: [
      { pos: [73, -8, 7.5] },
      { pos: [51, -30, 7.5] },
    ],
  },
  screwsCover: {
    label: 'M3×6 screws · Cover',
    explodeLift: 135, // rides above the Cover
    file: 'models/m3x6-flathead-screw.stl',
    color: 0xb8bec4,
    instances: [
      { pos: [-32, -30.4, 16.5] },
      { pos: [-33, 26.1, 16.5] },
      { pos: [32, -30.4, 16.5] },
      { pos: [33, 26.1, 16.5] },
      { pos: [77, -1.4, 16.5] },
      { pos: [-76, -1.4, 16.5] },
    ],
  },
};
