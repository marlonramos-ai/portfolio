document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.formul');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // TRAVA O ENVIO DO FORM PELO FORMSPREE

        // LIMPA MENSAGENS DE ERROS ANTERIORES
        limparErros();

        // PEGA OS VALORES DIGITADOS PELO USER
        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        // VAR PRA VER SE TEM ERRO
        let temErro = false;

        // VALIDACAO DO NOME SE TEM MENOS DE 4 LETRAS
        if (nome.length < 4) {
            mostrarErro('erro-nome', 'O nome deve ter pelo menos 4 letras');
            temErro = true;
        }

        // VALIDACAO SE O EMAIL TEM UM FORMATO CORRETO
        if (!validarEmail(email)) {
            mostrarErro('erro-email', 'Por favor, insira um email válido (ex: nome@dominio.com)');
            temErro = true;
        }

        // VERIFICA SE A MSG TEM MENOS DE 10 CARAC
        if (mensagem.length < 10) {
            mostrarErro('erro-mensagem', 'A mensagem deve ter pelo menos 10 caracteres');
            temErro = true;
        }

        // SE TIVER ALGO ERRADO, O BOTAO NAO FUNCIONA
        if (temErro) {
            return;
        }

        // SE ESTA TUDO CERTO, ENVIA O FORM
        enviarFormulario(form);
    });

    // VALIDA EM TEMPO REAL AS INF
    document.getElementById('nome').addEventListener('input', function () {
        if (this.value.length < 4 && this.value.length > 0) {
            mostrarErro('erro-nome', 'O nome deve ter pelo menos 4 letras.');
        } else {
            limparErro('erro-nome');
        }
    });

    document.getElementById('email').addEventListener('input', function () {
        if (!validarEmail(this.value) && this.value.length > 0) {
            mostrarErro('erro-email', 'Por favor, insira um email válido.');
        } else {
            limparErro('erro-email');
        }
    });

    document.getElementById('mensagem').addEventListener('input', function () {
        if (this.value.length < 10 && this.value.length > 0) {
            mostrarErro('erro-mensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
        } else {
            limparErro('erro-mensagem');
        }
    });
});

// REGEX PARA VALIDAR O EMAIL
function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
        return false;
    }

    // DIVIDE O EMAIL EM LOCAL E DOMINIO
    const partes = email.split('@');
    const local = partes[0];
    const dominio = partes[1];

    // VERIFICA SE O DOMINIO TEM PONTOS COMO .COM/.BR E QUANTOS PONTOS POSSUI
    if (!dominio.includes('.') || dominio.startsWith('.') || dominio.endsWith('.')) {
        return false;
    }

    // VERIFICA SE O CAMPO ESTÁ VAZIO OU INC
    if (local.length === 0) {
        return false;
    }

    return true;
}

// MOSTRA SE TEM ALGUM CAMPO ERRADO
function mostrarErro(elementoId, mensagem) {
    const elementoErro = document.getElementById(elementoId);
    elementoErro.textContent = mensagem;
    elementoErro.style.display = 'block';

    // DESTACA O CAMPO ERRADO
    const campoId = elementoId.replace('erro-', '');
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.style.borderColor = '#ff0000';
        campo.style.borderWidth = '2px';
    }
}

// FUNC PARA LIMPAR O CAMPO ERRADO 
function limparErro(elementoId) {
    const elementoErro = document.getElementById(elementoId);
    elementoErro.textContent = '';
    elementoErro.style.display = 'none';

    // RM O DESTAQUE DO CAMPO
    const campoId = elementoId.replace('erro-', '');
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.style.borderColor = '';
        campo.style.borderWidth = '';
    }
}

// FUNC PARA LIMPAR TODOS OS CAMPOS COM ERRO
function limparErros() {
    limparErro('erro-nome');
    limparErro('erro-email');
    limparErro('erro-mensagem');
}

// FUNCAO PARA ENVIAR O FORM VIA FORMSPREE
function enviarFormulario(form) {
    const formData = new FormData(form);

    // DESATIVA O BOTAO ENQUANTO O USER DIGITA
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Enviando...';

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                mostrarMensagemSucesso('Mensagem enviada com sucesso!');
                form.reset(); // LIMPA O FORM APOS O ENVIO COM SUCESSO
            } else {
                return response.json().then(data => {
                    if (data.errors) {
                        // RETORNA OS ERROS DO FORMSPREE
                        data.errors.forEach(error => {
                            if (error.field) {
                                mostrarErro(`erro-${error.field}`, error.message);
                            } else {
                                alert('Erro: ' + error.message);
                            }
                        });
                    } else {
                        alert('Ops! Ocorreu um erro ao enviar o formulário.');
                    }
                });
            }
        })
        .catch(error => {
            alert('Ops! Ocorreu um erro ao enviar o formulário. Verifique sua conexão.');
            console.error('Erro:', error);
        })
        .finally(() => {
            // REABILITA O BOTAO
            botao.disabled = false;
            botao.textContent = 'Enviar Email';
        });
}

// FUNC PARA MOSTRAR MENSAGEM DE SUCESSO
function mostrarMensagemSucesso(mensagem) {
    // RM A MENSAGEM DE SUCESSO DO FORMSPREE
    const sucessoExistente = document.querySelector('.sucesso-mensagem');
    if (sucessoExistente) {
        sucessoExistente.remove();
    }

    // CRIANDO UM ELEMENTO DE SUCESSO
    const sucesso = document.createElement('div');
    sucesso.className = 'sucesso-mensagem';
    sucesso.textContent = mensagem;
    sucesso.style.cssText = 'background-color: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border: 1px solid #c3e6cb; border-radius: 5px; text-align: center;';

    // INSERE ANTES DO FORM
    const form = document.querySelector('.formul');
    form.parentNode.insertBefore(sucesso, form);

    // RM APÓS 2 SEGUNDOS
    setTimeout(() => {
        sucesso.remove();
    }, 3000);
}