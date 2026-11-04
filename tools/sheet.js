// node tools/sheet.js out.png "Category" : contact sheet of one category
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto('file://' + path.resolve(__dirname, '../web/index.html'));
  await p.selectOption('#cat', process.argv[3]); await p.waitForTimeout(700);
  await p.locator('#icon-grid').screenshot({ path: process.argv[2] }); await b.close();
})();
