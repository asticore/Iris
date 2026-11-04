/* Iris portal UI */
(function () {
  'use strict';
  const C = window.IrisCore, X = window.IrisExport;
  const GLYPHS = window.IRIS_GLYPHS, ICONS = window.IRIS_ICONS;
  const $ = (s, el) => (el || document).querySelector(s);
  const KEY = 'iris-state-v1';

  const SHAPE = [
    { k: 'weight', l: 'Weight', t: 'range', min: 2, max: 20, step: 0.5 },
    { k: 'cap', l: 'Ends', t: 'select', o: ['round', 'square', 'butt'] },
    { k: 'join', l: 'Corners', t: 'select', o: ['round', 'bevel'] },
    { k: 'color', l: 'Color', t: 'color' },
  ];
  const ICON_ONLY = [
    { k: 'fillMode', l: 'Fill', t: 'select', o: ['outline', 'solid'] },
    { k: 'rotate', l: 'Rotate', t: 'range', min: -180, max: 180, step: 15 },
    { k: 'flipH', l: 'Flip', t: 'check' },
  ];
  const TYPE_ONLY = [
    { k: 'serif', l: 'Serifs', t: 'check' },
    { k: 'serifLen', l: 'Serif size', t: 'range', min: 4, max: 20, step: 0.5 },
    { k: 'serifThick', l: 'Serif thick', t: 'range', min: 0.3, max: 1.2, step: 0.05 },
    { k: 'slant', l: 'Slant', t: 'range', min: -20, max: 25, step: 1 },
    { k: 'widthScale', l: 'Width', t: 'range', min: 0.6, max: 1.5, step: 0.05 },
    { k: 'spacing', l: 'Spacing', t: 'range', min: -10, max: 30, step: 1 },
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
    { k: 'shadowLen', l: 'Length', t: 'range', min: 1, max: 30, step: 1 },
  ];
  const PRESETS = {
    Default: {},
    'Bold circle': { weight: 10, badge: 'circle', color: '#ffffff', badgeColor: '#4f46e5' },
    'Flat shadow': { badge: 'circle', color: '#ffffff', badgeColor: '#f43f5e', shadow: 'long', shadowColor: '#9f1239', shadowLen: 30, shadowOpacity: 1 },
    'Duo app tile': { badge: 'rounded', color: '#ffffff', badgeColor: '#0ea5e9', shadow: 'flat', shadowLen: 5, shadowOpacity: 0.3 },
    'Slab serif': { serif: true, weight: 9, cap: 'butt', serifLen: 12 },
    'Italic serif': { serif: true, slant: 12, weight: 7 },
    'Heavy rounded': { weight: 14, cap: 'round', join: 'round', spacing: 4 },
    'Solid': { fillMode: 'solid', weight: 6 },
  };

  let state = { tab: 'icons', style: {}, sel: 'heart', text: null, family: 'Iris' };
  try { Object.assign(state, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  const style = () => C.withDefaults(state.style);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // ---------- controls ----------
  function control(def) {
    const v = style()[def.k];
    const id = 'c-' + def.k;
    let inp;
    if (def.t === 'range') inp = `<input id="${id}" type="range" min="${def.min}" max="${def.max}" step="${def.step}" value="${v}">`;
    else if (def.t === 'select') inp = `<select id="${id}">${def.o.map((o) => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    else if (def.t === 'color') inp = `<input id="${id}" type="color" value="${v}">`;
    else inp = `<input id="${id}" type="checkbox"${v ? ' checked' : ''}>`;
    return `<div class="row"><label for="${id}">${def.l}</label>${inp}</div>`;
  }
  function renderControls() {
    const t = state.tab;
    const groups = [['Shape', SHAPE.concat(t === 'icons' ? ICON_ONLY : TYPE_ONLY)], ['Badge', BADGE], ['Flat shadow', SHADOW]];
    $('#controls').innerHTML =
      `<fieldset><legend>Preset</legend><div class="row"><select id="preset">${Object.keys(PRESETS).map((p) => `<option>${p}</option>`).join('')}</select><button class="b" id="reset">Reset</button></div></fieldset>` +
      groups.map(([n, defs]) => `<fieldset><legend>${n}</legend>${defs.map(control).join('')}</fieldset>`).join('');
    $('#preset').onchange = (e) => { state.style = Object.assign({}, PRESETS[e.target.value]); renderAll(); };
    $('#reset').onclick = () => { state.style = {}; renderAll(); };
    for (const defs of groups.map((g) => g[1])) for (const d of defs) {
      const el = $('#c-' + d.k);
      el.oninput = el.onchange = () => {
        state.style[d.k] = d.t === 'check' ? el.checked : d.t === 'range' ? parseFloat(el.value) : el.value;
        refresh();
      };
    }
  }

  // ---------- rendering ----------
  const iconSvg = (name, size) => X && C.composeSvg(C.iconPolys(ICONS[name], style()), style(), { size });
  const textContent = (str) => C.textPolys(str, style(), GLYPHS);

  function renderIcons() {
    const q = $('#search').value.trim().toLowerCase();
    const names = Object.keys(ICONS).filter((n) => !q || (n + ' ' + ICONS[n].l + ' ' + ICONS[n].t).toLowerCase().includes(q));
    $('#icon-grid').innerHTML = names.map((n) => `<button class="cell${n === state.sel ? ' sel' : ''}" data-n="${n}" title="${ICONS[n].l}">${iconSvg(n)}<span>${n}</span></button>`).join('') || '<p class="msg">No icons match.</p>';
    $('#icon-grid').onclick = (e) => { const b = e.target.closest('.cell'); if (b) { state.sel = b.dataset.n; refresh(); } };
  }
  function renderType() {
    if (state.text == null) state.text = $('#type-text').value;
    $('#type-text').value = state.text;
    $('#type-preview').innerHTML = C.composeSvg(textContent(state.text), style());
    const chars = Object.keys(GLYPHS);
    $('#glyph-grid').innerHTML = chars.map((ch) => `<div class="cell" title="${ch}">${C.composeSvg(C.textPolys(ch, style(), GLYPHS), style())}<span>${ch}</span></div>`).join('');
  }

  // ---------- inspector / exports ----------
  function busy(btn, fn) {
    return async () => { const t = btn.textContent; btn.textContent = '…'; try { await fn(); } catch (e) { alert('Export failed: ' + e.message); } btn.textContent = t; };
  }
  function renderInspector() {
    const el = $('#inspector');
    if (state.tab === 'icons') {
      const n = ICONS[state.sel] ? state.sel : Object.keys(ICONS)[0];
      state.sel = n;
      const svg = iconSvg(n, 0);
      el.innerHTML = `<h3>${ICONS[n].l} <span class="msg">iris-${n}</span></h3><div class="big">${svg}</div>
        <h4>Export this icon</h4><div class="btns"><button class="b p" data-a="svg">SVG</button><button class="b" data-a="png">PNG</button><button class="b" data-a="webp">WebP</button><button class="b" data-a="jpg">JPG</button><button class="b" data-a="copy">Copy SVG</button></div>
        <div class="row"><label>PNG size</label><input type="text" id="px" value="512"></div>
        <h4>Export whole set (${Object.keys(ICONS).length} icons)</h4>
        <div class="row"><label>Font name</label><input type="text" id="fam" value="${state.family}"></div>
        <div class="btns"><button class="b p" data-a="zip">Icon kit .zip</button><button class="b" data-a="font">Font .otf</button><button class="b" data-a="svgzip">SVGs .zip</button></div>
        <p class="msg">Kit zip: font, <code>iris.css</code> reference, one-tag <code>iris-kit.js</code>, SVG sprite, per-icon SVGs and demo page. Font files are single-color; badge &amp; shadow are baked into SVG/PNG only.</p>
        <h4>Use it</h4><pre>&lt;link rel="stylesheet" href="iris.css"&gt;
&lt;i class="iris iris-${n}"&gt;&lt;/i&gt;</pre>`;
    } else {
      el.innerHTML = `<h3>Typeface</h3><div class="row"><label>Font name</label><input type="text" id="fam" value="${state.family}"></div>
        <h4>Export font</h4><div class="btns"><button class="b p" data-a="tzip">Font kit .zip</button><button class="b" data-a="tfont">Font .otf</button></div>
        <h4>Export preview text</h4><div class="btns"><button class="b" data-a="tsvg">SVG</button><button class="b" data-a="tpng">PNG</button></div>
        <p class="msg">${Object.keys(GLYPHS).length} glyphs: A–Z, a–z, 0–9, punctuation. Serif, slant, width, weight and spacing are baked into the font. Kit zip adds <code>.css</code>, a one-tag <code>-kit.js</code> and a demo page.</p>`;
    }
    $('#fam').oninput = (e) => { state.family = e.target.value || 'Iris'; save(); };
    el.querySelectorAll('[data-a]').forEach((b) => (b.onclick = busy(b, () => act(b.dataset.a))));
  }

  async function act(a) {
    const fam = state.family || 'Iris', slug = X.slug(fam), st = style();
    if (state.tab === 'icons') {
      const n = state.sel, px = Math.max(16, Math.min(4096, parseInt($('#px').value, 10) || 512));
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
      zip.file('style.json', JSON.stringify(state.style, null, 2));
      for (const name of Object.keys(ICONS)) zip.file(`svg/${name}.svg`, iconSvg(name, 0));
      return X.download(`${slug}-kit.zip`, await zip.generateAsync({ type: 'blob' }));
    }
    // typeface
    if (a === 'tsvg') return X.download(`${slug}-preview.svg`, C.composeSvg(textContent(state.text), st), 'image/svg+xml');
    if (a === 'tpng') return X.download(`${slug}-preview.png`, await X.svgToBlob(C.composeSvg(textContent(state.text), st), 'image/png', 1600));
    const font = X.buildTypeface(fam, GLYPHS, st);
    const buf = X.fontBytes(font);
    if (a === 'tfont') return X.download(`${slug}.otf`, buf, 'font/otf');
    const zip = new JSZip();
    zip.file(`${slug}.otf`, buf);
    zip.file(`${slug}.css`, X.typeCss(fam, `${slug}.otf`));
    zip.file(`${slug}-kit.js`, X.typeKitJs(fam, buf));
    zip.file('demo.html', X.demoHtml('type', fam, []));
    zip.file('style.json', JSON.stringify(state.style, null, 2));
    return X.download(`${slug}-kit.zip`, await zip.generateAsync({ type: 'blob' }));
  }

  // ---------- wiring ----------
  let raf = 0;
  function refresh() {
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
    $('#search').style.visibility = t === 'icons' ? 'visible' : 'hidden';
    renderAll();
  }
  document.querySelectorAll('.tabs button').forEach((b) => (b.onclick = () => setTab(b.dataset.tab)));
  $('#search').oninput = refresh;
  $('#type-text').oninput = (e) => { state.text = e.target.value; refresh(); };
  if (state.text != null) $('#type-text').value = state.text;
  setTab(state.tab);
})();
