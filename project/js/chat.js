// Gerenciamento do Chat
class ChatManager {
    constructor() {
        this.chatBtn = document.getElementById('chatBtn');
        this.chatPanel = document.getElementById('chatPanel');
        this.closeChat = document.querySelector('.close-chat');
        this.messageInput = document.getElementById('messageInput');
        this.sendMessage = document.getElementById('sendMessage');
        this.chatMessages = document.getElementById('chatMessages');
        
        this.setupEventListeners();
        this.loadUserInfo();
        this.sendWelcomeMessage();
    }

    loadUserInfo() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        this.userInfo = {
            isAdmin: userInfo.isAdmin || false,
            username: userInfo.username || 'Usuário',
            avatarUrl: userInfo.avatarUrl || 'https://source.unsplash.com/random/150x150'
        };
    }

    setupEventListeners() {
        this.chatBtn.addEventListener('click', () => this.openChat());
        this.closeChat.addEventListener('click', () => this.closeChat());
        this.sendMessage.addEventListener('click', () => this.handleSendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });
    }

    openChat() {
        this.chatPanel.classList.add('open');
        this.chatBtn.style.display = 'none';
        this.messageInput.focus();
    }

    closeChat() {
        this.chatPanel.classList.remove('open');
        this.chatBtn.style.display = 'flex';
    }

    handleSendMessage() {
        const message = this.messageInput.value.trim();
        if (message) {
            this.addMessage(message, true);
            this.messageInput.value = '';
            this.messageInput.focus();
        }
    }

    addMessage(message, isUser = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-container ${isUser ? 'user' : ''}`;
        
        if (isUser) {
            messageDiv.innerHTML = `
                <div class="message-header">
                    <img src="${this.userInfo.avatarUrl}" alt="Avatar" class="user-avatar">
                    <div class="user-info">
                        <span class="username">${this.userInfo.username}</span>
                        ${this.userInfo.isAdmin ? '<span class="admin-badge">Admin</span>' : ''}
                    </div>
                </div>
                <div class="message-content user-message">
                    ${message}
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-header">
                    <img src="imagem/logo_size.webp" alt="Sistema" class="user-avatar">
                    <div class="user-info">
                        <span class="username">Sistema</span>
                    </div>
                </div>
                <div class="message-content system-message">
                    ${message}
                </div>
            `;
        }

        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    sendWelcomeMessage() {
        setTimeout(() => {
            this.addMessage('Olá! Bem-vindo ao chat!', false);
            this.addMessage(`${this.userInfo.isAdmin ? 'Administrador' : 'Usuário'} ${this.userInfo.username}, como está gostando da obra?`, false);
        }, 1000);
    }
}

// Inicializar o chat quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});
