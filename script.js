var _SYSTEM_PATHS = ["C:/Windows/System32/kernel32.dll", "/var/www/html/cine-os/", "https://cine-os.local/api/v1/auth"];
var _devBuildVer = "3.0.0";

var APPS = {
    'cine': {title: 'CINE // HUB', path: 'script/Apps/Cine/index.html', icon: 'https://cdn.worldvectorlogo.com/logos/netflix-logo-icon.svg', pinned: true},
    'term': {title: 'Spotify', path: 'script/Apps/Spotify/index.html', icon: 'https://cdn.pixabay.com/photo/2016/10/22/00/15/spotify-1759471_1280.jpg', pinned: true},
    'files': {title: 'PS5 Emu', path: 'script/Apps/Ps5/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OeL_be7RFaoHi3PswkuAR5XcMgBNRDynsg&s', pinned: true},
    'android': {title: 'Android', path: 'script/Apps/Android/index.html', icon: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/android-icon.png', pinned: false},
    'web': {title: 'Cine-Web', path: 'script/Apps/Web/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeD89ZcX5W1FBtal7RerasT27q-OmZqnBixQ&s', pinned: true},
    'roblox': {title: 'Roblox', path: 'script/Apps/Roblox/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9KvNyFWMg_bjo_q_1IVLKFWbfCeonn2qDow&s', pinned: false},
    'ciniai': {title: 'Cini AI', path: 'script/Apps/Cini/index.html', icon: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkLXhvns5Rrdf-XBNlWcPIRh0hlJfWnEtBWg&s', pinned: false},
    'settings': {title: 'CONFIG', internal: true, icon: 'https://cdn.iconscout.com/icon/free/png-256/free-apple-settings-icon-svg-download-png-493162.png', pinned: true},
    'discord': {title: 'Discord', path: 'script/Apps/Discord/index.html', icon: 'https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png', pinned: false}
};

var wallpaperRegistry = {
    "Default": {id: "Default", name: "Snake Skeleton", url: "Videos/default.mp4", locked: false},
    "green": {id: "green", name: "Green Anime", url: "Videos/green.mp4", locked: false},
    "#33A56": {id: "hunt_trait", name: "Hunt Showdown", url: "Videos/33A56.mp4", locked: true},
    "#45E33": {id: "45E33", name: "45E33", url: "Videos/45E33.mp4", locked: true},
    "#55Cine": {id: "55Cine", name: "Cine 55", url: "Videos/55Cine.PNG", locked: true},
    "#99Med": {id: "99Med", name: "99 Med", url: "Videos/99Med.mp4", locked: true},
    "#Brother": {id: "Brother", name: "Brother", url: "Videos/Brother.mp4", locked: true},
    "#F-1": {id: "F-1", name: "F-1 Formula", url: "Videos/F-1.mp4", locked: true},
    "#Gojo-Sukuna": {id: "Gojo-Sukuna", name: "Gojo vs Sukuna", url: "Videos/Gojo-Sukuna.mp4", locked: true},
    "#Hunt": {id: "Hunt", name: "Hunt Showdown 2", url: "Videos/Hunt.mp4", locked: true},
    "#Minecraft01": {id: "Minecraft01", name: "Minecraft 01", url: "Videos/Minecraft01.mp4", locked: true},
    "#Minecraft02": {id: "Minecraft02", name: "Minecraft 02", url: "Videos/Minecraft02.mp4", locked: true},
    "#Minecraft03": {id: "Minecraft03", name: "Minecraft 03", url: "Videos/Minecraft03.mp4", locked: true},
    "#Monkey": {id: "Monkey", name: "Monkey", url: "Videos/Monkey.mp4", locked: true},
    "#Skello": {id: "Skello", name: "Skello", url: "Videos/Skello.MP4", locked: true},
    "#SnowFox": {id: "SnowFox", name: "Snow Fox", url: "Videos/SnowFox.mp4", locked: true},
    "#Supra": {id: "Supra", name: "Supra Drift", url: "Videos/Supra.PNG", locked: true},
    "#Yuji52": {id: "Yuji52", name: "Yuji 52", url: "Videos/Yuji52.mp4", locked: true},
    "#sukuna-fire": {id: "sukuna-fire", name: "Sukuna Fire", url: "Videos/sukuna-fire.mp4", locked: true}
};

var sysConfig = JSON.parse(localStorage.getItem('cine_sys_config')) || {};
if (sysConfig.optBg === undefined) sysConfig.optBg = false;
if (sysConfig.shortBoot === undefined) sysConfig.shortBoot = false;
if (sysConfig.wpLoop === undefined) sysConfig.wpLoop = false;
if (sysConfig.idleLock === undefined) sysConfig.idleLock = false; 
if (sysConfig.redirectConfirm === undefined) sysConfig.redirectConfirm = false; 
if (!sysConfig.panicKey) sysConfig.panicKey = '`';
if (!sysConfig.homeWallpaper) sysConfig.homeWallpaper = 'Default';
if (!sysConfig.lockWallpaper) sysConfig.lockWallpaper = 'green';
if (!sysConfig.cloak) sysConfig.cloak = 'none';

window.updateSysSetting = function(key, value) {
    sysConfig[key] = value;
    localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
    if (key === 'optBg') applySystemSettings();
    if (key === 'wpLoop') updateWallpaperLoop();
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
    var key = sysConfig.cloak || 'none';
    var selected = cloaks[key];
    var icons = document.querySelectorAll("link[rel*='icon']");
    for (var i = 0; i < icons.length; i++) icons[i].remove();
    
    if (selected && key !== 'none') {
        document.title = selected.title;
        var newLink = document.createElement('link');
        newLink.type = 'image/x-icon';
        newLink.rel = 'shortcut icon';
        newLink.href = selected.icon;
        document.getElementsByTagName('head')[0].appendChild(newLink);
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

if (isMobile) {
    var mobWarn = document.getElementById('mobile-warning');
    mobWarn.classList.add('show-warning');
    var lastTap = 0;
    mobWarn.addEventListener('touchstart', function(e) {
        var currentTime = new Date().getTime();
        var tapLength = currentTime - lastTap;
        if (tapLength < 500 && tapLength > 0) {
            mobWarn.classList.remove('show-warning');
        }
        lastTap = currentTime;
    });
    mobWarn.addEventListener('dblclick', function() {
        mobWarn.classList.remove('show-warning');
    });
}

async function loadDynamicResources() {
    try {
        var resp = await fetch('Videos/');
        if (resp.ok) {
            var text = await resp.text();
            var matches = text.match(/href="([^"]+\.(mp4|mov|png|jpg|jpeg))"/gi);
            if (matches) {
                for (var i = 0; i < matches.length; i++) {
                    var filename = matches[i].replace(/href="|"/g, '');
                    if (filename.startsWith('#')) {
                        var cleanName = filename.replace('#', '').split('.')[0];
                        wallpaperRegistry[filename] = { id: cleanName, name: cleanName, url: "Videos/" + filename, locked: true };
                    }
                }
            }
        }
    } catch (e) {}
    
    renderUI();
    initWallpapers();
    setupAppContextMenu();
}

window.onbeforeunload = function(e) {
    if (sysConfig.redirectConfirm) {
        var message = "Are you sure you want to leave? This helps block GoGuardian redirects.";
        e.returnValue = message;
        return message;
    }
};

document.addEventListener("DOMContentLoaded", function() {
    applyCloak();
    loadDynamicResources();
    initPreBootSequence();
    loadDesktop();
    updateSidebarData();
});

function initPreBootSequence() {
    var pbLayer = document.getElementById('pre-boot-layer');
    if (isMobile) {
        pbLayer.style.display = 'none';
        document.getElementById('boot-layer').style.display = 'flex';
        return;
    }

    var crWrap = document.getElementById('credits-roll');
    var skipUi = document.getElementById('skip-ui');
    var skipFill = document.getElementById('skip-fill');
    var cFog = document.querySelector('.cr-fog');
    var pIframe = document.getElementById('proxy-iframe');
    var pBg = document.getElementById('proxy-bg');
    var pShield = document.getElementById('proxy-shield');
    
    var rv = 0, sk = 0, sq = [], tm, hd = 0;
    var sc = ['ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown'];

    window.focus();
    pShield.addEventListener('click', function() { window.focus(); });

    var keydownHandler = function(e) {
        if (rv) return;
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            sq.push(e.key);
            sq = sq.slice(-4);
            if (sq.join('') === sc.join('')) {
                rv = 1;
                if (localStorage.getItem('cine_cs_skip')) finishPreBoot();
                else startCredits();
            }
        } else {
            sq = [];
        }
    };

    function startCredits() {
        pIframe.style.opacity = '0';
        setTimeout(function(){ pIframe.style.display = 'none'; }, 1000);
        pBg.style.opacity = '1';
        cFog.style.opacity = '1';
        crWrap.style.opacity = '1';
        setTimeout(function() {
            crWrap.style.animationPlayState = 'running';
            skipUi.classList.add('active');
        }, 1000);
        
        setTimeout(finishPreBoot, 14500);
    }

    var skipDownHandler = function(e) {
        if (e.key === 'Enter' && rv && !sk && !hd && !localStorage.getItem('cine_cs_skip')) {
            hd = 1;
            skipFill.style.transition = 'width 1500ms linear';
            skipFill.style.width = '100%';
            tm = setTimeout(finishPreBoot, 1500);
        }
    };

    var skipUpHandler = function(e) {
        if (e.key === 'Enter' && rv && !sk) {
            hd = 0;
            clearTimeout(tm);
            skipFill.style.transition = 'none';
            skipFill.style.width = '0%';
        }
    };

    window.addEventListener('keydown', keydownHandler);
    window.addEventListener('keydown', skipDownHandler);
    window.addEventListener('keyup', skipUpHandler);

    function finishPreBoot() {
        if (sk) return;
        sk = 1;
        crWrap.style.opacity = '0';
        skipUi.style.opacity = '0';
        cFog.style.opacity = '0';
        pBg.style.opacity = '0';
        pShield.style.display = 'none'; 
        
        localStorage.setItem('cine_cs_skip', '1');
        
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keydown', skipDownHandler);
        window.removeEventListener('keyup', skipUpHandler);

        setTimeout(function() {
            pbLayer.style.opacity = '0';
            setTimeout(function() {
                pbLayer.remove(); 
                document.getElementById('boot-layer').style.display = 'flex';
                var bootVid = document.getElementById('boot-video');
                if(bootVid && sysConfig.shortBoot) {
                    bootVid.src = "Videos/QuickBoot.mp4";
                    bootVid.load();
                }
            }, 1200);
        }, 500);
    }
}

function renderUI() {
    var dock = document.getElementById('dock-container');
    var dockHTML = '<div class="dock-item" onclick="toggleStartMenu()"><img src="https://missionsupport.archden.org/wp-content/uploads/2022/02/windows11-icon.png"></div><div class="dock-sep"></div><div class="dock-item" onclick="toggleAppDrawer()"><svg width="24" height="24" viewBox="0 0 24 24" fill="#aaa"><path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/></svg></div><div class="dock-sep"></div>';
    
    var pinnedGrid = document.getElementById('pinned-grid');
    var pinnedHTML = '';
    
    for (var id in APPS) {
        if (APPS[id].pinned) {
            dockHTML += '<div class="dock-item" data-id="' + id + '" onmousedown="DragSystem.start(event,this,\'dock\',\'' + id + '\')" onclick="toggleApp(\'' + id + '\')"><img src="' + APPS[id].icon + '"></div>';
            pinnedHTML += '<div class="pinned-item" onclick="toggleApp(\'' + id + '\')"><img src="' + APPS[id].icon + '"><span>' + APPS[id].title + '</span></div>';
        }
    }
    
    dock.innerHTML = dockHTML;
    pinnedGrid.innerHTML = pinnedHTML;
    populateDrawer();
}

document.addEventListener('keydown', function(e) {
    if (bootActive && e.key === 'Enter' && document.getElementById('boot-layer').style.display !== 'none') {
        enterCount++;
        if (enterCount >= 2) skipBootSequence();
        setTimeout(function() { enterCount = 0; }, 500);
    }
    if (e.key && sysConfig.panicKey && e.key.toLowerCase() === sysConfig.panicKey.toLowerCase()) {
        window.location.href = "https://google.com";
    }
});

function startBootSequence() {
    var contentBox = document.getElementById('boot-content');
    var bootVid = document.getElementById('boot-video');
    contentBox.style.display = 'none';
    bootVid.style.display = 'block';
    bootVid.muted = false;
    bootVid.volume = 1.0;
    
    if (sysConfig.shortBoot) {
        bootVid.src = "Videos/QuickBoot.mp4";
        bootVid.load();
    }
    
    var playPromise = bootVid.play();
    if (playPromise !== undefined) {
        playPromise.catch(function() {
            bootVid.muted = true;
            bootVid.play();
        });
    }
    bootVid.onended = function() {
        if (bootActive) skipBootSequence();
    };
}

function skipBootSequence() {
    if (!bootActive) return;
    bootActive = false;
    var layer = document.getElementById('boot-layer');
    var bootVid = document.getElementById('boot-video');
    if (bootVid) bootVid.pause();
    
    if (layer) {
        layer.style.opacity = '0';
        document.getElementById('lock-screen').classList.add('active');
        
        var lockVid = document.getElementById('lock-video');
        if(lockVid.style.display !== 'none') {
            lockVid.play().catch(function(e) {});
        }
        
        setTimeout(function() {
            layer.style.display = 'none';
        }, 600);
        updateClock();
    }
}

function showNotification(title, msg) {
    var container = document.getElementById('toast-container');
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<div class="toast-header"><div class="toast-app-info"><div class="toast-icon"><i class="fas fa-bell"></i></div><span>System</span></div><i class="fas fa-times toast-close"></i></div><div class="toast-title">' + title + '</div><div class="toast-body">' + msg + '</div>';
    container.appendChild(toast);
    
    setTimeout(function() { toast.classList.add('show'); }, 100);
    var cleanup = function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 400);
    };
    toast.onclick = cleanup;
    setTimeout(cleanup, 6000);
}

var welcomeShown = false;
window.unlockSystem = function() {
    var screen = document.getElementById('lock-screen');
    screen.classList.add('slide-up');
    setTimeout(function() {
        screen.classList.remove('active');
        isDesktopActive = true;
        document.getElementById('lock-video').pause();
        
        if (!sysConfig.optBg) {
            var bgV = document.getElementById('bg-video');
            if(bgV.style.display !== 'none') bgV.play().catch(function(e) {});
        }
        if (!welcomeShown) {
            showNotification("Welcome To Cine V2", "Checkout Settings for FAQ!");
            welcomeShown = true;
        }
    }, 600);
    resetIdle();
};

function applyMediaToElements(url, vidEl, imgEl, isBg) {
    if(!url) return;
    var isImg = url.match(/\.(png|jpg|jpeg|gif)$/i);
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
    var bgV = document.getElementById('bg-video');
    var bgI = document.getElementById('bg-img');
    var lV = document.getElementById('lock-video');
    var lI = document.getElementById('lock-img');
    
    if (wallpaperRegistry[sysConfig.homeWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.homeWallpaper].url, bgV, bgI, true);
    }
    if (wallpaperRegistry[sysConfig.lockWallpaper]) {
        applyMediaToElements(wallpaperRegistry[sysConfig.lockWallpaper].url, lV, lI, false);
    } else {
        applyMediaToElements("Videos/green.mp4", lV, lI, false);
    }
    
    updateWallpaperLoop();
    var wpLoopCheck = document.getElementById('wp-loop-chk');
    if (wpLoopCheck) wpLoopCheck.checked = sysConfig.wpLoop;
}

function updateWallpaperLoop() {
    var bgV = document.getElementById('bg-video');
    var lV = document.getElementById('lock-video');
    if (bgV) bgV.loop = sysConfig.wpLoop;
    if (lV) lV.loop = sysConfig.wpLoop;
    if (!sysConfig.optBg && isDesktopActive && bgV && bgV.paused && bgV.style.display !== 'none') {
        bgV.play().catch(function(e){});
    }
}

function updateClock() {
    var n = new Date();
    var dArray = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    var mArray = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    
    var hrs = n.getHours();
    var greet = 'GOOD EVENING';
    if (hrs < 12) greet = 'GOOD MORNING';
    else if (hrs < 18) greet = 'GOOD AFTERNOON';
    
    var h12 = hrs % 12 || 12;
    var ampm = hrs >= 12 ? 'PM' : 'AM';
    var min = n.getMinutes().toString().padStart(2, '0');
    var dayNum = n.getDate().toString().padStart(2, '0');
    var dayName = dArray[n.getDay()];
    
    var elGreet = document.getElementById('lock-greet');
    var elTime = document.getElementById('lock-time');
    var elDate = document.getElementById('lock-date');
    var elDayImgLock = document.getElementById('lock-day-img');
    var elDayImgHud = document.getElementById('lbl-day-img');
    
    if (elGreet) elGreet.innerText = greet;
    if (elTime) elTime.innerText = h12 + ':' + min + ' ' + ampm;
    if (elDate) elDate.innerText = dayNum + ' ' + mArray[n.getMonth()];
    
    var dayImgPath = "Videos/" + dayName + ".png";
    if (elDayImgLock) { elDayImgLock.src = dayImgPath; elDayImgLock.alt = dayName; }
    if (elDayImgHud) { elDayImgHud.src = dayImgPath; elDayImgHud.alt = dayName; }
}
setInterval(updateClock, 1000);

var idleTime = 0;
function resetIdle() { idleTime = 0; }
document.addEventListener('mousemove', resetIdle);
document.addEventListener('keypress', resetIdle);
document.addEventListener('click', resetIdle);

setInterval(function() {
    idleTime++;
    var screen = document.getElementById('lock-screen');
    if (sysConfig.idleLock && idleTime >= 180 && !screen.classList.contains('active') && !bootActive) {
        if (isMediaPlaying) {
            idleTime = 0; 
        } else {
            isDesktopActive = false;
            screen.classList.remove('slide-up');
            screen.classList.add('active');
            document.getElementById('bg-video').pause();
            var lV = document.getElementById('lock-video');
            if(lV.style.display !== 'none') lV.play().catch(function(e){});
        }
    }
}, 1000);

window.launchLastPlayed = function() {
    toggleApp('files');
};

window.resumeSpotify = function() {
    toggleApp('term');
};

window.openUpdateLog = function() {
    document.getElementById('update-modal').style.display = 'flex';
};

function updateSidebarData() {
    try {
        var psData = JSON.parse(localStorage.getItem('ps_purchased'));
        if(psData && psData.length > 0) {
            document.getElementById('last-game-name').innerText = "PS5 Library Ready";
        }
        var spotData = JSON.parse(localStorage.getItem('cinify_cache'));
        if(spotData) {
            var keys = Object.keys(spotData);
            if(keys.length > 0) {
                document.getElementById('spotify-track-name').innerText = spotData[keys[keys.length-1]].title || "Liked Song";
                if(spotData[keys[keys.length-1]].cover) {
                    document.getElementById('spotify-album-art').src = spotData[keys[keys.length-1]].cover;
                }
            }
        }
    } catch(e) {}
}
setInterval(updateSidebarData, 5000);

function populateDrawer() {
    var grid = document.getElementById('drawer-grid');
    grid.innerHTML = '';
    for (var key in APPS) {
        var a = APPS[key];
        var item = document.createElement('div');
        item.className = 'drawer-item';
        item.dataset.id = key;
        item.innerHTML = '<img src="' + a.icon + '" style="pointer-events:none;"><span>' + a.title + '</span>';
        
        item.onmousedown = function(e) { DragSystem.start(e, this, 'drawer', this.dataset.id); };
        item.onclick = function(e) {
            if (!DragSystem.isDragMove) {
                toggleApp(this.dataset.id);
                toggleAppDrawer();
            }
        };
        grid.appendChild(item);
    }
}

function filterDrawer(val) {
    var items = document.querySelectorAll('.drawer-item');
    var query = val.toLowerCase();
    for (var i = 0; i < items.length; i++) {
        var text = items[i].innerText.toLowerCase();
        if (text.includes(query)) items[i].style.display = 'flex';
        else items[i].style.display = 'none';
    }
}

function toggleAppDrawer() {
    var drawer = document.getElementById('app-drawer');
    if (drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        setTimeout(function() { drawer.style.display = 'none'; }, 300);
    } else {
        drawer.style.display = 'block';
        setTimeout(function() { drawer.classList.add('open'); }, 10);
    }
}

function toggleApp(id) {
    var win = document.getElementById('win-' + id);
    if (win) {
        if (win.classList.contains('minimized')) {
            win.classList.remove('minimized');
            win.classList.add('active');
            win.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(win);
        } else if (activeWindowId === id) {
            minimizeWindow(id);
        } else {
            win.style.zIndex = ++highestZ;
            activeWindowId = id;
            startImmersiveMode(win);
        }
    } else {
        openWindow(id);
    }
}

function openWindow(id) {
    var menu = document.getElementById('start-menu');
    if (menu) {
        menu.classList.remove('open');
        setTimeout(function() { menu.style.display = 'none'; }, 300);
    }
    
    var layer = document.getElementById('windows-layer');
    var win = document.getElementById('win-' + id);
    
    if (!win) {
        var appData = APPS[id] || {title: 'APP', path: 'about:blank'};
        win = document.createElement('div');
        win.id = 'win-' + id;
        win.className = 'window active header-visible';
        win.style.zIndex = ++highestZ;
        
        var iframeContent = '';
        if (appData.internal) {
            iframeContent = '<iframe id="frame-' + id + '"></iframe>';
        } else {
            iframeContent = '<iframe id="frame-' + id + '" src="' + appData.path + '"></iframe>';
        }
        
        win.innerHTML = '<div class="win-header" onmousedown="DragSystem.startWinDrag(event, \'' + id + '\')"><div class="win-title">' + appData.title + '</div><div class="win-controls"><div class="win-btn btn-min" onclick="minimizeWindow(\'' + id + '\')"></div><div class="win-btn btn-close" onclick="closeWindow(\'' + id + '\')"></div></div></div><div class="win-body">' + iframeContent + '</div>';
        
        layer.appendChild(win);
        
        if (appData.internal && id === 'settings') {
            var frameEl = document.getElementById('frame-' + id);
            if (frameEl) {
                var configHTML = `
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
                    </script>
                </body>
                </html>
                `;
                frameEl.srcdoc = configHTML;
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
    var win = document.getElementById('win-' + id);
    if (win) win.remove();
    if (activeWindowId === id) activeWindowId = null;
    endImmersiveMode();
}

function minimizeWindow(id) {
    var win = document.getElementById('win-' + id);
    if (win) {
        win.classList.add('minimized');
        win.classList.remove('active');
        if (activeWindowId === id) activeWindowId = null;
    }
    endImmersiveMode();
}

function startImmersiveMode(win) {
    document.getElementById('dock-container').classList.add('dock-hidden');
    win.classList.remove('header-visible');
}

function endImmersiveMode() {
    var activeWins = document.querySelectorAll('.window.active:not(.minimized)');
    if (activeWins.length === 0) {
        document.getElementById('dock-container').classList.remove('dock-hidden');
        activeWindowId = null;
    } else {
        var topWin = activeWins[activeWins.length - 1];
        activeWindowId = topWin.id.replace('win-', '');
        topWin.style.zIndex = ++highestZ;
        startImmersiveMode(topWin);
    }
}

var dockTimer;
var dockEl = document.getElementById('dock-container');
document.getElementById('bottom-trigger').addEventListener('mouseenter', function() {
    dockEl.classList.remove('dock-hidden');
    clearTimeout(dockTimer);
});
dockEl.addEventListener('mouseleave', function() {
    var activeWins = document.querySelectorAll('.window.active:not(.minimized)');
    if (activeWins.length > 0) {
        dockTimer = setTimeout(function() { dockEl.classList.add('dock-hidden'); }, 1000);
    }
});
dockEl.addEventListener('mouseenter', function() { clearTimeout(dockTimer); });

document.getElementById('top-trigger').addEventListener('mouseenter', function() {
    if (activeWindowId) {
        var win = document.getElementById('win-' + activeWindowId);
        if (win && !win.classList.contains('minimized')) win.classList.add('header-visible');
    }
});

document.addEventListener('mouseover', function(e) {
    if (e.target.closest('.win-header')) {
        if (activeWindowId) {
            var w = document.getElementById('win-' + activeWindowId);
            if (w) w.classList.add('header-visible');
        }
    } else if (activeWindowId && !e.target.closest('#top-trigger')) {
        var win = document.getElementById('win-' + activeWindowId);
        if (win) win.classList.remove('header-visible');
    }
});

var desktopLayout = JSON.parse(localStorage.getItem('cine_desktop_v2')) || [];

function saveDesktop() {
    localStorage.setItem('cine_desktop_v2', JSON.stringify(desktopLayout));
    loadDesktop();
}

function loadDesktop() {
    var container = document.getElementById('desktop-area');
    var existing = document.querySelectorAll('.desktop-app');
    for (var j = 0; j < existing.length; j++) existing[j].remove();
    
    desktopLayout.forEach(function(item, idx) {
        var appEl = document.createElement('div');
        appEl.className = 'desktop-app';
        appEl.style.left = item.x + 'px';
        appEl.style.top = item.y + 'px';
        appEl.setAttribute('data-idx', idx);
        
        if (item.type === 'folder') {
            var gridHtml = '<div class="d-folder-grid">';
            var maxItems = item.apps.slice(0, 4);
            maxItems.forEach(function(a) {
                if (APPS[a]) gridHtml += '<img src="' + APPS[a].icon + '">';
            });
            gridHtml += '</div>';
            
            if (!item.hideName) {
                gridHtml += '<div class="d-label">' + (item.customName || 'Folder') + '</div>';
            }
            appEl.innerHTML = gridHtml;
            
            appEl.onclick = function(ev) {
                if (DragSystem.isDragMove) return;
                ev.stopPropagation();
                if (!this.classList.contains('expanded-folder')) {
                    closeAllFolders();
                    expandFolder(this, item, idx);
                }
            };
        } else {
            var appData = APPS[item.id];
            if (appData) {
                var iconSrc = item.customIcon || appData.icon;
                var label = item.customName || appData.title;
                var aHtml = '<img src="' + iconSrc + '" class="d-icon">';
                if (!item.hideName) aHtml += '<div class="d-label">' + label + '</div>';
                
                appEl.innerHTML = aHtml;
                appEl.ondblclick = function(ev) { ev.stopPropagation(); toggleApp(item.id); };
            }
        }
        
        appEl.onmousedown = function(ev) {
            ev.stopPropagation();
            if (ev.button === 0) DragSystem.start(ev, appEl, 'desktop', idx);
        };
        
        appEl.oncontextmenu = function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            var cMenu = document.getElementById('app-context-menu');
            if(cMenu) {
                cMenu.style.display = 'block';
                cMenu.style.left = ev.pageX + 'px';
                cMenu.style.top = ev.pageY + 'px';
                cMenu.setAttribute('data-target-idx', idx);
            }
            document.getElementById('desktop-context-menu').style.display = 'none';
        };
        
        container.appendChild(appEl);
    });
}

function expandFolder(folderEl, folderData, idx) {
    folderEl.classList.add('expanded-folder');
    
    var html = '<div class="folder-header">' + (folderData.customName || 'Folder') + ' <i class="fas fa-times" onclick="closeAllFolders(event)"></i></div>';
    html += '<div class="folder-grid-expanded">';
    for (var k = 0; k < folderData.apps.length; k++) {
        var aId = folderData.apps[k];
        var info = APPS[aId];
        if (info) {
            html += '<div class="f-app" onclick="event.stopPropagation(); toggleApp(\'' + aId + '\')"><img src="' + info.icon + '"><span>' + info.title + '</span></div>';
        }
    }
    html += '</div>';
    folderEl.innerHTML = html;
    
    setTimeout(function() {
        var rect = folderEl.getBoundingClientRect();
        var siblings = document.querySelectorAll('.desktop-app:not(.expanded-folder)');
        for (var s = 0; s < siblings.length; s++) {
            var sib = siblings[s];
            var sRect = sib.getBoundingClientRect();
            if (!(rect.right < sRect.left || rect.left > sRect.right || rect.bottom < sRect.top || rect.top > sRect.bottom)) {
                var pushAmount = (rect.bottom - sRect.top) + 20;
                sib.style.transform = 'translateY(' + pushAmount + 'px)';
                sib.setAttribute('data-pushed', 'true');
            }
        }
    }, 50);
}

function closeAllFolders(ev) {
    if (ev) ev.stopPropagation();
    var open = document.querySelectorAll('.expanded-folder');
    if (open.length === 0) return;
    
    for (var i = 0; i < open.length; i++) {
        open[i].classList.remove('expanded-folder');
    }
    
    var pushed = document.querySelectorAll('.desktop-app[data-pushed="true"]');
    for (var j = 0; j < pushed.length; j++) {
        pushed[j].style.transform = '';
        pushed[j].removeAttribute('data-pushed');
    }
    setTimeout(loadDesktop, 250);
}

document.addEventListener('click', function(e) {
    if (!e.target.closest('.expanded-folder') && !e.target.closest('.desktop-app')) {
        closeAllFolders();
    }
});

function setupAppContextMenu() {
    var menu = document.getElementById('app-context-menu');
    if(!menu) return;
    menu.innerHTML = `
        <div class="ctx-item" id="ctx-rename"><i class="fas fa-edit fa-fw"></i> Rename</div>
        <div class="ctx-item" id="ctx-hidename"><i class="fas fa-eye-slash fa-fw"></i> Toggle Name</div>
        <div class="ctx-item" id="ctx-changeicon"><i class="fas fa-image fa-fw"></i> Change Icon</div>
        <div class="ctx-separator"></div>
        <div class="ctx-item" id="ctx-delete"><i class="fas fa-trash fa-fw" style="color:#aaa;"></i> Remove</div>
    `;
    
    document.getElementById('ctx-rename').onclick = function() {
        var idx = menu.getAttribute('data-target-idx');
        var item = desktopLayout[idx];
        var newName = prompt("Enter new name:", item.customName || "");
        if (newName !== null) {
            item.customName = newName.trim() === "" ? "App" : newName;
            saveDesktop();
        }
        menu.style.display = 'none';
    };
    
    document.getElementById('ctx-hidename').onclick = function() {
        var idx = menu.getAttribute('data-target-idx');
        desktopLayout[idx].hideName = !desktopLayout[idx].hideName;
        saveDesktop();
        menu.style.display = 'none';
    };
    
    document.getElementById('ctx-changeicon').onclick = function() {
        var idx = menu.getAttribute('data-target-idx');
        var url = prompt("Enter image URL for custom icon:");
        if (url) {
            desktopLayout[idx].customIcon = url;
            saveDesktop();
        }
        menu.style.display = 'none';
    };
    
    document.getElementById('ctx-delete').onclick = function() {
        var idx = menu.getAttribute('data-target-idx');
        desktopLayout.splice(idx, 1);
        saveDesktop();
        menu.style.display = 'none';
    };
    
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target)) menu.style.display = 'none';
    });
}

document.addEventListener('contextmenu', function(e) {
    var allowedBgIds = ['desktop-area', 'windows-layer', 'bg-video', 'bg-img', 'snow-fx', 'right-sidebar'];
    if (allowedBgIds.includes(e.target.id) || e.target.tagName === 'BODY' || e.target.closest('#right-sidebar')) {
        e.preventDefault();
        var mainCtx = document.getElementById('desktop-context-menu');
        var appCtx = document.getElementById('app-context-menu');
        if (appCtx) appCtx.style.display = 'none';
        
        mainCtx.style.display = 'block';
        var x = e.pageX, y = e.pageY;
        if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
        if (y + 100 > window.innerHeight) y = window.innerHeight - 100;
        
        mainCtx.style.left = x + 'px';
        mainCtx.style.top = y + 'px';
    }
});

document.addEventListener('click', function(e) {
    var c = document.getElementById('desktop-context-menu');
    if (c && !c.contains(e.target)) c.style.display = 'none';
});

var DragSystem = {
    dragging: false,
    startPos: {x: 0, y: 0},
    sourceType: null,
    sourceEl: null,
    idx: null,
    appId: null,
    proxy: document.getElementById('drag-proxy'),
    pImg: document.getElementById('proxy-img'),
    badge: document.getElementById('folder-badge'),
    
    init: function() {
        window.addEventListener('mousemove', (e) => this.move(e));
        window.addEventListener('mouseup', (e) => this.end(e));
    },
    
    start: function(e, el, type, identifier) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = type;
        this.sourceEl = el;
        this.isDragMove = false;
        
        if (type === 'drawer' || type === 'dock') {
            this.appId = identifier;
        } else if (type === 'desktop') {
            this.idx = identifier;
            this.sourceEl.style.opacity = '0.5';
        }
    },
    
    startWinDrag: function(e, id) {
        this.startPos = {x: e.clientX, y: e.clientY};
        this.sourceType = 'window';
        this.sourceEl = document.getElementById('win-' + id);
        this.isDragMove = false;
    },
    
    move: function(e) {
        if (!this.sourceEl) return;
        var dx = Math.abs(e.clientX - this.startPos.x);
        var dy = Math.abs(e.clientY - this.startPos.y);
        
        if (dx > 3 || dy > 3) {
            this.dragging = true;
            this.isDragMove = true;
            
            if (this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
                if (this.sourceType === 'drawer') toggleAppDrawer();
                this.proxy.style.display = 'block';
                this.proxy.style.left = (e.clientX - 25) + 'px';
                this.proxy.style.top = (e.clientY - 25) + 'px';
                
                if (this.sourceType === 'drawer' || this.sourceType === 'dock') {
                    if (APPS[this.appId]) this.pImg.src = APPS[this.appId].icon;
                } else {
                    var dsItem = desktopLayout[this.idx];
                    if (dsItem.type === 'app') {
                        if (APPS[dsItem.id]) this.pImg.src = APPS[dsItem.id].icon;
                    } else {
                        this.pImg.src = '';
                        this.badge.style.display = 'flex';
                        this.badge.innerText = dsItem.apps.length;
                    }
                }
            }
        }
    },
    
    end: function(e) {
        if (!this.sourceEl) return;
        if (!this.isDragMove && this.sourceType === 'desktop') {
            this.reset();
            return;
        }
        if (!this.dragging) {
            this.reset();
            return;
        }
        
        if (this.sourceType === 'desktop' || this.sourceType === 'drawer' || this.sourceType === 'dock') {
            var nx = Math.round((e.clientX - 40) / 90) * 90;
            var ny = Math.round((e.clientY - 40) / 100) * 100;
            
            if (e.clientY > window.innerHeight - 80) {
                if (this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
            } else {
                var targetIdx = -1;
                var allApps = document.querySelectorAll('.desktop-app');
                
                for (var i = 0; i < allApps.length; i++) {
                    if (allApps[i] !== this.sourceEl) {
                        var r = allApps[i].getBoundingClientRect();
                        if (e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom) {
                            targetIdx = allApps[i].dataset.idx;
                        }
                    }
                }
                
                if (targetIdx > -1) {
                    var targetObj = desktopLayout[targetIdx];
                    var droppedApps = [];
                    if (this.sourceType === 'drawer' || this.sourceType === 'dock') droppedApps = [this.appId];
                    else droppedApps = desktopLayout[this.idx].type === 'app' ? [desktopLayout[this.idx].id] : desktopLayout[this.idx].apps;
                    
                    if (targetObj.type === 'app') {
                        targetObj.type = 'folder';
                        targetObj.apps = [targetObj.id].concat(droppedApps);
                        delete targetObj.id;
                    } else {
                        targetObj.apps.push.apply(targetObj.apps, droppedApps);
                    }
                    if (this.sourceType === 'desktop') desktopLayout.splice(this.idx, 1);
                } else {
                    if (this.sourceType === 'drawer' || this.sourceType === 'dock') {
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
        if (this.sourceEl) this.sourceEl.style.opacity = '1';
        this.sourceEl = null;
        this.proxy.style.display = 'none';
        this.badge.style.display = 'none';
    }
};
DragSystem.init();

window.toggleDesktopSize = function(isLarge) {
    if (isLarge) document.getElementById('desktop-area').classList.add('desktop-large-mode');
    else document.getElementById('desktop-area').classList.remove('desktop-large-mode');
    document.getElementById('desktop-context-menu').style.display = 'none';
};

var unlockedWallpapers = JSON.parse(localStorage.getItem('cine_unlocked_wp')) || ['default'];
window.wpMode = 'both';

function setWallpaper(k, notify = false) {
    var data = wallpaperRegistry[k];
    if (!data) return;
    
    if (notify && data.locked && !unlockedWallpapers.includes(data.id)) {
        unlockedWallpapers.push(data.id);
        localStorage.setItem('cine_unlocked_wp', JSON.stringify(unlockedWallpapers));
        alert("Wallpaper: [ " + data.name + " ] Unlocked.");
    }
    
    if (window.wpMode === 'home' || window.wpMode === 'both') {
        var bgV = document.getElementById('bg-video');
        var bgI = document.getElementById('bg-img');
        applyMediaToElements(data.url, bgV, bgI, true);
        updateSysSetting('homeWallpaper', k);
    }
    
    if (window.wpMode === 'lock' || window.wpMode === 'both') {
        var lV = document.getElementById('lock-video');
        var lI = document.getElementById('lock-img');
        applyMediaToElements(data.url, lV, lI, false);
        updateSysSetting('lockWallpaper', k);
    }
    
    updateWallpaperLoop();
    openWallpaperMenu();
}

function openWallpaperMenu() {
    var menu = document.getElementById('wallpaper-menu');
    var gUn = document.getElementById('wp-grid-unlocked');
    var gLock = document.getElementById('wp-grid-locked');
    
    gUn.innerHTML = '';
    gLock.innerHTML = '';
    
    for (var key in wallpaperRegistry) {
        var d = wallpaperRegistry[key];
        var isUnlocked = !d.locked || unlockedWallpapers.includes(d.id);
        var card = document.createElement('div');
        card.className = "wp-card " + (isUnlocked ? "" : "wp-locked");
        
        if (isUnlocked) {
            var mediaHtml = "";
            var isImg = d.url.match(/\.(png|jpg|jpeg|gif)$/i);
            if(isImg) {
                mediaHtml = '<img src="' + d.url + '">';
            } else {
                mediaHtml = '<video src="' + d.url + '" preload="auto" playsinline muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>';
            }
            
            card.innerHTML = mediaHtml + '<div class="wp-info">' + d.name + '</div>';
            card.setAttribute('data-key', key);
            card.onclick = function() {
                setWallpaper(this.getAttribute('data-key'));
                var cards = document.querySelectorAll('.wp-card');
                for (var j = 0; j < cards.length; j++) cards[j].classList.remove('active-wp');
                this.classList.add('active-wp');
            };
            gUn.appendChild(card);
        } else {
            card.innerHTML = '<div class="wp-info"><i class="fas fa-lock"></i></div>';
            gLock.appendChild(card);
        }
    }
    
    menu.classList.add('open');
    var chk = document.getElementById('wp-loop-chk');
    if (chk) {
        chk.checked = sysConfig.wpLoop;
        chk.onchange = function(e) { updateSysSetting('wpLoop', e.target.checked); };
    }
}

var searchInput = document.getElementById('start-search-input');
if (searchInput) {
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            var q = this.value.trim();
            if (wallpaperRegistry[q]) {
                setWallpaper(q, true);
                this.value = "";
                this.blur();
            }
        }
    });
}

function toggleStartMenu() {
    var sm = document.getElementById('start-menu');
    if (sm.classList.contains('open')) {
        sm.classList.remove('open');
        setTimeout(function() { sm.style.display = 'none'; }, 300);
    } else {
        sm.style.display = 'flex';
        setTimeout(function() { sm.classList.add('open'); }, 10);
    }
}
document.addEventListener('click', function(e) {
    var sm = document.getElementById('start-menu');
    if (sm && !sm.contains(e.target) && !e.target.closest('.dock-item')) {
        sm.classList.remove('open');
        setTimeout(function() { sm.style.display = 'none'; }, 300);
    }
});

var cvsSnow = document.getElementById('snow-fx');
if (cvsSnow) {
    var ctxSnow = cvsSnow.getContext('2d');
    var sW = window.innerWidth, sH = window.innerHeight;
    cvsSnow.width = sW; cvsSnow.height = sH;
    
    var flakes = [];
    for (var f = 0; f < 30; f++) {
        flakes.push({x: Math.random() * sW, y: Math.random() * sH, r: Math.random() * 2, s: Math.random() + 0.5});
    }
    function drawSnow() {
        if (isDesktopActive) {
            ctxSnow.clearRect(0, 0, sW, sH);
            ctxSnow.fillStyle = "rgba(255,255,255,0.3)";
            for (var i = 0; i < flakes.length; i++) {
                var fl = flakes[i];
                ctxSnow.beginPath();
                ctxSnow.arc(fl.x, fl.y, fl.r, 0, Math.PI * 2);
                ctxSnow.fill();
                fl.y += fl.s;
                if (fl.y > sH) fl.y = 0;
            }
        }
        requestAnimationFrame(drawSnow);
    }
    drawSnow();
}

var MODES = ['FAST', 'THINKING', 'LIVE'];
var currentModeIndex = 0;
var isCiriActive = false;
var holdTimer = null;
var hasBootedCiri = false;
var expectingApiKey = false;
var screenStream = null;
var currentImageBase64 = null;
var currentImageMime = null;

var uiBody = document.body;
var statusText = document.getElementById('status-text');
var statusIcon = document.getElementById('status-icon');
var chatInput = document.getElementById('chat-input');
var modeToggle = document.getElementById('mode-toggle');

var svgSecure = '<svg class="secure-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>';
var svgUnstable = '<svg class="unstable-svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

function checkApiKeyStatus() {
    if (localStorage.getItem('ciri_key')) {
        statusText.textContent = "Secure";
        statusText.className = "secure";
        statusIcon.innerHTML = svgSecure;
    } else {
        statusText.textContent = "Unstable";
        statusText.className = "unstable";
        statusIcon.innerHTML = svgUnstable;
    }
}
if (statusText) checkApiKeyStatus();

window.autoGrow = function(element) {
    element.style.height = "5px";
    element.style.height = (element.scrollHeight) + "px";
};

window.addEventListener('keydown', function(e) {
    if (e.altKey && (e.code === 'KeyS' || e.key.toLowerCase() === 's')) {
        if (!holdTimer && !isCiriActive) {
            holdTimer = setTimeout(function() {
                uiBody.classList.add('ciri-active');
                isCiriActive = true;
                if (!hasBootedCiri) {
                    var bootScreen = document.getElementById('ciri-boot-screen');
                    bootScreen.style.display = 'flex';
                    setTimeout(function() { document.getElementById('boot-ciri-text').classList.add('typing'); }, 300);
                    setTimeout(function() { document.getElementById('boot-sub-text').classList.add('show'); }, 1100);
                    setTimeout(function() {
                        document.getElementById('boot-loader').style.opacity = '1';
                        setTimeout(function() {
                            document.getElementById('boot-status-text').textContent = "Connection Established.";
                            document.getElementById('boot-spinner').style.display = 'none';
                            setTimeout(function() {
                                bootScreen.style.filter = 'blur(10px)';
                                bootScreen.style.opacity = '0';
                                setTimeout(function() {
                                    bootScreen.style.display = 'none';
                                    hasBootedCiri = true;
                                    chatInput.focus();
                                }, 800);
                            }, 1800);
                        }, 1000);
                    }, 2200);
                } else {
                    setTimeout(function() { chatInput.focus(); }, 100);
                }
            }, 2000);
        }
    } else if (e.code === 'Escape' && isCiriActive) {
        closeCiri();
    }
});

window.addEventListener('keyup', function(e) {
    if (e.code === 'KeyS' || e.key.toLowerCase() === 's' || e.key === 'Alt') {
        clearTimeout(holdTimer);
        holdTimer = null;
    }
});

window.closeCiri = function() {
    uiBody.classList.remove('ciri-active');
    isCiriActive = false;
};

var activeMedia = null;
var notiHideTimeout;
var cineNoti = document.getElementById('cine-noti');

function showNoti() {
    cineNoti.classList.add('active');
    cineNoti.classList.remove('minimized');
    document.getElementById('restore-btn').classList.remove('visible');
    resetNotiHideTimer();
}

function hideNoti() {
    cineNoti.classList.remove('active');
    cineNoti.classList.remove('minimized');
    document.getElementById('restore-btn').classList.remove('visible');
    clearTimeout(notiHideTimeout);
}

function resetNotiHideTimer() {
    clearTimeout(notiHideTimeout);
    if (cineNoti.classList.contains('active') && !cineNoti.classList.contains('minimized')) {
        notiHideTimeout = setTimeout(function() {
            cineNoti.classList.add('minimized');
            setTimeout(function() { document.getElementById('restore-btn').classList.add('visible'); }, 300);
        }, 5000);
    }
}

if (cineNoti) {
    cineNoti.addEventListener('mouseenter', function() { clearTimeout(notiHideTimeout); });
    cineNoti.addEventListener('mouseleave', resetNotiHideTimer);
    document.getElementById('minimize-noti-btn').onclick = function() {
        cineNoti.classList.add('minimized');
        setTimeout(function() { document.getElementById('restore-btn').classList.add('visible'); }, 300);
    };
    document.getElementById('restore-btn').onclick = function() {
        document.getElementById('restore-btn').classList.remove('visible');
        cineNoti.classList.remove('minimized');
        resetNotiHideTimer();
    };
    document.getElementById('close-noti-btn').onclick = function() {
        if (activeMedia) activeMedia.pause();
        hideNoti();
    };
}

setInterval(function() {
    var found = null;
    var allMedia = document.querySelectorAll('audio, video');
    for (var i = 0; i < allMedia.length; i++) {
        var m = allMedia[i];
        if (!m.paused && !m.muted && m.volume > 0 && !['bg-video', 'lock-video', 'boot-video'].includes(m.id)) {
            found = m;
        }
    }
    
    var iframes = document.querySelectorAll('iframe');
    for (var j = 0; j < iframes.length; j++) {
        try {
            var idoc = iframes[j].contentDocument || iframes[j].contentWindow.document;
            if (idoc) {
                var ifMedia = idoc.querySelectorAll('audio, video');
                for (var k = 0; k < ifMedia.length; k++) {
                    if (!ifMedia[k].paused && !ifMedia[k].muted && ifMedia[k].volume > 0) {
                        found = ifMedia[k];
                    }
                }
            }
        } catch (e) {}
    }
    
    isMediaPlaying = !!found;
    if (found !== activeMedia) {
        if (found) {
            activeMedia = found;
            setupMediaListeners();
            showNoti();
        } else {
            activeMedia = null;
            hideNoti();
        }
    }
    
    if (activeMedia) {
        document.getElementById('current-time').textContent = formatTime(activeMedia.currentTime);
        if (isFinite(activeMedia.duration) && activeMedia.duration > 0) {
            document.getElementById('progress-fill').style.width = ((activeMedia.currentTime / activeMedia.duration) * 100) + "%";
            document.getElementById('total-time').textContent = formatTime(activeMedia.duration);
        }
    }
}, 1000);

function setupMediaListeners() {
    if (!activeMedia) return;
    document.getElementById('noti-title').innerText = activeMedia.title || "Web Media Playing";
    
    document.getElementById('play-pause').onclick = function() {
        activeMedia.paused ? activeMedia.play() : activeMedia.pause();
        resetNotiHideTimer();
    };
    
    activeMedia.addEventListener('play', function() {
        document.getElementById('icon-play').style.display = 'none';
        document.getElementById('icon-pause').style.display = 'block';
        showNoti();
    });
    
    activeMedia.addEventListener('pause', function() {
        document.getElementById('icon-play').style.display = 'block';
        document.getElementById('icon-pause').style.display = 'none';
    });
    
    document.getElementById('skip-back').onclick = function() {
        if (isFinite(activeMedia.currentTime)) activeMedia.currentTime = Math.max(0, activeMedia.currentTime - 15);
        resetNotiHideTimer();
    };
    
    document.getElementById('skip-forward').onclick = function() {
        if (isFinite(activeMedia.duration) && activeMedia.duration > 0) {
            activeMedia.currentTime = Math.min(activeMedia.duration, activeMedia.currentTime + 15);
        }
        resetNotiHideTimer();
    };
    
    document.getElementById('progress-hit-area').onclick = function(e) {
        if (isFinite(activeMedia.duration) && activeMedia.duration > 0) {
            var rect = document.getElementById('progress-hit-area').getBoundingClientRect();
            var percent = (e.clientX - rect.left) / rect.width;
            activeMedia.currentTime = percent * activeMedia.duration;
        }
        resetNotiHideTimer();
    };
}

function formatTime(s) {
    if (isNaN(s) || !isFinite(s)) return "0:00";
    var m = Math.floor(s / 60);
    var se = Math.floor(s % 60);
    return m + ":" + se.toString().padStart(2, '0');
}

function drawFakeVisualizer() {
    requestAnimationFrame(drawFakeVisualizer);
    var cvs = document.getElementById('visualizer');
    if (!cvs) return;
    var ctx = cvs.getContext('2d');
    
    cvs.width = cvs.parentElement.clientWidth;
    cvs.height = 14;
    
    var buffLen = 32;
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    var barWidth = (cvs.width / buffLen) * 2;
    var xPosition = 0;
    
   for (var i = 0; i < buffLen; i++) {
            var barHeight = activeMedia && !activeMedia.paused ? (Math.random() * cvs.height) : 2;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.roundRect(xPosition, cvs.height - barHeight, barWidth - 1.5, barHeight, 2);
            ctx.fill();
            xPosition += barWidth;
        }
    }
drawFakeVisualizer();

var fpsLastTime = performance.now();
var fpsFrames = 0;
var fpsLowCount = 0;

function measureSystemFPS() {
    var now = performance.now();
    fpsFrames++;
    if (now - fpsLastTime >= 1000) {
        var currentFps = fpsFrames;
        var fpsVal = document.getElementById('fps-val');
        if (fpsVal) fpsVal.innerText = currentFps;

        if (currentFps <= 20) {
            fpsLowCount++;
            if (fpsLowCount >= 5 && !sysConfig.optBg) {
                sysConfig.optBg = true;
                localStorage.setItem('cine_sys_config', JSON.stringify(sysConfig));
                var bgV = document.getElementById('bg-video');
                var lV = document.getElementById('lock-video');
                if (bgV) bgV.pause();
                if (lV) lV.pause();
                showNotification("System Optimized", "Low FPS detected. Backgrounds paused.");
            }
        } else {
            fpsLowCount = 0;
        }
        
        fpsFrames = 0;
        fpsLastTime = now;
    }
    requestAnimationFrame(measureSystemFPS);
}
requestAnimationFrame(measureSystemFPS); 
