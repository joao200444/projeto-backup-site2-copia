// Desabilitar tecla F12
document.onkeypress = function (event) {
    if (event.keyCode == 123) {
        return false;
    }
};

// Desabilitar botão direito do mouse
document.onmousedown = function (event) {
    if (event.button == 2) {
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
        return false;
    }
};

// Desabilitar DevTools
window.addEventListener('devtoolschange', function (e) {
    if (e.detail.open) {
        window.location.reload();
    }
});

// Mensagem de aviso
console.log('%cAtenção!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEsta é uma área restrita. O uso de ferramentas de desenvolvedor não é permitido.', 'font-size: 16px;');

// Detectar e prevenir visualização do código fonte
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Desabilitar seleção de texto
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Detectar DevTools via console.log
setInterval(function() {
    const dateStart = new Date();
    debugger;
    const dateEnd = new Date();
    if (dateEnd - dateStart > 100) {
        window.location.reload();
    }
}, 1000);

// Detectar DevTools via dimensões da janela
window.addEventListener('resize', function() {
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        window.location.reload();
    }
});
