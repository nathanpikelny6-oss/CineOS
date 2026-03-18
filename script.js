const APPS={'cine':{title:'CINE // HUB',path:'script/Apps/Cine/index.html',icon:'https://cdn.worldvectorlogo.com/logos/netflix-logo-icon.svg'},'term':{title:'Spotify',path:'script/Apps/Spotify/index.html',icon:'https://cdn.pixabay.com/photo/2016/10/22/00/15/spotify-1759471_1280.jpg'},'files':{title:'PS5 Emu',path:'script/Apps/Ps5/index.html',icon:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OeL_be7RFaoHi3PswkuAR5XcMgBNRDynsg&s'},'web':{title:'Cine-Web',path:'script/Apps/Web/index.html',icon:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeD89ZcX5W1FBtal7RerasT27q-OmZqnBixQ&s'},'settings':{title:'CONFIG',internal:true,icon:'https://cdn.iconscout.com/icon/free/png-256/free-apple-settings-icon-svg-download-png-493162.png'},'discord':{title:'Discord',path:'https://discord.com/app',icon:'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png'}};
const DOCK_APPS=['web','files','settings','cine','term'];const PINNED_APPS=['web','files','settings','cine','term'];

   let sysConfig=JSON.parse(localStorage.getItem('cine_sys_config'))||{optBg:false,shortBoot:false,panicKey:'`',homeWallpaper:'Default',lockWallpaper:'green',cloak:'none'};
if(!sysConfig.panicKey)sysConfig.panicKey='`';if(!sysConfig.homeWallpaper)sysConfig.homeWallpaper='Default';if(!sysConfig.lockWallpaper)sysConfig.lockWallpaper='green';
 window.updateSysSetting=function(k,v){sysConfig[k]=v;localStorage.setItem('cine_sys_config',JSON.stringify(sysConfig));if(k==='optBg')applySystemSettings();};
const cloaks={none:{title:"Cine-OS",icon:""},google:{title:"Google",icon:"https://www.google.com/favicon.ico"},drive:{title:"My Drive - Google Drive",icon:"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"},canvas:{title:"Dashboard",icon:"https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico"},classroom:{title:"Classes",icon:"https://ssl.gstatic.com/classroom/favicon.png"}};
  window.updateCloak=function(k){sysConfig.cloak=k;localStorage.setItem('cine_sys_config',JSON.stringify(sysConfig));applyCloak();};
 function applyCloak(){let k=sysConfig.cloak||'none';let c=cloaks[k];let e=document.querySelectorAll("link[rel*='icon']");e.forEach(l=>l.remove());if(c&&k!=='none'){document.title=c.title;let l=document.createElement('link');l.type='image/x-icon';l.rel='shortcut icon';l.href=c.icon;document.getElementsByTagName('head')[0].appendChild(l);}else{document.title="Cine-OS";}}
 setInterval(applyCloak,2000);

let isDesktopActive=false;let bootActive=true;let enterCount=0; let highestZ=500; let activeWindowId=null;
let mediaPlaying=false; // prevent idle lock if media active

// MOBILE DETECTION
 const isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if(isMobile){
 document.getElementById('mobile-warning').classList.add('show-warning');
  let lt=0; document.getElementById('mobile-warning').addEventListener('touchstart',(e)=>{
   let ct=new Date().getTime(); let tl=ct-lt;
   if(tl<500&&tl>0){ document.getElementById('mobile-warning').classList.remove('show-warning'); }
  lt=ct;});
 document.getElementById('mobile-warning').addEventListener('dblclick',()=>{document.getElementById('mobile-warning').classList.remove('show-warning');});
}

document.addEventListener("DOMContentLoaded",()=>{applyCloak();renderUI();initWallpapers();document.getElementById('boot-layer').style.display='flex'; loadDesktop(); injectAudioElement();});

function renderUI(){var dc=document.getElementById('dock-container');dc.innerHTML=`<div class="dock-item" onclick="toggleStartMenu()"><img src="https://missionsupport.archden.org/wp-content/uploads/2022/02/windows11-icon.png"></div><div class="dock-sep"></div><div class="dock-item" onclick="toggleAppDrawer()"><svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg></div><div class="dock-sep"></div>`;DOCK_APPS.forEach(id=>{if(APPS[id])dc.innerHTML+=`<div class="dock-item" data-id="${id}" onclick="toggleApp('${id}')"><img src="${APPS[id].icon}"></div>`;});var pg=document.getElementById('pinned-grid');pg.innerHTML='';PINNED_APPS.forEach(id=>{if(APPS[id])pg.innerHTML+=`<div class="pinned-item" onclick="toggleApp('${id}')"><img src="${APPS[id].icon}"><span>${APPS[id].title}</span></div>`;});populateDrawer();}

document.addEventListener('keydown',e=>{if(bootActive&&e.key==='Enter'&&document.getElementById('boot-layer').style.display!=='none'){enterCount++;if(enterCount>=2)skipBootSequence();setTimeout(()=>{enterCount=0;},500);}if(e.key&&sysConfig.panicKey&&e.key.toLowerCase()===sysConfig.panicKey.toLowerCase()){window.location.href="https://google.com";}});
function startBootSequence(){var c=document.getElementById('boot-content');var b=document.getElementById('boot-video');c.style.display='none';b.style.display='block';b.muted=false;b.volume=1.0;if(sysConfig.shortBoot){b.src="Videos/QuickBoot.mp4";b.load();}b.play().catch(()=>{b.muted=true;b.play();});b.onended=()=>{if(bootActive)skipBootSequence();};}
function skipBootSequence(){if(!bootActive)return;bootActive=false;var l=document.getElementById('boot-layer');var b=document.getElementById('boot-video');if(b)b.pause();if(l){l.style.opacity='0';document.getElementById('lock-screen').classList.add('active');var lV=document.getElementById('lock-video');lV.play().catch(e=>console.log(e));setTimeout(()=>{l.style.display='none';},600);updateClock();}}

function showNotification(t, m) {
    const c = document.getElementById('toast-container');const toast = document.createElement('div');toast.className = 'toast-notification';
    toast.innerHTML = `<div class="toast-header"><div class="toast-app-info"><div class="toast-icon"><i class="fas fa-bell"></i></div><span>System</span></div><i class="fas fa-times toast-close"></i></div><div class="toast-title">${t}</div><div class="toast-body">${m}</div>`;
    c.appendChild(toast);setTimeout(()=>toast.classList.add('show'), 100);
    const ct = ()=>{toast.classList.remove('show');setTimeout(()=>toast.remove(), 400);};toast.onclick = ct;setTimeout(ct, 6000);
}

let welcomeShown = false;
window.unlockSystem=function(){var s=document.getElementById('lock-screen');s.classList.add('slide-up');setTimeout(()=>{s.classList.remove('active');isDesktopActive=true;document.getElementById('lock-video').pause();if(!sysConfig.optBg)document.getElementById('bg-video').play().catch(e=>console.log(e)); if(!welcomeShown){showNotification("Welcome To Cine V2", "Checkout Settings for FAQ!"); welcomeShown=true;}},600);resetIdle();};

function initWallpapers(){var bgV=document.getElementById('bg-video');var lV=document.getElementById('lock-video');if(wallpaperRegistry[sysConfig.homeWallpaper]){bgV.src=wallpaperRegistry[sysConfig.homeWallpaper].url;bgV.loop=!!wallpaperRegistry[sysConfig.homeWallpaper].loop;bgV.load();}if(wallpaperRegistry[sysConfig.lockWallpaper]){lV.src=wallpaperRegistry[sysConfig.lockWallpaper].url;lV.loop=!!wallpaperRegistry[sysConfig.lockWallpaper].loop;lV.load();}else{lV.src="Videos/green.mp4";lV.loop=true;lV.load();}}
function updateClock(){var n=new Date();var d=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];var m=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];var hrs=n.getHours();var gr='GOOD EVENING';if(hrs<12)gr='GOOD MORNING';else if(hrs<18)gr='GOOD AFTERNOON';var lG=document.getElementById('lock-greet');if(lG)lG.innerText=gr;var h12=hrs%12||12;var ampm=hrs>=12?'PM':'AM';var min=n.getMinutes().toString().padStart(2,'0');var lT=document.getElementById('lock-time');if(lT)lT.innerText=`${h12}:${min} ${ampm}`;var fM=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];var lD=document.getElementById('lock-date');if(lD)lD.innerText=`${n.getDate().toString().padStart(2,'0')} ${fM[n.getMonth()]}`;var dL=document.getElementById('lock-day-large');if(dL)dL.innerText=d[n.getDay()];var hd=document.getElementById('lbl-day');if(hd)hd.innerText=d[n.getDay()];}setInterval(updateClock,1000);

// IDLE LOCK PREVENTION WITH MEDIA CHECK
let idleTime=0;function resetIdle(){idleTime=0;}document.addEventListener('mousemove',resetIdle);document.addEventListener('keypress',resetIdle);document.addEventListener('click',resetIdle);
setInterval(()=>{
 idleTime++;
  let isMediaPlaying=false;
   document.querySelectorAll('audio, video').forEach(m=>{if(!m.paused&&!m.muted&&m.id!=='bg-video'&&m.id!=='lock-video')isMediaPlaying=true;});
 var s=document.getElementById('lock-screen');
  if(idleTime>=180&&!s.classList.contains('active')&&!bootActive){
    if(isMediaPlaying){idleTime=0;}else{
    isDesktopActive=false;s.classList.remove('slide-up');s.classList.add('active');document.getElementById('bg-video').pause();document.getElementById('lock-video').play().catch(e=>console.log(e));
  }
 }},1000);

function populateDrawer(){var dg=document.getElementById('drawer-grid');dg.innerHTML='';for(var key in APPS){var a=APPS[key];var d=document.createElement('div');d.className='drawer-item';
d.dataset.id=key; d.onmousedown=(e)=>{DragSystem.start(e,d,'drawer');};
d.innerHTML=`<img src="${a.icon}" style="pointer-events:none;"><span>${a.title}</span>`;dg.appendChild(d);}}
function filterDrawer(v){var items=document.querySelectorAll('.drawer-item');v=v.toLowerCase();items.forEach(i=>{if(i.innerText.toLowerCase().includes(v))i.style.display='flex';else i.style.display='none';});}
function toggleAppDrawer(){var d=document.getElementById('app-drawer');if(d.classList.contains('open')){d.classList.remove('open');setTimeout(()=>d.style.display='none',300);}else{d.style.display='block';setTimeout(()=>d.classList.add('open'),10);}}

// WINDOW MGMT
function toggleApp(id){
 var w=document.getElementById(`win-${id}`);
 if(w){
  if(w.classList.contains('minimized')){ w.classList.remove('minimized'); w.style.zIndex=++highestZ; activeWindowId=id; }
  else if(activeWindowId===id){ w.classList.add('minimized'); activeWindowId=null; }
  else{ w.style.zIndex=++highestZ; activeWindowId=id; }
 }else{ openWindow(id); }
}

function openWindow(id){var sm=document.getElementById('start-menu');if(sm){sm.classList.remove('open');setTimeout(()=>{sm.style.display='none';},300);}var l=document.getElementById('windows-layer');var w=document.getElementById(`win-${id}`);
if(!w){var d=APPS[id]||{title:'APP',path:'about:blank'};w=document.createElement('div');w.id=`win-${id}`;w.className='window active header-visible';w.style.zIndex=++highestZ;var ih=d.internal?`<iframe id="frame-${id}"></iframe>`:`<iframe id="frame-${id}" src="${d.path}"></iframe>`;
w.innerHTML=`<div class="win-header" onmousedown="DragSystem.startWinDrag(event, '${id}')"><div class="win-title">${d.title}</div><div class="win-controls"><div class="win-btn btn-min" onclick="minimizeWindow('${id}')"></div><div class="win-btn btn-close" onclick="closeWindow('${id}')"></div></div></div><div class="win-body">${ih}</div>`;
l.appendChild(w);if(d.internal){var t=document.getElementById(`code-${id}`);var f=document.getElementById(`frame-${id}`);if(t&&f){var dc=f.contentWindow.document;dc.open();dc.write(t.innerHTML);dc.close();}}}else{w.classList.remove('minimized');w.classList.add('active');w.style.zIndex=++highestZ;}activeWindowId=id;startImmersiveMode(w);}

function closeWindow(id){var w=document.getElementById(`win-${id}`);if(w)w.remove();if(activeWindowId===id)activeWindowId=null;endImmersiveMode();}
function minimizeWindow(id){var w=document.getElementById(`win-${id}`);if(w){w.classList.add('minimized'); if(activeWindowId===id)activeWindowId=null;}}
function startImmersiveMode(w){document.getElementById('dock-container').classList.add('dock-hidden');w.classList.remove('header-visible');}
function endImmersiveMode(){var wl=document.getElementById('windows-layer');if(wl.children.length===0){document.getElementById('dock-container').classList.remove('dock-hidden');}else{var lw=wl.lastChild;activeWindowId=lw.id.replace('win-','');lw.style.zIndex=++highestZ;}}

document.getElementById('top-trigger').addEventListener('mouseenter',()=>{if(activeWindowId){var w=document.getElementById(`win-${activeWindowId}`);if(w&&!w.classList.contains('minimized'))w.classList.add('header-visible');}});
document.addEventListener('mouseover',e=>{if(e.target.closest('.win-header')){if(activeWindowId) {let ww=document.getElementById(`win-${activeWindowId}`); if(ww) ww.classList.add('header-visible');}}else if(activeWindowId&&!e.target.closest('#top-trigger')){var w=document.getElementById(`win-${activeWindowId}`);if(w)w.classList.remove('header-visible');}});

// DESKTOP GRID & FOLDER SYSTEM
let desktopLayout=JSON.parse(localStorage.getItem('cine_desktop_v2'))||[];
function loadDesktop(){
 document.querySelectorAll('.desktop-app').forEach(e=>e.remove());
 desktopLayout.forEach((i,idx)=>{
  let d=document.createElement('div');d.className='desktop-app';
  d.style.left=i.x+'px'; d.style.top=i.y+'px'; d.dataset.idx=idx;
  if(i.type==='folder'){
   let g=`<div class="d-folder-grid">`; i.apps.slice(0,4).forEach(a=>g+=`<img src="${APPS[a].icon}">`); g+=`</div><div class="d-label">Folder</div>`;
   d.innerHTML=g; d.ondblclick=()=>{i.apps.forEach(a=>toggleApp(a));};
  }else{
   let a=APPS[i.id]; if(a){d.innerHTML=`<img src="${a.icon}" class="d-icon"><div class="d-label">${a.title}</div>`; d.ondblclick=()=>toggleApp(i.id);}
  }
  d.onmousedown=(ev)=>{ev.stopPropagation();DragSystem.start(ev,d,'desktop',idx);};
  document.getElementById('desktop-area').appendChild(d);
 });
}
function saveDesktop(){localStorage.setItem('cine_desktop_v2',JSON.stringify(desktopLayout));loadDesktop();}

const DragSystem={
 dragging:false,startPos:{x:0,y:0},sourceType:null,sourceEl:null,idx:null,appId:null,proxy:document.getElementById('drag-proxy'),pImg:document.getElementById('proxy-img'),badge:document.getElementById('folder-badge'),
 init(){window.addEventListener('mousemove',e=>this.move(e));window.addEventListener('mouseup',e=>this.end(e));},
 start(e,el,type,idx=null){
  this.startPos={x:e.clientX,y:e.clientY}; this.sourceType=type; this.sourceEl=el; this.isDragMove=false; this.idx=idx;
  if(type==='drawer'){this.appId=el.dataset.id;}
  else if(type==='desktop'){this.sourceEl.style.opacity='0.5';}
 },
 startWinDrag(e,id){this.startPos={x:e.clientX,y:e.clientY};this.sourceType='window';this.sourceEl=document.getElementById(`win-${id}`);this.isDragMove=false;},
 move(e){
  if(!this.sourceEl)return; var dx=Math.abs(e.clientX-this.startPos.x),dy=Math.abs(e.clientY-this.startPos.y);
  if(dx>3||dy>3){
   this.dragging=true;this.isDragMove=true;
   if(this.sourceType==='desktop'||this.sourceType==='drawer'){
    if(this.sourceType==='drawer') toggleAppDrawer(); // close drawer to see desktop
    this.proxy.style.display='block'; this.proxy.style.left=(e.clientX-25)+'px'; this.proxy.style.top=(e.clientY-25)+'px';
    if(this.sourceType==='drawer') this.pImg.src=APPS[this.appId].icon;
    else if(desktopLayout[this.idx].type==='app') this.pImg.src=APPS[desktopLayout[this.idx].id].icon;
    else {this.pImg.src=''; this.badge.style.display='flex'; this.badge.innerText=desktopLayout[this.idx].apps.length;}
   }
  }
 },
 end(e){
  if(!this.sourceEl)return;
  if(!this.isDragMove&&this.sourceType==='desktop'){
   if(desktopLayout[this.idx].type==='app') toggleApp(desktopLayout[this.idx].id);
   else desktopLayout[this.idx].apps.forEach(a=>toggleApp(a));
   this.reset();return;
  }
  if(!this.dragging){this.reset();return;}
  
  if(this.sourceType==='desktop'||this.sourceType==='drawer'){
   let nx=Math.round((e.clientX-40)/90)*90; let ny=Math.round((e.clientY-40)/100)*100; // grid snap
   if(e.clientY>window.innerHeight-80){ // Delete if dragged to bottom
     if(this.sourceType==='desktop') desktopLayout.splice(this.idx,1);
   }else{
     // Check intersections for folders
     let targetIdx=-1;
     document.querySelectorAll('.desktop-app').forEach(app=>{
      if(app!==this.sourceEl){
       let r=app.getBoundingClientRect(); if(e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom) targetIdx=app.dataset.idx;
      }
     });
     
     if(targetIdx>-1){ // MERGE INTO FOLDER
       let t=desktopLayout[targetIdx];
       let droppedApps = this.sourceType==='drawer' ? [this.appId] : (desktopLayout[this.idx].type==='app' ? [desktopLayout[this.idx].id] : desktopLayout[this.idx].apps);
       if(t.type==='app'){
         t.type='folder'; t.apps=[t.id, ...droppedApps]; delete t.id;
       }else{
         t.apps.push(...droppedApps);
       }
       if(this.sourceType==='desktop') desktopLayout.splice(this.idx,1); // remove original
     } else { // NORMAL MOVE OR PLACE
       if(this.sourceType==='drawer') desktopLayout.push({type:'app', id:this.appId, x:nx, y:ny});
       else { desktopLayout[this.idx].x=nx; desktopLayout[this.idx].y=ny; }
     }
   }
   saveDesktop();
  }
  this.reset();
 },
 reset(){this.dragging=false;if(this.sourceEl)this.sourceEl.style.opacity='1';this.sourceEl=null;this.proxy.style.display='none';this.badge.style.display='none';}
};DragSystem.init();

// CONTEXT MENU SIZING
window.toggleDesktopSize=function(isLarge){
  if(isLarge) document.getElementById('desktop-area').classList.add('desktop-large-mode');
  else document.getElementById('desktop-area').classList.remove('desktop-large-mode');
  document.getElementById('desktop-context-menu').style.display='none';
};

const wallpaperRegistry={"Default":{id:"Default",name:"Snake Skeleton",url:"Videos/default.mp4",loop:true,locked:false},"green":{id:"green",name:"Green Anime",url:"Videos/green.mp4",loop:true,locked:false},"#33A56":{id:"hunt_trait",name:"Hunt Showdown",url:"Videos/33A56.mp4",loop:false,locked:true},"#Minecraft01":{id:"Tree",name:"Tree Of Life",url:"Videos/Minecraft01.mp4",loop:true,locked:true},"#45E33":{id:"SnowFall",name:"Snow Fall",url:"Videos/45E33.mp4",loop:true,locked:true},"#Minecraft02":{id:"Minecraft02",name:"Sakura Pond",url:"Videos/Minecraft02.mp4",loop:true,locked:true},"#Minecraft03":{id:"Minecraft03",name:"Minecraft Paradise",url:"Videos/Minecraft03.mp4",loop:true,locked:true}};
let unlockedWallpapers=JSON.parse(localStorage.getItem('cine_unlocked_wp'))||['default'];window.wpMode='both';
document.addEventListener('contextmenu',e=>{var v=['desktop-area','windows-layer','bg-video','snow-fx'];if(v.includes(e.target.id)||e.target.tagName==='BODY'){e.preventDefault();var c=document.getElementById('desktop-context-menu');c.style.display='block';var x=e.pageX,y=e.pageY;if(x+200>window.innerWidth)x=window.innerWidth-200;if(y+100>window.innerHeight)y=window.innerHeight-100;c.style.left=x+'px';c.style.top=y+'px';}});
document.addEventListener('click',e=>{var c=document.getElementById('desktop-context-menu');if(c&&!c.contains(e.target))c.style.display='none';});
function setWallpaper(k,i=false){var d=wallpaperRegistry[k];if(!d)return;if(i&&d.locked&&!unlockedWallpapers.includes(d.id)){unlockedWallpapers.push(d.id);localStorage.setItem('cine_unlocked_wp',JSON.stringify(unlockedWallpapers));alert(`Wallpaper: [ ${d.name} ] Unlocked.`);}if(window.wpMode==='home'||window.wpMode==='both'){var v=document.getElementById('bg-video');v.src=d.url;v.loop=!!d.loop;v.load();if(!document.getElementById('lock-screen').classList.contains('active'))v.play();updateSysSetting('homeWallpaper',k);}if(window.wpMode==='lock'||window.wpMode==='both'){var l=document.getElementById('lock-video');l.src=d.url;l.loop=!!d.loop;l.load();if(document.getElementById('lock-screen').classList.contains('active'))l.play();updateSysSetting('lockWallpaper',k);}openWallpaperMenu();}
function openWallpaperMenu(){var m=document.getElementById('wallpaper-menu');var gu=document.getElementById('wp-grid-unlocked');var gl=document.getElementById('wp-grid-locked');gu.innerHTML='';gl.innerHTML='';for(const[k,d] of Object.entries(wallpaperRegistry)){var u=!d.locked||unlockedWallpapers.includes(d.id);var c=document.createElement('div');c.className=`wp-card ${u?'':'wp-locked'}`;if(u){c.innerHTML=`<video src="${d.url}" preload="auto" playsinline muted loop onmouseover="this.play()" onmouseout="this.pause()"></video><div class="wp-info">${d.name}</div>`;c.onclick=()=>{setWallpaper(k);document.querySelectorAll('.wp-card').forEach(e=>e.classList.remove('active-wp'));c.classList.add('active-wp');};gu.appendChild(c);}else{c.innerHTML=`<div class="wp-info"><i class="fas fa-lock"></i></div>`;gl.appendChild(c);}}m.classList.add('open');}
var si=document.getElementById('start-search-input');if(si){si.addEventListener('keydown',function(e){if(e.key==='Enter'){var q=this.value.trim();if(wallpaperRegistry[q]){setWallpaper(q,true);this.value="";this.blur();}}});}
function toggleStartMenu(){var s=document.getElementById('start-menu');if(s.classList.contains('open')){s.classList.remove('open');setTimeout(()=>s.style.display='none',300);}else{s.style.display='flex';setTimeout(()=>s.classList.add('open'),10);}}
document.addEventListener('click',e=>{var s=document.getElementById('start-menu');if(s&&!s.contains(e.target)&&!e.target.closest('.dock-item')){s.classList.remove('open');setTimeout(()=>s.style.display='none',300);}});

// SNOW FX
var ctxSnow=document.getElementById('snow-fx').getContext('2d');var ww=window.innerWidth,wh=window.innerHeight;document.getElementById('snow-fx').width=ww;document.getElementById('snow-fx').height=wh;var flakes=Array.from({length:30},()=>({x:Math.random()*ww,y:Math.random()*wh,r:Math.random()*2,s:Math.random()+0.5}));
function drawSnow(){if(isDesktopActive){ctxSnow.clearRect(0,0,ww,wh);ctxSnow.fillStyle="rgba(255,255,255,0.3)";flakes.forEach(f=>{ctxSnow.beginPath();ctxSnow.arc(f.x,f.y,f.r,0,Math.PI*2);ctxSnow.fill();f.y+=f.s;if(f.y>wh)f.y=0;});}requestAnimationFrame(drawSnow);}drawSnow();


// CIRI ASSISTANT PRO LOGIC
const MODES=['FAST','THINKING','LIVE'];let currentModeIndex=0;let isCiriActive=false;let holdTimer=null;let hasBootedCiri=false;let expectingApiKey=false;let screenStream=null;let currentImageBase64=null;let currentImageMime=null;
const uiBody=document.body;const statusText=document.getElementById('status-text');const statusIcon=document.getElementById('status-icon');const chatHistory=document.getElementById('chat-history');const chatInput=document.getElementById('chat-input');const modeToggle=document.getElementById('mode-toggle');const actionOrb=document.getElementById('action-orb');const imgPreviewBox=document.getElementById('img-preview-box');const imgPreview=document.getElementById('img-preview');const videoElement=document.getElementById('screen-video');const canvasElement=document.getElementById('screen-canvas');
const svgSecure=`<svg class="secure-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>`;
const svgUnstable=`<svg class="unstable-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

function checkApiKeyStatus(){if(localStorage.getItem('ciri_key')){statusText.textContent="Secure";statusText.className="secure";statusIcon.innerHTML=svgSecure;}else{statusText.textContent="Unstable";statusText.className="unstable";statusIcon.innerHTML=svgUnstable;}}checkApiKeyStatus();
window.autoGrow=function(element){element.style.height="5px";element.style.height=(element.scrollHeight)+"px";};
window.addEventListener('keydown',(e)=>{if(e.altKey&&(e.code==='KeyS'||e.key.toLowerCase()==='s')){if(!holdTimer&&!isCiriActive){holdTimer=setTimeout(()=>{uiBody.classList.add('ciri-active');isCiriActive=true;if(!hasBootedCiri){const bootScreen=document.getElementById('ciri-boot-screen');const bootCiri=document.getElementById('boot-ciri-text');const bootSub=document.getElementById('boot-sub-text');const bootLoader=document.getElementById('boot-loader');const bootStatusText=document.getElementById('boot-status-text');const bootSpinner=document.getElementById('boot-spinner');bootScreen.style.display='flex';setTimeout(()=>bootCiri.classList.add('typing'),300);setTimeout(()=>bootSub.classList.add('show'),1100);setTimeout(()=>{bootLoader.style.opacity='1';const pingStart=Date.now();fetch('https://generativelanguage.googleapis.com/v1beta/models').then(()=>handleNetworkResult("Connection Established.")).catch(()=>handleNetworkResult("Network Restricted."));function handleNetworkResult(message){const elapsed=Date.now()-pingStart;const remainingTime=Math.max(0,1500-elapsed);setTimeout(()=>{bootStatusText.textContent=message;bootSpinner.style.display='none';setTimeout(()=>{bootScreen.style.filter='blur(10px)';bootScreen.style.opacity='0';setTimeout(()=>{bootScreen.style.display='none';hasBootedCiri=true;chatInput.focus();},800);},1800);},remainingTime);}},2200);}else{setTimeout(()=>chatInput.focus(),100);}},2000);}}else if(e.code==='Escape'&&isCiriActive)closeCiri();});
window.addEventListener('keyup',(e)=>{if(e.code==='KeyS'||e.key.toLowerCase()==='s'||e.key==='Alt'){clearTimeout(holdTimer);holdTimer=null;}});
window.closeCiri=function(){uiBody.classList.remove('ciri-active');isCiriActive=false;if(screenStream&&MODES[currentModeIndex]!=='LIVE')stopScreenShare();};
window.cycleMode=async function(){currentModeIndex=(currentModeIndex+1)%MODES.length;const newMode=MODES[currentModeIndex];modeToggle.textContent=newMode;modeToggle.className=newMode==='LIVE'?'live-active':'';if(newMode==='LIVE'){try{screenStream=await navigator.mediaDevices.getDisplayMedia({video:{displaySurface:"monitor"}});videoElement.srcObject=screenStream;appendMessage("ciri","LIVE Vision active. I can now see your screen.");}catch(err){appendMessage("ciri","Failed to access screen. Reverting mode.");cycleMode();}}else{stopScreenShare();}};
function stopScreenShare(){if(screenStream){screenStream.getTracks().forEach(track=>track.stop());screenStream=null;}}
async function captureScreen(){if(!screenStream)return null;canvasElement.width=videoElement.videoWidth;canvasElement.height=videoElement.videoHeight;canvasElement.getContext('2d').drawImage(videoElement,0,0);return canvasElement.toDataURL('image/jpeg',0.8).split(',')[1];}
chatInput.addEventListener('paste',(e)=>{const items=(e.clipboardData||e.originalEvent.clipboardData).items;for(let item of items){if(item.type.indexOf('image')===0)processImage(item.getAsFile());}});
window.handleFileUpload=function(e){if(e.target.files&&e.target.files[0])processImage(e.target.files[0]);};
function processImage(file){const reader=new FileReader();reader.onload=(e)=>{currentImageBase64=e.target.result.split(',')[1];currentImageMime=file.type;imgPreview.src=e.target.result;imgPreviewBox.style.display='flex';};reader.readAsDataURL(file);}
window.clearImage=function(){currentImageBase64=null;currentImageMime=null;imgPreviewBox.style.display='none';document.getElementById('file-upload').value="";};
chatInput.addEventListener('keypress',(e)=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleSend();}});
function parseWithMath(text){let mathBlocks=[];let temp=text.replace(/\$\$([\s\S]+?)\$\$/g,(match)=>{mathBlocks.push(match);return `%%MATH_${mathBlocks.length-1}%%`;});temp=temp.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g,(match)=>{mathBlocks.push(match);return `%%MATH_${mathBlocks.length-1}%%`;});let html=marked.parse(temp);mathBlocks.forEach((block,i)=>{html=html.replace(`%%MATH_${i}%%`,block);});return html;}
window.handleSend=async function(){const text=chatInput.value.trim();if(!text&&!currentImageBase64)return;if(expectingApiKey){localStorage.setItem('ciri_key',text);chatInput.value='';chatInput.style.height='auto';expectingApiKey=false;checkApiKeyStatus();appendMessage("ciri","API Key secured.");return;}const apiKey=localStorage.getItem('ciri_key');if(!apiKey){appendMessage("user",text);chatInput.value='';chatInput.style.height='auto';expectingApiKey=true;appendMessage("ciri","Please provide your Gemini API key.");return;}appendMessage("user",text,imgPreview.src);chatInput.value='';chatInput.style.height='auto';const payloadImage=currentImageBase64;const payloadMime=currentImageMime;clearImage();actionOrb.classList.add('thinking');const tempLoadingId="loading-"+Date.now();let loadingHtml=`<div class="message ciri" id="${tempLoadingId}"><span style="color: #a1a1aa; font-style: italic; font-weight: 500;">Processing...</span></div>`;chatHistory.insertAdjacentHTML('beforeend',loadingHtml);scrollToBottom();const parts=[];if(text)parts.push({text:text});if(payloadImage)parts.push({inline_data:{mime_type:payloadMime,data:payloadImage}});if(MODES[currentModeIndex]==='LIVE'&&screenStream){const screenB64=await captureScreen();if(screenB64)parts.push({inline_data:{mime_type:"image/jpeg",data:screenB64}});}const requestBody={contents:[{parts:parts}]};if(MODES[currentModeIndex]==='THINKING'){requestBody.system_instruction={parts:[{text:"You are Ciri, an advanced AI. You MUST think step-by-step before answering. Enclose your entirely literal, internal thought process inside <think>...</think> tags. After the closing </think> tag, provide your final formatted answer. You are also an expert mathematician. Always use standard LaTeX for math. Use $$ for block equations and $ for inline equations."}]};}else{requestBody.system_instruction={parts:[{text:"You are Ciri. You are an expert mathematician. Always use standard LaTeX for math. Use $$ for block equations and $ for inline equations."}]};}try{const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(requestBody)});const data=await res.json();if(data.error)throw new Error(data.error.message);let responseText=data.candidates[0].content.parts[0].text;let realThoughts="";if(MODES[currentModeIndex]==='THINKING'){const thinkMatch=responseText.match(/<think>([\s\S]*?)<\/think>/);if(thinkMatch){realThoughts=thinkMatch[1].trim();responseText=responseText.replace(/<think>[\s\S]*?<\/think>/,'').trim();}}document.getElementById(tempLoadingId).remove();actionOrb.classList.remove('thinking');await typeMarkdownResponse(responseText,realThoughts);}catch(err){document.getElementById(tempLoadingId).remove();actionOrb.classList.remove('thinking');await typeMarkdownResponse("Error: "+err.message);}};
function appendMessage(sender,text,imgSrc=null){const div=document.createElement('div');div.className=`message ${sender}`;let html="";if(imgSrc&&imgSrc!==window.location.href)html+=`<img src="${imgSrc}" style="max-width: 100%; border-radius: 12px; margin-bottom: 12px;">`;if(text)html+=parseWithMath(text);div.innerHTML=html;chatHistory.appendChild(div);if(window.MathJax)MathJax.typesetPromise([div]).catch((err)=>console.log(err));scrollToBottom();}
function scrollToBottom(){chatHistory.scrollTop=chatHistory.scrollHeight;}
function typeMarkdownResponse(fullText,realThoughts=""){return new Promise((resolve)=>{const div=document.createElement('div');div.className='message ciri';let htmlStructure="";if(realThoughts){htmlStructure+=`<details class="thought-process"><summary>Internal Monologue</summary><div class="thought-content">${realThoughts.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div></details>`;}const contentDiv=document.createElement('div');div.innerHTML=htmlStructure;div.appendChild(contentDiv);chatHistory.appendChild(div);let i=0;let currentStr="";const speed=MODES[currentModeIndex]==='FAST'?2:5;const chunkSize=MODES[currentModeIndex]==='FAST'?4:2;function typeChar(){const scrollTolerance=40;const isNearBottom=Math.abs(chatHistory.scrollHeight-chatHistory.clientHeight-chatHistory.scrollTop)<=scrollTolerance;if(i<fullText.length){currentStr+=fullText.substring(i,i+chunkSize);i+=chunkSize;contentDiv.innerHTML=parseWithMath(currentStr);if(window.MathJax)MathJax.typesetPromise([contentDiv]).catch((err)=>console.log(err));if(isNearBottom)scrollToBottom();setTimeout(typeChar,speed);}else{contentDiv.innerHTML=parseWithMath(fullText);if(window.MathJax)MathJax.typesetPromise([contentDiv]);if(isNearBottom)scrollToBottom();resolve();}}typeChar();});}


// CINE-NOTI ULTIMATE (AUDIO PLAYER)
let localAudio; let audioCtx,analyser,sourceNode; let notiHideTimeout;
const cineNoti=document.getElementById('cine-noti');
function injectAudioElement(){
 localAudio=new Audio(); localAudio.src="https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3";
 localAudio.crossOrigin="anonymous"; localAudio.loop=true; localAudio.id="sys-noti-audio";
 document.body.appendChild(localAudio); setupAudioListeners();
}
function showNoti(){ cineNoti.classList.add('active'); cineNoti.classList.remove('minimized'); document.getElementById('restore-btn').classList.remove('visible'); resetNotiHideTimer(); if(!audioCtx)initWebAudio(); }
function hideNoti(){ cineNoti.classList.remove('active'); cineNoti.classList.remove('minimized'); document.getElementById('restore-btn').classList.remove('visible'); clearTimeout(notiHideTimeout); }
function resetNotiHideTimer(){
 clearTimeout(notiHideTimeout);
 if(cineNoti.classList.contains('active')&&!cineNoti.classList.contains('minimized')){
  notiHideTimeout=setTimeout(()=>{cineNoti.classList.add('minimized');setTimeout(()=>document.getElementById('restore-btn').classList.add('visible'),300);},5000);
 }
}
cineNoti.addEventListener('mouseenter',()=>clearTimeout(notiHideTimeout)); cineNoti.addEventListener('mouseleave',resetNotiHideTimer);

document.getElementById('minimize-noti-btn').onclick=()=>{cineNoti.classList.add('minimized');setTimeout(()=>document.getElementById('restore-btn').classList.add('visible'),300);};
document.getElementById('restore-btn').onclick=()=>{document.getElementById('restore-btn').classList.remove('visible');cineNoti.classList.remove('minimized');resetNotiHideTimer();};
document.getElementById('close-noti-btn').onclick=()=>{if(localAudio)localAudio.pause(); hideNoti();};

function initWebAudio(){
 audioCtx=new (window.AudioContext||window.webkitAudioContext)(); analyser=audioCtx.createAnalyser();
 sourceNode=audioCtx.createMediaElementSource(localAudio); sourceNode.connect(analyser); analyser.connect(audioCtx.destination);
 analyser.fftSize=64; drawVisualizer();
}
function drawVisualizer(){
 requestAnimationFrame(drawVisualizer);
 const cvs=document.getElementById('visualizer'); const ctx=cvs.getContext('2d');
 cvs.width=cvs.parentElement.clientWidth; cvs.height=14;
 const bufferLength=analyser.frequencyBinCount; const dataArray=new Uint8Array(bufferLength); analyser.getByteFrequencyData(dataArray);
 ctx.clearRect(0,0,cvs.width,cvs.height); const barW=(cvs.width/bufferLength)*2; let x=0;
 for(let i=0;i<bufferLength;i++){ const barH=(dataArray[i]/255)*cvs.height; ctx.fillStyle=`#fff`; ctx.beginPath(); ctx.roundRect(x,cvs.height-barH,barW-1.5,barH,2); ctx.fill(); x+=barW; }
}

function setupAudioListeners(){
 document.getElementById('play-pause').onclick=()=>{localAudio.paused?localAudio.play():localAudio.pause();resetNotiHideTimer();};
 localAudio.addEventListener('play',()=>{document.getElementById('icon-play').style.display='none';document.getElementById('icon-pause').style.display='block'; showNoti();});
 localAudio.addEventListener('pause',()=>{document.getElementById('icon-play').style.display='block';document.getElementById('icon-pause').style.display='none';});
 document.getElementById('skip-back').onclick=()=>{if(isFinite(localAudio.currentTime))localAudio.currentTime=Math.max(0,localAudio.currentTime-15);resetNotiHideTimer();};
 document.getElementById('skip-forward').onclick=()=>{if(isFinite(localAudio.duration)&&localAudio.duration>0)localAudio.currentTime=Math.min(localAudio.duration,localAudio.currentTime+15);resetNotiHideTimer();};
 localAudio.addEventListener('timeupdate',()=>{
  document.getElementById('current-time').textContent=formatTime(localAudio.currentTime);
  if(isFinite(localAudio.duration)&&localAudio.duration>0){
   document.getElementById('progress-fill').style.width=`${(localAudio.currentTime/localAudio.duration)*100}%`;
   if(document.getElementById('total-time').textContent==="LIVE")document.getElementById('total-time').textContent=formatTime(localAudio.duration);
  }
 });
 document.getElementById('progress-hit-area').onclick=(e)=>{
  if(isFinite(localAudio.duration)&&localAudio.duration>0){
   const rect=document.getElementById('progress-hit-area').getBoundingClientRect(); const percent=(e.clientX-rect.left)/rect.width; localAudio.currentTime=percent*localAudio.duration;
  } resetNotiHideTimer();
 };
}
function formatTime(s){if(isNaN(s)||!isFinite(s))return"0:00";const m=Math.floor(s/60);const se=Math.floor(s%60);return `${m}:${se.toString().padStart(2,'0')}`;}

// GLOBAL MEDIA INTERCEPT FOR NOTI
const origPlay=HTMLMediaElement.prototype.play;
HTMLMediaElement.prototype.play=function(){
 if(this.id!=='boot-video'&&this.id!=='bg-video'&&this.id!=='lock-video') showNoti();
 return origPlay.apply(this,arguments);
};
