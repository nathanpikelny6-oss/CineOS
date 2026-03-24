const TMDB_KEY = "3a73619bbb8fc6d47742d1b5b2b707b5";
const URL_BASE = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/";
const CRUNCHYROLL_URL = "https://"; 

let state = {
    myList: JSON.parse(localStorage.getItem('streamx_list')) || [],
    continueWatching: JSON.parse(localStorage.getItem('streamx_cw')) || [],
    likes: JSON.parse(localStorage.getItem('streamx_likes')) || [],
    dislikes: JSON.parse(localStorage.getItem('streamx_dislikes')) || [],
    activeMedia: null
};

const dom = {
    rows: document.getElementById('rows-container'),
    modal: document.getElementById('detail-modal'),
    player: document.getElementById('player-modal'),
    frame: document.getElementById('video-frame'),
    prompt: document.getElementById('completion-prompt')
};

const randPage = () => Math.floor(Math.random() * 4) + 1;

async function fetchAPI(endpoint) {
    const res = await fetch(`${URL_BASE}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`);
    return res.json();
}

async function init() {
    setupListeners();
    await loadHero();
    
    if (state.continueWatching.length > 0) {
        buildRow('Continue Watching', state.continueWatching, true);
    }
    
    const trending = await fetchAPI(`/trending/all/day?page=${randPage()}`);
    buildRow('Trending Now', trending.results, false, true);

    const movies = await fetchAPI(`/discover/movie?with_genres=28&page=${randPage()}`);
    buildRow('High Octane Action', movies.results, true);

    const tv = await fetchAPI(`/discover/tv?with_networks=213&page=${randPage()}`);
    buildRow('Binge-Worthy Shows', tv.results, false);

    const sci = await fetchAPI(`/discover/movie?with_genres=878&page=${randPage()}`);
    buildRow('Sci-Fi Masterpieces', sci.results, true);
    
    startChatSim();
}

async function loadHero() {
    const data = await fetchAPI('/trending/all/week');
    const main = data.results[Math.floor(Math.random() * 5)];
    document.getElementById('hero-title').textContent = main.title || main.name;
    document.getElementById('hero-desc').textContent = main.overview;
    
    const playBtn = document.getElementById('hero-play');
    const infoBtn = document.getElementById('hero-info');
    
    playBtn.onclick = () => openPlayer(main.media_type || 'movie', main.id);
    infoBtn.onclick = () => openDetail(main);
}

function buildRow(title, items, isHorizontal, isTop10 = false) {
    if (!items || !items.length) return;
    
    const sec = document.createElement('div');
    sec.className = 'row-section';
    sec.innerHTML = `<h2 class="row-title">${title}</h2>`;
    
    const slider = document.createElement('div');
    slider.className = `row-slider ${isHorizontal ? 'row-horizontal' : 'row-vertical'} ${isTop10 ? 'top-10-row' : ''}`;
    
    items.slice(0, 15).forEach((item, idx) => {
        if (!item.poster_path && !item.backdrop_path) return;
        
        const card = document.createElement('div');
        card.className = 'card';
        
        const imgPath = isHorizontal ? (item.backdrop_path || item.poster_path) : (item.poster_path || item.backdrop_path);
        const imgSize = isHorizontal ? 'w780' : 'w500';
        
        let innerHTML = `<img loading="lazy" src="${IMG_URL}${imgSize}${imgPath}">`;
        if (isTop10 && idx < 10) innerHTML += `<div class="top-10-num">${idx + 1}</div>`;
        
        card.innerHTML = innerHTML;
        card.onclick = () => openDetail(item);
        
        let hoverTimeout;
        card.onmouseenter = () => {
            hoverTimeout = setTimeout(() => {
                const vid = document.createElement('video');
                vid.src = 'Netflix.mp4';
                vid.className = 'card-video-preview';
                vid.autoplay = true;
                vid.loop = true;
                vid.muted = true;
                card.appendChild(vid);
            }, 600);
        };
        card.onmouseleave = () => {
            clearTimeout(hoverTimeout);
            const vid = card.querySelector('video');
            if (vid) vid.remove();
        };

        slider.appendChild(card);
    });
    
    sec.appendChild(slider);
    dom.rows.appendChild(sec);
}

async function openDetail(item) {
    state.activeMedia = item;
    const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
    const details = await fetchAPI(`/${type}/${item.id}?append_to_response=credits,recommendations`);
    
    document.getElementById('modal-title').textContent = item.title || item.name;
    document.getElementById('modal-desc').textContent = item.overview;
    
    const cast = details.credits?.cast?.slice(0, 5).map(c => c.name).join(', ') || '';
    document.getElementById('modal-cast').innerHTML = `<strong>Cast:</strong> ${cast}`;
    
    const lCount = ((item.id * 73) % 9000) + 1200 + (state.likes.includes(item.id) ? 1 : 0);
    document.getElementById('modal-likes-count').textContent = `${lCount} Likes`;

    updateActionButtons(item.id);

    document.getElementById('modal-play').onclick = () => openPlayer(type, item.id);
    document.getElementById('modal-add-list').onclick = () => toggleList(item);
    document.getElementById('modal-like').onclick = () => toggleInteract(item.id, 'likes', 'dislikes');
    document.getElementById('modal-dislike').onclick = () => toggleInteract(item.id, 'dislikes', 'likes');

    const seasonsBox = document.getElementById('seasons-container');
    if (type === 'tv' && details.seasons) {
        seasonsBox.classList.remove('hidden');
        renderSeasons(item.id, details.seasons);
    } else {
        seasonsBox.classList.add('hidden');
    }

    const recsBox = document.getElementById('modal-recs');
    recsBox.innerHTML = '';
    details.recommendations?.results?.slice(0, 6).forEach(rec => {
        if (!rec.backdrop_path) return;
        const div = document.createElement('div');
        div.className = 'card';
        div.style.aspectRatio = '16/9';
        div.innerHTML = `<img src="${IMG_URL}w500${rec.backdrop_path}">`;
        div.onclick = () => { dom.modal.classList.remove('active'); setTimeout(() => openDetail(rec), 300); };
        recsBox.appendChild(div);
    });

    dom.modal.classList.add('active');
}

async function renderSeasons(tvId, seasons) {
    const sel = document.getElementById('season-selector');
    sel.innerHTML = '';
    const valid = seasons.filter(s => s.season_number > 0);
    
    valid.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.season_number;
        opt.textContent = s.name;
        sel.appendChild(opt);
    });

    sel.onchange = () => loadEpisodes(tvId, sel.value);
    if (valid.length) loadEpisodes(tvId, valid[0].season_number);
}

async function loadEpisodes(tvId, sNum) {
    const data = await fetchAPI(`/tv/${tvId}/season/${sNum}`);
    const list = document.getElementById('episodes-list');
    list.innerHTML = '';
    
    data.episodes.forEach(ep => {
        const item = document.createElement('div');
        item.className = 'ep-item';
        const img = ep.still_path ? `${IMG_URL}w300${ep.still_path}` : 'https://via.placeholder.com/300x170?text=No+Image';
        item.innerHTML = `
            <img class="ep-img" src="${img}">
            <div class="ep-details">
                <div class="ep-title">${ep.episode_number}. ${ep.name}</div>
                <div class="ep-desc">${ep.overview || 'No description available.'}</div>
            </div>
        `;
        item.onclick = () => openPlayer('tv', tvId, sNum, ep.episode_number);
        list.appendChild(item);
    });
}

function openPlayer(type, id, s = 1, e = 1) {
    if (dom.modal.classList.contains('active')) {
        dom.modal.querySelector('video').pause();
    }
    
    const url = type === 'movie' ? `https://vidsrc.pro/embed/movie/${id}` : `https://vidsrc.pro/embed/tv/${id}/${s}/${e}`;
    dom.frame.src = url;
    dom.player.classList.remove('hidden');
    dom.player.style.opacity = '1';
    dom.player.style.pointerEvents = 'all';
    
    const cwItem = state.continueWatching.find(i => i.id === id);
    if (!cwItem && state.activeMedia) {
        state.continueWatching.unshift(state.activeMedia);
        localStorage.setItem('streamx_cw', JSON.stringify(state.continueWatching));
    }
}

function closePlayerHandler() {
    dom.frame.src = '';
    dom.player.style.opacity = '0';
    dom.player.style.pointerEvents = 'none';
    if (dom.modal.classList.contains('active')) {
        dom.modal.querySelector('video').play();
    }
    dom.prompt.classList.remove('hidden');
}

function setupListeners() {
    document.querySelector('.close-modal').onclick = () => {
        dom.modal.classList.remove('active');
        dom.modal.querySelector('video').pause();
    };
    
    document.querySelector('.close-player').onclick = closePlayerHandler;
    
    document.getElementById('btn-keep-watching').onclick = () => {
        dom.prompt.classList.add('hidden');
        location.reload();
    };
    
    document.getElementById('btn-mark-watched').onclick = () => {
        if (state.activeMedia) {
            state.continueWatching = state.continueWatching.filter(i => i.id !== state.activeMedia.id);
            localStorage.setItem('streamx_cw', JSON.stringify(state.continueWatching));
        }
        dom.prompt.classList.add('hidden');
        location.reload();
    };

    const chatWidget = document.getElementById('chat-widget');
    document.getElementById('chat-toggle').onclick = () => chatWidget.classList.toggle('open');
    
    document.getElementById('chat-send').onclick = sendChat;
    document.getElementById('chat-input').onkeypress = (e) => { if (e.key === 'Enter') sendChat(); };

    document.getElementById('nav-crunchy').onclick = (e) => {
        e.preventDefault();
        if(CRUNCHYROLL_URL.trim() === "" || CRUNCHYROLL_URL === "#" || CRUNCHYROLL_URL === "https://") {
            showToast("Not available yet - Under Construction");
        } else {
            window.open(CRUNCHYROLL_URL, "_blank");
        }
    };
    
    document.getElementById('nav-shuffle').onclick = async (e) => {
        e.preventDefault();
        const data = await fetchAPI(`/discover/movie?page=${Math.floor(Math.random() * 50) + 1}`);
        const rnd = data.results[Math.floor(Math.random() * data.results.length)];
        openDetail(rnd);
    };
}

function toggleList(item) {
    const idx = state.myList.findIndex(i => i.id === item.id);
    if (idx > -1) state.myList.splice(idx, 1);
    else state.myList.push(item);
    localStorage.setItem('streamx_list', JSON.stringify(state.myList));
    updateActionButtons(item.id);
}

function toggleInteract(id, addTo, removeFrom) {
    state[removeFrom] = state[removeFrom].filter(i => i !== id);
    if (state[addTo].includes(id)) {
        state[addTo] = state[addTo].filter(i => i !== id);
    } else {
        state[addTo].push(id);
    }
    localStorage.setItem(`streamx_${addTo}`, JSON.stringify(state[addTo]));
    localStorage.setItem(`streamx_${removeFrom}`, JSON.stringify(state[removeFrom]));
    updateActionButtons(id);
    
    const countEl = document.getElementById('modal-likes-count');
    const base = ((id * 73) % 9000) + 1200;
    countEl.textContent = `${base + (state.likes.includes(id) ? 1 : 0)} Likes`;
}

function updateActionButtons(id) {
    const lbtn = document.getElementById('modal-add-list');
    lbtn.innerHTML = state.myList.some(i => i.id === id) ? '<i class="fas fa-check"></i>' : '<i class="fas fa-plus"></i>';
    
    document.getElementById('modal-like').className = `icon-btn ${state.likes.includes(id) ? 'active' : ''}`;
    document.getElementById('modal-dislike').className = `icon-btn ${state.dislikes.includes(id) ? 'active' : ''}`;
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function sendChat() {
    const inp = document.getElementById('chat-input');
    const txt = inp.value.trim();
    if (!txt) return;
    
    const chat = document.getElementById('chat-messages');
    chat.innerHTML += `<div class="msg user">${txt}</div>`;
    inp.value = '';
    chat.scrollTop = chat.scrollHeight;
}

function startChatSim() {
    const phrases = ["This movie is insane", "Anyone watching the new season?", "Wow that ending...", "No spoilers pls!", "10/10 highly recommend"];
    setInterval(() => {
        const chat = document.getElementById('chat-messages');
        const txt = phrases[Math.floor(Math.random() * phrases.length)];
        chat.innerHTML += `<div class="msg sys">${txt}</div>`;
        chat.scrollTop = chat.scrollHeight;
    }, 15000);
}

init();
