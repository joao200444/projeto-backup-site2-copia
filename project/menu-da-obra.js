// Dados de exemplo das obras com 10 capítulos cada
const obras = {
    1: {
        id: 1,
        titulo: "Martial Peak",
        cover: "https://exemplo.com/imagem.jpg",
        status: "Em Lançamento",
        ano: 2023,
        generos: ["Ação", "Aventura", "Cultivo", "Artes Marciais"],
        rating: 4.5,
        sinopse: "A jornada ao pico marcial é solitária e longa. Enfrentando adversidades, você deve sobreviver e permanecer firme. Apenas aqueles com força de vontade inabalável podem alcançar o ápice.",
        autor: "Momo",
        estudio: "Divine Animation Studio",
        totalCapitulos: 10,
        capitulos: [
            { numero: 1, titulo: "O Início do Cultivo", dataLancamento: "01/01/2023", visualizacoes: 15420 },
            { numero: 2, titulo: "Primeiro Desafio", dataLancamento: "08/01/2023", visualizacoes: 14320 },
            { numero: 3, titulo: "Descoberta do Qi", dataLancamento: "15/01/2023", visualizacoes: 13280 },
            { numero: 4, titulo: "Treinamento Intenso", dataLancamento: "22/01/2023", visualizacoes: 12450 },
            { numero: 5, titulo: "O Torneio Começa", dataLancamento: "29/01/2023", visualizacoes: 11870 },
            { numero: 6, titulo: "Primeira Vitória", dataLancamento: "05/02/2023", visualizacoes: 10930 },
            { numero: 7, titulo: "Novo Poder", dataLancamento: "12/02/2023", visualizacoes: 9840 },
            { numero: 8, titulo: "O Rival Aparece", dataLancamento: "19/02/2023", visualizacoes: 8760 },
            { numero: 9, titulo: "Batalha Decisiva", dataLancamento: "26/02/2023", visualizacoes: 7650 },
            { numero: 10, titulo: "Avanço de Nível", dataLancamento: "05/03/2023", visualizacoes: 6540 }
        ]
    },
    2: {
        id: 2,
        titulo: "Tales of Demons and Gods",
        cover: "https://exemplo.com/imagem2.jpg",
        status: "Em Lançamento",
        ano: 2023,
        generos: ["Ação", "Aventura", "Fantasia", "Reencarnação"],
        rating: 4.7,
        sinopse: "Um expert marcial reencarna no passado, em seu corpo mais jovem, para corrigir os erros de sua vida e proteger a cidade que falhou em salvar.",
        autor: "Mad Snail",
        estudio: "AC.qq",
        totalCapitulos: 10,
        capitulos: [
            { numero: 1, titulo: "Retorno ao Passado", dataLancamento: "01/01/2023", visualizacoes: 25420 },
            { numero: 2, titulo: "Nova Chance", dataLancamento: "08/01/2023", visualizacoes: 24320 },
            { numero: 3, titulo: "Academia", dataLancamento: "15/01/2023", visualizacoes: 23280 },
            { numero: 4, titulo: "Primeiro Teste", dataLancamento: "22/01/2023", visualizacoes: 22450 },
            { numero: 5, titulo: "Revelação", dataLancamento: "29/01/2023", visualizacoes: 21870 },
            { numero: 6, titulo: "Poder Oculto", dataLancamento: "05/02/2023", visualizacoes: 20930 },
            { numero: 7, titulo: "Demônios", dataLancamento: "12/02/2023", visualizacoes: 19840 },
            { numero: 8, titulo: "Cidade em Perigo", dataLancamento: "19/02/2023", visualizacoes: 18760 },
            { numero: 9, titulo: "Proteção", dataLancamento: "26/02/2023", visualizacoes: 17650 },
            { numero: 10, titulo: "Nova Força", dataLancamento: "05/03/2023", visualizacoes: 16540 }
        ]
    },
    3: {
        id: 3,
        titulo: "Soul Land",
        cover: "https://exemplo.com/imagem3.jpg",
        status: "Em Lançamento",
        ano: 2023,
        generos: ["Ação", "Aventura", "Fantasia", "Romance"],
        rating: 4.6,
        sinopse: "Em um mundo onde as almas marciais determinam seu poder, um jovem começa sua jornada para se tornar o mais forte.",
        autor: "Tang Jia San Shao",
        estudio: "Colored Pencil Animation",
        totalCapitulos: 10,
        capitulos: [
            { numero: 1, titulo: "Alma Marcial", dataLancamento: "01/01/2023", visualizacoes: 35420 },
            { numero: 2, titulo: "Academia Shrek", dataLancamento: "08/01/2023", visualizacoes: 34320 },
            { numero: 3, titulo: "Primeiro Anel", dataLancamento: "15/01/2023", visualizacoes: 33280 },
            { numero: 4, titulo: "Treinamento", dataLancamento: "22/01/2023", visualizacoes: 32450 },
            { numero: 5, titulo: "Competição", dataLancamento: "29/01/2023", visualizacoes: 31870 },
            { numero: 6, titulo: "Novo Poder", dataLancamento: "05/02/2023", visualizacoes: 30930 },
            { numero: 7, titulo: "Desafio", dataLancamento: "12/02/2023", visualizacoes: 29840 },
            { numero: 8, titulo: "Evolução", dataLancamento: "19/02/2023", visualizacoes: 28760 },
            { numero: 9, titulo: "Grande Batalha", dataLancamento: "26/02/2023", visualizacoes: 27650 },
            { numero: 10, titulo: "Vitória", dataLancamento: "05/03/2023", visualizacoes: 26540 }
        ]
    },
    4: {
        id: 4,
        titulo: "Battle Through the Heavens",
        cover: "https://exemplo.com/imagem4.jpg",
        status: "Em Lançamento",
        ano: 2023,
        generos: ["Ação", "Aventura", "Fantasia", "Artes Marciais"],
        rating: 4.8,
        sinopse: "A história de um gênio que perdeu seus poderes e sua jornada para recuperá-los e se tornar o mais forte.",
        autor: "Heavenly Silkworm Potato",
        estudio: "Shanghai Motion Magic",
        totalCapitulos: 10,
        capitulos: [
            { numero: 1, titulo: "Gênio Caído", dataLancamento: "01/01/2023", visualizacoes: 45420 },
            { numero: 2, titulo: "Chama Misteriosa", dataLancamento: "08/01/2023", visualizacoes: 44320 },
            { numero: 3, titulo: "Treinamento Secreto", dataLancamento: "15/01/2023", visualizacoes: 43280 },
            { numero: 4, titulo: "Primeiro Sucesso", dataLancamento: "22/01/2023", visualizacoes: 42450 },
            { numero: 5, titulo: "Desafio Público", dataLancamento: "29/01/2023", visualizacoes: 41870 },
            { numero: 6, titulo: "Revelação", dataLancamento: "05/02/2023", visualizacoes: 40930 },
            { numero: 7, titulo: "Nova Técnica", dataLancamento: "12/02/2023", visualizacoes: 39840 },
            { numero: 8, titulo: "Confronto", dataLancamento: "19/02/2023", visualizacoes: 38760 },
            { numero: 9, titulo: "Vingança", dataLancamento: "26/02/2023", visualizacoes: 37650 },
            { numero: 10, titulo: "Ascensão", dataLancamento: "05/03/2023", visualizacoes: 36540 }
        ]
    }
};

// Obter ID da obra da URL ou localStorage
const obraId = 1; // Por enquanto fixo como 1 para teste

// Estado da aplicação
let obraAtual = null;

// Função para carregar os dados da obra
function carregarDadosObra() {
    obraAtual = obras[obraId];
    if (!obraAtual) return;

    document.getElementById('obraTitleCustom').textContent = obraAtual.titulo;
    document.getElementById('obraCoverCustom').src = obraAtual.cover;
    document.getElementById('obraGenreCustom').textContent = obraAtual.generos.join(', ');
    document.getElementById('obraRatingCustom').textContent = obraAtual.rating;
    document.getElementById('obraStatusCustom').textContent = obraAtual.status;
    document.getElementById('obraSynopsisCustom').textContent = obraAtual.sinopse;

    // Carregar capítulos iniciais
    atualizarListaCapitulos(obraAtual.capitulos);
}

// Função para atualizar a lista de capítulos
function atualizarListaCapitulos(capitulos = []) {
    const chaptersContainer = document.getElementById('obraChaptersCustom');
    if (!chaptersContainer) return;

    chaptersContainer.innerHTML = '';
    
    capitulos.forEach(capitulo => {
        const card = document.createElement('div');
        card.className = 'chapter-card';
        
        card.innerHTML = `
            <div class="chapter-info">
                <div class="chapter-number">Capítulo ${capitulo.numero}</div>
                <div class="chapter-title">${capitulo.titulo}</div>
                <div class="chapter-date">${capitulo.dataLancamento}</div>
            </div>
        `;
        
        // Adicionar evento de clique para navegação
        card.addEventListener('click', () => {
            // Navegar para a página do player com os parâmetros da obra e capítulo
            const playerUrl = `player.html?obra=${obraId}&capitulo=${capitulo.numero}`;
            window.location.href = playerUrl;
        });
        
        chaptersContainer.appendChild(card);
    });
}

// Função para filtrar capítulos
function filtrarCapitulos(query) {
    if (!obraAtual) return;

    const termoBusca = query.toLowerCase().trim();
    const capitulosFiltrados = obraAtual.capitulos.filter(capitulo => {
        const numeroStr = `Capítulo ${capitulo.numero}`.toLowerCase();
        const titulo = capitulo.titulo.toLowerCase();
        return numeroStr.includes(termoBusca) || titulo.includes(termoBusca);
    });

    atualizarListaCapitulos(capitulosFiltrados);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    carregarDadosObra();

    // Adicionar evento de busca
    const searchInput = document.getElementById('chapterSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filtrarCapitulos(e.target.value);
        });
    }
});
