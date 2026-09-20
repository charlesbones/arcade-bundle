// Content for the UNO Q Arcade Bundle interactive guide.
// Sourced from the official Arduino Project Hub tutorial:
// https://projecthub.arduino.cc/Arduino_Genuino/uno-q-arcade-bundle-b272c5 (GPL3+)
// 3D reference models for the UNO Q and Modulino boards come from the STEP
// downloads on docs.arduino.cc for those products.

export const PHASES = [
  { id: 'ready', title: 'Get Ready' },
  { id: 'build', title: 'Build the Controller' },
  { id: 'software', title: 'Bring It to Life' },
  { id: 'levelup', title: 'Level Up' },
];

const DEFAULT_CAM = { pos: [180, -260, 200], target: [0, -10, 10] };
const RIGHT_CAM = { pos: [150, -190, 160], target: [55, -18, 12] };
const LEFT_CAM = { pos: [-150, -190, 160], target: [-55, -18, 12] };
const CENTER_BACK_CAM = { pos: [40, -230, 190], target: [-5, 18, 20] };
const TOP_CAM = { pos: [10, -30, 340], target: [0, -10, 10] };
const WIDE_CAM = { pos: [260, -360, 260], target: [0, 0, 10] };

export const STEPS = [
  // ---------------------------------------------------------------- ready --
  {
    id: 'workstation',
    phase: 'ready',
    title: 'Set up your workstation',
    kicker: 'Hardware setup',
    body: `
      <p>For the software half of this build, the UNO Q runs as a small single-board computer,
      so you'll drive it like a mini desktop before anything else happens.</p>
      <ul>
        <li>Connect a <strong>monitor, keyboard and mouse</strong> to a USB Type-C hub.</li>
        <li><strong>Power the UNO Q</strong> by plugging USB-C power into the hub, then connect the hub's output cable to the UNO Q.</li>
        <li>Connect the <strong>Modulino Joystick, Movement and Buttons</strong> to the UNO Q via the Qwiic connector (any order is fine for now &mdash; the exact daisy-chain order matters once you start building, see the next phase).</li>
      </ul>
      <div class="callout warn">
        <div class="callout-title">⚡ Check your monitor's power</div>
        The UNO Q is powered entirely through the USB-C hub, but depending on your monitor model you may need to power it separately.
      </div>
      <p>For the full single-board-computer setup, see Arduino's own
      <a href="https://docs.arduino.cc/tutorials/uno-q/user-manual/" target="_blank" rel="noopener">UNO Q documentation</a>.</p>
    `,
  },
  {
    id: 'applab-import',
    phase: 'ready',
    title: 'Import the project into App Lab',
    kicker: 'Hardware setup',
    body: `
      <p>Once the UNO Q has booted with a monitor attached, finish the initial board setup.</p>
      <ol>
        <li>Connect the board to your Wi-Fi/network.</li>
        <li>Create a <strong>password</strong> for the board &mdash; you'll need it again later.</li>
        <li>Download the project zip:
          <div>
            <a class="dl-btn" href="https://github.com/charlesbones/arcade-bundle/releases/latest/download/modulino-hid-bridge-arcade-machine.zip" download>
              ⬇ Download modulino-hid-bridge-arcade-machine.zip <span class="size">(~48 KB)</span>
            </a>
          </div>
          Mirrored from the <strong>Arduino App Lab</strong> section of the original tutorial &mdash;
          see the <a href="https://github.com/charlesbones/arcade-bundle/releases" target="_blank" rel="noopener">Releases page</a>
          for other versions.
        </li>
        <li>Open <strong>Arduino App Lab</strong> and go to <strong>My Apps</strong>.</li>
        <!-- TODO(gif): this step is a good candidate for a short screen
             recording -- clicking the "+" in My Apps, picking the
             downloaded zip in the import dialog, and the new app appearing
             in the list. When a real .gif/.webp exists for it, drop it in
             as:
               <img src="media/applab-import.gif" alt="ALT_TEXT">
             Draft alt text ready to use:
             "Screen recording of Arduino App Lab: clicking the plus icon
             in the My Apps view, choosing the downloaded
             modulino-hid-bridge-arcade-machine.zip in the file picker, and
             the new 'Modulino HID bridge (Arcade Machine)' app appearing
             in the My Apps list." -->
        <li>Click <strong>Create New App (+)</strong> and import the downloaded project.</li>
      </ol>
      <div class="callout tip">
        <div class="callout-title">💡 Remember this password</div>
        You'll type it again when you run <code class="inline">sudo</code> commands over the terminal later in this guide.
      </div>
    `,
  },

  // ---------------------------------------------------------------- build --
  {
    id: 'overview',
    phase: 'build',
    title: 'What you\'ll need',
    kicker: '3D-printed controller',
    approx: false,
    viewer: {
      show: ['base', 'buttonPadBent', 'cover'],
      highlight: ['base', 'buttonPadBent', 'cover'],
      camera: WIDE_CAM,
      explodable: true,
    },
    alt: 'The three printed enclosure parts — Base, Button Pad and Cover — shown together at an angle. Use the Assembled/Exploded toggle above the viewer to space them apart and see how they stack.',
    body: `
      <p>The enclosure is three printed parts that snap around the electronics. Here's everything the
      official build calls for.</p>
      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Electronics</h3>
      <div class="card-grid">
        <div class="mini-card"><span class="qty">1×</span><span class="label">Arduino UNO Q</span></div>
        <div class="mini-card"><span class="qty">1×</span><span class="label">Modulino Joystick</span></div>
        <div class="mini-card"><span class="qty">1×</span><span class="label">Modulino Movement</span></div>
        <div class="mini-card"><span class="qty">1×</span><span class="label">Modulino Buttons</span></div>
        <div class="mini-card"><span class="qty">4×</span><span class="label">5 cm Qwiic cables</span></div>
      </div>
      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Fasteners</h3>
      <div class="card-grid">
        <div class="mini-card"><span class="qty">14×</span><span class="label">M3×6 flathead screws</span></div>
        <div class="mini-card"><span class="qty">2×</span><span class="label">M3×10 flathead screws</span></div>
      </div>
      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Tools &amp; printing</h3>
      <div class="card-grid">
        <div class="mini-card"><span class="qty">🔧</span><span class="label">Screwdriver</span></div>
        <div class="mini-card"><span class="qty">🖨️</span><span class="label">FDM printer, 170×80 mm bed min.</span></div>
        <div class="mini-card"><span class="qty">🧵</span><span class="label">PLA or PETG filament</span></div>
        <div class="mini-card"><span class="qty">🗜️</span><span class="label">Small pliers (optional)</span></div>
      </div>
      <div class="callout tip">
        <div class="callout-title">🖨️ Slicer settings</div>
        The included <code class="inline">.3mf</code> is a PrusaSlicer profile tested at a 0.2&nbsp;mm layer height in
        both PLA and PETG. Using a different slicer? You'll likely need to set supports and print
        parameters yourself &mdash; in particular, support the two power-cable holes in the Base's
        upper-left corner.
      </div>
      <p>Use the toggle above the viewer to see the enclosure exploded or drag to orbit and get a feel
      for how the three parts &mdash; <strong>Base</strong>, <strong>Button Pad</strong> and <strong>Cover</strong> &mdash; relate to each other
      before you start printing.</p>
    `,
  },
  {
    id: 'wire-chain',
    phase: 'build',
    title: 'Wire the Modulino chain',
    kicker: 'Assembly step 1',
    viewer: {
      show: ['unoQ', 'modButtons', 'modMovement', 'modJoystick'],
      highlight: ['unoQ', 'modButtons', 'modMovement', 'modJoystick'],
      camera: WIDE_CAM,
    },
    checklist: ['4× 5 cm Qwiic cables'],
    alt: 'Four circuit boards floating side by side, all highlighted: the UNO Q, then Modulino Buttons, Modulino Movement and Modulino Joystick, in the order they get cabled together.',
    body: `
      <p>Before anything gets screwed down, connect the UNO Q and the three Modulino nodes with Qwiic
      cables <strong>in this exact order</strong>:</p>
      <div class="callout tip" style="font-size:15px;text-align:center;font-weight:700;">
        UNO Q &nbsp;→&nbsp; Modulino Buttons &nbsp;→&nbsp; Modulino Movement &nbsp;→&nbsp; Modulino Joystick
      </div>
      <p>Qwiic connectors are keyed so they only go in one way &mdash; if a cable feels like it's forcing,
      flip it around rather than pushing harder.</p>
    `,
  },
  {
    id: 'mount-unoq',
    phase: 'build',
    title: 'Mount the UNO Q',
    kicker: 'Assembly step 2',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ'],
      highlight: ['unoQ', 'screwsUnoQ'],
      dim: ['base'],
      camera: DEFAULT_CAM,
    },
    checklist: ['2× M3×6 flathead screws'],
    alt: 'The UNO Q board, highlighted in green, centered on top of the grey plastic Base, held down by two steel M3x6 screws; the Base is faded to show it is already in place.',
    body: `
      <p>Screw the UNO Q to the <strong>center of the Base</strong> using 2 M3×6 flathead screws.</p>
    `,
  },
  {
    id: 'mount-buttons',
    phase: 'build',
    title: 'Mount the Modulino Buttons',
    kicker: 'Assembly step 3',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons'],
      highlight: ['modButtons', 'screwsButtons'],
      dim: ['base', 'unoQ', 'screwsUnoQ'],
      camera: RIGHT_CAM,
    },
    checklist: ['2× M3×6 flathead screws (upper holes)'],
    alt: 'The Modulino Buttons module, highlighted in blue, on the right side of the Base, angled 45 degrees and held by two M3x6 screws, next to the faded UNO Q board and Base.',
    body: `
      <p>Screw the Modulino Buttons to the Base <strong>with the LEDs facing the UNO Q</strong>, using
      2 M3×6 screws in the upper holes.</p>
    `,
  },
  {
    id: 'prep-buttonpad',
    phase: 'build',
    title: 'Prep the Button Pad',
    kicker: 'Assembly step 4',
    approx: false,
    viewer: {
      show: ['buttonPad'],
      highlight: ['buttonPad'],
      camera: { pos: [110, -140, 130], target: [60, -17, 10] },
      // Flat as-printed part vs the same part with both spacer lugs folded
      // (button-pad-bent.stl).
      variants: [
        { key: 'buttonPad', label: 'As printed' },
        { key: 'buttonPadBent', label: 'Folded' },
      ],
      defaultVariant: 'buttonPad',
    },
    alt: 'A close-up of the teal Button Pad part on its own, angled to show its two thin, bendable spacer lugs.',
    altVariants: {
      buttonPad: 'A close-up of the teal Button Pad as printed, flat, with its two spacer lugs sticking out past the bar at either end, each with a small standoff and a hole.',
      buttonPadBent: 'The teal Button Pad with both spacer lugs folded 180 degrees back under the bar, so each lug\'s standoff hangs below the bar directly under one of the bar\'s screw holes.',
    },
    body: `
      <p>The Button Pad prints with two integrated spacers. Bend both of them
      <strong>downward along their weak (thin) line</strong> so they'll clip around the Buttons module
      in the next step.</p>
      <div class="callout tip">
        <div class="callout-title">🗜️ Tip</div>
        A small pair of pliers helps get a clean, controlled bend right on the scored line without
        stressing the rest of the part.
      </div>
      <div class="callout tip">
        <div class="callout-title">🔁 How far to fold</div>
        In the 3D model, each spacer folds a full <strong>180°</strong> &mdash; back under the bar.
        Flip the viewer above between <strong>As printed</strong> and <strong>Folded</strong> to see
        it: the folded standoff lands directly under one of the bar's screw holes. (The pad sits
        rotated 45° in the case, so the fold line runs diagonally.)
      </div>
    `,
  },
  {
    id: 'attach-buttonpad',
    phase: 'build',
    title: 'Attach the Button Pad',
    kicker: 'Assembly step 5',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad'],
      highlight: ['buttonPadBent', 'screwsPad'],
      dim: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons'],
      camera: RIGHT_CAM,
    },
    checklist: ['2× M3×10 flathead screws'],
    alt: 'The teal Button Pad, highlighted, fitted over the Modulino Buttons board with its two folded spacer lugs, screwed down by two M3x10 screws through the lugs, with everything else faded.',
    body: `
      <p>Place the Button Pad over the Modulino Buttons and screw it down through its two bent spacers.</p>
      <div class="callout warn">
        <div class="callout-title">⚠️ Screw size note</div>
        The original tutorial text says "two M3×8 screws" in this step, while its own bill of materials
        lists <strong>2× M3×10</strong> flathead screws as the odd-ones-out (everything else is M3×6).
        Use the M3×10s from your kit here &mdash; they're almost certainly what's meant.
      </div>
    `,
  },
  {
    id: 'insert-movement',
    phase: 'build',
    title: 'Insert the Modulino Movement',
    kicker: 'Assembly step 6',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad', 'modMovement'],
      highlight: ['modMovement'],
      dim: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad'],
      camera: CENTER_BACK_CAM,
    },
    alt: 'The orange Modulino Movement board, highlighted, standing upright in a slot toward the back of the Base, with everything placed so far shown faded.',
    body: `
      <p>Insert the Modulino Movement <strong>vertically</strong> into its slot in the Base, with the
      Qwiic receptacles facing inward (toward the UNO Q).</p>
    `,
  },
  {
    id: 'mount-joystick',
    phase: 'build',
    title: 'Mount the Modulino Joystick',
    kicker: 'Assembly step 7',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad', 'modMovement', 'modJoystick', 'screwsJoystick'],
      highlight: ['modJoystick', 'screwsJoystick'],
      dim: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad', 'modMovement'],
      camera: LEFT_CAM,
    },
    checklist: ['Screws for the Joystick mount'],
    alt: 'The purple Modulino Joystick, highlighted, mounted on the left side of the Base with one M3x6 screw, with everything placed so far shown faded.',
    body: `
      <p>Screw the Modulino Joystick in on the <strong>left side</strong> of the Base. Double-check the
      little XY-axis graphic printed on the joystick module lines up the way you expect before you
      tighten it down &mdash; getting this rotated 90° or mirrored is the easiest mistake to make here.</p>
    `,
  },
  {
    id: 'close-case',
    phase: 'build',
    title: 'Close the case',
    kicker: 'Assembly step 8',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad', 'modMovement', 'modJoystick', 'screwsJoystick', 'cover', 'screwsCover'],
      highlight: ['cover', 'screwsCover'],
      dim: ['unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'modMovement', 'modJoystick', 'screwsJoystick', 'screwsPad'],
      camera: TOP_CAM,
      variants: [
        { key: 'cover', label: 'Plain cover' },
        { key: 'coverTies', label: 'Cover with ties' },
      ],
      defaultVariant: 'cover',
    },
    checklist: ['Cover fasteners'],
    alt: 'A top-down view of the highlighted plain Cover fitted onto the Base, with the electronics faded underneath and the Button Pad poking through a cutout in the Cover.',
    altVariants: {
      cover: 'A top-down view of the highlighted plain Cover fitted onto the Base, with the electronics faded underneath and the Button Pad poking through a cutout in the Cover.',
      coverTies: 'A top-down view of the highlighted Cover-with-ties variant fitted onto the Base, showing its two extra flat tie tabs extending past the edge, not yet bent around the power cable.',
    },
    body: `
      <p>Screw the Cover onto the Base. The Button Pad pokes up through a cutout in the Cover, so it
      stays clickable while everything else is sealed underneath.</p>
    `,
  },
  {
    id: 'fixing-ties',
    phase: 'build',
    title: 'Secure the power cable (optional)',
    kicker: 'Assembly step 9',
    viewer: {
      show: ['base', 'unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'buttonPadBent', 'screwsPad', 'modMovement', 'modJoystick', 'screwsJoystick', 'coverTies', 'screwsCover'],
      highlight: ['coverTies', 'screwsCover'],
      dim: ['unoQ', 'screwsUnoQ', 'modButtons', 'screwsButtons', 'modMovement', 'modJoystick', 'screwsJoystick', 'screwsPad'],
      camera: TOP_CAM,
      variants: [
        { key: 'cover', label: 'Plain cover' },
        { key: 'coverTies', label: 'Cover with ties' },
      ],
      defaultVariant: 'coverTies',
    },
    checklist: ['M3×6 screws (one of the two bottom holes)'],
    alt: 'A top-down view of the highlighted Cover-with-ties variant fitted onto the Base, showing its two extra flat tie tabs extending past the edge, not yet bent around the power cable.',
    altVariants: {
      cover: 'A top-down view of the highlighted plain Cover fitted onto the Base, with the electronics faded underneath and the Button Pad poking through a cutout in the Cover.',
      coverTies: 'A top-down view of the highlighted Cover-with-ties variant fitted onto the Base, showing its two extra flat tie tabs extending past the edge, not yet bent around the power cable.',
    },
    body: `
      <p>If you printed the alternate <strong>Cover with ties</strong> variant instead of the plain
      Cover, bend the two printed ties around the UNO Q's USB-C power dongle/cable and screw them down
      with M3×6 screws into one of the two holes on the underside of the Base. Trim off the unused tie
      holes if you'd like a cleaner finish.</p>
      <div class="callout tip">
        <div class="callout-title">💡 Which cover do I need?</div>
        Both <code class="inline">Cover.stl</code> and <code class="inline">Cover with ties.stl</code>
        are included &mdash; print whichever matches how you want to manage the power cable. This step
        is only relevant if you chose the ties version.
      </div>
      <p style="text-align:center;font-size:22px;margin-top:22px;">🎉 <strong>The controller is built!</strong></p>
    `,
  },

  // ------------------------------------------------------------- software --
  {
    id: 'run-hidbridge',
    phase: 'software',
    title: 'Run the HID Bridge app',
    kicker: 'App Lab',
    body: `
      <p>With the hardware wired and built, open the imported project from <strong>My Apps</strong> and
      locate <strong>Modulino HID Bridge (Arcade Machine)</strong>.</p>
      <ol>
        <li>Click <strong>Run</strong> in the top-right corner.</li>
        <li>A browser window should open automatically. If it doesn't, go to
          <code class="inline">http://YOUR_IP_ADDRESS:7000</code> yourself.</li>
      </ol>
      <p>This web interface lets you monitor Modulino inputs live and configure how they behave.</p>
    `,
  },
  {
    id: 'configure-inputs',
    phase: 'software',
    title: 'Configure the inputs',
    kicker: 'HID Bridge interface',
    body: `
      <p><strong>HID output enable</strong> &mdash; this checkbox turns communication with the
      <code class="inline">injector.py</code> script on or off.</p>
      <p><strong>Devices</strong> &mdash; lists every Modulino node currently seen on the Qwiic bus. If
      nothing shows up, click <strong>Rescan I2C Bus</strong> and wait a few seconds.</p>
      <p><strong>Live data</strong> &mdash; shows real-time values from all connected nodes. The
      <strong>Nudge Cursor</strong> button sends a test mouse movement so you can confirm the injector
      service is actually listening.</p>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Joystick / pointer settings</h3>
      <p>The Modulino Joystick can drive a <strong>mouse pointer</strong> or emulate a <strong>D-pad</strong>
      (the usual choice for gaming).</p>
      <table class="spec">
        <tr><th>D-pad setting</th><th>What it does</th></tr>
        <tr><td>Threshold</td><td>How far the stick must move (0–1) before a direction registers. Lower = more sensitive.</td></tr>
        <tr><td>Release factor</td><td>A direction releases once deflection drops below threshold × this factor (hysteresis, prevents chatter).</td></tr>
        <tr><td>Diagonal policy</td><td>"Prefer stronger axis" fires only the more-deflected direction; "Allow diagonals" fires both at once.</td></tr>
        <tr><td>Auto-repeat</td><td>Holding a direction sends repeated key presses, like holding an arrow key.</td></tr>
        <tr><td>Initial delay</td><td>How long to hold before auto-repeat kicks in.</td></tr>
        <tr><td>Repeat cadence</td><td>Interval between repeats once auto-repeat is active.</td></tr>
      </table>
      <table class="spec">
        <tr><th>Mouse setting</th><th>What it does</th></tr>
        <tr><td>Sensitivity</td><td>Pixels moved per unit of joystick deflection.</td></tr>
        <tr><td>Acceleration</td><td>Boosts speed for large deflections; 0 = linear response.</td></tr>
        <tr><td>Dead zone</td><td>Positions smaller than this are treated as centered, filtering drift.</td></tr>
        <tr><td>Invert Y axis</td><td>Flips the Y axis.</td></tr>
      </table>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Buttons</h3>
      <p>Each Modulino Buttons input can be mapped to a keyboard key, a mouse click, a keyboard
      shortcut, or a key combination &mdash; e.g. press <code class="inline">A</code>, press
      <code class="inline">Shift+A</code>, left-click, or hold a key &mdash; and set to behave as a
      tap or a hold.</p>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">Movement</h3>
      <p>Configured like the joystick (mouse or D-pad), plus a <strong>mounting rotation</strong> value
      if you installed the Movement node rotated (e.g. 90°) from its default orientation.</p>

      <div class="callout tip">
        <div class="callout-title">💾 Don't forget</div>
        Save your settings after every change on this page.
      </div>
    `,
  },
  {
    id: 'run-injector',
    phase: 'software',
    title: 'Start the injector script',
    kicker: 'Terminal',
    body: `
      <p>The HID Bridge sends sensor data over the network, but Linux itself can't interpret those
      messages as keyboard/mouse events yet. The <code class="inline">injector.py</code> script bridges
      that gap by creating virtual HID devices.</p>
      <p>Open a terminal on the UNO Q and install its dependencies:</p>
      <pre class="code">sudo apt install python3-evdev python3-uinput</pre>
      <p>Navigate to the project's <code class="inline">host</code> folder:</p>
      <pre class="code">cd ArduinoApps/modulino-hid-bridge-arcade-emulator/host</pre>
      <p>Then run the script (you'll be asked for the board password you set earlier):</p>
      <pre class="code">sudo python3 injector.py</pre>
      <p>If everything's working, mouse and keyboard input should now follow your Modulino inputs
      using the settings you configured in the previous step.</p>
    `,
  },
  {
    id: 'install-retroarch',
    phase: 'software',
    title: 'Install & configure RetroArch',
    kicker: 'Emulation frontend',
    body: `
      <p>RetroArch is an open-source frontend that unifies input, video, audio and save-state handling
      across many emulator <strong>cores</strong>. This tutorial installs:</p>
      <ul>
        <li>RetroArch (GPLv3) + RetroArch Assets (menu themes/icons)</li>
        <li><strong>mGBA</strong> &mdash; Game Boy Advance core</li>
        <li><strong>bsnes-mercury Performance</strong> &mdash; Super Nintendo (SNES) core</li>
        <li><strong>Nestopia</strong> &mdash; Nintendo Entertainment System (NES) core</li>
      </ul>
      <pre class="code">sudo apt install -y retroarch retroarch-assets libretro-mgba libretro-bsnes-mercury-performance libretro-nestopia</pre>
      <div class="callout danger">
        <div class="callout-title">⚖️ About ROMs</div>
        RetroArch and its cores don't include any games. Before using a ROM, verify you actually have
        the legal right to it and that its license covers your intended use &mdash; many commercial
        games are still copyrighted even where the original hardware is no longer sold.
      </div>
      <p>Open RetroArch from <strong>Applications → Games → RetroArch</strong>. On first launch you'll
      navigate the menu with your mouse and keyboard, since the controllers aren't mapped yet:</p>
      <ol>
        <li>Go to <strong>Settings → Input</strong>.</li>
        <li>Open <strong>RetroPad Binds</strong> and select <strong>Port 1 Controls</strong>.</li>
        <li>Bind each control to match the same buttons you set up on the HID Bridge page.</li>
        <li>If a game uses a D-pad, make sure the matching Modulino Joystick/Movement is set to
          <strong>D-pad emulation</strong> mode on the HID Bridge page.</li>
        <li>Repeat for Player 2 and any additional controllers.</li>
      </ol>
      <p>Your controller should now work perfectly.</p>
    `,
  },
  {
    id: 'autostart',
    phase: 'software',
    title: 'Launch everything at boot',
    kicker: 'Autostart',
    body: `
      <p>Once everything works, configure the whole stack to come up automatically whenever the UNO Q
      boots.</p>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">1. Set App Lab as startup</h3>
      <ol>
        <li>Open <strong>My Apps</strong> in Arduino App Lab.</li>
        <li>Hover over <strong>Modulino HID Bridge (Arcade Machine)</strong>.</li>
        <li>Click the three-dot menu → <strong>Run as Startup</strong>.</li>
      </ol>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">2. Enable autologin</h3>
      <pre class="code">sudo nano /etc/lightdm/lightdm.config</pre>
      <p>Under <code class="inline">[Seat:*]</code> add:</p>
      <pre class="code">autologin-user=arduino
autologin-user-timeout=0</pre>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">3. Create the injector service</h3>
      <pre class="code">mkdir -p ~/.config/systemd/user
nano ~/.config/systemd/user/hid-injector.service</pre>
      <pre class="code">[Unit]
Description=HID injector (uinput bridge)
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/arduino/ArduinoApps/{CHANGE FOR THE FOLDER NAME}/host/injector.py
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target</pre>
      <p>Save with <code class="inline">Ctrl+X</code>, then <code class="inline">Y</code> + Enter.</p>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">4. Create the RetroArch service</h3>
      <pre class="code">nano ~/.config/systemd/user/retro-launcher.service</pre>
      <pre class="code">[Unit]
Description=RetroArch launcher
StartLimitIntervalSec=0

[Service]
Environment=DISPLAY=:0
ExecStartPre=/bin/sh -c 'until xdpyinfo -display :0 >/dev/null 2>&1; do sleep 2; done'
ExecStartPre=/bin/sleep 20
ExecStart=retroarch --fullscreen
StandardOutput=journal
StandardError=journal
Restart=always
RestartSec=5

[Install]
WantedBy=default.target</pre>

      <h3 style="margin:18px 0 8px;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:var(--text-dim)">5. Enable & start both services</h3>
      <pre class="code">systemctl --user daemon-reload
systemctl --user enable hid-injector.service retro-launcher.service
systemctl --user start hid-injector.service retro-launcher.service</pre>
      <p>Reboot to verify everything comes up on its own:</p>
      <pre class="code">sudo reboot</pre>
    `,
  },

  // -------------------------------------------------------------- levelup --
  {
    id: 'extra-buttons',
    phase: 'levelup',
    title: 'Add a second Buttons module',
    kicker: 'Optional',
    body: `
      <p>Some Modulino nodes support software-configurable I²C addresses, so multiple identical nodes
      can share the same Qwiic bus &mdash; handy if you want two Modulino Buttons modules (e.g. for a
      second player) working at once.</p>
      <p>Follow
        <a href="https://projecthub.arduino.cc/mario-r/14544b94-7fc7-446f-ad5f-4531de55f3fd" target="_blank" rel="noopener">this companion project</a>
      to set one of the two Buttons modules to address <code class="inline">0x66</code>. Once that's
      done, both Buttons modules can be used together.</p>
    `,
  },
  {
    id: 'finish',
    phase: 'levelup',
    title: 'Have fun!',
    kicker: 'Done',
    viewer: {
      show: ['base', 'buttonPadBent', 'cover'],
      highlight: ['base', 'buttonPadBent', 'cover'],
      camera: WIDE_CAM,
    },
    alt: 'The finished enclosure — Base, Button Pad and Cover — shown fully assembled together.',
    body: `
      <p style="text-align:center;font-size:40px;margin:6px 0;">🕹️</p>
      <p style="text-align:center;font-size:18px;font-weight:700;">Your UNO Q arcade machine is ready.</p>
      <p>Power it on, grab a controller, and enjoy some retro gaming &mdash; built and configured
      entirely by you.</p>
      <div class="callout tip">
        <div class="callout-title">📖 Full source</div>
        This guide is an interactive companion to Arduino's own
        <a href="https://projecthub.arduino.cc/Arduino_Genuino/uno-q-arcade-bundle-b272c5" target="_blank" rel="noopener">UNO Q Arcade Bundle</a>
        tutorial, which also covers the underlying App Lab project in more depth.
      </div>
    `,
  },
];
