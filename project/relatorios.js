// Chave secreta para criptografia
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Verificar se o usuário é admin
function checkAdminAccess() {
    const encryptedUser = localStorage.getItem('currentUser');
    if (!encryptedUser) {
        window.location.href = 'login.html';
        return false;
    }

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const currentUser = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

        if (!currentUser.isAdmin) {
            window.location.href = 'index.html';
            return false;
        }

        // Verificar token de sessão
        const storedToken = localStorage.getItem(`session_${currentUser.username}`);
        if (storedToken !== currentUser.sessionToken) {
            window.location.href = 'login.html';
            return false;
        }

        return true;
    } catch (error) {
        console.error('Erro ao verificar permissões:', error);
        window.location.href = 'login.html';
        return false;
    }
}

// Inicializar página
function initializePage() {
    if (!checkAdminAccess()) return;

    initializeDatePicker();
    loadMetrics();
    initializeCharts();
    loadRecentActivities();
}

// Inicializar seletor de data
function initializeDatePicker() {
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "d/m/Y",
        locale: "pt",
        defaultDate: [new Date().setDate(1), new Date()],
        onChange: function(selectedDates) {
            if (selectedDates.length === 2) {
                updateCharts(selectedDates[0], selectedDates[1]);
            }
        }
    });
}

// Carregar métricas gerais
function loadMetrics() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const donghuas = JSON.parse(localStorage.getItem('donghuas') || '[]');
    const views = JSON.parse(localStorage.getItem('views') || '[]');

    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('activeUsers').textContent = users.filter(u => u.status === 'active').length;
    document.getElementById('totalDonghuas').textContent = donghuas.length;
    document.getElementById('totalViews').textContent = views.length;
}

// Inicializar gráficos
function initializeCharts() {
    // Gráfico de Usuários Logados
    const loginCtx = document.getElementById('loginChart').getContext('2d');
    new Chart(loginCtx, {
        type: 'line',
        data: {
            labels: generateDayLabels(),
            datasets: [{
                label: 'Usuários Logados',
                data: generateRandomData(31),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Donghuas Populares
    const popularCtx = document.getElementById('popularDonghuasChart').getContext('2d');
    new Chart(popularCtx, {
        type: 'bar',
        data: {
            labels: ['Donghua 1', 'Donghua 2', 'Donghua 3', 'Donghua 4', 'Donghua 5'],
            datasets: [{
                label: 'Visualizações',
                data: generateRandomData(5),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Gráfico de Categorias
    const categoriesCtx = document.getElementById('categoriesChart').getContext('2d');
    new Chart(categoriesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Ação', 'Aventura', 'Comédia', 'Drama', 'Fantasia'],
            datasets: [{
                data: generateRandomData(5),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });

    // Gráfico de Novos Usuários
    const newUsersCtx = document.getElementById('newUsersChart').getContext('2d');
    new Chart(newUsersCtx, {
        type: 'bar',
        data: {
            labels: generateDayLabels(),
            datasets: [{
                label: 'Novos Usuários',
                data: generateRandomData(31),
                backgroundColor: 'rgba(75, 192, 192, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Carregar atividades recentes
function loadRecentActivities() {
    const activities = [
        { date: '11/02/2025', user: 'Usuario1', action: 'Login', details: 'Login bem-sucedido' },
        { date: '11/02/2025', user: 'Admin', action: 'Adicionar Donghua', details: 'Novo donghua adicionado' },
        { date: '11/02/2025', user: 'Usuario2', action: 'Visualização', details: 'Visualizou episódio 1' },
        // Adicione mais atividades conforme necessário
    ];

    const tbody = document.getElementById('activitiesTable');
    tbody.innerHTML = activities.map(activity => `
        <tr>
            <td>${activity.date}</td>
            <td>${activity.user}</td>
            <td>${activity.action}</td>
            <td>${activity.details}</td>
        </tr>
    `).join('');
}

// Funções auxiliares
function generateDayLabels() {
    const days = [];
    for (let i = 1; i <= 31; i++) {
        days.push(i.toString());
    }
    return days;
}

function generateRandomData(count) {
    return Array.from({ length: count }, () => Math.floor(Math.random() * 100));
}

// Atualizar gráficos com base no período selecionado
function updateCharts(startDate, endDate) {
    // Implementar lógica para atualizar os gráficos com base no período selecionado
    console.log('Atualizando gráficos para o período:', startDate, endDate);
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', initializePage);
