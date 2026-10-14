/* MOON MART v1.2 — immersion mode, safe background asset gating, save-compatible. */
(() => {
'use strict';
const scene=document.getElementById('scene'),
 sceneArt=document.getElementById('sceneArt'),
 sound=document.getElementById('soundBtn'),
 picker=document.querySelector('.photo-select');
if(!scene||!sceneArt||!sound||!picker)return;
const key='moonmart_v12_focus';
const cineKey='moonmart_v12_cine';
const fallback={shop:'art-v08/shop.svg',storage:'art-v08/storage.svg',office:'art-v08/office.svg'};
const upgraded={shop:'art-v12/shop.webp',storage:'art-v12/storage.webp',office:'art-v12/office.webp'};
const safeRead=(name)=>{try{return localStorage.getItem(name)==='1'}catch(e){return false}};
const safeWrite=(name,value)=>{try{localStorage.setItem(name,value?'1':'0')}catch(e){}};
const button=document.createElement('button');
button.id='v12FocusButton';button.className='small-btn';
button.type='button';button.title='화면을 크게 표시하고 탐색 지점에 집중합니다. F 키로 전환할 수 있습니다.';
sound.insertAdjacentElement('afterend',button);
const exit=document.createElement('button');
exit.id='v12ExitFocus';exit.type='button';exit.textContent='↙ 메뉴 보기';
exit.setAttribute('aria-label','몰입 보기 종료하고 메뉴 표시');
scene.append(exit);
const controls=document.createElement('span');controls.className='v12-controls';
const cinematic=document.createElement('button');
cinematic.className='v12-cine-btn';cinematic.id='v12CineButton';cinematic.type='button';
cinematic.textContent='시네마틱 장면';cinematic.hidden=true;
cinematic.setAttribute('aria-pressed','false');
const help=document.createElement('span');help.className='v12-cine-credit';
help.textContent='게임 화면을 크게 보려면 위의 몰입 보기 버튼을 누르세요.';
controls.append(cinematic,help);
picker.insertAdjacentElement('afterend',controls);
const transition=document.createElement('div');
transition.className='v12-art-overlay';transition.id='v12ArtOverlay';transition.setAttribute('aria-hidden','true');
sceneArt.insertAdjacentElement('afterend',transition);
let focus=safeRead(key),cinematicMode=false,available=false,queued=false,room='',lastSource='',recentTarget=null;
function applyFocus(){
 document.body.classList.toggle('v12-focus-mode',focus);
 button.setAttribute('aria-pressed',String(focus));
 button.textContent=focus?'↙ 일반 보기':'⛶ 몰입 보기';
 safeWrite(key,focus);
 if (window.__moonMartTest && window.__moonMartTest.state && window.__moonMartTest.state().scene)
   requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}
button.addEventListener('click',()=>{focus=!focus;applyFocus();if(focus)scene.scrollIntoView({behavior:'instant',block:'center'})});
exit.addEventListener('click',()=>{focus=false;applyFocus();button.focus()});
document.addEventListener('keydown',e=>{
 const tag=(e.target?.tagName||'').toLowerCase();
 if(tag==='input'||tag==='textarea'||e.altKey||e.ctrlKey||e.metaKey)return;
 if(e.key==='f'||e.key==='F'){if(document.querySelector('#overlay:not([hidden]),#v10JournalOverlay:not([hidden])'))return;focus=!focus;applyFocus();e.preventDefault()}
 if(e.key==='Escape'&&focus&&!document.querySelector('#overlay:not([hidden]),#v10JournalOverlay:not([hidden])')){focus=false;applyFocus();e.preventDefault()}
});
applyFocus();

const probe=(url)=>new Promise(resolve=>{
  const img=new Image();
  let finished=false;
  const done=ok=>{if(finished)return;finished=true;img.onload=null;img.onerror=null;resolve(ok)};
  img.onload=()=>done(img.naturalWidth>400);
  img.onerror=()=>done(false);
  img.src=url;
});
Promise.all(Object.values(upgraded).map(x=>probe(x))).then(x=>{
 available=x.every(Boolean);
 cinematic.hidden=!available;
 if(available){help.textContent='각 구역별 독립 게임 배경 · 기존 아트로 언제든 전환할 수 있습니다.';cinematicMode=safeRead(cineKey);schedule()}
}).catch(()=>{available=false});

function activeDesigned(){return scene.classList.contains('designed-edition')}
function setMode(on){
 cinematicMode=!!on && available;
 cinematic.setAttribute('aria-pressed',String(cinematicMode));
 safeWrite(cineKey,cinematicMode);
 schedule();
}
cinematic.addEventListener('click',()=>{
 if(!activeDesigned()){document.getElementById('designedBtn')?.click()}
 setMode(!cinematicMode);
});
for(const id of ['designedBtn','photoBtn','classicBtn']){
 document.getElementById(id)?.addEventListener('click',()=>{
  if(id!=='designedBtn')setMode(false);
  else schedule();
 });
}
function update(){
 if(!available||!activeDesigned()){
   scene.classList.remove('v12-cinematic','v12-loading');
   cinematic.setAttribute('aria-pressed','false');
   return;
 }
 scene.classList.toggle('v12-cinematic',cinematicMode);
 cinematic.setAttribute('aria-pressed',String(cinematicMode));
 if(!cinematicMode)return;
 const zone=scene.dataset.room;
 const image=sceneArt.querySelector('img');
 if(!image||!upgraded[zone])return;
 if(room!==zone){room=zone;lastSource=''}
 const path=upgraded[zone];
 if(image.getAttribute('src')===path)return;
 if(lastSource===zone+path)return;
 lastSource=zone+path;
 image.onerror=()=>{
  image.onerror=null;
  image.src=fallback[zone];
  scene.classList.remove('v12-loading','v12-cinematic');
  help.textContent='새 배경을 불러오지 못해 기존 일러스트로 전환했습니다.';
  cinematicMode=false;safeWrite(cineKey,false);cinematic.setAttribute('aria-pressed','false');
 };
 image.onload=()=>{
  scene.classList.remove('v12-loading');
  image.classList.add('v12-transition');
 };
 scene.classList.add('v12-loading');
 image.src=path;
 image.alt=(zone==='shop'?'매장':zone==='storage'?'창고':'관리실')+' 고해상도 게임 장면';
}
function schedule(){
 if(queued)return;
 queued=true;
 requestAnimationFrame(()=>{queued=false;update()});
}
new MutationObserver(schedule).observe(sceneArt,{childList:true});
new MutationObserver(schedule).observe(scene,{attributes:true,attributeFilter:['data-room','class']});
window.addEventListener('pageshow',schedule);
schedule();
})();