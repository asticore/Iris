// Validate data files: node tools/check-data.js web/data/foo.js
const fs = require('fs');
global.window = {};
let bad = 0;
for (const f of process.argv.slice(2)) {
  try { new Function('window', fs.readFileSync(f, 'utf8'))(global.window); }
  catch (e) { console.error('PARSE FAIL', f, e.message); bad++; }
}
const num = (v) => typeof v === 'number' && isFinite(v);
function pts(arr, where) {
  for (const p of arr) {
    if (p === 'z') continue;
    if (Array.isArray(p) && p[0] === 'arc') { if (p.length !== 7 || !p.slice(1).every(num)) { console.error('bad arc', where, JSON.stringify(p)); bad++; } continue; }
    if (!(Array.isArray(p) && p.length === 2 && p.every(num))) { console.error('bad pt', where, JSON.stringify(p)); bad++; }
  }
}
for (const [k, g] of Object.entries(window.IRIS_GLYPHS || {})) {
  if (!num(g.w) || !Array.isArray(g.s)) { console.error('bad glyph', k); bad++; continue; }
  g.s.forEach((s) => pts(s, 'glyph ' + k));
}
const all = {};
const seen = {};
for (const [setName, set] of Object.entries(window.IRIS_ICON_SETS || {})) for (const [k, ic] of Object.entries(set)) { if (all[k]) { console.error('DUP icon', k, 'in', setName, 'and', seen[k]); bad++; } all[k] = ic; seen[k] = setName; }
for (const [k, ic] of Object.entries(Object.assign({}, window.IRIS_ICONS || {}, all))) {
  if (!/^[a-z0-9-]+$/.test(k) || !ic.l || !Array.isArray(ic.s) || !ic.s.length) { console.error('bad icon', k); bad++; continue; }
  for (const sh of ic.s) {
    const t = sh[0];
    if (t === 's' || t === 'f') pts(sh.slice(1), 'icon ' + k);
    else if (t === 'c') { if (sh.length !== 5 || !sh.slice(1).every(num)) { console.error('bad circle', k); bad++; } }
    else if (t === 'r') { if (sh.length !== 6 || !sh.slice(1).every(num)) { console.error('bad rect', k); bad++; } }
    else { console.error('bad shape type', k, t); bad++; }
  }
}
console.log('glyphs:', Object.keys(window.IRIS_GLYPHS || {}).length, 'icons:', Object.keys(all).length, bad ? 'ERRORS ' + bad : 'OK');
process.exit(bad ? 1 : 0);
