/* MOON MART v1.3 — the cinematic mode is fully playable without leaving focus.
   Portable saves are validated before restoring. No server, no paid asset.
*/
(()=>{
'use strict';
const byId=(id)=>document.getElementById(id);
const api=window.__moonMartTest,aside=document.querySelector('aside.right'),
  scene=byId('scene'),inventory=byId('inventory'),hintPanel=byId('hintPanel');
if(!api||!aside||!scene||!inventory||!hintPanel||!byId('v12FocusButton'))return;
const SAVE_KEY='moon_mart_escape_ep01_v1';
const PREVIOUS_KEY='moon_mart_escape_ep01_v1_before_import';
const flags=[
 'receipt','memo','register','storage','power','batteryInstalled','scanner','scanned','case','office','cctv','terminal','escaped'
];
const itemNames=new Set(['영수증','창고 열쇠','건전지','관리실 카드']);
const roomNames=new Set(['shop','storage','office']);
const dock=document.createElement('nav');
dock.id='v13QuickDock';dock.setAttribute('aria-label','몰입 보기 빠른 메뉴');dock.hidden=true;
const actions=[
 {key:'explore',glyph:'⌕',name:'주변 조사',type:'drawer'},
 {key:'inventory',glyph:'▣',name:'가방',type:'drawer'},
 {key:'journal',glyph:'▤',name:'사건 일지',type:'journal'},
 {key:'hint',glyph:'✧',name:'도움말',type:'drawer'}
];
for(const a of actions){
 const btn=document.createElement('button');
 btn.type='button';btn.className='v13-dock-btn';btn.dataset.v13Action=a.key;
 btn.setAttribute('aria-expanded','false');
 btn.innerHTML='<span class="v13-symbol" aria-hidden="true">'+a.glyph+'</span><span>'+a.name+'</span>';
 dock.append(btn);
}
document.body.append(dock);
const veil=document.createElement('div');veil.id='v13DrawerBackdrop';veil.setAttribute('aria-hidden','true');
document.body.append(veil);
const header=document.createElement('div');header.id='v13DrawerTop';
const heading=document.createElement('strong');heading.textContent='주변 조사';heading.id='v13DrawerHeading';
const x=document.createElement('button');x.id='v13DrawerClose';x.type='button';x.setAttribute('aria-label','패널 닫기');x.textContent='×';
header.append(heading,x);aside.prepend(header);
const selected=document.createElement('div');
selected.id='v13SelectedMark';selected.className='v13-selected-mark';selected.hidden=true;
selected.setAttribute('aria-live','polite');
document.body.append(selected);
const saveBtn=document.createElement('button');saveBtn.type='button';saveBtn.id='v13SaveOpen';
saveBtn.textContent='⇩ 진행 기록 백업 · 불러오기';
hintPanel.append(saveBtn);

const saveCover=document.createElement('div');saveCover.id='v13SaveOverlay';saveCover.hidden=true;
saveCover.innerHTML='<section id="v13SaveDialog" role="dialog" aria-modal="true" aria-labelledby="v13SaveTitle" tabindex="-1"><div style="font-size:10px;letter-spacing:.15em;color:#e7d09e;font-weight:900">MOON MART / LOCAL SAVE MANAGER</div><h2 id="v13SaveTitle">진행 기록 보관함</h2><p>현재 게임은 이 브라우저에 자동 저장됩니다. 백업 파일을 만들면 다른 기기에서도 이어 할 수 있습니다. 서버 업로드 없이 기기에서 처리합니다.</p><div class="v13-save-line"><button id="v13Export" class="v13-action primary" type="button">↓ 진행 기록 다운로드</button><button id="v13Import" class="v13-action" type="button">↑ 백업 파일 불러오기</button></div><div class="v13-save-line"><button id="v13UndoImport" class="v13-action" type="button" hidden>↺ 이전 진행 기록 복구</button></div><input id="v13SaveInput" type="file" accept=".json,application/json" aria-label="MOON MART 백업 파일 선택"><div id="v13SaveStatus" role="status" aria-live="polite">불러오기 전에 현재 진행 기록은 자동으로 안전 보관됩니다.</div><button id="v13CloseSave" class="v13-action" type="button" style="margin-top:15px;width:100%">게임으로 돌아가기</button></section>';
document.body.append(saveCover);
const fileInput=byId('v13SaveInput'),status=byId('v13SaveStatus');
let lastFocus=null,saveFocus=null,raf=0,activePanel='';
function state(){try{return api.state()}catch(e){return null}}
function openDrawer(key){
 if(!document.body.classList.contains('v12-focus-mode'))return;
 if(activePanel===key && document.body.classList.contains('v13-drawer-open')){closeDrawer();return}
 const name={explore:'주변 조사',inventory:'인벤토리 · 아이템 선택',hint:'도움말 · 게임 관리'}[key]||'게임 메뉴';
 lastFocus=document.activeElement;activePanel=key;
 heading.textContent=name;
 document.body.dataset.v13Panel=key;
 document.body.classList.add('v13-drawer-open');
 dock.querySelectorAll('[data-v13-action]').forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.v13Action===key)));
 x.focus();
}
function closeDrawer(returnFocus=true){
 if(!document.body.classList.contains('v13-drawer-open'))return;
 document.body.classList.remove('v13-drawer-open');
 delete document.body.dataset.v13Panel;activePanel='';
 dock.querySelectorAll('[data-v13-action]').forEach(b=>b.setAttribute('aria-expanded','false'));
 if(returnFocus && lastFocus && typeof lastFocus.focus==='function')lastFocus.focus();
}
const saveNotice=(message,type='')=>{
 status.textContent=message;status.className=type;
};
function openSave(){
 closeDrawer(false);
 saveFocus=document.activeElement;
 const previous=localStorage.getItem(PREVIOUS_KEY);
 byId('v13UndoImport').hidden=!previous;
 saveNotice('파일은 이 기기에서만 읽습니다. 불러오기 전 기존 기록은 따로 보관합니다.');
 saveCover.hidden=false;
 byId('v13CloseSave').focus();
}
function closeSave(){
 saveCover.hidden=true;fileInput.value='';
 if(saveFocus&&saveFocus.isConnected&&typeof saveFocus.focus==='function')saveFocus.focus();
}
function validate(parsed){
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw Error('백업 데이터 형식이 올바르지 않습니다.');
 const obj=parsed.game||parsed;
 if(obj.version!==1&&obj.version!==2)throw Error('지원하지 않는 백업 버전입니다.');
 if(!roomNames.has(obj.scene)||!obj.flags||typeof obj.flags!=='object'||Array.isArray(obj.flags))throw Error('장면 또는 퍼즐 상태가 올바르지 않습니다.');
 if(!Array.isArray(obj.inventory)||obj.inventory.length>10||obj.inventory.some(v=>!itemNames.has(v)))throw Error('인벤토리 데이터가 올바르지 않습니다.');
 if(typeof obj.started!=='boolean'||typeof obj.time!=='number'||!Number.isFinite(obj.time)||obj.time<0||obj.time>1e9)throw Error('게임 진행시간이 올바르지 않습니다.');
 const current=state();
 if(!current||!current.flags)throw Error('현재 게임을 읽을 수 없습니다.');
 // Reconstruct from the exact supported schema, never trust unknown properties.
 const clean={...current,version:2,scene:obj.scene,started:obj.started,time:Math.floor(obj.time)};
 clean.flags={...current.flags};
 for(const key of flags)clean.flags[key]=obj.flags[key]===true;
 clean.inventory=Array.from(new Set(obj.inventory));
 clean.selectedItem=clean.inventory.includes(obj.selectedItem)?obj.selectedItem:null;
 clean.sound=typeof obj.sound==='boolean'?obj.sound:current.sound;
 clean.uiShowPoints=typeof obj.uiShowPoints==='boolean'?obj.uiShowPoints:true;
 clean.hintsUsed=Number.isInteger(obj.hintsUsed)?Math.max(0,Math.min(999,obj.hintsUsed)):0;
 clean.hintStage=typeof obj.hintStage==='string'?obj.hintStage.slice(0,90):'';
 clean.hintStep=Number.isInteger(obj.hintStep)?Math.max(0,Math.min(4,obj.hintStep)):0;
 clean.switchProgress=Number.isInteger(obj.switchProgress)?Math.max(0,Math.min(3,obj.switchProgress)):0;
 clean.cctvOrder=Array.isArray(obj.cctvOrder)?obj.cctvOrder.filter(x=>['A','B','C','D'].includes(x)).slice(0,4):[];
 clean.symbolChoices=Array.isArray(obj.symbolChoices)&&obj.symbolChoices.length===3?
   obj.symbolChoices.map(x=>String(x).slice(0,4)):[ '?','?','?' ];
 clean.logs=Array.isArray(obj.logs)?obj.logs.slice(0,22).filter(x=>x&&typeof x==='object'&&typeof x.text==='string').map(x=>({time:String(x.time||'00:00').slice(0,8),text:x.text.slice(0,170)})):[];
 if(!clean.flags.storage&&clean.scene==='storage')clean.scene='shop';
 if(!clean.flags.office&&clean.scene==='office')clean.scene='shop';
 return clean;
}
byId('v13Export').addEventListener('click',()=>{
 const s=state();
 if(!s){saveNotice('현재 진행 기록을 읽을 수 없습니다.','error');return}
 try{
  const payload=JSON.stringify({format:'moonmart-save',savedAt:new Date().toISOString(),game:s},null,2);
  const blob=new Blob([payload],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');
  link.href=url;link.download='moonmart-ep01-save-'+new Date().toISOString().slice(0,10)+'.json';
  link.style.display='none';document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1200);
  saveNotice('백업 파일을 만들었습니다. 다운로드 폴더를 확인하세요.','ok');
 }catch(e){saveNotice('백업 파일 저장에 실패했습니다. 브라우저 다운로드 권한을 확인하세요.','error')}
});
byId('v13Import').addEventListener('click',()=>fileInput.click());
fileInput.addEventListener('change',async()=>{
 const f=fileInput.files?.[0];if(!f)return;
 if(f.size>200000){saveNotice('백업 파일 용량이 너무 큽니다. 200KB 이하여야 합니다.','error');return}
 try {
   const json=JSON.parse(await f.text());
   if(json.format!==undefined&&json.format!=='moonmart-save')throw Error('MOON MART 게임 백업이 아닙니다.');
   const clean=validate(json);
   const prior=localStorage.getItem(SAVE_KEY);
   if(prior)localStorage.setItem(PREVIOUS_KEY,prior);
   localStorage.setItem(SAVE_KEY,JSON.stringify(clean));
   saveNotice('진행 기록을 불러왔습니다. 게임을 다시 여는 중입니다.','ok');
   location.reload();
 }catch(e){saveNotice('불러오기 실패: '+(e&&e.message?e.message:'백업 파일을 확인해 주세요.'),'error')}
});
byId('v13UndoImport').addEventListener('click',()=>{
 const previous=localStorage.getItem(PREVIOUS_KEY);
 if(!previous)return;
 try{
  const clean=validate(JSON.parse(previous));
  localStorage.setItem(SAVE_KEY,JSON.stringify(clean));
  localStorage.removeItem(PREVIOUS_KEY);
  saveNotice('이전 기록을 복구했습니다. 화면을 다시 엽니다.','ok');
  location.reload();
 }catch(e){saveNotice('이전 기록 복원 실패: '+e.message,'error')}
});
byId('v13CloseSave').addEventListener('click',closeSave);
saveCover.addEventListener('click',e=>{if(e.target===saveCover)closeSave()});
saveBtn.addEventListener('click',openSave);
veil.addEventListener('click',()=>closeDrawer());
x.addEventListener('click',()=>closeDrawer());
dock.addEventListener('click',e=>{
 const button=e.target.closest('[data-v13-action]');if(!button)return;
 const key=button.dataset.v13Action;
 if(key==='journal'){
  closeDrawer(false);
  byId('v10JournalButton')?.click();
 }else openDrawer(key);
});
aside.addEventListener('click',e=>{
 if(!document.body.classList.contains('v13-drawer-open'))return;
 if(e.target.closest('#inventory [data-item],#objectGrid [data-action]')){
  // Capture is essential: original gameplay synchronously re-renders and replaces
  // the clicked inventory node before a bubbling listener on the sidebar can run.
  setTimeout(()=>closeDrawer(false),0);
 }
},true);
document.addEventListener('keydown',e=>{
 if(e.key!=='Escape')return;
 if(!saveCover.hidden){e.preventDefault();e.stopImmediatePropagation();closeSave();return}
 if(document.body.classList.contains('v13-drawer-open')){
  e.preventDefault();e.stopImmediatePropagation();closeDrawer();return
 }
},true);
function refresh(){
 const s=state(),inFocus=document.body.classList.contains('v12-focus-mode');
 if(!inFocus)closeDrawer(false);
 dock.hidden=!inFocus||!s?.started||!!s?.flags?.escaped;
 selected.hidden=!inFocus||!s?.selectedItem;
 if(!selected.hidden)selected.textContent='선택한 아이템: '+s.selectedItem+' · 사용할 장소를 누르세요';
 const bag=dock.querySelector('[data-v13-action="inventory"] .v13-symbol');
 if(bag)bag.textContent=s?.inventory?.length?'▣ '+s.inventory.length:'▣';
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;refresh()})}
new MutationObserver(schedule).observe(inventory,{childList:true,subtree:false});
new MutationObserver(schedule).observe(scene,{attributes:true,attributeFilter:['class','data-room']});
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['class']});
document.addEventListener('click',schedule);
window.addEventListener('pageshow',schedule);
const brand=document.querySelector('.brand small');
if(brand)brand.textContent='AFTER HOURS / EP.01 · v1.3';
document.title='MOON MART | 심야 탈출 — Playable Immersion v1.3';
schedule();
})();
