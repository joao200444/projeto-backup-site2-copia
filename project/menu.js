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
            return null;
        }
        
        return userData;
    } catch (error) {
        console.error('Erro ao descriptografar dados do usuário');
        return null;
    }
}

// Atualizar links do menu baseado no status de login
function updateMenuLinks() {
    const currentUser = getSecureCurrentUser();
    const accountLink = document.querySelector('[data-section="account"]');
    const profileLink = document.querySelector('[data-section="profile"]');
    const usersLink = document.querySelector('[data-section="users"]');
    
    if (currentUser) {
        // Usuário está logado
        accountLink.style.display = 'none'; // Esconde o link de login
        profileLink.style.display = 'flex'; // Mostra o link de perfil
        
        if (currentUser.isAdmin && usersLink) {
            usersLink.style.display = 'flex'; // Mostra controle de usuários para admin
        } else if (usersLink) {
            usersLink.style.display = 'none';
        }
    } else {
        // Usuário não está logado
        accountLink.style.display = 'flex'; // Mostra o link de login
        accountLink.href = 'login.html';
        profileLink.style.display = 'none'; // Esconde o link de perfil
        
        if (usersLink) {
            usersLink.style.display = 'none';
        }
    }
}

// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');
const sidebarItems = document.querySelectorAll('.sidebar-item');

menuBtn?.addEventListener('click', () => {
    sidebar.classList.add('open');
    menuBtn.style.display = 'none';
});

closeBtn?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuBtn.style.display = 'block';
});

sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebar.classList.remove('open');
        menuBtn.style.display = 'block';
    });
});

// Atualizar menu quando a página carregar
document.addEventListener('DOMContentLoaded', updateMenuLinks);
