// public > js > editar-perfil.js

document.addEventListener("DOMContentLoaded", function () {
    // Funções de navegação do menu
    document.getElementById("link-editar-perfil-painel").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "painel.html";
    });

    document.getElementById("link-editar-perfil-clientes").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "clientes.html";
    });

    // Botão "Meu Perfil" (na barra lateral) deve voltar para perfil.html
    document.querySelector(".nav-editar-perfil-links .active").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "perfil.html";
    });

    document.getElementById("link-editar-perfil-sair").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    });

    // Botão inferior: Cancelar edição
    document.getElementById("cancelar-editar-perfil").addEventListener("click", () => {
        window.location.href = "perfil.html";
    });

    /* Dropdown Reservas */
    const botaoReservas = document.getElementById("btn-editar-perfil-reservas");
    const menuReservas = document.getElementById("menu-reservas-editar-perfil");

    if (botaoReservas && menuReservas) {
        botaoReservas.addEventListener("click", function (e) {
            e.preventDefault();
            menuReservas.style.display = menuReservas.style.display === "block" ? "none" : "block";
        });

        // Fechar dropdown se clicar fora
        document.addEventListener("click", function (e) {
            const isClickInside = botaoReservas.contains(e.target) || menuReservas.contains(e.target);
            if (!isClickInside) {
                menuReservas.style.display = "none";
            }
        });
    }

    // --- LÓGICA PARA CARREGAR DADOS DO PERFIL (MESMO DE perfil.js) ---
    async function carregarDadosPerfilParaEdicao() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert("Você precisa estar logado para editar seu perfil.");
            window.location.href = "index.html";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Preenche os campos do formulário com os dados recebidos
                document.getElementById('nome').value = data.nome_Usuario || '';
                document.getElementById('email').value = data.email_Usuario || '';
                document.getElementById('telefone').value = data.telefone_Usuario || '';
                // Para a senha, por segurança, não preenchemos com a senha real.
                // O usuário deve digitar a nova senha se quiser alterar.
                document.getElementById('senha').value = ''; // Campo vazio para nova senha
            } else {
                alert(data.message || "Erro ao carregar dados do perfil para edição.");
                console.error("Erro ao carregar perfil para edição:", data);
            }
        } catch (error) {
            console.error("Erro na requisição para carregar perfil para edição:", error);
            alert("Erro de conexão ao carregar perfil para edição. Verifique sua conexão.");
        }
    }

    // Chama a função para carregar os dados do perfil ao carregar a página de edição
    carregarDadosPerfilParaEdicao();

    // --- LÓGICA PARA SALVAR EDIÇÃO DO PERFIL ---
    document.getElementById("salvar-editar-perfil").addEventListener("click", async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert("Você precisa estar logado para salvar as alterações do perfil.");
            window.location.href = "index.html";
            return;
        }

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const senha = document.getElementById('senha').value.trim(); // Se preenchido, significa que quer alterar a senha

        if (!nome || !email) {
            alert("Nome e E-mail são campos obrigatórios.");
            return;
        }

        const dadosAtualizacao = {
            nome_Usuario: nome,
            email_Usuario: email,
            telefone_Usuario: telefone || null // Envia null se vazio
        };

        // Se a senha for preenchida, adiciona ao payload para ser atualizada
        if (senha) {
            dadosAtualizacao.senha_Usuario = senha;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosAtualizacao)
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Perfil atualizado com sucesso!");
                window.location.href = "perfil.html"; // Volta para a página de visualização
            } else {
                alert(result.message || "Erro ao atualizar perfil.");
                console.error("Erro ao atualizar perfil:", result);
            }
        } catch (error) {
            console.error("Erro na requisição de atualização de perfil:", error);
            alert("Erro de conexão ao atualizar perfil. Verifique sua conexão.");
        }
    });
});