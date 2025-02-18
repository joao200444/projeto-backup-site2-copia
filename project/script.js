// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const sidebarItems = document.querySelectorAll('.sidebar-item');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    menuBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuBtn.style.display = 'block';
});

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
    });
});

// Latest Updates Section
const mangaGrid = document.querySelector('.manga-grid');

// Sample manga data
const mangas = [
    { title: 'Bleach', chapter: 686, image: 'https://source.unsplash.com/random/400x600?manga&1' },
    { title: 'My Hero Academia', chapter: 352, image: 'https://source.unsplash.com/random/400x600?manga&2' },
    { title: 'Black Clover', chapter: 332, image: 'https://source.unsplash.com/random/400x600?manga&3' },
    { title: 'Jujutsu Kaisen', chapter: 201, image: 'https://source.unsplash.com/random/400x600?manga&4' },
    { title: 'One Punch Man', chapter: 170, image: 'https://source.unsplash.com/random/400x600?manga&5' },
    { title: 'Demon Slayer', chapter: 205, image: 'https://source.unsplash.com/random/400x600?manga&6' },
    { title: 'Tokyo Revengers', chapter: 278, image: 'https://source.unsplash.com/random/400x600?manga&7' },
    { title: 'Chainsaw Man', chapter: 131, image: 'https://source.unsplash.com/random/400x600?manga&8' },
    { title: 'Dr. Stone', chapter: 232, image: 'https://source.unsplash.com/random/400x600?manga&9' },
    { title: 'Black Cover', chapter: 332, image: 'https://source.unsplash.com/random/400x600?manga&10' },
    { title: 'Attack on Titan', chapter: 139, image: 'https://source.unsplash.com/random/400x600?manga&11' },
    { title: 'Hunter x Hunter', chapter: 390, image: 'https://source.unsplash.com/random/400x600?manga&12' }
];

// Função de debounce para otimizar a pesquisa
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para criar elemento do mangá
function createMangaElement(manga) {
    return `
        <div class="manga-item">
            <img loading="lazy" src="${manga.image}" alt="${manga.title}">
            <div class="manga-info">
                <h3>${manga.title}</h3>
                <p>Cap. ${manga.chapter}</p>
            </div>
        </div>
    `;
}

// Função para buscar animes do AniList
async function fetchAniListAnimes() {
    const query = `
    query {
        Page(page: 1, perPage: 10) {
            media(type: ANIME, sort: POPULARITY_DESC) {
                id
                title {
                    romaji
                    english
                    native
                }
                coverImage {
                    large
                    medium
                }
                episodes
                status
                genres
            }
        }
    }
    `;

    try {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ query })
        });

        const { data } = await response.json();
        return data.Page.media.map(anime => ({
            title: anime.title.romaji || anime.title.english,
            image: anime.coverImage.large || anime.coverImage.medium,
            chapter: anime.episodes || 'N/A',
            genres: anime.genres.slice(0, 2).join(', ')
        }));
    } catch (error) {
        console.error('Erro ao buscar animes do AniList:', error);
        return [];
    }
}

// Otimizando a função de população da grade para incluir AniList
async function populateMangaGrid(mangasToShow = mangas) {
    // Tentar buscar animes do AniList
    const anilistAnimes = await fetchAniListAnimes();
    
    // Se não houver mangas nem animes do AniList, usar cards de exemplo
    if (mangasToShow.length === 0 && anilistAnimes.length === 0) {
        mangasToShow = [
            { title: 'Text 1', chapter: 1, image: 'https://source.unsplash.com/random/400x600?manga&text1' },
            { title: 'Text 2', chapter: 2, image: 'https://source.unsplash.com/random/400x600?manga&text2' },
            { title: 'Text 3', chapter: 3, image: 'https://source.unsplash.com/random/400x600?manga&text3' }
        ];
    } else if (anilistAnimes.length > 0) {
        // Priorizar animes do AniList
        mangasToShow = anilistAnimes;
    }

    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = mangasToShow.map(createMangaElement).join('');
    
    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }
    
    mangaGrid.innerHTML = '';
    mangaGrid.appendChild(fragment);
}

// Otimizando a função de pesquisa com debounce
const handleSearch = debounce((searchTerm) => {
    const filteredMangas = mangas.filter(manga => 
        manga.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    populateMangaGrid(filteredMangas);
}, 300);

// Search functionality
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

// Check for admin user and show badge
function checkAndShowAdminBadge() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isAdmin) {
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.textContent = 'Admin';
        document.body.appendChild(adminBadge);
    }
}

// Carregar conteúdo da página inicial
function loadHomeContent() {
    const donghuas = JSON.parse(localStorage.getItem('donghuas')) || [];
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) return;

    // Criar seção de destaques
    const highlightsSection = document.createElement('section');
    highlightsSection.className = 'highlights-section';
    highlightsSection.innerHTML = `
        <h2>Últimos Lançamentos</h2>
        <div class="donghua-grid"></div>
    `;

    // Adicionar donghuas ao grid
    const donghuaGrid = highlightsSection.querySelector('.donghua-grid');
    donghuas.filter(d => d.status === 'active').forEach(donghua => {
        const donghuaCard = createDonghuaCard(donghua);
        donghuaGrid.appendChild(donghuaCard);
    });

    // Limpar e adicionar novo conteúdo
    mainContent.innerHTML = '';
    mainContent.appendChild(highlightsSection);
}

// Criar card de donghua
function createDonghuaCard(donghua) {
    const card = document.createElement('div');
    card.className = 'donghua-card';
    card.innerHTML = `
        <div class="donghua-cover">
            <img src="${donghua.coverUrl || 'placeholder.jpg'}" alt="${donghua.title}">
            <div class="donghua-overlay">
                <span class="episode-count">${donghua.episodes.length} Episódios</span>
                <div class="donghua-categories">
                    ${donghua.categories.map(cat => `<span class="category-tag">${formatCategory(cat)}</span>`).join('')}
                </div>
            </div>
        </div>
        <div class="donghua-info">
            <h3>${donghua.title}</h3>
            <p>${donghua.description.substring(0, 100)}${donghua.description.length > 100 ? '...' : ''}</p>
        </div>
        <button class="watch-button" onclick="watchDonghua('${donghua.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Assistir
        </button>
    `;
    return card;
}

// Formatar nome da categoria
function formatCategory(category) {
    const categoryNames = {
        'action': 'Ação',
        'adventure': 'Aventura',
        'comedy': 'Comédia',
        'drama': 'Drama',
        'fantasy': 'Fantasia',
        'martial-arts': 'Artes Marciais',
        'romance': 'Romance',
        'sci-fi': 'Ficção Científica',
        'supernatural': 'Sobrenatural',
        'mystery': 'Mistério'
    };
    return categoryNames[category] || category;
}

// Assistir donghua
function watchDonghua(id) {
    window.location.href = `assistir.html?id=${id}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await populateMangaGrid();
    checkAndShowAdminBadge();
    loadHomeContent();
});