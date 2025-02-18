// Configuração inicial
document.addEventListener('DOMContentLoaded', () => {
    initializeCharts();
    loadTopObras();
    loadRecentActivity();
    setupEventListeners();
    loadObrasTable();
    configurarGerenciamentoEpisodios();
});

// Inicializar gráficos
function initializeCharts() {
    const ctx = document.getElementById('viewsChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Visualizações',
                data: [1200, 1900, 1500, 2100, 1800, 2500, 2200],
                borderColor: '#4a90e2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Carregar top obras
function loadTopObras() {
    const obras = JSON.parse(localStorage.getItem('obras')) || [];
    const topObrasContainer = document.querySelector('.top-obras');
    
    if (topObrasContainer) {
        const sortedObras = obras.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
        
        topObrasContainer.innerHTML = sortedObras.map((obra, index) => `
            <div class="top-obra-item">
                <span class="rank">#${index + 1}</span>
                <img src="${obra.imagem}" alt="${obra.titulo}">
                <div class="obra-info">
                    <h4>${obra.titulo}</h4>
                    <p>${obra.views || 0} visualizações</p>
                </div>
                <div class="trend ${getTrendClass(obra.trend)}">
                    <i class="fas fa-arrow-${obra.trend > 0 ? 'up' : 'down'}"></i>
                    ${Math.abs(obra.trend)}%
                </div>
            </div>
        `).join('');
    }
}

// Carregar atividade recente
function loadRecentActivity() {
    const activities = [
        { type: 'new_user', user: 'João Silva', time: '5 minutos atrás' },
        { type: 'new_comment', user: 'Maria Santos', obra: 'Naruto', time: '15 minutos atrás' },
        { type: 'new_rating', user: 'Pedro Costa', obra: 'One Piece', rating: 5, time: '30 minutos atrás' },
        { type: 'new_obra', obra: 'Dragon Ball', admin: 'Admin', time: '1 hora atrás' }
    ];
    
    const activityList = document.querySelector('.activity-list');
    if (activityList) {
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                ${getActivityIcon(activity.type)}
                <div class="activity-content">
                    ${getActivityContent(activity)}
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `).join('');
    }
}

// Carregar tabela de obras
function loadObrasTable() {
    const obras = JSON.parse(localStorage.getItem('obras')) || [];
    const tableContainer = document.querySelector('.obras-table');
    
    if (tableContainer) {
        tableContainer.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Status</th>
                        <th>Formato</th>
                        <th>Views</th>
                        <th>Última Atualização</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    ${obras.map(obra => `
                        <tr>
                            <td>
                                <div class="obra-cell">
                                    <img src="${obra.imagem}" alt="${obra.titulo}">
                                    <span>${obra.titulo}</span>
                                </div>
                            </td>
                            <td><span class="status-badge ${obra.status}">${obra.status}</span></td>
                            <td>${obra.formato}</td>
                            <td>${obra.views || 0}</td>
                            <td>${new Date(obra.updatedAt || obra.dataCriacao).toLocaleDateString()}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="edit-btn" data-id="${obra.id}"><i class="fas fa-edit"></i></button>
                                    <button class="delete-btn" data-id="${obra.id}"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        
        // Adicionar paginação
        const totalPages = Math.ceil(obras.length / 10);
        const pagination = document.querySelector('.obras-pagination');
        if (pagination) {
            pagination.innerHTML = `
                <button class="prev-page" disabled><i class="fas fa-chevron-left"></i></button>
                ${Array.from({length: totalPages}, (_, i) => `
                    <button class="page-number ${i === 0 ? 'active' : ''}">${i + 1}</button>
                `).join('')}
                <button class="next-page" ${totalPages <= 1 ? 'disabled' : ''}><i class="fas fa-chevron-right"></i></button>
            `;
        }
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Navegação
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });
    
    // Modal de Nova Obra
    const modal = document.getElementById('obraModal');
    document.querySelector('.add-obra-btn')?.addEventListener('click', () => {
        modal.style.display = 'flex';
    });
    
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Tags Input
    const tagsInput = document.getElementById('generoInput');
    const tagsContainer = document.querySelector('.tags-container');
    
    if (tagsInput && tagsContainer) {
        tagsInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.value.trim()) {
                e.preventDefault();
                addTag(e.target.value.trim());
                e.target.value = '';
            }
        });
    }
    
    // Tema
    document.querySelector('.theme-toggle')?.addEventListener('click', toggleTheme);
}

// Funções Auxiliares
function showSection(sectionId) {
    document.querySelectorAll('.admin-content > section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
}

function addTag(tag) {
    const tagsContainer = document.querySelector('.tags-container');
    const tagElement = document.createElement('span');
    tagElement.className = 'tag';
    tagElement.innerHTML = `
        ${tag}
        <button type="button" onclick="this.parentElement.remove()">×</button>
    `;
    tagsContainer.appendChild(tagElement);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('.theme-toggle i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

function getTrendClass(trend) {
    return trend > 0 ? 'positive' : 'negative';
}

function getActivityIcon(type) {
    const icons = {
        new_user: '<i class="fas fa-user-plus"></i>',
        new_comment: '<i class="fas fa-comment"></i>',
        new_rating: '<i class="fas fa-star"></i>',
        new_obra: '<i class="fas fa-film"></i>'
    };
    return `<div class="activity-icon">${icons[type]}</div>`;
}

function getActivityContent(activity) {
    switch (activity.type) {
        case 'new_user':
            return `<p><strong>${activity.user}</strong> se registrou no site</p>`;
        case 'new_comment':
            return `<p><strong>${activity.user}</strong> comentou em <strong>${activity.obra}</strong></p>`;
        case 'new_rating':
            return `<p><strong>${activity.user}</strong> avaliou <strong>${activity.obra}</strong> com ${activity.rating} estrelas</p>`;
        case 'new_obra':
            return `<p><strong>${activity.admin}</strong> adicionou uma nova obra: <strong>${activity.obra}</strong></p>`;
        default:
            return '';
    }
}

// Função para gerenciar episódios
function configurarGerenciamentoEpisodios() {
    const btnAdicionarEpisodio = document.getElementById('adicionarEpisodio');
    const corpoTabelaEpisodios = document.getElementById('corpoTabelaEpisodios');
    const formAdicionarDonghua = document.getElementById('formAdicionarDonghua');
    
    let episodios = [];

    btnAdicionarEpisodio.addEventListener('click', () => {
        const numeroEpisodio = document.getElementById('numeroEpisodio').value;
        const linkEpisodio = document.getElementById('linkEpisodio').value;
        const tituloEpisodio = document.getElementById('tituloEpisodio').value;
        const duracaoEpisodio = document.getElementById('duracaoEpisodio').value;

        // Validações básicas
        if (!numeroEpisodio || !linkEpisodio) {
            mostrarToast('Número do episódio e link são obrigatórios!', 'erro');
            return;
        }

        // Verificar se o episódio já existe
        const episodioExistente = episodios.find(ep => ep.numero === numeroEpisodio);
        if (episodioExistente) {
            mostrarToast('Este número de episódio já foi adicionado!', 'erro');
            return;
        }

        // Criar objeto do episódio
        const episodio = {
            numero: numeroEpisodio,
            link: linkEpisodio,
            titulo: tituloEpisodio || `Episódio ${numeroEpisodio}`,
            duracao: duracaoEpisodio || '24:00'
        };

        // Adicionar episódio à lista
        episodios.push(episodio);

        // Atualizar tabela de episódios
        const linhaEpisodio = document.createElement('tr');
        linhaEpisodio.innerHTML = `
            <td>${episodio.numero}</td>
            <td>${episodio.titulo}</td>
            <td>
                <a href="${episodio.link}" target="_blank" class="link-video">
                    Ver Link
                </a>
            </td>
            <td>
                <button class="btn-remover-episodio" data-numero="${episodio.numero}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        corpoTabelaEpisodios.appendChild(linhaEpisodio);

        // Configurar botão de remoção
        const btnRemover = linhaEpisodio.querySelector('.btn-remover-episodio');
        btnRemover.addEventListener('click', () => {
            const numeroParaRemover = btnRemover.getAttribute('data-numero');
            episodios = episodios.filter(ep => ep.numero !== numeroParaRemover);
            linhaEpisodio.remove();
        });

        // Limpar campos
        document.getElementById('numeroEpisodio').value = '';
        document.getElementById('linkEpisodio').value = '';
        document.getElementById('tituloEpisodio').value = '';
        document.getElementById('duracaoEpisodio').value = '';

        mostrarToast('Episódio adicionado com sucesso!', 'sucesso');
    });

    // Evento de submissão do formulário
    formAdicionarDonghua.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coletar dados da obra
        const donghua = {
            titulo: document.getElementById('tituloDonghua').value,
            generos: Array.from(document.getElementById('generoDonghua').selectedOptions).map(opt => opt.value),
            status: document.getElementById('statusDonghua').value,
            formato: document.getElementById('formatoDonghua').value,
            sinopse: document.getElementById('sinopseDonghua').value,
            totalEpisodios: document.getElementById('totalEpisodios').value,
            episodios: episodios
        };

        // Processar imagem de capa
        const capaDonghua = document.getElementById('capaDonghua').files[0];
        if (capaDonghua) {
            const leitor = new FileReader();
            leitor.onload = function(event) {
                donghua.capa = event.target.result;
                salvarDonghua(donghua);
            };
            leitor.readAsDataURL(capaDonghua);
        } else {
            salvarDonghua(donghua);
        }
    });
}

function salvarDonghua(donghua) {
    // Lógica para salvar a donghua
    console.log('Donghua a ser salva:', donghua);

    // Salvar no localStorage (simulação)
    let donghuasSalvas = JSON.parse(localStorage.getItem('donghuasSalvas') || '[]');
    donghuasSalvas.push(donghua);
    localStorage.setItem('donghuasSalvas', JSON.stringify(donghuasSalvas));

    // Fechar modal
    document.getElementById('adicionarDonghuaModal').style.display = 'none';

    // Mostrar mensagem de sucesso
    mostrarToast('Donghua adicionada com sucesso!', 'sucesso');

    // Atualizar lista de obras (se houver função)
    if (typeof atualizarListaObras === 'function') {
        atualizarListaObras();
    }
}
