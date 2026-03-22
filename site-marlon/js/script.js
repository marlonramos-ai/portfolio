document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.formul');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        limparErros();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensagem = document.getElementById('mensagem').value.trim();

        let temErro = false;

        if (nome.length < 4) {
            mostrarErro('erro-nome', 'O nome deve ter pelo menos 4 letras');
            temErro = true;
        }

        if (!validarEmail(email)) {
            mostrarErro('erro-email', 'Por favor, insira um email válido (ex: nome@dominio.com)');
            temErro = true;
        }

        if (mensagem.length < 10) {
            mostrarErro('erro-mensagem', 'A mensagem deve ter pelo menos 10 caracteres');
            temErro = true;
        }

        if (temErro) {
            return;
        }

        enviarFormulario(form);
    });

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

function validarEmail(email) {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!regexEmail.test(email)) {
        return false;
    }

    const partes = email.split('@');
    const local = partes[0];
    const dominio = partes[1];

    if (!dominio.includes('.') || dominio.startsWith('.') || dominio.endsWith('.')) {
        return false;
    }

    if (local.length === 0) {
        return false;
    }

    return true;
}

function mostrarErro(elementoId, mensagem) {
    const elementoErro = document.getElementById(elementoId);

    elementoErro.textContent = mensagem;
    elementoErro.style.display = 'block';

    const campoId = elementoId.replace('erro', '');
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.style.borderColor = '#ff0000'
        campo.style.borderWidth = '2px';
    }
}

function limparErro(elementoId) {
    const elementoErro = document.getElementById(elementoId);
    elementoErro.textContent = '';
    elementoErro.display = 'none';

    const campoId = elementoId.replace('erro-', '');
    const campo = document.getElementById(campoId);
    if (campo) {
        campo.style.borderColor = '';
        campo.style.borderWidth = '';
    }
}

function limparErros() {
    limparErro('erro-nome');
    limparErro('erro-email');
    limparErro('erro-mensagem');
}

function enviarFormulario(form) {
    const formData = new FormData(form);
    const botao = form.querySelector('button[type="submit"]');
    botao.disabled = true;
    botao.textContent = 'Enviando';

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
        form.reset();
    } else {
        return response.json().then(data => {
            if (data.errors) {
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
        botao.disabled = false;
        botao.textContent = 'Enviar Email';
    });
}

function mostrarMensagemSucesso(mensagem) {
    const sucessoExistente = document.querySelector('.sucesso-mensagem');
    if (sucessoExistente) {
        sucessoExistente.remove();
    }

    const sucesso = document.createElement('div');
    sucesso.className = 'sucesso-mensagem';
    sucesso.textContent = mensagem;
    sucesso.style.cssText = 'background-color: #d4edda; color: #155724; padding: 10px; margin: 10px 0; border: 1px solid #c3e6cb; border-radius: 5px; text-align: center;';

    const form = document.querySelector('.formul');
    form.parentNode.insertBefore(sucesso, form);

    setTimeout(() => {
        sucesso.remove();
    }, 3000);
}