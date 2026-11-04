# Iris data format

All artwork is stroke-skeleton data in a 100-unit em box (x right, y DOWN). The engine
(`web/js/core.js`) turns it into outlines, so every tweak (weight, serif, circle badge,
shadow...) works on every glyph and icon.

## Points
- `[x, y]` a point.
- `["arc", cx, cy, rx, ry, a0, a1]` elliptical arc expanded into points. Angles in degrees,
  0 = right (+x), 90 = down (+y), angles increase clockwise on screen. a0 -> a1 direction is
  the walk direction (a1 < a0 walks counter-clockwise on screen).
- `"z"` as the LAST item closes the polyline into a loop.

## Glyphs (`web/data/glyphs-*.js`)
```js
Object.assign(window.IRIS_GLYPHS = window.IRIS_GLYPHS || {}, {
  A: { w: 64, s: [ [[8,75],[32,15],[56,75]], [[17,55],[47,55]] ] },
  O: { w: 70, s: [ [["arc",35,45,27,30,0,360]] ] },
});
```
- `w` = advance width (typically 40-80). Keep all strokes inside x = 8 .. w-8.
- `s` = list of strokes; each stroke is a polyline of points (centre line of the pen).
- Vertical guides: capTop/ascender y=15, xHeight y=42, baseline y=75, descender y=95.
- Capitals: baseline 75, top 15. Lowercase: x-height 42 (ascenders reach 15, descenders reach 95).
- Vertical stems should END exactly on a guide line (y=15, 42, 75, 95): the engine auto-adds
  serifs to open-stroke ends that sit on a guide and run steeply vertical.
- Round letters: use `arc` items (full circle = `["arc",cx,cy,rx,ry,0,360]`, one stroke, no "z" needed).
- Default pen is ~8 units wide, so keep strokes >= 14 units apart or counters will fill in.

## Icons (`web/data/icons-*.js`)
```js
Object.assign(window.IRIS_ICONS = window.IRIS_ICONS || {}, {
  heart: { l: "Heart", t: "love like favorite", s: [ ["f", [50,86],[14,48], ["arc",30,34,16,16,180,360], ["arc",70,34,16,16,180,360],[86,48],"z"] ] },
});
```
- key = kebab-case id. `l` = label, `t` = space separated search tags, `s` = shapes.
- Shapes:
  - `["s", pt, pt, ...]` stroked polyline (add `"z"` last to close).
  - `["f", pt, pt, ..., "z"]` filled polygon (no outline).
  - `["c", cx, cy, r, fill]` circle; fill 1 = solid disc, 0 = ring (stroked).
  - `["r", x, y, w, h, fill]` rectangle; fill 1 = solid, 0 = stroked outline.
- Draw inside x,y = 12 .. 88 so there is room for badge/shadow. Mostly outline-style icons
  (stroke width default 8) with a few solid accents; icon should read clearly at 24px.
