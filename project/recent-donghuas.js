// Função para criar elemento de donghua
function criarElementoDonghua(donghua) {
    return `
        <div class="donghua-item" data-id="${donghua.id || ''}">
            <div class="donghua-image">
                <img src="${donghua.imagem || donghua.coverImage || 'caminho/para/imagem/padrao.jpg'}" alt="${donghua.titulo || donghua.title || 'Donghua'}">
            </div>
            <div class="donghua-info">
                <h3>${donghua.titulo || donghua.title || 'Título não definido'}</h3>
                <p>${donghua.generos ? donghua.generos.join(', ') : (donghua.genres ? donghua.genres.join(', ') : 'Sem gênero')}</p>
            </div>
        </div>
    `;
}

// Função para criar card genérico
function criarCardGenerico() {
    return `
        <div class="donghua-item donghua-placeholder">
            <div class="donghua-image">
                <div class="placeholder-content"></div>
            </div>
            <div class="donghua-info">
                <h3 class="placeholder-title"></h3>
                <p class="placeholder-genre"></p>
            </div>
        </div>
    `;
}

// Função para buscar capa do mangá no MangaDex
async function fetchMangaCover(mangaId, relationshipType = 'cover_art') {
    try {
        const response = await fetch(`https://api.mangadex.org/manga/${mangaId}/cover`);
        const data = await response.json();
        
        const coverRelationship = data.data.find(rel => 
            rel.type === relationshipType
        );
        
        if (coverRelationship) {
            const fileName = coverRelationship.attributes.fileName;
            return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
        }
        
        return null;
    } catch (error) {
        console.error('Erro ao buscar capa do mangá:', error);
        return null;
    }
}

// Função para buscar mangás recentes do MangaDex
async function fetchRecentMangasDex() {
    try {
        const response = await fetch('https://api.mangadex.org/manga?limit=10&order[updatedAt]=desc&includes[]=cover_art');
        const data = await response.json();
        
        const mangasRecentes = await Promise.all(data.data.map(async (manga) => {
            const coverUrl = await fetchMangaCover(manga.id);
            
            return {
                id: manga.id,
                titulo: manga.attributes.title.en || manga.attributes.title.ja || 'Título não disponível',
                tituloOriginal: manga.attributes.altTitles.find(t => t.ja)?.ja || manga.attributes.title.ja,
                sinopse: manga.attributes.description.en || 'Sem sinopse',
                generos: manga.attributes.tags
                    .filter(tag => tag.attributes.group === 'genre')
                    .map(tag => tag.attributes.name.en),
                anoLancamento: manga.attributes.year || 'N/A',
                imagem: coverUrl || 'placeholder.jpg',
                tipo: 'Mangá',
                link: `https://mangadex.org/title/${manga.id}`,
                episodios: 0,
                progresso: 0
            };
        }));
        
        return mangasRecentes;
    } catch (error) {
        console.error('Erro ao buscar mangás do MangaDex:', error);
        return [];
    }
}

// Função para criar card de obra
function createObraCard(obra) {
    console.log('Criando card para obra:', obra);
    const card = document.createElement('div');
    card.className = 'featured-item';
    card.innerHTML = `
        <img src="${obra.coverImage || obra.imagem || 'placeholder.jpg'}" alt="${obra.title || obra.titulo || 'Obra'}">
        <div class="featured-info">
            <h3>${obra.title || obra.titulo || 'Título não definido'}</h3>
            <p>${obra.genres ? obra.genres.join(', ') : (obra.generos ? obra.generos.join(', ') : 'Sem gênero')}</p>
            <p>Ano: ${obra.releaseYear || obra.anoLancamento || 'N/A'}</p>
        </div>
        <button class="watch-button" onclick="watchObra('${obra.id}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Detalhes
        </button>
    `;
    return card;
}

// Função para assistir obra
function watchObra(id) {
    window.location.href = `https://mangadex.org/title/${id}`;
}

// Função para carregar donghuas recentes
async function carregarDonghuasRecentes() {
    const gridDonghuasRecentes = document.querySelector('.featured-grid');
    
    // Limpar grid existente
    gridDonghuasRecentes.innerHTML = '';

    // Recuperar donghuas do localStorage
    const donghuas = JSON.parse(localStorage.getItem('obras') || '[]');
    console.log('Donghuas recuperados do localStorage:', donghuas);
    
    // Buscar mangás recentes do MangaDex
    const mangasDex = await fetchRecentMangasDex();
    console.log('Mangás do MangaDex:', mangasDex);
    
    // Combinar donghuas locais com mangás do MangaDex
    const donghuasRecentes = [...donghuas, ...mangasDex].slice(-10).reverse();
    console.log('Donghuas recentes:', donghuasRecentes);

    // Adicionar cada donghua ao grid
    donghuasRecentes.forEach(donghua => {
        console.log('Processando donghua:', donghua);
        const donghuaCard = createObraCard(donghua);
        gridDonghuasRecentes.appendChild(donghuaCard);
    });

    // Mostrar/ocultar seção baseado na existência de donghuas
    const containerDonghuasRecentes = document.querySelector('.recent-donghuas-container');
    containerDonghuasRecentes.style.display = donghuasRecentes.length > 0 ? 'block' : 'none';
}

// Carregar donghuas quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', carregarDonghuasRecentes);

// Escutar mudanças no localStorage
window.addEventListener('storage', (e) => {
    if (e.key === 'obras') {
        carregarDonghuasRecentes();
    }
});
