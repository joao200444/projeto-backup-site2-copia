// URL da API
const apiUrl = 'https://gist.githubusercontent.com/joao200444/f1753f17798b8c198e4d31e03395a0e3/raw/63acc398631507c16155d2fd95b8f51c6f7df3c3/api1.js';

// Função para criar um card de obra
function createObraCard(obra, index) {
    const card = document.createElement('div');
    card.className = 'obra-card';
    
    card.addEventListener('click', () => {
        localStorage.setItem('selectedDonghua', JSON.stringify(obra));
        window.location.href = 'menu-da-obra.html';
    });

    card.innerHTML = `
        <div class="obra-image">
            <img src="${obra.imagem}" alt="${obra.titulo}">
            <div class="obra-overlay">
                <div class="obra-status">
                    <i class="fas ${getStatusIcon(obra.status)}"></i>
                    ${obra.status}
                </div>
            </div>
        </div>
        <div class="obra-info">
            <h3>${obra.titulo}</h3>
            <p>${obra.sinopse}</p>
            <div class="obra-meta">
                <div class="obra-stats">
                    <span class="obra-chapters">
                        <i class="fas fa-book-open"></i>
                        ${obra.capitulos ? obra.capitulos.length : 'N/A'} Capítulos
                    </span>
                    <span class="obra-rating">
                        <i class="fas fa-star"></i>
                        ${obra.avaliacao}
                    </span>
                </div>
                <span class="obra-genre">
                    <i class="fas fa-tag"></i>
                    ${obra.genero}
                </span>
            </div>
        </div>
        <div class="obra-rank">${index + 1}</div>
    `;

    return card;
}

// Função para obter o ícone baseado no status
function getStatusIcon(status) {
    switch(status.toLowerCase()) {
        case 'novo': return 'fa-fire';
        case 'em andamento': return 'fa-clock';
        case 'completo': return 'fa-check-circle';
        default: return 'fa-question-circle';
    }
}

// Função para carregar as obras em destaque
function loadFeaturedObras(obras) {
    const container = document.getElementById('recent-donghuas');
    if (!container) return;

    // Pegar as 6 primeiras obras
    const featuredObras = obras.slice(0, 6);
    
    container.innerHTML = ''; // Limpar o container

    featuredObras.forEach((obra, index) => {
        const card = createObraCard(obra, index);
        container.appendChild(card);
    });
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
                // Ordenar obras por avaliação
                const sortedObras = bibliotecaData.obras.sort((a, b) => b.avaliacao - a.avaliacao);
                localStorage.setItem('allObras', JSON.stringify(sortedObras));
                loadFeaturedObras(sortedObras);
            } else {
                console.error('Dados da biblioteca não encontrados');
                document.getElementById('recent-donghuas').innerHTML = 
                    '<p class="error-message">Erro ao carregar as obras. Por favor, tente novamente mais tarde.</p>';
            }
        }, 100);
    } catch (error) {
        console.error('Erro ao carregar a API:', error);
        document.getElementById('recent-donghuas').innerHTML = 
            '<p class="error-message">Erro ao carregar as obras. Por favor, tente novamente mais tarde.</p>';
    }
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', loadAPI);
