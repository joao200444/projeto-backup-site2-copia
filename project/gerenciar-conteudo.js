// Chave secreta para criptografia (deve ser a mesma do login.js)
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Função para recuperar usuário de forma segura
function securelyGetUser(username) {
    const encryptedUser = localStorage.getItem(`user_${username}`);
    if (!encryptedUser) return null;

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Erro ao descriptografar dados do usuário');
        return null;
    }
}

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

// Verificar permissões e inicializar página
function initializeAdminPage() {
    if (!checkAdminAccess()) return;

    // Inicializar componentes da página
    initializeTabs();
    initializeModal();
    loadDonghuaList();
    setupEventListeners();
    setupEpisodeFields();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    initializeAdminPage();
});

// Inicializar tabs
function initializeTabs() {
    console.log('Inicializando tabs...');
    const tabs = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-tab');

            // Remover classe ativa de todas as tabs
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adicionar classe ativa na tab selecionada
            tab.classList.add('active');
            document.querySelector(`.tab-content[data-tab="${target}"]`).classList.add('active');
        });
    });

    // Ativar primeira tab
    if (tabs.length > 0) {
        tabs[0].click();
    }
}

// Inicializar modal
function initializeModal() {
    console.log('Inicializando modal...');
    const modal = document.getElementById('contentModal');
    const addButton = document.getElementById('addContentButton');
    const closeButton = document.querySelector('.close-button');
    const cancelButton = document.querySelector('.cancel-button');

    if (addButton) {
        addButton.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Configurar event listeners
function setupEventListeners() {
    console.log('Configurando event listeners...');
    const contentForm = document.getElementById('contentForm');
    if (contentForm) {
        contentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            saveDonghua(new FormData(contentForm));
        });
    }

    // Preview de imagem
    const coverInput = document.getElementById('coverImage');
    const imagePreview = document.getElementById('imagePreview');
    
    if (coverInput && imagePreview) {
        coverInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    imagePreview.style.display = 'block';
                    imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// Configurar campos de episódio
function setupEpisodeFields() {
    const episodeContainer = document.getElementById('episodeFields');
    if (!episodeContainer) return;

    const addEpisodeBtn = document.createElement('button');
    addEpisodeBtn.type = 'button';
    addEpisodeBtn.className = 'add-episode-btn';
    addEpisodeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Adicionar Episódio
    `;
    
    addEpisodeBtn.onclick = addEpisodeField;
    episodeContainer.appendChild(addEpisodeBtn);
    addEpisodeField(); // Adicionar primeiro campo
}

// Adicionar campo de episódio
function addEpisodeField() {
    const container = document.getElementById('episodeFields');
    const episodeDiv = document.createElement('div');
    episodeDiv.className = 'episode-field';
    
    const episodeCount = container.getElementsByClassName('episode-field').length + 1;
    
    episodeDiv.innerHTML = `
        <div class="episode-header">
            <h4>Episódio ${episodeCount}</h4>
            <button type="button" class="remove-episode" onclick="removeEpisodeField(this)">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>
        <div class="form-group">
            <label>Número do Capítulo</label>
            <input type="number" name="episode-number[]" required min="1" value="${episodeCount}">
        </div>
        <div class="form-group">
            <label>Título do Episódio</label>
            <input type="text" name="episode-title[]" required>
        </div>
        <div class="form-group">
            <label>Link do Vídeo</label>
            <input type="url" name="episode-url[]" required placeholder="https://...">
        </div>
        <div class="form-group">
            <label>Descrição do Episódio</label>
            <textarea name="episode-description[]" rows="2"></textarea>
        </div>
    `;
    
    container.insertBefore(episodeDiv, container.lastElementChild);
}

// Remover campo de episódio
function removeEpisodeField(button) {
    const episodeField = button.closest('.episode-field');
    episodeField.remove();
    updateEpisodeNumbers();
}

// Atualizar números dos episódios
function updateEpisodeNumbers() {
    const episodes = document.getElementsByClassName('episode-field');
    Array.from(episodes).forEach((episode, index) => {
        episode.querySelector('h4').textContent = `Episódio ${index + 1}`;
        episode.querySelector('input[name="episode-number[]"]').value = index + 1;
    });
}

// Salvar donghua
function saveDonghua(formData) {
    try {
        const donghuas = JSON.parse(localStorage.getItem('donghuas') || '[]');
        
        // Criar novo donghua
        const newDonghua = {
            id: Date.now().toString(),
            title: formData.get('title'),
            description: formData.get('description'),
            coverImage: formData.get('coverImage'),
            categories: Array.from(formData.getAll('categories')),
            status: formData.get('status'),
            episodes: [], // Será preenchido depois
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        donghuas.push(newDonghua);
        localStorage.setItem('donghuas', JSON.stringify(donghuas));
        
        // Fechar modal
        const modal = document.getElementById('contentModal');
        modal.style.display = 'none';
        
        // Mostrar mensagem de sucesso
        showSuccessMessage('Donghua adicionado com sucesso!');
        
        // Atualizar lista de donghuas
        loadDonghuaList();
        
        // Limpar formulário
        document.getElementById('contentForm').reset();
        
    } catch (error) {
        console.error('Erro ao salvar donghua:', error);
        alert('Erro ao salvar donghua. Por favor, tente novamente.');
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.querySelector('.content-header').appendChild(successDiv);
    
    // Remove a mensagem após 3 segundos
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Atualizar conteúdo na página inicial
function updateHomeContent(donghua) {
    const homeContent = JSON.parse(localStorage.getItem('homeContent') || '[]');
    homeContent.push({
        id: donghua.id,
        title: donghua.title,
        coverUrl: donghua.coverUrl,
        episodeCount: donghua.episodes.length,
        categories: donghua.categories
    });
    localStorage.setItem('homeContent', JSON.stringify(homeContent));
}

// Carregar lista de donghuas
function loadDonghuaList() {
    const donghuas = getDonghuas();
    const tableBody = document.getElementById('donghuaTableBody');
    tableBody.innerHTML = '';

    donghuas.forEach(donghua => {
        const row = createDonghuaRow(donghua);
        tableBody.appendChild(row);
    });
}

// Criar linha da tabela para donghua
function createDonghuaRow(donghua) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="content-title">
                <img src="${donghua.coverUrl || 'placeholder.jpg'}" alt="${donghua.title}">
                <span>${donghua.title}</span>
            </div>
        </td>
        <td><span class="status-badge ${donghua.status}">${donghua.status}</span></td>
        <td>${donghua.episodeCount || 0}</td>
        <td>${new Date(donghua.lastUpdate).toLocaleDateString('pt-BR')}</td>
        <td>
            <div class="action-buttons">
                <button class="edit-btn" data-id="${donghua.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                </button>
                <button class="delete-btn" data-id="${donghua.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </td>
    `;

    // Adicionar eventos aos botões
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    editBtn.addEventListener('click', () => editDonghua(donghua.id));
    deleteBtn.addEventListener('click', () => deleteDonghua(donghua.id));

    return row;
}

// Configurar event listeners
function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchDonghua');
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase();
        filterDonghuas(searchTerm);
    }, 300));

    // Status Filter
    const statusFilter = document.getElementById('statusFilter');
    statusFilter.addEventListener('change', () => {
        const status = statusFilter.value;
        filterDonghuas('', status);
    });

    // Form Submit
    const contentForm = document.getElementById('contentForm');
    contentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveDonghua(new FormData(contentForm));
    });
}

// Funções de CRUD
function getDonghuas() {
    const donghuas = localStorage.getItem('donghuas');
    return donghuas ? JSON.parse(donghuas) : [];
}

function editDonghua(id) {
    const donghuas = getDonghuas();
    const donghua = donghuas.find(d => d.id === id);
    if (!donghua) return;

    // Preencher formulário
    document.getElementById('title').value = donghua.title;
    document.getElementById('description').value = donghua.description;
    document.getElementById('status').value = donghua.status;
    
    // Selecionar categorias
    const categoriesSelect = document.getElementById('categories');
    Array.from(categoriesSelect.options).forEach(opt => {
        opt.selected = donghua.categories.includes(opt.value);
    });

    // Abrir modal
    document.getElementById('contentModal').style.display = 'block';
}

function deleteDonghua(id) {
    if (!confirm('Tem certeza que deseja excluir este donghua?')) return;

    const donghuas = getDonghuas();
    const updatedDonghuas = donghuas.filter(d => d.id !== id);
    localStorage.setItem('donghuas', JSON.stringify(updatedDonghuas));
    loadDonghuaList();
}

// Funções utilitárias
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

function filterDonghuas(searchTerm = '', status = 'all') {
    const donghuas = getDonghuas();
    const filtered = donghuas.filter(donghua => {
        const matchesSearch = donghua.title.toLowerCase().includes(searchTerm);
        const matchesStatus = status === 'all' || donghua.status === status;
        return matchesSearch && matchesStatus;
    });

    const tableBody = document.getElementById('donghuaTableBody');
    tableBody.innerHTML = '';
    filtered.forEach(donghua => {
        const row = createDonghuaRow(donghua);
        tableBody.appendChild(row);
    });
}
