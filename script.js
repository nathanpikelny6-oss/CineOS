// ==========================================
// SYSTEM CONFIGURATION & STATE
// ==========================================
const APPS = {
    'cine':     { title: 'CINE // HUB', path: 'script/Apps/Cine/index.html', icon: 'https://cdn.worldvectorlogo.com/logos/netflix-logo-icon.svg' },
    'term':     { title: 'Spotify', path: 'script/Apps/Spotify/index.html', icon: 'https://cdn.pixabay.com/photo/2016/10/22/00/15/spotify-1759471_1280.jpg' },
    'files':    { title: 'PS5 Emu', path: 'script/Apps/Ps5/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OeL_be7RFaoHi3PswkuAR5XcMgBNRDynsg&s' },
    'web':      { title: 'Cine-Web', path: 'script/Apps/Web/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeD89ZcX5W1FBtal7RerasT27q-OmZqnBixQ&s' },
    'settings': { title: 'CONFIG', internal: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-apple-settings-icon-svg-download-png-493162.png' },
    'discord':  { title: 'Discord', path: 'https://discord.com/app', icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png' }
};

const DOCK_APPS = ['web', 'files', 'settings', 'cine', 'term'];
const PINNED_APPS = ['web', 'files', 'settings', 'cine', 'term'];

// OS Data Config
var sysConfig = JSON.parse(localStorage.getItem('cine_sys_config')) || {
    optBg: false, shortBoot: false, panicKey: '`', 
    homeWallpaper: 'Default', lockWallpaper: 'green', cloak: 'none', iconSize: 'normal'
};

if(!sysConfig.panicKey) sysConfig.panicKey = '`';
if(!sysConfig.homeWallpaper) sysConfig.homeWallpaper = 'Default';
if(!sysConfig.lockWallpaper) sysConfig.lockWallpaper = 'green';
if(!sysConfig.iconSize) sysConfig.iconSize = 'normal';

// Desktop Items State (Apps & Folders)
let desktopItems = JSON.parse(localStorage.getItem('cine_desktop_items_v3')) || [];

window.updateSysSetting = function(k,v) {
    sysConfig[k] = v;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    if(k === 'optBg') applySystemSettings();
};

const cloaks = {
    none: {title:"Cine-OS", icon:""},
    google: {title:"Google", icon:"https://www.google.com/favicon.ico"},
    drive: {title:"My Drive - Google Drive", icon:"https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png"},
    canvas: {title:"Dashboard", icon:"https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico"},
    classroom: {title:"Classes", icon:"https://ssl.gstatic.com/classroom/favicon.png"}
};

window.updateCloak = function(k) {
    sysConfig.cloak = k;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    applyCloak();
};

function applyCloak() {
    let k = sysConfig.cloak || 'none';
    let c = cloaks[k];
    let e = document.querySelectorAll("link[rel*='icon']");
    e.forEach(l => l.remove());
    if (c && k !== 'none') {
        document.title = c.title;
        let l = document.createElement('link');
        l.type = 'image/x-icon'; l.rel = 'shortcut icon'; l.href = c.icon;
        document.getElementsByTagName('head')[0].appendChild(l);
    } else {
        document.title = "Cine-OS";
    }
}
setInterval(applyCloak, 2000);

// Utilities
window.downloadLocally = function() {
    var a = document.createElement('a');
    var f = new Blob([document.getElementById('secret-html-payload').value], {type:'text/html'});
    a.href = URL.createObjectURL(f); a.download = 'CineOS.html'; a.click();
};
window.openAboutBlank = function() {
    var w = window.open('about:blank','_blank');
    if(w){ w.document.open(); w.document.write(document.getElementById('secret-html-payload').value); w.document.close(); }
};

function applySystemSettings() {
    var b = document.getElementById('bg-video');
    if (b) {
        if (sysConfig.optBg) {
            b.removeAttribute('autoplay'); b.removeAttribute('loop'); b.pause(); b.currentTime = 0;
        } else if (!document.getElementById('lock-screen').classList.contains('active')) {
            b.setAttribute('autoplay','true'); b.setAttribute('loop','true'); b.play().catch(e=>console.log(e));
        }
    }
}

// Icon Size Setting
window.setDesktopIconSize = function(size) {
    sysConfig.iconSize = size;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    if (size === 'large') document.body.classList.add('large-icons');
    else document.body.classList.remove('large-icons');
};

let isDesktopActive = false;

// ==========================================
// INITIALIZATION & MOBILE CHECK
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    // Mobile Check
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) document.getElementById('mobile-warning-overlay').style.display = 'flex';

    applyCloak();
    setDesktopIconSize(sysConfig.iconSize);
    renderUI();
    renderDesktopItems();
    initWallpapers();
    document.getElementById('boot-layer').style.display = 'flex';
});

window.dismissMobileWarning = function() {
    document.getElementById('mobile-warning-overlay').style.display = 'none';
};

// ==========================================
// UI RENDERING
// ==========================================
function renderUI() {
    var dc = document.getElementById('dock-container');
    dc.innerHTML = `
        <div class="dock-item" onclick="toggleStartMenu()"><img src="https://missionsupport.archden.org/wp-content/uploads/2022/02/windows11-icon.png"></div>
        <div class="dock-sep"></div>
        <div class="dock-item" onclick="toggleAppDrawer()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg>
        </div>
        <div class="dock-sep"></div>
    `;
    DOCK_APPS.forEach(id => {
        if(APPS[id]) {
            let el = document.createElement('div');
            el.className = 'dock-item';
            el.dataset.id = id;
            el.innerHTML = `<img src="${APPS[id].icon}">`;
            el.onclick = () => toggleApp(id);
            el.onmousedown = (e) => DragSystem.start(e, el, 'dock', id);
            dc.appendChild(el);
        }
    });

    var pg = document.getElementById('pinned-grid');
    pg.innerHTML = '';
    PINNED_APPS.forEach(id => {
        if(APPS[id]) pg.innerHTML += `<div class="pinned-item" onclick="toggleApp('${id}')"><img src="${APPS[id].icon}"><span>${APPS[id].title}</span></div>`;
    });
    populateDrawer();
}

// ==========================================
// BOOT & IDLE MANAGEMENT
// ==========================================
let bootActive = true; let enterCount = 0;
document.addEventListener('keydown', e => {
    if (bootActive && e.key === 'Enter' && document.getElementById('boot-layer').style.display !== 'none') {
        enterCount++;
        if (enterCount >= 2) skipBootSequence();
        setTimeout(() => { enterCount = 0; }, 500);
    }
    if (e.key && sysConfig.panicKey && e.key.toLowerCase() === sysConfig.panicKey.toLowerCase()) {
        window.location.href = "https://google.com";
    }
});

function startBootSequence() {
    var c = document.getElementById('boot-content');
    var b = document.getElementById('boot-video');
    c.style.display = 'none'; b.style.display = 'block';
    b.muted = false; b.volume = 1.0;
    if (sysConfig.shortBoot) { b.src = "Videos/QuickBoot.mp4"; b.load(); }
    b.play().catch(() => { b.muted = true; b.play(); });
    b.onended = () => { if (bootActive) skipBootSequence(); };
}

function skipBootSequence() {
    if (!bootActive) return;
    bootActive = false;
    var l = document.getElementById('boot-layer');
    var b = document.getElementById('boot-video');
    if (b) b.pause();
    if (l) {
        l.style.opacity = '0';
        document.getElementById('lock-screen').classList.add('active');
        var lV = document.getElementById('lock-video');
        lV.play().catch(e => console.log(e));
        setTimeout(() => { l.style.display = 'none'; }, 600);
        updateClock();
    }
}

let welcomeShown = false;
window.unlockSystem = function() {
    var s = document.getElementById('lock-screen');
    s.classList.add('slide-up');
    setTimeout(() => {
        s.classList.remove('active');
        isDesktopActive = true;
        document.getElementById('lock-video').pause();
        if (!sysConfig.optBg) document.getElementById('bg-video').play().catch(e=>console.log(e)); 
        if (!welcomeShown) {
            showNotification("Welcome To Cine V2", "If you are having problems report it in the DC, Or check out our FAQ in settings!"); 
            welcomeShown = true;
        }
    }, 600);
    resetIdle();
};

function updateClock() {
    var n = new Date();
    var d = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var m = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var hrs = n.getHours();
    var gr = 'GOOD EVENING';
    if(hrs < 12) gr = 'GOOD MORNING'; else if(hrs < 18) gr = 'GOOD AFTERNOON';
    
    var lG = document.getElementById('lock-greet'); if(lG) lG.innerText = gr;
    var h12 = hrs % 12 || 12; var ampm = hrs >= 12 ? 'PM' : 'AM';
    var min = n.getMinutes().toString().padStart(2,'0');
    
    var lT = document.getElementById('lock-time'); if(lT) lT.innerText = `${h12}:${min} ${ampm}`;
    var fM = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    var lD = document.getElementById('lock-date'); if(lD) lD.innerText = `${n.getDate().toString().padStart(2,'0')} ${fM[n.getMonth()]}`;
    var dL = document.getElementById('lock-day-large'); if(dL) dL.innerText = d[n.getDay()];
    var hd = document.getElementById('lbl-day'); if(hd) hd.innerText = d[n.getDay()];
}
setInterval(updateClock, 1000);

let idleTime = 0;
function resetIdle() { idleTime = 0; }
document.addEventListener('mousemove', resetIdle);
document.addEventListener('keypress', resetIdle);
document.addEventListener('click', resetIdle);

function isMediaPlaying() {
    if (navigator.mediaSession && navigator.mediaSession.playbackState === 'playing') return true;
    const mediaElements = document.querySelectorAll('video, audio');
    for (let i = 0; i < mediaElements.length; i++) {
        if (!mediaElements[i].paused && !mediaElements[i].muted && mediaElements[i].volume > 0) return true;
    }
    // Deep check in iframes if accessible
    const frames = document.querySelectorAll('iframe');
    for(let i=0; i<frames.length; i++) {
        try {
            const innerMedia = frames[i].contentDocument.querySelectorAll('video, audio');
            for(let j=0; j<innerMedia.length; j++) {
                if(!innerMedia[j].paused && innerMedia[j].volume > 0) return true;
            }
        } catch(e) { /* Ignore Cross-Origin Blocks */ }
    }
    return false;
}

setInterval(() => {
    if(isMediaPlaying()) resetIdle(); // Block idle timeout if sound/video is active

    idleTime++;
    var s = document.getElementById('lock-screen');
    if (idleTime >= 180 && !s.classList.contains('active') && !bootActive) {
        isDesktopActive = false;
        s.classList.remove('slide-up');
        s.classList.add('active');
        document.getElementById('bg-video').pause();
        document.getElementById('lock-video').play().catch(e=>console.log(e));
    }
}, 1000);

// ==========================================
// WINDOW & APP MANAGEMENT
// ==========================================
let activeWindowId = null;

function toggleApp(id) {
    var w = document.getElementById(`win-${id}`);
    if (w) {
        if (w.classList.contains('minimized')) {
            w.classList.remove('minimized');
            bringToFront(id);
        } else if (activeWindowId === id) {
            minimizeWindow(id);
        } else {
            bringToFront(id);
        }
    } else {
        openWindow(id);
    }
}

function bringToFront(id) {
    if(activeWindowId && activeWindowId !== id) {
        var aw = document.getElementById(`win-${activeWindowId}`);
        if(aw) aw.style.zIndex = 499;
    }
    var w = document.getElementById(`win-${id}`);
    if(w) {
        w.style.zIndex = 500;
        w.classList.add('active');
        activeWindowId = id;
        startImmersiveMode(w);
    }
}

function openWindow(id) {
    var sm = document.getElementById('start-menu');
    if (sm) { sm.classList.remove('open'); setTimeout(() => sm.style.display = 'none', 300); }
    
    var l = document.getElementById('windows-layer');
    var d = APPS[id] || {title: 'APP', path: 'about:blank'};
    
    var w = document.createElement('div');
    w.id = `win-${id}`;
    w.className = 'window active header-visible';
    w.style.zIndex = 500;
    
    var ih = d.internal ? `<iframe id="frame-${id}"></iframe>` : `<iframe id="frame-${id}" src="${d.path}"></iframe>`;
    
    w.innerHTML = `
        <div class="win-header" onmousedown="DragSystem.startWinDrag(event, '${id}')">
            <div class="win-title">${d.title}</div>
            <div class="win-controls">
                <div class="win-btn btn-min" onclick="minimizeWindow('${id}')"></div>
                <div class="win-btn btn-close" onclick="closeWindow('${id}')"></div>
            </div>
        </div>
        <div class="win-body">${ih}</div>
    `;
    
    l.appendChild(w);
    
    if (d.internal) {
        var t = document.getElementById(`code-${id}`);
        var f = document.getElementById(`frame-${id}`);
        if (t && f) {
            var dc = f.contentWindow.document;
            dc.open(); dc.write(t.innerHTML); dc.close();
        }
    }
    
    if(activeWindowId) {
        var aw = document.getElementById(`win-${activeWindowId}`);
        if(aw) aw.style.zIndex = 499;
    }
    activeWindowId = id;
    startImmersiveMode(w);
}

window.minimizeWindow = function(id) {
    var w = document.getElementById(`win-${id}`);
    if (w) {
        w.classList.add('minimized');
        w.classList.remove('active');
        if(activeWindowId === id) activeWindowId = null;
        endImmersiveMode();
    }
};

window.closeWindow = function(id) {
    var w = document.getElementById(`win-${id}`);
    if (w) w.remove();
    if (activeWindowId === id) activeWindowId = null;
    endImmersiveMode();
};

function startImmersiveMode(w) {
    document.getElementById('dock-container').classList.add('dock-hidden');
    w.classList.remove('header-visible');
}

function endImmersiveMode() {
    var wl = document.getElementById('windows-layer');
    var hasActive = Array.from(wl.children).some(el => !el.classList.contains('minimized'));
    if (!hasActive) {
        document.getElementById('dock-container').classList.remove('dock-hidden');
    }
}

document.getElementById('top-trigger').addEventListener('mouseenter', () => {
    if (activeWindowId) {
        var w = document.getElementById(`win-${activeWindowId}`);
        if (w) w.classList.add('header-visible');
    }
});

document.addEventListener('mouseover', e => {
    if (e.target.closest('.win-header')) {
        if (activeWindowId) document.getElementById(`win-${activeWindowId}`).classList.add('header-visible');
    } else if (activeWindowId && !e.target.closest('#top-trigger')) {
        var w = document.getElementById(`win-${activeWindowId}`);
        if (w) w.classList.remove('header-visible');
    }
});

function showNotification(title, message, duration = 8000) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <div class="toast-header">
            <div class="toast-app-info"><div class="toast-icon"><i class="fas fa-user-astronaut"></i></div><span>Cine (Owner)</span></div>
            <i class="fas fa-times toast-close"></i>
        </div>
        <div class="toast-title">${title}</div>
        <div class="toast-body">${message}</div>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    const closeToast = () => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); };
    toast.onclick = closeToast;
    setTimeout(closeToast, duration);
}

// ==========================================
// DESKTOP & FOLDER RENDERING
// ==========================================
function saveDesktopItems() {
    localStorage.setItem('cine_desktop_items_v3', JSON.stringify(desktopItems));
    renderDesktopItems();
}

function renderDesktopItems() {
    // Clear current icons
    document.querySelectorAll('.desktop-app, .folder-app').forEach(e => e.remove());
    
    desktopItems.forEach(item => {
        let el = document.createElement('div');
        el.style.left = item.x + 'px';
        el.style.top = item.y + 'px';
        el.dataset.uuid = item.uuid;
        
        if (item.type === 'app') {
            el.className = 'desktop-app';
            let appData = APPS[item.id] || {title:'Unknown', icon:''};
            el.innerHTML = `<img src="${appData.icon}" class="d-icon"><div class="d-label">${appData.title}</div>`;
            el.onclick = () => toggleApp(item.id);
        } else if (item.type === 'folder') {
            el.className = 'folder-app';
            let innerIcons = item.apps.slice(0, 4).map(appId => {
                let ico = APPS[appId] ? APPS[appId].icon : '';
                return `<img src="${ico}">`;
            }).join('');
            el.innerHTML = `<div class="folder-icon-grid">${innerIcons}</div><div class="d-label">Folder</div>`;
            el.onclick = () => openFolderView(item.uuid);
        }

        // Bind Drag
        el.onmousedown = (e) => {
            e.stopPropagation();
            DragSystem.start(e, el, item.type, item.uuid); // pass uuid as dragId
        };
        
        document.getElementById('desktop-area').appendChild(el);
    });
}

// Folder View Logic
window.openFolderView = function(uuid) {
    let folder = desktopItems.find(i => i.uuid === uuid);
    if(!folder) return;
    
    let grid = document.getElementById('folder-view-grid');
    grid.innerHTML = '';
    
    folder.apps.forEach(appId => {
        let a = APPS[appId];
        if(a) {
            let d = document.createElement('div');
            d.className = 'folder-view-item';
            d.innerHTML = `<img src="${a.icon}"><span>${a.title}</span>`;
            d.onclick = (e) => {
                e.stopPropagation();
                toggleApp(appId);
                closeFolderView();
            };
            grid.appendChild(d);
        }
    });
    document.getElementById('folder-view-overlay').style.display = 'flex';
    setTimeout(() => document.getElementById('folder-view-overlay').classList.add('active'), 10);
};

window.closeFolderView = function(e) {
    if(e && e.target.closest('#folder-view-container')) return; // Ignore clicks inside box
    let ov = document.getElementById('folder-view-overlay');
    ov.classList.remove('active');
    setTimeout(() => ov.style.display = 'none', 300);
};

// ==========================================
// DRAG & DROP SYSTEM (Grid & Folders)
// ==========================================
const GRID_SIZE = 110; 
function snapToGrid(x, y) {
    let nx = Math.round(x / GRID_SIZE) * GRID_SIZE + 20;
    let ny = Math.round(y / GRID_SIZE) * GRID_SIZE + 20;
    return { x: nx, y: ny };
}

function checkCollision(x, y, ignoreUuid) {
    return desktopItems.find(item => {
        if(item.uuid === ignoreUuid) return false;
        return Math.abs(item.x - x) < 60 && Math.abs(item.y - y) < 60;
    });
}

function generateUUID() { return 'id_' + Math.random().toString(36).substr(2, 9); }

const DragSystem = {
    dragging: false, startPos: {x:0, y:0},
    sourceType: null, dragId: null, sourceEl: null,
    proxy: document.getElementById('drag-proxy'),
    proxyImg: document.getElementById('proxy-img'),

    init() {
        window.addEventListener('mousemove', e => this.move(e));
        window.addEventListener('mouseup', e => this.end(e));
    },

    start(e, el, type, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = type;
        this.sourceEl = el;
        this.dragId = id; // if dock -> appId, if desktop -> uuid, if window -> winId
        this.isDragMove = false;
    },

    startWinDrag(e, id) {
        this.start(e, document.getElementById(`win-${id}`), 'window', id);
    },

    move(e) {
        if (!this.sourceEl) return;
        var dx = Math.abs(e.clientX - this.startPos.x), dy = Math.abs(e.clientY - this.startPos.y);
        
        if (dx > 4 || dy > 4) {
            this.dragging = true; this.isDragMove = true;
            
            if (this.sourceType === 'window') return; // Windows move themselves via native logic (or we implement it)

            // Show proxy for icons
            if (this.sourceType === 'dock' || this.sourceType === 'app' || this.sourceType === 'folder') {
                this.proxy.style.display = 'block';
                this.proxy.style.left = (e.clientX - 25) + 'px';
                this.proxy.style.top = (e.clientY - 25) + 'px';
                
                if(this.sourceType === 'folder') {
                    // Just show a generic folder or cloned grid
                    this.proxy.innerHTML = `<div class="folder-icon-grid" style="width:50px;height:50px;background:rgba(50,50,50,0.8);border-radius:12px;"></div>`;
                } else {
                    let appData = this.sourceType === 'dock' ? APPS[this.dragId] : APPS[desktopItems.find(i=>i.uuid===this.dragId)?.id];
                    this.proxy.innerHTML = `<img src="${appData ? appData.icon : ''}" style="width:100%;height:100%;border-radius:12px;object-fit:contain;">`;
                }
                
                if(this.sourceType !== 'dock') this.sourceEl.style.opacity = '0.3';
            }
        }
    },

    end(e) {
        if (!this.sourceEl) return;
        
        // Handle Clicks (No drag movement)
        if (!this.isDragMove) {
            this.reset();
            return;
        }

        if (this.sourceType === 'window') {
            // Window drag logic could go here if implemented, but we rely on bounding
            this.reset(); return;
        }

        if (this.dragging) {
            let dropY = e.clientY;
            let dropX = e.clientX;
            let isOverDock = dropY > window.innerHeight - 80;

            if (this.sourceType === 'dock') {
                if (!isOverDock) {
                    let snapped = snapToGrid(dropX - 40, dropY - 40);
                    desktopItems.push({ type: 'app', id: this.dragId, uuid: generateUUID(), x: snapped.x, y: snapped.y });
                    saveDesktopItems();
                }
            } 
            else if (this.sourceType === 'app' || this.sourceType === 'folder') {
                let itemIndex = desktopItems.findIndex(i => i.uuid === this.dragId);
                let item = desktopItems[itemIndex];

                if (isOverDock) {
                    // Delete from desktop
                    desktopItems.splice(itemIndex, 1);
                } else {
                    let snapped = snapToGrid(dropX - 40, dropY - 40);
                    let target = checkCollision(snapped.x, snapped.y, this.dragId);

                    if (target) {
                        // Merge logic
                        if (target.type === 'app' && item.type === 'app') {
                            // Convert target to folder
                            target.type = 'folder';
                            target.apps = [target.id, item.id];
                            delete target.id;
                            desktopItems.splice(itemIndex, 1); // remove dragged item
                        } 
                        else if (target.type === 'folder' && item.type === 'app') {
                            if(!target.apps.includes(item.id)) target.apps.push(item.id);
                            desktopItems.splice(itemIndex, 1);
                        }
                        else if (target.type === 'app' && item.type === 'folder') {
                            if(!item.apps.includes(target.id)) item.apps.push(target.id);
                            item.x = target.x; item.y = target.y; // take target position
                            desktopItems = desktopItems.filter(i => i.uuid !== target.uuid); // remove target
                        }
                        else if (target.type === 'folder' && item.type === 'folder') {
                            target.apps = [...new Set([...target.apps, ...item.apps])];
                            desktopItems.splice(itemIndex, 1);
                        }
                    } else {
                        // Normal move
                        item.x = snapped.x; item.y = snapped.y;
                    }
                }
                saveDesktopItems();
            }
        }
        this.reset();
    },

    reset() {
        this.dragging = false; 
        if(this.sourceEl) this.sourceEl.style.opacity = '1';
        this.sourceEl = null; 
        this.proxy.style.display = 'none';
        this.proxy.innerHTML = '';
    }
};
DragSystem.init();

// ==========================================
// DRAWER, MENU & WALLPAPERS
// ==========================================
function populateDrawer() {
    var dg = document.getElementById('drawer-grid'); dg.innerHTML = '';
    for (var key in APPS) {
        var a = APPS[key];
        var d = document.createElement('div');
        d.className = 'drawer-item';
        d.onclick = (function(k){ return function(){ toggleApp(k); toggleAppDrawer(); }})(key);
        d.innerHTML = `<img src="${a.icon}"><span>${a.title}</span>`;
        dg.appendChild(d);
    }
}

window.filterDrawer = function(v) {
    var items = document.querySelectorAll('.drawer-item'); v = v.toLowerCase();
    items.forEach(i => {
        if(i.innerText.toLowerCase().includes(v)) i.style.display = 'flex'; else i.style.display = 'none';
    });
};

window.toggleAppDrawer = function() {
    var d = document.getElementById('app-drawer');
    if (d.classList.contains('open')) {
        d.classList.remove('open'); setTimeout(() => d.style.display = 'none', 300);
    } else {
        d.style.display = 'block'; setTimeout(() => d.classList.add('open'), 10);
    }
};

window.toggleStartMenu = function() {
    var s = document.getElementById('start-menu');
    if(s.classList.contains('open')){
        s.classList.remove('open'); setTimeout(()=>s.style.display='none',300);
    } else {
        s.style.display='flex'; setTimeout(()=>s.classList.add('open'),10);
    }
};

document.addEventListener('click', e => {
    var s = document.getElementById('start-menu');
    if(s && !s.contains(e.target) && !e.target.closest('.dock-item')){
        s.classList.remove('open'); setTimeout(()=>s.style.display='none',300);
    }
});

var ctxSnow = document.getElementById('snow-fx').getContext('2d');
var sw = window.innerWidth, sh = window.innerHeight;
document.getElementById('snow-fx').width = sw; document.getElementById('snow-fx').height = sh;
var flakes = Array.from({length:30}, () => ({x:Math.random()*sw, y:Math.random()*sh, r:Math.random()*2, s:Math.random()+0.5}));

function drawSnow() {
    if (isDesktopActive) {
        ctxSnow.clearRect(0,0,sw,sh);
        ctxSnow.fillStyle = "rgba(255,255,255,0.3)";
        flakes.forEach(f => {
            ctxSnow.beginPath(); ctxSnow.arc(f.x, f.y, f.r, 0, Math.PI*2); ctxSnow.fill();
            f.y += f.s; if(f.y > sh) f.y = 0;
        });
    }
    requestAnimationFrame(drawSnow);
} drawSnow();

const wallpaperRegistry = {
    "Default": {id:"Default", name:"Snake Skeleton", url:"Videos/default.mp4", loop:true, locked:false},
    "green": {id:"green", name:"Green Anime", url:"Videos/green.mp4", loop:true, locked:false},
    "#33A56": {id:"hunt_trait", name:"Hunt Showdown", url:"Videos/33A56.mp4", loop:false, locked:true},
    "#Minecraft01": {id:"Tree", name:"Tree Of Life", url:"Videos/Minecraft01.mp4", loop:true, locked:true},
    "#45E33": {id:"SnowFall", name:"Snow Fall", url:"Videos/45E33.mp4", loop:true, locked:true},
    "#Minecraft02": {id:"Minecraft02", name:"Sakura Pond", url:"Videos/Minecraft02.mp4", loop:true, locked:true},
    "#Minecraft03": {id:"Minecraft03", name:"Minecraft Paradise", url:"Videos/Minecraft03.mp4", loop:true, locked:true}
};
let unlockedWallpapers = JSON.parse(localStorage.getItem('cine_unlocked_wp')) || ['default'];
window.wpMode = 'both';

function initWallpapers() {
    var bgV = document.getElementById('bg-video'); var lV = document.getElementById('lock-video');
    if(wallpaperRegistry[sysConfig.homeWallpaper]){ bgV.src=wallpaperRegistry[sysConfig.homeWallpaper].url; bgV.loop=!!wallpaperRegistry[sysConfig.homeWallpaper].loop; bgV.load(); }
    if(wallpaperRegistry[sysConfig.lockWallpaper]){ lV.src=wallpaperRegistry[sysConfig.lockWallpaper].url; lV.loop=!!wallpaperRegistry[sysConfig.lockWallpaper].loop; lV.load(); }
    else { lV.src="Videos/green.mp4"; lV.loop=true; lV.load(); }
}

document.addEventListener('contextmenu', e => {
    var v = ['desktop-area','windows-layer','bg-video','snow-fx'];
    if (v.includes(e.target.id) || e.target.tagName === 'BODY') {
        e.preventDefault();
        var c = document.getElementById('desktop-context-menu');
        c.style.display = 'block';
        var x = e.pageX, y = e.pageY;
        if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
        if (y + 150 > window.innerHeight) y = window.innerHeight - 150;
        c.style.left = x + 'px'; c.style.top = y + 'px';
    }
});
document.addEventListener('click', e => {
    var c = document.getElementById('desktop-context-menu');
    if (c && !c.contains(e.target)) c.style.display = 'none';
});

window.setWallpaper = function(k, i=false) {
    var d = wallpaperRegistry[k]; if(!d) return;
    if(i && d.locked && !unlockedWallpapers.includes(d.id)){
        unlockedWallpapers.push(d.id); localStorage.setItem('cine_unlocked_wp', JSON.stringify(unlockedWallpapers));
        alert(`Wallpaper: [ ${d.name} ] Unlocked.`);
    }
    if(window.wpMode==='home'||window.wpMode==='both'){
        var v = document.getElementById('bg-video'); v.src=d.url; v.loop=!!d.loop; v.load();
        if(!document.getElementById('lock-screen').classList.contains('active')) v.play();
        updateSysSetting('homeWallpaper', k);
    }
    if(window.wpMode==='lock'||window.wpMode==='both'){
        var l = document.getElementById('lock-video'); l.src=d.url; l.loop=!!d.loop; l.load();
        if(document.getElementById('lock-screen').classList.contains('active')) l.play();
        updateSysSetting('lockWallpaper', k);
    }
    openWallpaperMenu();
};

window.openWallpaperMenu = function() {
    var m = document.getElementById('wallpaper-menu');
    var gu = document.getElementById('wp-grid-unlocked'); var gl = document.getElementById('wp-grid-locked');
    gu.innerHTML = ''; gl.innerHTML = '';
    for(const[k,d] of Object.entries(wallpaperRegistry)){
        var u = !d.locked || unlockedWallpapers.includes(d.id);
        var c = document.createElement('div'); c.className = `wp-card ${u?'':'wp-locked'}`;
        if(u){
            c.innerHTML = `<video src="${d.url}" preload="auto" playsinline muted loop onmouseover="this.play()" onmouseout="this.pause()"></video><div class="wp-info">${d.name}</div>`;
            c.onclick = () => { setWallpaper(k); document.querySelectorAll('.wp-card').forEach(e=>e.classList.remove('active-wp')); c.classList.add('active-wp'); };
            gu.appendChild(c);
        } else {
            c.innerHTML = `<div class="wp-info"><i class="fas fa-lock"></i></div>`; gl.appendChild(c);
        }
    }
    m.classList.add('open');
};

var si = document.getElementById('start-search-input');
if(si){
    si.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){
            var q = this.value.trim();
            if(wallpaperRegistry[q]){ setWallpaper(q, true); this.value=""; this.blur(); }
        }
    });
}


// ==========================================
// CIRI ASSISTANT PRO LOGIC
// ==========================================
const CIRI_MODES = ['FAST', 'THINKING', 'LIVE'];
let ciriModeIndex = 0;
let isCiriActive = false;
let ciriHoldTimer = null;
let hasCiriBooted = false; 
let ciriExpectingApiKey = false;
let ciriScreenStream = null;
let ciriImageBase64 = null;
let ciriImageMime = null;
let ciriChatMemory = [];

window.addEventListener('keydown', (e) => {
    if (e.altKey && (e.code === 'KeyS' || e.key.toLowerCase() === 's')) {
        if (!ciriHoldTimer && !isCiriActive) {
            ciriHoldTimer = setTimeout(() => {
                document.body.classList.add('ciri-active'); 
                isCiriActive = true;

                if (!hasCiriBooted) {
                    const bootScreen = document.getElementById('ciri-boot-screen');
                    bootScreen.style.display = 'flex';
                    
                    setTimeout(() => document.getElementById('ciri-boot-ciri-text').classList.add('typing'), 300);
                    setTimeout(() => document.getElementById('ciri-boot-sub-text').classList.add('show'), 1100);
                    
                    setTimeout(() => {
                        document.getElementById('ciri-boot-loader').style.opacity = '1';
                        const pingStart = Date.now();
                        
                        fetch('https://generativelanguage.googleapis.com/v1beta/models')
                            .then(() => handleCiriNetworkResult("Connection Established."))
                            .catch(() => handleCiriNetworkResult("Network Restricted."));

                        function handleCiriNetworkResult(message) {
                            const elapsed = Date.now() - pingStart;
                            const remainingTime = Math.max(0, 1500 - elapsed);
                            
                            setTimeout(() => {
                                document.getElementById('ciri-boot-status-text').textContent = message;
                                document.getElementById('ciri-boot-spinner').style.display = 'none'; 
                                
                                setTimeout(() => {
                                    bootScreen.style.filter = 'blur(10px)';
                                    bootScreen.style.opacity = '0';
                                    setTimeout(() => {
                                        bootScreen.style.display = 'none';
                                        hasCiriBooted = true;
                                        document.getElementById('ciri-chat-input').focus();
                                        checkCiriApiKeyStatus();
                                    }, 800);
                                }, 1800);
                            }, remainingTime);
                        }
                    }, 2200); 
                } else {
                    setTimeout(() => document.getElementById('ciri-chat-input').focus(), 100);
                }
            }, 2000); // Hold for 2 seconds
        }
    } else if (e.code === 'Escape' && isCiriActive) window.closeCiri();
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'KeyS' || e.key.toLowerCase() === 's' || e.key === 'Alt') { clearTimeout(ciriHoldTimer); ciriHoldTimer = null; }
});

window.closeCiri = function() {
    document.body.classList.remove('ciri-active'); isCiriActive = false;
    if (ciriScreenStream && CIRI_MODES[ciriModeIndex] !== 'LIVE') stopCiriScreenShare();
};

function checkCiriApiKeyStatus() {
    const sText = document.getElementById('ciri-status-text');
    const sIcon = document.getElementById('ciri-status-icon');
    if (localStorage.getItem('ciri_key')) {
        sText.textContent = "Secure"; sText.className = "secure"; 
        sIcon.innerHTML = `<svg class="secure-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>`;
        ciriExpectingApiKey = false;
    } else {
        sText.textContent = "Unstable"; sText.className = "unstable"; 
        sIcon.innerHTML = `<svg class="unstable-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
        ciriExpectingApiKey = true;
        if(document.getElementById('ciri-chat-history').children.length === 0) {
            appendCiriMessage("ciri", "System initialized. Please provide a valid Gemini API key to lock in.");
        }
    }
}

window.autoGrowCiri = function(el) {
    el.style.height = "5px"; el.style.height = (el.scrollHeight) + "px";
};

window.cycleCiriMode = async function() {
    ciriModeIndex = (ciriModeIndex + 1) % CIRI_MODES.length;
    const newMode = CIRI_MODES[ciriModeIndex];
    const toggle = document.getElementById('ciri-mode-toggle');
    toggle.textContent = newMode;
    toggle.className = newMode === 'LIVE' ? 'live-active' : '';

    if (newMode === 'LIVE') {
        try {
            ciriScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: "monitor" } });
            document.getElementById('ciri-screen-video').srcObject = ciriScreenStream;
            appendCiriMessage("ciri", "LIVE Vision active. I can now see your screen.");
        } catch (err) {
            appendCiriMessage("ciri", "Failed to access screen. Reverting mode."); cycleCiriMode();
        }
    } else { stopCiriScreenShare(); }
};

function stopCiriScreenShare() {
    if (ciriScreenStream) { ciriScreenStream.getTracks().forEach(t => t.stop()); ciriScreenStream = null; }
}

async function captureCiriScreen() {
    if (!ciriScreenStream) return null;
    const canvas = document.getElementById('ciri-screen-canvas');
    const video = document.getElementById('ciri-screen-video');
    canvas.width = video.videoWidth; canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]; 
}

document.getElementById('ciri-chat-input').addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let item of items) { if (item.type.indexOf('image') === 0) processCiriImage(item.getAsFile()); }
});
window.handleCiriFileUpload = function(e) { if(e.target.files && e.target.files[0]) processCiriImage(e.target.files[0]); };

function processCiriImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        ciriImageBase64 = e.target.result.split(',')[1]; ciriImageMime = file.type;
        document.getElementById('ciri-img-preview').src = e.target.result; 
        document.getElementById('ciri-img-preview-box').style.display = 'flex';
    };
    reader.readAsDataURL(file);
}
window.clearCiriImage = function() { 
    ciriImageBase64 = null; ciriImageMime = null; 
    document.getElementById('ciri-img-preview-box').style.display = 'none'; 
    document.getElementById('ciri-file-upload').value = ""; 
};

document.getElementById('ciri-chat-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCiriSend(); }
});

function parseMath(text) {
    let mathBlocks = [];
    let temp = text.replace(/\$\$([\s\S]+?)\$\$/g, (match) => { mathBlocks.push(match); return `%%MATH_${mathBlocks.length - 1}%%`; });
    temp = temp.replace(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g, (match) => { mathBlocks.push(match); return `%%MATH_${mathBlocks.length - 1}%%`; });
    let html = marked.parse(temp);
    mathBlocks.forEach((b, i) => { html = html.replace(`%%MATH_${i}%%`, b); });
    return html;
}

window.handleCiriSend = async function() {
    const input = document.getElementById('ciri-chat-input');
    const text = input.value.trim();
    const orb = document.getElementById('ciri-action-orb');
    
    if (!text && !ciriImageBase64) return;

    if (ciriExpectingApiKey) {
        input.value = ''; input.style.height = 'auto';
        orb.classList.add('thinking');
        
        const tempId = "key-test-" + Date.now();
        document.getElementById('ciri-chat-history').insertAdjacentHTML('beforeend', `<div class="message ciri" id="${tempId}"><span style="color:#aaa;font-style:italic;">Validating API Key...</span></div>`);
        scrollCiriToBottom();

        try {
            const testRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${text}`);
            const testData = await testRes.json();
            document.getElementById(tempId).remove();
            orb.classList.remove('thinking');
            if (testData.error) throw new Error(testData.error.message);
            
            localStorage.setItem('ciri_key', text);
            checkCiriApiKeyStatus();
            appendCiriMessage("ciri", "API Key verified and locked in. How can I help?");
        } catch (err) {
            document.getElementById(tempId).remove();
            orb.classList.remove('thinking');
            appendCiriMessage("ciri", "Invalid key or blocked by network. Try another.");
        }
        return;
    }

    const apiKey = localStorage.getItem('ciri_key');
    appendCiriMessage("user", text, document.getElementById('ciri-img-preview').src);
    input.value = ''; input.style.height = 'auto';
    
    const payloadImg = ciriImageBase64; const payloadMime = ciriImageMime; clearCiriImage();
    orb.classList.add('thinking');

    const tempLoadId = "loading-" + Date.now();
    document.getElementById('ciri-chat-history').insertAdjacentHTML('beforeend', `<div class="message ciri" id="${tempLoadId}"><span style="color:#aaa;font-style:italic;">Processing...</span></div>`);
    scrollCiriToBottom();
    
    const parts = [];
    if (text) parts.push({ text: text });
    if (payloadImg) parts.push({ inline_data: { mime_type: payloadMime, data: payloadImg } });
    if (CIRI_MODES[ciriModeIndex] === 'LIVE' && ciriScreenStream) {
        const screenB64 = await captureCiriScreen();
        if (screenB64) parts.push({ inline_data: { mime_type: "image/jpeg", data: screenB64 } });
    }

    ciriChatMemory.push({ role: "user", parts: parts });
    if (ciriChatMemory.length > 4) ciriChatMemory = ciriChatMemory.slice(-4); 

    const reqBody = { contents: ciriChatMemory };
    const basePersona = "You are CIRI, made by Cine-Hub Softwares. Help students with tasks. Be clear and short to save tokens. Accept user corrections gracefully. Always end with a relevant follow-up question. Expert mathematician. Use LaTeX for math ($$ for blocks, $ for inline).";
    
    if (CIRI_MODES[ciriModeIndex] === 'THINKING') {
        reqBody.system_instruction = { parts: [{text: basePersona + " You MUST think step-by-step before answering. Enclose internal thoughts inside <think>...</think> tags."}] };
    } else {
        reqBody.system_instruction = { parts: [{text: basePersona}] };
    }

    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(reqBody)
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);

        let respText = data.candidates[0].content.parts[0].text;
        let thoughts = "";

        if (CIRI_MODES[ciriModeIndex] === 'THINKING') {
            const match = respText.match(/<think>([\s\S]*?)<\/think>/);
            if (match) { thoughts = match[1].trim(); respText = respText.replace(/<think>[\s\S]*?<\/think>/, '').trim(); }
        }
        
        ciriChatMemory.push({ role: "model", parts: [{ text: respText }] });
        document.getElementById(tempLoadId).remove();
        orb.classList.remove('thinking');
        
        await typeCiriResponse(respText, thoughts);
        
    } catch (err) {
        document.getElementById(tempLoadId).remove();
        orb.classList.remove('thinking');
        ciriChatMemory.pop(); 
        await typeCiriResponse("Error: " + err.message);
    }
};

function appendCiriMessage(sender, text, imgSrc = null) {
    const chatHist = document.getElementById('ciri-chat-history');
    const div = document.createElement('div'); div.className = `message ${sender}`;
    let html = "";
    if (imgSrc && imgSrc !== window.location.href) html += `<img src="${imgSrc}" style="max-width: 100%; border-radius: 12px; margin-bottom: 12px;">`;
    if (text) html += parseMath(text); 
    div.innerHTML = html;
    chatHist.appendChild(div);
    if (window.MathJax) MathJax.typesetPromise([div]).catch((err) => console.log(err));
    scrollCiriToBottom();
}

function scrollCiriToBottom() {
    const ch = document.getElementById('ciri-chat-history');
    ch.scrollTop = ch.scrollHeight;
}

function typeCiriResponse(fullText, thoughts = "") {
    return new Promise((resolve) => {
        const chatHist = document.getElementById('ciri-chat-history');
        const div = document.createElement('div'); div.className = 'message ciri';
        
        let htmlStr = "";
        if (thoughts) {
            htmlStr += `<details class="thought-process"><summary>Internal Monologue</summary><div class="thought-content">${thoughts.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div></details>`;
        }
        
        const contentDiv = document.createElement('div');
        div.innerHTML = htmlStr; div.appendChild(contentDiv);
        chatHist.appendChild(div);
        
        let i = 0; let currentStr = "";
        const speed = CIRI_MODES[ciriModeIndex] === 'FAST' ? 2 : 5; 
        const chunkSize = CIRI_MODES[ciriModeIndex] === 'FAST' ? 4 : 2;

        function typeChar() {
            const isNearBottom = Math.abs(chatHist.scrollHeight - chatHist.clientHeight - chatHist.scrollTop) <= 40;
            if (i < fullText.length) {
                currentStr += fullText.substring(i, i + chunkSize);
                i += chunkSize;
                contentDiv.innerHTML = parseMath(currentStr);
                if (window.MathJax) MathJax.typesetPromise([contentDiv]).catch((e) => console.log(e));
                if (isNearBottom) scrollCiriToBottom();
                setTimeout(typeChar, speed);
            } else {
                contentDiv.innerHTML = parseMath(fullText);
                if (window.MathJax) MathJax.typesetPromise([contentDiv]);
                if (isNearBottom) scrollCiriToBottom();
                resolve();
            }
        }
        typeChar();
    });
}
