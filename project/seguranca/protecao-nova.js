// Criar o elemento de aviso
const avisoInspecionar = document.createElement('div');
avisoInspecionar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 999999;
    font-family: Arial, sans-serif;
    text-align: center;
    padding: 20px;
`;

const avisoConteudo = document.createElement('div');
avisoConteudo.innerHTML = `
    <h2 style="font-size: 24px; margin-bottom: 20px;">⚠️ Atenção!</h2>
    <p style="font-size: 18px; margin-bottom: 15px;">Você abriu o inspetor de elementos.</p>
    <p style="font-size: 16px;">Por favor, feche o inspetor para continuar navegando.</p>
`;

avisoInspecionar.appendChild(avisoConteudo);
document.body.appendChild(avisoInspecionar);

// Função para mostrar o aviso
function mostrarAviso() {
    avisoInspecionar.style.display = 'flex';
}

// Função para esconder o aviso
function esconderAviso() {
    avisoInspecionar.style.display = 'none';
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

// Desabilitar seleção de texto
document.addEventListener('selectstart', function(e) {
    if (devToolsAberto) {
        e.preventDefault();
    }
});

// Mensagem no console
console.log('%cAtenção!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEsta é uma área restrita. O uso de ferramentas de desenvolvedor não é permitido.', 'font-size: 16px;');
