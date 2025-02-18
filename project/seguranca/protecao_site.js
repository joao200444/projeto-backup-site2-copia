// Criar o elemento de aviso
const avisoInspecionar = document.createElement('div');
avisoInspecionar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.95);
    color: white;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
    backdrop-filter: blur(10px);
    animation: fadeIn 0.3s ease;
`;

const avisoConteudo = document.createElement('div');
avisoConteudo.style.cssText = `
    background: rgba(255, 255, 255, 0.1);
    padding: 30px;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
    border: 1px solid rgba(255,255,255,0.1);
    animation: slideIn 0.3s ease;
`;

avisoConteudo.innerHTML = `
    <div style="font-size: 50px; margin-bottom: 20px;">⚠️</div>
    <h2 style="font-size: 28px; margin-bottom: 20px; color: #ff3e3e;">Atenção!</h2>
    <p style="font-size: 18px; margin-bottom: 15px; line-height: 1.5;">
        Você abriu o inspetor de elementos.<br>
        Esta é uma área restrita.
    </p>
    <p style="font-size: 16px; color: #ccc; line-height: 1.4;">
        Por favor, feche o inspetor para continuar navegando.
    </p>
`;

// Adicionar estilos de animação
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes slideIn {
        from { transform: translateY(-20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
`;
document.head.appendChild(styleSheet);

avisoInspecionar.appendChild(avisoConteudo);
document.body.appendChild(avisoInspecionar);

// Função para mostrar o aviso
function mostrarAviso() {
    avisoInspecionar.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Previne rolagem
}

// Função para esconder o aviso
function esconderAviso() {
    avisoInspecionar.style.display = 'none';
    document.body.style.overflow = ''; // Restaura rolagem
}

// Desabilitar tecla F12
document.onkeypress = function (event) {
    if (event.keyCode == 123) {
        mostrarAviso();
        return false;
    }
};

// Desabilitar botão direito do mouse
document.onmousedown = function (event) {
    if (event.button == 2) {
        mostrarAviso();
        return false;
    }
};

// Desabilitar CTRL+SHIFT+I, CTRL+SHIFT+J, CTRL+SHIFT+C, CTRL+U, CTRL+S
document.onkeydown = function (event) {
    if (
        // CTRL+SHIFT+I ou F12
        (event.ctrlKey && event.shiftKey && event.keyCode == 73) || event.keyCode == 123 ||
        // CTRL+SHIFT+J
        (event.ctrlKey && event.shiftKey && event.keyCode == 74) ||
        // CTRL+SHIFT+C
        (event.ctrlKey && event.shiftKey && event.keyCode == 67) ||
        // CTRL+U
        (event.ctrlKey && event.keyCode == 85) ||
        // CTRL+S
        (event.ctrlKey && event.keyCode == 83)
    ) {
        mostrarAviso();
        return false;
    }
};

// Detectar DevTools
let devToolsAberto = false;

// Detectar via console.log
setInterval(function() {
    const dateStart = new Date();
    debugger;
    const dateEnd = new Date();
    if (dateEnd - dateStart > 100) {
        devToolsAberto = true;
        mostrarAviso();
    }
}, 1000);

// Detectar via dimensões da janela
window.addEventListener('resize', function() {
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        devToolsAberto = true;
        mostrarAviso();
    }
});

// Verificar periodicamente se o DevTools foi fechado
setInterval(function() {
    if (devToolsAberto) {
        if (window.outerWidth - window.innerWidth <= 160 && window.outerHeight - window.innerHeight <= 160) {
            devToolsAberto = false;
            esconderAviso();
        }
    }
}, 1000);

// Desabilitar seleção de texto quando DevTools estiver aberto
document.addEventListener('selectstart', function(e) {
    if (devToolsAberto) {
        e.preventDefault();
    }
});

// Mensagem no console
console.log('%cAtenção!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEsta é uma área restrita. O uso de ferramentas de desenvolvedor não é permitido.', 'font-size: 16px;');
