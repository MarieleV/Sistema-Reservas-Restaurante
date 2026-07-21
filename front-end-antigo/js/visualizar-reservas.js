// public > js > visualizar-reservas.js

document.addEventListener("DOMContentLoaded", () => {
    // Funções de navegação do menu (mantidas como estão)
    document.getElementById("link-visualizar-reserva-painel").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "painel.html";
    });

    document.getElementById("link-visualizar-reserva-clientes").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "clientes.html";
    });

    document.getElementById("link-visualizar-reserva-perfil").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "perfil.html";
    });

    document.getElementById("link-visualizar-reserva-sair").addEventListener("click", (e) => {
        e.preventDefault();
        // Limpar o token e userId ao sair
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    });

    // Dropdown Reservas (mantido como está)
    const botaoReservas = document.getElementById("btn-visualizar-reserva-reservas");
    const menuReservas = document.getElementById("menu-reservas-visualizar-reserva");

    if (botaoReservas && menuReservas) {
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

    // --- LÓGICA PARA CARREGAR RESERVAS DO BACKEND ---
    const tbody = document.getElementById("tabela-visualizar-reservas");
    const modalErroCarregamentoReservas = document.getElementById("modalErroCarregamentoReservas");
    const btnFecharErroCarregamento = document.getElementById("btnFecharErro"); // Botão OK/Fechar do modal de erro

    async function carregarReservas() {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Opcional, se for filtrar por cliente

        if (!token) {
            console.warn("Token de autenticação não encontrado. Redirecionando para login.");
            alert("Você precisa estar logado para visualizar as reservas.");
            window.location.href = "index.html"; // Redireciona para login
            return;
        }

        try {
            // Requisição GET para listar todas as reservas
            const response = await fetch("http://localhost:3000/api/reservas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Inclui o token para autenticação
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Limpa a tabela antes de adicionar os novos dados
                tbody.innerHTML = ''; 

                // A propriedade 'reservas' pode variar dependendo do que seu backend retorna.
                // Se o seu 'reservaController.listarTodas' retorna um array direto, use 'data'.
                // Se retornar um objeto { reservas: [...] }, use 'data.reservas'.
                const reservas = Array.isArray(data) ? data : data.reservas; 
                
                if (!reservas || reservas.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6">Nenhuma reserva encontrada.</td></tr>';
                    return;
                }

                reservas.forEach((reserva) => {
                    const tr = document.createElement("tr");

                    // Determina a classe CSS com base no status da reserva
                    const statusClass = 
                        reserva.status_Reserva === "confirmada" ? "painel-status-confirmada" :
                        reserva.status_Reserva === "cancelada" ? "painel-status-cancelada" :
                        "painel-status-pendente"; // Assumindo que 'pendente' é o padrão

                    // Exibe o botão "Cancelar" apenas se o status não for "Cancelada"
                    // E adicione um botão para "Editar" se for o caso
                    const btnCancelar = reserva.status_Reserva !== "cancelada"
                        ? `<button class="btn-cancelar" data-id="${reserva.id}">Cancelar</button>`
                        : "";
                    
                    // Exemplo de botão de editar (ainda não implementado o JS para ele)
                    const btnEditar = `<button class="btn-editar" data-id="${reserva.id}">Editar</button>`;


                    tr.innerHTML = `
                        <td>${reserva.nome_Usuario}</td>
                        <td>${new Date(reserva.data_Reserva).toLocaleDateString('pt-BR')}</td>
                        <td>${new Date(reserva.data_Reserva).toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})}</td>
                        <td>${reserva.numeropessoas_Reserva}</td>
                        <td class="status-text ${statusClass}">${reserva.status_Reserva.charAt(0).toUpperCase() + reserva.status_Reserva.slice(1)}</td>
                        <td>
                            ${btnEditar}
                            ${btnCancelar}
                        </td>
                    `;
                    tbody.appendChild(tr);
                });

                // Lógica para os botões de cancelar (já presente, apenas ajustei o seletor e dados)
                document.querySelectorAll('.btn-cancelar').forEach(button => {
                    button.addEventListener('click', function() {
                        const reservaId = this.dataset.id;
                        reservaSelecionadaId = reservaId; // Guarda o ID da reserva para o modal
                        document.getElementById("modal-cancelar-reservas").style.display = "flex";
                    });
                });

                // Lógica para os botões de editar (precisará de implementação futura)
                document.querySelectorAll('.btn-editar').forEach(button => {
                    button.addEventListener('click', function() {
                        const reservaId = this.dataset.id;
                        // TODO: Implementar lógica para carregar dados da reserva no formulário de edição
                        // Por exemplo: window.location.href = `editar-reserva.html?id=${reservaId}`;
                        alert(`Funcionalidade de Editar Reserva ${reservaId} ainda não implementada.`);
                    });
                });


            } else {
                // Se a resposta não for OK, exibe a mensagem de erro do backend
                console.error("Erro ao carregar reservas:", data.message || "Erro desconhecido");
                if (modalErroCarregamentoReservas) {
                    modalErroCarregamentoReservas.querySelector('.carregamento-reservas-msg').textContent = data.message || "Erro ao carregar as reservas!";
                    modalErroCarregamentoReservas.querySelector('.mensagem-reservas-ajuda').textContent = "Tente novamente!";
                    modalErroCarregamentoReservas.style.display = "flex";
                } else {
                    alert(data.message || "Erro ao carregar reservas.");
                }
            }
        } catch (error) {
            console.error("Erro na requisição para carregar reservas:", error);
            if (modalErroCarregamentoReservas) {
                modalErroCarregamentoReservas.querySelector('.carregamento-reservas-msg').textContent = "Erro de conexão!";
                modalErroCarregamentoReservas.querySelector('.mensagem-reservas-ajuda').textContent = "Verifique o servidor ou sua internet.";
                modalErroCarregamentoReservas.style.display = "flex";
            } else {
                alert("Erro ao carregar reservas. Verifique sua conexão ou tente mais tarde.");
            }
        }
    }

    // Chama a função para carregar as reservas quando a página é carregada
    carregarReservas();

    // --- LÓGICA DO MODAL DE CANCELAMENTO (adaptada para usar ID real) ---
    let reservaSelecionadaId = null; // Armazena o ID da reserva a ser cancelada

    // Botões do modal de cancelamento
    if (btnFecharErroCarregamento) {
        btnFecharErroCarregamento.addEventListener("click", function () {
            if (modalErroCarregamentoReservas) modalErroCarregamentoReservas.style.display = "none";
        });
    }

    document.getElementById("voltar-cancelar-reservas-modal").addEventListener("click", function(){
        document.getElementById("modal-cancelar-reservas").style.display = "none";
        reservaSelecionadaId = null;
    });

    document.getElementById("confirmar-reservas-cancelar").addEventListener("click", async function(){
        if(reservaSelecionadaId){
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Você precisa estar logado para cancelar uma reserva.");
                window.location.href = "index.html";
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/reservas/${reservaSelecionadaId}`, {
                    method: 'PUT', // Requisição PUT para atualizar o status
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 'cancelada' }) // Envia o novo status
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || 'Reserva cancelada com sucesso!');
                    document.getElementById("modal-cancelar-reservas").style.display = "none";
                    reservaSelecionadaId = null;
                    carregarReservas(); // Recarrega a lista para refletir a mudança
                } else {
                    alert(result.message || 'Erro ao cancelar reserva.');
                    console.error('Erro ao cancelar reserva:', result);
                }
            } catch (error) {
                console.error('Erro na requisição de cancelamento:', error);
                alert('Erro ao cancelar reserva. Verifique sua conexão ou tente mais tarde.');
            }
        }
    });

    // Remove o setTimeout de carregamento de erro, pois a função carregarReservas() já lida com isso.
    // setTimeout(abrirModalErroCarregamentoReservas, 1000);
});