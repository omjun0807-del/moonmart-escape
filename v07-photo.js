(()=>{'use strict';
const sources={
shop:{src:'https://images.unsplash.com/photo-1773946836383-96bc6114beb8?auto=format&fit=crop&w=2400&q=83',author:'Bruno BD',url:'https://unsplash.com/photos/interior-of-a-small-convenience-store-with-shelves-stocked-DOycDWzx-dQ'},
storage:{src:'https://images.unsplash.com/photo-1776718489109-7c624dcdb04d?auto=format&fit=crop&w=2400&q=83',author:'Chris Diamond',url:'https://unsplash.com/photos/a-dimly-lit-storage-room-with-shelves-and-ladders-Tni9sb7mEkw'},
office:{src:'https://images.unsplash.com/photo-1700049775359-6f53cd16114e?auto=format&fit=crop&w=2400&q=83',author:'Igor Omilaev',url:'https://unsplash.com/photos/a-room-filled-with-lots-of-desks-covered-in-monitors-5ma_XqDCiG4'}
};
const stage=document.getElementById('scene'), art=document.getElementById('sceneArt'), foot=document.querySelector('.scene-bottom');
if(!stage||!art||!foot)return;
const key='moon_mart_escape_visual_v07';
let mode='photo';
try{mode=localStorage.getItem(key)||'photo';}catch(e){}
const bar=document.createElement('div');bar.className='photo-select';
bar.innerHTML='<span>배경</span><button type="button" data-photo-mode="photo">실사 사진</button><button type="button" data-photo-mode="classic">기존 아트</button><span class="photo-credit"></span>';
foot.before(bar);
const credit=bar.querySelector('.photo-credit');
const labels={shop:'계산대 · 진열대 · 냉장고',storage:'보관 선반 · 분전반 · 작업대',office:'관리실 · CCTV · 출입 제어'};
const label=document.createElement('span');label.className='scene-label';label.setAttribute('aria-hidden','true');stage.append(label);
let busy=false;
function paint(){
 if(busy)return;
 busy=true;
 try{
 const room=stage.dataset.room||'shop', source=sources[room], img=art.querySelector('img');
 if(!source||!img)return;
 const classic='assets/scene-'+room+'.webp';
 stage.classList.toggle('photo-edition',mode==='photo');
 bar.querySelectorAll('[data-photo-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.photoMode===mode)));
 credit.replaceChildren();
 if(mode==='photo'){
 const link=document.createElement('a');link.href=source.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=source.author+' · Unsplash';
 credit.append('사진: ',link);
 if(img.getAttribute('data-photo-room')!==room||img.getAttribute('data-photo-mode')!=='photo'){
 img.setAttribute('data-photo-room',room);img.setAttribute('data-photo-mode','photo');img.onerror=()=>{img.onerror=null;img.dataset.fallback='yes';img.src=classic;};
 img.src=source.src;img.alt=room+' 실사 사진 배경';
 }
 }else{
 credit.textContent='게임 기존 배경';
 if(img.getAttribute('data-photo-mode')!=='classic'){
 img.setAttribute('data-photo-mode','classic');img.onerror=null;img.removeAttribute('data-fallback');img.src=classic;
 }
 }
 label.textContent=labels[room];
 }finally{busy=false;}
}
bar.addEventListener('click',e=>{const b=e.target.closest('[data-photo-mode]');if(!b)return;mode=b.dataset.photoMode;try{localStorage.setItem(key,mode);}catch(e){}paint();});
new MutationObserver(paint).observe(art,{childList:true});
paint();
})();