class BibliotecaLogger {
    constructor() {
        this.storageKey = 'biblioteca_cards';
        this.obrasKey = 'obras_backup';
        this.cards = [];
        this.obras = [];
        this.loadLogs();
        this.createActionMenu();
        this.setupAdminUI();
        this.loadObrasFromStorage();
    }

    loadLogs() {
        try {
            const savedCards = localStorage.getItem(this.storageKey);
            this.cards = savedCards ? JSON.parse(savedCards) : [];
            this.renderCards();
            console.log('Logs carregados:', this.cards);
        } catch (error) {
            console.error('Erro ao carregar logs:', error);
            this.cards = [];
        }
    }

    loadObrasFromStorage() {
        try {
            const savedObras = localStorage.getItem(this.obrasKey);
            this.obras = savedObras ? JSON.parse(savedObras) : [];
        } catch (error) {
            console.error('Erro ao carregar obras:', error);
            this.obras = [];
        }
    }

    saveObrasToStorage() {
        try {
            localStorage.setItem(this.obrasKey, JSON.stringify(this.obras));
            return true;
        } catch (error) {
            console.error('Erro ao salvar obras:', error);
            return false;
        }
    }

    isObraDuplicada(title) {
        // Verificar no localStorage
        const isDuplicadaLocal = this.cards.some(card => 
            card.title.toLowerCase() === title.toLowerCase()
        );
        
        // Verificar no backup de obras
        const isDuplicadaBackup = this.obras.some(obra => 
            obra.title.toLowerCase() === title.toLowerCase()
        );

        return isDuplicadaLocal || isDuplicadaBackup;
    }

    async addCard(cardData) {
        // Verificar se a obra já existe
        if (this.isObraDuplicada(cardData.title)) {
            throw new Error('Esta obra já existe na biblioteca!');
        }

        const newCard = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            ...cardData
        };
        
        // Adicionar ao localStorage principal
        this.cards.push(newCard);
        
        // Adicionar ao backup de obras
        this.obras.push(newCard);
        
        // Salvar em ambos os storages
        if (this.saveLogs() && this.saveObrasToStorage()) {
            this.renderCards();
            console.log('Novo card adicionado:', newCard);
            return newCard;
        } else {
            // Se falhar, remover o card dos arrays
            this.cards.pop();
            this.obras.pop();
            throw new Error('Falha ao salvar o card');
        }
    }

    async deleteCard(cardId) {
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (cardIndex === -1) {
            throw new Error('Card não encontrado');
        }

        // Remover do localStorage principal
        this.cards.splice(cardIndex, 1);

        // Remover do backup de obras
        const obraIndex = this.obras.findIndex(obra => obra.id === cardId);
        if (obraIndex !== -1) {
            this.obras.splice(obraIndex, 1);
        }

        // Salvar em ambos os storages
        if (this.saveLogs() && this.saveObrasToStorage()) {
            this.renderCards();
            return true;
        } else {
            throw new Error('Falha ao deletar o card');
        }
    }

    updateCard(cardId, updatedData) {
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (cardIndex === -1) {
            throw new Error('Card não encontrado');
        }

        // Atualizar no localStorage principal
        this.cards[cardIndex] = {
            ...this.cards[cardIndex],
            ...updatedData
        };

        // Atualizar no backup de obras
        const obraIndex = this.obras.findIndex(obra => obra.id === cardId);
        if (obraIndex !== -1) {
            this.obras[obraIndex] = {
                ...this.obras[obraIndex],
                ...updatedData
            };
        }

        // Salvar em ambos os storages
        if (this.saveLogs() && this.saveObrasToStorage()) {
            this.renderCards();
            return this.cards[cardIndex];
        } else {
            throw new Error('Falha ao atualizar o card');
        }
    }

    saveLogs() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.cards));
            console.log('Logs salvos com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao salvar logs:', error);
            return false;
        }
    }

    createActionMenu() {
        // Criar o menu de ações se ainda não existir
        if (!document.querySelector('.action-menu')) {
            const actionMenu = document.createElement('div');
            actionMenu.className = 'action-menu';
            actionMenu.innerHTML = `
                <div class="action-menu-content">
                    <h3>O que você deseja fazer?</h3>
                    <div class="action-buttons">
                        <button class="action-button view-button">
                            <i class="fas fa-eye"></i>
                            Ver detalhes
                        </button>
                        <button class="action-button edit-button-menu">
                            <i class="fas fa-pen"></i>
                            Editar informações
                        </button>
                        <button class="action-button delete-button">
                            <i class="fas fa-trash"></i>
                            Deletar obra
                        </button>
                        <button class="action-button cancel-button">
                            <i class="fas fa-times"></i>
                            Cancelar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(actionMenu);

            // Fechar menu ao clicar fora
            actionMenu.addEventListener('click', (e) => {
                if (e.target === actionMenu) {
                    this.hideActionMenu();
                }
            });
        }
    }

    checkAdminStatus() {
        const currentUser = this.getSecureCurrentUser();
        return currentUser && currentUser.isAdmin === true;
    }

    getSecureCurrentUser() {
        const SECRET_KEY = 'SomDong_2025_SecretKey';
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

    setupAdminUI() {
        // Configurar botão de adicionar obra
        const addButton = document.querySelector('.add-button');
        if (addButton) {
            addButton.style.display = this.checkAdminStatus() ? 'flex' : 'none';
        }

        // Atualizar os cards para mostrar/esconder opções de admin
        this.renderCards();
    }

    showActionMenu(card) {
        // Se não for admin, ir direto para o menu da obra
        if (!this.checkAdminStatus()) {
            const menuFormatCard = this.convertToMenuFormat(card);
            localStorage.setItem('selectedDonghua', JSON.stringify(menuFormatCard));
            window.location.href = 'menu-da-obra.html';
            return;
        }

        const actionMenu = document.querySelector('.action-menu');
        const viewButton = actionMenu.querySelector('.view-button');
        const editButton = actionMenu.querySelector('.edit-button-menu');
        const deleteButton = actionMenu.querySelector('.delete-button');
        const cancelButton = actionMenu.querySelector('.cancel-button');

        // Configurar eventos dos botões
        viewButton.onclick = () => {
            const menuFormatCard = this.convertToMenuFormat(card);
            localStorage.setItem('selectedDonghua', JSON.stringify(menuFormatCard));
            window.location.href = 'menu-da-obra.html';
        };

        editButton.onclick = () => {
            this.hideActionMenu();
            this.showEditModal(card);
        };

        deleteButton.onclick = () => {
            if (confirm('Tem certeza que deseja deletar esta obra?')) {
                this.deleteCard(card.id)
                    .then(() => {
                        this.hideActionMenu();
                        alert('Obra deletada com sucesso!');
                    })
                    .catch(error => {
                        alert('Erro ao deletar obra: ' + error.message);
                    });
            }
        };

        cancelButton.onclick = () => {
            this.hideActionMenu();
        };

        actionMenu.classList.add('show');
    }

    hideActionMenu() {
        const actionMenu = document.querySelector('.action-menu');
        actionMenu.classList.remove('show');
    }

    renderCards() {
        const container = document.getElementById('donghuasContainer');
        if (!container) return;

        container.innerHTML = '';

        this.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            container.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'obra-card';
        cardDiv.style.cursor = 'pointer';
        cardDiv.innerHTML = `
            <div class="obra-image">
                <img src="${card.coverUrl || 'https://i.pinimg.com/originals/75/90/99/7590994f96261ea1be22eb2c77effd32.jpg'}" 
                     alt="${card.title}" onerror="this.src='https://i.pinimg.com/originals/75/90/99/7590994f96261ea1be22eb2c77effd32.jpg'">
            </div>
            <div class="obra-info">
                <h3 class="obra-title">${card.title}</h3>
                <p class="obra-description">${card.description}</p>
                <div class="obra-metadata">
                    <span class="obra-genre">${card.genre}</span>
                    <span class="obra-status status-${card.status.toLowerCase().replace(' ', '-')}">${card.status}</span>
                    <span class="obra-episodes">${card.episodes} episódios</span>
                </div>
            </div>
        `;

        // Adicionar evento de clique no card
        cardDiv.addEventListener('click', () => {
            this.showActionMenu(card);
        });

        return cardDiv;
    }

    showEditModal(card) {
        // Criar o modal
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Editar Donghua</h2>
                <form id="editForm">
                    <div class="form-group">
                        <label>Gêneros</label>
                        <div class="generos-grid">
                            ${this.createGenreCheckboxes(card.genre)}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <div class="status-grid">
                            ${this.createStatusRadios(card.status)}
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editEpisodes">Episódios</label>
                        <input type="number" id="editEpisodes" class="form-control" value="${card.episodes}" required min="0">
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" class="btn-save">Salvar</button>
                        <button type="button" class="btn-cancel">Cancelar</button>
                    </div>
                </form>
            </div>
        `;

        // Adicionar o modal ao corpo do documento
        document.body.appendChild(modal);

        // Configurar eventos
        const form = modal.querySelector('#editForm');
        const cancelButton = modal.querySelector('.btn-cancel');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedGenres = Array.from(modal.querySelectorAll('input[name="genero"]:checked'))
                .map(cb => cb.value)
                .join(', ');
            const selectedStatus = modal.querySelector('input[name="status"]:checked').value;
            const episodes = modal.querySelector('#editEpisodes').value;

            try {
                this.updateCard(card.id, {
                    genre: selectedGenres,
                    status: selectedStatus,
                    episodes: episodes
                });
                document.body.removeChild(modal);
            } catch (error) {
                console.error('Erro ao atualizar:', error);
                alert('Erro ao atualizar o donghua. Tente novamente.');
            }
        });

        cancelButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        // Fechar modal ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    createGenreCheckboxes(selectedGenres) {
        const genres = [
            'Ação', 'Aventura', 'Cultivo', 'Fantasia', 'Artes Marciais',
            'Romance', 'Sci-Fi', 'Comédia', 'Drama', 'Mistério',
            'Horror', 'Sobrenatural', 'Histórico', 'Wuxia', 'Xianxia',
            'Xuanhuan', 'Esporte', 'Slice of Life'
        ];
        const selectedGenresList = selectedGenres.split(', ');

        return genres.map(genre => `
            <label class="checkbox-container">
                <input type="checkbox" name="genero" value="${genre}" ${selectedGenresList.includes(genre) ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span class="label-text">${genre}</span>
            </label>
        `).join('');
    }

    createStatusRadios(selectedStatus) {
        const statuses = [
            { value: 'Novo', class: 'status-novo' },
            { value: 'Em Andamento', class: 'status-andamento' },
            { value: 'Completo', class: 'status-completo' },
            { value: 'Em Hiato', class: 'status-hiato' }
        ];

        return statuses.map(status => `
            <label class="checkbox-container ${status.class}">
                <input type="radio" name="status" value="${status.value}" ${selectedStatus === status.value ? 'checked' : ''} required>
                <span class="checkmark"></span>
                <span class="label-text">${status.value}</span>
            </label>
        `).join('');
    }

    convertToMenuFormat(card) {
        return {
            id: card.id,
            titulo: card.title,
            sinopse: card.description,
            genero: card.genre,
            status: card.status,
            episodios: card.episodes,
            imagem: card.coverUrl,
            dataCriacao: card.timestamp
        };
    }

    getCards() {
        return this.cards;
    }

    clearLogs() {
        this.cards = [];
        this.saveLogs();
        this.renderCards();
    }
}

// Criar instância global
window.bibliotecaLogger = new BibliotecaLogger();
