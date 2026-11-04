// node tools/shot.js out.png [tab] -> screenshot of the portal
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto('file://' + path.resolve(__dirname, '../web/index.html'));
  if (process.argv[3] === 'type') await p.click('[data-tab=type]');
  if (process.argv[4]) await p.selectOption('#preset', process.argv[4]);
  await p.waitForTimeout(500);
  await p.screenshot({ path: process.argv[2] });
  console.log('errors:', errs); await b.close();
})();
