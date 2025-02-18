// Configuração inicial
let currentEpisode = 0;
let autoplayEnabled = false;
let currentQuality = 'HD';
let episodes = [];
let chatMessages = [];
let username = localStorage.getItem('username') || 'Usuário' + Math.floor(Math.random() * 1000);

// Função para carregar informações do episódio
function loadEpisodeData() {
    const urlParams = new URLSearchParams(window.location.search);
    const obraId = urlParams.get('id');
    const episodeId = urlParams.get('ep');
    
    // Carregar obra do localStorage
    const obras = JSON.parse(localStorage.getItem('obras')) || [];
    const obra = obras.find(o => o.id === obraId);
    
    if (obra) {
        document.getElementById('animeTitle').textContent = obra.titulo;
        // Carregar episódios da obra (simulado por enquanto)
        episodes = Array.from({length: 12}, (_, i) => ({
            id: i + 1,
            title: `Episódio ${i + 1}`,
            thumbnail: obra.imagem,
            videoUrl: '#', // URL do vídeo seria carregada do backend
            watched: false
        }));
        
        updateEpisodesList();
        if (episodeId) {
            currentEpisode = parseInt(episodeId) - 1;
        }
        loadEpisode(currentEpisode);
    }
}

// Função para carregar um episódio específico
function loadEpisode(index) {
    if (index >= 0 && index < episodes.length) {
        const video = document.getElementById('videoPlayer');
        const wrapper = document.querySelector('.video-wrapper');
        
        // Add fade out effect
        wrapper.style.opacity = '0';
        
        setTimeout(() => {
            currentEpisode = index;
            const episode = episodes[index];
            
            // Update episode information
            document.getElementById('currentEpisodeTitle').textContent = episode.title;
            video.src = episode.videoUrl;
            
            // Mark as watched
            episodes[index].watched = true;
            updateEpisodesList();
            
            // Update URL
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('ep', index + 1);
            history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
            
            // Fade back in
            wrapper.style.opacity = '1';
            
            // Scroll active episode into view
            const activeEpisode = document.querySelector('.episode-item.active');
            if (activeEpisode) {
                activeEpisode.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }, 300);
    }
}

// Função para atualizar a lista de episódios
function updateEpisodesList() {
    const list = document.getElementById('episodesList');
    list.innerHTML = '';
    
    episodes.forEach((episode, index) => {
        const episodeItem = document.createElement('div');
        episodeItem.className = `episode-item ${currentEpisode === index ? 'active' : ''} ${episode.watched ? 'watched' : ''}`;
        episodeItem.innerHTML = `
            <img src="${episode.thumbnail}" alt="${episode.title}">
            <div class="episode-info">
                <h4>${episode.title}</h4>
                ${episode.watched ? '<span class="watched-badge"><i class="fas fa-check"></i></span>' : ''}
            </div>
        `;
        episodeItem.addEventListener('click', () => loadEpisode(index));
        list.appendChild(episodeItem);
    });
}

// Funções do Chat
function addChatMessage(message, isSystem = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `chat-message ${isSystem ? 'system-message' : ''}`;
    messageElement.innerHTML = `
        <span class="message-user">${message.user}:</span>
        <span class="message-text">${message.text}</span>
        <span class="message-time">${new Date().toLocaleTimeString()}</span>
    `;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Keyboard Shortcuts and UI Enhancements
function setupKeyboardShortcuts() {
    const shortcuts = document.querySelector('.keyboard-shortcuts');
    let shortcutsTimeout;

    document.addEventListener('keydown', (e) => {
        // Show shortcuts panel
        shortcuts.classList.add('show');
        clearTimeout(shortcutsTimeout);
        shortcutsTimeout = setTimeout(() => shortcuts.classList.remove('show'), 2000);

        // Handle shortcuts
        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'arrowleft':
                e.preventDefault();
                loadEpisode(currentEpisode - 1);
                break;
            case 'arrowright':
                e.preventDefault();
                loadEpisode(currentEpisode + 1);
                break;
            case 'f':
                e.preventDefault();
                toggleFullscreen();
                break;
            case 'm':
                e.preventDefault();
                toggleMute();
                break;
        }
    });
}

// Progress bar preview
function setupProgressPreview() {
    const progressBar = document.querySelector('.progress-bar');
    const preview = progressBar.querySelector('.progress-preview');
    const video = document.getElementById('videoPlayer');

    progressBar.addEventListener('mousemove', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const time = video.duration * pos;
        
        preview.style.left = `${e.clientX - rect.left}px`;
        preview.textContent = formatTime(time);
        preview.style.display = 'block';
    });

    progressBar.addEventListener('mouseleave', () => {
        preview.style.display = 'none';
    });
}

function formatTime(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function toggleMute() {
    const video = document.getElementById('videoPlayer');
    const volumeBtn = document.querySelector('.volume');
    video.muted = !video.muted;
    volumeBtn.innerHTML = video.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    loadEpisodeData();
    setupKeyboardShortcuts();
    setupProgressPreview();
    
    // Controles do Player
    document.getElementById('prevEp').addEventListener('click', () => loadEpisode(currentEpisode - 1));
    document.getElementById('nextEp').addEventListener('click', () => loadEpisode(currentEpisode + 1));
    
    document.getElementById('toggleAutoplay').addEventListener('click', (e) => {
        autoplayEnabled = !autoplayEnabled;
        e.target.classList.toggle('active');
    });
    
    document.getElementById('toggleQuality').addEventListener('click', () => {
        currentQuality = currentQuality === 'HD' ? 'SD' : 'HD';
        // Implementar mudança de qualidade
    });
    
    // Chat
    const chatToggle = document.getElementById('toggleChat');
    const liveChat = document.querySelector('.live-chat');
    
    chatToggle.addEventListener('click', () => {
        liveChat.classList.toggle('collapsed');
        chatToggle.querySelector('i').classList.toggle('fa-chevron-up');
        chatToggle.querySelector('i').classList.toggle('fa-chevron-down');
    });
    
    document.getElementById('sendMessage').addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (message) {
            addChatMessage({
                user: username,
                text: message
            });
            input.value = '';
        }
    });
    
    document.getElementById('messageInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('sendMessage').click();
        }
    });
    
    // Busca de Episódios
    document.getElementById('episodeSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const episodeItems = document.querySelectorAll('.episode-item');
        
        episodeItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            item.style.display = title.includes(searchTerm) ? 'flex' : 'none';
        });
    });
    
    // Autoplay
    document.getElementById('videoPlayer').addEventListener('ended', () => {
        if (autoplayEnabled && currentEpisode < episodes.length - 1) {
            loadEpisode(currentEpisode + 1);
        }
    });
    
    // Adicionar mensagem de boas-vindas no chat
    addChatMessage({
        user: 'Sistema',
        text: `Bem-vindo ao chat! Você está conectado como ${username}`
    }, true);
});

// Salvar progresso periodicamente
setInterval(() => {
    localStorage.setItem('watchProgress', JSON.stringify({
        episodes: episodes.map(ep => ({
            id: ep.id,
            watched: ep.watched
        }))
    }));
}, 5000);
