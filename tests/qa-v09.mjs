import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
let failure = null;
try {
  for(const width of [1440,390,320]){
    const page = await browser.newPage({ viewport: {width,height:width===1440?900:720}, isMobile:width!==1440, hasTouch:width!==1440 });
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
    const response=await page.goto('https://omjun0807-del.github.io/moonmart-escape/?qa=09&width='+width,{waitUntil:'networkidle',timeout:60000});
    assert.equal(response.status(),200,'Main page HTTP 200');
    await page.locator('#v09Environment').waitFor({state:'attached'});
    assert.match(await page.locator('.brand small').innerText(),/v0\.9/,'v0.9 marker');
    assert.equal(await page.locator('#v09Environment svg').count(),1,'Scene overlay attached');
    const image=page.locator('#sceneArt img');
    await image.waitFor();
    assert.ok(await image.evaluate(i=>i.complete&&i.naturalWidth>100),'Original game art loaded');

    await page.locator('#startGame').click();
    await page.locator('#objectGrid [data-action="register"]').click();
    await page.locator('[data-puzzle="register"] input').fill('427');
    await page.locator('[data-puzzle="register"] button[type="submit"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.register);
    await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'계산대 서랍'}).waitFor({state:'visible',timeout:5000});
    await page.locator('#dialogClose').click();
    await page.locator('#inventory [data-item]').filter({hasText:'창고 열쇠'}).click();
    await page.locator('#objectGrid [data-action="storageDoor"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().scene==='storage');
    await page.waitForFunction(()=>document.querySelector('#v09StateReadout')?.textContent.includes('전력'));
    assert.equal(await page.locator('#v09Environment svg').count(),1,'Storage art decorated');

    await page.locator('#objectGrid [data-action="breaker"]').click();
    for(const name of ['냉장','조명','보안']){
      await page.locator('[data-switch="'+name+'"]').click();
    }
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.power);
    await page.waitForFunction(()=>document.querySelector('#v09StateReadout .v09-chip.done')?.textContent==='전력');
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__moonMartTest?.state()?.flags?.power);
    assert.equal(await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'전력'}).count(),1,'Saved state reflected after reload');

    // Continue through the full escape after restoring the old save.
    await page.evaluate(()=>window.__moonMartTest.move('shop'));
    await page.locator('#objectGrid [data-action="shelf"]').click();
    await page.locator('#dialogClose').click();
    await page.evaluate(()=>window.__moonMartTest.move('storage'));
    await page.locator('#inventory [data-item]').filter({hasText:'건전지'}).click();
    await page.locator('#objectGrid [data-action="scanner"]').click();
    await page.locator('#dialogClose').click();
    await page.locator('#objectGrid [data-action="scanner"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.scanned);
    await page.locator('#dialogClose').click();
    await page.locator('#objectGrid [data-action="toolbox"]').click();
    await page.locator('[data-puzzle="toolbox"] input').fill('385');
    await page.locator('[data-puzzle="toolbox"] button[type="submit"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.case);
    await page.locator('#dialogClose').click();
    await page.locator('#inventory [data-item]').filter({hasText:'관리실 카드'}).click();
    await page.locator('#objectGrid [data-action="officeDoor"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().scene==='office');

    await page.locator('#objectGrid [data-action="monitor"]').click();
    for(const id of ['B','D','A','C'])await page.locator('[data-frame="'+id+'"]').click();
    await page.locator('#verifyCctv').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.cctv);
    await page.locator('#dialogClose').click();
    await page.locator('#objectGrid [data-action="terminal"]').click();
    for(const [i,taps] of [[0,1],[1,2],[2,3]]){
      for(let n=0;n<taps;n++)await page.locator('[data-symbol="'+i+'"]').click();
    }
    await page.locator('#verifySymbols').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.terminal);
    await page.locator('#dialogClose').click();
    await page.evaluate(()=>window.__moonMartTest.move('shop'));
    await page.locator('#objectGrid [data-action="frontDoor"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.escaped);
    assert.equal(await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'셔터'}).count(),1,'Shutter stays unlocked');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3),'No horizontal overflow');
    assert.deepEqual(errors,[],'No JS errors');
    await page.screenshot({path:'v09-qa-'+width+'.png',fullPage:true});
    console.log('PASS: '+width+'px — full escape path, stateful effects, save, no JS errors');
    await page.close();
  }
} catch(e) {failure=e;console.error('QA FAILED',e);process.exitCode=1}
finally {await browser.close()}
