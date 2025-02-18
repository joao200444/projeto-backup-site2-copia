// Chave secreta para criptografia (deve ser a mesma do login.js)
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Função para verificar sessão de forma segura
function getSecureCurrentUser() {
    const encryptedUser = localStorage.getItem('currentUser');
    if (!encryptedUser) return null;

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const userData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        
        // Verificar se o token de sessão é válido
        const storedToken = localStorage.getItem(`session_${userData.username}`);
        if (storedToken !== userData.sessionToken) {
            // Token inválido, fazer logout
            localStorage.removeItem('currentUser');
            return null;
        }
        
        return userData;
    } catch (error) {
        console.error('Erro ao descriptografar dados do usuário');
        return null;
    }
}

// Configurações de API
const API_CONFIG = {
    MANGADEX: {
        BASE_URL: 'https://api.mangadex.org',
        MANGA_ENDPOINT: '/manga',
        COVER_BASE_URL: 'https://uploads.mangadex.org/covers'
    },
    ANILIST: {
        BASE_URL: 'https://graphql.anilist.co',
        QUERY: `
            query {
                Page(page: 1, perPage: 20) {
                    media(type: ANIME, sort: POPULARITY_DESC) {
                        id
                        title { romaji english native }
                        coverImage { large medium }
                        episodes
                        status
                        genres
                        description
                    }
                }
            }
        `
    }
};

// Função utilitária para tratamento de erros
function handleApiError(error, context) {
    console.error(`Erro em ${context}:`, error);
    return [];
}

// Função para buscar mangas do MangaDex
async function fetchMangaDexMangas() {
    try {
        const response = await fetch(`${API_CONFIG.MANGADEX.BASE_URL}${API_CONFIG.MANGADEX.MANGA_ENDPOINT}?limit=20&order[rating]=desc&includes[]=cover_art`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        
        return Promise.all(data.data.map(async (manga) => {
            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
            const coverUrl = coverArt 
                ? `${API_CONFIG.MANGADEX.COVER_BASE_URL}/${manga.id}/${coverArt.attributes.fileName}.512.jpg`
                : 'placeholder.jpg';

            const statsResponse = await fetch(`${API_CONFIG.MANGADEX.BASE_URL}/statistics/manga/${manga.id}`);
            const statsData = await statsResponse.json();

            return {
                id: manga.id,
                title: manga.attributes.title.en || Object.values(manga.attributes.title)[0],
                description: manga.attributes.description.en || 'Sem descrição',
                coverUrl,
                rating: statsData.rating?.average || 'N/A',
                genres: manga.attributes.tags
                    .filter(tag => tag.attributes.group === 'genre')
                    .map(tag => tag.attributes.name.en)
                    .slice(0, 3)
            };
        }));
    } catch (error) {
        return handleApiError(error, 'fetchMangaDexMangas');
    }
}

// Função para criar card de manga
function createMangaCard(manga) {
    return `
        <div class="donghua-card manga-card" data-id="${manga.id}">
            <div class="donghua-cover">
                <img src="${manga.coverUrl}" alt="${manga.title}">
                <div class="donghua-overlay">
                    <span class="rating">⭐ ${manga.rating}</span>
                    <div class="donghua-categories">
                        ${manga.genres.map(genre => `<span class="category-tag">${genre}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="donghua-info">
                <h3>${manga.title}</h3>
                <p>${manga.description.substring(0, 100)}${manga.description.length > 100 ? '...' : ''}</p>
            </div>
            <div class="card-actions">
                <button class="btn btn-details" onclick="viewMangaDetails('${manga.id}')">
                    <i class="fas fa-info-circle"></i> Detalhes
                </button>
                <button class="btn btn-read" onclick="readManga('${manga.id}')">
                    <i class="fas fa-book-open"></i> Ler
                </button>
            </div>
        </div>
    `;
}

// Função para popular grid de mangas
async function populateMangaGrid() {
    const donghuaGrid = document.querySelector('.donghua-grid');
    
    try {
        donghuaGrid.innerHTML = '<div class="loading">Carregando mangás...</div>';
        
        const mangas = await fetchMangaDexMangas();
        
        donghuaGrid.innerHTML = mangas.length 
            ? mangas.map(createMangaCard).join('') 
            : '<div class="no-results">Nenhum mangá encontrado</div>';

        const sectionTitle = document.querySelector('.donghua-list h2');
        if (sectionTitle) sectionTitle.textContent = 'Mangás Populares';
    } catch (error) {
        donghuaGrid.innerHTML = '<div class="error">Erro ao carregar mangás</div>';
        handleApiError(error, 'populateMangaGrid');
    }
}

// Funções de interação
function viewMangaDetails(id) {
    window.open(`https://mangadex.org/title/${id}`, '_blank');
}

function readManga(id) {
    window.open(`https://mangadex.org/title/${id}/chapters`, '_blank');
}

// Filtro e pesquisa
function filterByCategory(category) {
    const cards = document.querySelectorAll('.donghua-card');
    
    cards.forEach(card => {
        const categories = card.querySelectorAll('.category-tag');
        const shouldShow = category === 'Todos' || 
            Array.from(categories).some(cat => 
                cat.textContent.toLowerCase() === category.toLowerCase()
            );
        
        card.style.display = shouldShow ? 'flex' : 'none';
    });

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent === category);
    });
}

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

// Modificar a função de dados dos donghuas para incluir localStorage
const initialDonghuas = [
    {
        title: 'Soul Land',
        episodes: 234,
        category: 'Cultivo',
        image: 'https://source.unsplash.com/random/400x600?animation&1',
        progress: 85
    },
    {
        title: 'Battle Through the Heavens',
        episodes: 178,
        category: 'Artes Marciais',
        image: 'https://source.unsplash.com/random/400x600?animation&2',
        progress: 92
    },
    {
        title: 'A Will Eternal',
        episodes: 123,
        category: 'Cultivo',
        image: 'https://source.unsplash.com/random/400x600?animation&3',
        progress: 45
    },
    {
        title: 'Perfect World',
        episodes: 145,
        category: 'Fantasia',
        image: 'https://source.unsplash.com/random/400x600?animation&4',
        progress: 78
    },
    {
        title: 'Martial Universe',
        episodes: 156,
        category: 'Artes Marciais',
        image: 'https://source.unsplash.com/random/400x600?animation&5',
        progress: 65
    },
    {
        title: 'Tales of Demons and Gods',
        episodes: 189,
        category: 'Aventura',
        image: 'https://source.unsplash.com/random/400x600?animation&6',
        progress: 100
    }
];

// Função para obter obras do localStorage
function getObrasFromStorage() {
    const storedDonghuas = localStorage.getItem('donghuas');
    console.log('Donghuas armazenados:', storedDonghuas);
    
    if (storedDonghuas) {
        const parsedDonghuas = JSON.parse(storedDonghuas);
        
        // Mesclar donghuas armazenados com donghuas iniciais
        const mergedDonghuas = [...initialDonghuas, ...parsedDonghuas];
        
        // Remover duplicatas baseadas no título
        const uniqueDonghuas = mergedDonghuas.filter(
            (donghua, index, self) => 
                index === self.findIndex((d) => d.title === donghua.title)
        );

        console.log('Donghuas únicos após mesclagem:', uniqueDonghuas);
        return uniqueDonghuas;
    }
    return initialDonghuas;
}

// Função para criar elemento do donghua
function createDonghuaElement(donghua) {
    console.log('Criando elemento para donghua:', donghua);
    
    // Determinar o título, priorizando diferentes campos
    const titulo = donghua.title || donghua.titulo || donghua.originalTitle || 'Título não disponível';
    console.log('Título determinado:', titulo);
    
    const elementoHTML = `
        <div class="donghua-item" data-category="${donghua.category || donghua.generos?.[0] || 'Outros'}">
            <div class="donghua-image">
                <img src="${donghua.image || donghua.imagemCapa || donghua.coverImage || 'caminho/para/imagem/padrao.jpg'}" alt="${titulo}">
                ${donghua.progress || donghua.progresso ? `
                    <div class="progress-bar">
                        <div class="progress" style="width: ${donghua.progress || donghua.progresso}%"></div>
                    </div>
                ` : ''}
            </div>
            <div class="donghua-info">
                <h3>${titulo}</h3>
                <p>${donghua.episodes || donghua.episodios || 0} episódios</p>
                <span class="category-tag">${donghua.category || donghua.generos?.[0] || 'Outros'}</span>
            </div>
        </div>
    `;
    
    console.log('Elemento HTML criado:', elementoHTML);
    return elementoHTML;
}

// Atualizar as funções de população de grid para usar a nova lista de donghuas
function populateDonghuaGrid(donguasToShow = donghuas) {
    const donghuaGrid = document.querySelector('.donghua-grid');
    
    try {
        donghuaGrid.innerHTML = '<div class="loading">Carregando donghuas...</div>';
        
        const donghuas = donguasToShow;
        
        donghuaGrid.innerHTML = donghuas.length 
            ? donghuas.map(createDonghuaElement).join('') 
            : '<div class="no-results">Nenhum donghua encontrado</div>';

        const sectionTitle = document.querySelector('.donghua-list h2');
        if (sectionTitle) sectionTitle.textContent = 'Donghuas Populares';
    } catch (error) {
        donghuaGrid.innerHTML = '<div class="error">Erro ao carregar donghuas</div>';
        handleApiError(error, 'populateDonghuaGrid');
    }
}

// Atualizar donghuas em progresso
const watchingDonghuas = donghuas.filter(donghua => donghua.progress > 0 && donghua.progress < 100);

function populateWatchingGrid() {
    const watchingGrid = document.querySelector('.watching-grid');
    const fragment = document.createDocumentFragment();
    const tempContainer = document.createElement('div');
    
    tempContainer.innerHTML = watchingDonghuas.map(createDonghuaElement).join('');
    
    while (tempContainer.firstChild) {
        fragment.appendChild(tempContainer.firstChild);
    }
    
    watchingGrid.innerHTML = '';
    watchingGrid.appendChild(fragment);
}

// Filtro por categoria
const categoryButtons = document.querySelectorAll('.category-btn');
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.textContent;
        if (category === 'Todos') {
            populateDonghuaGrid(donghuas);
        } else {
            const filtered = donghuas.filter(donghua => donghua.category === category);
            populateDonghuaGrid(filtered);
        }
    });
});

// Pesquisa
const searchInput = document.getElementById('searchInput');
const handleSearch = debounce((searchTerm) => {
    const filteredDonghuas = donghuas.filter(donghua =>
        donghua.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    populateDonghuaGrid(filteredDonghuas);
}, 300);

searchInput.addEventListener('input', (e) => handleSearch(e.target.value));

// Função de debounce
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

// Modificar a função de dados dos donghuas para incluir localStorage
const testCards = [
    {
        id: 'test1',
        title: "Card de Teste 1",
        description: "Este é um card de teste para verificar o sistema de aparecimento na biblioteca.",
        image: "https://source.unsplash.com/random/800x600?anime&1",
        status: "Em Lançamento",
        year: 2024,
        episodes: 10,
        studio: "Estúdio Teste",
        genres: ["Teste", "Ação", "Aventura"],
        rating: 4.5
    },
    {
        id: 'test2',
        title: "Card de Teste 2",
        description: "Outro card de teste para confirmar o funcionamento do sistema.",
        image: "https://source.unsplash.com/random/800x600?anime&2",
        status: "Completo",
        year: 2023,
        episodes: 5,
        studio: "Estúdio Demo",
        genres: ["Demonstração", "Fantasia"],
        rating: 4.0
    }
];

// Adicionar cards de teste ao array principal
const donghuas = [...initialDonghuas, ...testCards];

// Estado da aplicação
let currentPage = 1;
const itemsPerPage = 12;
let filteredDonghuas = [...testCards];

// Elementos DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando...');
    console.log('Cards de teste:', testCards);
    
    // Inicialização
    renderDonghuas();
    setupEventListeners();
});

function setupEventListeners() {
    // Pesquisa
    const searchInput = document.getElementById('searchDonghua');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filtros
    const filters = ['genreFilter', 'statusFilter', 'yearFilter', 'sortBy'];
    filters.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', handleFilters);
        }
    });

    // Categorias
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            handleCategories(btn.dataset.category);
        });
    });
}

function renderDonghuas() {
    console.log('Renderizando donghuas...');
    const container = document.getElementById('donghuasContainer');
    if (!container) {
        console.error('Container não encontrado!');
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const currentDonghuas = filteredDonghuas.slice(start, end);

    console.log('Donghuas a serem renderizados:', currentDonghuas);

    if (currentDonghuas.length === 0) {
        showEmptyState();
        return;
    }

    hideEmptyState();
    container.innerHTML = currentDonghuas.map((donghua, index) => createDonghuaCard(donghua, index)).join('');
}

function createDonghuaCard(donghua, index) {
    return `
        <div class="obra-card" data-id="${donghua.id}" style="animation-delay: ${index * 0.1}s">
            <div class="obra-image">
                <img src="${donghua.image}" alt="${donghua.title}">
                <div class="obra-overlay">
                    <span class="obra-status obra-status-${getStatusClass(donghua.status)}">${donghua.status}</span>
                </div>
            </div>
            <div class="obra-info">
                <h3>${donghua.title}</h3>
                <p>${donghua.description}</p>
                <div class="obra-details">
                    <span class="obra-genre">${donghua.genres[0]}</span>
                    <span class="obra-episodes">${donghua.episodes} Episódios</span>
                </div>
                <div class="obra-rating">
                    ${createStarRating(donghua.rating)}
                </div>
            </div>
        </div>
    `;
}

function getStatusClass(status) {
    const statusMap = {
        'Em Lançamento': 'andamento',
        'Completo': 'completo',
        'Em Hiato': 'hiato'
    };
    return statusMap[status] || 'default';
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push('<i class="fas fa-star"></i>');
        } else if (i === fullStars && hasHalfStar) {
            stars.push('<i class="fas fa-star-half-alt"></i>');
        } else {
            stars.push('<i class="far fa-star"></i>');
        }
    }

    return `<div class="stars">${stars.join('')}</div><span>${rating.toFixed(1)}</span>`;
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    filteredDonghuas = donghuas.filter(donghua => {
        return donghua.title.toLowerCase().includes(searchTerm) ||
               donghua.description.toLowerCase().includes(searchTerm) ||
               donghua.genres.some(genre => genre.toLowerCase().includes(searchTerm));
    });
    currentPage = 1;
    renderDonghuas();
}

function handleFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    const genre = genreFilter ? genreFilter.value : '';
    const status = statusFilter ? statusFilter.value : '';

    filteredDonghuas = donghuas.filter(donghua => {
        const genreMatch = !genre || donghua.genres.includes(genre);
        const statusMatch = !status || donghua.status === status;
        return genreMatch && statusMatch;
    });

    currentPage = 1;
    renderDonghuas();
}

function handleCategories(category) {
    switch(category) {
        case 'all':
            filteredDonghuas = [...donghuas];
            break;
        case 'watching':
            filteredDonghuas = donghuas.filter(d => d.status === 'Em Lançamento');
            break;
        case 'completed':
            filteredDonghuas = donghuas.filter(d => d.status === 'Completo');
            break;
        case 'favorites':
            filteredDonghuas = donghuas.filter(d => d.rating >= 4.5);
            break;
        case 'watchlist':
            filteredDonghuas = donghuas.filter(d => d.status === 'Em Lançamento' && d.rating > 4.0);
            break;
        case 'recommendations':
            filteredDonghuas = donghuas.sort((a, b) => b.rating - a.rating).slice(0, 10);
            break;
    }
    currentPage = 1;
    renderDonghuas();
}

function showEmptyState() {
    const container = document.getElementById('donghuasContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (container) container.style.display = 'none';
    if (emptyState) emptyState.classList.remove('hidden');
}

function hideEmptyState() {
    const container = document.getElementById('donghuasContainer');
    const emptyState = document.getElementById('emptyState');
    
    if (container) container.style.display = 'grid';
    if (emptyState) emptyState.classList.add('hidden');
}

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

// Inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando biblioteca...');
    renderDonghuas();
    setupEventListeners();
});

// Carregar obras da localStorage
function carregarObras() {
    const obrasContainer = document.getElementById('donghuasContainer');
    let obras = JSON.parse(localStorage.getItem('obras')) || [];
    
    if (obras.length === 0) {
        obrasContainer.innerHTML = '<p class="no-obras">Nenhuma obra encontrada</p>';
        return;
    }

    // Ordenar obras
    const sortBy = document.getElementById('sortBy')?.value || 'recent';
    obras = ordenarObras(obras, sortBy);

    obrasContainer.innerHTML = obras.map(obra => `
        <div class="obra-card" onclick="abrirPaginaCapitulos('${obra.id}')">
            <div class="obra-image">
                <img src="${obra.imagemCapa || 'caminho/para/imagem/padrao.jpg'}" alt="${obra.titulo}">
                <div class="obra-overlay">
                    <span class="obra-status obra-status-${getStatusClass(obra.status)}">
                        ${obra.status}
                    </span>
                </div>
            </div>
            <div class="obra-info">
                <h3>${obra.titulo}</h3>
                <p>${obra.descricao || 'Sem descrição disponível'}</p>
                <div class="obra-details">
                    <span class="obra-genre">${obra.generos ? obra.generos[0] : 'Sem gênero'}</span>
                    <span class="obra-episodes">${obra.episodios || 0} Episódios</span>
                </div>
                <div class="obra-rating">
                    ${createStarRating(obra.avaliacao || 0)}
                </div>
            </div>
        </div>
    `).join('');
}

// Função para ordenar obras
function ordenarObras(obras, sortBy) {
    switch (sortBy) {
        case 'recent':
            return obras.sort((a, b) => new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0));
        case 'rating':
            return obras.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0));
        case 'title':
            return obras.sort((a, b) => a.titulo.localeCompare(b.titulo));
        default:
            return obras;
    }
}

// Função para classificação por estrelas
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars.push('<i class="fas fa-star"></i>');
        } else if (i === fullStars && hasHalfStar) {
            stars.push('<i class="fas fa-star-half-alt"></i>');
        } else {
            stars.push('<i class="far fa-star"></i>');
        }
    }

    return `<div class="stars">${stars.join('')}</div><span>${rating.toFixed(1)}</span>`;
}

// Função para obter a classe de status
function getStatusClass(status) {
    const statusMap = {
        'Em Lançamento': 'andamento',
        'Completo': 'completo',
        'Em Hiato': 'hiato'
    };
    return statusMap[status] || 'default';
}

// Função para abrir página de capítulos
function abrirPaginaCapitulos(obraId) {
    const obras = JSON.parse(localStorage.getItem('obras')) || [];
    const obra = obras.find(o => o.id === obraId);
    
    if (obra) {
        localStorage.setItem('manga_atual', JSON.stringify(obra));
        window.location.href = 'capitulos.html';
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Carregando obras...');
    
    // Carregar obras inicialmente
    carregarObras();
    
    // Adicionar evento de ordenação
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            carregarObras();
        });
    }
});

// Função para carregar e exibir os cards da biblioteca
function carregarCardsNaBiblioteca() {
    const donghuasContainer = document.getElementById('donghuasContainer');
    if (!donghuasContainer) return;

    // Limpar o container
    donghuasContainer.innerHTML = '';

    // Carregar obras do localStorage
    let obras = [];
    try {
        obras = JSON.parse(localStorage.getItem('obras') || '[]');
    } catch (error) {
        console.error('Erro ao carregar obras:', error);
        return;
    }

    if (obras.length === 0) {
        // Mostrar estado vazio se não houver obras
        donghuasContainer.innerHTML = `
            <div class="empty-state">
                <p>Nenhum donghua adicionado ainda</p>
            </div>`;
        return;
    }

    // Criar e adicionar cards para cada obra
    obras.forEach(obra => {
        const card = `
            <div class="obra-card">
                <div class="obra-image">
                    <img src="${obra.imagem || 'https://i.pinimg.com/originals/75/90/99/7590994f96261ea1be22eb2c77effd32.jpg'}" 
                         alt="${obra.titulo}">
                </div>
                <div class="obra-info">
                    <h3 class="obra-title">${obra.titulo}</h3>
                    <p class="obra-description">${obra.sinopse}</p>
                    <div class="obra-metadata">
                        <span class="obra-genre">${obra.genero}</span>
                        <span class="obra-status status-${obra.status.toLowerCase().replace(' ', '-')}">${obra.status}</span>
                    </div>
                </div>
            </div>
        `;
        donghuasContainer.insertAdjacentHTML('beforeend', card);
    });
}

// Chamar a função quando a página carregar
document.addEventListener('DOMContentLoaded', carregarCardsNaBiblioteca);

// Recarregar cards quando houver mudanças no localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'obras') {
        carregarCardsNaBiblioteca();
    }
});
