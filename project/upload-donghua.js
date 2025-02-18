// Sistema de Log
function logCardAction(action, cardType, title) {
    console.log(`[${new Date().toLocaleTimeString()}] ${action}: ${cardType} - "${title}"`);
    
    // Criar elemento de log visual
    const logContainer = document.getElementById('cardLog') || createLogContainer();
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry fadeIn';
    logEntry.innerHTML = `
        <span class="log-time">${new Date().toLocaleTimeString()}</span>
        <span class="log-action">${action}</span>
        <span class="log-type">${cardType}</span>
        <span class="log-title">${title}</span>
    `;
    logContainer.insertBefore(logEntry, logContainer.firstChild);
    
    // Limitar número de logs visíveis
    if (logContainer.children.length > 5) {
        logContainer.lastChild.remove();
    }
}

function createLogContainer() {
    const container = document.createElement('div');
    container.id = 'cardLog';
    container.className = 'card-log';
    document.body.appendChild(container);
    return container;
}

// Adicionar estilos para o log
const logStyles = document.createElement('style');
logStyles.textContent = `
    .card-log {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px;
        border-radius: 8px;
        max-width: 300px;
        z-index: 1000;
        font-family: monospace;
        color: white;
    }
    .log-entry {
        margin: 5px 0;
        padding: 5px;
        border-left: 3px solid #4267B2;
        font-size: 12px;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
    }
    .log-time { color: #a5b4fc; }
    .log-action { color: #34d399; margin-left: 5px; }
    .log-type { color: #fb7185; margin-left: 5px; }
    .log-title { color: white; margin-left: 5px; }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(logStyles);

// Cards de teste para a biblioteca
const testCards = [
    {
        title: "Card de Teste 1",
        description: "Este é um card de teste para verificar o sistema de aparecimento na biblioteca.",
        genre: "Teste",
        status: "Em Lançamento",
        episodes: 10,
        rating: 4.5
    },
    {
        title: "Card de Teste 2",
        description: "Outro card de teste para confirmar o funcionamento do sistema.",
        genre: "Demonstração",
        status: "Completo",
        episodes: 5,
        rating: 4.0
    }
];

// Função para adicionar cards de teste
function addTestCards() {
    testCards.forEach(card => {
        const libraryCard = document.createElement('div');
        libraryCard.className = 'obra-card slideUp';
        libraryCard.innerHTML = `
            <div class="obra-image">
                <img src="https://source.unsplash.com/random/800x600?anime" alt="${card.title}">
                <div class="obra-overlay">
                    <span class="obra-status obra-status-${getStatusClass(card.status)}">
                        <span class="obra-status-icon">${getStatusIcon(card.status)}</span>
                        ${card.status}
                    </span>
                </div>
            </div>
            <div class="obra-info">
                <h3>${card.title}</h3>
                <p>${card.description}</p>
                <div class="obra-details">
                    <span class="obra-genre">${card.genre}</span>
                    <span class="obra-episodes">${card.episodes} Episódios</span>
                </div>
                <div class="obra-rating">
                    ${createStarRating(card.rating)}
                </div>
            </div>
        `;

        const donghuasContainer = document.getElementById('donghuasContainer');
        if (donghuasContainer) {
            donghuasContainer.appendChild(libraryCard);
            logCardAction('Adicionado', 'Card de Teste', card.title);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadDonghuaForm');
    const successMessage = document.getElementById('successMessage');
    const coverInput = document.getElementById('donghuaCover');
    const coverPreview = document.getElementById('coverPreview');

    // Função para pré-visualizar a capa
    coverInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                coverPreview.innerHTML = `<img src="${e.target.result}" alt="Pré-visualização da capa">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Função para limpar espaço no localStorage
    function limparEspacoLocalStorage() {
        try {
            let obras = JSON.parse(localStorage.getItem('obras') || '[]');
            
            // Manter apenas as 10 obras mais recentes
            if (obras.length > 10) {
                obras = obras.slice(-10);
                localStorage.setItem('obras', JSON.stringify(obras));
                console.log('Espaço limpo: mantidas apenas as 10 obras mais recentes');
            }
        } catch (error) {
            console.error('Erro ao limpar espaço no localStorage:', error);
            localStorage.clear(); // Último recurso
        }
    }

    // Função para verificar e gerenciar espaço no localStorage
    function salvarNoLocalStorage(obras) {
        try {
            // Tentar salvar
            localStorage.setItem('obras', JSON.stringify(obras));
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);

            // Se der erro de espaço, tentar limpar
            if (error instanceof DOMException && 
                (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
                
                // Limpar imagens antigas ou reduzir tamanho das imagens
                let obrasLimpas = obras.map(obra => {
                    // Remover imagem se for muito grande
                    if (obra.imagem && obra.imagem.length > 100000) { // Mais de 100KB
                        delete obra.imagem;
                        console.log('Removida imagem grande para economizar espaço');
                    }
                    return obra;
                });

                try {
                    localStorage.setItem('obras', JSON.stringify(obrasLimpas));
                    alert('Algumas imagens foram removidas para liberar espaço.');
                    return true;
                } catch (secondError) {
                    // Se ainda não funcionar, limpar completamente
                    limparEspacoLocalStorage();
                    alert('Não foi possível salvar todas as obras. Algumas foram removidas.');
                    return false;
                }
            }
            
            return false;
        }
    }

    // Função para salvar donghua
    function salvarDonghua(dadosDonghua) {
        try {
            console.log('Dados do donghua a serem salvos:', dadosDonghua);

            // Recuperar obras existentes
            let obras = [];
            try {
                obras = JSON.parse(localStorage.getItem('obras') || '[]');
                console.log('Obras existentes:', obras);
            } catch (parseError) {
                console.error('Erro ao parsear obras existentes:', parseError);
                obras = [];
            }

            // Gerar ID único
            const id = Date.now().toString();

            // Criar nova obra
            const novaDonghua = {
                id: id,
                titulo: dadosDonghua.title,
                sinopse: dadosDonghua.description,
                anoLancamento: dadosDonghua.ano,
                episodios: dadosDonghua.episodes,
                imagem: dadosDonghua.imagem,
                tipo: 'Mangá',
                generos: [],
                progresso: 0
            };

            console.log('Nova obra a ser adicionada:', novaDonghua);

            // Adicionar nova obra
            obras.push(novaDonghua);

            // Salvar no localStorage com tratamento de erros
            const salvouSucesso = salvarNoLocalStorage(obras);

            if (salvouSucesso) {
                // Verificar se salvou corretamente
                const obrasVerificacao = JSON.parse(localStorage.getItem('obras') || '[]');
                console.log('Obras após salvamento:', obrasVerificacao);
                return true;
            }

            return false;
        } catch (error) {
            console.error('Erro ao salvar donghua:', error);
            alert('Erro ao salvar donghua. Tente novamente.');
            return false;
        }
    }

    // Função para criar card para a seção de obras (index.html)
    function createIndexCard(title, description, genre, status, episodes, imageFile) {
        const card = document.createElement('div');
        card.className = 'obra-card';
        card.innerHTML = `
            <div class="obra-image">
                <img src="${URL.createObjectURL(imageFile)}" alt="${title}">
                <div class="obra-overlay">
                    <span class="obra-status obra-status-${getStatusClass(status)}">
                        <span class="obra-status-icon">${getStatusIcon(status)}</span>
                        ${status}
                    </span>
                </div>
            </div>
            <div class="obra-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="obra-details">
                    <span class="obra-genre">${genre}</span>
                    <span class="obra-chapters">${episodes} Episódios</span>
                </div>
            </div>
        `;
        return card;
    }

    // Função para criar card para a biblioteca (biblioteca.html)
    function createLibraryCard(title, description, genre, status, episodes, imageFile) {
        const card = document.createElement('div');
        card.className = 'obra-card slideUp';
        card.innerHTML = `
            <div class="obra-image">
                <img src="${URL.createObjectURL(imageFile)}" alt="${title}">
                <div class="obra-overlay">
                    <span class="obra-status obra-status-${getStatusClass(status)}">
                        <span class="obra-status-icon">${getStatusIcon(status)}</span>
                        ${status}
                    </span>
                </div>
            </div>
            <div class="obra-info">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="obra-details">
                    <span class="obra-genre">${genre}</span>
                    <span class="obra-episodes">${episodes} Episódios</span>
                </div>
                <div class="obra-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span>4.5</span>
                </div>
            </div>
        `;
        return card;
    }

    // Função para enviar card para index.html
    function sendCardToIndex(card) {
        // Salvar o card no localStorage para index.html
        const indexCards = JSON.parse(localStorage.getItem('indexCards') || '[]');
        indexCards.push(card.outerHTML);
        localStorage.setItem('indexCards', JSON.stringify(indexCards));

        // Se estiver na index.html, adicionar o card diretamente
        const recentDonghuas = document.getElementById('recent-donghuas');
        if (recentDonghuas) {
            recentDonghuas.appendChild(card);
        }
    }

    // Função para enviar card para biblioteca.html
    function sendCardToLibrary(card) {
        // Salvar o card no localStorage para biblioteca.html
        const libraryCards = JSON.parse(localStorage.getItem('libraryCards') || '[]');
        libraryCards.push(card.outerHTML);
        localStorage.setItem('libraryCards', JSON.stringify(libraryCards));

        // Se estiver na biblioteca.html, adicionar o card diretamente
        const donghuasContainer = document.getElementById('donghuasContainer');
        if (donghuasContainer) {
            donghuasContainer.appendChild(card);
            logCardAction('Enviado', 'Card Biblioteca', card.querySelector('h3').textContent);
        }
    }

    // Função para obter classe de status
    function getStatusClass(status) {
        const statusMap = {
            'Em Lançamento': 'andamento',
            'Completo': 'completo',
            'Em Hiato': 'hiato'
        };
        return statusMap[status] || 'default';
    }

    // Função para obter ícone de status
    function getStatusIcon(status) {
        const iconMap = {
            'Em Lançamento': '⚡',
            'Completo': '✨',
            'Em Hiato': '⏸️'
        };
        return iconMap[status] || '📺';
    }

    // Submissão do formulário
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('donghuaTitle').value;
        const description = document.getElementById('donghuaDescription').value;
        const genre = document.getElementById('donghuaGenre').value;
        const status = document.getElementById('donghuaStatus').value;
        const episodes = document.getElementById('donghuaEpisodes').value;
        const coverFile = coverInput.files[0];

        const dadosDonghua = {
            title,
            description,
            genre,
            status,
            episodes
        };

        if (coverFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                dadosDonghua.imagem = e.target.result;
                
                // Criar e enviar card para index.html
                const indexCard = createIndexCard(title, description, genre, status, episodes, dadosDonghua.imagem);
                sendCardToIndex(indexCard);
                
                // Criar e enviar card para biblioteca.html
                const libraryCard = createLibraryCard(title, description, genre, status, episodes, dadosDonghua.imagem);
                sendCardToLibrary(libraryCard);
                
                const salvouSucesso = salvarDonghua(dadosDonghua);
                if (salvouSucesso) {
                    showSuccessMessage();
                }
            };
            reader.readAsDataURL(coverFile);
        } else {
            // Mesmo sem imagem, enviar para ambos
            const indexCard = createIndexCard(title, description, genre, status, episodes);
            sendCardToIndex(indexCard);
            
            const libraryCard = createLibraryCard(title, description, genre, status, episodes);
            sendCardToLibrary(libraryCard);
            
            const salvouSucesso = salvarDonghua(dadosDonghua);
            if (salvouSucesso) {
                showSuccessMessage();
            }
        }
    });

    // Carregar cards salvos ao carregar a página
    const donghuasContainer = document.getElementById('donghuasContainer');
    if (donghuasContainer) {
        const libraryCards = JSON.parse(localStorage.getItem('libraryCards') || '[]');
        libraryCards.forEach(cardHTML => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = cardHTML;
            donghuasContainer.appendChild(tempDiv.firstChild);
            const title = tempDiv.querySelector('h3').textContent;
            logCardAction('Carregado', 'Card Salvo', title);
        });

        // Adicionar cards de teste após um pequeno delay
        setTimeout(() => {
            addTestCards();
        }, 1000);
    }
});
