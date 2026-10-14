/* MOON MART v1.1 — align detailed stateful objects to REAL hotspot centers.
 * Read-only: no mutation to the existing game progress, flags or save key.
 */
(()=>{
'use strict';
const scene=document.getElementById('scene');
const camera=document.getElementById('sceneCamera');
const spots=document.getElementById('hotspots');
const api=window.__moonMartTest;
if(!scene||!camera||!spots||!api||typeof api.state!=='function')return;
const layer=document.createElement('div');
layer.id='v11World';layer.className='v11-objects';layer.setAttribute('aria-hidden','true');
camera.insertBefore(layer,spots);
const focus=document.createElement('span');focus.id='v11Focus';focus.className='v11-focusring';layer.append(focus);
const notice=document.createElement('span');notice.id='v11Notice';notice.className='v11-action-note';notice.hidden=true;
scene.appendChild(notice);
const stages=document.createElement('div');stages.className='v11-progress-map';stages.id='v11Milestones';
stages.setAttribute('aria-label','구역별 탐색 진행');
const parent=document.querySelector('#v09StateReadout')||document.querySelector('.photo-select');
if(parent)parent.insertAdjacentElement('afterend',stages);
const defs='<defs><linearGradient id="v11metal" x2="0.96" y2="1"><stop stop-color="#90b2b7"/><stop offset=".22" stop-color="#405569"/><stop offset=".52" stop-color="#203442"/><stop offset="1" stop-color="#0c1c2c"/></linearGradient><linearGradient id="v11glass" x2="1" y2="1"><stop stop-color="#122c39"/><stop offset=".48" stop-color="#23516a"/><stop offset="1" stop-color="#081b2a"/></linearGradient><linearGradient id="v11wood" x2="1" y2="0.92"><stop stop-color="#a69881"/><stop offset=".5" stop-color="#6d6157"/><stop offset="1" stop-color="#302b2b"/></linearGradient><radialGradient id="v11green"><stop stop-color="#b7fff2" stop-opacity=".95"/><stop offset=".3" stop-color="#71ffcf" stop-opacity=".55"/><stop offset="1" stop-color="#71ffcf" stop-opacity="0"/></radialGradient></defs>';
const wrap=(content)=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" preserveAspectRatio="none">'+defs+content+'</svg>';
const label=(txt,y=164)=>'<text x="90" y="'+y+'" class="v11-smalltext" text-anchor="middle">'+txt+'</text>';
const drawer=()=>wrap('<g class="v11-metal-drawer v11-metal"><path d="M10 34 L164 26 L174 134 L8 145 Z" fill="#0a121c" stroke="#9ba59e" stroke-width="7"/><path d="M12 67 L164 58 L171 154 L8 164 Z" fill="url(#v11metal)" stroke="#adc4bd" stroke-width="5"/><path d="M28 86 L151 81 M26 102 L153 99" stroke="#a2bdc0" stroke-width="3" opacity=".7"/><rect x="63" y="118" width="56" height="9" rx="4" fill="#a3bcc6" stroke="#26373d"/><path d="M32 32 L138 28 L147 65 L25 70Z" fill="#111d22" stroke="#dec48c" stroke-width="3"/><path d="M82 45 L98 43L106 51 L91 54Z" fill="#e5c580"/></g>'+label('OPEN'));
const door=()=>wrap('<rect x="25" y="4" width="128" height="163" rx="2" fill="#06131c" stroke="#85a6a9" stroke-width="7"/><rect x="37" y="14" width="105" height="146" fill="#0b3342" opacity=".52"/><path d="M48 145 L97 45 L137 145" stroke="#699b8f" stroke-width="3" fill="none" opacity=".46"/><g class="v11-open-door v11-metal"><rect x="27" y="5" width="123" height="158" rx="1" fill="url(#v11metal)" stroke="#77949b" stroke-width="6"/><rect x="39" y="24" width="98" height="111" fill="url(#v11glass)" opacity=".78" stroke="#527786" stroke-width="3"/><circle cx="131" cy="106" r="6" fill="#e7d397"/></g>'+label('ACCESS'));
const shutter=()=>wrap('<rect x="13" y="14" width="158" height="149" fill="#071821" stroke="#b5baa0" stroke-width="5"/><rect x="24" y="24" width="138" height="131" fill="#315565" opacity=".48"/><g class="v11-shutter v11-metal"><rect x="13" y="13" width="158" height="147" fill="#263a47" stroke="#738c98" stroke-width="4"/>'+Array.from({length:9},(_,i)=>'<path d="M16 '+(27+i*15)+'h152" stroke="#91a1a4" stroke-width="6" opacity=".85"/>').join('')+'</g><rect x="13" y="8" width="158" height="9" fill="#738d97"/>'+label('RELEASED',175));
const powered=()=>wrap('<rect x="15" y="11" width="151" height="150" rx="8" fill="#182c35" stroke="#86a19e" stroke-width="8"/><rect x="28" y="30" width="124" height="116" fill="#11252f" stroke="#476977" stroke-width="3"/>'+[0,1,2].map(i=>'<g><rect x="'+(40+i*39)+'" y="48" width="22" height="58" rx="3" fill="#051923" stroke="#9fc1bb" stroke-width="2"/><rect class="v11-power-indicator v11-screen-glow" x="'+(46+i*39)+'" y="51" width="10" height="41" rx="1" fill="#b4ffca"/></g>').join('')+'<circle class="v11-power-indicator v11-screen-glow" cx="90" cy="122" r="8" fill="#76f7c8"/>'+label('POWER ON'));
const cctv=()=>wrap('<rect x="8" y="21" width="164" height="121" rx="7" fill="#172732" stroke="#a1b5b8" stroke-width="8"/><rect class="v11-screen-glow" x="22" y="34" width="136" height="93" fill="#0d3a42" stroke="#64d8d1" stroke-width="3"/>'+[0,1,2,3].map(i=>'<rect x="'+(28+(i%2)*67)+'" y="'+(41+Math.floor(i/2)*41)+'" width="59" height="33" fill="#31505a" stroke="#71aa9b" stroke-width="2"/><path d="M'+(32+(i%2)*67)+' '+(67+Math.floor(i/2)*41)+'l21 -17 28 15" fill="none" stroke="#b5e1d3" stroke-width="2"/>').join('')+label('RECOVERED',165));
const control=()=>wrap('<rect x="12" y="8" width="156" height="159" rx="5" fill="url(#v11metal)" stroke="#86ada6" stroke-width="7"/><rect class="v11-screen-glow" x="24" y="21" width="132" height="116" rx="5" fill="#082c29" stroke="#71c7ba" stroke-width="3"/><path d="M37 49h107M37 64h75M37 80h91M37 97h58" stroke="#9affd8" stroke-width="5"/><circle cx="130" cy="116" r="11" fill="#b8ffe0" class="v11-screen-glow"/>'+label('AUTHORIZED'));
const scan=()=>wrap('<rect x="17" y="31" width="150" height="109" rx="18" fill="url(#v11metal)" stroke="#84949c" stroke-width="7"/><rect x="31" y="47" width="122" height="72" rx="5" fill="#062a2e" stroke="#71b3ad" stroke-width="3"/><path d="M51 79h79M67 65l-16 14 16 12" fill="none" stroke="#86f5ce" stroke-width="5"/>'+label('SCAN OK',105));
const toolbox=()=>wrap('<path d="M19 45h145v99H19z" fill="url(#v11metal)" stroke="#97a9a4" stroke-width="8"/><path d="M19 45L48 18h90l26 27" fill="url(#v11metal)" stroke="#95a9ae" stroke-width="7"/><path d="M25 49h133M29 85h130" stroke="#88988f" stroke-width="4"/><rect x="81" y="93" width="26" height="12" rx="3" fill="#f1ce7e"/>'+label('OPEN',163));
const zoneMap={shop:[['register','register',drawer],['storage','storageDoor',door],['terminal','frontDoor',shutter]],
storage:[['power','breaker',powered],['scanned','scanner',scan],['case','toolbox',toolbox],['office','officeDoor',door]],
office:[['cctv','monitor',cctv],['terminal','terminal',control]]};
const classes={register:'register',storageDoor:'storageDoor',frontDoor:'frontDoor',breaker:'breaker',scanner:'scanner',toolbox:'toolbox',officeDoor:'officeDoor',monitor:'monitor',terminal:'terminal'};
const captions={register:'계산대 서랍 열림',storageDoor:'창고 문 열림',breaker:'전력 복구 완료',scanner:'스캐너 인증 완료',toolbox:'공구함 개방',officeDoor:'관리실 문 열림',monitor:'CCTV 기록 복원',terminal:'셔터 잠금 해제',frontDoor:'정문 셔터 해제'};
let last='',lastRoom='',lastFlags={},raf=0;
function update(){
 const state=api.state(),f=state.flags||{},room=state.scene;
 const designed=scene.classList.contains('designed-edition');
 const sig=[room,Number(designed),...Object.keys(f).sort().map(k=>k+':'+Number(!!f[k]))].join('|');
 if(sig===last)return;
 const prev=lastFlags;lastFlags={...f};const first=last==='';
 last=sig;layer.hidden=!designed;
 layer.querySelectorAll('.v11-object,.v11-lamp').forEach(n=>n.remove());
 if(designed){
   (zoneMap[room]||[]).forEach(([flag,action,drawing])=>{
     if(!f[flag])return;
     const hotspot=spots.querySelector('[data-action="'+action+'"]');
     if(!hotspot)return;
     const x=parseFloat(hotspot.style.left),y=parseFloat(hotspot.style.top);
     if(!Number.isFinite(x)||!Number.isFinite(y))return;
     const el=document.createElement('div');
     el.className='v11-object v11-object--'+(classes[action]||action)+(first||prev[flag]?'':' is-new');
     el.dataset.action=action;el.style.left=x+'%';el.style.top=y+'%';
     el.innerHTML=drawing();
     layer.append(el);
   });
   if(room==='storage'&&f.power){
     ['l1','l2'].forEach(k=>{const b=document.createElement('span');b.className='v11-lamp '+k;layer.append(b)});
   }
 }
 stages.replaceChildren();
 const milestones=[
  ['매장',f.register&&f.storage],
  ['창고',f.power&&f.case&&f.office],
  ['관리실',f.cctv&&f.terminal]
 ];
 for(const [name,done] of milestones){
   const el=document.createElement('span');el.className='v11-level'+(done?' success':'');el.textContent=name;stages.append(el);
 }
 lastRoom=room;
}
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;update()})}
new MutationObserver(schedule).observe(spots,{childList:true});
new MutationObserver(schedule).observe(scene,{attributes:true,attributeFilter:['class','data-room']});
document.addEventListener('click',event=>{
 const target=event.target.closest('#hotspots .hotspot');
 if(target&&scene.classList.contains('designed-edition')){
   const x=parseFloat(target.style.left),y=parseFloat(target.style.top);
   if(Number.isFinite(x)&&Number.isFinite(y)){
     focus.style.left=x+'%';focus.style.top=y+'%';focus.classList.remove('active');
     void focus.offsetWidth;focus.classList.add('active');
   }
 }
 schedule();
});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')schedule()});
window.addEventListener('pageshow',schedule);
schedule();
})();
