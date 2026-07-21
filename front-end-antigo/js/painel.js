// public > js > painel.js

document.addEventListener("DOMContentLoaded", function () {
    // Funções de navegação do menu (mantidas como estão)
    document.getElementById("link-painel-clientes").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "clientes.html";
    });

    document.getElementById("link-painel-perfil").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "perfil.html";
    });

    document.getElementById("link-painel-sair").addEventListener("click", (e) => {
        e.preventDefault();
        // Limpar o token e userId ao sair
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    });

    /* Dropdown Reservas */
    const botaoReservas = document.getElementById("btn-painel-reservas");
    const menuReservas = document.getElementById("menu-reservas-painel");

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

    // --- LÓGICA PARA CARREGAR E GERENCIAR RESERVAS DO BACKEND ---
    const hojeTbody = document.getElementById('painel-hoje');
    const futurasTbody = document.getElementById('painel-futuras');
    const contadorHoje = document.getElementById("contador-hoje");
    const modalErroCarregamentoPainel = document.getElementById("modalErroCarregamentoPainel");
    const btnFecharErro = document.getElementById("btnFecharErro");

    if (btnFecharErro) {
      btnFecharErro.addEventListener("click", function () {
          if (modalErroCarregamentoPainel) {
              modalErroCarregamentoPainel.style.display = "none";
          }
      });
    }

    async function carregarReservasPainel() {
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("Token de autenticação não encontrado. Redirecionando para login.");
            alert("Você precisa estar logado para acessar o painel administrativo.");
            window.location.href = "index.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/reservas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Limpa as tabelas antes de adicionar os novos dados
                hojeTbody.innerHTML = '';
                futurasTbody.innerHTML = '';

                const reservas = Array.isArray(data) ? data : data.reservas;

                if (!reservas || reservas.length === 0) {
                    hojeTbody.innerHTML = '<tr><td colspan="6">Nenhuma reserva para hoje.</td></tr>';
                    futurasTbody.innerHTML = '<tr><td colspan="5">Nenhuma reserva futura.</td></tr>';
                    contadorHoje.textContent = 0;
                    return;
                }

                const hoje = new Date();
                hoje.setHours(0, 0, 0, 0); // Zera hora para comparar apenas a data

                let countHoje = 0;

                reservas.forEach(reserva => {
                    const dataReserva = new Date(reserva.data_Reserva);
                    dataReserva.setHours(0, 0, 0, 0);

                    const tr = document.createElement('tr');
                    const statusClass = reserva.status_Reserva === "confirmada" ? "painel-status-confirmada" :
                                        reserva.status_Reserva === "cancelada" ? "painel-status-cancelada" :
                                        "painel-status-pendente";
                    
                    const displayStatus = reserva.status_Reserva.charAt(0).toUpperCase() + reserva.status_Reserva.slice(1);

                    if (dataReserva.getTime() === hoje.getTime()) {
                        // Reservas do dia
                        countHoje++;
                        tr.innerHTML = `
                            <td>${reserva.nome_Usuario}</td>
                            <td>${new Date(reserva.data_Reserva).toLocaleDateString('pt-BR')}</td>
                            <td>${new Date(reserva.data_Reserva).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>${reserva.numeropessoas_Reserva}</td>
                            <td class="status-text ${statusClass}">${displayStatus}</td>
                            <td>
                                ${reserva.status_Reserva !== 'cancelada' && reserva.status_Reserva !== 'confirmada' ? `<button class="painel-btn-confirmar" data-id="${reserva.id}">Confirmar</button>` : ''}
                                ${reserva.status_Reserva !== 'cancelada' ? `<button class="painel-btn-cancelar" data-id="${reserva.id}">Cancelar</button>` : ''}
                            </td>
                        `;
                        hojeTbody.appendChild(tr);
                    } else if (dataReserva.getTime() > hoje.getTime()) {
                        // Próximas reservas
                        tr.innerHTML = `
                            <td>${reserva.nome_Usuario}</td>
                            <td>${new Date(reserva.data_Reserva).toLocaleDateString('pt-BR')}</td>
                            <td>${new Date(reserva.data_Reserva).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</td>
                            <td>${reserva.numeropessoas_Reserva}</td>
                            <td>
                                ${reserva.status_Reserva !== 'cancelada' && reserva.status_Reserva !== 'confirmada'
                                    ? `<button class="painel-btn-confirmar" data-id="${reserva.id}">Confirmar</button>
                                       <button class="painel-btn-cancelar" data-id="${reserva.id}">Cancelar</button>`
                                    : `<span class="${statusClass}">${displayStatus}</span>` // <-- MUDANÇA AQUI
                                }
                            </td>
                        `;
                        futurasTbody.appendChild(tr);
                    }
                });

                contadorHoje.textContent = countHoje;

            } else {
                console.error("Erro ao carregar reservas para o painel:", data.message || "Erro desconhecido");
                if (modalErroCarregamentoPainel) {
                    modalErroCarregamentoPainel.querySelector('.carregamento-painel-msg').textContent = data.message || "Erro ao carregar as reservas!";
                    modalErroCarregamentoPainel.querySelector('.mensagem-painel-ajuda').textContent = "Tente novamente!";
                    modalErroCarregamentoPainel.style.display = "flex";
                } else {
                    alert(data.message || "Erro ao carregar reservas para o painel.");
                }
            }
        } catch (error) {
            console.error("Erro na requisição para carregar reservas do painel:", error);
            if (modalErroCarregamentoPainel) {
                modalErroCarregamentoPainel.querySelector('.carregamento-painel-msg').textContent = "Erro de conexão!";
                modalErroCarregamentoPainel.querySelector('.mensagem-painel-ajuda').textContent = "Verifique o servidor ou sua internet.";
                modalErroCarregamentoPainel.style.display = "flex";
            } else {
                alert("Erro ao carregar reservas do painel. Verifique sua conexão ou tente mais tarde.");
            }
        }
    }

    // Chama a função para carregar as reservas quando a página é carregada
    carregarReservasPainel();

    // --- LÓGICA DE GERENCIAMENTO DE STATUS (Confirmar/Cancelar) ---
    let linhaParaCancelar = null; // Armazena a linha do DOM para manipular

    // Event listener para cliques na tabela (delegação de eventos)
    document.addEventListener("click", async (e) => {
        const target = e.target;

        // Lógica para o botão de CANCELAR
        if (target.classList.contains("painel-btn-cancelar")) {
            linhaParaCancelar = target.closest("tr"); // Guarda a linha
            const reservaId = target.dataset.id; // Pega o ID da reserva
            document.getElementById('modal-cancelar').style.display = 'flex'; // Abre o modal
            document.getElementById('confirmar-cancelar').dataset.id = reservaId; // Salva o ID no botão de confirmação do modal
        }

        // Lógica para o botão de CONFIRMAR
        if (target.classList.contains("painel-btn-confirmar")) {
            const reservaId = target.dataset.id;
            const token = localStorage.getItem('token');

            if (!token) {
                alert("Você precisa estar logado para confirmar uma reserva.");
                window.location.href = "index.html";
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ status: 'confirmada' }) // Envia o novo status
                });

                const result = await response.json();

                if (response.ok) {
                    alert(result.message || 'Reserva confirmada com sucesso!');
                    carregarReservasPainel(); // Recarrega a lista para refletir a mudança
                } else {
                    alert(result.message || 'Erro ao confirmar reserva.');
                    console.error('Erro ao confirmar reserva:', result);
                }
            } catch (error) {
                console.error('Erro na requisição de confirmação:', error);
                alert('Erro ao confirmar reserva. Verifique sua conexão ou tente mais tarde.');
            }
        }
    });

    // Fechar o modal ao clicar em "Voltar"
    document.getElementById('voltar-cancelar-modal').addEventListener('click', () => {
        document.getElementById('modal-cancelar').style.display = 'none';
        linhaParaCancelar = null;
        document.getElementById('confirmar-cancelar').removeAttribute('data-id');
    });

    // Confirmar o cancelamento (botão dentro do modal)
    document.getElementById('confirmar-cancelar').addEventListener('click', async () => {
        const reservaId = document.getElementById('confirmar-cancelar').dataset.id; // Pega o ID salvo no botão
        
        if (!reservaId) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("Você precisa estar logado para cancelar uma reserva.");
            window.location.href = "index.html";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/reservas/${reservaId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'cancelada' }) // Envia o novo status
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || 'Reserva cancelada com sucesso!');
                document.getElementById('modal-cancelar').style.display = 'none';
                linhaParaCancelar = null;
                document.getElementById('confirmar-cancelar').removeAttribute('data-id');
                carregarReservasPainel(); // Recarrega a lista para refletir a mudança
            } else {
                alert(result.message || 'Erro ao cancelar reserva.');
                console.error('Erro ao cancelar reserva:', result);
            }
        } catch (error) {
            console.error('Erro na requisição de cancelamento:', error);
            alert('Erro ao cancelar reserva. Verifique sua conexão ou tente mais tarde.');
        }
    });
    
});