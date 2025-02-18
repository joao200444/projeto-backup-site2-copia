# Proteção Contra Inspeção de Código

Este módulo fornece proteção básica contra inspeção de código-fonte do site, dificultando o acesso através das ferramentas de desenvolvedor do navegador.

## Funcionalidades

- ✅ Bloqueio da tecla F12
- ✅ Bloqueio do botão direito do mouse
- ✅ Bloqueio de atalhos do DevTools:
  - CTRL+SHIFT+I (Inspecionar)
  - CTRL+SHIFT+J (Console)
  - CTRL+SHIFT+C (Selecionar elemento)
  - CTRL+U (Visualizar fonte)
  - CTRL+S (Salvar página)
- ✅ Detecção e prevenção de abertura do DevTools
- ✅ Bloqueio de visualização do código fonte
- ✅ Bloqueio de seleção de texto
- ✅ Detecção via console.log
- ✅ Detecção via dimensões da janela

## Como Usar

1. Adicione o arquivo `protecao.js` ao seu projeto na pasta `seguranca`
2. Inclua o script antes do fechamento da tag `</body>`:

```html
<script src="seguranca/protecao.js"></script>
```

## Exemplo

Um arquivo de exemplo está disponível em `exemplo.html` demonstrando a implementação da proteção.

## Observações Importantes

- Esta proteção é uma medida de segurança básica
- Não é 100% inviolável, mas dificulta o acesso ao código
- Deve ser usada em conjunto com outras medidas de segurança
- Recomendada para conteúdo que precisa de proteção contra usuários comuns

## Compatibilidade

✅ Google Chrome
✅ Mozilla Firefox
✅ Microsoft Edge
✅ Safari
✅ Opera

## Limitações

- Usuários avançados ainda podem encontrar maneiras de contornar
- Algumas funcionalidades podem ser afetadas em navegadores específicos
- Não substitui medidas de segurança do lado do servidor

## Recomendações

1. Mantenha o arquivo `protecao.js` atualizado
2. Use em conjunto com proteções do lado do servidor
3. Considere ofuscar o código JavaScript
4. Implemente validações adicionais no backend
5. Monitore tentativas de violação

## Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue no repositório.
