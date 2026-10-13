/* MOON MART v0.9 — persistent animated environment, no save-format migration. */
(function(){
'use strict';
var scene=document.getElementById('scene'),cam=document.getElementById('sceneCamera'),
    art=document.getElementById('sceneArt'),hotspots=document.getElementById('hotspots'),
    api=window.__moonMartTest;
if(!scene||!cam||!art||!hotspots||!api||typeof api.state!=='function')return;
var world=document.createElement('div');
world.id='v09Environment';world.className='v09-layer';world.setAttribute('aria-hidden','true');
cam.insertBefore(world,hotspots);
var readout=document.createElement('div');
readout.id='v09StateReadout';readout.className='v09-scene-state';
readout.setAttribute('aria-label','환경 변화 기록');
var picker=document.querySelector('.photo-select');
if(picker)picker.insertAdjacentElement('afterend',readout);
var defs='<defs><radialGradient id="v09Glow"><stop stop-color="#bcffe8" stop-opacity=".9"/><stop offset=".3" stop-color="#81fff0" stop-opacity=".28"/><stop offset="1" stop-color="#81fff0" stop-opacity="0"/></radialGradient><linearGradient id="v09Metal" x2="0" y2="1"><stop stop-color="#647884"/><stop offset=".6" stop-color="#142a3c"/><stop offset="1" stop-color="#08111b"/></linearGradient></defs>';
function label(x,y,t){return '<text class="v09-unlocked" x="'+x+'" y="'+y+'">'+t+'</text>'}
function lamp(x,y){return '<g class="v09-bulb"><ellipse cx="'+x+'" cy="'+y+'" rx="78" ry="59" fill="url(#v09Glow)"/><path d="M'+(x-27)+' '+(y-10)+'h54l-13 22h-28z" fill="#8d8e78" stroke="#dde0ad" stroke-width="2"/><ellipse cx="'+x+'" cy="'+(y+12)+'" rx="14" ry="6" fill="#ffeab4"/></g>'}
function shop(f){
var h='';
if(f.register){
 h+='<g class="v09-drawer-open v09-panel"><path d="M302 379L426 375L442 436L295 452Z" fill="#070e19" stroke="#dcba82" stroke-width="4"/><path d="M300 407L441 403L456 469L283 478Z" fill="url(#v09Metal)" stroke="#708ea0" stroke-width="4"/><path d="M330 430L410 427" stroke="#b6d7e0" stroke-width="5"/><rect x="349" y="461" width="49" height="8" rx="3" fill="#dae4df"/></g>';
 h+='<path class="v09-glimmer" d="M365 386l8 13-8 13-8-13z" fill="#f5d484"/>'+label(323,495,'DRAWER OPEN');
}
if(f.storage){
 h+='<g><rect x="700" y="172" width="105" height="258" fill="#050f18" stroke="#7fd2bc" stroke-width="5"/><path d="M715 320l22-30 25 30" stroke="#6ee0be" fill="none" stroke-width="4"/><g class="v09-door-open v09-panel"><rect x="706" y="176" width="93" height="251" fill="url(#v09Metal)" stroke="#7f99a5" stroke-width="6"/><rect x="715" y="187" width="72" height="198" fill="#193c49" opacity=".72"/><circle cx="780" cy="325" r="6" fill="#f5dc9d"/></g></g>';
 h+=label(697,450,'STAFF OPEN');
}
if(f.terminal){
 h+='<g><rect x="472" y="164" width="156" height="213" fill="#284d65" opacity=".48"/><path d="M484 340L548 235L615 340" fill="none" stroke="#b6e2c5" stroke-width="4" opacity=".45"/><g class="v09-shutter-open"><rect x="472" y="164" width="156" height="213" fill="#293f4d" stroke="#718c9d" stroke-width="5"/>';
 for(var i=0;i<12;i++)h+='<path d="M474 '+(173+i*16)+'h152" stroke="#677d89" stroke-width="5"/>';
 h+='</g></g>'+label(458,408,'SHUTTER UNLOCKED');
}
return h;
}
function storage(f){
var h='';
if(f.power){
 h+='<g class="v09-panel"><rect x="583" y="188" width="115" height="124" rx="9" fill="#103b3c" stroke="#7ff1d6" stroke-width="5"/>';
 for(var i=0;i<3;i++)h+='<rect x="'+(602+30*i)+'" y="216" width="18" height="43" rx="4" fill="#75f2c8" stroke="#aac4c4" stroke-width="3"/>';
 h+='<circle class="v09-lit" cx="641" cy="285" r="9" fill="#b9ffe7"/></g>'+label(594,343,'POWER ON');
 h+=lamp(290,83)+lamp(770,83);
}else{
 h+='<g><rect x="586" y="191" width="111" height="119" rx="8" fill="#071220" stroke="#81929c" stroke-width="4"/><circle cx="641" cy="282" r="8" fill="#e48276"/></g>'+label(590,341,'POWER OFF');
}
if(f.scanned){
 h+='<g class="v09-glimmer"><rect x="264" y="473" width="109" height="55" rx="6" fill="#183f3e" stroke="#7bf7d0" stroke-width="3"/>'+label(280,506,'SCAN OK')+'</g>';
}
if(f.office){
 h+='<g><rect x="769" y="170" width="130" height="265" fill="#051420" stroke="#76d7c1" stroke-width="5"/><g class="v09-door-open"><rect x="775" y="177" width="118" height="254" fill="url(#v09Metal)" stroke="#879b9e" stroke-width="6"/><rect x="786" y="193" width="90" height="176" fill="#1c3645"/></g></g>'+label(764,461,'OFFICE OPEN');
}
return h;
}
function office(f){
var h='';
if(f.cctv){
 h+='<g class="v09-monitor"><rect x="472" y="149" width="158" height="137" rx="6" fill="#0a3641" stroke="#96ffe0" stroke-width="6"/><path d="M484 172h134M484 207h134M484 244h134" stroke="#a7f4e0" stroke-width="3" opacity=".35"/>';
 for(var i=0;i<3;i++)h+='<rect x="'+(493+41*i)+'" y="182" width="25" height="21" fill="#7dffe5" opacity=".5"/>';
 h+='</g>'+label(469,306,'CCTV ONLINE');
}
if(f.terminal){
 h+='<g><rect x="783" y="337" width="121" height="111" rx="4" fill="#0a3f36" stroke="#8effe1" stroke-width="5"/><path d="M803 363h80M803 384h62" stroke="#6defc3" stroke-width="6" opacity=".8"/><circle class="v09-lit" cx="875" cy="414" r="9" fill="#a8ffe7"/></g>'+label(786,473,'UNLOCKED');
}
return h;
}
var lists={
 shop:[['계산대 서랍','register'],['창고 문','storage'],['셔터','terminal']],
 storage:[['전력','power'],['스캐너','scanned'],['관리실 문','office']],
 office:[['CCTV','cctv'],['셔터 제어','terminal']]
};
var last='',ready=false,raf=0;
function update(){
 var s;try{s=api.state()}catch(e){return}
 if(!s||!s.scene||!s.flags)return;
 var mode=scene.classList.contains('designed-edition'),f=s.flags;
 var signature=[s.scene,mode,Object.keys(f).sort().map(function(k){return k+Number(!!f[k])}).join('')].join('|');
 if(signature===last)return;
 var old=last;last=signature;
 world.hidden=!mode;
 if(mode){
  var drawing=s.scene==='shop'?shop(f):s.scene==='storage'?storage(f):office(f);
  world.innerHTML='<svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">'+defs+drawing+'</svg>';
  world.classList.remove('is-changing');
  if(ready&&old!==signature&&(!window.matchMedia||!matchMedia('(prefers-reduced-motion: reduce)').matches)){
   void world.offsetWidth;world.classList.add('is-changing');
  }
 } else world.replaceChildren();
 readout.replaceChildren();
 var header=document.createElement('strong');header.textContent='현장 상태';readout.appendChild(header);
 (lists[s.scene]||[]).forEach(function(item){
  var chip=document.createElement('span');
  chip.className='v09-chip'+(f[item[1]]?' done':'');
  chip.textContent=item[0];readout.appendChild(chip);
 });
 ready=true;
}
function queue(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;update()})}
new MutationObserver(queue).observe(art,{childList:true});
new MutationObserver(queue).observe(scene,{attributes:true,attributeFilter:['class','data-room']});
document.addEventListener('click',queue);
window.addEventListener('pageshow',queue);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')queue()});
queue();
})();