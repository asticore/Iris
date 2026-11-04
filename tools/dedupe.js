// node tools/dedupe.js : drop icons from icons-general.js that other sets also define (keeps specialised set)
const fs = require('fs');
global.window = {};
const files = fs.readdirSync('web/data').filter((f) => /^icons-.*\.js$/.test(f));
for (const f of files) new Function('window', fs.readFileSync('web/data/' + f, 'utf8'))(global.window);
const sets = window.IRIS_ICON_SETS, seen = {};
for (const [c, s] of Object.entries(sets)) for (const k of Object.keys(s)) (seen[k] = seen[k] || []).push(c);
const dups = Object.entries(seen).filter(([, v]) => v.length > 1);
let p = 'web/data/icons-general.js', src = fs.readFileSync(p, 'utf8');
for (const [k] of dups) {
  const re = new RegExp('\\n  "?' + k + '"?: \\{[\\s\\S]*?\\n  \\] \\},?', '');
  if (re.test(src)) { src = src.replace(re, ''); console.log('removed from General:', k); } else console.log('NOT in General, fix manually:', k, seen[k]);
}
fs.writeFileSync(p, src);
