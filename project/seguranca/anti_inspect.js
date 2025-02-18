// Criar e adicionar o aviso ao body assim que o script carregar
const avisoInspecionar = document.createElement('div');
avisoInspecionar.id = 'aviso-inspect';
avisoInspecionar.innerHTML = `
    <div class="aviso-conteudo">
        <div class="aviso-icone">⚠️</div>
        <h2>Atenção!</h2>
        <p>Você abriu o inspetor de elementos.<br>Esta é uma área restrita.</p>
        <p class="aviso-sub">Por favor, feche o inspetor para continuar navegando.</p>
    </div>
`;

// Adicionar estilos
const style = document.createElement('style');
style.textContent = `
    #aviso-inspect {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        font-family: Arial, sans-serif;
        backdrop-filter: blur(10px);
    }

    #aviso-inspect .aviso-conteudo {
        background: rgba(255, 255, 255, 0.1);
        padding: 40px;
        border-radius: 20px;
        text-align: center;
        color: white;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 30px rgba(0,0,0,0.5);
        border: 1px solid rgba(255,255,255,0.1);
        animation: slideDown 0.3s ease;
    }

    #aviso-inspect .aviso-icone {
        font-size: 60px;
        margin-bottom: 20px;
    }

    #aviso-inspect h2 {
        color: #ff3e3e;
        font-size: 32px;
        margin: 0 0 20px 0;
    }

    #aviso-inspect p {
        font-size: 18px;
        line-height: 1.6;
        margin: 0 0 15px 0;
    }

    #aviso-inspect .aviso-sub {
        color: #aaa;
        font-size: 16px;
    }

    @keyframes slideDown {
        from {
            transform: translateY(-30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;

document.head.appendChild(style);
document.body.appendChild(avisoInspecionar);

// Função para mostrar o aviso
function mostrarAviso() {
    avisoInspecionar.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Função para esconder o aviso
function esconderAviso() {
    avisoInspecionar.style.display = 'none';
    document.body.style.overflow = '';
}

// Detectar DevTools via F12 e atalhos
document.addEventListener('keydown', function(e) {
    if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.shiftKey && e.keyCode === 67) || // Ctrl+Shift+C
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.ctrlKey && e.keyCode === 83) // Ctrl+S
    ) {
        mostrarAviso();
        e.preventDefault();
        return false;
    }
});

// Removido o bloqueio do botão direito para permitir seu uso normal

// Detectar DevTools via console
let devToolsAberto = false;
setInterval(function() {
    const dateStart = new Date();
    debugger;
    const dateEnd = new Date();
    if (dateEnd - dateStart > 100) {
        devToolsAberto = true;
        mostrarAviso();
    }
}, 1000);

// Detectar DevTools via dimensões da janela
window.addEventListener('resize', function() {
    if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
        devToolsAberto = true;
        mostrarAviso();
    }
});

// Verificar se DevTools foi fechado
setInterval(function() {
    if (devToolsAberto) {
        if (window.outerWidth - window.innerWidth <= 160 && window.outerHeight - window.innerHeight <= 160) {
            devToolsAberto = false;
            esconderAviso();
        }
    }
}, 1000);

// Mensagem no console
console.log('%cAtenção!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEsta é uma área restrita. O uso de ferramentas de desenvolvedor não é permitido.', 'font-size: 16px;');
