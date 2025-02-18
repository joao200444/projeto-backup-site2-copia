// Verificar se o usuário está logado e é admin
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'login.html';
        return;
    }

    // Carregar configurações atuais
    loadCurrentConfig();

    // Atualizar uso de armazenamento
    updateStorageUsage();

    // Adicionar evento ao botão de limpar cache
    document.getElementById('clearCacheBtn').onclick = clearCache;
});

// Função para carregar configurações atuais
function loadCurrentConfig() {
    const config = JSON.parse(localStorage.getItem('systemConfig') || '{}');
    
    // Carregar valores nos campos
    document.getElementById('themeSelect').value = config.theme || 'light';
    document.getElementById('animationsToggle').checked = config.animations !== false;
    document.getElementById('languageSelect').value = config.language || 'pt-BR';
    document.getElementById('dateFormatSelect').value = config.dateFormat || 'dd/mm/yyyy';
    document.getElementById('emailNotifToggle').checked = config.emailNotifications !== false;
    document.getElementById('pushNotifToggle').checked = config.pushNotifications !== false;
    document.getElementById('updateNotifToggle').checked = config.updateNotifications !== false;
    document.getElementById('twoFactorToggle').checked = config.twoFactorAuth || false;
    document.getElementById('activityLogToggle').checked = config.activityLog !== false;
    document.getElementById('sessionTimeSelect').value = config.sessionTime || '60';
    document.getElementById('autoCleanCache').checked = config.autoCleanCache || false;
}

// Função para salvar configurações
function saveConfig() {
    const config = {
        theme: document.getElementById('themeSelect').value,
        animations: document.getElementById('animationsToggle').checked,
        language: document.getElementById('languageSelect').value,
        dateFormat: document.getElementById('dateFormatSelect').value,
        emailNotifications: document.getElementById('emailNotifToggle').checked,
        pushNotifications: document.getElementById('pushNotifToggle').checked,
        updateNotifications: document.getElementById('updateNotifToggle').checked,
        twoFactorAuth: document.getElementById('twoFactorToggle').checked,
        activityLog: document.getElementById('activityLogToggle').checked,
        sessionTime: document.getElementById('sessionTimeSelect').value,
        autoCleanCache: document.getElementById('autoCleanCache').checked
    };

    localStorage.setItem('systemConfig', JSON.stringify(config));
    
    // Aplicar configurações
    applyConfig(config);
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Configurações salvas com sucesso!');
}

// Função para aplicar configurações
function applyConfig(config) {
    // Aplicar tema
    document.body.className = config.theme;
    
    // Aplicar animações
    document.body.style.setProperty('--enable-animations', config.animations ? '1' : '0');
    
    // Aplicar idioma (exemplo)
    if (config.language !== getCurrentLanguage()) {
        // Aqui você implementaria a mudança de idioma
        console.log('Mudando idioma para:', config.language);
    }
    
    // Aplicar formato de data
    localStorage.setItem('dateFormat', config.dateFormat);
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
    
    // Atualizar uso de armazenamento
    updateStorageUsage();
    
    // Mostrar mensagem de sucesso
    showSuccessMessage('Cache limpo com sucesso!');
}

// Função para atualizar uso de armazenamento
function updateStorageUsage() {
    let total = 0;
    Object.keys(localStorage).forEach(key => {
        total += localStorage[key].length * 2; // 2 bytes por caractere
    });
    
    const usage = (total / 1024 / 1024).toFixed(2); // Converter para MB
    document.getElementById('storageUsage').textContent = `${usage} MB`;
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

// Função de logout
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
