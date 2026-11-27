const BRAND='Хвойный сад';
const business={
 phone:'8 (977) 923-55-23',manager:'8 (999) 925-06-07',
 address:'Московская область, г. Мытищи, посёлок Дружба, Кропоткинский проезд, владение 2, участок 2А',
 stand:'Экспоцентр растений «Дружба», линия А, экспозиция 2а',
 map:'https://yandex.ru/maps/org/khvoyny_sad/218575744992/',
 gallery:'https://yandex.ru/maps/org/khvoyny_sad/218575744992/gallery/?ll=37.766962%2C55.882409&z=15',
 wa:'https://wa.me/79779235523',waSergey:'https://wa.me/79999250607',telegram:'https://t.me/Hvoynyisad_msk',
 vk:'https://vk.com/hvoynyisad',viber:'https://viber.click/79779235523'
};
let logoInstance=0;
function brandLogo(full=false){
 const id='brand-ink-'+(++logoInstance);
 const part=(box,cls)=>`<svg class="${cls}" viewBox="${box}" aria-hidden="true"><image href="assets/hvoynyisad-logo.webp" x="0" y="0" width="1280" height="905" filter="url(#${id})"/></svg>`;
 return `<span class="nursery-logo ${full?'logo-stacked':''}" role="img" aria-label="Хвойный сад"><svg width="0" height="0" aria-hidden="true" class="brand-defs"><defs><filter id="${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -1.38 0 0 0 1.37" result="ink"/><feFlood flood-color="currentColor"/><feComposite operator="in" in2="ink"/></filter></defs></svg>${part('411 115 408 501','brand-forest')}${part('218 654 836 118','brand-name')}</span>`;
}
const photoURL=i=>'assets/nursery/'+String(i).padStart(2,'0')+'.webp';
const galleryLink='<a class="link" href="'+business.gallery+'" target="_blank" rel="noopener">Галерея на Яндекс Картах ↗</a>';
const downloadPrice='<div class="price-downloads"><a class="btn outline" href="assets/price-2025.xlsx" download>Скачать прайс в Excel ↓</a><a class="link" href="assets/price-2025.csv" download>CSV</a><a class="link" href="https://hvoynyisad.ru/#price" target="_blank" rel="noopener">Прайс на сайте питомника ↗</a></div>';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const icons={search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',heart:'<path d="M20.5 4.5a5 5 0 0 0-7.1 0L12 6l-1.4-1.5a5 5 0 0 0-7.1 7.1L12 21l8.5-9.4a5 5 0 0 0 0-7.1Z"/>',cart:'<path d="M2 3h3l3 13h11l3-10H6M9 20h.01M18 20h.01"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',leaf:'<path d="M20 3C7 2 2 8 5 16s17 3 15-13ZM4 21 16 8M8 16l-1-6M12 12h6"/>',shield:'<path d="m12 2 9 4v6c0 5-5 9-9 10-4-1-9-5-9-10V6Z M7 12l3 3 7-7"/>',truck:'<path d="M2 5h13v12H2zM15 9h4l3 4v4h-7"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="18" r="2.5"/>',head:'<path d="M3 14v-3a9 9 0 0 1 18 0v3M3 12h3v6H3zM18 12h3v6h-3zM18 18v2h-6"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>'};
const icon=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]}</svg>`;
const cats=nurseryCategories;
const shortCategoryNames=['Хвойные','Лиственные деревья','Кустарники','Плодовые','Для солнца','Для тени','Травы'];
const catImages={conifers:52,trees:57,shrubs:25,fruit:14,sun:40,shade:21,grasses:22};
const data=nurseryRows.map(([cat,name,height,container,raw],index)=>({id:10001+index,cat,name,height,container,price:raw===''?null:Number(raw.replace(/\s/g,'')),img:catImages[cat]}));
const money=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2})+' ₽';
const asset=n=>typeof n==='number'?photoURL(n):`assets/${n}.jpg`;
const storage={get(k,d){try{return JSON.parse(localStorage.getItem('garden_'+k))??d}catch{return d}},set(k,v){try{localStorage.setItem('garden_'+k,JSON.stringify(v))}catch{}}};let cart=[],fav=[],quantities={},chosen=0,detailQty=1;
function loadState(){const c=storage.get('cart',[]),f=storage.get('fav',[]);cart=Array.isArray(c)?c.filter(x=>x&&data.some(p=>p.id===x.id)&&Number.isInteger(x.v)&&x.v===0&&data.find(p=>p.id===x.id)?.price!=null&&Number.isInteger(x.qty)&&x.qty>0).map(x=>({...x,qty:Math.min(99,x.qty)})):[];fav=Array.isArray(f)?[...new Set(f.filter(id=>data.some(p=>p.id===id)))]:[];}loadState();
const portable=!!window.PORTABLE;const url=(p,q='')=>portable?`#${p}${q?'?'+q:''}`:`${p==='home'?'index':p}.html${q?'?'+q:''}`;const link=(p,t,cl='',q='')=>`<a class="${cl}" href="${url(p,q)}">${t}</a>`;const image=(n,alt='')=>`<img src="${asset(n)}" alt="${alt}">`;const btn=(p,t,q='')=>link(p,t+' →','btn',q);const find=id=>data.find(p=>p.id===Number(id));const cost=(p,v)=>p.price;
function route(){let raw=portable?(location.hash.slice(1)||'home'):location.pathname.split('/').pop().replace('.html','')+location.search;let [page,qs='']=raw.split('?');return {page:page==='index'||!page?'home':page,params:new URLSearchParams(qs)}}
function header(){return `<header class="header"><div class="wrap nav">${link('home',`${brandLogo()}`,'brand')}<nav class="navlinks" id="site-nav" aria-label="Основная навигация">${link('catalog','Каталог ⌄')}${link('about','О питомнике')}${link('delivery','Доставка и оплата')}${link('reviews','Отзывы')}${link('contacts','Контакты')}</nav><button class="menu-backdrop" aria-label="Закрыть меню" tabindex="-1" onclick="setMenu(false)"></button><div class="actions">${link('catalog',icon('search')+'<span class="sr-only">Поиск</span>','icon','focus=1')}${link('favorites',icon('heart')+`<span class="sr-only">Избранное</span><span class="count" id="favcount">${fav.length}</span>`,'icon')}${link('cart',icon('cart')+`<span class="sr-only">Корзина</span><span class="count" id="cartcount">${cart.reduce((s,x)=>s+x.qty,0)}</span>`,'icon')}<button class="icon menu" aria-label="Меню" aria-expanded="false" aria-controls="site-nav" onclick="toggleMenu()"><span class="hamburger" aria-hidden="true"><i></i><i></i><i></i></span></button></div></div></header>`}
function footer(){return `<footer class="footer"><div class="wrap foot-grid"><div>${link('home',brandLogo(),'brand')}<p>Питомник растений в Мытищах · с 2010 года</p><a href="https://hvoynyisad.ru/privacy-policy/" target="_blank" rel="noopener">Политика конфиденциальности ↗</a></div><div><b>Покупателям</b>${link('catalog','Каталог и цены')}${link('delivery','Доставка и оплата')}${link('about','Фотографии питомника','','view=gallery')}${link('favorites','Избранное')}${link('cart','Корзина')}</div><div><b>${business.stand}</b><p>09:00–18:00</p><a href="tel:+79779235523">${business.phone}</a><a href="tel:+79999250607">${business.manager} · Сергей</a>${link('contacts','Все контакты →')}</div></div></footer>`}
function cards(list){return list.length?`<div class="grid">${list.map(card).join('')}</div>`:`<div class="empty"><h2>Ничего не найдено</h2><p>Попробуйте изменить условия поиска.</p>${btn('catalog','Весь каталог')}</div>`}
const benefit=(n,t)=>`<div class="strip-item">${icon(n)}<span>${t}</span></div>`;const crumb=t=>`<div class="crumb">${link('home','Главная')} / ${t}</div>`;const pageHead=(t,desc='')=>`<div class="pagehead"><h1>${t}</h1>${desc?`<p>${desc}</p>`:''}</div>`;
function pineScene(){
 const notes=[
  ['Консультация специалиста','Обсудить посадку и уход','contacts','consult=1'],
  ['Ваш сад','Подобрать растения для участка','catalog',''],
  ['Доставка по России','Уточнить условия для вашего региона','delivery','']
 ];
 return `<pine-grove id="about-grove" role="region" aria-labelledby="grove-title"><div class="grove-stage">
  <header class="grove-head"><div class="eyebrow">О питомнике</div><h2 id="grove-title">От саженца<br><em>до вашего сада.</em></h2></header>
  <canvas class="grove-root-bed" aria-hidden="true"></canvas><canvas class="grove-ground-shadow" aria-hidden="true"></canvas><div class="grove-tree" aria-hidden="true"><img src="assets/pine-afternoon.webp" loading="lazy" alt=""><canvas class="grove-specimen"></canvas></div>
  <div class="grove-notes">${notes.map(([label,description,page,query])=>`<a class="grove-note" href="${url(page,query)}"><strong>${label}</strong><small>${description} →</small></a>`).join('')}</div>
  <div class="grove-foot"><span><i>Pinus sylvestris</i>Сосна обыкновенная</span><span class="grove-hint">Листайте, чтобы увидеть рост ↓</span></div>
 </div></pine-grove>`
}
function home(){return `<section class="hero">
 <div class="wrap hero-inner"><div class="hero-copy"><div class="eyebrow">Питомник декоративных растений</div>
 <h1>У сада есть<br><em>характер.</em></h1>
 <p>Растения из собственного питомника в Мытищах. Выращиваем для вашего сада с 2010 года.</p>
 <div class="hero-buttons">${link('catalog','Выбрать растения <span aria-hidden="true">→</span>','btn light')}${link('about','О питомнике','hero-about')}</div></div></div>
 <div class="cover-index wrap"><span>Коллекции</span>${cats.map(([,key],i)=>link('catalog',shortCategoryNames[i],'','cat='+key)).join('')}</div>
 </section><div class="wrap"><section class="section collections"><div class="section-head"><h2>Коллекции сада</h2>${link('catalog','Весь каталог →','link')}</div>
 <div class="category-layout">${cats.map(([name,key])=>`<a class="category" href="${url('catalog','cat='+key)}">${image(catImages[key],'')}<strong>${name}</strong><span aria-hidden="true">→</span></a>`).join('')}</div></section><section class="section"><div class="section-head"><h2>Из прайса питомника</h2>${link('catalog','Смотреть все →','link')}</div><div class="popular-layout">${cards([data[0],data[240],data[307],data[487]])}<aside class="promo"><div class="eyebrow">Открытый грунт</div><h2>Прайс-лист 2025</h2><p>Все высоты, контейнеры и цены в одном файле.</p><a class="btn light" href="assets/price-2025.xlsx" download>Скачать Excel ↓</a></aside></div></section></div>${pineScene()}<section class="wrap nursery-visit" aria-labelledby="visit-title">
 <figure class="visit-photos"><img loading="lazy" src="${photoURL(32)}" alt="Дорожка между посадками в демонстрационном саду"><img loading="lazy" src="${photoURL(34)}" alt="Белые цветы в саду питомника"></figure>
 <div class="visit-copy"><div class="eyebrow">Мытищи · Садовый центр</div><h2 id="visit-title">В гостях у питомника</h2>
 <p>Пройдите по демонстрационному саду, рассмотрите хвою и форму крон вблизи. С выбором растений для вашего участка поможет специалист питомника.</p>
 <dl class="visit-details"><div><dt>Время работы</dt><dd>09:00–18:00</dd></div><div><dt>На месте</dt><dd>Парковка и самовывоз</dd></div></dl>
 <div class="visit-actions">${link('contacts','Как добраться →','btn')}${link('about','Фотографии сада →','link','view=gallery')}</div></div></section>`}
const catName=key=>cats.find(c=>c[1]===key)?.[0]||'';
function dimensions(p){
 let size=p.height.trim(),pack=p.container.trim();
 if(/^[cс]\s*\d/i.test(size)&&(/^[\d]/.test(pack)||/^[pр][aа]$/i.test(pack))){[size,pack]=[pack,size]}
 const standard=size.match(/^(h|d|[pр][aа])?\s*(\d+)?(?:\s*-\s*(\d+))?(\+)?$/i);
 if(!size)return {label:'Размер саженца',value:'По запросу',pack};
 if(!standard||standard[3]&&Number(standard[2])>Number(standard[3]))return {label:'Размер по прайсу',value:size+' · уточнить',pack};
 const [,prefix='',start,end,plus]=standard;
 const label=/^[pр]/i.test(prefix)?'Высота штамба':/^d/i.test(prefix)?'Диаметр кроны':'Высота саженца';
 return {label,value:start?start+(end?'–'+end:'')+(plus||'')+' см':'По запросу',pack};
}
const spec=p=>{const d=dimensions(p);return [d.label+' · '+d.value,d.pack].filter(Boolean).map(esc).join(' · ')};
const heartButton=p=>`<button type="button" class="heart" aria-label="Избранное" aria-pressed="${fav.includes(p.id)}" data-fav="${p.id}" onclick="toggleFav(${p.id})">${fav.includes(p.id)?'♥':'♡'}</button>`;
const priceText=p=>p.price===null?'Уточнить цену':money(p.price);
function plantProfile(p){
 const [key,custom]=plantIndex[p.name];
 const photo=plantPhotos[key];
 return {photo,description:custom||plantDescriptions[p.name.split(' ')[0].replace(',','')]};
}
function plantImage(photo,lazy=true){
 return `<img class="botanical-photo" src="${esc(photo.file)}" alt="${esc(photo.label)}" width="600" height="420" ${lazy?'loading="lazy"':''} decoding="async">`;
}
function measureBlock(p){
 const d=dimensions(p);
 return `<dl class="plant-measures"><div class="measured"><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div><div><dt>Упаковка</dt><dd>${esc(d.pack||'По запросу')}</dd></div></dl>`;
}
function plantTile(p,items){
 const {photo,description}=plantProfile(p),multi=items.length>1;
 const prices=items.map(x=>x.price).filter(n=>n!==null);
 const price=multi&&prices.length?(Math.min(...prices)!==Math.max(...prices)?'от ':'')+money(Math.min(...prices)):priceText(p);
 const options=multi?`<details class="plant-options"><summary>Размеры и цены <small>${items.length}</small></summary>${items.map(row=>`<a href="${url('product','id='+row.id)}"><span>${spec(row)}</span><b>${priceText(row)} →</b></a>`).join('')}</details>`:measureBlock(p);
 return `<article class="plant-tile"><div class="plant-frame"><a href="${url('product','id='+p.id)}" aria-label="${esc(p.name)}">${plantImage(photo)}</a><span class="photo-tag">${esc(photo.type)}</span>${heartButton(p)}</div><div class="plant-copy"><h3>${link('product',esc(p.name),'','id='+p.id)}</h3><p>${esc(description)}</p>${options}<div class="plant-end"><strong>${price}</strong>${link('product','Подробнее →','link','id='+p.id)}</div></div></article>`;
}
function card(p){return plantTile(p,[p])}
function catalog(params){
 return `<section class="wrap nursery-section">${crumb('Каталог')}<div class="catalog-intro"><div class="eyebrow">Открытый грунт · Прайс-лист 2025</div><h1>Каталог растений</h1><p>Выберите раздел или найдите растение по названию. Наличие и стоимость на дату заказа подтвердит питомник.</p>${downloadPrice}</div>
 <div class="price-layout"><aside class="price-aside"><h2>Разделы</h2><nav aria-label="Разделы прайса">${[['Все растения',''],...cats].map(([label,key])=>link('catalog',esc(label)+'<small>'+(key?data.filter(p=>p.cat===key).length:data.length)+'</small>',(params.get('cat')||'')===key?'active':'',key?'cat='+key:'')).join('')}</nav></aside>
 <div class="price-content"><div class="toolbar"><input class="field" id="query" type="search" aria-label="Поиск растений" placeholder="Название, сорт или контейнер…" value="${esc(params.get('q')||'')}"><input type="number" class="field" id="maxprice" min="0" placeholder="Цена до, ₽" aria-label="Максимальная цена"><select class="field" id="sort" aria-label="Сортировка"><option value="source">Как в прайсе</option><option value="low">Сначала дешевле</option><option value="high">Сначала дороже</option><option value="name">По названию</option></select></div>
 <p id="results" role="status"></p><div id="cataloglist"></div></div></div></section>`;
}
const searchKey=s=>s.toLocaleLowerCase('ru').replaceAll('ё','е').trim();
function collectionCards(){
 return '<div class="collection-shelf">'+cats.map(([label,key])=>{
  const count=data.filter(p=>p.cat===key).length;
  return link('catalog',`<img loading="lazy" src="${photoURL(catImages[key])}" alt=""><div><small>Позиций в прайсе · ${count}</small><h2>${esc(label)}</h2></div><span aria-hidden="true">↗</span>`,'collection-cover','cat='+key);
 }).join('')+'</div>';
}
function assortment(rows){
 const groups=new Map();
 for(const p of rows){
  const key=p.cat+'|'+p.name;
  if(!groups.has(key))groups.set(key,[]);
  groups.get(key).push(p);
 }
 return '<div class="plant-shelf">'+Array.from(groups.values(),items=>plantTile(items[0],items)).join('')+'</div>';
}
function renderCatalog(){
 const cat=route().params.get('cat'),q=searchKey(document.querySelector('#query').value),raw=document.querySelector('#maxprice').value,sort=document.querySelector('#sort').value;
 const rows=data.filter(p=>(!cat||cat===p.cat)&&(!q||searchKey([p.name,p.height,p.container].join(' ')).includes(q))&&(raw===''||(p.price!==null&&p.price<=Number(raw))));
 if(sort==='name') rows.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
 if(sort==='low'||sort==='high') rows.sort((a,b)=>a.price===null?1:b.price===null?-1:(a.price-b.price)*(sort==='low'?1:-1));
 document.querySelector('#results').textContent='Позиций в прайсе: '+rows.length;
 const list=document.querySelector('#cataloglist');
 if(!cat && !q && raw==='' && sort==='source'){list.innerHTML=collectionCards();return;}
 const title=cat?catName(cat):'Результаты подбора';
 const banner=catName(cat)?`<header class="collection-banner"><img src="${photoURL(catImages[cat])}" alt=""><h2>${esc(title)}</h2></header>`:`<h2 class="match-heading">${title}</h2>`;
 const compare=sort==='low'||sort==='high';
 list.innerHTML=rows.length?banner+(compare?'<div class="plant-shelf">'+rows.map(card).join('')+'</div>':assortment(rows)):'<div class="empty"><h2>Растения не найдены</h2><p>Попробуйте другое название или снимите ограничение цены.</p></div>';
}
function priceTable(items,selectedId){
 return `<div class="stock-scroll"><table class="stock-table"><thead><tr><th>Название</th><th>Размер саженца</th><th>Контейнер</th><th>Цена</th><th><span class="sr-only">Заказ</span></th></tr></thead><tbody>${items.map(p=>`<tr>
 <th scope="row">${link('product',esc(p.name),'','id='+p.id)}${p.id===selectedId?'<small class="selected-size">Выбран</small>':''}</th><td>${esc(dimensions(p).label)}<br>${esc(dimensions(p).value)}</td><td>${esc(dimensions(p).pack)||'—'}</td><td class="stock-price">${priceText(p)}</td>
 <td>${p.price===null?link('contacts','Спросить','table-ask'):`<button class="table-add" type="button" aria-label="В корзину: ${esc(p.name)}" onclick="add(${p.id},0,1)">+</button>`}</td></tr>`).join('')}</tbody></table></div>`;
}
function product(p){
 if(!p)return `<section class="wrap section">${pageHead('Позиция не найдена')}${btn('catalog','К прайсу')}</section>`;
 const {photo,description}=plantProfile(p);
 const siblings=data.filter(row=>row.cat===p.cat&&row.name===p.name);
 return `<section class="wrap nursery-section">${crumb(link('catalog','Каталог')+' / '+link('catalog',catName(p.cat),'','cat='+p.cat))}
 <div class="plant-detail"><figure class="plant-portrait">${plantImage(photo,false)}<figcaption><span>${esc(photo.label)}</span><span>Фото · <a href="${esc(photo.page)}" target="_blank" rel="noopener">${esc(photo.author)}</a> · <a href="${esc(photo.license)}" target="_blank" rel="noopener">${esc(photo.terms)}</a> · кадрировано</span></figcaption></figure>
 <div class="plant-detail-copy"><div class="specimen-heading"><div class="eyebrow">${catName(p.cat)}</div><h1>${esc(p.name)}</h1>${heartButton(p)}</div><p class="plant-lead">${esc(description)}</p>${measureBlock(p)}
 <div class="offer-panel"><div><span>Цена выбранного варианта</span><strong>${priceText(p)}</strong></div>
 ${p.price===null?btn('contacts','Уточнить цену','consult=1'):`<div class="buyline"><div class="stepper"><button aria-label="Уменьшить количество" onclick="changeCard(${p.id},-1,this)">−</button><span>${quantities[p.id]||1}</span><button aria-label="Увеличить количество" onclick="changeCard(${p.id},1,this)">+</button></div><button class="btn" onclick="add(${p.id},0,quantities[${p.id}]||1)">В корзину</button></div>`}</div>
 </div></div><h2 class="sub-title">Варианты в прайсе</h2>${priceTable(siblings,p.id)}
 <p class="note">Наличие и стоимость перед покупкой уточните у менеджера. <a href="tel:+79779235523">${business.phone}</a></p>
 <div class="hero-buttons">${link('catalog','Вернуться в раздел','btn outline','cat='+p.cat)}${btn('delivery','Доставка и самовывоз')}</div></section>`;
}
function changeCard(id,n,el){quantities[id]=Math.max(1,Math.min(99,(quantities[id]||1)+n));el.parentElement.querySelector('span').textContent=quantities[id]}
function toggleFav(id){fav=fav.includes(id)?fav.filter(x=>x!==id):[...fav,id];storage.set('fav',fav);document.querySelectorAll(`[data-fav="${id}"]`).forEach(x=>{x.textContent=fav.includes(id)?'♥':'♡';x.classList.toggle('on',fav.includes(id));x.setAttribute('aria-pressed',fav.includes(id))});counts();if(route().page==='favorites')render();else toast(fav.includes(id)?'Добавлено в избранное':'Удалено из избранного')}
function add(id,v,qty){if(!find(id)||find(id).price===null)return;let x=cart.find(x=>x.id===id&&x.v===v);if(x)x.qty=Math.min(99,x.qty+qty);else cart.push({id,v,qty});saveCart();toast('Растение добавлено в корзину')}
function counts(){document.querySelector('#cartcount').textContent=cart.reduce((s,x)=>s+x.qty,0);document.querySelector('#favcount').textContent=fav.length}function saveCart(){storage.set('cart',cart);counts()}function total(){return cart.reduce((s,x)=>s+cost(find(x.id),x.v)*x.qty,0)}
function cartPage(){return `<div class="wrap section">${crumb('Корзина')}${pageHead('Корзина')}${cart.length?cart.map((x,i)=>{let p=find(x.id);return `<div class="cartrow">${plantImage(plantProfile(p).photo)}<div>${link('product',`<h3>${p.name}</h3>`,'','id='+p.id)}<p>${spec(p)} · ${money(cost(p,x.v))}/шт.</p></div><div class="stepper"><button onclick="cartChange(${i},-1)">−</button><span>${x.qty}</span><button onclick="cartChange(${i},1)">+</button></div><strong>${money(cost(p,x.v)*x.qty)}</strong><button class="icon" aria-label="Удалить" onclick="removeCart(${i})">×</button></div>`}).join('')+`<div class="summary"><h3>Итого: ${money(total())}</h3><p>Стоимость доставки не включена.</p>${btn('checkout','Оформить заказ')}</div>`:`<div class="empty"><h2>Корзина пока пуста</h2><p>Выберите растения, которые вам понравились.</p>${btn('catalog','Перейти в каталог')}</div>`}</div>`}
function cartChange(i,n){cart[i].qty=Math.max(1,Math.min(99,cart[i].qty+n));saveCart();render()}function removeCart(i){cart.splice(i,1);saveCart();render()}
function orderMessage(method){
 const lines=cart.map(x=>{const p=find(x.id);return [p.name,p.height,p.container,x.qty+' шт.',money(p.price*x.qty)].filter(Boolean).join(' · ');});
 return ['Здравствуйте! Хочу уточнить наличие и оформить заказ по прайсу 2025 года.',...lines,'Сумма растений: '+money(total()),'Получение: '+method].join('\n');
}
function checkout(){
 if(!cart.length)return `<section class="wrap nursery-section">${pageHead('Оформление заказа')}<div class="empty"><h2>Корзина пуста</h2>${btn('catalog','Выбрать растения')}</div></section>`;
 return `<div class="wrap nursery-section">${crumb('Оформление заказа')}<div class="catalog-intro"><div class="eyebrow">Хвойный сад</div><h1>Согласовать заказ</h1><p>Выберите способ получения. Менеджер подтвердит наличие, актуальные цены, оплату и время выдачи.</p></div><div class="company-columns"><section><h2>Ваши растения</h2><ul>${cart.map(x=>{const p=find(x.id);return `<li><strong>${esc(p.name)}</strong><br>${spec(p)} · ${x.qty} шт. · ${money(p.price*x.qty)}</li>`}).join('')}</ul><strong>По прайсу 2025: ${money(total())}</strong><p>Стоимость доставки согласуется отдельно.</p>${link('cart','Изменить корзину','link')}</section><section><h2>Получение</h2><label class="sr-only" for="receipt-choice">Способ получения</label><select class="field" id="receipt-choice" onchange="setOrderLink()"><option>Доставка</option><option>Самовывоз из Мытищ</option></select><p>${business.stand}. 09:00–18:00.</p><a class="btn" id="order-wa" href="${business.wa}?text=${encodeURIComponent(orderMessage('Доставка'))}" target="_blank" rel="noopener">Открыть заказ в WhatsApp ↗</a><p>Откроется чат с подготовленным списком. Отправку подтверждаете вы.</p><a class="link" href="tel:+79779235523">Позвонить: ${business.phone}</a></section></div></div>`;
}
function setOrderLink(){document.querySelector('#order-wa').href=business.wa+'?text='+encodeURIComponent(orderMessage(document.querySelector('#receipt-choice').value));}
function feature(n,title,desc){return `<article class="feature-card"><span class="feature-icon">${icon(n)}</span><h3>${title}</h3><p>${desc}</p></article>`}
function contactChannels(){
 return `<div class="contact-channels"><a href="tel:+79779235523"><small>Менеджер питомника</small><strong>${business.phone}</strong></a><a href="tel:+79999250607"><small>Сергей</small><strong>${business.manager}</strong></a></div>
 <div class="social-links">${[[business.wa,'WhatsApp питомника'],[business.waSergey,'WhatsApp Сергея'],[business.telegram,'Telegram'],[business.vk,'ВКонтакте'],[business.viber,'Viber']].map(([href,n])=>`<a href="${href}" target="_blank" rel="noopener">${n} ↗</a>`).join('')}</div>`;
}
function nurseryGallery(){
 return `<section class="wrap nursery-section">${crumb(link('about','О питомнике')+' / Фотографии')}<div class="catalog-intro"><div class="eyebrow">Хвойный сад · Мытищи</div><h1>Фотографии питомника</h1><p>Площадка, посадочный материал и растения в садовом центре.</p>${galleryLink}</div>
 <div class="nursery-gallery">${nurseryPhotos.map((url,i)=>`<a href="${url}" target="_blank" rel="noopener" aria-label="Увеличить фото ${i+1}" onclick="return viewNurseryPhoto(event,${i})"><img loading="lazy" decoding="async" src="${photoURL(i+1)}" alt="Фотография питомника ${i+1}"></a>`).join('')}</div>
 <dialog class="nursery-lightbox" onclick="if(event.target===this)this.close()"><button aria-label="Закрыть" onclick="this.closest('dialog').close()">×</button><img alt=""><a target="_blank" rel="noopener">Открыть оригинал ↗</a></dialog></section>`;
}
function viewNurseryPhoto(e,i){
 if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return true;
 const dialog=document.querySelector('.nursery-lightbox');if(!dialog?.showModal)return true;
 dialog.querySelector('img').src=photoURL(i+1);dialog.querySelector('img').alt='Питомник «Хвойный сад», фотография '+(i+1);
 dialog.querySelector('a').href=nurseryPhotos[i];dialog.showModal();return false;
}
function companyBanner(kicker,title,subtitle,img){
 return `<div class="company-banner"><img src="${photoURL(img)}" alt=""><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${subtitle}</p></div></div>`;
}
function info(page){
 if(page==='about'&&route().params.get('view')==='gallery')return nurseryGallery();
 const label={about:'О питомнике',contacts:'Контакты',delivery:'Доставка и оплата',reviews:'Отзывы'}[page];
 let body='';
 if(page==='contacts')body=companyBanner('Садовый центр · Мытищи','Контакты','Приезжайте посмотреть растения в демонстрационном саду или свяжитесь с питомником.',32)+`<div class="company-columns"><section><h2>Как нас найти</h2><p>${business.address}.</p><p><strong>${business.stand}</strong></p><p>Часы работы: 09:00–18:00. На территории есть парковка. Можно добраться на машине и общественным транспортом.</p><a class="btn" href="${business.map}" target="_blank" rel="noopener">Открыть на карте ↗</a> ${galleryLink}</section><section><h2>На связи</h2>${contactChannels()}</section></div><iframe class="nursery-map" title="Расположение питомника на Яндекс Картах" loading="lazy" src="https://yandex.ru/map-widget/v1/?oid=218575744992&ol=biz&z=15"></iframe>`;
 if(page==='delivery')body=companyBanner('Получение растений','Доставка и оплата','Питомник организует доставку по всей России — от небольших кустарников до крупномерных деревьев.',47)+`<div class="service-cards">
 ${feature('truck','Доставка по России','Сообщите менеджеру выбранные растения и адрес. Стоимость перевозки и сроки согласуют для вашего заказа.')}
 ${feature('leaf','Самовывоз из Мытищ',business.stand+'. Время работы 09:00–18:00.')}
 ${feature('shield','Оплата и скидки','Доступный способ оплаты уточните при заказе. Для крупных заказов действуют специальные цены, для постоянных покупателей — гибкие скидки.')}
 ${feature('leaf','Хранение до посадки','Саженцы можно оставить на хранение до подходящего срока посадки. Условия согласуйте с питомником.')}
 </div><div class="order-contact"><div><h2>Обсудить заказ</h2><p>Для комплексного озеленения питомник предлагает пакетные условия.</p></div>${contactChannels()}</div>`;
 if(page==='about')body=companyBanner('Собственное производство · с 2010 года','Хвойный сад','Питомник декоративных и плодовых растений в Подмосковье.',45)+`<div class="company-columns"><section><div class="eyebrow">О питомнике</div><h2>От саженца до сада</h2><p>С 2010 года мы выращиваем посадочный материал: декоративные и плодовые деревья, кустарники, редкие и экзотические виды. По данным питомника, ассортимент насчитывает более 500 видов.</p><p>Собственное производство позволяет следить за качеством на каждом этапе и предлагать растения по ценам питомника. Посадки адаптированы к местному климату.</p><p>«100% приживаемость растений при правильном уходе» — так питомник описывает свой подход к выращиванию.</p></section><section><h2>Услуги</h2><ul><li>Ландшафтный дизайн: от проекта до реализации.</li><li>Консультации агрономов по посадке и уходу.</li><li>Сезонное обслуживание сада и участка.</li><li>Подзимний посев семян.</li><li>Хранение саженцев до посадки.</li><li>Доставка по России и самовывоз.</li></ul>${btn('contacts','Обсудить проект','consult=1')}</section></div>
 <div class="gallery-band"><div><h2>В гостях у питомника</h2>${link('about','Все фотографии →','link','view=gallery')}</div>${[1,52,68].map(n=>link('about',`<img src="${photoURL(n)}" alt="Садовый центр" loading="lazy">`,'','view=gallery')).join('')}</div>`;
 if(page==='reviews')body=companyBanner('Опыт покупателей','Отзывы о питомнике','Впечатления посетителей и фотографии опубликованы в карточке «Хвойного сада» на Яндекс Картах.',2)+`<div class="order-contact"><h2>Отзывы и фотографии</h2><div class="hero-buttons"><a class="btn" href="${business.map}reviews/" target="_blank" rel="noopener">Читать отзывы ↗</a>${galleryLink}</div></div>`;
 return `<div class="wrap nursery-section">${crumb(label)}${body}</div>`;
}
let timeout;function toast(t){let x=document.querySelector('.toast');x.textContent=t;x.classList.add('show');clearTimeout(timeout);timeout=setTimeout(()=>x.classList.remove('show'),2600)}
function render(){chosen=0;detailQty=1;let {page,params}=route();if(!['home','catalog','product','cart','checkout','favorites','about','delivery','reviews','contacts'].includes(page))page='home';document.body.className=page==='home'?'home':'';let main=page==='home'?home():page==='catalog'?catalog(params):page==='product'?product(find(params.get('id'))):page==='cart'?cartPage():page==='checkout'?checkout():page==='favorites'?`<div class="wrap section">${crumb('Избранное')}${pageHead('Избранное','Ваши сохранённые растения')}${fav.length?cards(data.filter(x=>fav.includes(x.id))):`<div class="empty"><h2>Список пока пуст</h2><p>Нажмите на сердечко у понравившегося растения.</p>${btn('catalog','В каталог')}</div>`}</div>`:info(page);document.querySelector('#app').innerHTML=header()+`<main tabindex="-1" data-section="${page}">${main}</main>`+footer()+'<div class="toast" role="status"></div>';decorateGarden();document.querySelectorAll('.navlinks a').forEach(a=>{if(new URL(a.href,location.href).pathname===location.pathname)a.setAttribute('aria-current','page')});if(page==='catalog'){document.querySelectorAll('#maxprice,#query,#sort').forEach(x=>x.addEventListener('input',renderCatalog));renderCatalog();if(params.get('focus')&&!navigating)document.querySelector('#query').focus({preventScroll:true})}document.title=({home:'Питомник растений',catalog:'Каталог',product:find(params.get('id'))?.name,cart:'Корзина',favorites:'Избранное',checkout:'Оформление заказа',about:'О питомнике',delivery:'Доставка и оплата',contacts:'Контакты',reviews:'Отзывы'}[page]||'Питомник')+' — '+BRAND}
window.addEventListener('pageshow',e=>{if(e.persisted){loadState();render()}});window.addEventListener('storage',e=>{if(e.key===null||['garden_cart','garden_fav'].includes(e.key)){loadState();render()}});let navigating=false,pendingWave=null;if(portable)window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});normalizeEntry();render();if(!portable){installNavigation();installLivingBackground();gardenIntro();}

function setMenu(open){const nav=document.querySelector('.navlinks'),button=document.querySelector('.menu'),backdrop=document.querySelector('.menu-backdrop');if(!nav||!button)return;nav.classList.toggle('open',open);button.setAttribute('aria-expanded',String(open));backdrop?.classList.toggle('open',open);document.body.classList.toggle('menu-open',open)}
function toggleMenu(){setMenu(document.querySelector('.menu')?.getAttribute('aria-expanded')!=='true')}
function pageKey(path){return path.split('/').pop().replace(/\.html$/,'')||'home'}
function direction(from,to){const order=['home','index','catalog','product','about','delivery','reviews','contacts','favorites','cart','checkout'];return order.indexOf(to)>=order.indexOf(from)?'forward':'back'}
function showRoute(focus=true){render();window.scrollTo({top:0,left:0,behavior:'instant'});if(focus&&!route().params.get('focus'))document.querySelector('main')?.focus({preventScroll:true})}
function sectionName(target){const names={home:'Главная',index:'Главная',catalog:'Каталог',about:'О питомнике',delivery:'Доставка и оплата',reviews:'Отзывы',contacts:'Контакты',cart:'Корзина',favorites:'Избранное',checkout:'Оформление заказа',product:'Карточка растения'};return names[pageKey(target.pathname)]||'Питомник растений'}
function waitMs(ms){return new Promise(resolve=>setTimeout(resolve,ms))}
function waveLayer(){const el=document.createElement('div');el.className='route-wave';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML='<div class="route-wave-sheet"><svg class="route-wave-shape" viewBox="0 0 1400 1000" preserveAspectRatio="none" aria-hidden="true"><path fill="#70994b" d="M120 0 C-60 180 230 300 110 500 S-45 830 130 1000 L1280 1000 C1460 830 1170 700 1290 500 S1445 170 1270 0Z"/><path fill="#5f8b3e" d="M165 0 C-15 180 275 300 155 500 S0 830 175 1000 L1235 1000 C1415 830 1125 700 1245 500 S1400 170 1225 0Z"/></svg><div class="route-wave-label"><span class="route-wave-leaf" aria-hidden="true">'+icon('leaf')+'</span><span class="route-wave-name"></span><span class="route-wave-line" aria-hidden="true"></span></div></div>';el.addEventListener('wheel',e=>e.preventDefault(),{passive:false});document.body.append(el);return el}
function waitImage(img){if(img.complete)return typeof img.decode==='function'?img.decode().catch(()=>{}):Promise.resolve();return new Promise(resolve=>{const done=()=>{img.removeEventListener('load',done);img.removeEventListener('error',done);if(img.complete&&img.naturalWidth&&typeof img.decode==='function')img.decode().catch(()=>{}).then(resolve);else resolve()};img.addEventListener('load',done,{once:true});img.addEventListener('error',done,{once:true});if(img.complete)done()})}
function waitPageAssets(){const main=document.querySelector('main');if(!main)return Promise.resolve();const tasks=[...main.querySelectorAll('img:not([loading=lazy])')].map(waitImage),urls=new Set();for(const el of [main,...main.querySelectorAll('.hero,.editorial-hero,.reviews-scene,.promo,.delivery-banner')])for(const pseudo of [null,'::before','::after']){const bg=getComputedStyle(el,pseudo).backgroundImage;for(const m of bg.matchAll(/url\(["']?(.*?)["']?\)/g)){if(m[1])urls.add(m[1])}}for(const url of urls){const img=new Image();img.src=url;tasks.push(waitImage(img))}if(document.fonts?.ready)tasks.push(document.fonts.ready.catch(()=>{}));return Promise.race([Promise.allSettled(tasks),waitMs(4500)])}
function waitWaveMotion(overlay,phase){const sheet=overlay.querySelector('.route-wave-sheet');return new Promise(resolve=>{let timer;const done=()=>{clearTimeout(timer);sheet.removeEventListener('transitionend',ended);resolve()};const ended=e=>{if(e.target===sheet&&e.propertyName==='transform')done()};sheet.addEventListener('transitionend',ended);overlay.classList.add(phase);timer=setTimeout(done,phase==='wave-enter'?750:850)})}
function freezeViewport(){let x=window.scrollX,y=window.scrollY,locked=true;const stop=e=>{if(e.cancelable)e.preventDefault()};const keys=e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' ','Spacebar','Tab'].includes(e.key))stop(e)};const restore=()=>{if(locked&&(window.scrollX!==x||window.scrollY!==y))window.scrollTo({left:x,top:y,behavior:'instant'})};window.addEventListener('wheel',stop,{passive:false,capture:true});window.addEventListener('touchmove',stop,{passive:false,capture:true});window.addEventListener('keydown',keys,true);window.addEventListener('scroll',restore,{passive:true});return {atTop(){locked=false;window.scrollTo({left:0,top:0,behavior:'instant'});x=window.scrollX;y=window.scrollY;locked=true},release(){locked=false;window.removeEventListener('wheel',stop,true);window.removeEventListener('touchmove',stop,true);window.removeEventListener('keydown',keys,true);window.removeEventListener('scroll',restore)}}}
function paintFrame(){return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))}
async function navigate(target,isPop=false){if(navigating){if(isPop)pendingWave={target,isPop};return}navigating=true;let overlay=null,lock=null,app=document.querySelector('#app'),rendered=false;const root=document.documentElement,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;try{if(!reduced){root.classList.add('wave-active');lock=freezeViewport();overlay=waveLayer();overlay.querySelector('.route-wave-name').textContent=sectionName(target);void overlay.offsetWidth;await paintFrame();await waitWaveMotion(overlay,'wave-enter');overlay.classList.add('wave-covered');await paintFrame()}if(pendingWave){({target,isPop}=pendingWave);pendingWave=null;if(overlay)overlay.querySelector('.route-wave-name').textContent=sectionName(target)}setMenu(false);if(!isPop)history.pushState({},'',target.href);if(app)app.inert=!!overlay;render();rendered=true;if(lock)lock.atTop();else window.scrollTo({top:0,left:0,behavior:'instant'});if(overlay){await Promise.all([waitPageAssets(),waitMs(240)]);lock.atTop();await paintFrame();overlay.classList.remove('wave-covered');await waitWaveMotion(overlay,'wave-exit')}}catch(err){console.error('Navigation transition failed:',err);if(!rendered){if(isPop)location.reload();else location.assign(target.href)}}finally{overlay?.remove();lock?.release();root.classList.remove('wave-active');if(app)app.inert=false;navigating=false;if(pendingWave){const next=pendingWave;pendingWave=null;navigate(next.target,next.isPop)}else if(rendered&&!isPop){if(route().params.get('focus'))document.querySelector('#query')?.focus({preventScroll:true});else document.querySelector('main')?.focus({preventScroll:true})}}}
function installNavigation(){document.addEventListener('click',e=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const a=e.target.closest('a[href]');if(!a||a.target||a.hasAttribute('download'))return;const raw=a.getAttribute('href');if(raw.startsWith('#')){setMenu(false);return}const target=new URL(a.href,location.href);if(target.origin!==location.origin||!target.pathname.startsWith(location.pathname.slice(0,location.pathname.lastIndexOf('/')+1))||!/\/(?:index|catalog|product|about|delivery|reviews|contacts|favorites|cart|checkout)\.html$/.test(target.pathname)||target.hash)return;e.preventDefault();if(target.href===location.href){setMenu(false);return}navigate(target)});window.addEventListener('popstate',()=>{navigate(new URL(location.href),true)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.navlinks.open')){setMenu(false);document.querySelector('.menu')?.focus()}});matchMedia('(min-width:721px)').addEventListener('change',e=>{if(e.matches)setMenu(false)});let touch=null;document.addEventListener('touchstart',e=>{const t=e.touches[0];touch=e.touches.length===1&&e.target.closest('.editorial-hero')&&!e.target.closest('a,button,input')&&t.clientX>24&&t.clientX<innerWidth-24?{x:t.clientX,y:t.clientY}:null},{passive:true});document.addEventListener('touchcancel',()=>{touch=null},{passive:true});document.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)<75||Math.abs(dx)<Math.abs(dy)*1.5)return;const a=document.querySelector(dx<0?'.editorial-next':'.editorial-prev');if(a)navigate(new URL(a.href))},{passive:true})}

function initialHomeEntry(path,referrer,navigationType,origin){if(!/\/delivery\.html$/.test(path)||navigationType==='reload'||navigationType==='back_forward')return false;const base=path.slice(0,path.lastIndexOf('/')+1);if(!referrer)return true;try{const ref=new URL(referrer);return ref.origin!==origin||!ref.pathname.startsWith(base)}catch{return true}}
function normalizeEntry(){if(portable)return;const nav=performance.getEntriesByType?.('navigation')?.[0]?.type||'navigate';if(initialHomeEntry(location.pathname,document.referrer,nav,location.origin)){const home=new URL('./',location.href);history.replaceState(history.state,'',home.href)}}

function installLivingBackground(){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,x=0,y=0,tx=0,ty=0,px=50,py=40,txp=50,typ=40;
 const update=()=>{frame=0;if(motion.matches||document.hidden||document.documentElement.classList.contains('wave-active'))return;
 x+=(tx-x)*.14;y+=(ty-y)*.14;px+=(txp-px)*.14;py+=(typ-py)*.14;
 const style=document.documentElement.style;
 style.setProperty('--garden-x',x.toFixed(2)+'px');style.setProperty('--garden-y',y.toFixed(2)+'px');
 style.setProperty('--garden-light-x',px.toFixed(2)+'%');style.setProperty('--garden-light-y',py.toFixed(2)+'%');
 if(Math.abs(tx-x)+Math.abs(ty-y)+Math.abs(txp-px)+Math.abs(typ-py)>.12)frame=requestAnimationFrame(update)
 };
 const queue=()=>{if(!frame&&!motion.matches)frame=requestAnimationFrame(update)};
 const reset=()=>{tx=0;ty=0;txp=50;typ=40;queue()};
 window.addEventListener('pointermove',e=>{if(motion.matches||document.documentElement.classList.contains('wave-active')||document.querySelector('.garden-intro'))return;
 const nx=Math.min(1,Math.max(0,e.clientX/Math.max(innerWidth,1))),ny=Math.min(1,Math.max(0,e.clientY/Math.max(innerHeight,1)));
 tx=(nx-.5)*(e.pointerType==='touch'?24:58);ty=(ny-.5)*(e.pointerType==='touch'?18:42);txp=nx*100;typ=ny*100;queue()
 },{passive:true});
 document.documentElement.addEventListener('pointerleave',reset,{passive:true});
 window.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse')reset()},{passive:true});
 window.addEventListener('pointercancel',reset,{passive:true});
 window.addEventListener('blur',reset);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)reset()});
 if(motion.addEventListener)motion.addEventListener('change',()=>{if(motion.matches){if(frame)cancelAnimationFrame(frame);frame=0;for(const k of ['--garden-x','--garden-y','--garden-light-x','--garden-light-y'])document.documentElement.style.removeProperty(k)}else reset()});
}
function decorateGarden(){
 const main=document.querySelector('main');if(!main)return;
 const surfaces=main.querySelectorAll('.hero,.editorial-hero');
 for(const surface of surfaces){if(surface.querySelector('.garden-ambient'))continue;
 const layer=document.createElement('div');layer.className='garden-ambient';layer.setAttribute('aria-hidden','true');
 layer.innerHTML=Array.from({length:7},(_,i)=>`<i style="--i:${i};--lx:${58+(i*13)%40}%;--ly:${9+(i*23)%78}%;--delay:${-i*1.9}s"></i>`).join('');
 surface.append(layer);
 }
}
async function gardenIntro(){
 if(location.hash==='#about-grove'||storage.get('intro_seen',false)||portable||route().page!=='home'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const navigation=performance.getEntriesByType?.('navigation')?.[0]?.type;
 if(navigation==='back_forward')return;
 storage.set('intro_seen',true);
 const app=document.querySelector('#app');if(!app)return;
 const layer=document.createElement('div');
 layer.className='garden-intro';layer.setAttribute('role','dialog');layer.setAttribute('aria-label','Добро пожаловать в питомник');layer.setAttribute('aria-modal','true');
 layer.innerHTML=`<div class="garden-intro-photo" aria-hidden="true"></div><div class="garden-intro-rays" aria-hidden="true"></div><div class="garden-intro-grain" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i style="--n:${i};--x:${(i*29+11)%98}%;--y:${(i*37+9)%96}%;--d:${-i*.7}s"></i>`).join('')}</div><div class="garden-intro-center">${brandLogo(true)}<span class="intro-kicker">Питомник растений · Мытищи</span><span class="intro-track"><i></i></span></div><button class="intro-skip" type="button">Пропустить <span aria-hidden="true">→</span></button>`;
 let skipped=false,skipResolve;const skip=new Promise(resolve=>{skipResolve=resolve});
 const close=()=>{if(!skipped){skipped=true;skipResolve()}};
 const onKey=e=>{if(e.key==='Escape'){e.preventDefault();close()}if(e.key==='Tab'){e.preventDefault();layer.querySelector('.intro-skip')?.focus({preventScroll:true})}};
 const root=document.documentElement;
 root.classList.add('garden-intro-active');document.body.append(layer);app.inert=true;
 layer.querySelector('.intro-skip').addEventListener('click',close);
 layer.addEventListener('keydown',onKey);layer.querySelector('.intro-skip').focus({preventScroll:true});
 try{
 await Promise.race([skip,Promise.all([waitMs(1450),Promise.race([waitPageAssets(),waitMs(1850)])])]);
 layer.classList.add('intro-exit');await waitMs(500)
 }finally{layer.remove();app.inert=false;root.classList.remove('garden-intro-active');document.querySelector('main')?.focus({preventScroll:true})}
}
