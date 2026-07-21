// public > js > perfil.js

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('editar-perfil').addEventListener('click', () => {
        window.location.href = 'editar-perfil.html';
    });

    // Lógica para remover perfil (apenas UI do modal por enquanto, o PUT/DELETE virá depois)
    document.getElementById('remover-perfil').addEventListener('click', () => {
        document.getElementById('modal-remover').style.display = 'flex';
    });

    document.getElementById('cancelar-modal').addEventListener('click', () => {
        document.getElementById('modal-remover').style.display = 'none';
    });

    document.getElementById('confirmar-remover').addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert("Você precisa estar logado para remover seu perfil.");
            window.location.href = "index.html";
            return;
        }

        if (!confirm("Tem certeza que deseja remover seu perfil? Esta ação é irreversível.")) {
            document.getElementById('modal-remover').style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Perfil removido com sucesso!");
                localStorage.removeItem('token'); // Limpa token ao remover perfil
                localStorage.removeItem('userId');
                window.location.href = 'index.html'; // Redireciona para login
            } else {
                alert(result.message || "Erro ao remover perfil.");
                console.error("Erro ao remover perfil:", result);
            }
        } catch (error) {
            console.error("Erro na requisição de remoção de perfil:", error);
            alert("Erro de conexão ao tentar remover perfil. Tente novamente mais tarde.");
        } finally {
            document.getElementById('modal-remover').style.display = 'none';
        }
    });

    // Funções de navegação do menu
    document.getElementById("link-perfil-painel").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "painel.html";
    });

    document.getElementById("link-perfil-clientes").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "clientes.html";
    });

    document.getElementById("link-perfil-sair").addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    });

    /* Dropdown Reservas */
    const botaoReservas = document.getElementById("btn-perfil-reservas");
    const menuReservas = document.getElementById("menu-reservas-perfil");

    if (botaoReservas && menuReservas) {
        botaoReservas.addEventListener("click", function (e) {
            e.preventDefault();
            menuReservas.style.display = menuReservas.style.display === "block" ? "none" : "block";
        });

        //fechar dropdown se clicar fora
        document.addEventListener("click", function (e) {
            const isClickInside = botaoReservas.contains(e.target) || menuReservas.contains(e.target);
            if (!isClickInside) {
                menuReservas.style.display = "none";
            }
        });
    }

    // --- LÓGICA PARA CARREGAR DADOS DO PERFIL ---
    async function carregarDadosPerfil() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert("Você precisa estar logado para visualizar seu perfil.");
            window.location.href = "index.html";
            return;
        }

        try {
            // Requisição GET para buscar dados do usuário logado
            const response = await fetch(`http://localhost:3000/api/usuarios/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Inclui o token
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Preenche os campos do formulário com os dados recebidos
                document.getElementById('nome').value = data.nome_Usuario || '';
                document.getElementById('email').value = data.email_Usuario || '';
                document.getElementById('telefone').value = data.telefone_Usuario || '';
                // Não exiba a senha real aqui, apenas um placeholder
                document.getElementById('senha').value = '********'; 
            } else {
                alert(data.message || "Erro ao carregar dados do perfil.");
                console.error("Erro ao carregar perfil:", data);
                // Pode redirecionar para login ou exibir um erro no painel
            }
        } catch (error) {
            console.error("Erro na requisição para carregar perfil:", error);
            alert("Erro de conexão ao carregar perfil. Verifique sua conexão.");
        }
    }

    // Chama a função para carregar os dados do perfil ao carregar a página
    carregarDadosPerfil();
});