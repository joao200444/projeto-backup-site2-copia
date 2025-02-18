document.addEventListener('DOMContentLoaded', () => {
    const configMenuItem = document.querySelector('.sidebar-item[data-section="config"]');
    const personalizationModal = document.getElementById('personalization-modal');
    const closeModalBtn = document.getElementById('close-personalization');
    const applyBtn = document.getElementById('apply-personalization');
    const colorOptions = document.querySelectorAll('.color-option');
    const backgroundOptions = document.querySelectorAll('.background-option');
    const snowToggle = document.getElementById('snow-animation-toggle');

    console.log('Personalization script loaded'); 
    console.log('Config menu item:', configMenuItem);
    console.log('Personalization modal:', personalizationModal);

    // Verificar se os elementos existem
    if (!configMenuItem) {
        console.error('Elemento de configuração não encontrado');
        return;
    }

    if (!personalizationModal) {
        console.error('Modal de personalização não encontrada');
        return;
    }

    let selectedColor = null;
    let selectedBackground = null;
    let snowEnabled = false;

    // Abrir modal
    configMenuItem.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Config menu item clicked'); 
        console.log('Modal display antes:', personalizationModal.style.display);
        personalizationModal.style.display = 'flex'; 
        personalizationModal.classList.add('show');
        console.log('Modal display depois:', personalizationModal.style.display);
    });

    // Fechar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            personalizationModal.style.display = 'none'; 
            personalizationModal.classList.remove('show');
        });
    } else {
        console.error('Botão de fechar não encontrado');
    }

    // Selecionar cor
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            colorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedColor = option.dataset.color;
        });
    });

    // Selecionar fundo
    backgroundOptions.forEach(option => {
        option.addEventListener('click', () => {
            backgroundOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedBackground = option.dataset.bg;
        });
    });

    // Toggle de neve
    snowToggle.addEventListener('change', () => {
        snowEnabled = snowToggle.checked;
    });

    // Aplicar personalizações
    applyBtn.addEventListener('click', () => {
        // Mudar cor de fundo
        if (selectedColor) {
            document.documentElement.style.setProperty('--primary-color', selectedColor);
            document.documentElement.style.setProperty('--primary-color-dark', selectedColor);
        }

        // Mudar fundo
        if (selectedBackground) {
            switch(selectedBackground) {
                case 'dark':
                    document.body.classList.remove('light-theme', 'gradient-theme', 'blurred-theme');
                    document.body.classList.add('dark-theme');
                    break;
                case 'light':
                    document.body.classList.remove('dark-theme', 'gradient-theme', 'blurred-theme');
                    document.body.classList.add('light-theme');
                    break;
                case 'gradient':
                    document.body.classList.remove('dark-theme', 'light-theme', 'blurred-theme');
                    document.body.classList.add('gradient-theme');
                    break;
                case 'blurred':
                    document.body.classList.remove('dark-theme', 'light-theme', 'gradient-theme');
                    document.body.classList.add('blurred-theme');
                    break;
            }
        }

        // Animação de neve
        if (snowEnabled) {
            startSnowAnimation();
        } else {
            stopSnowAnimation();
        }

        // Fechar modal
        personalizationModal.classList.remove('show');
    });

    // Função para animação de neve
    function startSnowAnimation() {
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container';
        document.body.appendChild(snowContainer);

        function createSnowflake() {
            const snowflake = document.createElement('div');
            snowflake.classList.add('snowflake');
            
            snowflake.style.left = Math.random() * window.innerWidth + 'px';
            snowflake.style.animationDuration = (Math.random() * 3 + 2) + 's';
            snowflake.style.opacity = Math.random();
            snowflake.style.width = (Math.random() * 5 + 2) + 'px';
            
            snowContainer.appendChild(snowflake);
            
            setTimeout(() => {
                snowflake.remove();
            }, 5000);
        }

        const snowInterval = setInterval(createSnowflake, 200);
        snowContainer.dataset.interval = snowInterval;
    }

    // Função para parar animação de neve
    function stopSnowAnimation() {
        const snowContainer = document.getElementById('snow-container');
        if (snowContainer) {
            clearInterval(parseInt(snowContainer.dataset.interval));
            snowContainer.remove();
        }
    }
});
