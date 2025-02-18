// Função para carregar os detalhes da obra
document.addEventListener('DOMContentLoaded', () => {
    // Recupera os dados da obra do localStorage
    const obraData = JSON.parse(localStorage.getItem('selectedDonghua'));

    if (!obraData) {
        console.error('Nenhuma obra selecionada');
        return;
    }

    // Atualiza os detalhes da obra
    updateObraDetails(obraData);

    // Carrega os capítulos
    loadChapters(obraData);
});

function updateObraDetails(obra) {
    // Atualiza a imagem de capa
    const coverImage = document.querySelector('.obra-cover-custom img');
    coverImage.src = obra.imagem;
    coverImage.alt = obra.titulo;

    // Atualiza o título
    const titleElement = document.querySelector('.obra-title-custom');
    titleElement.textContent = obra.titulo;

    // Atualiza os metadados
    const metaContainer = document.querySelector('.obra-meta-custom');
    metaContainer.innerHTML = `
        <div class="obra-meta-item">
            <i class="fas fa-book"></i>
            <span>${obra.capitulos ? obra.capitulos.length : 'N/A'} Capítulos</span>
        </div>
        <div class="obra-meta-item">
            <i class="fas fa-star"></i>
            <span>${obra.avaliacao} Avaliação</span>
        </div>
        <div class="obra-meta-item">
            <i class="fas fa-tag"></i>
            <span>${obra.genero}</span>
        </div>
        <div class="obra-meta-item">
            <i class="fas fa-circle"></i>
            <span>${obra.status}</span>
        </div>
    `;

    // Atualiza a sinopse
    const synopsisElement = document.querySelector('.obra-synopsis-custom');
    synopsisElement.textContent = obra.sinopse;
}

function loadChapters(obra) {
    const chaptersList = document.querySelector('.chapters-list-custom');
    if (!chaptersList) return;

    chaptersList.innerHTML = '';

    // Verifica se a obra tem capítulos
    if (!obra.capitulos || !Array.isArray(obra.capitulos)) {
        chaptersList.innerHTML = '<p>Nenhum capítulo disponível.</p>';
        return;
    }

    // Ordena os capítulos pelo número (ordem crescente)
    const sortedChapters = [...obra.capitulos].sort((a, b) => {
        return parseInt(a.numero) - parseInt(b.numero);
    });

    sortedChapters.forEach(chapter => {
        const chapterCard = document.createElement('div');
        chapterCard.className = 'chapter-card';
        
        // Adiciona evento de clique para redirecionar para o player
        chapterCard.addEventListener('click', () => {
            if (chapter.linkVideo) {
                // Prepara os dados do capítulo para o player
                const selectedCapitulo = {
                    capituloNumero: chapter.numero,
                    capituloTitulo: chapter.titulo,
                    capituloLink: chapter.linkVideo,
                    donghuaTitulo: obra.titulo
                };
                
                // Salva os dados do capítulo no localStorage
                localStorage.setItem('selectedCapitulo', JSON.stringify(selectedCapitulo));
                
                // Redireciona para o player
                window.location.href = 'player.html';
            }
        });

        chapterCard.innerHTML = `
            <div class="chapter-info">
                <span class="chapter-number">Capítulo ${chapter.numero}</span>
                <span class="chapter-title">${chapter.titulo || `Capítulo ${chapter.numero}`}</span>
            </div>
            <span class="chapter-date">${formatDate(chapter.data) || 'Data não disponível'}</span>
        `;

        chaptersList.appendChild(chapterCard);
    });
}

function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Erro ao formatar data:', error);
        return '';
    }
}
