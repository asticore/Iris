/* Iris portal UI */
(function () {
  'use strict';
  const C = window.IrisCore, X = window.IrisExport;
  const GLYPHS = window.IRIS_GLYPHS, ICONS = window.IRIS_ICONS, CATS = window.IRIS_CATS || [];
  const $ = (s, el) => (el || document).querySelector(s);
  const KEY = 'iris-state-v2';

  // ---------- control schemas ----------
  const ICON_SHAPE = [
    { k: 'weight', l: 'Weight', t: 'range', min: 2, max: 20, step: 0.5 },
    { k: 'cap', l: 'Ends', t: 'select', o: ['round', 'square', 'butt'] },
    { k: 'join', l: 'Corners', t: 'select', o: ['round', 'bevel'] },
    { k: 'color', l: 'Color', t: 'color' },
    { k: 'fillMode', l: 'Fill', t: 'select', o: ['outline', 'solid'] },
    { k: 'rotate', l: 'Rotate', t: 'range', min: -180, max: 180, step: 15 },
    { k: 'flipH', l: 'Flip', t: 'check' },
  ];
  const BADGE = [
    { k: 'badge', l: 'Badge', t: 'select', o: ['none', 'circle', 'rounded', 'square'] },
    { k: 'badgeColor', l: 'Badge color', t: 'color' },
    { k: 'badgePad', l: 'Badge pad', t: 'range', min: 0, max: 40, step: 1 },
  ];
  const SHADOW = [
    { k: 'shadow', l: 'Shadow', t: 'select', o: ['none', 'flat', 'long'] },
    { k: 'shadowColor', l: 'Shadow color', t: 'color' },
    { k: 'shadowOpacity', l: 'Opacity', t: 'range', min: 0.1, max: 1, step: 0.05 },
    { k: 'shadowAngle', l: 'Angle', t: 'range', min: 0, max: 359, step: 5 },
    { k: 'shadowLen', l: 'Length', t: 'range', min: 1, max: 40, step: 1 },
  ];
  const TYPE_SHAPE = [
    { k: 'cap', l: 'Stroke ends', t: 'select', o: ['round', 'square', 'butt'] },
    { k: 'join', l: 'Corners', t: 'select', o: ['round', 'bevel'] },
    { k: 'contrast', l: 'Contrast', t: 'range', min: 0, max: 0.8, step: 0.05 },
    { k: 'slant', l: 'Slant', t: 'range', min: -20, max: 25, step: 1 },
    { k: 'widthScale', l: 'Width', t: 'range', min: 0.6, max: 1.5, step: 0.05 },
    { k: 'spacing', l: 'Spacing', t: 'range', min: -10, max: 30, step: 1 },
  ];
  const TYPE_SERIF = [
    { k: 'serif', l: 'Serifs', t: 'check' },
    { k: 'serifLen', l: 'Serif size', t: 'range', min: 4, max: 20, step: 0.5 },
    { k: 'serifThick', l: 'Serif thick', t: 'range', min: 0.3, max: 1.2, step: 0.05 },
  ];
  const ICON_PRESETS = {
    Default: {},
    'Bold circle': { weight: 10, badge: 'circle', color: '#ffffff', badgeColor: '#4f46e5' },
    'Flat shadow': { badge: 'circle', color: '#ffffff', badgeColor: '#f43f5e', shadow: 'long', shadowColor: '#9f1239', shadowLen: 30, shadowOpacity: 1 },
    'App tile': { badge: 'rounded', color: '#ffffff', badgeColor: '#0ea5e9', shadow: 'flat', shadowLen: 5, shadowOpacity: 0.3 },
    'Drop shadow': { shadow: 'flat', shadowLen: 4, shadowOpacity: 0.3 },
    'Heavy rounded': { weight: 14 },
    Solid: { fillMode: 'solid', weight: 6 },
    'Square tile': { badge: 'square', color: '#111827', badgeColor: '#fde047', weight: 9, cap: 'square', join: 'bevel' },
  };
  const TYPE_PRESETS = {
    'Sans (geometric)': {},
    'Sans (humanist)': { contrast: 0.2, cap: 'butt', widthScale: 0.95 },
    'Serif (bookish)': { serif: true, contrast: 0.55, cap: 'butt', serifLen: 10, serifThick: 0.6, join: 'bevel' },
    'Slab serif': { serif: true, cap: 'butt', serifLen: 12, serifThick: 1, join: 'bevel' },
    'Script-style': { slant: 14, contrast: 0.5, widthScale: 0.9, spacing: -3, cap: 'round' },
    Rounded: { cap: 'round', join: 'round', spacing: 3 },
    Condensed: { widthScale: 0.72, spacing: -2 },
    'Wide display': { widthScale: 1.35, spacing: 6, cap: 'butt' },
  };

  let state = {
    tab: 'icons', family: 'Iris', designer: '', license: 'SIL Open Font License 1.1',
    icon: { style: {}, sel: 'heart', cat: '' },
    type: { style: {}, previewWeight: 400, text: 'Iris Hamburgefonts\n0123456789' },
  };
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); state = Object.assign(state, s); } catch (e) {}
  const T = () => state[state.tab === 'icons' ? 'icon' : 'type'];
  const iconStyle = () => C.withDefaults(state.icon.style);
  const typeStyle = () => {
    const wc = C.WEIGHT_CLASSES.find((w) => w.n === +state.type.previewWeight) || C.WEIGHT_CLASSES[3];
    return C.withDefaults(Object.assign({}, state.type.style, { weight: wc.w, color: '#111827', badge: 'none', shadow: 'none' }));
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // ---------- controls ----------
  function control(def, st) {
    const v = st[def.k];
    const id = 'c-' + def.k;
    let inp;
    if (def.t === 'range') inp = `<input id="${id}" type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${v}">`;
    else if (def.t === 'select') inp = `<select id="${id}">${def.o.map((o) => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    else if (def.t === 'color') inp = `<input id="${id}" type="color" value="${v}">`;
    else inp = `<input id="${id}" type="checkbox"${v ? ' checked' : ''}>`;
    return `<div class="row"><label for="${id}">${def.l}</label>${inp}</div>`;
  }
  function renderControls() {
    const isIcons = state.tab === 'icons';
    const st = isIcons ? iconStyle() : C.withDefaults(state.type.style);
    const presets = isIcons ? ICON_PRESETS : TYPE_PRESETS;
    const groups = isIcons ? [['Shape', ICON_SHAPE], ['Badge', BADGE], ['Flat shadow', SHADOW]] : [['Shape', TYPE_SHAPE], ['Serifs', TYPE_SERIF]];
    let html = `<fieldset><legend>${isIcons ? 'Preset' : 'Style preset'}</legend><div class="row"><select id="preset">${Object.keys(presets).map((p) => `<option>${p}</option>`).join('')}</select><button class="b" id="reset">Reset</button></div></fieldset>`;
    if (!isIcons) html += `<fieldset><legend>Preview only</legend><div class="row"><label for="pw">Weight</label><select id="pw">${C.WEIGHT_CLASSES.map((w) => `<option value="${w.n}"${w.n === +state.type.previewWeight ? ' selected' : ''}>${w.n} ${w.name}</option>`).join('')}</select></div><p class="msg">Export always includes all 9 weights.</p></fieldset>`;
    html += groups.map(([n, defs]) => `<fieldset><legend>${n}</legend>${defs.map((d) => control(d, st)).join('')}</fieldset>`).join('');
    $('#controls').innerHTML = html;
    $('#preset').onchange = (e) => { T().style = Object.assign({}, presets[e.target.value]); renderAll(); };
    $('#reset').onclick = () => { T().style = {}; renderAll(); };
    if (!isIcons) $('#pw').onchange = (e) => { state.type.previewWeight = +e.target.value; refresh(); };
    for (const defs of groups.map((g) => g[1])) for (const d of defs) {
      const el = $('#c-' + d.k);
      el.oninput = el.onchange = () => {
        T().style[d.k] = d.t === 'check' ? el.checked : d.t === 'range' ? parseFloat(el.value) : el.value;
        refresh();
      };
    }
  }

  // ---------- icon grid (lazy rendered: there are hundreds) ----------
  const iconSvg = (name, size) => C.composeSvg(C.iconPolys(ICONS[name], iconStyle()), iconStyle(), { size });
  let io = null;
  const visible = new Set();
  function paintCell(el) { el.firstElementChild.innerHTML = iconSvg(el.dataset.n); el.dataset.p = state.rev; }
  function renderIcons() {
    const q = $('#search').value.trim().toLowerCase();
    const cat = state.icon.cat;
    const names = Object.keys(ICONS).filter((n) => (!cat || ICONS[n].c === cat) && (!q || (n + ' ' + ICONS[n].l + ' ' + ICONS[n].t).toLowerCase().includes(q)));
    const sig = names.join(',') + '|' + cat;
    $('#icon-count').textContent = `${names.length} of ${Object.keys(ICONS).length} icons`;
    if (renderIcons.sig !== sig) {
      renderIcons.sig = sig;
      visible.clear();
      if (io) io.disconnect();
      io = new IntersectionObserver((es) => es.forEach((e) => {
        if (e.isIntersecting) { visible.add(e.target); if (e.target.dataset.p != state.rev) paintCell(e.target); } else visible.delete(e.target);
      }), { rootMargin: '300px' });
      $('#icon-grid').innerHTML = names.map((n) => `<button class="cell${n === state.icon.sel ? ' sel' : ''}" data-n="${n}" title="${ICONS[n].l}"><div class="ic"></div><span>${n}</span></button>`).join('') || '<p class="msg">No icons match.</p>';
      $('#icon-grid').querySelectorAll('.cell').forEach((c) => io.observe(c));
    } else {
      visible.forEach((c) => paintCell(c));
    }
    $('#icon-grid').querySelectorAll('.cell').forEach((c) => c.classList.toggle('sel', c.dataset.n === state.icon.sel));
  }
  $('#icon-grid').onclick = (e) => { const b = e.target.closest('.cell'); if (b) { state.icon.sel = b.dataset.n; refresh(); } };

  // ---------- typeface view ----------
  const textSvg = () => C.composeSvg(C.textPolys(state.type.text, typeStyle(), GLYPHS), typeStyle());
  function renderType() {
    $('#type-text').value = state.type.text;
    $('#type-preview').innerHTML = textSvg();
    const st = typeStyle();
    $('#glyph-grid').innerHTML = Object.keys(GLYPHS).map((ch) => `<div class="cell" title="${ch}">${C.composeSvg(C.textPolys(ch, st, GLYPHS), st)}<span>${ch}</span></div>`).join('');
  }

  // ---------- inspector / exports ----------
  function busy(btn, fn) {
    return async () => { const t = btn.textContent; btn.textContent = '…'; try { await fn(); } catch (e) { alert('Export failed: ' + e.message); } btn.textContent = t; };
  }
  function renderInspector() {
    const el = $('#inspector');
    const meta = `<div class="row"><label>Font name</label><input type="text" id="fam" value="${state.family}"></div>`;
    if (state.tab === 'icons') {
      if (!ICONS[state.icon.sel]) state.icon.sel = Object.keys(ICONS)[0];
      const n = state.icon.sel;
      el.innerHTML = `<h3>${ICONS[n].l} <span class="msg">iris-${n}</span></h3><div class="big">${iconSvg(n, 0)}</div>
        <h4>Export this icon</h4><div class="btns"><button class="b p" data-a="svg">SVG</button><button class="b" data-a="png">PNG</button><button class="b" data-a="webp">WebP</button><button class="b" data-a="jpg">JPG</button><button class="b" data-a="copy">Copy SVG</button></div>
        <div class="row"><label>PNG size</label><input type="text" id="px" value="512"></div>
        <h4>Export whole set (${Object.keys(ICONS).length} icons)</h4>${meta}
        <div class="btns"><button class="b p" data-a="zip">Icon kit .zip</button><button class="b" data-a="font">Font .otf</button><button class="b" data-a="svgzip">SVGs .zip</button></div>
        <p class="msg">Kit zip: font, <code>iris.css</code> reference, one-tag <code>iris-kit.js</code>, SVG sprite, per-icon SVGs and demo page. The font is single-color; badge &amp; shadow are baked into SVG/PNG only.</p>
        <h4>Use it</h4><pre>&lt;link rel="stylesheet" href="iris.css"&gt;
&lt;i class="iris iris-${n}"&gt;&lt;/i&gt;</pre>`;
    } else {
      el.innerHTML = `<h3>Make your font</h3>${meta}
        <div class="row"><label>Designer</label><input type="text" id="designer" value="${state.designer}" placeholder="You"></div>
        <div class="row"><label>License</label><input type="text" id="license" value="${state.license}"></div>
        <h4>Export</h4><div class="btns"><button class="b p" data-a="tzip">Font family .zip (9 weights)</button><button class="b" data-a="tfont">Preview weight .otf</button></div>
        <h4>Preview text</h4><div class="btns"><button class="b" data-a="tsvg">SVG</button><button class="b" data-a="tpng">PNG</button></div>
        <p class="msg">${Object.keys(GLYPHS).length} glyphs: A–Z, a–z, 0–9, punctuation. The zip holds Thin to Black (100–900) as separate <code>.otf</code> files with <code>@font-face</code> CSS, a one-tag <code>-kit.js</code> and a demo page.</p>`;
    }
    $('#fam').oninput = (e) => { state.family = e.target.value || 'Iris'; save(); };
    if ($('#designer')) { $('#designer').oninput = (e) => { state.designer = e.target.value; save(); }; $('#license').oninput = (e) => { state.license = e.target.value; save(); }; }
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = busy(b, () => act(b.dataset.a))));
  }

  async function act(a) {
    const fam = state.family || 'Iris', slug = X.slug(fam);
    if (state.tab === 'icons') {
      const st = iconStyle(), n = state.icon.sel, px = Math.max(16, Math.min(4096, parseInt($('#px').value, 10) || 512));
      const svg = iconSvg(n, 0);
      if (a === 'svg') return X.download(`${n}.svg`, svg, 'image/svg+xml');
      if (a === 'copy') { await navigator.clipboard.writeText(svg); return; }
      if (a === 'png') return X.download(`${n}.png`, await X.svgToBlob(svg, 'image/png', px));
      if (a === 'webp') return X.download(`${n}.webp`, await X.svgToBlob(svg, 'image/webp', px, 0.95));
      if (a === 'jpg') return X.download(`${n}.jpg`, await X.svgToBlob(svg, 'image/jpeg', px, 0.95, '#ffffff'));
      const { font, map } = X.buildIconFont(fam, ICONS, st);
      const buf = X.fontBytes(font);
      if (a === 'font') return X.download(`${slug}.otf`, buf, 'font/otf');
      const zip = new JSZip();
      if (a === 'svgzip') {
        for (const name of Object.keys(ICONS)) zip.file(`${name}.svg`, iconSvg(name, 0));
        return X.download(`${slug}-svg.zip`, await zip.generateAsync({ type: 'blob' }));
      }
      const css = X.iconCss(fam, `${slug}.otf`, map);
      zip.file(`${slug}.otf`, buf);
      zip.file('iris.css', css);
      zip.file('iris-kit.js', X.kitJs(css, buf, fam));
      zip.file('iris-sprite.svg', X.iconSprite(ICONS, st));
      zip.file('demo.html', X.demoHtml('icons', fam, map.map((m) => m.name)));
      zip.file('style.json', JSON.stringify(state.icon.style, null, 2));
      for (const name of Object.keys(ICONS)) zip.file(`svg/${name}.svg`, iconSvg(name, 0));
      return X.download(`${slug}-kit.zip`, await zip.generateAsync({ type: 'blob' }));
    }
    // typeface
    const meta = { designer: state.designer, license: state.license, copyright: state.designer ? `Copyright ${new Date().getFullYear()} ${state.designer}` : '' };
    if (a === 'tsvg') return X.download(`${slug}-preview.svg`, textSvg(), 'image/svg+xml');
    if (a === 'tpng') return X.download(`${slug}-preview.png`, await X.svgToBlob(textSvg(), 'image/png', 1600));
    const base = C.withDefaults(Object.assign({}, state.type.style, { badge: 'none', shadow: 'none' }));
    if (a === 'tfont') {
      const pw = typeStyle();
      const wc = C.WEIGHT_CLASSES.find((w) => w.n === +state.type.previewWeight) || C.WEIGHT_CLASSES[3];
      const font = X.buildTypeface(fam, GLYPHS, pw, Object.assign({}, meta, { styleName: wc.name, weightClass: wc.n }));
      return X.download(X.fileOf(slug, wc), X.fontBytes(font), 'font/otf');
    }
    const family = X.buildFamily(fam, GLYPHS, base, meta);
    const zip = new JSZip();
    for (const { cls, font } of family) zip.file(X.fileOf(slug, cls), X.fontBytes(font));
    zip.file(`${slug}.css`, X.typeCss(fam, slug, family.map((f) => f.cls)));
    zip.file(`${slug}-kit.js`, X.typeKitJs(fam, slug, family));
    zip.file('demo.html', X.demoHtml('type', fam, []));
    zip.file('style.json', JSON.stringify(state.type.style, null, 2));
    return X.download(`${slug}-family.zip`, await zip.generateAsync({ type: 'blob' }));
  }

  // ---------- wiring ----------
  state.rev = 0;
  let raf = 0;
  function refresh() {
    state.rev++;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (state.tab === 'icons') renderIcons(); else renderType();
      renderInspector();
      save();
    });
  }
  function renderAll() { renderControls(); refresh(); }
  function setTab(t) {
    state.tab = t;
    document.querySelectorAll('.tabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
    $('#view-icons').hidden = t !== 'icons';
    $('#view-type').hidden = t !== 'type';
    $('#search-wrap').style.visibility = t === 'icons' ? 'visible' : 'hidden';
    renderAll();
  }
  $('#cat').innerHTML = '<option value="">All categories</option>' + CATS.map((c) => `<option>${c}</option>`).join('');
  $('#cat').value = state.icon.cat || '';
  $('#cat').onchange = (e) => { state.icon.cat = e.target.value; refresh(); };
  document.querySelectorAll('.tabs button').forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $('#search').oninput = refresh;
  $('#type-text').oninput = (e) => { state.type.text = e.target.value; refresh(); };
  setTab(state.tab);
})();
