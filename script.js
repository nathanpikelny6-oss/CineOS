const TMDB_KEY = '3a73619bbb8fc6d47742d1b5b2b707b5';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

const safeStorage = {
    getItem: function(key) { try { return localStorage.getItem(key); } catch(e) { return null; } },
    setItem: function(key, val) { try { localStorage.setItem(key, val); } catch(e) {} }
};

let currentMedia = null;
let userId = safeStorage.getItem('ch_uid') || 'user_' + Math.floor(Math.random() * 99999);
safeStorage.setItem('ch_uid', userId);
let cwList = JSON.parse(safeStorage.getItem('ch_cw')) || [];
let wlList = JSON.parse(safeStorage.getItem('ch_wl')) || [];

function dbSaveLike(id, val) { safeStorage.setItem(`like_${id}`, val); }
function dbGetLike(id) { return safeStorage.getItem(`like_${id}`) || 'none'; }
function dbGetLikeCount(id) { return parseInt(safeStorage.getItem(`count_${id}`)) || Math.floor(Math.random() * 500) + 50; }
function dbSetLikeCount(id, count) { safeStorage.setItem(`count_${id}`, count); }
function dbGetComments(id) { return JSON.parse(safeStorage.getItem(`comments_${id}`)) || []; }
function dbAddComment(id, text) {
    let arr = dbGetComments(id);
    arr.unshift({ user: userId, text: text, date: new Date().toLocaleDateString() });
    safeStorage.setItem(`comments_${id}`, JSON.stringify(arr));
}

window.addEventListener("message", function (event) {
    try {
        let payload = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (payload && payload.type === "PLAYER_EVENT" && payload.data && payload.data.event === "timeupdate") {
            let mediaId = payload.data.id;
            safeStorage.setItem(`prog_${mediaId}`, payload.data.currentTime);
        }
    } catch(e) {}
});

async function api(path) {
    try {
        const res = await fetch(`${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`);
        if (!res.ok) return { results: [] };
        return await res.json();
    } catch(e) { return { results: [] }; }
}

const TODAY = new Date().toISOString().split('T')[0];
function filterRecentValid(arr) {
    return (arr || []).filter(i => {
        let date = i.release_date || i.first_air_date || "";
        if (!date || !i.poster_path) return false;
        return date >= "2010-01-01" && date <= TODAY;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-enter').onclick = () => {
        document.getElementById('enter-gate').style.opacity = '0';
        setTimeout(() => document.getElementById('enter-gate').style.display = 'none', 500);
        
        const introVideo = document.getElementById('intro-video');
        document.getElementById('intro-screen').style.opacity = '1';
        document.getElementById('intro-screen').style.pointerEvents = 'auto';
        introVideo.muted = false;
        introVideo.play().catch(()=>{ finishIntro(); });
        introVideo.onended = finishIntro;
        setTimeout(finishIntro, 5000); 
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

    document.getElementById('close-search').onclick = () => document.getElementById('search-overlay').classList.remove('active');
    let st;
    document.getElementById('search-input').oninput = (e) => {
        clearTimeout(st);
        st = setTimeout(async () => {
            const val = e.target.value.trim();
            if(!val) return document.getElementById('search-results').innerHTML = '';
            const res = await api(`/search/multi?query=${encodeURIComponent(val)}`);
            renderGridItems(filterRecentValid(res.results), 'search-results');
        }, 500);
    };

    document.querySelector('.close-modal').onclick = closeAll;
    document.getElementById('close-player').onclick = closeAll;
    document.getElementById('mark-finished').onclick = () => {
        if(currentMedia) { cwList = cwList.filter(i => (i.id||i.tmdbId) != (currentMedia.id||currentMedia.tmdbId)); safeStorage.setItem('ch_cw', JSON.stringify(cwList)); }
        closeAll(); loadHome();
    };
    
    document.querySelector('.hero-dl-btn').onclick = () => downloadMedia(currentMedia);
    document.getElementById('modal-download').onclick = () => downloadMedia(currentMedia);
}

function closeAll() {
    document.getElementById('details-modal').style.display = 'none';
    document.getElementById('player-overlay').style.display = 'none';
    document.getElementById('video-frame').src = '';
    document.body.style.overflow = 'auto';
}

async function loadHome() {
    const trending = await api(`/trending/all/week?page=${Math.floor(Math.random() * 3) + 1}`);
    const validTrending = filterRecentValid(trending.results);
    if(validTrending.length === 0) return;

    setupHero(validTrending[0]);
    const rows = document.getElementById('home-rows');
    rows.innerHTML = '';
    
    buildTop10Row(rows, validTrending.slice(0, 10));
    if (cwList.length > 0) buildRow(rows, 'Continue Watching', cwList, 'aspect-h', false);
    
    const action = await api(`/discover/movie?with_genres=28&primary_release_date.gte=2015-01-01&primary_release_date.lte=${TODAY}&sort_by=popularity.desc`);
    buildRow(rows, 'Action Thrillers', filterRecentValid(action.results), 'aspect-v');
    
    const comedy = await api(`/discover/movie?with_genres=35&primary_release_date.gte=2015-01-01&primary_release_date.lte=${TODAY}&sort_by=popularity.desc`);
    buildRow(rows, 'Comedies', filterRecentValid(comedy.results), 'aspect-v');
    
    const horror = await api(`/discover/movie?with_genres=27&primary_release_date.gte=2015-01-01&primary_release_date.lte=${TODAY}&sort_by=popularity.desc`);
    buildRow(rows, 'Chilling Horror', filterRecentValid(horror.results), 'aspect-v');
    
    const scifi = await api(`/discover/movie?with_genres=878&primary_release_date.gte=2015-01-01&primary_release_date.lte=${TODAY}&sort_by=popularity.desc`);
    buildRow(rows, 'Sci-Fi & Fantasy', filterRecentValid(scifi.results), 'aspect-h');
}

async function setupHero(item) {
    if (!item) return;
    currentMedia = item;
    document.getElementById('hero-img').src = item.backdrop_path ? IMG_BASE + item.backdrop_path : '';
    document.getElementById('hero-title').textContent = item.title || item.name || 'Unknown';
    document.getElementById('hero-desc').textContent = item.overview || '';
    
    document.querySelector('.hero-play-btn').onclick = () => playMedia(item);
    document.querySelector('.hero-info-btn').onclick = () => openModal(item);
}

function buildTop10Row(container, items) {
    if (!items || items.length === 0) return;
    const row = document.createElement('div');
    row.innerHTML = `
        <h2>Top 10 Trending Today</h2>
        <div class="row-wrapper">
            <button class="scroll-btn left"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="top-10-row"></div>
            <button class="scroll-btn right"><i class="fa-solid fa-chevron-right"></i></button>
        </div>`;
        
    const slider = row.querySelector('.top-10-row');
    items.forEach((item, index) => {
        if (!item.poster_path) return;
        const el = document.createElement('div'); el.className = 'top-10-card';
        el.innerHTML = `<span class="rank-number">${index + 1}</span><img src="${IMG_W500 + item.poster_path}">`;
        el.onclick = () => openModal(item);
        slider.appendChild(el);
    });
    
    row.querySelector('.scroll-btn.left').onclick = () => slider.scrollBy({ left: -600, behavior: 'smooth' });
    row.querySelector('.scroll-btn.right').onclick = () => slider.scrollBy({ left: 600, behavior: 'smooth' });
    container.appendChild(row);
}

function buildRow(container, title, items, aspectClass, isApiData = true) {
    if (!items || items.length === 0) return;
    const row = document.createElement('div'); row.className = `row`;
    row.innerHTML = `
        <h2>${title}</h2>
        <div class="row-wrapper">
            <button class="scroll-btn left"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="row-slider"></div>
            <button class="scroll-btn right"><i class="fa-solid fa-chevron-right"></i></button>
        </div>`;
        
    const slider = row.querySelector('.row-slider');
    items.forEach(item => {
        const imgPath = aspectClass === 'aspect-h' ? item.backdrop_path : item.poster_path;
        if(isApiData && !imgPath) return;
        const el = document.createElement('div'); el.className = `row-item ${aspectClass}`;
        el.innerHTML = `<img src="${isApiData ? IMG_W500 + imgPath : item.img}">`;
        el.onclick = () => openModal(item);
        slider.appendChild(el);
    });
    
    row.querySelector('.scroll-btn.left').onclick = () => slider.scrollBy({ left: -600, behavior: 'smooth' });
    row.querySelector('.scroll-btn.right').onclick = () => slider.scrollBy({ left: 600, behavior: 'smooth' });
    container.appendChild(row);
}

async function loadGrid(path, containerId) {
    const res = await api(`${path}?page=${Math.floor(Math.random()*3)+1}`);
    renderGridItems(filterRecentValid(res.results), containerId);
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
    items.forEach(item => {
        const el = document.createElement('div'); el.className = 'row-item aspect-v';
        el.innerHTML = `<img src="${IMG_W500 + item.poster_path}">`;
        el.onclick = () => { document.getElementById('search-overlay').classList.remove('active'); openModal(item); };
        grid.appendChild(el);
    });
}

async function openModal(item) {
    currentMedia = item;
    const isTv = item.media_type === 'tv' || !item.title;
    const id = item.id || item.tmdbId;
    const type = isTv ? 'tv' : 'movie';
    const details = await api(`/${type}/${id}?append_to_response=credits`);
    
    document.getElementById('modal-title').textContent = details.title || details.name || 'Unknown';
    document.getElementById('modal-date').textContent = (details.release_date || details.first_air_date || '').substring(0, 4);
    document.getElementById('modal-runtime').textContent = isTv ? `${details.number_of_seasons || 1} Seasons` : `${details.runtime || 0}m`;
    document.getElementById('modal-desc').textContent = details.overview || '';
    document.getElementById('modal-backdrop').src = details.backdrop_path ? IMG_BASE + details.backdrop_path : '';
    document.getElementById('modal-backdrop').style.opacity = '1';
    
    document.getElementById('modal-cast').innerHTML = details.credits?.cast?.slice(0, 8).map(c => c.name).join(', ') || 'Cast unavailable';

    const seriesSel = document.getElementById('series-selector');
    if (isTv && details.seasons) {
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
    if(!data.episodes) return;
    document.getElementById('episodes-list').innerHTML = data.episodes.map(ep => `
        <div class="episode-card" onclick="playMedia({id: ${tvId}, season: ${seasonNum}, ep: ${ep.episode_number}, type: 'tv', title: '${(ep.name||'').replace(/'/g,"\\'")}'})">
            <span class="ep-num">${ep.episode_number}</span>
            <img src="${ep.still_path ? IMG_W500+ep.still_path : 'https://via.placeholder.com/140x79/222/FFF?text=No+Image'}">
            <div class="ep-info">
                <div class="ep-info-header"><h4>${ep.name}</h4><span>${ep.runtime ? ep.runtime+'m' : ''}</span></div>
                <p>${ep.overview}</p>
            </div>
        </div>
    `).join('');
}

function playMedia(item) {
    document.getElementById('details-modal').style.display = 'none';
    
    const isTv = item.type === 'tv' || item.season;
    const id = item.tmdbId || item.id;
    let savedProgress = safeStorage.getItem(`prog_${id}`) || 0;
    
    let url = '';
    if(isTv) {
        let s = item.season || 1;
        let e = item.ep || 1;
        url = `https://vidlink.pro/tv/${id}/${s}/${e}?primaryColor=E50914&autoplay=true`;
    } else {
        url = `https://vidlink.pro/movie/${id}?primaryColor=E50914&autoplay=true`;
    }
    
    if (savedProgress > 0) url += `&progress=${Math.floor(savedProgress)}`;

    document.getElementById('player-title').textContent = item.title || item.name || 'Now Playing';
    document.getElementById('video-frame').src = url;
    document.getElementById('player-overlay').style.display = 'block';
    
    cwList = cwList.filter(i => (i.id||i.tmdbId) !== id);
    cwList.unshift({ id: id, title: item.title||item.name, img: item.backdrop_path ? IMG_W500+item.backdrop_path : (item.img||''), media_type: isTv?'tv':'movie' });
    safeStorage.setItem('ch_cw', JSON.stringify(cwList));
}

async function downloadMedia(item) {
    if(!item) return;
    const isTv = item.media_type === 'tv' || !item.title;
    const id = item.id || item.tmdbId;
    const query = encodeURIComponent(item.title || item.name);
    
    if (isTv) {
        window.open(`https://1337x.to/search/${query}/1/`, '_blank');
    } else {
        const details = await api(`/movie/${id}?append_to_response=external_ids`);
        if (details.external_ids?.imdb_id) {
            window.open(`https://yts.mx/movies/${query.replace(/%20/g, '-')}`, '_blank');
        } else {
            window.open(`https://1337x.to/search/${query}/1/`, '_blank');
        }
    }
}

async function playRandom() {
    const res = await api(`/movie/popular?page=${Math.floor(Math.random()*10)+1}`);
    const valid = filterRecentValid(res.results);
    if(valid.length > 0) {
        openModal(valid[Math.floor(Math.random()*valid.length)]);
    }
}

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

    wlBtn.onclick = () => { wlList.includes(id) ? wlList = wlList.filter(i=>i!==id) : wlList.push(id); safeStorage.setItem('ch_wl', JSON.stringify(wlList)); updateActionButtons(id); };
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
