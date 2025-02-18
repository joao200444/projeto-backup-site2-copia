// Chave secreta para criptografia (deve ser a mesma do login.js)
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Função para verificar sessão de forma segura
function getSecureCurrentUser() {
    const encryptedUser = localStorage.getItem('currentUser');
    if (!encryptedUser) return null;

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Erro ao descriptografar dados do usuário');
        return null;
    }
}

// Função para salvar dados do perfil de forma segura
function securelyStoreProfile(username, profileData) {
    const encryptedProfile = CryptoJS.AES.encrypt(
        JSON.stringify(profileData),
        SECRET_KEY
    ).toString();
    
    localStorage.setItem(`profile_${username}`, encryptedProfile);
}

// Função para recuperar dados do perfil de forma segura
function securelyGetProfile(username) {
    const encryptedProfile = localStorage.getItem(`profile_${username}`);
    if (!encryptedProfile) return null;

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedProfile, SECRET_KEY);
        return JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Erro ao descriptografar dados do perfil');
        return null;
    }
}

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

// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const sidebarItems = document.querySelectorAll('.sidebar-item');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    menuBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuBtn.style.display = 'block';
});

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
    });
});

// Verificar se o usuário está logado
function checkAuth() {
    const currentUser = getSecureCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

// Carregar dados do usuário
function loadUserProfile() {
    const currentUser = checkAuth();
    if (!currentUser) return;

    // Obter nome do usuário da URL
    const urlParams = new URLSearchParams(window.location.search);
    const profileUsername = urlParams.get('username') || currentUser.username;

    // Carregar dados do perfil
    const profileData = securelyGetProfile(profileUsername);
    const userData = securelyGetUser(profileUsername);
    
    if (!profileData || !userData) {
        console.error('Perfil não encontrado');
        return;
    }

    // Atualizar nome do usuário
    const usernameElement = document.getElementById('profileUsername');
    if (usernameElement) {
        usernameElement.textContent = profileUsername;
        
        // Adicionar ícone de admin se aplicável
        if (userData.isAdmin) {
            const adminBadge = document.createElement('span');
            adminBadge.className = 'admin-badge';
            adminBadge.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Admin
            `;
            usernameElement.appendChild(adminBadge);
        }
    }

    // Mostrar/esconder seção de admin e configurar botões
    setupAdminSection(currentUser, profileUsername);

    // Atualizar data de ingresso
    const joinDateElement = document.getElementById('joinDate');
    if (joinDateElement && profileData.joinDate) {
        const joinDate = new Date(profileData.joinDate);
        joinDateElement.textContent = joinDate.toLocaleDateString('pt-BR');
    }

    // Atualizar avatar
    const avatarImg = document.getElementById('avatarImg');
    if (avatarImg && profileData.avatarUrl) {
        avatarImg.src = profileData.avatarUrl;
    }

    // Atualizar capa
    if (profileData.coverUrl) {
        document.querySelector('.profile-cover').style.backgroundImage = `url(${profileData.coverUrl})`;
    }

    // Atualizar bio
    const bioText = document.getElementById('bioText');
    if (bioText) {
        bioText.value = profileData.bio || '';
        updateBioCharCount();
    }

    // Atualizar estatísticas
    const stats = profileData.stats || { watched: 0, episodes: 0, comments: 0 };
    document.getElementById('totalWatched').textContent = stats.watched;
    document.getElementById('totalEpisodes').textContent = stats.episodes;
    document.getElementById('totalComments').textContent = stats.comments;

    // Atualizar configurações
    const settings = profileData.settings || { emailNotifications: false, privateProfile: false };
    document.getElementById('emailNotifications').checked = settings.emailNotifications;
    document.getElementById('privateProfile').checked = settings.privateProfile;
}

// Configurar seção de admin e seus botões
function setupAdminSection(currentUser, profileUsername) {
    const adminSection = document.getElementById('adminSection');
    if (!adminSection) return;

    // Mostrar seção apenas se for o próprio perfil E for admin
    if (currentUser.username === profileUsername && currentUser.isAdmin) {
        adminSection.style.display = 'block';

        // Configurar eventos dos botões
        const buttons = {
            userControlBtn: 'controle-usuarios.html',
            contentControlBtn: 'gerenciar-conteudo.html',
            reportsBtn: 'relatorios.html',
            systemConfigBtn: 'configuracoes-sistema.html'
        };

        // Adicionar eventos para cada botão
        Object.entries(buttons).forEach(([btnId, url]) => {
            const button = document.getElementById(btnId);
            if (button) {
                button.onclick = () => window.location.href = url;
            }
        });
    } else {
        adminSection.style.display = 'none';
    }
}

// Atualizar contador de caracteres da bio
function updateBioCharCount() {
    const bioText = document.getElementById('bioText');
    const charCount = document.querySelector('.bio-char-count');
    if (bioText && charCount) {
        charCount.textContent = `${bioText.value.length}/500`;
    }
}

// Manipular upload de avatar
document.getElementById('avatarUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const currentUser = checkAuth();
            if (!currentUser) return;

            // Atualizar imagem na página
            document.getElementById('avatarImg').src = e.target.result;

            // Salvar URL da imagem no perfil
            const profileData = securelyGetProfile(currentUser.username) || {};
            profileData.avatarUrl = e.target.result;
            securelyStoreProfile(currentUser.username, profileData);
        };
        reader.readAsDataURL(file);
    }
});

// Manipular upload de capa
document.getElementById('coverUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const currentUser = checkAuth();
            if (!currentUser) return;

            // Atualizar imagem de fundo
            document.querySelector('.profile-cover').style.backgroundImage = `url(${e.target.result})`;

            // Salvar URL da imagem no perfil
            const profileData = securelyGetProfile(currentUser.username) || {};
            profileData.coverUrl = e.target.result;
            securelyStoreProfile(currentUser.username, profileData);
        };
        reader.readAsDataURL(file);
    }
});

// Salvar biografia
document.getElementById('saveBioBtn').addEventListener('click', function() {
    const currentUser = checkAuth();
    if (!currentUser) return;

    const bioText = document.getElementById('bioText').value;
    const profileData = securelyGetProfile(currentUser.username) || {};
    profileData.bio = bioText;
    securelyStoreProfile(currentUser.username, profileData);

    // Mostrar mensagem de sucesso
    alert('Biografia salva com sucesso!');
});

// Salvar configurações
document.getElementById('saveSettingsBtn').addEventListener('click', function() {
    const currentUser = checkAuth();
    if (!currentUser) return;

    const emailNotifications = document.getElementById('emailNotifications').checked;
    const privateProfile = document.getElementById('privateProfile').checked;

    const profileData = securelyGetProfile(currentUser.username) || {};
    profileData.settings = {
        emailNotifications,
        privateProfile
    };
    securelyStoreProfile(currentUser.username, profileData);

    // Mostrar mensagem de sucesso
    alert('Configurações salvas com sucesso!');
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', function() {
    const currentUser = getSecureCurrentUser();
    if (currentUser) {
        localStorage.removeItem(`session_${currentUser.username}`);
    }
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
});

// Excluir conta
document.getElementById('deleteAccountBtn').addEventListener('click', function() {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
        const currentUser = checkAuth();
        if (!currentUser) return;

        // Remover todos os dados do usuário
        localStorage.removeItem(`user_${currentUser.username}`);
        localStorage.removeItem(`profile_${currentUser.username}`);
        localStorage.removeItem(`session_${currentUser.username}`);
        localStorage.removeItem('currentUser');

        // Redirecionar para a página de login
        window.location.href = 'login.html';
    }
});

// Event listeners
document.getElementById('bioText').addEventListener('input', updateBioCharCount);

// Verificar admin e mostrar badge
function checkAndShowAdminBadge() {
    const currentUser = getSecureCurrentUser();
    if (currentUser && currentUser.isAdmin) {
        const adminBadge = document.createElement('div');
        adminBadge.className = 'admin-badge';
        adminBadge.textContent = 'Admin';
        document.body.appendChild(adminBadge);
    }
}

// Atualizar ações do perfil
function updateProfileActions() {
    const actionsContainer = document.querySelector('.profile-actions');
    if (!actionsContainer) return;

    const currentUser = getSecureCurrentUser();
    if (!currentUser) return;

    // Limpar ações existentes
    actionsContainer.innerHTML = '';

    // Adicionar botão de editar se for o próprio perfil
    if (currentUser.username === profileUsername) {
        const editButton = document.createElement('button');
        editButton.className = 'action-button edit-button';
        editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Editar Perfil
        `;
        editButton.onclick = openEditModal;
        actionsContainer.appendChild(editButton);

        // Se for admin, adicionar botão de controle de usuários
        if (currentUser.isAdmin) {
            const usersButton = document.createElement('button');
            usersButton.className = 'action-button users-button';
            usersButton.style.backgroundColor = '#2196F3'; // Cor azul
            usersButton.style.color = 'white';
            usersButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                Controle de Usuários
            `;
            usersButton.onclick = () => window.location.href = 'controle-usuarios.html';
            actionsContainer.appendChild(usersButton);
        }

        const logoutButton = document.createElement('button');
        logoutButton.className = 'action-button logout-button';
        logoutButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Sair
        `;
        logoutButton.onclick = handleLogout;
        actionsContainer.appendChild(logoutButton);
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se há um usuário logado
    const currentUser = getSecureCurrentUser();
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Obter nome do usuário da URL
    const urlParams = new URLSearchParams(window.location.search);
    window.profileUsername = urlParams.get('username') || currentUser.username;

    // Carregar perfil do usuário
    loadUserProfile();
    
    // Atualizar botões de ação
    updateProfileActions();
    
    // Event listeners
    setupEventListeners();
    createAdminCards();
});

// Adicionar HTML do modal de configurações quando o documento carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar modal ao body
    document.body.insertAdjacentHTML('beforeend', `
        <div id="configModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Configurações do Sistema</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="config-grid">
                        <!-- Idioma -->
                        <div class="config-item">
                            <h3>Idioma</h3>
                            <select id="languageSelect">
                                <option value="pt-BR">Português (Brasil)</option>
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="zh">中文</option>
                            </select>
                        </div>

                        <!-- Tema -->
                        <div class="config-item">
                            <h3>Tema</h3>
                            <select id="themeSelect">
                                <option value="light">Claro</option>
                                <option value="dark">Escuro</option>
                                <option value="auto">Automático</option>
                            </select>
                        </div>

                        <!-- Notificações -->
                        <div class="config-item">
                            <h3>Notificações</h3>
                            <label>
                                <input type="checkbox" id="emailNotif"> Notificações por Email
                            </label>
                            <label>
                                <input type="checkbox" id="pushNotif"> Notificações Push
                            </label>
                        </div>

                        <!-- Cache -->
                        <div class="config-item">
                            <button id="clearCache" class="config-button">Limpar Cache</button>
                            <div class="cache-info">
                                <span>Uso: </span>
                                <span id="cacheSize">0 MB</span>
                            </div>
                        </div>

                        <!-- Outras Opções -->
                        <div class="config-item">
                            <h3>Outras Opções</h3>
                            <label>
                                <input type="checkbox" id="autoUpdate"> Atualização Automática
                            </label>
                            <label>
                                <input type="checkbox" id="showNotif"> Mostrar Notificações
                            </label>
                        </div>
                    </div>
                    
                    <div class="modal-footer">
                        <button class="cancel-button">Cancelar</button>
                        <button class="save-button">Salvar Alterações</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    // Inicializar modal de configurações
    initConfigModal();
});

// Função para criar os cards administrativos
function createAdminCards() {
    const adminSection = document.querySelector('.admin-section');
    if (!adminSection) return;

    adminSection.innerHTML = `
        <div class="admin-card">
            <div class="admin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            </div>
            <h3>Controle de Usuários</h3>
            <p>Gerencie contas, permissões e status dos usuários.</p>
            <a href="controle-usuarios.html" class="admin-button">Acessar</a>
        </div>
        <div class="admin-card">
            <div class="admin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
            </div>
            <h3>Gerenciar Conteúdo</h3>
            <p>Adicione e gerencie donghuas e episódios.</p>
            <a href="gerenciar-conteudo.html" class="admin-button">Acessar</a>
        </div>
        <div class="admin-card">
            <div class="admin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
            </div>
            <h3>Relatórios e Estatísticas</h3>
            <p>Visualize dados e métricas do sistema.</p>
            <a href="relatorios.html" class="admin-button">Acessar</a>
        </div>
        <div class="admin-card" onclick="openConfigModal()">
            <div class="admin-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
            </div>
            <h3>Configurações do Sistema</h3>
            <p>Configure preferências e opções do sistema.</p>
            <button class="admin-button">Configurar</button>
        </div>
    `;
}

// Função para abrir o modal
function openConfigModal() {
    const modal = document.getElementById('configModal');
    if (modal) {
        modal.style.display = 'block';
        loadCurrentConfig();
    }
}

// Função para inicializar o modal
function initConfigModal() {
    const modal = document.getElementById('configModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close');
    const cancelBtn = modal.querySelector('.cancel-button');
    const saveBtn = modal.querySelector('.save-button');
    const clearCacheBtn = document.getElementById('clearCache');

    // Carregar configurações iniciais
    loadCurrentConfig();

    // Fechar modal
    closeBtn.onclick = () => modal.style.display = 'none';
    cancelBtn.onclick = () => modal.style.display = 'none';

    // Clicar fora do modal
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    }

    // Salvar configurações
    saveBtn.onclick = saveConfig;

    // Limpar cache
    clearCacheBtn.onclick = clearCache;

    // Atualizar uso de cache
    updateCacheSize();
}

// Função para carregar configurações atuais
function loadCurrentConfig() {
    const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
    
    document.getElementById('languageSelect').value = config.language || 'pt-BR';
    document.getElementById('themeSelect').value = config.theme || 'light';
    document.getElementById('emailNotif').checked = config.emailNotifications !== false;
    document.getElementById('pushNotif').checked = config.pushNotifications !== false;
    document.getElementById('autoUpdate').checked = config.autoUpdate !== false;
    document.getElementById('showNotif').checked = config.showNotifications !== false;
}

// Função para salvar configurações
function saveConfig() {
    const config = {
        language: document.getElementById('languageSelect').value,
        theme: document.getElementById('themeSelect').value,
        emailNotifications: document.getElementById('emailNotif').checked,
        pushNotifications: document.getElementById('pushNotif').checked,
        autoUpdate: document.getElementById('autoUpdate').checked,
        showNotifications: document.getElementById('showNotif').checked
    };

    localStorage.setItem('systemConfig', JSON.stringify(config));
    
    // Aplicar configurações
    applyConfig(config);
    
    // Fechar modal
    const modal = document.getElementById('configModal');
    if (modal) {
        modal.style.display = 'none';
    }
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Configurações salvas com sucesso!');
}

// Função para aplicar configurações
function applyConfig(config) {
    // Aplicar tema
    document.body.className = config.theme;
    
    // Aplicar idioma (exemplo)
    if (config.language !== getCurrentLanguage()) {
        console.log('Mudando idioma para:', config.language);
    }
}

// Função para limpar cache
function clearCache() {
    // Limpar cache do localStorage (exceto dados essenciais)
    const essentialKeys = ['currentUser', 'systemConfig', 'users'];
    Object.keys(localStorage).forEach(key => {
        if (!essentialKeys.includes(key)) {
            localStorage.removeItem(key);
        }
    });
    
    // Atualizar uso de cache
    updateCacheSize();
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Cache limpo com sucesso!');
}

// Função para atualizar tamanho do cache
function updateCacheSize() {
    let total = 0;
    Object.keys(localStorage).forEach(key => {
        total += localStorage[key].length * 2; // 2 bytes por caractere
    });
    
    const usage = (total / 1024 / 1024).toFixed(2); // Converter para MB
    const cacheSizeElement = document.getElementById('cacheSize');
    if (cacheSizeElement) {
        cacheSizeElement.textContent = `${usage} MB`;
    }
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Função auxiliar para obter o idioma atual
function getCurrentLanguage() {
    return document.documentElement.lang || 'pt-BR';
}
