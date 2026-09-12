import { AssemblyViewer } from './viewer.js';
import { PHASES, STEPS } from './steps.js';

const STORAGE_KEY = 'arcade-guide-progress-v1';

const state = {
  index: 0,
  done: new Set(),
  coverVariant: {}, // per-step override: stepId -> 'cover' | 'coverTies'
  exploded: false,
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed.done)) state.done = new Set(parsed.done);
    if (typeof parsed.index === 'number' && parsed.index >= 0 && parsed.index < STEPS.length) {
      state.index = parsed.index;
    }
  } catch (e) {
    /* ignore corrupt storage */
  }
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ done: [...state.done], index: state.index }));
  } catch (e) {
    /* storage unavailable (private mode etc) -- fine, just don't persist */
  }
}

const els = {
  sidebar: document.getElementById('sidebar'),
  progressFill: document.getElementById('progressFill'),
  progressLabel: document.getElementById('progressLabel'),
  content: document.getElementById('content'),
  layout: document.getElementById('layout'),
  stepBody: document.getElementById('stepBody'),
  stepHeader: document.getElementById('stepHeader'),
  viewerCol: document.getElementById('viewerCol'),
  viewerCanvas: document.getElementById('viewerCanvas'),
  viewerToolbar: document.getElementById('viewerToolbar'),
  viewerLegend: document.getElementById('viewerLegend'),
  approxBadge: document.getElementById('approxBadge'),
  chipRow: document.getElementById('chipRow'),
  navPrev: document.getElementById('navPrev'),
  navNext: document.getElementById('navNext'),
  doneToggle: document.getElementById('doneToggle'),
  menuBtn: document.getElementById('menuBtn'),
  overlay: document.getElementById('overlay'),
};

let viewer = null;

function ensureViewer() {
  if (!viewer) viewer = new AssemblyViewer(els.viewerCanvas);
  return viewer;
}

function stepPercent() {
  return Math.round((state.done.size / STEPS.length) * 100);
}

function renderSidebar() {
  els.sidebar.innerHTML = '';

  const progressWrap = document.createElement('div');
  progressWrap.className = 'progress-wrap';
  progressWrap.innerHTML = `
    <div class="progress-label"><span>Progress</span><span id="progressLabel">0%</span></div>
    <div class="progress-track"><div class="progress-fill" id="progressFill"></div></div>
  `;
  els.sidebar.appendChild(progressWrap);

  for (const phase of PHASES) {
    const group = document.createElement('div');
    group.className = 'phase-group';
    const title = document.createElement('div');
    title.className = 'phase-title';
    title.textContent = phase.title;
    group.appendChild(title);

    STEPS.forEach((step, i) => {
      if (step.phase !== phase.id) return;
      const item = document.createElement('div');
      item.className = 'step-item';
      if (i === state.index) item.classList.add('active');
      if (state.done.has(step.id)) item.classList.add('done');
      item.innerHTML = `
        <span class="check">✓</span>
        <span class="step-text"><span class="num">${i + 1}.</span>${step.title}</span>
      `;
      item.addEventListener('click', () => goTo(i));
      group.appendChild(item);
    });

    els.sidebar.appendChild(group);
  }

  // re-bind refs that were just replaced via innerHTML
  els.progressFill = document.getElementById('progressFill');
  els.progressLabel = document.getElementById('progressLabel');
  updateProgressUI();
}

function updateProgressUI() {
  const pct = stepPercent();
  if (els.progressFill) els.progressFill.style.width = pct + '%';
  if (els.progressLabel) els.progressLabel.textContent = pct + '%';
}

function renderChips(step) {
  els.chipRow.innerHTML = '';
  if (!step.checklist || !step.checklist.length) {
    els.chipRow.style.display = 'none';
    return;
  }
  els.chipRow.style.display = 'flex';
  els.chipRow.style.flexWrap = 'wrap';
  els.chipRow.style.gap = '6px';
  els.chipRow.style.margin = '0 0 16px';
  for (const item of step.checklist) {
    const chip = document.createElement('span');
    chip.className = 'badge';
    chip.textContent = '🔩 ' + item;
    els.chipRow.appendChild(chip);
  }
}

function resolveShow(step, list) {
  const variant = state.coverVariant[step.id];
  if (!variant) return list;
  return list.map((k) => {
    if (k === 'cover' || k === 'coverTies') return variant;
    return k;
  });
}

function renderViewerToolbar(step) {
  els.viewerToolbar.innerHTML = '';
  const v = ensureViewer();

  const resetBtn = document.createElement('button');
  resetBtn.className = 'chip-btn';
  resetBtn.textContent = '↺ Reset view';
  resetBtn.addEventListener('click', () => applyStepToViewer(step));
  els.viewerToolbar.appendChild(resetBtn);

  if (step.id === 'overview') {
    const assembledBtn = document.createElement('button');
    assembledBtn.className = 'chip-btn' + (!state.exploded ? ' active' : '');
    assembledBtn.textContent = 'Assembled';
    const explodedBtn = document.createElement('button');
    explodedBtn.className = 'chip-btn' + (state.exploded ? ' active' : '');
    explodedBtn.textContent = 'Exploded';
    assembledBtn.addEventListener('click', () => {
      state.exploded = false;
      v.setExplode(false);
      assembledBtn.classList.add('active');
      explodedBtn.classList.remove('active');
    });
    explodedBtn.addEventListener('click', () => {
      state.exploded = true;
      v.setExplode(true);
      explodedBtn.classList.add('active');
      assembledBtn.classList.remove('active');
    });
    els.viewerToolbar.appendChild(assembledBtn);
    els.viewerToolbar.appendChild(explodedBtn);
    v.setExplode(state.exploded);
  }

  if (step.id === 'close-case' || step.id === 'fixing-ties') {
    const current = state.coverVariant[step.id] || (step.id === 'fixing-ties' ? 'coverTies' : 'cover');
    state.coverVariant[step.id] = current;

    const plainBtn = document.createElement('button');
    plainBtn.className = 'chip-btn' + (current === 'cover' ? ' active' : '');
    plainBtn.textContent = 'Plain cover';
    const tiesBtn = document.createElement('button');
    tiesBtn.className = 'chip-btn' + (current === 'coverTies' ? ' active' : '');
    tiesBtn.textContent = 'Cover with ties';

    plainBtn.addEventListener('click', () => {
      state.coverVariant[step.id] = 'cover';
      plainBtn.classList.add('active');
      tiesBtn.classList.remove('active');
      applyStepToViewer(step);
    });
    tiesBtn.addEventListener('click', () => {
      state.coverVariant[step.id] = 'coverTies';
      tiesBtn.classList.add('active');
      plainBtn.classList.remove('active');
      applyStepToViewer(step);
    });
    els.viewerToolbar.appendChild(plainBtn);
    els.viewerToolbar.appendChild(tiesBtn);
  }
}

function renderViewerLegend(step) {
  const cfg = step.viewer;
  els.viewerLegend.innerHTML = '';
  if (!cfg) return;
  const rows = [];
  if (cfg.highlight && cfg.highlight.length) {
    rows.push({ label: 'This step', color: 'var(--accent)' });
  }
  if (cfg.dim && cfg.dim.length) {
    rows.push({ label: 'Already placed', color: '#9a978d' });
  }
  for (const r of rows) {
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span class="swatch" style="background:${r.color}"></span><span>${r.label}</span>`;
    els.viewerLegend.appendChild(row);
  }
}

async function applyStepToViewer(step) {
  const cfg = step.viewer;
  if (!cfg) return;
  const v = ensureViewer();
  await v.applyStep({
    show: resolveShow(step, cfg.show || []),
    highlight: resolveShow(step, cfg.highlight || []),
    dim: resolveShow(step, cfg.dim || []),
    camera: cfg.camera,
  });
  v.setExplode(step.id === 'overview' ? state.exploded : false);
  // trigger a resize in case layout just changed visibility
  window.dispatchEvent(new Event('resize'));
}

function renderStep() {
  const step = STEPS[state.index];

  els.stepHeader.innerHTML = `
    <div class="step-header">
      <span class="kicker">${step.kicker || ''}</span>
      ${step.approx ? '<span class="badge">📍 approximate 3D placement</span>' : ''}
    </div>
    <h1>${step.title}</h1>
  `;

  renderChips(step);
  els.stepBody.innerHTML = step.body;

  const isDone = state.done.has(step.id);
  els.doneToggle.classList.toggle('done', isDone);
  els.doneToggle.innerHTML = isDone ? '✓ Marked complete' : 'Mark step complete';

  if (step.viewer) {
    els.layout.classList.remove('no-viewer');
    els.viewerCol.style.display = '';
    applyStepToViewer(step);
    renderViewerToolbar(step);
    renderViewerLegend(step);
  } else {
    els.layout.classList.add('no-viewer');
    els.viewerCol.style.display = 'none';
  }

  els.navPrev.disabled = state.index === 0;
  els.navPrev.querySelector('.label').innerHTML = state.index > 0
    ? `<small>Back</small>${STEPS[state.index - 1].title}`
    : '<small>Back</small>—';

  const isLast = state.index === STEPS.length - 1;
  els.navNext.querySelector('.label').innerHTML = isLast
    ? '<small>Finish</small>You\'re done!'
    : `<small>Next</small>${STEPS[state.index + 1].title}`;
  els.navNext.disabled = false;

  els.content.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  history.replaceState(null, '', '#' + step.id);
  renderSidebar();
  saveProgress();
}

function goTo(index) {
  state.index = Math.max(0, Math.min(STEPS.length - 1, index));
  closeMobileSidebar();
  renderStep();
}

function markDoneAndAdvance() {
  const step = STEPS[state.index];
  state.done.add(step.id);
  if (state.index < STEPS.length - 1) {
    goTo(state.index + 1);
  } else {
    renderStep();
  }
}

function toggleDone() {
  const step = STEPS[state.index];
  if (state.done.has(step.id)) state.done.delete(step.id);
  else state.done.add(step.id);
  renderStep();
}

function closeMobileSidebar() {
  els.sidebar.classList.remove('open');
  els.overlay.classList.remove('open');
}

function initFromHash() {
  const hash = location.hash.replace('#', '');
  if (hash) {
    const idx = STEPS.findIndex((s) => s.id === hash);
    if (idx >= 0) state.index = idx;
  }
}

function bindEvents() {
  els.navPrev.addEventListener('click', () => goTo(state.index - 1));
  els.navNext.addEventListener('click', markDoneAndAdvance);
  els.doneToggle.addEventListener('click', toggleDone);
  els.menuBtn.addEventListener('click', () => {
    els.sidebar.classList.add('open');
    els.overlay.classList.add('open');
  });
  els.overlay.addEventListener('click', closeMobileSidebar);
  window.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.key === 'ArrowRight') goTo(state.index + 1);
    if (e.key === 'ArrowLeft') goTo(state.index - 1);
  });
}

function main() {
  loadProgress();
  initFromHash();
  bindEvents();
  renderStep();
}

main();
