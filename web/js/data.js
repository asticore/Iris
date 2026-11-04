/* Merge IRIS_ICON_SETS (one per category file) into a flat IRIS_ICONS map with a category on each icon. */
(function (root) {
  'use strict';
  const icons = {};
  const cats = [];
  for (const [cat, set] of Object.entries(root.IRIS_ICON_SETS || {})) {
    cats.push(cat);
    for (const [name, ic] of Object.entries(set)) if (!icons[name]) icons[name] = Object.assign({ c: cat }, ic);
  }
  root.IRIS_ICONS = icons;
  root.IRIS_CATS = cats;
  if (typeof module === 'object' && module.exports) module.exports = { icons, cats };
})(typeof self !== 'undefined' ? self : this);
