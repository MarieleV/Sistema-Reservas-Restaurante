document.addEventListener("DOMContentLoaded", function () {
    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async function (e) {
            e.preventDefault(); // Impede o envio padrão do formulário

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const cpf = document.getElementById("cpf").value.trim();  // Campo CPF
            const senha = document.getElementById("senha").value.trim();
            const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

            // Validação de campos obrigatórios
            if (!nome || !email || !telefone || !cpf || !senha || !confirmarSenha) {
                const modalErroCampos = document.getElementById("modalErroCampos");
                if (modalErroCampos) {
                    modalErroCampos.style.display = "flex";
                }
                return;
            }

            // Validação de senha
            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem.");
                return;
            }

            // Exibir modal de carregamento
            const modalCarregamento = document.getElementById("modalErroCarregamentoCadastro");
            if (modalCarregamento) {
                modalCarregamento.style.display = "flex";
            }

            // Dados para envio
            const dados = { nome, email, telefone, cpf, senha };

            try {
                const response = await fetch("/api/clientes", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                        // Nenhum token de autenticação será enviado aqui
                    },
                    body: JSON.stringify(dados)
                });

                const result = await response.json();

                if (response.ok) {
                    window.location.href = "index.html"; // Redireciona em caso de sucesso
                } else {
                    alert(result.message || "Erro ao cadastrar. Tente novamente.");
                }
            } catch (error) {
                console.error("Erro ao enviar dados:", error);
                alert("Erro ao cadastrar. Verifique sua conexão ou tente mais tarde.");
            } finally {
                if (modalCarregamento) {
                    modalCarregamento.style.display = "none";
                }
            }
        });
    }

    // Botão para fechar o modal de erro de campos obrigatórios
    const btnFecharErroCadastro = document.getElementById("btnFecharErroCadastro");
    if (btnFecharErroCadastro) {
        btnFecharErroCadastro.addEventListener("click", () => {
            const modalErroCampos = document.getElementById("modalErroCampos");
            if (modalErroCampos) modalErroCampos.style.display = "none";
        });
    }

    // Botão para fechar o modal de carregamento
    const btnFecharErroCarregamentoCadastro = document.getElementById("btnFecharErroCarregamentoCadastro");
    if (btnFecharErroCarregamentoCadastro) {
        btnFecharErroCarregamentoCadastro.addEventListener("click", () => {
            const modalCarregamento = document.getElementById("modalErroCarregamentoCadastro");
            if (modalCarregamento) modalCarregamento.style.display = "none";
        });
    }
});
