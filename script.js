var _SYSTEM_PATHS = ["C:/Windows/System32/kernel32.dll", "/var/www/html/cine-os/", "https://cine-os.local/api/v1/auth"];
var _devBuildVer = "3.0.1";

var APPS = {
    'cine': {title: 'CINE // HUB', path: 'script/Apps/Cine/index.html', icon: 'https://cdn.worldvectorlogo.com/logos/netflix-logo-icon.svg', pinned: true},
    'term': {title: 'Spotify', path: 'script/Apps/Spotify/index.html', icon: 'https://cdn.pixabay.com/photo/2016/10/22/00/15/spotify-1759471_1280.jpg', pinned: true},
    'files': {title: 'PS5 Emu', path: 'script/Apps/Ps5/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OeL_be7RFaoHi3PswkuAR5XcMgBNRDynsg&s', pinned: true},
    'web': {title: 'Cine-Web', path: 'script/Apps/Web/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeD89ZcX5W1FBtal7RerasT27q-OmZqnBixQ&s', pinned: true},
    'settings': {title: 'CONFIG', internal: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-apple-settings-icon-svg-download-png-493162.png', pinned: true},
    'discord': {title: 'Discord', path: 'script/Apps/Discord/index.html', icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', pinned: false},
    'roblox': {title: 'Roblox', path: 'script/Apps/Roblox/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9KvNyFWMg_bjo_q_1IVLKFWbfCeonn2qDow&s', pinned: false},
    'android': {title: 'Android', path: 'script/Apps/Android/index.html', icon: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/android-icon.png', pinned: false},
    'ciniai': {title: 'Cini AI', path: 'script/Apps/Cini/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkLXhvns5Rrdf-XBNlWcPIRh0hlJfWnEtBWg&s', pinned: false},
    'VM': {title: 'Windows Virtual-Machine', path: 'script/Apps/VM/index.html', icon: 'https://static1.squarespace.com/static/68e69c83884dc82cc035a923/69454e29c6db7516b2566fca/69454e32c6db7516b256749a/1766149682532/Virtualbox_logo.png?format=original', pinned: false},
    'crunchyroll': {title: 'CrunchyRoll', path: 'script/Apps/Crunchy/index.html', icon: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a0a4547a-06c5-4740-b87a-ca9c4fa0171e/dduaesk-2b3e85d2-3116-4eb5-8260-f413d1fc670e.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiIvZi9hMGE0NTQ3YS0wNmM1LTQ3NDAtYjg3YS1jYTljNGZhMDE3MWUvZGR1YWVzay0yYjNlODVkMi0zMTE2LTRlYjUtODI2MC1mNDEzZDFmYzY3MGUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.vReffTSSKpde4w8EwFxz_CttxlLay8fXOq0goYh6rsg', pinned: false},
    'Geforce': {title: 'GEFORCE NOW', path: 'script/Apps/Geforce/index.html', icon: 'https://play-lh.googleusercontent.com/_-b_HQXrVyyhZSHj_BoE9u_-cxkcHDH_yLX5rDjJsFMIfsCNQs9F3QP4JvEFcWaSIz0=w240-h480-rw', pinned: false},
    'Fortnite': {title: 'Fortnite', path: 'script/Apps/Fortnite/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShiXrQ-cvZeDyQNPIZCv_hsaUCAe5j_rXJ7Q&s', pinned: false},
    'RocketL': {title: 'Rocket League', path: 'script/Apps/RocketL/index.html', icon: 'https://ygo-assets-entities-us.yougov.net/87bb7a16-2b62-11e8-82b1-37bb0d207ced.jpg?zcw=518&zch=518&zct=10&zcl=0', pinned: false},
    'Xbox': {title: 'Xbox', path: 'script/Apps/Xbox/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRknRQh-WRK4F75YB3EAlfrsqAk66Xjn45sBg&s', pinned: false},
};

var savedPins = localStorage.getItem('c_pins_v2');
if(savedPins) {
    let p = JSON.parse(savedPins);
    for(let k in p) {
        if(APPS[k]) APPS[k].pinned = p[k];
    }
}

function syncPins() {
    let obj = {};
    for(let k in APPS) obj[k] = APPS[k].pinned;
    localStorage.setItem('c_pins_v2', JSON.stringify(obj));
}

var wallpaperRegistry = {
    "Default": {id: "Default", name: "Snake Skeleton", url: "Videos/default.mp4", locked: false},
    "green": {id: "green", name: "Green Anime", url: "Videos/green.mp4", locked: false},
    "33A56": {id: "hunt_trait", name: "Hunt Showdown", url: "Videos/33A56.mp4", locked: true},
    "45E33": {id: "45E33", name: "45E33", url: "Videos/45E33.mp4", locked: false},
    "55Cine": {id: "55Cine", name: "Cine 55", url: "Videos/55Cine.PNG", locked: false},
    "99Med": {id: "99Med", name: "99 Med", url: "Videos/99Med.mp4", locked: false},
    "Brother": {id: "Brother", name: "Brother", url: "Videos/Brother.mp4", locked: false},
    "F-1": {id: "F-1", name: "F-1 Formula", url: "Videos/F-1.mp4", locked: false},
    "Gojo-Sukuna": {id: "Gojo-Sukuna", name: "Gojo vs Sukuna", url: "Videos/Gojo-Sukuna.mp4", locked: false},
    "Hunt": {id: "Hunt", name: "Hunt Showdown 2", url: "Videos/Hunt.mp4", locked: false},
    "Minecraft01": {id: "Minecraft01", name: "Minecraft 01", url: "Videos/Minecraft01.mp4", locked: false},
    "Minecraft02": {id: "Minecraft02", name: "Minecraft 02", url: "Videos/Minecraft02.mp4", locked: false},
    "Minecraft03": {id: "Minecraft03", name: "Minecraft 03", url: "Videos/Minecraft03.mp4", locked: false},
    "Monkey": {id: "Monkey", name: "Monkey", url: "Videos/Monkey.mp4", locked: false},
    "Skello": {id: "Skello", name: "Skello", url: "Videos/Skello.MP4", locked: false},
    "SnowFox": {id: "SnowFox", name: "Snow Fox", url: "Videos/SnowFox.mp4", locked: false},
    "Supra": {id: "Supra", name: "Supra Drift", url: "Videos/Supra.PNG", locked: false},
    "Yuji52": {id: "Yuji52", name: "Yuji 52", url: "Videos/Yuji52.mp4", locked: false},
    "sukuna-fire": {id: "sukuna-fire", name: "Sukuna Fire", url: "Videos/sukuna-fire.mp4", locked: false}
};

var sysConfig = JSON.parse(localStorage.getItem('cine_sys_config')) || {};
if(sysConfig.optBg === undefined) sysConfig.optBg = false;
if(sysConfig.shortBoot === undefined) sysConfig.shortBoot = false;
if(sysConfig.wpLoop === undefined) sysConfig.wpLoop = false;
if(sysConfig.idleLock === undefined) sysConfig.idleLock = false; 
if(sysConfig.redirectConfirm === undefined) sysConfig.redirectConfirm = false; 
if(!sysConfig.panicKey) sysConfig.panicKey = '`';
if(!sysConfig.homeWallpaper) sysConfig.homeWallpaper = 'Default';
if(!sysConfig.lockWallpaper) sysConfig.lockWallpaper = 'green';
if(!sysConfig.cloak) sysConfig.cloak = 'none';

window.updateSysSetting = function(key, value) {
    sysConfig[key] = value;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    if(key === 'optBg') applySystemSettings();
    if(key === 'wpLoop') updateWallpaperLoop();
};

var cloaks = {
    none: {title: "Cine-OS", icon: ""},
    google: {title: "Google", icon: "https://www.google.com/favicon.ico"},
    drive: {title: "My Drive - Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"},
    canvas: {title: "Dashboard", icon: "https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico"},
    classroom: {title: "Classes", icon: "https://ssl.gstatic.com/classroom/favicon.png"}
};

window.updateCloak = function(key) {
    sysConfig.cloak = key;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    applyCloak();
};

function applyCloak() {
    var k = sysConfig.cloak || 'none';
    var sel = cloaks[k];
    var icons = document.querySelectorAll("link[rel*='icon']");
    for(var i=0; i<icons.length; i++) icons[i].remove();
    
    if(sel && k !== 'none') {
        document.title = sel.title;
        let n = document.createElement('link');
        n.type = 'image/x-icon';
        n.rel = 'shortcut icon';
        n.href = sel.icon;
        document.getElementsByTagName('head')[0].appendChild(n);
    } else {
        document.title = "Cine-OS";
    }
}
setInterval(applyCloak, 2000);

var isDesktopActive = false;
var bootActive = true;
var enterCount = 0;
var highestZ = 500;
var activeWindowId = null;
var isMediaPlaying = false;
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
var activeCtxId = null;

if(isMobile) {
    var mobWarn = document.getElementById('mobile-warning');
    if(mobWarn && mobWarn.showModal) mobWarn.showModal();
    else if(mobWarn) mobWarn.style.display = 'flex';
    
    var lastTap = 0;
    document.addEventListener('touchstart', function(e) {
        let t = new Date().getTime();
        let tl = t - lastTap;
        if(tl < 500 && tl > 0) {
            if(mobWarn && mobWarn.close) mobWarn.close();
            else if(mobWarn) mobWarn.style.display = 'none';
        }
        lastTap = t;
    });
}

async function loadDynamicResources() {
    renderUI();
    initWallpapers();
    setupAppContextMenu();
}

window.onbeforeunload = function(e) {
    if(sysConfig.redirectConfirm) {
        let msg = "Are you sure you want to leave? This helps block GoGuardian redirects.";
        e.returnValue = msg;
        return msg;
    }
};

document.addEventListener("DOMContentLoaded", function() {
    applyCloak();
    loadDynamicResources();
    document.getElementById('boot-layer').style.display = 'block';
    loadDesktop();
    updateSidebarData();
});

function renderUI() {
    let dock = document.getElementById('dock-container');
    let dHTML = '<div class="dock-item" onclick="toggleStartMenu()"><img src="https://missionsupport.archden.org/wp-content/uploads/2022/02/windows11-icon.png"></div><div class="dock-sep"></div><div class="dock-item" onclick="toggleAppDrawer()"><svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg></div><div class="dock-sep"></div>';
    
    let pGrid = document.getElementById('pinned-grid');
    let pHTML = '';
    
    for(let id in APPS) {
        if(APPS[id].pinned) {
            dHTML += '<div class="dock-item" data-id="'+id+'" onmousedown="DragSystem.start(event,this,\'dock\',\''+id+'\')" onclick="toggleApp(\''+id+'\')" oncontextmenu="openDockCtx(event, \''+id+'\')"><img src="'+APPS[id].icon+'"></div>';
            pHTML += '<div class="pinned-item" onclick="toggleApp(\''+id+'\')"><img src="'+APPS[id].icon+'"><span>'+APPS[id].title+'</span></div>';
        }
    }
    
    dock.innerHTML = dHTML;
    pGrid.innerHTML = pHTML;
    populateDrawer();
}

function openDockCtx(e, id) {
    e.preventDefault(); e.stopPropagation();
    hideAllCtx();
    activeCtxId = id;
    let m = document.getElementById('dock-ctx-menu');
    if(m) {
        m.style.display = 'block';
        m.style.left = e.pageX + 'px';
        m.style.top = e.pageY + 'px';
    }
}

function openDrawerCtx(e, id) {
    e.preventDefault(); 
  e.stopPropagation();
    hideAllCtx();
    activeCtxId = id;
    let m = document.getElementById('drawer-ctx-menu');
    if(m) {
        m.style.display = 'block';
        m.style.left = e.pageX + 'px';
        m.style.top = e.pageY + 'px';
    }
}

document.getElementById('ctx-pin-app').onclick = function() {
    if(activeCtxId && APPS[activeCtxId]) {
        APPS[activeCtxId].pinned = true;
        syncPins();
        renderUI();
    }
    hideAllCtx();
}

document.getElementById('ctx-unpin-app').onclick = function() {
    if(activeCtxId && APPS[activeCtxId]) {
        APPS[activeCtxId].pinned = false;
        syncPins();
        renderUI();
    }
    hideAllCtx();
}

function hideAllCtx() {
    let menus = ['app-context-menu','desktop-context-menu','drawer-ctx-menu','dock-ctx-menu'];
    for(let i=0; i<menus.length; i++) {
        let m = document.getElementById(menus[i]);
        if(m) m.style.display = 'none';
    }
}
document.addEventListener('click', hideAllCtx);

document.addEventListener('keydown', function(e) {
    if(bootActive && e.key === 'Enter' && document.getElementById('boot-layer').style.display !== 'none') {
        enterCount++;
        if(enterCount >= 2) skipBootSequence();
        setTimeout(function(){ enterCount = 0; }, 500);
    }
    if(e.key && sysConfig.panicKey && e.key.toLowerCase() === sysConfig.panicKey.toLowerCase()) {
        window.location.href = "https://google.com";
    }
});

function startBootSequence() {
    let cb = document.getElementById('boot-content');
    let bv = document.getElementById('boot-video');
    cb.style.display = 'none';
    bv.style.display = 'block';
    bv.muted = false;
    bv.volume = 1.0;
    
    if(sysConfig.shortBoot) {
        bv.src = "Videos/QuickBoot.mp4";
        bv.load();
    }
    
    let p = bv.play();
    if(p !== undefined) {
        p.catch(function() {
            bv.muted = true;
            bv.play();
        });
    }
    bv.onended = function() {
        if(bootActive) skipBootSequence();
    };
}

function skipBootSequence() {
    if(!bootActive) return;
    bootActive = false;
    let lay = document.getElementById('boot-layer');
    let bv = document.getElementById('boot-video');
    if(bv) bv.pause();
    
    if(lay) {
        lay.style.opacity = '0';
        document.getElementById('lock-screen').classList.add('active');
        
        let lv = document.getElementById('lock-video');
        if(lv.style.display !== 'none') {
            lv.play().catch(function(e) {});
        }
        
        setTimeout(function() { lay.style.display = 'none'; }, 600);
        updateClock();
    }
}

function showNotification(title, msg) {
    let c = document.getElementById('toast-container');
    let t = document.createElement('div');
    t.className = 'toast-notification';
    t.innerHTML = '<div class="toast-header"><div class="toast-app-info"><div class="toast-icon"><i class="fas fa-bell"></i></div><span>System</span></div><i class="fas fa-times toast-close"></i></div><div class="toast-title">' + title + '</div><div class="toast-body">' + msg + '</div>';
    c.appendChild(t);
    
    setTimeout(function(){ t.classList.add('show'); }, 100);
    t.onclick = function() {
        t.classList.remove('show');
        setTimeout(function(){ t.remove(); }, 400);
    };
    setTimeout(t.onclick, 6000);
}

var welcomeShown = false;
window.unlockSystem = function() {
    let scr = document.getElementById('lock-screen');
    scr.classList.add('slide-up');
    setTimeout(function() {
        scr.classList.remove('active');
        isDesktopActive = true;
        document.getElementById('lock-video').pause();
        
        if(!sysConfig.optBg) {
            let bV = document.getElementById('bg-video');
            if(bV.style.display !== 'none') bV.play().catch(function(e){});
        }
        if(!welcomeShown) {
            showNotification("Welcome To Cine V2", "Checkout Settings for FAQ!");
            welcomeShown = true;
        }
    }, 600);
    resetIdle();
};

function applyMediaToElements(url, vidEl, imgEl, isBg) {
    if(!url) return;
    let isImg = url.match(/\.(png|jpg|jpeg|gif)$/i);
    if(isImg) {
        vidEl.style.display = 'none';
        vidEl.pause();
        imgEl.style.display = 'block';
        imgEl.src = url;
    } else {
        imgEl.style.display = 'none';
        vidEl.style.display = 'block';
        vidEl.src = url;
        vidEl.load();
        if(isBg && isDesktopActive && !sysConfig.optBg) vidEl.play().catch(function(e){});
        if(!isBg && document.getElementById('lock-screen').classList.contains('active')) vidEl.play().catch(function(e){});
    }
}

function initWallpapers() {
    let bV = document.getElementById('bg-video');
    let bI = document.getElementById('bg-img');
    let lV = document.getElementById('lock-video');
    let lI = document.getElementById('lock-img');
    
    if(wallpaperRegistry[sysConfig.homeWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.homeWallpaper].url, bV, bI, true);
    }
    if(wallpaperRegistry[sysConfig.lockWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.lockWallpaper].url, lV, lI, false);
    } else {
        applyMediaToElements("Videos/green.mp4", lV, lI, false);
    }
    
    updateWallpaperLoop();
    let wChk = document.getElementById('wp-loop-chk');
    if(wChk) wChk.checked = sysConfig.wpLoop;
}

function updateWallpaperLoop() {
    let bV = document.getElementById('bg-video');
    let lV = document.getElementById('lock-video');
    if(bV) bV.loop = sysConfig.wpLoop;
    if(lV) lV.loop = sysConfig.wpLoop;
    if(!sysConfig.optBg && isDesktopActive && bV && bV.paused && bV.style.display !== 'none') {
        bV.play().catch(function(e){});
    }
}

function updateClock() {
    let n = new Date();
    let dArr = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    let mArr = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    
    let hrs = n.getHours().toString().padStart(2, '0');
    let min = n.getMinutes().toString().padStart(2, '0');
    let dNum = n.getDate().toString().padStart(2, '0');
    let dName = dArr[n.getDay()];
    let yr = n.getFullYear();
    
    let lDay = document.getElementById('lock-day-large');
    let lDat = document.getElementById('lock-date');
    let lTim = document.getElementById('lock-time');
    let hDay = document.getElementById('lbl-day');
    
    if(lDay) lDay.innerText = dName;
    if(hDay) hDay.innerText = dName;
    if(lDat) lDat.innerText = dNum + ' ' + mArr[n.getMonth()] + ', ' + yr + '.';
    if(lTim) lTim.innerText = '- ' + hrs + ':' + min + ' -';
}
setInterval(updateClock, 1000);

var idleTime = 0;
function resetIdle() { idleTime = 0; }
document.addEventListener('mousemove', resetIdle);
document.addEventListener('keypress', resetIdle);

setInterval(function() {
    idleTime++;
    let scr = document.getElementById('lock-screen');
    if(sysConfig.idleLock && idleTime >= 180 && !scr.classList.contains('active') && !bootActive) {
        if(isMediaPlaying) {
            idleTime = 0; 
        } else {
            isDesktopActive = false;
            scr.classList.remove('slide-up');
            scr.classList.add('active');
            document.getElementById('bg-video').pause();
            let lv = document.getElementById('lock-video');
            if(lv.style.display !== 'none') lv.play().catch(function(e){});
        }
    }
}, 1000);

window.launchLastPlayed = function() { toggleApp('files'); };
window.resumeSpotify = function() { toggleApp('term'); };
window.openUpdateLog = function() {
    let u = document.getElementById('update-modal');
    if(u && u.showModal) u.showModal();
    else if(u) u.style.display = 'flex';
};

function updateSidebarData() {
    try {
        let ps = JSON.parse(localStorage.getItem('ps_purchased'));
        if(ps && ps.length > 0) document.getElementById('last-game-name').innerText = "PS5 Library Ready";
        let sp = JSON.parse(localStorage.getItem('cinify_cache'));
        if(sp) {
            let k = Object.keys(sp);
            if(k.length > 0) {
                document.getElementById('spotify-track-name').innerText = sp[k[k.length-1]].title || "Liked Song";
                if(sp[k[k.length-1]].cover) document.getElementById('spotify-album-art').src = sp[k[k.length-1]].cover;
            }
        }
    } catch(e) {}
}
setInterval(updateSidebarData, 5000);

function populateDrawer() {
    let g = document.getElementById('drawer-grid');
    g.innerHTML = '';
    for(let key in APPS) {
        let a = APPS[key];
        let d = document.createElement('div');
        d.className = 'drawer-item';
        d.dataset.id = key;
        d.innerHTML = '<img src="' + a.icon + '" style="pointer-events:none;"><span>' + a.title + '</span>';
        
        d.onmousedown = function(e) { DragSystem.start(e, this, 'drawer', this.dataset.id); };
        d.onclick = function(e) {
            if(!DragSystem.isDragMove) {
                toggleApp(this.dataset.id);
                toggleAppDrawer();
            }
        };
        d.oncontextmenu = function(e) { openDrawerCtx(e, this.dataset.id); }
        g.appendChild(d);
    }
}

function filterDrawer(val) {
    let items = document.querySelectorAll('.drawer-item');
    let q = val.toLowerCase();
    for(let i=0; i<items.length; i++) {
        let txt = items[i].innerText.toLowerCase();
        if(txt.includes(q)) items[i].style.display = 'flex';
        else items[i].style.display = 'none';
    }
}

function toggleAppDrawer() {
    let d = document.getElementById('app-drawer');
    if(d.classList.contains('open')) {
        d.classList.remove('open');
        setTimeout(function(){ d.style.display='none'; }, 300);
    } else {
        d.style.display = 'block';
        setTimeout(function(){ d.classList.add('open'); }, 10);
    }
}

function toggleApp(id) {
    let w = document.getElementById('win-' + id);
    if(w) {
        if(w.classList.contains('minimized')) {
            w.classList.remove('minimized');
            w.classList.add('active');
            w.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(w);
        } else if(activeWindowId === id) {
            minimizeWindow(id);
        } else {
            w.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(w);
        }
    } else {
        openWindow(id);
    }
}

function openWindow(id) {
    let m = document.getElementById('start-menu');
    if(m) {
        m.classList.remove('open');
        setTimeout(function(){ m.style.display='none'; }, 300);
    }
    
    let layer = document.getElementById('windows-layer');
    let win = document.getElementById('win-' + id);
    
    if(!win) {
        let dat = APPS[id] || {title: 'APP', path: 'about:blank'};
        win = document.createElement('div');
        win.id = 'win-' + id;
        win.className = 'window active header-visible';
        win.style.zIndex = ++highestZ;
        
        let iframeStr = dat.internal ? '<iframe id="frame-' + id + '"></iframe>' : '<iframe id="frame-' + id + '" src="' + dat.path + '"></iframe>';
        
        win.innerHTML = '<div class="win-header" onmousedown="DragSystem.startWinDrag(event, \'' + id + '\')"><div class="win-title">' + dat.title + '</div><div class="win-controls"><div class="win-btn btn-min" onclick="minimizeWindow(\'' + id + '\')"></div><div class="win-btn btn-close" onclick="closeWindow(\'' + id + '\')"></div></div></div><div class="win-body">' + iframeStr + '</div>';
        
        layer.appendChild(win);
        
        if(dat.internal && id === 'settings') {
            let f = document.getElementById('frame-' + id);
            if(f) {
                let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                    <style>
                        body { background: #000; color: #fff; font-family: 'Rajdhani', sans-serif; padding: 25px; margin: 0; outline: none; }
                        * { outline: none; -webkit-tap-highlight-color: transparent; }
                        h2 { border-bottom: 2px solid #333; padding-bottom: 10px; font-weight: 700; letter-spacing: 1px; }
                        .setting-card { background: #111; border: 1px solid #333; padding: 15px; border-radius: 10px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
                        .setting-text { display: flex; flex-direction: column; }
                        .setting-text b { color: #fff; font-size: 15px; }
                        .setting-text small { color: #888; font-size: 13px; }
                        .switch { position: relative; display: inline-block; width: 40px; height: 20px; }
                        .switch input { opacity: 0; width: 0; height: 0; }
                        .slider { position: absolute; cursor: pointer; inset: 0; background-color: #444; transition: .3s; border-radius: 34px; }
                        .slider:before { position: absolute; content: ""; height: 14px; width: 14px; left: 3px; bottom: 3px; background-color: #fff; transition: .3s; border-radius: 50%; }
                        input:checked + .slider { background-color: #fff; }
                        input:checked + .slider:before { transform: translateX(20px); background-color: #000; }
                        input[type="text"], select { background: #222; color: #fff; border: 1px solid #444; padding: 6px; border-radius: 6px; }
                        input:focus, select:focus { border-color: #888; }
                    </style>
                </head>
                <body>
                    <h2>SYSTEM CONFIGURATION</h2>
                    <div class="setting-card">
                        <div class="setting-text"><b>Optimized Background</b><small>Disables video background</small></div>
                        <label class="switch"><input type="checkbox" id="chk-bg" onchange="window.parent.updateSysSetting('optBg',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Fast Boot</b><small>Skips the startup sequence</small></div>
                        <label class="switch"><input type="checkbox" id="chk-boot" onchange="window.parent.updateSysSetting('shortBoot',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Idle Lock Screen</b><small>Locks system when away for 3 minutes</small></div>
                        <label class="switch"><input type="checkbox" id="chk-idle" onchange="window.parent.updateSysSetting('idleLock',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Redirect Confirmation</b><small>Helps Protect Against GoGuardian tracking!</small></div>
                        <label class="switch"><input type="checkbox" id="chk-redir" onchange="window.parent.updateSysSetting('redirectConfirm',this.checked)"><span class="slider"></span></label>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Tab Cloaking</b><small>Disguises OS as another site</small></div>
                        <select id="cloak-select" onchange="window.parent.updateCloak(this.value)">
                            <option value="none">None (Cine-OS)</option>
                            <option value="google">Google</option>
                            <option value="drive">Google Drive</option>
                            <option value="canvas">Canvas</option>
                        </select>
                    </div>
                    <div class="setting-card">
                        <div class="setting-text"><b>Panic Key</b><small>Instant site redirection shortcut</small></div>
                        <input type="text" id="panic-input" maxlength="1" style="width:40px; text-align:center; font-weight:bold; font-size:16px;" onkeyup="window.parent.updateSysSetting('panicKey',this.value)">
                    </div>
                    <script>
                        var prefs = window.parent.sysConfig;
                        document.getElementById('chk-bg').checked = prefs.optBg;
                        document.getElementById('chk-boot').checked = prefs.shortBoot;
                        document.getElementById('chk-idle').checked = prefs.idleLock;
                        document.getElementById('chk-redir').checked = prefs.redirectConfirm;
                        document.getElementById('cloak-select').value = prefs.cloak;
                        document.getElementById('panic-input').value = prefs.panicKey;
                    <\/script>
                </body>
                </html>`;
                f.srcdoc = html;
            }
        }
    } else {
        win.classList.remove('minimized');
        win.classList.add('active');
        win.style.zIndex = ++highestZ;
    }
    
    activeWindowId = id;
    startImmersiveMode(win);
}

function closeWindow(id) {
    let w = document.getElementById('win-' + id);
    if(w) w.remove();
    if(activeWindowId === id) activeWindowId = null;
    endImmersiveMode();
}

function minimizeWindow(id) {
    let w = document.getElementById('win-' + id);
    if(w) {
        w.classList.add('minimized');
        w.classList.remove('active');
        if(activeWindowId === id) activeWindowId = null;
    }
    endImmersiveMode();
}

function startImmersiveMode(win) {
    document.getElementById('dock-container').classList.add('dock-hidden');
    win.classList.remove('header-visible');
}

function endImmersiveMode() {
    let aw = document.querySelectorAll('.window.active:not(.minimized)');
    if(aw.length === 0) {
        document.getElementById('dock-container').classList.remove('dock-hidden');
        activeWindowId = null;
    } else {
        let t = aw[aw.length - 1];
        activeWindowId = t.id.replace('win-', '');
        t.style.zIndex = ++highestZ;
        startImmersiveMode(t);
    }
}

var dockTimer;
var dEl = document.getElementById('dock-container');
document.getElementById('bottom-trigger').addEventListener('mouseenter', function() {
    dEl.classList.remove('dock-hidden');
    clearTimeout(dockTimer);
});
dEl.addEventListener('mouseleave', function() {
    let aw = document.querySelectorAll('.window.active:not(.minimized)');
    if(aw.length > 0) {
        dockTimer = setTimeout(function() { dEl.classList.add('dock-hidden'); }, 1000);
    }
});
dEl.addEventListener('mouseenter', function() { clearTimeout(dockTimer); });

document.getElementById('top-trigger').addEventListener('mouseenter', function() {
    if(activeWindowId) {
        let w = document.getElementById('win-' + activeWindowId);
        if(w && !w.classList.contains('minimized')) w.classList.add('header-visible');
    }
});

document.addEventListener('mouseover', function(e) {
    if(e.target.closest('.win-header')) {
        if(activeWindowId) {
            let w = document.getElementById('win-' + activeWindowId);
            if(w) w.classList.add('header-visible');
        }
    } else if(activeWindowId && !e.target.closest('#top-trigger')) {
        let w = document.getElementById('win-' + activeWindowId);
        if(w) w.classList.remove('header-visible');
    }
});

var desktopLayout = JSON.parse(localStorage.getItem('cine_desktop_v2')) || [];

function saveDesktop() {
    localStorage.setItem('cine_desktop_v2', JSON.stringify(desktopLayout));
    loadDesktop();
}

function loadDesktop() {
    let c = document.getElementById('desktop-area');
    let ex = document.querySelectorAll('.desktop-app');
    for(let j=0; j<ex.length; j++) ex[j].remove();
    
    desktopLayout.forEach(function(item, idx) {
        let d = document.createElement('div');
        d.className = 'desktop-app';
        d.style.left = item.x + 'px';
        d.style.top = item.y + 'px';
        d.setAttribute('data-idx', idx);
        
        if(item.type === 'folder') {
            let gHTML = '<div class="d-folder-grid">';
            let mx = item.apps.slice(0, 4);
            mx.forEach(function(a) {
                if(APPS[a]) gHTML += '<img src="' + APPS[a].icon + '">';
            });
            gHTML += '</div>';
            if(!item.hideName) gHTML += '<div class="d-label">' + (item.customName || 'Folder') + '</div>';
            
            d.innerHTML = gHTML;
            d.onclick = function(ev) {
                if(DragSystem.isDragMove) return;
                ev.stopPropagation();
                if(!this.classList.contains('expanded-folder')) {
                    closeAllFolders();
                    expandFolder(this, item, idx);
                }
            };
        } else {
            let a = APPS[item.id];
            if(a) {
                let iSrc = item.customIcon || a.icon;
                let lbl = item.customName || a.title;
                let h = '<img src="' + iSrc + '" class="d-icon">';
                if(!item.hideName) h += '<div class="d-label">' + lbl + '</div>';
                d.innerHTML = h;
                d.ondblclick = function(ev) { ev.stopPropagation(); toggleApp(item.id); };
            }
        }
        
        d.onmousedown = function(ev) {
            ev.stopPropagation();
            if(ev.button === 0) DragSystem.start(ev, d, 'desktop', idx);
        };
        
        d.oncontextmenu = function(ev) {
            ev.preventDefault(); ev.stopPropagation();
            hideAllCtx();
            let m = document.getElementById('app-context-menu');
            if(m) {
                m.style.display = 'block';
                m.style.left = ev.pageX + 'px';
                m.style.top = ev.pageY + 'px';
                m.setAttribute('data-target-idx', idx);
            }
        };
        
        c.appendChild(d);
    });
}

function expandFolder(el, dat, idx) {
    el.classList.add('expanded-folder');
    
    let h = '<div class="folder-header">' + (dat.customName || 'Folder') + ' <i class="fas fa-times" onclick="closeAllFolders(event)"></i></div>';
    h += '<div class="folder-grid-expanded">';
    for(let k=0; k<dat.apps.length; k++) {
        let aId = dat.apps[k];
        let info = APPS[aId];
        if(info) {
            h += '<div class="f-app" onclick="event.stopPropagation(); toggleApp(\'' + aId + '\')"><img src="' + info.icon + '"><span>' + info.title + '</span></div>';
        }
    }
    h += '</div>';
    el.innerHTML = h;
    
    setTimeout(function() {
        let rect = el.getBoundingClientRect();
        let sibs = document.querySelectorAll('.desktop-app:not(.expanded-folder)');
        for(let s=0; s<sibs.length; s++) {
            let sib = sibs[s];
            let sr = sib.getBoundingClientRect();
            if(!(rect.right < sr.left || rect.left > sr.right || rect.bottom < sr.top || rect.top > sr.bottom)) {
                let push = (rect.bottom - sr.top) + 20;
                sib.style.transform = 'translateY(' + push + 'px)';
                sib.setAttribute('data-pushed', 'true');
            }
        }
    }, 50);
}

function closeAllFolders(ev) {
    if(ev) ev.stopPropagation();
    let op = document.querySelectorAll('.expanded-folder');
    if(op.length === 0) return;
    
    for(let i=0; i<op.length; i++) op[i].classList.remove('expanded-folder');
    
    let push = document.querySelectorAll('.desktop-app[data-pushed="true"]');
    for(let j=0; j<push.length; j++) {
        push[j].style.transform = '';
        push[j].removeAttribute('data-pushed');
    }
    setTimeout(loadDesktop, 250);
}

function setupAppContextMenu() {
    let m = document.getElementById('app-context-menu');
    if(!m) return;
    m.innerHTML = `
        <li class="ctx-item" id="ctx-rename" role="menuitem" tabindex="0"><i class="fas fa-edit fa-fw" aria-hidden="true"></i> Rename</li>
        <li class="ctx-item" id="ctx-hidename" role="menuitem" tabindex="0"><i class="fas fa-eye-slash fa-fw" aria-hidden="true"></i> Toggle Name</li>
        <li class="ctx-item" id="ctx-changeicon" role="menuitem" tabindex="0"><i class="fas fa-image fa-fw" aria-hidden="true"></i> Change Icon</li>
        <li class="ctx-separator" role="separator"></li>
        <li class="ctx-item" id="ctx-delete" role="menuitem" tabindex="0"><i class="fas fa-trash fa-fw" style="color:#aaa;" aria-hidden="true"></i> Remove</li>
    `;
    
    document.getElementById('ctx-rename').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        let nm = prompt("Enter new name:", desktopLayout[i].customName || "");
        if(nm !== null) {
            desktopLayout[i].customName = nm.trim() === "" ? "App" : nm;
            saveDesktop();
        }
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-hidename').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        desktopLayout[i].hideName = !desktopLayout[i].hideName;
        saveDesktop();
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-changeicon').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        let url = prompt("Enter image URL for custom icon:");
        if(url) {
            desktopLayout[i].customIcon = url;
            saveDesktop();
        }
        m.style.display = 'none';
    };
    
    document.getElementById('ctx-delete').onclick = function() {
        let i = m.getAttribute('data-target-idx');
        desktopLayout.splice(i, 1);
        saveDesktop();
        m.style.display = 'none';
    };
}

document.addEventListener('contextmenu', function(e) {
    let ids = ['desktop-area', 'windows-layer', 'bg-video', 'bg-img', 'snow-fx', 'right-sidebar'];
    if(ids.includes(e.target.id) || e.target.tagName === 'BODY' || e.target.closest('#right-sidebar')) {
        e.preventDefault();
        hideAllCtx();
        let m = document.getElementById('desktop-context-menu');
        if(m) {
            m.style.display = 'block';
            let x = e.pageX, y = e.pageY;
            if(x + 200 > window.innerWidth) x = window.innerWidth - 200;
            if(y + 100 > window.innerHeight) y = window.innerHeight - 100;
            m.style.left = x + 'px';
            m.style.top = y + 'px';
        }
    }
});

var DragSystem = {
    dragging: false, startPos: {x:0,y:0}, sourceType: null, sourceEl: null,
    idx: null, appId: null, proxy: document.getElementById('drag-proxy'),
    pImg: document.getElementById('proxy-img'), badge: document.getElementById('folder-badge'),
    
    init: function() {
        window.addEventListener('mousemove', e => this.move(e));
        window.addEventListener('mouseup', e => this.end(e));
    },
    
    start: function(e, el, type, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = type; this.sourceEl = el; this.isDragMove = false;
        if(type === 'drawer' || type === 'dock') this.appId = id;
        else if(type === 'desktop') { this.idx = id; this.sourceEl.style.opacity = '0.5'; }
    },
    
    startWinDrag: function(e, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = 'window'; this.sourceEl = document.getElementById('win-' + id);
        this.isDragMove = false;
    },
    
    move: function(e) {
        if(!this.sourceEl) return;
        let dx = Math.abs(e.clientX - this.startPos.x);
        let dy = Math.abs(e.clientY - this.startPos.y);
        
        if(dx > 3 || dy > 3) {
            this.dragging = true; this.isDragMove = true;
            if(this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
                if(this.sourceType === 'drawer') toggleAppDrawer();
                this.proxy.style.display = 'block';
                this.proxy.style.left = (e.clientX - 25) + 'px';
                this.proxy.style.top = (e.clientY - 25) + 'px';
                
                if(this.sourceType === 'drawer' || this.sourceType === 'dock') {
                    if(APPS[this.appId]) this.pImg.src = APPS[this.appId].icon;
                } else {
                    let itm = desktopLayout[this.idx];
                    if(itm.type === 'app') {
                        if(APPS[itm.id]) this.pImg.src = APPS[itm.id].icon;
                    } else {
                        this.pImg.src = '';
                        this.badge.style.display = 'flex';
                        this.badge.innerText = itm.apps.length;
                    }
                }
            }
        }
    },
    
    end: function(e) {
        if(!this.sourceEl) return;
        if(!this.isDragMove && this.sourceType === 'desktop') { this.reset(); return; }
        if(!this.dragging) { this.reset(); return; }
        
        if(this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
            let nx = Math.round((e.clientX - 40) / 90) * 90;
            let ny = Math.round((e.clientY - 40) / 100) * 100;
            
            if(e.clientY > window.innerHeight - 80) {
                if(this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
            } else {
                let tIdx = -1;
                let aAll = document.querySelectorAll('.desktop-app');
                for(let i=0; i<aAll.length; i++) {
                    if(aAll[i] !== this.sourceEl) {
                        let r = aAll[i].getBoundingClientRect();
                        if(e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) tIdx = aAll[i].dataset.idx;
                    }
                }
                
                if(tIdx > -1) {
                    let targ = desktopLayout[tIdx];
                    let drp = (this.sourceType === 'drawer' || this.sourceType === 'dock') ? [this.appId] : (desktopLayout[this.idx].type === 'app' ? [desktopLayout[this.idx].id] : desktopLayout[this.idx].apps);
                    
                    if(targ.type === 'app') {
                        targ.type = 'folder';
                        targ.apps = [targ.id].concat(drp);
                        delete targ.id;
                    } else {
                        targ.apps.push.apply(targ.apps, drp);
                    }
                    if(this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
                } else {
                    if(this.sourceType === 'drawer' || this.sourceType === 'dock') {
                        desktopLayout.push({type: 'app', id: this.appId, x: nx, y: ny});
                    } else {
                        desktopLayout[this.idx].x = nx;
                        desktopLayout[this.idx].y = ny;
                    }
                }
            }
            saveDesktop();
        }
        this.reset();
    },
    
    reset: function() {
        this.dragging = false;
        if(this.sourceEl) this.sourceEl.style.opacity = '1';
        this.sourceEl = null;
        this.proxy.style.display = 'none';
        this.badge.style.display = 'none';
    }
};
DragSystem.init();

window.toggleDesktopSize = function(l) {
    if(l) document.getElementById('desktop-area').classList.add('desktop-large-mode');
    else document.getElementById('desktop-area').classList.remove('desktop-large-mode');
    document.getElementById('desktop-context-menu').style.display = 'none';
};

var unlockedWallpapers = JSON.parse(localStorage.getItem('cine_unlocked_wp')) || ['default'];
window.wpMode = 'both';

function setWallpaper(k, noti=false) {
    let d = wallpaperRegistry[k];
    if(!d) return;
    
    if(noti && d.locked && !unlockedWallpapers.includes(d.id)) {
        unlockedWallpapers.push(d.id);
        localStorage.setItem('cine_unlocked_wp', JSON.stringify(unlockedWallpapers));
        alert("Wallpaper: [ " + d.name + " ] Unlocked.");
    }
    
    if(window.wpMode === 'home' || window.wpMode === 'both') {
        let bV = document.getElementById('bg-video');
        let bI = document.getElementById('bg-img');
        applyMediaToElements(d.url, bV, bI, true);
        updateSysSetting('homeWallpaper', k);
    }
    
    if(window.wpMode === 'lock' || window.wpMode === 'both') {
        let lV = document.getElementById('lock-video');
        let lI = document.getElementById('lock-img');
        applyMediaToElements(d.url, lV, lI, false);
        updateSysSetting('lockWallpaper', k);
    }
    
    updateWallpaperLoop();
    openWallpaperMenu();
}

function openWallpaperMenu() {
    let m = document.getElementById('wallpaper-menu');
    let gu = document.getElementById('wp-grid-unlocked');
    let gl = document.getElementById('wp-grid-locked');
    if(!m) return;
    
    if(m.showModal) m.showModal();
    else m.style.display = 'flex';
    m.classList.add('open');
    
    gu.innerHTML = '';
    gl.innerHTML = '';
    
    for(let k in wallpaperRegistry) {
        let d = wallpaperRegistry[k];
        let ul = !d.locked || unlockedWallpapers.includes(d.id);
        let c = document.createElement('div');
        c.className = "wp-card " + (ul ? "" : "wp-locked");
        
        if(ul) {
            let mHtml = "";
            if(d.url.match(/\.(png|jpg|jpeg|gif)$/i)) mHtml = '<img src="' + d.url + '" alt="wp">';
            else mHtml = '<video src="' + d.url + '" preload="auto" playsinline muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>';
            
            c.innerHTML = mHtml + '<div class="wp-info">' + d.name + '</div>';
            c.setAttribute('data-key', k);
            c.onclick = function() {
                setWallpaper(this.getAttribute('data-key'));
                let crds = document.querySelectorAll('.wp-card');
                for(let j=0; j<crds.length; j++) crds[j].classList.remove('active-wp');
                this.classList.add('active-wp');
            };
            gu.appendChild(c);
        } else {
            c.innerHTML = '<div class="wp-info"><i class="fas fa-lock"></i></div>';
            gl.appendChild(c);
        }
    }
    
    let chk = document.getElementById('wp-loop-chk');
    if(chk) {
        chk.checked = sysConfig.wpLoop;
        chk.onchange = e => updateSysSetting('wpLoop', e.target.checked);
    }
}

var sInp = document.getElementById('start-search-input');
if(sInp) {
    sInp.addEventListener('keydown', function(e) {
        if(e.key === 'Enter') {
            let q = this.value.trim();
            if(wallpaperRegistry[q]) {
                setWallpaper(q, true);
                this.value = "";
                this.blur();
            }
        }
    });
}

function toggleStartMenu() {
    let sm = document.getElementById('start-menu');
    if(sm.classList.contains('open')) {
        sm.classList.remove('open');
        setTimeout(function(){ sm.style.display='none'; }, 300);
    } else {
        sm.style.display = 'flex';
        setTimeout(function(){ sm.classList.add('open'); }, 10);
    }
}

document.addEventListener('click', function(e) {
    let sm = document.getElementById('start-menu');
    if(sm && !sm.contains(e.target) && !e.target.closest('.dock-item')) {
        sm.classList.remove('open');
        setTimeout(function(){ sm.style.display='none'; }, 300);
    }
});

var cvsSnow = document.getElementById('snow-fx');
if(cvsSnow) {
    var ctxSnow = cvsSnow.getContext('2d');
    var sW = window.innerWidth, sH = window.innerHeight;
    cvsSnow.width = sW; cvsSnow.height = sH;
    
    var flakes = [];
    for(var f=0; f<30; f++) flakes.push({x: Math.random()*sW, y: Math.random()*sH, r: Math.random()*2, s: Math.random()+0.5});
    
    function drawSnow() {
        if(isDesktopActive) {
            ctxSnow.clearRect(0, 0, sW, sH);
            ctxSnow.fillStyle = "rgba(255,255,255,0.3)";
            for(let i=0; i<flakes.length; i++) {
                let fl = flakes[i];
                ctxSnow.beginPath();
                ctxSnow.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
                ctxSnow.fill();
                fl.y += fl.s;
                if(fl.y > sH) fl.y = 0;
            }
        }
        requestAnimationFrame(drawSnow);
    }
    drawSnow();
}

var MODES = ['FAST', 'THINKING', 'LIVE'];
var cMode = 0;
var isCiriActive = false;
var holdTimer = null;
var hasBootCiri = false;
var expectKey = false;
var sStream = null;
var cImgB64 = null;
var cImgMime = null;

function checkApiKey() {
    let st = document.getElementById('status-text');
    let si = document.getElementById('status-icon');
    if(!st) return;
    if(localStorage.getItem('ciri_key')) {
        st.textContent = "Secure"; st.className = "secure";
        si.innerHTML = '<svg class="secure-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>';
    } else {
        st.textContent = "Unstable"; st.className = "unstable";
        si.innerHTML = '<svg class="unstable-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    }
}
checkApiKey();

window.autoGrow = function(el) { el.style.height = "5px"; el.style.height = (el.scrollHeight) + "px"; };

window.addEventListener('keydown', function(e) {
    if(e.altKey && (e.code === 'KeyS' || e.key.toLowerCase() === 's')) {
        if(!holdTimer && !isCiriActive) {
            holdTimer = setTimeout(function() {
                document.body.classList.add('ciri-active');
                isCiriActive = true;
                let cInp = document.getElementById('chat-input');
                if(!hasBootCiri) {
                    let bs = document.getElementById('ciri-boot-screen');
                    if(bs) bs.style.display = 'flex';
                    setTimeout(function(){ document.getElementById('boot-ciri-text').classList.add('typing'); }, 300);
                    setTimeout(function(){ document.getElementById('boot-sub-text').classList.add('show'); }, 1100);
                    setTimeout(function() {
                        document.getElementById('boot-loader').style.opacity = '1';
                        setTimeout(function() {
                            document.getElementById('boot-status-text').textContent = "Connection Established.";
                            document.getElementById('boot-spinner').style.display = 'none';
                            setTimeout(function() {
                                bs.style.filter = 'blur(10px)'; bs.style.opacity = '0';
                                setTimeout(function() {
                                    bs.style.display = 'none';
                                    hasBootCiri = true;
                                    if(cInp) cInp.focus();
                                }, 800);
                            }, 1800);
                        }, 1000);
                    }, 2200);
                } else {
                    setTimeout(function(){ if(cInp) cInp.focus(); }, 100);
                }
            }, 2000);
        }
    } else if(e.code === 'Escape' && isCiriActive) {
        closeCiri();
    }
});

window.addEventListener('keyup', function(e) {
    if(e.code === 'KeyS' || e.key.toLowerCase() === 's' || e.key === 'Alt') {
        clearTimeout(holdTimer); holdTimer = null;
    }
});

window.closeCiri = function() {
    document.body.classList.remove('ciri-active');
    isCiriActive = false;
};

var aMedia = null;
var nHide;
var cNoti = document.getElementById('cine-noti');

function showNoti() {
    if(!cNoti) return;
    cNoti.classList.add('active'); cNoti.classList.remove('minimized');
    let rb = document.getElementById('restore-btn');
    if(rb) rb.classList.remove('visible');
    resetNH();
}

function hideNoti() {
    if(!cNoti) return;
    cNoti.classList.remove('active'); cNoti.classList.remove('minimized');
    let rb = document.getElementById('restore-btn');
    if(rb) rb.classList.remove('visible');
    clearTimeout(nHide);
}

function resetNH() {
    clearTimeout(nHide);
    if(cNoti && cNoti.classList.contains('active') && !cNoti.classList.contains('minimized')) {
        nHide = setTimeout(function() {
            cNoti.classList.add('minimized');
            setTimeout(function(){ let rb = document.getElementById('restore-btn'); if(rb) rb.classList.add('visible'); }, 300);
        }, 5000);
    }
}

if(cNoti) {
    cNoti.addEventListener('mouseenter', function(){ clearTimeout(nHide); });
    cNoti.addEventListener('mouseleave', resetNH);
    let mn = document.getElementById('minimize-noti-btn');
    if(mn) mn.onclick = function() {
        cNoti.classList.add('minimized');
        setTimeout(function(){ let rb = document.getElementById('restore-btn'); if(rb) rb.classList.add('visible'); }, 300);
    };
    let rbtn = document.getElementById('restore-btn');
    if(rbtn) rbtn.onclick = function() {
        this.classList.remove('visible');
        cNoti.classList.remove('minimized');
        resetNH();
    };
    let clbtn = document.getElementById('close-noti-btn');
    if(clbtn) clbtn.onclick = function() {
        if(aMedia) aMedia.pause();
        hideNoti();
    };
}

setInterval(function() {
    let fnd = null;
    let md = document.querySelectorAll('audio, video');
    for(let i=0; i<md.length; i++) {
        let m = md[i];
        if(!m.paused && !m.muted && m.volume > 0 && !['bg-video', 'lock-video', 'boot-video'].includes(m.id)) fnd = m;
    }
    
    let ifr = document.querySelectorAll('iframe');
    for(let j=0; j<ifr.length; j++) {
        try {
            let idc = ifr[j].contentDocument || ifr[j].contentWindow.document;
            if(idc) {
                let imd = idc.querySelectorAll('audio, video');
                for(let k=0; k<imd.length; k++) {
                    if(!imd[k].paused && !imd[k].muted && imd[k].volume > 0) fnd = imd[k];
                }
            }
        } catch(e) {}
    }
    
    isMediaPlaying = !!fnd;
    if(fnd !== aMedia) {
        if(fnd) { aMedia = fnd; setupM(); showNoti(); }
        else { aMedia = null; hideNoti(); }
    }
    
    if(aMedia) {
        let ct = document.getElementById('current-time');
        if(ct) ct.textContent = fmtT(aMedia.currentTime);
        if(isFinite(aMedia.duration) && aMedia.duration > 0) {
            let pf = document.getElementById('progress-fill');
            if(pf) pf.style.width = ((aMedia.currentTime / aMedia.duration) * 100) + "%";
            let tt = document.getElementById('total-time');
            if(tt) tt.textContent = fmtT(aMedia.duration);
        }
    }
}, 1000);

function setupM() {
    if(!aMedia) return;
    let nt = document.getElementById('noti-title');
    if(nt) nt.innerText = aMedia.title || "Web Media Playing";
    
    let pp = document.getElementById('play-pause');
    if(pp) pp.onclick = function() { aMedia.paused ? aMedia.play() : aMedia.pause(); resetNH(); };
    
    aMedia.addEventListener('play', function() {
        let iPl = document.getElementById('icon-play');
        let iPa = document.getElementById('icon-pause');
        if(iPl) iPl.classList.add('hidden-svg');
        if(iPa) iPa.classList.add('visible-svg');
        showNoti();
    });
    
    aMedia.addEventListener('pause', function() {
        let iPl = document.getElementById('icon-play');
        let iPa = document.getElementById('icon-pause');
        if(iPl) { iPl.classList.remove('hidden-svg'); iPl.classList.add('visible-svg'); }
        if(iPa) { iPa.classList.remove('visible-svg'); iPa.classList.add('hidden-svg'); }
    });
    
    let sb = document.getElementById('skip-back');
    if(sb) sb.onclick = function() { if(isFinite(aMedia.currentTime)) aMedia.currentTime = Math.max(0, aMedia.currentTime - 15); resetNH(); };
    
    let sf = document.getElementById('skip-forward');
    if(sf) sf.onclick = function() { if(isFinite(aMedia.duration) && aMedia.duration > 0) aMedia.currentTime = Math.min(aMedia.duration, aMedia.currentTime + 15); resetNH(); };
    
    let pha = document.getElementById('progress-hit-area');
    if(pha) pha.onclick = function(e) {
        if(isFinite(aMedia.duration) && aMedia.duration > 0) {
            let r = this.getBoundingClientRect();
            let p = (e.clientX - r.left) / r.width;
            aMedia.currentTime = p * aMedia.duration;
        }
        resetNH();
    };
}

function fmtT(s) {
    if(isNaN(s) || !isFinite(s)) return "0:00";
    let m = Math.floor(s / 60);
    let se = Math.floor(s % 60);
    return m + ":" + se.toString().padStart(2, '0');
}

function drawFV() {
    requestAnimationFrame(drawFV);
    let cv = document.getElementById('visualizer');
    if(!cv) return;
    let cx = cv.getContext('2d');
    
    cv.width = cv.parentElement.clientWidth;
    cv.height = 14;
    
    let bL = 32;
    cx.clearRect(0, 0, cv.width, cv.height);
    let bW = (cv.width / bL) * 2;
    let xP = 0;
    
    for(let i=0; i<bL; i++) {
        let bH = aMedia && !aMedia.paused ? (Math.random() * cv.height) : 2;
        cx.fillStyle = "#fff";
        cx.beginPath();
        cx.roundRect(xP, cv.height - bH, bW - 1.5, bH, 2);
        cx.fill();
        xP += bW;
    }
}
drawFV();

var fLT = performance.now();
var fFr = 0;
var fLC = 0;

function chkFps() {
    let nw = performance.now();
    fFr++;
    if(nw - fLT >= 1000) {
        let cFps = fFr;
        let fv = document.getElementById('fps-val');
        if(fv) fv.innerText = cFps;

        if(cFps <= 20) {
            fLC++;
            if(fLC >= 5 && !sysConfig.optBg) {
                sysConfig.optBg = true;
                localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
                let bv = document.getElementById('bg-video');
                let lv = document.getElementById('lock-video');
                if(bv) bv.pause();
                if(lv) lv.pause();
                showNotification("System Optimized", "Low FPS detected. Backgrounds paused.");
            }
        } else {
            fLC = 0;
        }
        
        fFr = 0;
        fLT = nw;
    }
    requestAnimationFrame(chkFps);
}
requestAnimationFrame(chkFps);
