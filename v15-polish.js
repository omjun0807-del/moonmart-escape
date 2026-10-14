/* MOON MART v1.5 — compact cinematic HUD, preserving core state and save keys */
(()=>{
'use strict';
const scene=document.getElementById('scene');
const current=document.getElementById('missionTitle');
const progress=document.getElementById('progress');
const body=document.body;
if(!scene||!current||!progress)return;

const hud=document.createElement('div');
hud.id='v15Objective';
hud.setAttribute('aria-hidden','true');
const kicker=document.createElement('span');
kicker.className='v15-label';kicker.textContent='MISSION / ESCAPE';
const objective=document.createElement('strong');
objective.className='v15-current';
const barRow=document.createElement('div');barRow.className='v15-bar';
const bar=document.createElement('div');bar.className='v15-progress';
const fill=document.createElement('span');bar.append(fill);
const ratio=document.createElement('span');ratio.textContent='0%';
barRow.append(bar,ratio);
hud.append(kicker,objective,barRow);
scene.append(hud);

let frame=0;
const sync=()=>{
 const label=(current.textContent||'').trim();
 if(objective.textContent!==label)objective.textContent=label||'매장 안의 단서를 조사하세요';
 let percent=Number(progress.getAttribute('aria-valuenow'));
 if(!Number.isFinite(percent))percent=0;
 percent=Math.max(0,Math.min(100,percent));
 const n=Math.round(percent);
 fill.style.width=n+'%';
 ratio.textContent=n+'%';
};
const queue=()=>{if(frame)return;frame=requestAnimationFrame(()=>{frame=0;sync()})};
new MutationObserver(queue).observe(current,{childList:true,subtree:true,characterData:true});
new MutationObserver(queue).observe(progress,{attributes:true,attributeFilter:['aria-valuenow']});
new MutationObserver(queue).observe(body,{attributes:true,attributeFilter:['class']});
document.addEventListener('click',queue);
window.addEventListener('pageshow',queue);
sync();

const brand=document.querySelector('.brand small');
if(brand)brand.textContent='AFTER HOURS / EP.01 · v1.5';
document.title='MOON MART | 심야 탈출 — v1.5';
})();