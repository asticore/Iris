/*
 * Iris core: stroke-skeleton data -> outline polygons -> SVG / font paths.
 * Pure functions, no DOM. Works in the browser (window.IrisCore) and node (require).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.IrisCore = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const GUIDES = [15, 42, 75, 95]; // cap/asc, x-height, baseline, descender
  const BASELINE = 75;
  const RAD = Math.PI / 180;

  // ---------- geometry helpers ----------
  function expand(items) {
    const pts = [];
    let closed = false;
    const push = (x, y) => {
      const l = pts[pts.length - 1];
      if (!l || Math.abs(l[0] - x) > 0.01 || Math.abs(l[1] - y) > 0.01) pts.push([x, y]);
    };
    for (const it of items) {
      if (it === 'z') { closed = true; continue; }
      if (it[0] === 'arc') {
        const [, cx, cy, rx, ry, a0, a1] = it;
        const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 9));
        for (let i = 0; i <= n; i++) {
          const a = (a0 + ((a1 - a0) * i) / n) * RAD;
          push(cx + rx * Math.cos(a), cy + ry * Math.sin(a));
        }
      } else push(it[0], it[1]);
    }
    if (pts.length > 2) {
      const f = pts[0], l = pts[pts.length - 1];
      if (Math.abs(f[0] - l[0]) < 0.01 && Math.abs(f[1] - l[1]) < 0.01) { pts.pop(); closed = true; }
    }
    return { pts, closed };
  }

  function area(p) {
    let a = 0;
    for (let i = 0; i < p.length; i++) {
      const q = p[(i + 1) % p.length];
      a += p[i][0] * q[1] - q[0] * p[i][1];
    }
    return a / 2;
  }
  // consistent winding so nonzero fill = union of all pieces
  function orient(p, positive = true) {
    if ((area(p) > 0) !== positive) p.reverse();
    return p;
  }

  function circle(cx, cy, r, n = 20) {
    const p = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 2 * Math.PI;
      p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return p;
  }

  function hull(points) {
    const pts = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [];
    for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    const up = [];
    for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    lo.pop(); up.pop();
    return lo.concat(up);
  }

  // Turn a pen centre line into a set of overlapping same-winding polygons.
  function strokePolys(pts, closed, w, cap = 'round', join = 'round') {
    const h = w / 2;
    const out = [];
    if (pts.length === 1) { out.push(orient(circle(pts[0][0], pts[0][1], h))); return out; }
    const n = pts.length;
    const segCount = closed ? n : n - 1;
    const dirs = [];
    for (let i = 0; i < segCount; i++) {
      const a = pts[i], b = pts[(i + 1) % n];
      const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
      dirs.push(len < 1e-6 ? null : [dx / len, dy / len, len]);
    }
    for (let i = 0; i < segCount; i++) {
      const d = dirs[i];
      if (!d) continue;
      let a = pts[i], b = pts[(i + 1) % n];
      if (cap === 'square' && !closed) {
        if (i === 0) a = [a[0] - d[0] * h, a[1] - d[1] * h];
        if (i === segCount - 1) b = [b[0] + d[0] * h, b[1] + d[1] * h];
      }
      const nx = -d[1] * h, ny = d[0] * h;
      out.push(orient([[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]));
    }
    const joinAt = (v, d1, d2) => {
      if (!d1 || !d2) return;
      const cr = d1[0] * d2[1] - d1[1] * d2[0];
      const dt = d1[0] * d2[0] + d1[1] * d2[1];
      const turn = Math.abs(Math.atan2(cr, dt)) / RAD;
      if (turn < 0.5) return;
      if (join === 'round' && turn > 25) { out.push(orient(circle(v[0], v[1], h))); return; }
      const n1 = [-d1[1] * h, d1[0] * h], n2 = [-d2[1] * h, d2[0] * h];
      out.push(orient(hull([[v[0] + n1[0], v[1] + n1[1]], [v[0] - n1[0], v[1] - n1[1]], [v[0] + n2[0], v[1] + n2[1]], [v[0] - n2[0], v[1] - n2[1]]])));
    };
    if (closed) for (let i = 0; i < n; i++) joinAt(pts[i], dirs[(i - 1 + segCount) % segCount], dirs[i]);
    else for (let i = 1; i < n - 1; i++) joinAt(pts[i], dirs[i - 1], dirs[i]);
    if (!closed && cap === 'round') {
      out.push(orient(circle(pts[0][0], pts[0][1], h)));
      out.push(orient(circle(pts[n - 1][0], pts[n - 1][1], h)));
    }
    return out;
  }

  const xf = (polys, fn) => polys.map((p) => p.map(([x, y]) => fn(x, y)));
  const move = (polys, dx, dy) => xf(polys, (x, y) => [x + dx, y + dy]);

  // ---------- defaults ----------
  const DEFAULT_STYLE = {
    // shape
    weight: 8, cap: 'round', join: 'round', fillMode: 'outline', rotate: 0, flipH: false,
    // type only
    serif: false, serifLen: 11, serifThick: 0.7, contrast: 0, slant: 0, widthScale: 1, spacing: 0,
    // composition
    color: '#111827', badge: 'none', badgeColor: '#4f46e5', badgePad: 14, pad: 8,
    shadow: 'none', shadowColor: '#000000', shadowOpacity: 0.35, shadowAngle: 45, shadowLen: 6,
  };
  const WEIGHT_CLASSES = [
    { n: 100, name: 'Thin', w: 2.5 }, { n: 200, name: 'ExtraLight', w: 4 }, { n: 300, name: 'Light', w: 6 },
    { n: 400, name: 'Regular', w: 8 }, { n: 500, name: 'Medium', w: 10 }, { n: 600, name: 'SemiBold', w: 12 },
    { n: 700, name: 'Bold', w: 14.5 }, { n: 800, name: 'ExtraBold', w: 17 }, { n: 900, name: 'Black', w: 20 },
  ];
  const withDefaults = (s) => Object.assign({}, DEFAULT_STYLE, s || {});

  // ---------- glyphs ----------
  function glyphPolys(g, style) {
    const st = withDefaults(style);
    const ws = st.widthScale;
    const strokes = g.s.map((s) => {
      const e = expand(s);
      return { pts: e.pts.map(([x, y]) => [x * ws, y]), closed: e.closed };
    });
    const pieces = strokes.map((s) => ({ pts: s.pts, closed: s.closed, w: st.weight, cap: st.cap, join: st.join }));
    if (st.serif) {
      const sl = st.serifLen, sw = Math.max(1, st.weight * st.serifThick);
      for (const s of strokes) {
        if (s.closed || s.pts.length < 2) continue;
        const ends = [[s.pts[0], s.pts[1]], [s.pts[s.pts.length - 1], s.pts[s.pts.length - 2]]];
        for (const [p, q] of ends) {
          const onGuide = GUIDES.some((gy) => Math.abs(p[1] - gy) < 1.5);
          const dx = q[0] - p[0], dy = q[1] - p[1];
          if (!onGuide || Math.abs(dy) < Math.abs(dx) * 1.5) continue;
          // butt-ended slab so the serif sits flush on the guide line
          pieces.push({ pts: [[p[0] - sl, p[1]], [p[0] + sl, p[1]]], closed: false, w: sw, cap: 'butt', join: 'bevel' });
        }
      }
    }
    // contrast: stretch y, stroke, squash y -> horizontals get thinner than verticals (broad-nib look)
    const k = 1 / (1 - Math.min(0.85, Math.max(0, st.contrast)));
    const polys = [];
    for (const pc of pieces) {
      const pts = k === 1 ? pc.pts : pc.pts.map(([x, y]) => [x, BASELINE + (y - BASELINE) * k]);
      let ps = strokePolys(pts, pc.closed, pc.w, pc.cap, pc.join);
      if (k !== 1) ps = xf(ps, (x, y) => [x, BASELINE + (y - BASELINE) / k]);
      polys.push(...ps);
    }
    // keep heavy weights inside the advance box
    const extra = Math.max(0, st.weight - 8);
    let out = move(polys, extra / 2, 0);
    if (st.slant) {
      const t = Math.tan(st.slant * RAD);
      out = xf(out, (x, y) => [x + (BASELINE - y) * t, y]);
    }
    return { polys: out, adv: g.w * ws + extra + st.spacing };
  }

  // Lay out a string. Returns polys in a coordinate space where y=0..100 is line one.
  function textPolys(str, style, glyphs, opts) {
    const st = withDefaults(style);
    const lineH = (opts && opts.lineHeight) || 112;
    const lines = String(str).split('\n');
    const polys = [];
    let maxW = 0;
    lines.forEach((line, li) => {
      let x = 0;
      for (const ch of line) {
        const g = glyphs[ch];
        if (!g) { x += 34 * st.widthScale + st.spacing; continue; }
        const r = glyphPolys(g, st);
        polys.push(...move(r.polys, x, li * lineH));
        x += r.adv;
      }
      maxW = Math.max(maxW, x);
    });
    return { polys, frame: { x: 0, y: 0, w: Math.max(maxW, 20), h: 100 + (lines.length - 1) * lineH } };
  }

  // ---------- icons ----------
  function iconPolys(icon, style) {
    const st = withDefaults(style);
    const solid = st.fillMode === 'solid';
    const polys = [];
    for (const sh of icon.s) {
      const t = sh[0];
      if (t === 's') {
        const e = expand(sh.slice(1));
        polys.push(...strokePolys(e.pts, e.closed, st.weight, st.cap, st.join));
        if (solid && e.closed && e.pts.length > 2) polys.push(orient(e.pts.map((p) => p.slice())));
      } else if (t === 'f') {
        const e = expand(sh.slice(1));
        if (e.pts.length > 2) polys.push(orient(e.pts.map((p) => p.slice())));
      } else if (t === 'c') {
        const [, cx, cy, r, fill] = sh;
        if (fill || solid) polys.push(orient(circle(cx, cy, r, 48)));
        if (!fill) polys.push(...strokePolys(circle(cx, cy, r, 48), true, st.weight, st.cap, st.join));
      } else if (t === 'r') {
        const [, x, y, w, h, fill] = sh;
        const rect = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
        if (fill || solid) polys.push(orient(rect.map((p) => p.slice())));
        if (!fill) polys.push(...strokePolys(rect, true, st.weight, st.cap, st.join));
      }
    }
    let out = polys;
    if (st.flipH) out = xf(out, (x, y) => [100 - x, y]);
    if (st.rotate) {
      const c = Math.cos(st.rotate * RAD), s = Math.sin(st.rotate * RAD);
      out = xf(out, (x, y) => [50 + (x - 50) * c - (y - 50) * s, 50 + (x - 50) * s + (y - 50) * c]);
    }
    return { polys: out, frame: { x: 0, y: 0, w: 100, h: 100 } };
  }

  // ---------- SVG composition ----------
  const r2 = (n) => Math.round(n * 100) / 100;
  function pathD(polys) {
    let d = '';
    for (const p of polys) {
      if (p.length < 3) continue;
      d += 'M' + p.map(([x, y]) => r2(x) + ' ' + r2(y)).join('L') + 'Z';
    }
    return d;
  }

  // sweep each polygon along vector (dx,dy): union of polys + translated polys + edge quads
  function sweep(polys, dx, dy) {
    const out = [];
    for (const p of polys) {
      out.push(p, move([p], dx, dy)[0]);
      for (let i = 0; i < p.length; i++) {
        const a = p[i], b = p[(i + 1) % p.length];
        out.push(orient([a.slice(), b.slice(), [b[0] + dx, b[1] + dy], [a[0] + dx, a[1] + dy]]));
      }
    }
    return out;
  }

  function badgeShape(kind, cx, cy, side) {
    const x = cx - side / 2, y = cy - side / 2;
    if (kind === 'circle') return `<circle cx="${r2(cx)}" cy="${r2(cy)}" r="${r2(side / 2)}"`;
    if (kind === 'rounded') return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(side)}" height="${r2(side)}" rx="${r2(side * 0.24)}"`;
    return `<rect x="${r2(x)}" y="${r2(y)}" width="${r2(side)}" height="${r2(side)}"`;
  }

  let uid = 0;
  function composeSvg(content, style, opts) {
    const st = withDefaults(style);
    const o = opts || {};
    const f = content.frame;
    let polys = content.polys;
    const cx = f.x + f.w / 2, cy = f.y + f.h / 2;
    let vb, side = 0;
    if (st.badge !== 'none') {
      side = Math.max(f.w, f.h) + st.badgePad * 2;
      vb = [cx - side / 2, cy - side / 2, side, side];
    } else {
      vb = [f.x - st.pad, f.y - st.pad, f.w + st.pad * 2, f.h + st.pad * 2];
    }
    const size = o.size || 0;
    const wh = size ? ` width="${size}" height="${r2((size * vb[3]) / vb[2])}"` : '';
    let body = '';
    let defs = '';
    let clipAttr = '';
    if (st.badge !== 'none') {
      const id = 'iris-clip-' + ++uid;
      defs = `<defs><clipPath id="${id}">${badgeShape(st.badge, cx, cy, side)}/></clipPath></defs>`;
      body += `${badgeShape(st.badge, cx, cy, side)} fill="${st.badgeColor}"/>`;
      clipAttr = ` clip-path="url(#${id})"`;
    }
    let inner = '';
    if (st.shadow !== 'none') {
      const a = st.shadowAngle * RAD;
      const dx = Math.cos(a) * st.shadowLen, dy = Math.sin(a) * st.shadowLen;
      const sp = st.shadow === 'long' ? sweep(polys, dx, dy) : move(polys, dx, dy);
      const op = st.shadowOpacity < 1 ? ` fill-opacity="${st.shadowOpacity}"` : '';
      inner += `<path d="${pathD(sp)}" fill="${st.shadowColor}"${op}/>`;
    }
    inner += `<path d="${pathD(polys)}" fill="${st.color}"/>`;
    body += `<g${clipAttr}>${inner}</g>`;
    const bg = o.background ? `<rect x="${r2(vb[0])}" y="${r2(vb[1])}" width="${r2(vb[2])}" height="${r2(vb[3])}" fill="${o.background}"/>` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.map(r2).join(' ')}"${wh}>${defs}${bg}${body}</svg>`;
  }

  // ---------- font outlines ----------
  // Returns polygons in font units (y up, CCW) for one glyph/icon.
  //   mode 'type': baseline y=75 -> 0. mode 'icon': box y 0..100 -> 800..-200
  function toFontContours(polys, mode, xShift = 0) {
    const base = mode === 'icon' ? 80 : BASELINE;
    return polys.map((p) => {
      const q = p.map(([x, y]) => [Math.round((x + xShift) * 10), Math.round((base - y) * 10)]);
      return orient(q, true);
    });
  }

  return {
    DEFAULT_STYLE, WEIGHT_CLASSES, GUIDES, withDefaults, expand, strokePolys, glyphPolys, textPolys,
    iconPolys, composeSvg, pathD, toFontContours, orient, area,
  };
});
