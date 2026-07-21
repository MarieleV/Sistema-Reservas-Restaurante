// public > js > login.js

document.addEventListener("DOMContentLoaded", function () {
    const btnEntrar = document.getElementById("btnEntrar");

    if (btnEntrar) {
        btnEntrar.addEventListener("click", async function () {
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            try {
                const response = await fetch("http://localhost:3000/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, senha })
                });

                const data = await response.json();

                if (response.ok) {
                    // Sucesso no login
                    console.log("Login bem-sucedido:", data);
                    
                    // --- INÍCIO DA MUDANÇA ---
                    // Salva o token e o userId no localStorage para uso futuro (ex: em requisições autenticadas)
                    if (data.token) {
                        localStorage.setItem('token', data.token);
                    }
                    if (data.userId) { // Verifica se o backend retornou o userId
                        localStorage.setItem('userId', data.userId);
                    }
                    // --- FIM DA MUDANÇA ---

                    window.location.href = "painel.html"; // Redireciona para o painel
                } else {
                    // Exibir modal de erro ou alert com a mensagem do backend
                    const modalErro = document.getElementById("modalErro");
                    if (modalErro) {
                        // Você pode atualizar o texto do modal com data.message se quiser
                        const mensagemErroParagrafo = modalErro.querySelector('.mensagem-erro');
                        if (mensagemErroParagrafo) {
                            mensagemErroParagrafo.textContent = data.message || "Usuário ou senha incorretos.";
                        }
                        modalErro.style.display = "flex";
                    } else {
                        alert(data.message || "Usuário ou senha incorretos.");
                    }
                }
            } catch (erro) {
                console.error("Erro na requisição de login:", erro);
                const modalErroCarregamento = document.getElementById("modalErroCarregamento");
                if (modalErroCarregamento) {
                    // Similarmente, pode atualizar a mensagem aqui
                    const mensagemErroParagrafo = modalErroCarregamento.querySelector('.mensagem-erro.carregamento-msg');
                    if (mensagemErroParagrafo) {
                        mensagemErroParagrafo.textContent = "Erro de Conexão!";
                    }
                    const mensagemAjudaParagrafo = modalErroCarregamento.querySelector('.mensagem-ajuda');
                    if (mensagemAjudaParagrafo) {
                        mensagemAjudaParagrafo.textContent = "Verifique o servidor ou sua internet.";
                    }
                    modalErroCarregamento.style.display = "flex";
                } else {
                    alert("Erro de rede ou servidor.");
                }
            }
        });
    }

    // Fecha o modal de erro ao clicar no botão "Ok"
    const btnFecharErro = document.getElementById("btnFecharErro");
    if (btnFecharErro) {
        btnFecharErro.addEventListener("click", function () {
            document.getElementById("modalErro").style.display = "none";
        });
    }

    const btnFecharErro2 = document.getElementById("btnFecharErro2");
    if (btnFecharErro2) {
        btnFecharErro2.addEventListener("click", function () {
            document.getElementById("modalErroCarregamento").style.display = "none";
        });
    }

    // A função abrirModalErroCarregamento e o setTimeout de 1s podem causar o modal aparecer
    // sempre no login. Geralmente, este modal é ativado apenas se houver um erro real na requisição inicial da página.
    // Você pode querer remover ou ajustar essa lógica se ela estiver aparecendo indevidamente.
    function abrirModalErroCarregamento() {
        const modal = document.getElementById("modalErroCarregamento");
        if (modal) {
            modal.style.display = "flex";
        } else {
            console.error("Modal de carregamento não encontrado!");
        }
    }

    // Removi o setTimeout para este modal aparecer, pois ele geralmente indica
    // um erro de carregamento da *página*, não da requisição de login.
    // setTimeout(abrirModalErroCarregamento, 1000); 
});