/* MOON MART v1.4 — restore handoff before the original game loads.
   Prevents the old page's pagehide autosave from overwriting imported progress.
*/
(()=>{
'use strict';
const SAVE='moon_mart_escape_ep01_v1';
const PENDING='moonmart_pending_restore_ep01_v14';
try{
  const raw=sessionStorage.getItem(PENDING);
  if(!raw)return;
  if(raw.length>200000)throw Error('Oversize restoration data');
  const s=JSON.parse(raw);
  if(s.version!==2||!['shop','storage','office'].includes(s.scene)||
     !s.flags||typeof s.flags!=='object'||Array.isArray(s.flags)||
     !Array.isArray(s.inventory)||s.inventory.length>10||
     typeof s.started!=='boolean'||!Number.isFinite(s.time)||
     s.time<0||s.time>1e9){
    throw Error('Invalid restoration state');
  }
  localStorage.setItem(SAVE,raw);
  sessionStorage.removeItem(PENDING);
  window.__moonMartRestoreApplied=true;
}catch(e){
  // Do not overwrite the existing game if the staged data cannot be verified.
  try{sessionStorage.removeItem(PENDING)}catch(_){}
  console.warn('MOON MART: backup restoration was not applied',e);
}
})();