// Menu functionality
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');

menuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    menuBtn.style.display = 'none';
});

closeBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    menuBtn.style.display = 'block';
});

// Chave secreta para criptografia
const SECRET_KEY = 'SomDong_2025_SecretKey';

// Limpar localStorage para aplicar novas configurações
localStorage.clear();

// Função para fazer hash da senha
function hashPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

// Função para gerar token de sessão
function generateSessionToken(username) {
    return CryptoJS.SHA256(username + Date.now()).toString();
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

// Função para salvar usuário de forma segura
function securelyStoreUser(username, userData) {
    const encryptedUser = CryptoJS.AES.encrypt(
        JSON.stringify(userData),
        SECRET_KEY
    ).toString();
    
    localStorage.setItem(`user_${username}`, encryptedUser);
}

// Função para salvar perfil de forma segura
function securelyStoreProfile(username, profileData) {
    const encryptedProfile = CryptoJS.AES.encrypt(
        JSON.stringify(profileData),
        SECRET_KEY
    ).toString();

    localStorage.setItem(`profile_${username}`, encryptedProfile);
}

// Função para recuperar perfil de forma segura
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

// Função para criar usuário admin padrão se não existir
function createDefaultAdmin() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verifica se já existe um usuário admin
    const adminExists = users.some(user => user.username === 'Smunk');
    
    if (!adminExists) {
        // Cria o usuário admin
        const adminUser = {
            username: 'Smunk',
            password: CryptoJS.SHA256('Konab99').toString(),
            isAdmin: true,
            email: 'admin@donghua.com',
            createdAt: new Date().toISOString(),
            status: 'active'
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuário admin criado com sucesso');
    }
}

// Predefined admin users with hashed passwords
const predefinedUsers = {
    'Smunk': {
        username: 'Smunk',
        password: hashPassword('Konab99'),
        isAdmin: true,
        avatarUrl: 'https://source.unsplash.com/random/150x150?portrait,admin',
        bio: 'Administrador do SomDong'
    }
};

// Create predefined users if they don't exist
Object.values(predefinedUsers).forEach(user => {
    if (!securelyGetUser(user.username)) {
        securelyStoreUser(user.username, user);
        
        // Criar perfil do admin se não existir
        if (!securelyGetProfile(user.username)) {
            const profileData = {
                bio: user.bio,
                joinDate: new Date().toISOString(),
                avatarUrl: user.avatarUrl,
                coverUrl: '',
                stats: {
                    watched: 999,
                    episodes: 5000,
                    comments: 250
                },
                settings: {
                    emailNotifications: false,
                    privateProfile: false
                },
                online: false,
                lastSeen: new Date().toISOString()
            };
            securelyStoreProfile(user.username, profileData);
        }
    }
});

// Tabs functionality
const loginTab = document.querySelector('[data-tab="login"]');
const registerTab = document.querySelector('[data-tab="register"]');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
});

// Handle login form submission
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const hashedPassword = hashPassword(password);
    
    console.log('Tentando login com:', username); // Debug
    
    // Fazer logout da conta atual se houver
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const decryptedBytes = CryptoJS.AES.decrypt(currentUser, SECRET_KEY);
            const userData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            
            // Atualizar status offline no perfil antigo
            const oldProfileData = securelyGetProfile(userData.username);
            if (oldProfileData) {
                oldProfileData.online = false;
                oldProfileData.lastSeen = new Date().toISOString();
                securelyStoreProfile(userData.username, oldProfileData);
            }
            
            // Remover token de sessão antigo
            localStorage.removeItem(`session_${userData.username}`);
        } catch (error) {
            console.error('Erro ao fazer logout da conta atual');
        }
        
        // Limpar dados do usuário atual
        localStorage.removeItem('currentUser');
    }
    
    // Tentar login com o novo usuário
    const user = securelyGetUser(username);
    console.log('Usuário encontrado:', user); // Debug
    
    if (user && user.password === hashedPassword) {
        console.log('Senha correta, verificando banimento...'); // Debug
        
        // Verificar se o usuário está banido
        const banData = localStorage.getItem(`ban_${username}`);
        if (banData) {
            const ban = JSON.parse(banData);
            const now = new Date();
            const endDate = new Date(ban.endDate);
            
            if (now < endDate) {
                // Usuário ainda está banido
                const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                loginError.innerHTML = `
                    <div class="ban-message">
                        <strong>Conta Banida</strong>
                        <div class="ban-reason">${ban.reason}</div>
                        <div class="ban-duration">
                            Banimento expira em: ${remainingDays} dia(s)<br>
                            Data de término: ${endDate.toLocaleDateString('pt-BR')} às ${endDate.toLocaleTimeString('pt-BR')}
                        </div>
                    </div>
                `;
                return;
            } else {
                // Banimento expirou, remover
                localStorage.removeItem(`ban_${username}`);
            }
        }
        
        // Verificar se o usuário está suspenso
        const suspendData = localStorage.getItem(`suspend_${username}`);
        if (suspendData) {
            const suspend = JSON.parse(suspendData);
            const now = new Date();
            const endDate = new Date(suspend.endDate);
            
            if (now < endDate) {
                // Usuário ainda está suspenso
                const remainingDays = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                loginError.innerHTML = `
                    <div class="ban-message" style="background: rgba(255, 152, 0, 0.9);">
                        <strong>Conta Suspensa</strong>
                        <div class="ban-reason">${suspend.reason}</div>
                        <div class="ban-duration">
                            Suspensão expira em: ${remainingDays} dia(s)<br>
                            Data de término: ${endDate.toLocaleDateString('pt-BR')} às ${endDate.toLocaleTimeString('pt-BR')}
                        </div>
                    </div>
                `;
                return;
            } else {
                // Suspensão expirou, remover
                localStorage.removeItem(`suspend_${username}`);
            }
        }

        console.log('Gerando token de sessão...'); // Debug
        
        // Gerar e salvar token de sessão
        const sessionToken = generateSessionToken(username);
        localStorage.setItem(`session_${username}`, sessionToken);
        
        // Salvar dados do usuário atual de forma segura
        const currentUser = {
            username: username,
            isAdmin: user.isAdmin,
            sessionToken: sessionToken
        };
        
        localStorage.setItem('currentUser', CryptoJS.AES.encrypt(
            JSON.stringify(currentUser),
            SECRET_KEY
        ).toString());
        
        // Atualizar status online no perfil
        const profileData = securelyGetProfile(username) || {};
        profileData.online = true;
        profileData.lastSeen = new Date().toISOString();
        securelyStoreProfile(username, profileData);
        
        console.log('Login bem sucedido, redirecionando...'); // Debug
        
        // Redirect to home page
        window.location.href = 'index.html';
    } else {
        loginError.textContent = 'Usuário ou senha incorretos';
    }
});

// Handle register form submission
const registerError = document.getElementById('registerError');

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate username
    if (username.length < 3) {
        registerError.textContent = 'O nome de usuário deve ter pelo menos 3 caracteres';
        return;
    }
    
    // Check if username already exists
    if (securelyGetUser(username)) {
        registerError.textContent = 'Este nome de usuário já está em uso';
        return;
    }
    
    // Validate password
    if (password.length < 6) {
        registerError.textContent = 'A senha deve ter pelo menos 6 caracteres';
        return;
    }
    
    // Check if passwords match
    if (password !== confirmPassword) {
        registerError.textContent = 'As senhas não coincidem';
        return;
    }
    
    // Hash password and store user securely
    const hashedPassword = hashPassword(password);
    securelyStoreUser(username, { username, password: hashedPassword, isAdmin: false });
    
    // Create user profile with encrypted data
    const profileData = {
        bio: '',
        joinDate: new Date().toISOString(),
        avatarUrl: 'https://source.unsplash.com/random/150x150?portrait',
        coverUrl: '',
        stats: {
            watched: 0,
            episodes: 0,
            comments: 0
        },
        settings: {
            emailNotifications: false,
            privateProfile: false
        },
        online: false,
        lastSeen: new Date().toISOString()
    };
    
    securelyStoreProfile(username, profileData);
    
    // Show success message and switch to login
    registerError.style.color = '#4CAF50';
    registerError.textContent = 'Conta criada com sucesso! Você já pode fazer login.';
    
    // Clear form
    registerForm.reset();
    
    // Switch to login tab after 2 seconds
    setTimeout(() => {
        loginTab.click();
    }, 2000);
});

// Inicializar página
document.addEventListener('DOMContentLoaded', () => {
    // Criar usuário admin padrão se não existir
    createDefaultAdmin();
});
