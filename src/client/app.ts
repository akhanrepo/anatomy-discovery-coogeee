/** Tabula browser controller: progressively enhances the server-rendered app (F01, F02, F03, F07, F08, F09, F10, F13). */
import { stateAt, activeMisbeliefs, indexByStructure, countKnown } from '../lib/state';
import { makeScale, formatYear } from '../lib/scale';
import { parseView, serializeView, type ViewState } from '../lib/url-state';
import { eraAt } from '../lib/era';
import type { ClientModel } from '../lib/model';

declare global { interface Window { tabulaTrack?: (n: string, p?: Record<string, unknown>) => void } }

const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const track = (n: string, p?: Record<string, unknown>) => window.tabulaTrack?.(n, p);
const LAYERS = ['surface', 'muscles', 'viscera', 'skeleton'];
const mobile = () => matchMedia('(max-width: 899px)').matches;

export function start() {
  const app = $('[data-app]');
  if (!app) return;
  const model = JSON.parse($('#tabula-model')!.textContent!) as ClientModel;
  const fog = model.fog;
  const idx = indexByStructure(fog);
  const scale = makeScale(model.anchors);
  const storied = model.structures.filter((s) => idx.has(s.id)).map((s) => s.id);

  const figure = $('.figure-stage')!;
  const slider = $('[data-slider]')!;
  const thumb = $('[data-thumb]')!;
  const fill = $('[data-fill]')!;
  const panel = $('[data-panel]')!;
  const announcer = $('[data-announcer]')!;
  const stEls = new Map($$('.st', figure).map((g) => [g.dataset.id!, g]));
  const mbEls = new Map($$('.mb', figure).map((g) => [g.dataset.mb!, g]));
  const listStates = new Map($$('[data-state-of]').map((e) => [e.dataset.stateOf!, e]));

  const view: Required<Pick<ViewState, 'y' | 'fig' | 'layer'>> & { d?: string; m?: string; k?: string; lens: string } = {
    y: Number(app.dataset.year), fig: (figure.dataset.fig as 'male' | 'female') ?? 'male', layer: figure.dataset.layer ?? 'viscera', d: app.dataset.open || undefined, lens: 'modern',
  };
  let lastFocus: HTMLElement | null = null;
  let pushedHistory = false;
  let urlTimer: number | undefined;
  let sliderTrackTimer: number | undefined;
  const opened = new Set<string>((() => { try { return JSON.parse(sessionStorage.getItem('tabula-opened') ?? '[]'); } catch { return []; } })());

  const announce = (msg: string) => { announcer.textContent = ''; requestAnimationFrame(() => (announcer.textContent = msg)); };
  let ignorePop = false;
  const currentUrl = () => `${location.pathname}${serializeView({ y: view.y, d: view.d, fig: view.fig, lens: view.lens, layer: view.layer })}`;
  const syncUrl = (replace = true) => {
    clearTimeout(urlTimer);
    if (!replace) { history.pushState({ tabula: true }, '', currentUrl()); return; }
    urlTimer = window.setTimeout(() => history.replaceState(history.state, '', currentUrl()), 250);
  };

  // ── Year (F02) ─────────────────────────────────────────────────────
  function setYear(y: number, opts: { method?: string; quiet?: boolean } = {}) {
    y = Math.max(scale.min, Math.min(fog.present, Math.round(y)));
    view.y = y;
    app!.dataset.year = String(y);
    for (const [id, g] of stEls) {
      const s = stateAt(id, y, fog, idx);
      if (g.dataset.state !== s) g.dataset.state = s;
      const le = listStates.get(id);
      if (le && le.textContent !== s) le.textContent = s;
    }
    const phases = activeMisbeliefs(y, fog);
    for (const [id, g] of mbEls) if (g.dataset.phase !== phases[id]) g.dataset.phase = phases[id];
    const era = eraAt(model.eras, y);
    document.body.dataset.paper = era.paper;
    $('[data-era-label]')!.textContent = era.label;
    const et = $('[data-era-text]')!;
    if (et.textContent !== era.caption) { et.textContent = era.caption; et.dataset.script = era.script; }
    const pos = scale.toPos(y) * 100;
    thumb.style.left = `${pos}%`;
    fill.style.width = `${pos}%`;
    $('[data-thumb-year]')!.textContent = formatYear(y, fog.present);
    const known = countKnown(storied, y, fog, idx);
    $('[data-counter]')!.textContent = `${known} of ${storied.length} storied structures known`;
    slider.setAttribute('aria-valuenow', String(y));
    slider.setAttribute('aria-valuetext', `${formatYear(y, fog.present)}. ${era.caption} ${known} of ${storied.length} structures known.`);
    for (const b of $$('[data-anchor]', $('.anchors')!)) b.setAttribute('aria-pressed', String(Number(b.dataset.anchor) === era.yearStart));
    updateNotYet();
    if (!opts.quiet) syncUrl();
    if (opts.method) {
      clearTimeout(sliderTrackTimer);
      sliderTrackTimer = window.setTimeout(() => track('slider_change', { toYear: y, method: opts.method }), 800);
    }
  }

  function updateNotYet() {
    const art = view.d ? $(`[data-story="${view.d}"]`) : null;
    if (!art) return;
    const banner = $('[data-not-yet]', art)!;
    const sy = Number(art.dataset.year);
    banner.hidden = view.y >= sy;
    $('[data-cur-year]', art)!.textContent = formatYear(view.y, fog.present);
  }

  // slider: pointer + keyboard
  const fromPointer = (e: PointerEvent) => {
    const r = $('.slider-track', slider)!.getBoundingClientRect();
    return scale.toYear((e.clientX - r.left) / r.width);
  };
  let dragging = false;
  slider.addEventListener('pointerdown', (e) => { dragging = true; stopPlay(); slider.setPointerCapture(e.pointerId); setYear(fromPointer(e), { method: 'drag' }); });
  slider.addEventListener('pointermove', (e) => { if (dragging) setYear(fromPointer(e), { method: 'drag' }); });
  slider.addEventListener('pointerup', () => (dragging = false));
  slider.addEventListener('keydown', (e) => {
    const big = e.shiftKey ? 10 : 1;
    const map: Record<string, () => number> = {
      ArrowRight: () => view.y + big, ArrowUp: () => view.y + big, ArrowLeft: () => view.y - big, ArrowDown: () => view.y - big,
      PageUp: () => scale.nextAnchor(view.y), PageDown: () => scale.prevAnchor(view.y), Home: () => scale.min, End: () => fog.present,
    };
    if (map[e.key]) { e.preventDefault(); stopPlay(); setYear(map[e.key](), { method: e.key.startsWith('Page') ? 'anchor' : 'key' }); }
  });
  for (const b of $$('[data-anchor]')) b.addEventListener('click', () => { stopPlay(); setYear(Number(b.dataset.anchor), { method: 'anchor' }); });
  for (const b of $$('[data-step]')) b.addEventListener('click', () => { stopPlay(); setYear(b.dataset.step === '1' ? scale.nextAnchor(view.y) : scale.prevAnchor(view.y), { method: 'anchor' }); });

  // autoplay
  let playTimer: number | undefined;
  const playBtn = $('[data-play]')!;
  function stopPlay() { clearInterval(playTimer); playTimer = undefined; playBtn.setAttribute('aria-pressed', 'false'); playBtn.textContent = '▶ Play history'; }
  playBtn.addEventListener('click', () => {
    if (playTimer) return stopPlay();
    playBtn.setAttribute('aria-pressed', 'true'); playBtn.textContent = '❚❚ Pause';
    if (view.y >= fog.present) setYear(scale.min, { method: 'autoplay' });
    playTimer = window.setInterval(() => {
      const next = scale.nextAnchor(view.y);
      setYear(next, { method: 'autoplay' });
      if (next >= fog.present) stopPlay();
    }, 7000);
  });

  // ── Layers (F13) and figure (F01) ──────────────────────────────────
  function setLayer(l: string, opts: { announce?: boolean } = {}) {
    if (!LAYERS.includes(l) || l === view.layer && figure.dataset.layer === l) return;
    view.layer = l;
    figure.dataset.layer = l;
    for (const f of $$('.flap', figure)) f.setAttribute('aria-hidden', String(f.dataset.flap !== l));
    for (const b of $$('[data-layer-btn]')) { const on = b.dataset.layerBtn === l; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; }
    refreshFocusable();
    if (opts.announce) announce(`Showing the ${$(`[data-layer-btn="${l}"]`)!.textContent} layer`);
    track('flap_open', { layer: l });
    syncUrl();
  }
  const tabs = $$('[data-layer-btn]');
  tabs.forEach((b, i) => {
    b.addEventListener('click', () => setLayer(b.dataset.layerBtn!, { announce: true }));
    b.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      const n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); setLayer(n.dataset.layerBtn!, { announce: true });
    });
  });

  function setFig(f: 'male' | 'female') {
    view.fig = f;
    figure.dataset.fig = f;
    for (const b of $$('[data-fig-btn]')) b.setAttribute('aria-pressed', String(b.dataset.figBtn === f));
    for (const li of $$('[data-sex-item]')) li.hidden = li.dataset.sexItem !== 'both' && li.dataset.sexItem !== f;
    refreshFocusable();
    syncUrl();
  }
  for (const b of $$('[data-fig-btn]')) b.addEventListener('click', () => setFig(b.dataset.figBtn as 'male' | 'female'));

  function refreshFocusable() {
    for (const [, g] of stEls) {
      const sex = g.dataset.sex;
      const ok = g.dataset.layer === view.layer && (!sex || sex === view.fig) && g.dataset.id !== 'skin';
      g.setAttribute('tabindex', ok ? '0' : '-1');
    }
  }

  // ── Panel: stories, misbeliefs, concepts (F03, F09, F10) ───────────
  const isOpen = () => panel.classList.contains('is-open');
  let shown: HTMLElement | null = $('.stories > article:not([hidden])');
  const intro = $('[data-intro]')!;
  const contextNote = $('[data-context-note]')!;
  function showArticle(sel: string) {
    if (shown) shown.hidden = true;
    intro.hidden = true;
    contextNote.hidden = true;
    shown = $(sel);
    if (shown) shown.hidden = false;
    return shown;
  }
  const later = (fn: () => void) => requestAnimationFrame(() => setTimeout(fn, 0));
  /** run after the current frame has painted */
  const afterPaint = (fn: () => void) => requestAnimationFrame(() => requestAnimationFrame(fn));
  function openPanel(by: string) {
    panel.classList.add('is-open');
    if (mobile()) { panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-modal', 'true'); }
    if (by === 'user' && !pushedHistory) { pushedHistory = true; syncUrl(false); } else syncUrl();
  }
  function highlight(structures: string[]) {
    for (const [, g] of stEls) g.classList.toggle('selected', structures.includes(g.dataset.id!));
    const first = model.structures.find((s) => s.id === structures[0]);
    $('[data-fig-label]')!.textContent = first ? first.name : '';
  }

  function openStory(id: string, source = 'map') {
    const d = model.discoveries.find((x) => x.id === id);
    if (!d) return;
    view.d = id; view.m = undefined;
    const art = showArticle(`[data-story="${id}"]`)!;
    if (d.structures.some((s) => model.structures.find((x) => x.id === s)?.sex === 'female') && view.fig !== 'female') setFig('female');
    else if (d.structures.some((s) => model.structures.find((x) => x.id === s)?.sex === 'male') && view.fig !== 'male') setFig('male');
    if (d.layer !== view.layer) setLayer(d.layer, { announce: true });
    const stay = ($('[data-stay]') as HTMLInputElement).checked;
    // panel first, then the ink animates to the story's year (keeps tap→story under 100ms, F01-AC2)
    if (!stay && source !== 'deeplink') afterPaint(() => setYear(d.yearStart, { quiet: true }));
    highlight(d.structures);
    updateNotYet();
    openPanel(source === 'deeplink' || source === 'tour' ? 'load' : 'user');
    const h = $('h2', art) as HTMLElement | null;
    h?.setAttribute('tabindex', '-1');
    // Move focus to the story after paint, unless the reader has moved it meanwhile (e.g. on to Pause in a tour).
    const focusAtOpen = document.activeElement;
    if (source !== 'deeplink') afterPaint(() => { if (document.activeElement === focusAtOpen) h?.focus({ preventScroll: mobile() }); });
    later(() => {
      track('story_open', { discoveryId: id, source });
      if (!opened.has(id)) {
        opened.add(id);
        try { sessionStorage.setItem('tabula-opened', JSON.stringify([...opened])); } catch { /* private mode */ }
        if (opened.size === 3) { track('stories_3plus'); const n = $('[data-subscribe-nudge]'); if (n) n.hidden = false; }
      }
    });
  }
  function openMisbelief(id: string) {
    const mb = model.misbeliefs.find((x) => x.id === id);
    if (!mb) return;
    view.m = id;
    const art = showArticle(`[data-misbelief="${id}"]`)!;
    if (mb.layer !== view.layer) setLayer(mb.layer, { announce: true });
    highlight(mb.structures);
    openPanel('user');
    ($('h2', art) as HTMLElement | null)?.focus();
    track('misbelief_view', { misbeliefId: id });
  }
  function openConcept(id: string) {
    const art = showArticle(`[data-concept="${id}"]`)!;
    view.k = id;
    openPanel('user');
    ($('h2', art) as HTMLElement | null)?.focus();
  }
  function openContext(structureId: string) {
    showArticle('#none');
    const note = $('[data-context-note]')!;
    note.hidden = false;
    $('[data-context-name]')!.textContent = model.structures.find((s) => s.id === structureId)?.name ?? '';
    highlight([structureId]);
    openPanel('user');
  }
  function closePanel(fromHistory = false) {
    if (!isOpen() && !view.d) return;
    panel.classList.remove('is-open');
    panel.removeAttribute('role'); panel.removeAttribute('aria-modal');
    if (shown) shown.hidden = true;
    shown = null;
    contextNote.hidden = true;
    intro.hidden = false;
    highlight([]);
    view.d = undefined; view.m = undefined; view.k = undefined;
    if (pushedHistory && !fromHistory) { pushedHistory = false; ignorePop = true; clearTimeout(urlTimer); history.back(); } else { pushedHistory = false; syncUrl(); }
    lastFocus?.focus();
  }

  function onStructure(id: string, el: HTMLElement | null) {
    lastFocus = el;
    const ds = model.discoveries.filter((d) => d.structures.includes(id) && idx.get(id)?.some((x) => x.id === d.id));
    const pick = [...ds].reverse().find((d) => d.yearStart <= view.y) ?? ds[0];
    if (pick) return openStory(pick.id, 'map');
    const mb = model.misbeliefs.find((m) => m.structures.includes(id) && mbEls.get(m.id)?.dataset.phase === 'red');
    if (mb) return openMisbelief(mb.id);
    const anyStory = model.discoveries.find((d) => d.structures.includes(id));
    if (anyStory) return openStory(anyStory.id, 'map');
    openContext(id);
  }
  figure.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<HTMLElement>('.st');
    if (g && g.closest('.flap')?.getAttribute('aria-hidden') === 'false') onStructure(g.dataset.id!, g);
  });
  figure.addEventListener('keydown', (e) => {
    const g = (e.target as Element).closest<HTMLElement>('.st');
    if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onStructure(g.dataset.id!, g); }
  });
  for (const b of $$('[data-structure]')) b.addEventListener('click', () => onStructure(b.dataset.structure!, b));

  document.addEventListener('click', (e) => {
    const t = e.target as Element;
    const os = t.closest<HTMLElement>('[data-open-story]');
    if (os && app!.contains(os)) { e.preventDefault(); lastFocus = os; openStory(os.dataset.openStory!, 'nav'); return; }
    const om = t.closest<HTMLElement>('[data-open-misbelief]');
    if (om) { lastFocus = om; openMisbelief(om.dataset.openMisbelief!); return; }
    const oc = t.closest<HTMLElement>('[data-open-concept]');
    if (oc) { lastFocus = oc; openConcept(oc.dataset.openConcept!); return; }
    const j = t.closest<HTMLElement>('[data-jump]');
    if (j) { setYear(Number(j.dataset.jump), { method: 'jump' }); return; }
    const fn = t.closest<HTMLElement>('sup.fn a');
    if (fn) track('citation_open', { discoveryId: view.d });
    const cor = t.closest<HTMLElement>('[data-track="correction_start"]');
    if (cor) track('correction_start', { discoveryId: view.d });
    const sh = t.closest<HTMLElement>('[data-share]');
    if (sh) share(sh.dataset.share!);
  });
  $('[data-close]')!.addEventListener('click', () => closePanel());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) { e.preventDefault(); closePanel(); }
    if (e.key === 'Tab' && isOpen() && mobile()) trapFocus(e);
  });
  window.addEventListener('popstate', () => {
    if (ignorePop) { ignorePop = false; return; }
    const v = parseView(location.search);
    if (!v.d && isOpen()) closePanel(true);
    else if (v.d && v.d !== view.d) openStory(v.d, 'deeplink');
    pushedHistory = false;
  });
  function trapFocus(e: KeyboardEvent) {
    const f = $$<HTMLElement>('a[href], button:not([disabled]), input, [tabindex="0"]', panel).filter((x) => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    else if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
  }

  // ── Lens (F10) and beliefs toggle (F09) ────────────────────────────
  const lensSelect = $('[data-lens-select]') as HTMLSelectElement;
  function setLens(id: string) {
    view.lens = id;
    lensSelect.value = id;
    const layer = $('[data-lens-layer]')!;
    layer.hidden = id === 'modern';
    figure.classList.toggle('under-lens', id !== 'modern');
    for (const s of $$('[data-lens-view]')) s.hidden = s.dataset.lensView !== id;
    track('lens_change', { lens: id });
    syncUrl();
  }
  lensSelect.addEventListener('change', () => setLens(lensSelect.value));
  const beliefs = $('[data-beliefs-toggle]') as HTMLInputElement;
  beliefs.addEventListener('change', () => (figure.dataset.beliefs = beliefs.checked ? 'on' : 'off'));

  // ── Share (F07) ────────────────────────────────────────────────────
  async function share(id: string) {
    const d = model.discoveries.find((x) => x.id === id);
    const url = `${location.origin}/tab/${id}/${serializeView({ y: view.y })}`;
    track('share_click', { discoveryId: id, channel: typeof navigator.share === 'function' ? 'native' : 'copy' });
    try {
      if (typeof navigator.share === 'function') await navigator.share({ title: d ? `Tab. ${d.plate}: ${d.title}` : app!.dataset.siteName ?? '', url });
      else { await navigator.clipboard.writeText(url); announce('Link copied'); }
    } catch { /* user cancelled */ }
  }

  // ── Zoom 1× / 2× / 4× (F01) ────────────────────────────────────────
  const ZOOMS = [1, 2, 4];
  let zi = 0;
  const stageEl = $('[data-stage]')!;
  const scroller = $('[data-stage-scroll]')!;
  function setZoom(i: number) {
    const sel = $('.st.selected', figure);
    zi = Math.max(0, Math.min(ZOOMS.length - 1, i));
    stageEl.style.setProperty('--zoom', String(ZOOMS[zi]));
    stageEl.dataset.zoom = String(ZOOMS[zi]);
    $('[data-zoom-level]')!.textContent = `${ZOOMS[zi]}×`;
    // keep the selected structure (or the centre) in view
    requestAnimationFrame(() => {
      const r = sel?.getBoundingClientRect(), s = scroller.getBoundingClientRect();
      if (r) scroller.scrollBy({ left: r.left + r.width / 2 - (s.left + s.width / 2), top: r.top + r.height / 2 - (s.top + s.height / 2) });
      else scroller.scrollTo({ left: (scroller.scrollWidth - scroller.clientWidth) / 2, top: (scroller.scrollHeight - scroller.clientHeight) / 3 });
    });
  }
  for (const b of $$('[data-zoom]')) b.addEventListener('click', () => setZoom(zi + Number(b.dataset.zoom)));

  // ── Guided tours (F11) ─────────────────────────────────────────────
  const bar = $('[data-tour-bar]')!;
  const pauseBtn = $('[data-tour-pause]')!;
  let tour: { id: string; title: string; discoveries: string[] } | undefined;
  let tourIdx = 0;
  let tourTimer: number | undefined;
  let tourPaused = false;
  const TOUR_STEP_MS = 12000;
  function tourGo(i: number) {
    if (!tour) return;
    tourIdx = Math.max(0, Math.min(tour.discoveries.length - 1, i));
    openStory(tour.discoveries[tourIdx], 'tour');
    $('[data-tour-pos]')!.textContent = `${tourIdx + 1} of ${tour.discoveries.length}`;
    scheduleTour();
  }
  function scheduleTour() {
    clearTimeout(tourTimer);
    if (!tour || tourPaused) return;
    tourTimer = window.setTimeout(() => { if (tour && tourIdx < tour.discoveries.length - 1) tourGo(tourIdx + 1); else setTourPaused(true); }, TOUR_STEP_MS);
  }
  function setTourPaused(p: boolean) {
    tourPaused = p;
    pauseBtn.setAttribute('aria-pressed', String(p));
    pauseBtn.textContent = p ? 'Resume' : 'Pause';
    if (p) clearTimeout(tourTimer); else scheduleTour();
  }
  function startTour(id: string) {
    tour = model.threads.find((t) => t.id === id);
    if (!tour) return;
    bar.hidden = false;
    $('[data-tour-title]')!.textContent = tour.title;
    setTourPaused(false);
    tourGo(0);
  }
  function exitTour() {
    tour = undefined; clearTimeout(tourTimer); bar.hidden = true;
    history.replaceState(history.state, '', currentUrl());
  }
  $('[data-tour-next]')!.addEventListener('click', () => tourGo(tourIdx + 1));
  $('[data-tour-prev]')!.addEventListener('click', () => tourGo(tourIdx - 1));
  pauseBtn.addEventListener('click', () => setTourPaused(!tourPaused));
  $('[data-tour-exit]')!.addEventListener('click', exitTour);
  panel.addEventListener('pointerdown', () => tour && setTourPaused(true));

  // ── Initial state from URL (F02-AC5, F07-AC1) ──────────────────────
  const v = parseView(location.search);
  if (v.fig) setFig(v.fig); else setFig(view.fig);
  if (v.layer) setLayer(v.layer); else refreshFocusable();
  if (v.lens) setLens(v.lens);
  if (v.tour) startTour(v.tour);
  else if (v.d && model.discoveries.some((d) => d.id === v.d)) openStory(v.d, 'deeplink');
  else if (v.m && model.misbeliefs.some((m) => m.id === v.m)) openMisbelief(v.m);
  else if (view.d) openStory(view.d, 'deeplink');
  setYear(v.y ?? view.y, { quiet: true });
  document.documentElement.classList.add('js');
}
