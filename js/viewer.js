import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---------------------------------------------------------------------------
// Part registry
//
// "enclosure" parts (base, button-pad, cover, cover-with-ties) were exported
// together from one assembly, so their coordinates already line up perfectly.
// "electronics" parts (uno-q, modulino-*) come from Arduino's separate STEP
// downloads and are placed here at approximate, hand-picked positions that
// match the written instructions (center of base, left side, etc). They are
// for visual reference only -- see the note shown on those steps.
// ---------------------------------------------------------------------------

const PARTS = {
  base: {
    file: 'models/base.stl',
    exact: true,
    color: 0xcfcac0,
    transform: null,
  },
  buttonPad: {
    file: 'models/button-pad.stl',
    exact: true,
    color: 0x2f8f8a,
    transform: null,
  },
  cover: {
    file: 'models/cover.stl',
    exact: true,
    color: 0xe4e0d4,
    transform: null,
  },
  coverTies: {
    file: 'models/cover-with-ties.stl',
    exact: true,
    color: 0xe4e0d4,
    transform: null,
  },
  unoQ: {
    file: 'models/uno-q.stl',
    exact: false,
    color: 0x1c7a3e,
    // "screw the UNO Q to the center of the base"
    transform: { pos: [0, -10, 13], rot: [0, 0, 0] },
  },
  modButtons: {
    file: 'models/modulino-buttons.stl',
    exact: false,
    color: 0x2f6fb0,
    // footprint of the real Button Pad part (39.36..82.35, -39.02..3.97)
    transform: { pos: [60.85, -17.5, 13], rot: [0, 0, 0] },
  },
  modMovement: {
    file: 'models/modulino-movement.stl',
    exact: false,
    color: 0xb0562f,
    // "inserted vertically into the slot" -- stood up, mid-board
    transform: { pos: [-5, 18, 13], rot: [Math.PI / 2, 0, 0] },
  },
  modJoystick: {
    file: 'models/modulino-joystick.stl',
    exact: false,
    color: 0x8a2fb0,
    // "screwed in on the left side"
    transform: { pos: [-55, -17.5, 13], rot: [0, 0, 0] },
  },
};

// bbox-derived local centers/min-z used to align each electronics part's
// bottom face + XY center onto its target position above.
const LOCAL_INFO = {
  unoQ: { centerXY: [-431.08, 110.97], minZ: 10.93 },
  modButtons: { centerXY: [20.5, 12.68], minZ: -1.61 },
  modMovement: { centerXY: [20.5, 12.68], minZ: -1.61 },
  modJoystick: { centerXY: [20.5, 13.17], minZ: -3.7 },
};

const cache = new Map(); // file -> THREE.BufferGeometry
const loader = new STLLoader();

function loadGeometry(file) {
  if (cache.has(file)) return Promise.resolve(cache.get(file));
  return new Promise((resolve, reject) => {
    loader.load(
      file,
      (geometry) => {
        geometry.computeVertexNormals();
        cache.set(file, geometry);
        resolve(geometry);
      },
      undefined,
      (err) => reject(err)
    );
  });
}

export class AssemblyViewer {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--viewer-bg').trim() || '#ddd8cc');

    this.camera = new THREE.PerspectiveCamera(38, 1, 1, 5000);
    this.camera.up.set(0, 0, 1); // STL data is Z-up (board plane = XY, height = Z)
    this.camera.position.set(180, -260, 200);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, -10, 5);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 40;
    this.controls.maxDistance = 900;
    this.controls.update();

    this.hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.15);
    this.scene.add(this.hemi);
    this.key = new THREE.DirectionalLight(0xffffff, 1.4);
    this.key.position.set(200, -150, 300);
    this.scene.add(this.key);
    this.fill = new THREE.DirectionalLight(0xffffff, 0.5);
    this.fill.position.set(-200, 150, 120);
    this.scene.add(this.fill);

    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.meshes = {}; // key -> THREE.Mesh

    this._resize();
    window.addEventListener('resize', () => this._resize());

    // keep the viewer background in sync if the OS/browser theme flips
    // while the page is open (initial color was read at construction time)
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const syncBg = () => this.setBackground(
      getComputedStyle(document.documentElement).getPropertyValue('--viewer-bg').trim() || '#ddd8cc'
    );
    mq.addEventListener('change', syncBg);

    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  _resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  _tick() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this._tick);
  }

  async _ensureMesh(key) {
    if (this.meshes[key]) return this.meshes[key];
    const def = PARTS[key];
    const geometry = await loadGeometry(def.file);
    const material = new THREE.MeshStandardMaterial({
      color: def.color,
      roughness: 0.55,
      metalness: 0.08,
      transparent: true,
      opacity: 1,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.userData.baseColor = def.color;

    if (!def.exact) {
      const info = LOCAL_INFO[key];
      const t = def.transform;
      if (info && t) {
        mesh.position.set(
          t.pos[0] - info.centerXY[0],
          t.pos[1] - info.centerXY[1],
          t.pos[2] - info.minZ
        );
      }
      if (t && t.rot) {
        mesh.rotation.set(t.rot[0], t.rot[1], t.rot[2]);
      }
    }

    this.group.add(mesh);
    this.meshes[key] = mesh;
    return mesh;
  }

  /**
   * Apply a step's viewer configuration.
   * config = {
   *   show: ['base','unoQ'],       // parts visible this step
   *   highlight: ['unoQ'],         // parts to emphasize (full opacity + outline tint)
   *   dim: ['base'],               // parts shown faded (already-placed context)
   *   camera: {pos:[x,y,z], target:[x,y,z]} // optional camera preset
   * }
   */
  async applyStep(config) {
    const show = new Set(config.show || []);
    const highlight = new Set(config.highlight || []);
    const dim = new Set(config.dim || []);

    // ensure meshes for everything we need exist
    await Promise.all([...show].map((k) => this._ensureMesh(k)));

    for (const [key, mesh] of Object.entries(this.meshes)) {
      const visible = show.has(key);
      mesh.visible = visible;
      if (!visible) continue;
      const mat = mesh.material;
      if (highlight.has(key)) {
        mat.opacity = 1;
        mat.color.set(mesh.userData.baseColor);
        mat.emissive = new THREE.Color(0x000000);
      } else if (dim.has(key)) {
        mat.opacity = 0.35;
        mat.color.set(0x9a978d);
      } else {
        mat.opacity = 1;
        mat.color.set(mesh.userData.baseColor);
      }
      mat.needsUpdate = true;
    }

    if (config.camera) {
      const { pos, target } = config.camera;
      if (pos) this.camera.position.set(pos[0], pos[1], pos[2]);
      if (target) this.controls.target.set(target[0], target[1], target[2]);
      this.controls.update();
    }
  }

  setBackground(hex) {
    this.scene.background = new THREE.Color(hex);
  }

  /**
   * Lift the stacked enclosure parts apart along Z for an "exploded" view.
   * Only affects parts that sit at their native (identity) transform --
   * the enclosure parts, whose Z stacking already matches how they mate.
   */
  setExplode(active) {
    const lift = { buttonPad: 30, cover: 55, coverTies: 55 };
    for (const [key, amount] of Object.entries(lift)) {
      const mesh = this.meshes[key];
      if (!mesh) continue;
      mesh.position.z = active ? amount : 0;
    }
  }

  resize() {
    this._resize();
  }
}
