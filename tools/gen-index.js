// node tools/gen-index.js : rewrite icon script tags in web/index.html from web/data/icons-*.js
const fs = require('fs');
const files = fs.readdirSync(__dirname + '/../web/data').filter((f) => /^icons-.*\.js$/.test(f)).sort();
let html = fs.readFileSync(__dirname + '/../web/index.html', 'utf8');
html = html.replace(/<script src="data\/icons-[^"]+"><\/script>\n/g, '');
html = html.replace(/<!--ICONS-->.*?\n?(?=<script src="js\/core)/s, '<!--ICONS-->\n' + files.map((f) => `<script src="data/${f}"></script>\n`).join(''));
if (!html.includes('js/data.js')) html = html.replace('<script src="js/core.js"></script>', '<script src="js/core.js"></script>\n<script src="js/data.js"></script>');
fs.writeFileSync(__dirname + '/../web/index.html', html);
console.log(files.length, 'icon files');
