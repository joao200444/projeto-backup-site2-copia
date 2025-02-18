// Chave secreta para criptografia (deve ser a mesma do login.js)
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Função para verificar sessão de forma segura
function getSecureCurrentUser() {
    const encryptedUser = localStorage.getItem('currentUser');
    if (!encryptedUser) return null;

    try {
        const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
        const userData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        
        // Verificar se o token de sessão é válido
        const storedToken = localStorage.getItem(`session_${userData.username}`);
        if (storedToken !== userData.sessionToken) {
            // Token inválido, fazer logout
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
            return null;
        }
        
        return userData;
    } catch (error) {
        console.error('Erro ao descriptografar dados do usuário');
        window.location.href = 'login.html';
        return null;
    }
}

// Verificar se é admin
function checkAdmin() {
    const currentUser = getSecureCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
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

// Função para salvar dados do perfil de forma segura
function securelyStoreProfile(username, profileData) {
    const encryptedProfile = CryptoJS.AES.encrypt(
        JSON.stringify(profileData),
        SECRET_KEY
    ).toString();
    
    localStorage.setItem(`profile_${username}`, encryptedProfile);
}

// Usuários predefinidos para teste
const testUsers = [
    {
        username: 'Usuario1',
        avatarUrl: 'https://source.unsplash.com/random/150x150?portrait,1',
        online: true
    },
    {
        username: 'Usuario2',
        avatarUrl: 'https://source.unsplash.com/random/150x150?portrait,2',
        online: false
    },
    {
        username: 'Usuario3',
        avatarUrl: 'https://source.unsplash.com/random/150x150?portrait,3',
        online: true
    }
];

// Criar perfis para usuários de teste se não existirem
testUsers.forEach(user => {
    if (!securelyGetProfile(user.username)) {
        const profileData = {
            bio: `Biografia do ${user.username}`,
            joinDate: new Date().toISOString(),
            avatarUrl: user.avatarUrl,
            coverUrl: '',
            stats: {
                watched: Math.floor(Math.random() * 100),
                episodes: Math.floor(Math.random() * 500),
                comments: Math.floor(Math.random() * 50)
            },
            settings: {
                emailNotifications: false,
                privateProfile: false
            },
            online: user.online,
            lastSeen: new Date().toISOString()
        };
        securelyStoreProfile(user.username, profileData);
    }
});

// Criar card de usuário
function createUserCard(username, profile) {
    const card = document.createElement('div');
    card.className = 'user-card';
    
    const banStatus = localStorage.getItem(`ban_${username}`);
    const isBanned = banStatus ? JSON.parse(banStatus) : null;
    
    card.innerHTML = `
        <div class="user-avatar">
            <img src="${profile.avatarUrl}" alt="${username}">
            ${profile.online ? '<span class="online-badge"></span>' : ''}
            ${isBanned ? '<span class="banned-badge">Banido</span>' : ''}
        </div>
        <div class="user-info">
            <h3>${username}</h3>
            <p>Membro desde: ${new Date(profile.joinDate).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="user-actions">
            <button class="action-btn view-btn" data-username="${username}">Ver Perfil</button>
            <button class="action-btn suspend-btn" data-username="${username}">Suspender</button>
            <button class="action-btn ban-btn" data-username="${username}">Banir</button>
        </div>
    `;
    
    return card;
}

// Atualizar lista de usuários
function updateUsersList() {
    const onlineUsers = document.getElementById('onlineUsers');
    const offlineUsers = document.getElementById('offlineUsers');
    let onlineCount = 0;
    let totalCount = 0;
    
    onlineUsers.innerHTML = '';
    offlineUsers.innerHTML = '';
    
    // Listar usuários predefinidos
    testUsers.forEach(user => {
        const profile = securelyGetProfile(user.username);
        if (profile) {
            totalCount++;
            if (profile.online) onlineCount++;
            const card = createUserCard(user.username, profile);
            if (profile.online) {
                onlineUsers.appendChild(card);
            } else {
                offlineUsers.appendChild(card);
            }
        }
    });
    
    // Atualizar contadores
    document.getElementById('onlineCount').textContent = onlineCount;
    document.getElementById('totalCount').textContent = totalCount;
}

// Manipular banimento
function handleBan(username) {
    const modal = document.getElementById('banModal');
    const banUsername = document.getElementById('banUsername');
    const banDays = document.getElementById('banDays');
    const banReason = document.getElementById('banReason');
    
    banUsername.textContent = username;
    modal.style.display = 'flex';
    
    document.getElementById('confirmBanBtn').onclick = () => {
        const banData = {
            username: username,
            reason: banReason.value,
            days: parseInt(banDays.value),
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + (parseInt(banDays.value) * 24 * 60 * 60 * 1000)).toISOString()
        };
        
        localStorage.setItem(`ban_${username}`, JSON.stringify(banData));
        modal.style.display = 'none';
        updateUsersList();
    };
    
    document.getElementById('cancelBanBtn').onclick = () => {
        modal.style.display = 'none';
    };
}

// Manipular suspensão
function handleSuspend(username) {
    const modal = document.getElementById('suspendModal');
    const suspendUsername = document.getElementById('suspendUsername');
    const suspendDays = document.getElementById('suspendDays');
    const suspendReason = document.getElementById('suspendReason');
    
    suspendUsername.textContent = username;
    modal.style.display = 'flex';
    
    document.getElementById('confirmSuspendBtn').onclick = () => {
        const suspendData = {
            username: username,
            reason: suspendReason.value,
            days: parseInt(suspendDays.value),
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + (parseInt(suspendDays.value) * 24 * 60 * 60 * 1000)).toISOString()
        };
        
        localStorage.setItem(`suspend_${username}`, JSON.stringify(suspendData));
        modal.style.display = 'none';
        updateUsersList();
    };
    
    document.getElementById('cancelSuspendBtn').onclick = () => {
        modal.style.display = 'none';
    };
}

// Event listeners
document.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('ban-btn')) {
        handleBan(target.dataset.username);
    } else if (target.classList.contains('suspend-btn')) {
        handleSuspend(target.dataset.username);
    } else if (target.classList.contains('view-btn')) {
        window.location.href = `perfil.html?user=${target.dataset.username}`;
    }
});

// Fechar modais quando clicar fora
window.onclick = (e) => {
    const banModal = document.getElementById('banModal');
    const suspendModal = document.getElementById('suspendModal');
    
    if (e.target === banModal) {
        banModal.style.display = 'none';
    }
    if (e.target === suspendModal) {
        suspendModal.style.display = 'none';
    }
};

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

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAdmin()) return;
    updateUsersList();
    checkAndShowAdminBadge();
});
