const TMDB_KEY = '3a73619bbb8fc6d47742d1b5b2b707b5';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

// 8 Bulletproof API Servers
const SERVERS = [
    { id: 0, name: 'VidLink (Fastest)', url: 'https://vidlink.pro/{t}/{id}?primaryColor=E50914&autoplay=false' },
    { id: 1, name: 'SuperEmbed (HD)', url: 'https://multiembed.mov/?video_id={id}&tmdb=1' },
    { id: 2, name: 'AutoEmbed', url: 'https://player.autoembed.cc/embed/{t}/{id}' },
    { id: 3, name: 'EmbedSu', url: 'https://embed.su/embed/{t}/{id}' },
    { id: 4, name: 'VidSrc PRO', url: 'https://vidsrc.pro/embed/{t}/{id}' },
    { id: 5, name: 'VidSrc CC', url: 'https://vidsrc.cc/v2/embed/{t}/{id}' },
    { id: 6, name: 'SmashyStream', url: 'https://player.smashy.stream/{t}?tmdb={id}' },
    { id: 7, name: '2Embed', url: 'https://www.2embed.cc/embed/{t}/{id}' }
];

// Local DB System (Bulletproof)
let currentMedia = null;
let userId = localStorage.getItem('ch_uid') || 'user_' + Math.floor(Math.random() * 99999);
localStorage.setItem('ch_uid', userId);
let cwList = JSON.parse(localStorage.getItem('ch_cw')) || [];
let wlList = JSON.parse(localStorage.getItem('ch_wl')) || [];

function dbSaveLike(id, val) { localStorage.setItem(`like_${id}`, val); }
function dbGetLike(id) { return localStorage.getItem(`like_${id}`) || 'none'; }
function dbGetLikeCount(id) { return parseInt(localStorage.getItem(`count_${id}`)) || Math.floor(Math.random() * 500) + 50; }
function dbSetLikeCount(id, count) { localStorage.setItem(`count_${id}`, count); }
function dbGetComments(id) { return JSON.parse(localStorage.getItem(`comments_${id}`)) || []; }
function dbAddComment(id, text) {
    let arr = dbGetComments(id);
    arr.unshift({ user: userId, text: text, date: new Date().toLocaleDateString() });
    localStorage.setItem(`comments_${id}`, JSON.stringify(arr));
}

// YT Setup
let heroPlayer, modalPlayer;
function onYouTubeIframeAPIReady() {}

async function api(path) {
    try {
        const res = await fetch(`${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`);
        return await res.json();
    } catch(e) { return {results: []}; }
}

document.addEventListener('DOMContentLoaded', () => {
    // Audio Gate
    document.getElementById('btn-enter').onclick = () => {
        document.getElementById('enter-gate').style.opacity = '0';
        setTimeout(() => document.getElementById('enter-gate').style.display = 'none', 500);
        
        const introVideo = document.getElementById('intro-video');
        document.getElementById('intro-screen').style.opacity = '1';
        document.getElementById('intro-screen').style.pointerEvents = 'auto';
        introVideo.muted = false;
        introVideo.play().catch(()=>{ finishIntro(); });
        introVideo.onended = finishIntro;
        setTimeout(finishIntro, 5000); // Failsafe
    };

    function finishIntro() {
        const s = document.getElementById('intro-screen');
        s.style.opacity = '0';
        setTimeout(() => s.style.display = 'none', 800);
    }

    setupUI();
    loadHome();
});

function setupUI() {
    // Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const target = btn.dataset.target;
            if(target === 'search') { document.getElementById('search-overlay').classList.add('active'); document.getElementById('search-input').focus(); return; }
            if(target === 'random') { playRandom(); return; }
            
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById(`view-${target}`).classList.add('active');
            
            if(target === 'series') loadGrid('/tv/popular', 'series-grid');
            if(target === 'movies') loadGrid('/movie/popular', 'movies-grid');
            if(target === 'trending') loadGrid('/trending/all/week', 'trending-grid');
            if(target === 'watchlist') renderWatchlist();
            window.scrollTo(0,0);
        };
    });

    // Search
    document.getElementById('close-search').onclick = () => document.getElementById('search-overlay').classList.remove('active');
    let st;
    document.getElementById('search-input').oninput = (e) => {
        clearTimeout(st);
        st = setTimeout(async () => {
            const val = e.target.value.trim();
            if(!val) return document.getElementById('search-results').innerHTML = '';
            const res = await api(`/search/multi?query=${encodeURIComponent(val)}`);
            renderGridItems(res.results, 'search-results');
        }, 500);
    };

    // Modals
    document.querySelector('.close-modal').onclick = closeAll;
    document.getElementById('close-player').onclick = closeAll;
    document.getElementById('mark-finished').onclick = () => {
        if(currentMedia) { cwList = cwList.filter(i => (i.id||i.tmdbId) != (currentMedia.id||currentMedia.tmdbId)); localStorage.setItem('ch_cw', JSON.stringify(cwList)); }
        closeAll(); loadHome();
    };

    // Populate Servers Dropdowns
    const selects = [document.getElementById('server-select'), document.querySelector('.player-controls select')];
    selects.forEach(sel => {
        SERVERS.forEach(s => {
            const opt = document.createElement('option'); opt.value = s.id; opt.textContent = s.name;
            sel.appendChild(opt);
        });
        sel.onchange = () => { if(document.getElementById('player-overlay').style.display === 'block') playMedia(currentMedia); };
    });
}

function closeAll() {
    document.getElementById('details-modal').style.display = 'none';
    document.getElementById('player-overlay').style.display = 'none';
    document.getElementById('video-frame').src = '';
    document.body.style.overflow = 'auto';
    if(modalPlayer && modalPlayer.pauseVideo) modalPlayer.pauseVideo();
    if(heroPlayer && heroPlayer.playVideo) heroPlayer.playVideo();
}

// Data Loaders
async function loadHome() {
    const rPage = Math.floor(Math.random() * 3) + 1;
    const trending = await api(`/trending/all/day?page=${rPage}`);
    if(!trending.results) return;

    setupHero(trending.results[0]);
    const rows = document.getElementById('home-rows');
    rows.innerHTML = '';
    
    buildTop10Row(rows, trending.results.slice(0, 10));
    if (cwList.length > 0) buildRow(rows, 'Continue Watching', cwList, 'aspect-h', false);
    
    const action = await api(`/discover/movie?with_genres=28&page=${Math.floor(Math.random()*5)+1}`);
    buildRow(rows, 'Action Thrillers', action.results, 'aspect-v');
    const comedy = await api(`/discover/movie?with_genres=35&page=${Math.floor(Math.random()*5)+1}`);
    buildRow(rows, 'Comedies', comedy.results, 'aspect-v');
    const horror = await api(`/discover/movie?with_genres=27&page=${Math.floor(Math.random()*5)+1}`);
    buildRow(rows, 'Chilling Horror', horror.results, 'aspect-v');
    const scifi = await api(`/discover/movie?with_genres=878&page=${Math.floor(Math.random()*5)+1}`);
    buildRow(rows, 'Sci-Fi & Fantasy', scifi.results, 'aspect-h');
}

async function setupHero(item) {
    document.getElementById('hero-img').src = IMG_BASE + item.backdrop_path;
    document.getElementById('hero-title').textContent = item.title || item.name;
    document.getElementById('hero-desc').textContent = item.overview;
    
    document.querySelector('.hero-play-btn').onclick = () => playMedia(item);
    document.querySelector('.hero-info-btn').onclick = () => openModal(item);

    const details = await api(`/${item.media_type || 'movie'}/${item.id}?append_to_response=videos`);
    const trailer = details.videos?.results.find(v => v.type === 'Trailer');
    if(trailer) {
        document.getElementById('hero-video-wrapper').innerHTML = `<div id="hero-yt"></div>`;
        heroPlayer = new YT.Player('hero-yt', {
            videoId: trailer.key,
            playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, loop: 1, modestbranding: 1, playlist: trailer.key, mute: 1 },
            events: { onStateChange: (e) => { if(e.data === YT.PlayerState.PLAYING) document.getElementById('hero-video-wrapper').style.opacity = '1'; } }
        });
        const muteBtn = document.getElementById('hero-mute-btn');
        muteBtn.onclick = () => {
            if(heroPlayer.isMuted()) { heroPlayer.unMute(); muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; }
            else { heroPlayer.mute(); muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
        };
    }
}

// Row Builders
function buildTop10Row(container, items) {
    const row = document.createElement('div');
    row.innerHTML = `<h2>Top 10 Trending Today</h2><div class="top-10-row"></div>`;
    const slider = row.querySelector('.top-10-row');
    items.forEach((item, index) => {
        if (!item.poster_path) return;
        const el = document.createElement('div'); el.className = 'top-10-card';
        el.innerHTML = `<span class="rank-number">${index + 1}</span><img src="${IMG_W500 + item.poster_path}">`;
        el.onclick = () => openModal(item);
        slider.appendChild(el);
    });
    container.appendChild(row);
}

function buildRow(container, title, items, aspectClass, isApiData = true) {
    const row = document.createElement('div'); row.className = `row`;
    row.innerHTML = `<h2>${title}</h2><div class="row-slider"></div>`;
    const slider = row.querySelector('.row-slider');
    items.forEach(item => {
        const imgPath = aspectClass === 'aspect-h' ? item.backdrop_path : item.poster_path;
        if(isApiData && !imgPath) return;
        const el = document.createElement('div'); el.className = `row-item ${aspectClass}`;
        el.innerHTML = `<img src="${isApiData ? IMG_W500 + imgPath : item.img}">`;
        el.onclick = () => openModal(item);
        slider.appendChild(el);
    });
    container.appendChild(row);
}

async function loadGrid(path, containerId) {
    const res = await api(`${path}?page=${Math.floor(Math.random()*3)+1}`);
    renderGridItems(res.results, containerId);
}
async function renderWatchlist() {
    const items = [];
    for(let id of wlList) {
        const m = await api(`/movie/${id}`); if(m.id) items.push(m);
        else { const t = await api(`/tv/${id}`); if(t.id) items.push(t); }
    }
    renderGridItems(items, 'watchlist-grid');
}
function renderGridItems(items, containerId) {
    const grid = document.getElementById(containerId); grid.innerHTML = '';
    items.filter(i => i.poster_path && i.media_type !== 'person').forEach(item => {
        const el = document.createElement('div'); el.className = 'row-item aspect-v';
        el.innerHTML = `<img src="${IMG_W500 + item.poster_path}">`;
        el.onclick = () => { document.getElementById('search-overlay').classList.remove('active'); openModal(item); };
        grid.appendChild(el);
    });
}

// Modal
async function openModal(item) {
    currentMedia = item;
    const isTv = item.media_type === 'tv' || !item.title;
    const id = item.id || item.tmdbId;
    const type = isTv ? 'tv' : 'movie';
    const details = await api(`/${type}/${id}?append_to_response=videos,credits`);
    
    document.getElementById('modal-title').textContent = details.title || details.name;
    document.getElementById('modal-date').textContent = (details.release_date || details.first_air_date || '').substring(0, 4);
    document.getElementById('modal-runtime').textContent = isTv ? `${details.number_of_seasons} Seasons` : `${details.runtime}m`;
    document.getElementById('modal-desc').textContent = details.overview;
    document.getElementById('modal-backdrop').src = IMG_BASE + details.backdrop_path;
    document.getElementById('modal-backdrop').style.opacity = '1';
    
    if(heroPlayer && heroPlayer.pauseVideo) heroPlayer.pauseVideo();
    
    const trailer = details.videos?.results.find(v => v.type === 'Trailer');
    document.getElementById('modal-video-wrapper').innerHTML = '';
    document.getElementById('modal-video-wrapper').style.opacity = '0';
    if (trailer) {
        document.getElementById('modal-video-wrapper').innerHTML = `<div id="modal-yt"></div>`;
        modalPlayer = new YT.Player('modal-yt', {
            videoId: trailer.key,
            playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, loop: 1, modestbranding: 1, playlist: trailer.key, mute: 1 },
            events: {
                onStateChange: (e) => {
                    if(e.data === YT.PlayerState.PLAYING) {
                        document.getElementById('modal-video-wrapper').style.opacity = '1';
                        document.getElementById('modal-backdrop').style.opacity = '0';
                    }
                }
            }
        });
        const muteBtn = document.getElementById('modal-mute-btn');
        muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        muteBtn.onclick = () => {
            if(modalPlayer.isMuted()) { modalPlayer.unMute(); muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>'; }
            else { modalPlayer.mute(); muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
        };
    }

    // Comma separated cast
    document.getElementById('modal-cast').innerHTML = details.credits?.cast.slice(0, 8).map(c => c.name).join(', ') || '';

    const seriesSel = document.getElementById('series-selector');
    if (isTv) {
        seriesSel.classList.remove('hidden');
        const sel = document.getElementById('season-select');
        sel.innerHTML = details.seasons.filter(s=>s.season_number>0).map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('');
        sel.onchange = () => loadEpisodes(id, sel.value);
        if(details.seasons.length > 0) loadEpisodes(id, details.seasons.find(s=>s.season_number>0)?.season_number || 1);
    } else { seriesSel.classList.add('hidden'); }

    updateActionButtons(id);
    document.getElementById('details-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    document.getElementById('modal-play').onclick = () => playMedia(item);

    renderComments(id);
}

async function loadEpisodes(tvId, seasonNum) {
    const data = await api(`/tv/${tvId}/season/${seasonNum}`);
    document.getElementById('episodes-list').innerHTML = data.episodes.map(ep => `
        <div class="episode-card" onclick="playMedia({id: ${tvId}, season: ${seasonNum}, ep: ${ep.episode_number}, type: 'tv', title: '${ep.name.replace(/'/g,"\\'")}'})">
            <span class="ep-num">${ep.episode_number}</span>
            <img src="${ep.still_path ? IMG_W500+ep.still_path : 'https://via.placeholder.com/140x79/222/FFF?text=No+Image'}">
            <div class="ep-info">
                <div class="ep-info-header"><h4>${ep.name}</h4><span>${ep.runtime ? ep.runtime+'m' : ''}</span></div>
                <p>${ep.overview}</p>
            </div>
        </div>
    `).join('');
}

// Player
function playMedia(item) {
    document.getElementById('details-modal').style.display = 'none';
    if(heroPlayer && heroPlayer.pauseVideo) heroPlayer.pauseVideo();
    if(modalPlayer && modalPlayer.pauseVideo) modalPlayer.pauseVideo();
    
    const isTv = item.type === 'tv' || item.season;
    const id = item.tmdbId || item.id;
    
    // Sync dropdowns
    const mSel = document.getElementById('server-select');
    const pSel = document.querySelector('.player-controls select');
    pSel.value = mSel.value;

    const sObj = SERVERS.find(s => s.id == mSel.value) || SERVERS[0];
    let url = sObj.url.replace('{t}', isTv ? 'tv' : 'movie').replace('{id}', id);
    if(isTv) {
        // Handle VidLink URL formatting exception
        if(url.includes('vidlink.pro')) url = `https://vidlink.pro/tv/${id}/${item.season || 1}/${item.ep || 1}?primaryColor=E50914&autoplay=false`;
        else url = url.replace('{s}', item.season || 1).replace('{e}', item.ep || 1);
    }

    document.getElementById('player-title').textContent = item.title || item.name;
    document.getElementById('video-frame').src = url;
    document.getElementById('player-overlay').style.display = 'block';
    
    cwList = cwList.filter(i => (i.id||i.tmdbId) !== id);
    cwList.unshift({ id: id, title: item.title||item.name, img: item.backdrop_path ? IMG_W500+item.backdrop_path : (item.img||''), media_type: isTv?'tv':'movie' });
    localStorage.setItem('ch_cw', JSON.stringify(cwList));
}

async function playRandom() {
    const res = await api(`/movie/popular?page=${Math.floor(Math.random()*10)+1}`);
    const r = res.results[Math.floor(Math.random()*res.results.length)];
    openModal(r);
}

// Local DB Logic (Likes & Comments)
function updateActionButtons(id) {
    const wlBtn = document.getElementById('modal-watch-later');
    const lBtn = document.getElementById('modal-like');
    const dBtn = document.getElementById('modal-dislike');
    
    wlBtn.className = wlList.includes(id) ? 'btn-icon active' : 'btn-icon';
    wlBtn.innerHTML = wlList.includes(id) ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
    
    let status = dbGetLike(id);
    lBtn.className = status === 'like' ? 'btn-icon active' : 'btn-icon';
    lBtn.innerHTML = status === 'like' ? '<i class="fa-solid fa-thumbs-up"></i>' : '<i class="fa-regular fa-thumbs-up"></i>';
    dBtn.className = status === 'dislike' ? 'btn-icon active' : 'btn-icon';
    dBtn.innerHTML = status === 'dislike' ? '<i class="fa-solid fa-thumbs-down"></i>' : '<i class="fa-regular fa-thumbs-down"></i>';
    document.getElementById('like-count').textContent = dbGetLikeCount(id);

    wlBtn.onclick = () => { wlList.includes(id) ? wlList = wlList.filter(i=>i!==id) : wlList.push(id); localStorage.setItem('ch_wl', JSON.stringify(wlList)); updateActionButtons(id); };
    lBtn.onclick = () => handleVote(id, 'like');
    dBtn.onclick = () => handleVote(id, 'dislike');
}

function handleVote(id, type) {
    let current = dbGetLike(id);
    let count = dbGetLikeCount(id);
    
    if(type === 'like') {
        if(current === 'like') { dbSaveLike(id, 'none'); dbSetLikeCount(id, count-1); }
        else { dbSaveLike(id, 'like'); dbSetLikeCount(id, current==='dislike' ? count+1 : count+1); }
    } else {
        if(current === 'dislike') { dbSaveLike(id, 'none'); }
        else { dbSaveLike(id, 'dislike'); if(current==='like') dbSetLikeCount(id, count-1); }
    }
    updateActionButtons(id);
}

function renderComments(id) {
    const arr = dbGetComments(id);
    document.getElementById('comments-list').innerHTML = arr.map(c => `
        <div class="comment-item">
            <div class="comment-meta">Anon ${c.user.substr(0,4)} • ${c.date}</div>
            <div>${c.text}</div>
        </div>
    `).join('');
}

document.getElementById('post-comment').onclick = () => {
    const input = document.getElementById('new-comment');
    if(!input.value.trim() || !currentMedia) return;
    const id = currentMedia.id || currentMedia.tmdbId;
    dbAddComment(id, input.value);
    input.value = '';
    renderComments(id);
};
