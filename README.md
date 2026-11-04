# Iris

Tweakable base icons and alphabet. Author each glyph once as a stroke skeleton; the portal
restyles **all** of them at once and exports the result.

**Portal:** `web/` (static, no build). Open `web/index.html` or `npm start`.

## What you can tweak (applies to every icon / letter)
- Weight, end caps, corner style, color
- Icons: outline vs solid, rotate, flip
- Type: **serifs** (size/thickness), slant, width, letter spacing
- **Badge**: circle / rounded square / square, any color
- **Flat shadow** (single offset or long sweep), color, angle, length, opacity
- Presets, state remembered in localStorage

## What you can export
| Thing | Formats |
|---|---|
| One icon | SVG, PNG (any size), WebP, JPG, copy SVG |
| Whole icon set | `.otf` icon font, **kit zip**, SVG zip |
| Typeface | `.otf` font, kit zip, preview SVG/PNG |

### FontAwesome-style reference files
The kit zip ships a reference file, so you use icons like FontAwesome:

```html
<link rel="stylesheet" href="iris.css">
<i class="iris iris-heart"></i>
<!-- or one tag, font embedded: -->
<script src="iris-kit.js"></script>
<!-- or SVG sprite: -->
<svg><use href="iris-sprite.svg#heart"/></svg>
```
Typeface kits include `<name>.css` and `<name>-kit.js` (`class="<name>"`).
Font files are single-colour, so badge and shadow are baked into SVG/PNG exports only.

## Add icons or letters
Data lives in `web/data/*.js` as 100-unit stroke skeletons. See [docs/DATA_FORMAT.md](docs/DATA_FORMAT.md).
Then run `npm i && npm run check`.

## Layout
- `web/js/core.js` stroke -> outline engine, serifs, SVG composer
- `web/js/export.js` opentype.js fonts, CSS/kit/sprite, raster, zip
- `web/js/app.js` UI
- `.github/workflows/pages.yml` GitHub Pages deploy (`web/`)

MIT.
