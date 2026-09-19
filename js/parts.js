// 3D part registry for the UNO Q Arcade Bundle guide.
// See viewer.js for what each field means.
//
// "enclosure" parts (base, button-pad, cover, cover-with-ties) were exported
// together from one assembly, so their coordinates already line up perfectly
// -- exact:true, no transform needed.
// "electronics" parts (uno-q, modulino-*) come from Arduino's separate STEP
// downloads (docs.arduino.cc) and are placed here at approximate, hand-picked
// positions that match the written instructions (center of base, left side,
// etc). `local` is that model's own bounding box (bbox center XY + min Z),
// used to align it onto `transform.pos`.

export const PARTS = {
  base: {
    file: 'models/base.stl',
    exact: true,
    color: 0xcfcac0,
  },
  buttonPad: {
    file: 'models/button-pad.stl',
    exact: true,
    color: 0x2f8f8a,
    explodeLift: 30,
  },
  // Same pad with both spacer lugs folded 180 degrees back under the bar
  // (made from button-pad.stl; the fold line is diagonal because the pad
  // sits rotated 45 deg -- hinge centre w=61.58 in rotated coords, pivot at
  // the bar underside z=4.21). Same coordinate frame, so still exact:true.
  // Used for every assembled scene; the flat original is only the
  // "As printed" side of the prep step's toggle.
  buttonPadBent: {
    file: 'models/button-pad-bent.stl',
    exact: true,
    color: 0x2f8f8a,
    explodeLift: 30,
  },
  cover: {
    file: 'models/cover.stl',
    exact: true,
    color: 0xe4e0d4,
    explodeLift: 55,
  },
  coverTies: {
    file: 'models/cover-with-ties.stl',
    exact: true,
    color: 0xe4e0d4,
    explodeLift: 55,
  },
  unoQ: {
    file: 'models/uno-q.stl',
    exact: false,
    color: 0x1c7a3e,
    // "screw the UNO Q to the center of the base"
    transform: { pos: [0, -10, 13], rot: [0, 0, 0] },
    local: { centerXY: [-431.08, 110.97], minZ: 10.93 },
  },
  modButtons: {
    file: 'models/modulino-buttons.stl',
    exact: false,
    color: 0x2f6fb0,
    // footprint of the real Button Pad part (39.36..82.35, -39.02..3.97)
    transform: { pos: [60.85, -17.5, 13], rot: [0, 0, 0] },
    local: { centerXY: [20.5, 12.68], minZ: -1.61 },
  },
  modMovement: {
    file: 'models/modulino-movement.stl',
    exact: false,
    color: 0xb0562f,
    // "inserted vertically into the slot" -- stood up, mid-board
    transform: { pos: [-5, 18, 13], rot: [Math.PI / 2, 0, 0] },
    local: { centerXY: [20.5, 12.68], minZ: -1.61 },
  },
  modJoystick: {
    file: 'models/modulino-joystick.stl',
    exact: false,
    color: 0x8a2fb0,
    // "screwed in on the left side"
    transform: { pos: [-55, -17.5, 13], rot: [0, 0, 0] },
    local: { centerXY: [20.5, 13.17], minZ: -3.7 },
  },
};
