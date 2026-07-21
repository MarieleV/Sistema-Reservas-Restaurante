// public > js > fazer-reserva.js

document.addEventListener("DOMContentLoaded", function () {
    // Funções de navegação do menu (mantidas como estão)
    document.getElementById("link-fazer-reserva-painel").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "painel.html";
    });

    document.getElementById("link-fazer-reserva-clientes").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "clientes.html";
    });

    document.getElementById("link-fazer-reserva-perfil").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "perfil.html";
    });

    document.getElementById("link-fazer-reserva-sair").addEventListener("click", (e) => {
        e.preventDefault();
        // Limpar o token ao sair
        localStorage.removeItem('token');
        localStorage.removeItem('userId'); // Se você salvar o userId separadamente
        window.location.href = "index.html";
    });

    // Dropdown Reservas (mantido como está)
    const botaoReservas = document.getElementById("btn-fazer-reserva-reservas");
    const menuReservas = document.getElementById("menu-reservas-fazer-reserva");

    if (botaoReservas && menuReservas) { // Verifica se os elementos existem
        botaoReservas.addEventListener("click", function(e){
            e.preventDefault();
            e.stopPropagation();
            menuReservas.style.display = menuReservas.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function(e){
            const isClickInside = botaoReservas.contains(e.target) || menuReservas.contains(e.target);
            if(!isClickInside) {
                menuReservas.style.display = "none";
            }
        });
    }

    // --- LÓGICA DE ENVIO DO FORMULÁRIO DE RESERVA ---
    const formReserva = document.querySelector(".form-fazer-reserva");
    const modalErroCampos = document.getElementById("modalErroCamposReserva");
    const btnFecharErroCadastroReserva = document.getElementById("btnFecharErroCadastro-reserva");

    if (formReserva) { // Verifica se o formulário existe
        formReserva.addEventListener("submit", async function(e){
            e.preventDefault(); // Impede o envio padrão do formulário

            const nome = document.getElementById("nome").value.trim(); // Nome do cliente (para exibição, ou para buscar clienteId)
            const data = document.getElementById("data").value.trim(); // Data YYYY-MM-DD
            const hora = document.getElementById("hora").value.trim(); // Hora HH:MM
            const pessoas = document.getElementById("pessoas").value.trim(); // Número de pessoas

            // 1. Validação de campos (melhorado para verificar pessoas > 0)
            if (!nome || !data || !hora || !pessoas || parseInt(pessoas) <= 0) {
                if (modalErroCampos) {
                    modalErroCampos.style.display = "flex";
                } else {
                    alert("Por favor, preencha todos os campos obrigatórios e garanta que o número de pessoas seja maior que zero.");
                }
                return;
            }

            // 2. Obter o Token e ID do Usuário Logado
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId'); // Assumindo que você salva o userId no localStorage também
                                                            // ou que o 'id' do usuário no token é o 'id_Usuario'
                                                            // que corresponde ao id na tabela Usuario
                                                            // e que você consegue o clienteId a partir disso no backend.
                                                            // MAIS DETALHES ABAIXO SOBRE ISSO.


            // VERIFICAÇÃO IMPORTANTE: Se o token ou userId não existem, o usuário não está logado
            if (!token || !userId) {
                alert("Você precisa estar logado para fazer uma reserva.");
                window.location.href = "index.html"; // Redireciona para login
                return;
            }

            // 3. Combinar Data e Hora para o formato DATETIME do MySQL (YYYY-MM-DD HH:MM:SS)
            // Note: O campo data_Reserva no seu DB é DATETIME, então precisamos incluir a hora.
            // Para ser compatível com DATETIME no MySQL, o ideal é enviar 'YYYY-MM-DD HH:MM:SS'
            const dataHoraReserva = `${data} ${hora}:00`; // Adiciona ":00" para segundos

            // 4. Montar os dados para enviar ao backend
            const dadosReserva = {
                numeropessoas: parseInt(pessoas), // Garante que seja um número
                data: dataHoraReserva,
                // O clienteId precisa vir do usuário logado.
                // Aqui estamos assumindo que o userId (que vem do token) é o id_Usuario da tabela Usuario.
                // O backend (reservaController.criar) espera Cliente_id.
                // Você pode precisar de uma etapa no backend para buscar o Cliente_id dado o id_Usuario.
                // OU, se você tiver o Cliente_id direto no token de login, use-o.
                clienteId: userId // <-- ASSUMIMOS QUE userId DO TOKEN É O CLIENTE_ID. ISSO PRECISA SER VERIFICADO NO SEU BANCO E LÓGICA DE LOGIN.
                                   // SE O CLIENTE_ID ESTIVER NA TABELA CLIENTE E FOR DIFERENTE DO ID DO USUARIO, VC TERA QUE FAZER UM JOIN OU BUSCA NO BACKEND.
                                   // A maneira mais direta é:
                                   // SEU BACKEND PRECISA ACEITAR O ID_USUARIO E ENCONTRAR O CLIENTE_ID INTERNAMENTE.
                                   // OU VOCÊ DEVE ENVIAR O Cliente_id DIRETO DO FRONT.
            };


            try {
                const response = await fetch("http://localhost:3000/api/reservas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Inclui o token para autenticação
                    },
                    body: JSON.stringify(dadosReserva)
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || "Reserva criada com sucesso!");
                    window.location.href = "visualizar-reservas.html"; // Redireciona em caso de sucesso
                } else {
                    // Exibe a mensagem de erro do backend
                    alert(result.message || "Erro ao criar reserva. Tente novamente.");
                    console.error("Erro no backend:", result);
                }
            } catch (error) {
                console.error("Erro ao enviar dados da reserva:", error);
                alert("Erro ao criar reserva. Verifique sua conexão ou tente mais tarde.");
            } finally {
                // Se houver um modal de carregamento, ele seria fechado aqui
            }
        });
    }

    // Fechar modal de erro de campos
    if (btnFecharErroCadastroReserva) {
        btnFecharErroCadastroReserva.addEventListener("click", () => {
            if (modalErroCampos) modalErroCampos.style.display = "none";
        });
    }
});