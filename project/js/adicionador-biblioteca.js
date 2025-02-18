document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o logger se ainda não existir
    if (!window.bibliotecaLogger) {
        window.bibliotecaLogger = new BibliotecaLogger();
    }

    const form = document.getElementById('adicionadorForm');
    const coverInput = document.getElementById('donghuaCover');
    const coverPreview = document.getElementById('coverPreview');
    const successMessage = document.getElementById('successMessage');
    const checkboxes = document.querySelectorAll('input[name="genero"]');
    const generosGrid = document.querySelector('.generos-grid');

    // Verificar se o usuário é admin
    function checkAdminStatus() {
        const SECRET_KEY = 'SomDong_2025_SecretKey';
        const encryptedUser = localStorage.getItem('currentUser');
        if (!encryptedUser) return false;

        try {
            const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
            const user = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            return user && user.isAdmin === true;
        } catch (error) {
            console.error('Erro ao verificar status de admin:', error);
            return false;
        }
    }

    // Redirecionar se não for admin
    if (!checkAdminStatus()) {
        window.location.href = 'biblioteca.html';
        return;
    }

    // Adicionar classe selected ao container quando checkbox é marcado
    checkboxes.forEach(checkbox => {
        const container = checkbox.closest('.checkbox-container');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                container.classList.add('selected');
            } else {
                container.classList.remove('selected');
            }
            
            // Remover classe de erro se algum gênero for selecionado
            if (getSelectedGenres().length > 0) {
                generosGrid.classList.remove('error');
                const errorMsg = generosGrid.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    });

    // Função para obter gêneros selecionados
    function getSelectedGenres() {
        const selectedGenres = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedGenres.push(checkbox.value);
            }
        });
        return selectedGenres;
    }

    // Preview da imagem quando o link é inserido
    coverInput.addEventListener('input', function() {
        const imageUrl = this.value;
        if (imageUrl) {
            // Testar se a imagem carrega corretamente
            const img = new Image();
            img.onload = function() {
                coverPreview.innerHTML = `<img src="${imageUrl}" alt="Pré-visualização da capa">`;
                coverPreview.classList.remove('empty');
            };
            img.onerror = function() {
                coverPreview.innerHTML = `<div class="error-message">Não foi possível carregar a imagem. Verifique o link.</div>`;
                coverPreview.classList.add('empty');
            };
            img.src = imageUrl;
        } else {
            coverPreview.innerHTML = '';
            coverPreview.classList.add('empty');
        }
    });

    // Submissão do formulário
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Verificar se pelo menos um gênero foi selecionado
        const selectedGenres = getSelectedGenres();
        if (selectedGenres.length === 0) {
            generosGrid.classList.add('error');
            if (!generosGrid.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Selecione pelo menos um gênero';
                generosGrid.parentNode.insertBefore(errorMsg, generosGrid.nextSibling);
            }
            return;
        }

        // Verificar se um status foi selecionado
        const selectedStatus = document.querySelector('input[name="status"]:checked');
        if (!selectedStatus) {
            const statusGrid = document.querySelector('.status-grid');
            statusGrid.classList.add('error');
            if (!statusGrid.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'Selecione um status';
                statusGrid.parentNode.insertBefore(errorMsg, statusGrid.nextSibling);
            }
            return;
        }

        // Coletar dados do formulário
        const dadosDonghua = {
            title: document.getElementById('donghuaTitle').value,
            description: document.getElementById('donghuaDescription').value,
            genre: selectedGenres.join(', '),
            status: selectedStatus.value,
            episodes: document.getElementById('donghuaEpisodes').value,
            coverUrl: document.getElementById('donghuaCover').value
        };

        try {
            // Adicionar o donghua
            await window.bibliotecaLogger.addCard(dadosDonghua);
            
            // Mostrar mensagem de sucesso
            successMessage.style.display = 'block';
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
                window.location.href = 'biblioteca.html';
            }, 2000);
        } catch (error) {
            alert('Erro ao adicionar donghua. Por favor, tente novamente.');
            console.error('Erro:', error);
        }
    });
});
