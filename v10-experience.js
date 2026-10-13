/* MOON MART v1.0 RC — enhanced object art and investigation diary, additive to v0.9 */
(function(){
'use strict';
var body=document.getElementById('dialogBody'),title=document.getElementById('dialogTitle');
var mission=document.getElementById('missionPanel'),api=window.__moonMartTest;
if(!body||!title||!mission||!api||typeof api.state!=='function')return;
var artHeader='<span class="v10-micro">MOON MART / EVIDENCE LAB · EPISODE 01</span>';
var micro=function(t){return '<span class="v10-micro">'+t+'</span>'};
var lead=function(t){return '<span class="v10-lead">'+t+'</span>'};
var line=function(t){return '<span class="v10-note">'+t+'</span>'};
var led=function(n){return '<div class="v10-led">'+n+'</div>'};
var paper=function(text){return '<div class="v10-paper v10-torn">'+text+'</div>'};
var device=function(text){return '<div class="v10-device">'+text+'</div>'};
var receipt=function(){return paper('<h3>MOON MART</h3><div class="v10-small" style="text-align:center">10/13 · 00:03</div><hr><div class="v10-itemrow"><b>우유</b><strong>4</strong></div><div class="v10-itemrow"><b>생수</b><strong>2</strong></div><div class="v10-itemrow"><b>과자</b><strong>7</strong></div><hr><div class="v10-small">수량 확인용 영수증</div>')};
var registry=function(f){
 return device(micro('STAFF AUTHENTICATION / CASHIER')+led(f.register?'OPEN':'● ● ●')+'<div class="v10-pad">'+['1','2','3','4','5','6','7','8','9','C','0','↵'].map(function(x){return '<i>'+x+'</i>'}).join('')+'</div>'+line('번호 입력은 아래 퍼즐 키패드를 이용하세요.'));
};
var note=function(){return paper('<h3>직원 메모</h3><p class="v10-scribble">계산대 임시 암호<br><b>우유 → 생수 → 과자</b><br>순서대로 수량 확인.</p><hr><div class="v10-small">작성자 불명 · 00:03</div>')};
var lockdoor=function(f){return device(micro('SERVICE ENTRANCE / 01')+'<div style="height:85px;display:grid;place-items:center;background:linear-gradient(90deg,#172734,#435568,#182b39);margin:12px 0;border:3px ridge #7a8b91"><span style="color:#cfdbc9;font-size:42px">'+(f.storage?'◉':'⚿')+'</span></div>'+led(f.storage?'ACCESS':'LOCKED')+lead(f.storage?'출입 승인':'열쇠가 필요합니다'))};
var fridge=function(){return '<div style="width:85%;background:linear-gradient(90deg,#0c4264,#317691,#122c44);padding:19px;border:7px ridge #88aeb9;box-shadow:0 12px 25px #000a;display:grid;place-items:center"><span style="font-size:65px;color:#ffdf9e;text-shadow:0 0 22px #ffe390">☀</span><strong style="font-size:13px">매장 안전 표식</strong></div>'};
var breaker=function(f){return device(micro('POWER DISTRIBUTION BOARD')+'<div class="v10-wires">'+['냉장','조명','보안'].map(function(n,i){return '<div class="v10-wire"><span style="font-size:9px">'+n+'</span><span class="v10-switch '+(f.power?'on':'')+'"></span><span class="v10-light '+(f.power?'':'off')+'"></span></div>'}).join('')+'</div>'+lead(f.power?'전원 복구 완료':'수동 스위치 복구 대기'))};
var scan=function(f){
 return '<div style="width:74%;max-width:245px;height:125px;border:9px ridge #5d6b79;border-radius:18px 18px 8px 8px;background:linear-gradient(135deg,#4c6579,#0b1721 52%,#355364);position:relative;display:grid;place-items:center;box-shadow:9px 16px 25px #000a"><div style="width:72%;height:60%;background:#061c2a;box-shadow:inset 0 0 14px #000;border:2px solid #738b9a;display:grid;place-items:center;color:#81eaca;font-size:14px">'+(f.scanned?'SCAN COMPLETE':f.batteryInstalled?'READY':'AA BATTERY EMPTY')+'</div><div style="position:absolute;bottom:-17px;width:45%;height:21px;background:#182b39;border:3px solid #586e79;border-radius:0 0 7px 7px"></div></div>'+micro('PORTABLE SCANNER / BETA S-03');
};
var boxes=function(f){return '<div class="v10-container-row"><div class="v10-crate">'+(f.scanned?'3':'?')+'</div><div class="v10-crate red">'+(f.scanned?'8':'?')+'</div><div class="v10-crate yellow">'+(f.scanned?'5':'?')+'</div></div>'+lead('파랑 · 빨강 · 노랑')};
var toolbox=function(f){return device(micro('MAINTENANCE CASE / SECURED')+'<div style="display:flex;justify-content:space-evenly;padding:17px 10px;background:#0b1925;border:2px inset #627785;border-radius:6px;margin:12px 0">'+[0,1,2].map(function(){return '<span style="display:grid;place-items:center;height:52px;width:46px;border:3px ridge #8199a7;background:linear-gradient(#283b51,#111c2c);font-size:30px;color:#e1f3ff">?</span>'}).join('')+'</div>'+lead(f.case?'공구함 열림':'3자리 암호 대기'))};
var cctv=function(f){return '<span class="v10-cctv-head">● REC / SURVEILLANCE 4 CH</span><div class="v10-cctv">'+['00:10:02','00:11:17','00:12:38','00:13:00'].map(function(t,i){return '<div class="v10-feed"><b>CAM '+(i+1)+'</b><span>'+t+'</span></div>'}).join('')+'</div>'+micro(f.cctv?'ARCHIVE RESTORED':'SORT TIMESTAMPS TO RECOVER ARCHIVE')};
var control=function(f){return '<div class="v10-terminal">'+micro('EMERGENCY SHUTTER CONTROL')+'<hr style="border:0;border-top:1px solid #277d74">'+led(f.terminal?'UNLOCKED':'DENIED')+'<div class="v10-symbols"><span>☀</span><span>★</span><span>☾</span></div>'+lead('ZONE AUTHORIZATION / 03')+'</div>'};
var staff=function(){return '<div class="v10-staff"><b>☾ MOON MART</b><div style="display:flex;gap:14px;align-items:center"><span class="v10-photo">♙</span><div><b>서이현</b><br><small>STAFF / CONTROL</small></div></div><span style="font:900 11px ui-monospace,monospace">AUTHORIZED · 0017</span></div>'};
var shutter=function(f){return '<div class="v10-shutter" style="'+(f.terminal?'transform:translateY(-18px);':'')+'"></div>'+lead(f.terminal?'잠금 해제 완료 · 정문으로 이동하세요.':'LOCKDOWN / 00:13 · 비상 잠금 중')};
var checklist=function(){return paper('<h3>야간 근무 수첩</h3><p class="v10-scribble">1. CCTV 시간순 복구<br>2. 세 구역 안전 표식 확인<br>3. 비상 셔터 승인<br><br>“00:13 기록은 삭제 금지.”</p>')};
var spark=function(){return paper('<h3>창고 안전 수칙</h3><p class="v10-scribble"><b>복구 절차</b><br>냉장 → 조명 → 보안<br><br><b>공구함 확인</b><br>파랑 → 빨강 → 노랑</p>')};
var mappings=[
 [/구겨진 영수증/,receipt],
 [/잠긴 계산대|열린 계산대/,registry],
 [/상품 진열대/,note],
 [/냉장고/,fridge],
 [/창고 문|관리실 출입문/,lockdoor],
 [/창고 분전반|복구된 분전반/,breaker],
 [/휴대용 스캐너|스캐너 기록/,scan],
 [/색깔 상자/,boxes],
 [/잠긴 공구함|열린 공구함/,toolbox],
 [/CCTV 기록 복원|복원된 감시 기록|감시 모니터/,cctv],
 [/비상 제어 단말기|셔터 비상 제어/,control],
 [/업무 수첩/,checklist],
 [/창고 안전 수칙/,spark],
 [/굳게 닫힌 정문|정문 셔터/,shutter],
 [/관리실 카드|출입 카드/,staff]
];

function draw(){
 const heading=title.textContent||'';
 if(!heading||heading==='00:13, 셔터가 내려왔다')return;
 const entry=mappings.find(function(m){return m[0].test(heading)});
 if(!entry)return;
 const f=api.state().flags||{};
 let holder=body.querySelector('.precision-photo');
 if(holder){
   if(holder.dataset.v10===heading)return;
   holder.classList.add('v10-custom');holder.dataset.v10=heading;
   holder.removeAttribute('data-evidence');holder.style.backgroundImage='none';
   holder.innerHTML='<div class="v10-artboard"><div class="v10-content">'+artHeader+entry[1](f)+'</div></div>';
   const water=body.querySelector('.precision-watermark');
   if(water)water.textContent='MOON MART · CLOSE INSPECTION / v1.0';
 }else if(!body.querySelector('.v10-inline')){
   const section=document.createElement('section');
   section.className='v10-inline';
   section.setAttribute('aria-label','사물 조사 그림');
   section.innerHTML='<div class="v10-artboard" style="position:relative;min-height:210px;max-height:230px;border:1px solid #506678;border-radius:10px;margin:0 0 16px;overflow:hidden"><div class="v10-content">'+artHeader+entry[1](f)+'</div></div>';
   body.prepend(section);
 }
}
new MutationObserver(function(){if(window.requestAnimationFrame)requestAnimationFrame(draw);else draw()}).observe(body,{childList:true});
draw();

const journalButton=document.createElement('button');
journalButton.type='button';journalButton.id='v10JournalButton';journalButton.className='v10-journal-btn';
journalButton.innerHTML='<span><span class="v10-spine"></span> 사건 조사 일지 열기</span><span class="num">EP.01 ↗</span>';
mission.append(journalButton);

const wrap=document.createElement('div');
wrap.id='v10JournalOverlay';wrap.className='v10-overlay';wrap.hidden=true;
wrap.innerHTML='<section class="v10-dialog" role="dialog" aria-modal="true" aria-labelledby="v10JournalTitle" tabindex="-1"><div class="v10-storyline">MOON MART / AFTER HOURS · ARCHIVE</div><h2 id="v10JournalTitle">00:13 사건 조사 일지</h2><p class="v10-subtitle">발견한 단서만 기록됩니다. 아직 찾지 못한 이야기는 잠겨 있습니다.</p><div class="v10-entries" id="v10Entries"></div><p class="v10-footer">보관 위치: 이 브라우저의 게임 진행 기록</p><button type="button" class="v10-close" id="v10JournalClose">돌아가기</button></section>';
document.body.append(wrap);
const entries=[
 ['00:13 · 자동 셔터 작동','폐점 직후 셔터가 이유 없이 내려왔습니다. 관리자 계정은 로그인된 상태였습니다.',()=>true],
 ['00:03 · 마지막 계산 기록','수량이 특정 순서로 정리된 영수증과 손글씨 메모가 발견됐습니다.',f=>f.receipt&&f.memo],
 ['00:10 · 창고 출입','잠긴 창고를 열었습니다. 이곳의 전원과 보안 장치가 누군가에 의해 차단돼 있었습니다.',f=>f.storage],
 ['00:11 · 정전의 원인','냉장·조명·보안 회로를 복구했습니다. 단순한 정전이 아닌 수동 비상 잠금이 의심됩니다.',f=>f.power],
 ['직원 서이현의 흔적','창고 공구함 속 관리실 출입 카드를 발견했습니다. 이전 근무자 서이현의 이름이 남아 있습니다.',f=>f.case],
 ['00:12 · 사라진 네 장의 기록','CCTV에서 누락된 시간 순서를 복원했습니다. 마지막 영상에 셔터 제어 표식이 숨겨져 있었습니다.',f=>f.cctv],
 ['00:13 · 마지막 명령','관리실 인증을 마치고 셔터 잠금을 해제했습니다. 단말기에는 누가 명령했는지 남아 있지 않습니다.',f=>f.terminal],
 ['EP.01 사건 종결','밖으로 나왔지만 모니터의 시계는 여전히 00:13입니다. 마지막 근무자가 남긴 흔적은 다음 밤으로 이어집니다.',f=>f.escaped]
];
let returnFocus=null;
function openJournal(){
 let f=api.state().flags||{};
 const list=document.getElementById('v10Entries');
 list.replaceChildren();
 for (const e of entries){
   const done=e[2](f);
   const node=document.createElement('article');node.className='v10-entry'+(done?'':' pending');
   const b=document.createElement('b');b.textContent=done?e[0]:'🔒 미발견 기록';
   const p=document.createElement('p');p.textContent=done?e[1]:'게임을 진행하면 이 기록을 확인할 수 있습니다.';
   node.append(b,p);list.append(node);
 }
 returnFocus=document.activeElement;
 wrap.hidden=false;wrap.querySelector('.v10-dialog').focus();
}
function closeJournal(){wrap.hidden=true;returnFocus&&returnFocus.focus&&returnFocus.focus()}
journalButton.addEventListener('click',openJournal);
wrap.querySelector('#v10JournalClose').addEventListener('click',closeJournal);
wrap.addEventListener('click',function(e){if(e.target===wrap)closeJournal()});
wrap.addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();closeJournal()}});
document.addEventListener('keydown',function(e){
 if(wrap.hidden)return;
 if(e.key==='Tab'){
   const close=wrap.querySelector('#v10JournalClose');
   if(document.activeElement!==close){e.preventDefault();close.focus()}
 }
});
const tag=document.querySelector('.brand small');
if(tag)tag.textContent='AFTER HOURS / EP.01 · v1.0 RC';
})();
