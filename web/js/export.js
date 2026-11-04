/* Iris exporters: fonts (opentype.js), SVG/PNG, CSS/JS reference "kit", zip bundles. */
(function (root) {
  'use strict';
  const C = root.IrisCore;

  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'iris';

  function contoursToPath(contours) {
    const path = new opentype.Path();
    for (const c of contours) {
      if (c.length < 3) continue;
      path.moveTo(c[0][0], c[0][1]);
      for (let i = 1; i < c.length; i++) path.lineTo(c[i][0], c[i][1]);
      path.close();
    }
    return path;
  }

  function makeFont(family, glyphList) {
    const notdef = new opentype.Glyph({ name: '.notdef', unicode: 0, advanceWidth: 600, path: new opentype.Path() });
    return new opentype.Font({
      familyName: family, styleName: 'Regular', unitsPerEm: 1000, ascender: 800, descender: -250,
      glyphs: [notdef].concat(glyphList),
    });
  }

  // Typeface -> font. Every char in `glyphs` becomes a mapped glyph.
  function buildTypeface(family, glyphs, style) {
    const list = [new opentype.Glyph({ name: 'space', unicode: 32, advanceWidth: Math.round(34 * style.widthScale * 10), path: new opentype.Path() })];
    const names = {};
    for (const [ch, g] of Object.entries(glyphs)) {
      if (ch === ' ') continue;
      const r = C.glyphPolys(g, style);
      const contours = C.toFontContours(r.polys, 'type');
      names[ch] = 'uni' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
      list.push(new opentype.Glyph({ name: names[ch], unicode: ch.codePointAt(0), advanceWidth: Math.round(r.adv * 10), path: contoursToPath(contours) }));
    }
    return makeFont(family, list);
  }

  // Icons -> font. PUA codepoints from U+E000.
  function buildIconFont(family, icons, style) {
    const list = [];
    const map = [];
    Object.keys(icons).forEach((name, i) => {
      const cp = 0xe000 + i;
      const r = C.iconPolys(icons[name], style);
      list.push(new opentype.Glyph({ name: name.replace(/-/g, '_'), unicode: cp, advanceWidth: 1000, path: contoursToPath(C.toFontContours(r.polys, 'icon')) }));
      map.push({ name, cp });
    });
    return { font: makeFont(family, list), map };
  }

  const fontBytes = (font) => font.toArrayBuffer();
  function b64(buf) {
    const u = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  }

  // ---- reference files (the "FontAwesome style" part) ----
  function iconCss(family, file, map) {
    let css = `/* Iris icon font. Usage: <link rel="stylesheet" href="iris.css"> then <i class="iris iris-heart"></i> */\n`;
    css += `@font-face{font-family:"${family}";src:url("${file}") format("opentype");font-weight:400;font-style:normal;font-display:block}\n`;
    css += `.iris{font-family:"${family}";font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;display:inline-block;vertical-align:-0.125em;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}\n`;
    css += `.iris{font-size:1em;width:1em;height:1em}.iris-lg{font-size:1.5em}.iris-2x{font-size:2em}.iris-3x{font-size:3em}.iris-4x{font-size:4em}\n`;
    css += `.iris-spin{animation:iris-spin 1s linear infinite}@keyframes iris-spin{to{transform:rotate(360deg)}}\n`;
    for (const m of map) css += `.iris-${m.name}::before{content:"\\${m.cp.toString(16)}"}\n`;
    return css;
  }
  // single <script> kit: injects @font-face (base64) + classes, no extra files
  function kitJs(css, buf, fileLabel) {
    const inline = css.replace(/url\("[^"]+"\)/, `url(data:font/otf;base64,${b64(buf)})`);
    return `/* Iris kit (${fileLabel}) - add <script src="iris-kit.js"></script> and use <i class="iris iris-NAME"></i> */\n(function(){var s=document.createElement("style");s.setAttribute("data-iris","");s.textContent=${JSON.stringify(inline)};(document.head||document.documentElement).appendChild(s);})();\n`;
  }
  function typeCss(family, file) {
    return `/* Usage: <link rel="stylesheet" href="${slug(family)}.css"> then class="${slug(family)}" */\n@font-face{font-family:"${family}";src:url("${file}") format("opentype");font-weight:400;font-style:normal;font-display:swap}\n.${slug(family)}{font-family:"${family}",sans-serif}\n`;
  }
  function typeKitJs(family, buf) {
    const css = `@font-face{font-family:"${family}";src:url(data:font/otf;base64,${b64(buf)}) format("opentype");font-display:swap}.${slug(family)}{font-family:"${family}",sans-serif}`;
    return `/* ${family} kit - add <script src="${slug(family)}-kit.js"></script>, then class="${slug(family)}" */\n(function(){var s=document.createElement("style");s.textContent=${JSON.stringify(css)};(document.head||document.documentElement).appendChild(s);})();\n`;
  }

  function iconSprite(icons, style) {
    let s = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">';
    for (const [name, ic] of Object.entries(icons)) {
      const r = C.iconPolys(ic, style);
      s += `<symbol id="${name}" viewBox="0 0 100 100"><path d="${C.pathD(r.polys)}" fill="currentColor"/></symbol>`;
    }
    return s + '</svg>';
  }

  // ---- raster ----
  function svgToBlob(svg, type, size, quality, bg) {
    return new Promise((resolve, reject) => {
      const m = /viewBox="([^"]+)"/.exec(svg).slice(1)[0].split(' ').map(Number);
      const w = size, h = Math.round((size * m[3]) / m[2]);
      const img = new Image();
      img.onload = () => {
        const cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        const ctx = cv.getContext('2d');
        if (bg || type === 'image/jpeg') { ctx.fillStyle = bg || '#ffffff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        cv.toBlob((b) => (b ? resolve(b) : reject(new Error('encode failed'))), type, quality);
      };
      img.onerror = () => reject(new Error('svg load failed'));
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    });
  }

  function download(name, data, type) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: type || 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function demoHtml(kind, family, names) {
    if (kind === 'icons') {
      return `<!doctype html><meta charset="utf-8"><title>${family} demo</title><link rel="stylesheet" href="iris.css">\n<style>body{font:16px sans-serif;padding:24px}.g{display:grid;grid-template-columns:repeat(auto-fill,120px);gap:12px}.g div{text-align:center;font-size:12px}.g i{font-size:32px;display:block;margin-bottom:6px}</style>\n<h1>${family}</h1>\n<p>Font: <code>&lt;i class="iris iris-heart"&gt;&lt;/i&gt;</code> &middot; SVG sprite: <code>&lt;svg&gt;&lt;use href="iris-sprite.svg#heart"/&gt;&lt;/svg&gt;</code></p>\n<div class="g">${names.map((n) => `<div><i class="iris iris-${n}"></i>${n}</div>`).join('')}</div>`;
    }
    return `<!doctype html><meta charset="utf-8"><title>${family} demo</title><link rel="stylesheet" href="${slug(family)}.css">\n<body class="${slug(family)}" style="padding:24px"><h1 style="font-size:64px">${family}</h1><p style="font-size:32px">ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789 .,!?&amp;@#</p>`;
  }

  root.IrisExport = {
    slug, buildTypeface, buildIconFont, fontBytes, iconCss, kitJs, typeCss, typeKitJs, iconSprite,
    svgToBlob, download, demoHtml,
  };
})(typeof self !== 'undefined' ? self : this);
