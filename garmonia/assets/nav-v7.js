/* Garmonia navigation — animated cover */
(function(){
'use strict';
if(window.__garmoniaNavActive)return;window.__garmoniaNavActive=true;
const root=document.documentElement,key='garmonia-nav-v7',dir=new URL('.',location.href).pathname;
const labels={'index.html':'Главная','':'Главная','services.html':'Услуги','about.html':'О центре','reviews.html':'Отзывы','contacts.html':'Контакты','booking.html':'Запись'};
const pageLabel=()=>labels[location.pathname.split('/').pop()]||document.title.split(' · ')[0]||'Услуги';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let pending=null,busy=false,timer=0,fadeTimer=0;
try{pending=JSON.parse(sessionStorage.getItem(key)||'null');sessionStorage.removeItem(key)}catch(e){}
const incoming=pending&&pending.path===location.pathname+location.search&&Date.now()-pending.at<120000;
if(incoming&&!reduced){root.dataset.navPhase='incoming';root.dataset.navTitle=pending.title}
function cover(){let el=document.getElementById('garmonia-nav-cover');if(!el&&document.body){el=document.createElement('div');el.id='garmonia-nav-cover';el.setAttribute('aria-hidden','true');document.body.prepend(el)}return el}
function setTitle(title){root.dataset.navTitle=title;const el=cover();if(el){const span=document.createElement('span');span.className='garmonia-nav-title';span.textContent=title;el.replaceChildren(span)}}
function reset(){clearTimeout(timer);clearTimeout(fadeTimer);busy=false;delete root.dataset.navPhase}
function fade(){root.dataset.navPhase='fade';fadeTimer=setTimeout(reset,350)}
function init(){setTitle(incoming?pending.title:pageLabel());if(incoming&&!reduced){requestAnimationFrame(()=>requestAnimationFrame(()=>{timer=setTimeout(fade,320)}))}else reset()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.addEventListener('pageshow',e=>{if(e.persisted)reset()});
function canonical(u){const c=new URL(u.href);c.searchParams.delete('gv');if(c.pathname.endsWith('/'))c.pathname+='index.html';c.hash='';return c.href}
document.addEventListener('click',e=>{
if(e.defaultPrevented||e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey||reduced)return;
const a=e.target.closest?.('a[href]');if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
let u;try{u=new URL(a.href,location.href)}catch(e){return}
if(u.origin!==location.origin||!u.pathname.startsWith(dir)||!/(?:\/|\.html)$/.test(u.pathname))return;
if(canonical(u)===canonical(new URL(location.href)))return;
e.preventDefault();e.stopImmediatePropagation();if(busy)return;busy=true;clearTimeout(timer);clearTimeout(fadeTimer);
const dest=u.pathname.split('/').pop();
const title=(a.dataset.transition||'').trim()||labels[dest]||(a.textContent||'').trim()||'Услуги';
u.searchParams.set('gv','8');setTitle(title);root.dataset.navPhase='show';
try{sessionStorage.setItem(key,JSON.stringify({title,path:u.pathname+u.search,at:Date.now()}))}catch(e){}
timer=setTimeout(()=>location.assign(u.href),780)
},true);
setTimeout(()=>{if(!busy&&root.dataset.navPhase)reset()},8000);
})();