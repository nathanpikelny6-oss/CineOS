const TMDB_KEY = '3a73619bbb8fc6d47742d1b5b2b707b5';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p/original';
const IMG_W500 = 'https://image.tmdb.org/t/p/w500';

/* IMPORTANT: Replace these with your actual Supabase URL and Anon Key */
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';
let supabase = null;

if (SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
}

let userId = localStorage.getItem('nexus_uid');
if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('nexus_uid', userId);
}

let continueWatching = JSON.parse(localStorage.getItem('nexus_cw')) || [];
let watchLater = JSON.parse(localStorage.getItem('nexus_wl')) || [];
let likedMedia = JSON.parse(localStorage.getItem('nexus_likes')) || [];
let dislikedMedia = JSON.parse(localStorage.getItem('nexus_dislikes')) || [];

let currentMedia = null;

document.addEventListener('DOMContentLoaded', () => {
    const introVideo = document.getElementById('intro-video');
    const introScreen = document.getElementById('intro-screen');
    
    introVideo.play().catch(() => {
        hideIntro();
    });

    introVideo.onended = hideIntro;
    setTimeout(hideIntro, 5000);

    function hideIntro() {
        introScreen.style.opacity = '0';
        setTimeout(() => introScreen.style.display = 'none', 800);
    }

    initApp();
});

async function initApp() {
    setupEventListeners();
    await loadMainContent();
    if(supabase) subscribeToGlobalChat();
}

async function api(path) {
    const res = await fetch(`${TMDB_BASE}${path}${path.includes('?') ? '&' : '?'}api_key=${TMDB_KEY}`);
    return res.json();
}

async function loadMainContent() {
    const trending = await api('/trending/all/day');
    const heroItem = trending.results[Math.floor(Math.random() * 5)];
    renderHero(heroItem);

    const rows = document.getElementById('main-rows');
    rows.innerHTML = '';

    if (continueWatching.length > 0) {
        buildRow(rows, 'Continue Watching', continueWatching, 'aspect-h', false);
    }

    if (likedMedia.length > 0) {
        const recs = await api(`/movie/${likedMedia[0]}/recommendations`);
        if(recs.results && recs.results.length > 0) {
            buildRow(rows, 'Because You Liked...', recs.results, 'aspect-h');
        }
    }

    buildRow(rows, 'Trending Now', trending.results, 'aspect-h');
    
    const popularMovies = await api('/movie/popular');
    buildRow(rows, 'Blockbuster Movies', popularMovies.results, 'aspect-v');

    const topShows = await api('/tv/top_rated');
    buildRow(rows, 'Critically Acclaimed Series', topShows.results, 'aspect-h');

    const action = await api('/discover/movie?with_genres=28');
    buildRow(rows, 'Action & Adventure', action.results, 'aspect-v');
}

function renderHero(item) {
    const title = item.title || item.name;
    const bg = item.backdrop_path ? `${IMG_BASE}${item.backdrop_path}` : '';
    document.getElementById('hero').style.backgroundImage = `url(${bg})`;
    document.getElementById('hero-title').textContent = title;
    document.getElementById('hero-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${(item.vote_average || 0).toFixed(1)}`;
    document.getElementById('hero-year').textContent = (item.release_date || item.first_air_date || '').substring(0, 4);
    document.getElementById('hero-desc').textContent = item.overview;

    document.getElementById('hero-play').onclick = () => playMedia(item);
    document.getElementById('hero-info').onclick = () => openModal(item);
}

function buildRow(container, title, items, aspectClass, extractType = true) {
    const row = document.createElement('div');
    row.className = `row ${aspectClass}`;
    row.innerHTML = `<h2>${title}</h2><div class="row-slider"></div>`;
    const slider = row.querySelector('.row-slider');

    items.forEach(item => {
        if (!item.backdrop_path && !item.poster_path && extractType) return;
        const imgPath = aspectClass === 'aspect-h' ? item.backdrop_path : item.poster_path;
        if(!imgPath && extractType) return;

        const el = document.createElement('div');
        el.className = 'row-item';
        el.innerHTML = `
            <img src="${extractType ? IMG_W500 + imgPath : item.img}" loading="lazy">
            <div class="item-overlay"><h4>${item.title || item.name || ''}</h4></div>
        `;
        
        let timeout;
        el.onmouseenter = () => {
            timeout = setTimeout(() => openModal(item), 800);
        };
        el.onmouseleave = () => clearTimeout(timeout);
        el.onclick = () => openModal(item);

        slider.appendChild(el);
    });
    container.appendChild(row);
}

async function openModal(item) {
    currentMedia = item;
    const isTv = item.media_type === 'tv' || !item.title;
    const id = item.id || item.tmdbId;
    const type = isTv ? 'tv' : 'movie';

    const details = await api(`/${type}/${id}?append_to_response=videos,credits`);
    
    document.getElementById('modal-title').textContent = details.title || details.name;
    document.getElementById('modal-rating').innerHTML = `<i class="fa-solid fa-star"></i> ${details.vote_average.toFixed(1)}`;
    document.getElementById('modal-runtime').textContent = isTv ? `${details.number_of_seasons} Seasons` : `${details.runtime} min`;
    document.getElementById('modal-date').textContent = (details.release_date || details.first_air_date).substring(0, 4);
    document.getElementById('modal-desc').textContent = details.overview;
    document.getElementById('modal-backdrop').src = IMG_BASE + details.backdrop_path;
    
    const trailer = details.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
    const iframe = document.getElementById('modal-trailer');
    if (trailer) {
        iframe.src = `https://piped.video/embed/${trailer.key}?autoplay=1&controls=0&loop=1&mute=1`;
        setTimeout(() => iframe.style.opacity = '1', 1500);
    } else {
        iframe.style.opacity = '0';
        iframe.src = '';
    }

    const castDiv = document.getElementById('modal-cast');
    castDiv.innerHTML = details.credits.cast.slice(0, 5).map(c => `<div>${c.name}</div>`).join('');

    const seriesSel = document.getElementById('series-selector');
    if (isTv) {
        seriesSel.classList.remove('hidden');
        const sel = document.getElementById('season-select');
        sel.innerHTML = details.seasons.filter(s=>s.season_number>0).map(s => `<option value="${s.season_number}">Season ${s.season_number}</option>`).join('');
        sel.onchange = () => loadEpisodes(id, sel.value);
        if(details.seasons.length > 0) loadEpisodes(id, details.seasons.find(s=>s.season_number>0)?.season_number || 1);
    } else {
        seriesSel.classList.add('hidden');
    }

    updateActionButtons(id);
    document.getElementById('details-modal').style.display = 'block';
    document.body.style.overflow = 'hidden';

    document.getElementById('modal-play').onclick = () => playMedia(item);

    if (supabase) {
        loadComments(id);
        fetchLikes(id);
    }
}

async function loadEpisodes(tvId, seasonNum) {
    const data = await api(`/tv/${tvId}/season/${seasonNum}`);
    const list = document.getElementById('episodes-list');
    list.innerHTML = data.episodes.map(ep => `
        <div class="episode-card" onclick="playMedia({id: ${tvId}, season: ${seasonNum}, ep: ${ep.episode_number}, type: 'tv', title: '${ep.name.replace(/'/g,"\\'")}'})">
            <img class="ep-img" src="${ep.still_path ? IMG_W500+ep.still_path : ''}" onerror="this.src='https://via.placeholder.com/130x73?text=No+Image'">
            <div class="ep-info">
                <h4>${ep.episode_number}. ${ep.name}</h4>
                <p>${ep.overview}</p>
            </div>
        </div>
    `).join('');
}

function playMedia(item) {
    document.getElementById('details-modal').style.display = 'none';
    const isTv = item.type === 'tv' || item.season;
    const id = item.tmdbId || item.id;
    let url = `https://embed.su/embed/movie/${id}`;
    
    if (isTv) {
        const s = item.season || 1;
        const e = item.ep || 1;
        url = `https://embed.su/embed/tv/${id}/${s}/${e}`;
    }

    const overlay = document.getElementById('player-overlay');
    document.getElementById('video-frame').src = url;
    overlay.style.display = 'block';
    
    addToContinueWatching(item);
}

function addToContinueWatching(item) {
    const id = item.id || item.tmdbId;
    continueWatching = continueWatching.filter(i => (i.id || i.tmdbId) !== id);
    continueWatching.unshift({
        id: id,
        title: item.title || item.name,
        img: item.backdrop_path ? IMG_W500+item.backdrop_path : (item.img || ''),
        media_type: item.media_type || (item.season ? 'tv' : 'movie')
    });
    localStorage.setItem('nexus_cw', JSON.stringify(continueWatching));
}

function removeFromContinueWatching(id) {
    continueWatching = continueWatching.filter(i => (i.id || i.tmdbId) != id);
    localStorage.setItem('nexus_cw', JSON.stringify(continueWatching));
    loadMainContent();
}

function updateActionButtons(id) {
    const wlBtn = document.getElementById('modal-watch-later');
    const likeBtn = document.getElementById('modal-like');
    const dislikeBtn = document.getElementById('modal-dislike');

    wlBtn.className = watchLater.includes(id) ? 'btn-icon active' : 'btn-icon';
    wlBtn.innerHTML = watchLater.includes(id) ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-plus"></i>';
    
    likeBtn.className = likedMedia.includes(id) ? 'btn-icon active' : 'btn-icon';
    dislikeBtn.className = dislikedMedia.includes(id) ? 'btn-icon active' : 'btn-icon';

    wlBtn.onclick = () => {
        if(watchLater.includes(id)) watchLater = watchLater.filter(i => i !== id);
        else watchLater.push(id);
        localStorage.setItem('nexus_wl', JSON.stringify(watchLater));
        updateActionButtons(id);
    };

    likeBtn.onclick = () => handleVote(id, 'like');
    dislikeBtn.onclick = () => handleVote(id, 'dislike');
}

async function handleVote(id, type) {
    if(type === 'like') {
        if(likedMedia.includes(id)) likedMedia = likedMedia.filter(i=>i!==id);
        else { likedMedia.push(id); dislikedMedia = dislikedMedia.filter(i=>i!==id); }
    } else {
        if(dislikedMedia.includes(id)) dislikedMedia = dislikedMedia.filter(i=>i!==id);
        else { dislikedMedia.push(id); likedMedia = likedMedia.filter(i=>i!==id); }
    }
    
    localStorage.setItem('nexus_likes', JSON.stringify(likedMedia));
    localStorage.setItem('nexus_dislikes', JSON.stringify(dislikedMedia));
    updateActionButtons(id);

    if(supabase) {
        const { data } = await supabase.from('likes').select('like_count').eq('movie_id', id).single();
        let currentCount = data ? data.like_count : 0;
        currentCount += (type === 'like' && likedMedia.includes(id)) ? 1 : (type==='like' ? -1 : 0);
        await supabase.from('likes').upsert({ movie_id: id, like_count: currentCount > 0 ? currentCount : 0 });
        fetchLikes(id);
    }
}

async function fetchLikes(id) {
    const { data } = await supabase.from('likes').select('like_count').eq('movie_id', id).single();
    document.getElementById('like-count').textContent = data ? data.like_count : 0;
}

async function loadComments(id) {
    const { data } = await supabase.from('comments').select('*').eq('movie_id', id).order('created_at', { ascending: false });
    const list = document.getElementById('comments-list');
    if(!data) return;
    list.innerHTML = data.map(c => `
        <div class="comment-item">
            <div class="comment-meta">Anon ${c.user_id.substr(0,4)} • ${new Date(c.created_at).toLocaleDateString()}</div>
            <div>${c.text}</div>
        </div>
    `).join('');
}

document.getElementById('post-comment').onclick = async () => {
    if(!supabase) return alert("Backend not connected.");
    const input = document.getElementById('new-comment');
    if(!input.value.trim() || !currentMedia) return;
    
    const id = currentMedia.id || currentMedia.tmdbId;
    await supabase.from('comments').insert({ movie_id: id, text: input.value, user_id: userId });
    input.value = '';
    loadComments(id);
};

function setupEventListeners() {
    document.querySelector('.close-modal').onclick = () => {
        document.getElementById('details-modal').style.display = 'none';
        document.getElementById('modal-trailer').src = '';
        document.body.style.overflow = 'auto';
    };

    document.getElementById('close-player').onclick = () => {
        document.getElementById('player-overlay').style.display = 'none';
        document.getElementById('video-frame').src = '';
        document.body.style.overflow = 'auto';
        loadMainContent();
    };

    document.getElementById('mark-finished').onclick = () => {
        if(currentMedia) removeFromContinueWatching(currentMedia.id || currentMedia.tmdbId);
        document.getElementById('close-player').click();
    };

    document.getElementById('btn-random').onclick = async () => {
        const page = Math.floor(Math.random() * 20) + 1;
        const res = await api(`/movie/popular?page=${page}`);
        const rnd = res.results[Math.floor(Math.random() * res.results.length)];
        openModal(rnd);
    };

    document.getElementById('btn-crunchyroll').onclick = () => {
        const url = '#';
        if(url === '#') alert("Crunchyroll integration is currently Under Construction!");
        else window.location.href = url;
    };

    const chatPanel = document.getElementById('chat-panel');
    document.getElementById('btn-chat').onclick = () => chatPanel.classList.toggle('active');
    document.getElementById('close-chat').onclick = () => chatPanel.classList.remove('active');

    document.getElementById('send-chat').onclick = async () => {
        if(!supabase) return alert("Backend not connected.");
        const input = document.getElementById('chat-input');
        if(!input.value.trim()) return;
        await supabase.from('global_chat').insert({ message: input.value, user_id: userId });
        input.value = '';
    };
}

function subscribeToGlobalChat() {
    fetchGlobalChat();
    supabase.channel('public:global_chat').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'global_chat' }, payload => {
        appendChat(payload.new);
    }).subscribe();
}

async function fetchGlobalChat() {
    const { data } = await supabase.from('global_chat').select('*').order('created_at', { ascending: false }).limit(50);
    if(data) {
        document.getElementById('chat-messages').innerHTML = '';
        data.reverse().forEach(appendChat);
    }
}

function appendChat(msg) {
    const box = document.getElementById('chat-messages');
    const el = document.createElement('div');
    el.className = `chat-msg ${msg.user_id === userId ? 'mine' : ''}`;
    el.textContent = msg.message;
    box.appendChild(el);
    box.scrollTop = box.scrollHeight;
}
