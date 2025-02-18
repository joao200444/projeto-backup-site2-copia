// URL da API
const apiUrl = 'https://gist.githubusercontent.com/joao200444/f1753f17798b8c198e4d31e03395a0e3/raw/63acc398631507c16155d2fd95b8f51c6f7df3c3/api1.js';

// Variáveis de paginação
let currentPage = 1;
const itemsPerPage = 20;
let totalPages = 1;

// Função para criar um card de obra
function createObraCard(obra) {
    const card = document.createElement('div');
    card.className = 'obra-card';
    
    card.addEventListener('click', () => {
        localStorage.setItem('selectedDonghua', JSON.stringify(obra));
        window.location.href = 'http://127.0.0.1:5502/project/menu-da-obra.html';
    });

    card.innerHTML = `
        <div class="obra-image">
            <img src="${obra.imagem}" alt="${obra.titulo}">
            <div class="obra-status ${obra.status.toLowerCase()}">${obra.status}</div>
        </div>
        <div class="obra-info">
            <h3>${obra.titulo}</h3>
            <p class="obra-synopsis">${obra.sinopse}</p>
            <div class="obra-details">
                <span class="obra-genre">${obra.genero}</span>
                <span class="obra-rating">
                    <i class="fas fa-star"></i>
                    ${obra.avaliacao}
                </span>
                <span class="obra-chapters">
                    <i class="fas fa-book"></i>
                    ${obra.capitulos ? obra.capitulos.length : 'N/A'} capítulos
                </span>
            </div>
        </div>
    `;

    card.style.cursor = 'pointer';
    return card;
}

// Função para atualizar a paginação
function updatePagination(totalItems) {
    totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginationContainer = document.querySelector('.pagination');
    
    let paginationHTML = `
        <a href="#" class="prev ${currentPage === 1 ? 'disabled' : ''}" onclick="changePage(${currentPage - 1})">Anterior</a>
        <a href="#" class="${currentPage === 1 ? 'current' : ''}" onclick="changePage(1)">1</a>
    `;

    if (currentPage > 3) {
        paginationHTML += '<span class="dots">...</span>';
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        if (i <= totalPages) {
            paginationHTML += `<a href="#" class="${currentPage === i ? 'current' : ''}" onclick="changePage(${i})">${i}</a>`;
        }
    }

    if (currentPage < totalPages - 2) {
        paginationHTML += '<span class="dots">...</span>';
    }

    if (totalPages > 1) {
        paginationHTML += `<a href="#" class="${currentPage === totalPages ? 'current' : ''}" onclick="changePage(${totalPages})">${totalPages}</a>`;
    }

    paginationHTML += `
        <a href="#" class="next ${currentPage === totalPages ? 'disabled' : ''}" onclick="changePage(${currentPage + 1})">Próximo</a>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Função para mudar de página
function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
        return;
    }
    currentPage = newPage;
    const obras = JSON.parse(localStorage.getItem('allObras') || '[]');
    loadAllCards(obras);
}

// Função para carregar o script da API
async function loadAPI() {
    try {
        const response = await fetch(apiUrl);
        const scriptText = await response.text();
        
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptText;
        document.body.appendChild(scriptElement);
        
        setTimeout(() => {
            if (typeof bibliotecaData !== 'undefined' && bibliotecaData.obras) {
                localStorage.setItem('allObras', JSON.stringify(bibliotecaData.obras));
                loadAllCards(bibliotecaData.obras);
                setupEventListeners(bibliotecaData.obras);
            } else {
                console.error('Dados da biblioteca não encontrados');
                document.querySelector('.obras-grid').innerHTML = '<p class="error-message">Erro ao carregar as obras. Por favor, tente novamente mais tarde.</p>';
            }
        }, 100);
    } catch (error) {
        console.error('Erro ao carregar a API:', error);
        document.querySelector('.obras-grid').innerHTML = '<p class="error-message">Erro ao carregar as obras. Por favor, tente novamente mais tarde.</p>';
    }
}

// Função para carregar todos os cards
function loadAllCards(obras) {
    const container = document.querySelector('.obras-grid');
    container.innerHTML = '';

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const obrasToShow = obras.slice(startIndex, endIndex);

    obrasToShow.forEach(obra => {
        const card = createObraCard(obra);
        container.appendChild(card);
    });

    updatePagination(obras.length);
}

// Função para filtrar obras por gênero
function filterByGenre(genre, obras) {
    currentPage = 1;
    const filteredObras = genre === 'todos' 
        ? obras 
        : obras.filter(obra => obra.genero.toLowerCase() === genre.toLowerCase());
    loadAllCards(filteredObras);
}

// Função para pesquisar obras
function searchObras(query, obras) {
    const searchTerm = query.toLowerCase().trim();
    currentPage = 1;
    
    if (!searchTerm) {
        loadAllCards(obras);
        return;
    }

    const filteredObras = obras.filter(obra => {
        const titulo = obra.titulo.toLowerCase();
        return titulo.includes(searchTerm);
    });

    const container = document.querySelector('.obras-grid');
    
    if (filteredObras.length === 0) {
        container.innerHTML = `
            <p class="no-results">
                Nenhuma obra encontrada com o título "${query}".<br>
                Tente pesquisar outro título.
            </p>
        `;
        updatePagination(0);
    } else {
        loadAllCards(filteredObras);
    }
}

// Configurar event listeners
function setupEventListeners(obras) {
    const genreSelect = document.querySelector('select[name="genre"]');
    if (genreSelect) {
        genreSelect.addEventListener('change', (e) => {
            filterByGenre(e.target.value, obras);
        });
    }

    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');

    if (searchInput && searchButton) {
        searchButton.addEventListener('click', () => {
            searchObras(searchInput.value, obras);
        });

        let searchTimeout;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchObras(searchInput.value, obras);
            }, 300);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchObras(searchInput.value, obras);
            }
        });
    }
}

// Estilos CSS
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #ff6b6b;
        text-align: center;
        padding: 2rem;
        font-size: 1.1rem;
    }
    .no-results {
        color: #aaa;
        text-align: center;
        padding: 2rem;
        font-size: 1.1rem;
        grid-column: 1 / -1;
    }
    .pagination {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin-top: 2rem;
    }
    .pagination a, .pagination span {
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        text-decoration: none;
        color: #333;
    }
    .pagination a:hover:not(.disabled) {
        background-color: #f5f5f5;
    }
    .pagination .current {
        background-color: #007bff;
        color: white;
        border-color: #007bff;
    }
    .pagination .disabled {
        color: #aaa;
        cursor: not-allowed;
    }
    .pagination .dots {
        border: none;
    }
`;
document.head.appendChild(style);

// Tornar a função changePage global
window.changePage = changePage;

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', loadAPI);
