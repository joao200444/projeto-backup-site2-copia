// Criar e adicionar o aviso ao body assim que o script carregar
const avisoInspecionar = document.createElement('div');
avisoInspecionar.id = 'aviso-inspect';
avisoInspecionar.innerHTML = `
    <div class="aviso-conteudo">
        <div class="aviso-icone">⚠️</div>
        <h2>Atenção! Área Protegida</h2>
        <p class="aviso-principal">Foi detectada uma tentativa de inspeção do site.</p>
        <div class="aviso-explicacao">
            <p>O acesso ao inspetor de elementos foi bloqueado por motivos de segurança:</p>
            <ul>
                <li>Proteção de dados sensíveis dos usuários</li>
                <li>Prevenção contra atividades maliciosas</li>
                <li>Manutenção da integridade do sistema</li>
            </ul>
            <p class="aviso-destaque">A inspeção de elementos pode expor vulnerabilidades e comprometer a segurança de todos os usuários.</p>
        </div>
        <p class="aviso-sub">Por favor, feche o inspetor ou a ferramenta de desenvolvimento para continuar navegando.</p>
        <button class="aviso-botao" onclick="esconderAviso()">Entendi e Concordo</button>
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

    #aviso-inspect .aviso-principal {
        font-size: 20px;
        color: #ff3e3e;
        font-weight: bold;
        margin-bottom: 20px;
    }

    #aviso-inspect .aviso-explicacao {
        background: rgba(255, 255, 255, 0.05);
        padding: 20px;
        border-radius: 10px;
        margin: 20px 0;
        text-align: left;
    }

    #aviso-inspect .aviso-explicacao ul {
        margin: 15px 0;
        padding-left: 20px;
        list-style-type: none;
    }

    #aviso-inspect .aviso-explicacao li {
        margin: 10px 0;
        padding-left: 25px;
        position: relative;
    }

    #aviso-inspect .aviso-explicacao li:before {
        content: '⚠️';
        position: absolute;
        left: 0;
        font-size: 14px;
    }

    #aviso-inspect .aviso-destaque {
        color: #ff3e3e;
        font-weight: bold;
        border-left: 3px solid #ff3e3e;
        padding-left: 15px;
        margin: 20px 0;
    }

    #aviso-inspect .aviso-sub {
        color: #aaa;
        font-size: 16px;
        margin: 20px 0;
    }

    #aviso-inspect .aviso-botao {
        background: #1DA1F2;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 25px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    #aviso-inspect .aviso-botao:hover {
        background: #1991db;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(29,161,242,0.3);
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

// Sobrescrever a função de inspeção nativa
Element.prototype.inspect = function() {
    mostrarAviso();
    return false;
};

// Desabilitar menu de inspeção
document.oncontextmenu = function(e) {
    if (e.target.matches('html, body, head, meta, title, link, script')) {
        mostrarAviso();
        return false;
    }
    return true;
};

// Mensagem no console
console.log('%cAtenção!', 'color: red; font-size: 30px; font-weight: bold;');
console.log('%cEsta é uma área restrita. O uso de ferramentas de desenvolvedor não é permitido.', 'font-size: 16px;');
