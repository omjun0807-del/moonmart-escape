import { chromium, webkit } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
let failure = null;
try {
  for(const width of [1440,390,320]){
    const page = await browser.newPage({ viewport: {width,height:width===1440?900:720}, isMobile:width!==1440, hasTouch:width!==1440 });
    const errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',m=>{if(m.type()==='error' && /Uncaught|ReferenceError|TypeError|SyntaxError/i.test(m.text()))errors.push(m.text())});
    page.on('response',r=>{if(r.url().startsWith('https://omjun0807-del.github.io/moonmart-escape/') && r.status()>=400)errors.push('Critical game resource HTTP '+r.status()+': '+r.url())});
    const response=await page.goto('https://omjun0807-del.github.io/moonmart-escape/?qa=14&width='+width,{waitUntil:'networkidle',timeout:60000});
    assert.equal(response.status(),200,'Main page HTTP 200');
    await page.locator('#v09Environment').waitFor({state:'attached'});
    assert.match(await page.locator('.brand small').innerText(),/v1\.4/,'v1.4 marker');
    assert.equal(await page.locator('#v09Environment svg').count(),1,'Scene overlay attached');
    const image=page.locator('#sceneArt img');
    await image.waitFor();
    assert.ok(await image.evaluate(i=>i.complete&&i.naturalWidth>100),'Original game art loaded');

    await page.locator('#v10JournalButton').waitFor({state:'attached',timeout:8000});
    await page.locator('#v11World').waitFor({state:'attached',timeout:8000});
    await page.locator('#startGame').click();
    await page.locator('#v12FocusButton').waitFor({state:'visible',timeout:8000});
    await page.locator('#v12FocusButton').click();
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v12-focus-mode')),true,'Focus mode is enabled');
    await page.locator('#v13QuickDock').waitFor({state:'visible',timeout:6000});
    await page.locator('#v13QuickDock [data-v13-action="explore"]').click();
    await page.locator('#explorePanel').waitFor({state:'visible'});
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v13-drawer-open')),true,'Immersive explore panel opens');
    await page.locator('#v13DrawerClose').click();
    await page.locator('#v13QuickDock [data-v13-action="hint"]').click();
    await page.locator('#hintPanel').waitFor({state:'visible'});
    await page.keyboard.press('Escape');
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v12-focus-mode')),true,'Escape closes drawer without exiting focus');
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v13-drawer-open')),false,'Drawer closes');
    
    await page.locator('#v12ExitFocus').click();
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v12-focus-mode')),false,'Focus mode exited without trapping the user');
    assert.equal(await page.locator('#v12CineButton').isVisible(),false,'Unfinished background image mode stays hidden');
    await page.locator('#v13SaveOpen').waitFor({state:'visible',timeout:5000});
    await page.locator('#v13SaveOpen').click();
    await page.locator('#v13SaveOverlay').waitFor({state:'visible'});
    const downloadWait=page.waitForEvent('download',{timeout:15000});
    await page.locator('#v13Export').click();
    const download=await downloadWait;
    assert.match(download.suggestedFilename(),/^moonmart-ep01-save-.+\.json$/,'Save exported to valid JSON filename');
    await page.locator('#v13SaveInput').setInputFiles({name:'invalid.json',mimeType:'application/json',buffer:Buffer.from('not json')});
    await page.locator('#v13SaveStatus.error').waitFor({state:'visible'});
    assert.equal(await page.evaluate(()=>window.__moonMartTest.state().started),true,'Invalid import leaves save untouched');
    const gameCopy=await page.evaluate(()=>window.__moonMartTest.state());
    assert.equal(gameCopy.flags.memo,false,'Original save has no memo before the test');
    const importData=structuredClone(gameCopy);
    importData.time=18888;
    importData.flags.receipt=true;
    importData.flags.memo=true;
    importData.inventory=['영수증'];
    importData.selectedItem='영수증';
    await Promise.all([
      page.waitForEvent('load',{timeout:20000}),
      page.locator('#v13SaveInput').setInputFiles({
        name:'moonmart-modified-valid.json',mimeType:'application/json',
        buffer:Buffer.from(JSON.stringify({format:'moonmart-save',game:importData}))
      })
    ]);
    await page.waitForFunction(()=>window.__moonMartTest?.state()?.flags?.memo===true,{timeout:10000});
    assert.equal(await page.evaluate(()=>window.__moonMartRestoreApplied),true,'Staged import activated before the game booted');
    let restored=await page.evaluate(()=>window.__moonMartTest.state());
    assert.ok(restored.time>=18888&&restored.time<18900,'Modified play time restored, not overwritten by pagehide');
    assert.equal(restored.flags.receipt,true,'Modified clue flag restored');
    assert.deepEqual(restored.inventory,['영수증'],'Modified inventory restored');
    assert.equal(restored.selectedItem,'영수증','Selected item restored');
    await page.locator('#v13SaveOpen').click();
    await page.locator('#v13UndoImport').waitFor({state:'visible',timeout:6000});
    await Promise.all([
      page.waitForEvent('load',{timeout:20000}),
      page.locator('#v13UndoImport').click()
    ]);
    await page.waitForFunction(()=>window.__moonMartTest?.state()?.flags?.memo===false,{timeout:10000});
    assert.equal(await page.evaluate(()=>window.__moonMartRestoreApplied),true,'Undo applied before game boot');
    restored=await page.evaluate(()=>window.__moonMartTest.state());
    assert.equal(restored.flags.receipt,false,'Undo restores original clue flag');
    assert.deepEqual(restored.inventory,gameCopy.inventory,'Undo restores original inventory');
    
    assert.equal(await page.locator('meta[name="mm-v12-art"]').count(),0,'Unpublished scenes are not advertised');
    await page.locator('#v12FocusButton').click();
    await page.reload({waitUntil:'networkidle'});
    assert.equal(await page.evaluate(()=>document.body.classList.contains('v12-focus-mode')),true,'Focus mode preference persists after reload');
    await page.locator('#v12ExitFocus').click();
    assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('#v09Environment')).display),'none','Legacy misaligned artwork is hidden');
    const checkProp = async (action) => {
      const target=page.locator('#v11World .v11-object[data-action="'+action+'"]');
      await target.waitFor({state:'attached',timeout:6000});
      const ok=await page.evaluate(action=>{
        const a=document.querySelector('#hotspots .hotspot[data-action="'+action+'"]');
        const b=document.querySelector('#v11World .v11-object[data-action="'+action+'"]');
        if(!a||!b)return false;
        return Math.abs(parseFloat(a.style.left)-parseFloat(b.style.left))<0.01 &&
               Math.abs(parseFloat(a.style.top)-parseFloat(b.style.top))<0.01 &&
               getComputedStyle(b).pointerEvents==='none';
      },action);
      assert.ok(ok,'Prop '+action+' anchored to live hotspot and does not steal clicks');
    };
    await page.locator('#v10JournalButton').click();
    await page.locator('#v10JournalOverlay .v10-entry').first().waitFor({state:'visible'});
    assert.equal(await page.locator('#v10JournalOverlay .v10-entry').count(),8,'Eight progressive case journal entries');
    await page.locator('#v10JournalClose').click();
    await page.locator('#objectGrid [data-action="receipt"]').click();
    await page.locator('#dialogBody .precision-photo.v10-custom .v10-paper').waitFor({state:'visible',timeout:6000});
    assert.match(await page.locator('.v10-artboard').innerText(),/우유/,'Receipt text visibly illustrated');
    await page.locator('button[data-lens="plus"]').click();
    assert.notEqual(await page.locator('.precision-level').innerText(),'1.0×','Zoom operates on new close-up');
    await page.locator('#dialogClose').click();
    await page.locator('#objectGrid [data-action="register"]').click();
    await page.locator('#dialogBody .precision-photo.v10-custom .v10-device').waitFor({state:'visible'});
    await page.locator('[data-puzzle="register"] input').fill('427');
    await page.locator('[data-puzzle="register"] button[type="submit"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.register);
    await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'계산대 서랍'}).waitFor({state:'visible',timeout:5000});
    await checkProp('register');
    await page.locator('#dialogClose').click();
    await page.locator('#v12FocusButton').click();
    await page.locator('#v13QuickDock').waitFor({state:'visible'});
    await page.locator('#v13QuickDock [data-v13-action="inventory"]').click();
    await page.locator('#inventoryPanel').waitFor({state:'visible'});
    await page.locator('#inventory [data-item]').filter({hasText:'창고 열쇠'}).click();
    await page.waitForFunction(()=>!document.body.classList.contains('v13-drawer-open'));
    await page.locator('#v13SelectedMark').waitFor({state:'visible'});
    await page.locator('#v13QuickDock [data-v13-action="explore"]').click();
    await page.locator('#explorePanel').waitFor({state:'visible'});
    await page.locator('#objectGrid [data-action="storageDoor"]').click();
    await page.waitForFunction(()=>!document.body.classList.contains('v13-drawer-open'));
    await page.locator('#v12ExitFocus').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().scene==='storage');
    assert.ok(await page.locator('#v11World').isVisible(),'Aligned scene effect persists across room changes');
    await page.waitForFunction(()=>document.querySelector('#v09StateReadout')?.textContent.includes('전력'));
    assert.equal(await page.locator('#v09Environment svg').count(),1,'Storage art decorated');

    await page.locator('#objectGrid [data-action="breaker"]').click();
    for(const name of ['냉장','조명','보안']){
      await page.locator('[data-switch="'+name+'"]').click();
    }
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.power);
    await page.waitForFunction(()=>document.querySelector('#v09StateReadout .v09-chip.done')?.textContent==='전력');
    await checkProp('breaker');
    await page.reload({waitUntil:'networkidle'});
    await page.waitForFunction(()=>window.__moonMartTest?.state()?.flags?.power);
    assert.equal(await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'전력'}).count(),1,'Saved state reflected after reload');
    await checkProp('breaker');

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
    await page.locator('#dialogBody .precision-photo.v10-custom .v10-device').waitFor({state:'visible'});
    await page.locator('[data-puzzle="toolbox"] input').fill('385');
    await page.locator('[data-puzzle="toolbox"] button[type="submit"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.case);
    await page.locator('#dialogClose').click();
    await page.locator('#inventory [data-item]').filter({hasText:'관리실 카드'}).click();
    await page.locator('#objectGrid [data-action="officeDoor"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().scene==='office');

    await page.locator('#objectGrid [data-action="monitor"]').click();
    await page.locator('#dialogBody .v10-cctv').waitFor({state:'visible',timeout:6000});
    for(const id of ['B','D','A','C'])await page.locator('[data-frame="'+id+'"]').click();
    await page.locator('#verifyCctv').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.cctv);
    await checkProp('monitor');
    await page.locator('#dialogClose').click();
    await page.locator('#objectGrid [data-action="terminal"]').click();
    for(const [i,taps] of [[0,1],[1,2],[2,3]]){
      for(let n=0;n<taps;n++)await page.locator('[data-symbol="'+i+'"]').click();
    }
    await page.locator('#verifySymbols').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.terminal);
    await checkProp('terminal');
    await page.locator('#dialogClose').click();
    await page.evaluate(()=>window.__moonMartTest.move('shop'));
    await page.locator('#objectGrid [data-action="frontDoor"]').click();
    await page.waitForFunction(()=>window.__moonMartTest.state().flags.escaped);
    await checkProp('frontDoor');
    assert.equal(await page.locator('#v09StateReadout .v09-chip.done').filter({hasText:'셔터'}).count(),1,'Shutter stays unlocked');
    await page.locator('#v10EndingJournal').waitFor({state:'visible',timeout:6000});
    await page.locator('#v10EndingJournal').click();
    assert.match(await page.locator('#v10JournalOverlay').innerText(),/EP.01 사건 종결/,'Epilogue entry unlocked');
    await page.locator('#v10JournalClose').click();
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3),'No horizontal overflow');
    assert.deepEqual(errors,[],'No JS errors');
    await page.screenshot({path:'v14-qa-'+width+'.png',fullPage:true});
    console.log('PASS: '+width+'px — full escape, changed-state restore + undo, focus bag, journal, saves');
    await page.close();
  }
} catch(e) {failure=e;console.error('QA FAILED',e);process.exitCode=1}
finally {await browser.close()}
