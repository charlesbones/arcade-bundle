# UNO Q Arcade Bundle — Interactive Build Guide

A single-page, dependency-light interactive companion to Arduino's
[UNO Q Arcade Bundle](https://projecthub.arduino.cc/Arduino_Genuino/uno-q-arcade-bundle-b272c5)
tutorial. It walks through hardware setup, 3D-printing and assembling the
controller enclosure (with a live, rotatable 3D viewer for every assembly
step), and the software configuration that turns it into a retro arcade
machine.

No build step, no dependencies to install — it's plain HTML/CSS/JS plus a
vendored copy of [three.js](https://threejs.org/) for the 3D viewer.

## Running it locally

Because the page uses ES modules and loads `.stl` files, open it through a
local server rather than as a `file://` URL (browsers block module/`fetch`
requests from `file://`):

```bash
python3 -m http.server 8420
```

Then visit `http://localhost:8420`.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo's **Settings → Pages**, set the source to the branch/folder
   containing `index.html` (root, or `/docs` if you move it there).
3. GitHub Pages serves static files directly, so no build step is needed.

## Project structure

```
index.html          Page shell + import map for three.js
css/style.css        All styling (light/dark theme aware)
js/steps.js          All guide content (edit this to change wording/steps)
js/viewer.js         Three.js scene: loads/positions/highlights STL parts
js/app.js            UI wiring: navigation, progress, checklists, toolbar
js/vendor/           Vendored three.js build + STLLoader/OrbitControls
models/              STL geometry (see below)
```

## About the 3D models

- `base.stl`, `button-pad.stl`, `cover.stl`, `cover-with-ties.stl` are the
  printable enclosure parts, exported together from one assembly — their
  coordinates line up exactly, so they mate perfectly in the viewer.
- `uno-q.stl`, `modulino-joystick.stl`, `modulino-movement.stl`,
  `modulino-buttons.stl` are reference models converted from the official
  STEP files on [docs.arduino.cc](https://docs.arduino.cc/) (product pages
  for the UNO Q and each Modulino node). They come from separate CAD
  exports, not the original enclosure assembly, so their position in the
  viewer is a hand-placed approximation matching the written instructions
  ("center of the base", "left side", etc.) rather than a precise mate.
  Steps that use them are flagged with an "approximate 3D placement" badge.
- The `Cover with ties` variant is shown as printed (flat, unbent) — the
  viewer doesn't simulate bending the printed tie tabs around the power
  cable, which is a manual step described in the text.

## Editing the guide

All step text, checklists, callouts and which parts appear in the viewer
live in `js/steps.js` as a plain array — no HTML templating system, just
edit the strings. Each step can optionally include a `viewer` block
(`show`/`highlight`/`dim` part keys + a camera preset) to control the 3D
scene, or omit it entirely for a text-only step.

## Credits

- Guide content adapted from Arduino's UNO Q Arcade Bundle tutorial by
  Arduino_Genuino (GPL3+).
- Reference CAD models from docs.arduino.cc.
- Arduino, UNO and Modulino are trademarks of Arduino S.r.l.
