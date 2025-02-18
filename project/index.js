// Dados de exemplo para os donghua
const donghuas = [
    {
        id: 1,
        titulo: "Martial Peak",
        imagem: "https://source.unsplash.com/random/800x600?manga&1",
        descricao: "A jornada ao pico marcial é solitária e longa.",
        generos: ["Ação", "Aventura"],
        status: "Em andamento",
        formato: "Manhua"
    },
    {
        id: 2,
        titulo: "Tales of Demons and Gods",
        imagem: "https://source.unsplash.com/random/800x600?manga&2",
        descricao: "Um expert marcial reencarna no passado.",
        generos: ["Ação", "Fantasia"],
        status: "Completo",
        formato: "Manhua"
    },
    {
        id: 3,
        titulo: "Soul Land",
        imagem: "https://source.unsplash.com/random/800x600?manga&3",
        descricao: "Em um mundo de almas marciais e cultivo.",
        generos: ["Ação", "Aventura"],
        status: "Em andamento",
        formato: "Manhua"
    },
    {
        id: 4,
        titulo: "Battle Through the Heavens",
        imagem: "https://source.unsplash.com/random/800x600?manga&4",
        descricao: "A história de um gênio que perdeu seus poderes.",
        generos: ["Ação", "Aventura"],
        status: "Completo",
        formato: "Manhua"
    }
];

// Função para obter obras do localStorage
function getObrasFromStorage() {
    const obras = JSON.parse(localStorage.getItem('obras')) || [];
    return obras;
}

// Função para criar card de obra
function createObraCard(obra) {
    const card = document.createElement('div');
    card.className = 'featured-item';
    card.innerHTML = `
        <img src="${obra.imagem || 'placeholder.jpg'}" alt="${obra.titulo}">
        <div class="featured-info">
            <h3>${obra.titulo}</h3>
            <p>${obra.generos.join(', ')}</p>
            <p>Status: ${obra.status}</p>
        </div>
    `;
    card.addEventListener('click', () => {
        window.location.href = `menu-da-obra.html?id=${obra.id}`;
    });
    return card;
}

// Função para criar item da lista completa
function createListaItem(obra) {
    const item = document.createElement('div');
    item.className = 'lista-item';
    item.innerHTML = `
        <img src="${obra.imagem || 'placeholder.jpg'}" alt="${obra.titulo}">
        <div class="lista-item-info">
            <h3>${obra.titulo}</h3>
            <p>${obra.generos.join(', ')}</p>
            <p>${obra.status}</p>
        </div>
        <span class="lista-item-formato">${obra.formato || 'Imagem'}</span>
    `;
    item.addEventListener('click', () => {
        window.location.href = `menu-da-obra.html?id=${obra.id}`;
    });
    return item;
}

// Variáveis para controle da lista
let obrasFiltradas = [];
let paginaAtual = 0;
const itensPorPagina = 10;

// Função para filtrar e exibir obras na lista
function atualizarListaObras(resetPagina = true) {
    const formato = document.getElementById('formatoFiltro').value;
    const termo = document.getElementById('pesquisaLista').value.toLowerCase();
    const obras = getObrasFromStorage();

    // Filtrar obras
    obrasFiltradas = obras.filter(obra => {
        const formatoMatch = formato === 'todos' || obra.formato === formato;
        const termoMatch = obra.titulo.toLowerCase().includes(termo) ||
                          obra.generos.some(g => g.toLowerCase().includes(termo));
        return formatoMatch && termoMatch;
    });

    if (resetPagina) {
        paginaAtual = 0;
    }

    // Exibir obras
    const listaObras = document.querySelector('.lista-obras');
    if (!listaObras) return;

    if (resetPagina) {
        listaObras.innerHTML = '';
    }

    const inicio = paginaAtual * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const obrasPagina = obrasFiltradas.slice(inicio, fim);

    obrasPagina.forEach(obra => {
        listaObras.appendChild(createListaItem(obra));
    });

    // Atualizar botão "Carregar Mais"
    const btnCarregarMais = document.getElementById('carregarMais');
    if (btnCarregarMais) {
        btnCarregarMais.style.display = fim < obrasFiltradas.length ? 'block' : 'none';
    }
}

// Função para atualizar a exibição das obras
function updateObrasDisplay() {
    const obras = getObrasFromStorage();
    const recentGrid = document.querySelector('.recent-grid');
    const featuredGrid = document.querySelector('.featured-grid');
    
    if (recentGrid) {
        recentGrid.innerHTML = ''; // Limpa o grid atual
        
        // Ordena as obras por data de criação (mais recentes primeiro)
        const obrasRecentes = [...obras].sort((a, b) => {
            return new Date(b.dataCriacao) - new Date(a.dataCriacao);
        });
        
        // Pega as 4 obras mais recentes
        obrasRecentes.slice(0, 4).forEach(obra => {
            recentGrid.appendChild(createObraCard(obra));
        });
    }
    
    if (featuredGrid) {
        featuredGrid.innerHTML = ''; // Limpa o grid atual
        
        // Para destaques, vamos usar as obras mais bem avaliadas
        const obrasDestaque = [...obras].sort((a, b) => {
            return (b.rating || 0) - (a.rating || 0);
        });
        
        // Pega as 4 obras com melhor avaliação
        obrasDestaque.slice(0, 4).forEach(obra => {
            featuredGrid.appendChild(createObraCard(obra));
        });
    }

    // Atualizar lista completa
    atualizarListaObras();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Função para criar card de destaque
    function createFeaturedCard(obra) {
        const card = document.createElement('div');
        card.className = 'featured-item';
        card.innerHTML = `
            <img src="${obra.imagem || 'https://source.unsplash.com/random/800x600?manga'}" alt="${obra.titulo}">
            <div class="featured-info">
                <h3>${obra.titulo}</h3>
                <p>${obra.sinopse.length > 100 ? obra.sinopse.substring(0, 100) + '...' : obra.sinopse}</p>
            </div>
        `;
        return card;
    }

    // Função para criar card de obra
    function createObraCard(obra) {
        const card = document.createElement('div');
        card.className = 'obra-card';
        card.innerHTML = `
            <div class="obra-card-image">
                <img src="${obra.imagem || 'https://source.unsplash.com/random/800x600?manga'}" alt="${obra.titulo}">
            </div>
            <div class="obra-card-info">
                <h3>${obra.titulo}</h3>
                <p>${obra.sinopse.length > 100 ? obra.sinopse.substring(0, 100) + '...' : obra.sinopse}</p>
                <div class="obra-card-details">
                    <span>Ano: ${obra.anoLancamento}</span>
                    <span>Episódios: ${obra.episodios || 'N/A'}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Função para criar card de obra para a seção Obras
    function createMangaCard(obra) {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <div class="manga-card-image">
                <img src="${obra.imagem || 'https://source.unsplash.com/random/800x600?manga'}" alt="${obra.titulo}">
            </div>
            <div class="manga-card-info">
                <h3>${obra.titulo}</h3>
                <p>${obra.sinopse.length > 100 ? obra.sinopse.substring(0, 100) + '...' : obra.sinopse}</p>
                <div class="manga-card-details">
                    <span>Ano: ${obra.anoLancamento}</span>
                    <span>Episódios: ${obra.episodios || 'N/A'}</span>
                </div>
            </div>
        `;
        return card;
    }

    // Função para criar card de exemplo
    function createExampleCard(titulo, sinopse) {
        const card = document.createElement('div');
        card.className = 'manga-card exemplo';
        card.innerHTML = `
            <div class="manga-card-image">
                <img src="https://source.unsplash.com/random/800x600?manga,${titulo}" alt="${titulo}">
            </div>
            <div class="manga-card-info">
                <h3>${titulo}</h3>
                <p>${sinopse}</p>
                <div class="manga-card-details">
                    <span>Ano: N/A</span>
                    <span>Episódios: N/A</span>
                </div>
            </div>
        `;
        return card;
    }

    // Função para carregar donghuas em destaque
    function carregarDestaquesHome() {
        const featuredGrid = document.querySelector('.featured-grid');
        
        // Limpar grid existente
        featuredGrid.innerHTML = '';

        // Recuperar obras do localStorage
        const obras = JSON.parse(localStorage.getItem('obras') || '[]');
        
        // Selecionar as 3 obras mais recentes para destaque
        const destaquesObras = obras.slice(-3).reverse();

        // Adicionar cada obra aos destaques
        destaquesObras.forEach(obra => {
            const obraCard = createFeaturedCard(obra);
            featuredGrid.appendChild(obraCard);
        });

        // Mostrar/ocultar seção de destaques
        const featuredSection = document.querySelector('.featured');
        featuredSection.style.display = destaquesObras.length > 0 ? 'block' : 'none';
    }

    // Função para carregar obras
    function carregarObrasHome() {
        const obrasGrid = document.querySelector('.obras-grid');
        
        // Limpar grid existente
        obrasGrid.innerHTML = '';

        // Recuperar obras do localStorage
        const obras = JSON.parse(localStorage.getItem('obras') || '[]');
        
        // Adicionar cada obra à grade
        obras.forEach(obra => {
            const obraCard = createObraCard(obra);
            obrasGrid.appendChild(obraCard);
        });

        // Mostrar/ocultar seção de obras
        const obrasSection = document.querySelector('.obras-section');
        obrasSection.style.display = obras.length > 0 ? 'block' : 'none';
    }

    // Função para carregar obras na seção Obras
    function carregarObrasSecao() {
        const mangaGrid = document.querySelector('.manga-grid');
        
        // Limpar grid existente
        mangaGrid.innerHTML = '';

        // Recuperar obras do localStorage
        const obras = JSON.parse(localStorage.getItem('obras') || '[]');
        
        // Se não houver obras, adicionar cards de exemplo
        if (obras.length === 0) {
            const exampleCards = [
                createExampleCard('Text 1', 'Descrição do Text 1'),
                createExampleCard('Text 2', 'Descrição do Text 2'),
                createExampleCard('Text 3', 'Descrição do Text 3')
            ];
            
            exampleCards.forEach(card => {
                mangaGrid.appendChild(card);
            });
        } else {
            // Adicionar cada obra à grade
            obras.forEach(obra => {
                const obraCard = createMangaCard(obra);
                mangaGrid.appendChild(obraCard);
            });
        }

        // Sempre mostrar a seção de obras
        const latestUpdatesSection = document.querySelector('.latest-updates');
        latestUpdatesSection.style.display = 'block';
    }

    // Carregar obras
    carregarObrasSecao();

    // Escutar mudanças no localStorage para atualizar obras
    window.addEventListener('storage', (e) => {
        if (e.key === 'obras') {
            carregarObrasSecao();
            carregarObrasHome();
        }
    });

    carregarDestaquesHome();
    carregarObrasHome();
    updateObrasDisplay();

    // Filtros da lista
    const formatoFiltro = document.getElementById('formatoFiltro');
    const pesquisaLista = document.getElementById('pesquisaLista');
    const btnCarregarMais = document.getElementById('carregarMais');

    if (formatoFiltro) {
        formatoFiltro.addEventListener('change', () => atualizarListaObras());
    }

    if (pesquisaLista) {
        pesquisaLista.addEventListener('input', () => atualizarListaObras());
    }

    if (btnCarregarMais) {
        btnCarregarMais.addEventListener('click', () => {
            paginaAtual++;
            atualizarListaObras(false);
        });
    }
});

// Escuta por mudanças no localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'obras') {
        updateObrasDisplay();
    }
});
