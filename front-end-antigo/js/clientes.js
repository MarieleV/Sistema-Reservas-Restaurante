// public > js > clientes.js

document.addEventListener("DOMContentLoaded", function () {
    // Funções de navegação do menu (mantidas como estão)
    document.getElementById("link-clientes-painel").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "painel.html";
    });

    document.getElementById("link-clientes-perfil").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "perfil.html";
    });

    document.getElementById("link-clientes-sair").addEventListener("click", (e) => {
        e.preventDefault();
        // Limpar o token e userId ao sair
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = "index.html";
    });

    /* Dropdown Reservas */
    const botaoReservas = document.getElementById("btn-clientes-reservas");
    const menuReservas = document.getElementById("menu-reservas-clientes");

    if (botaoReservas && menuReservas) {
        botaoReservas.addEventListener("click", function(e){
            e.preventDefault();
            menuReservas.style.display = menuReservas.style.display === "block" ? "none" : "block";
        });

        // Fechar dropdown se clicar fora
        document.addEventListener("click", function(e){
            const isClickInside = botaoReservas.contains(e.target) || menuReservas.contains(e.target);
            if (!isClickInside){
                menuReservas.style.display = "none";
            }
        });
    }
    
    // Modal de erro de carregamento (mantido, mas agora usado dinamicamente)
    const modalErroCarregamentoClientes = document.getElementById("modalErroCarregamentoClientes");
    const btnFecharErro = document.getElementById("btnFecharErro");
    
    if (btnFecharErro) {
      btnFecharErro.addEventListener("click", function () {
          if (modalErroCarregamentoClientes) {
              modalErroCarregamentoClientes.style.display = "none";
          }
      });
    }

    // --- LÓGICA PARA CARREGAR CLIENTES DO BACKEND ---
    async function carregarClientes() {
        const tbodyClientes = document.querySelector('.clientes-table tbody'); // Seleciona o tbody da tabela de clientes
        const token = localStorage.getItem('token');

        if (!token) {
            console.warn("Token de autenticação não encontrado. Redirecionando para login.");
            alert("Você precisa estar logado para visualizar os clientes.");
            window.location.href = "index.html"; // Redireciona para login
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/clientes", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Inclui o token para autenticação
                }
            });

            const data = await response.json();

            if (response.ok) {
                // Limpa a tabela antes de adicionar os novos dados
                tbodyClientes.innerHTML = ''; 
                
                const clientes = Array.isArray(data) ? data : data.clientes; 

                if (!clientes || clientes.length === 0) {
                    tbodyClientes.innerHTML = '<tr><td colspan="4">Nenhum cliente cadastrado.</td></tr>';
                    return;
                }

                clientes.forEach(cliente => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cliente.nome_Usuario}</td>
                        <td>${cliente.email_Usuario}</td>
                        <td>${cliente.telefone_Usuario || 'N/A'}</td> <td>${cliente.reservas_ativas !== undefined ? cliente.reservas_ativas : 'N/A'}</td> `;
                    tbodyClientes.appendChild(tr);
                });

            } else {
                console.error("Erro ao carregar clientes:", data.message || "Erro desconhecido");
                if (modalErroCarregamentoClientes) {
                    modalErroCarregamentoClientes.querySelector('.carregamento-clientes-msg').textContent = data.message || "Erro ao carregar os clientes!";
                    modalErroCarregamentoClientes.querySelector('.mensagem-clientes-ajuda').textContent = "Tente novamente!";
                    modalErroCarregamentoClientes.style.display = "flex";
                } else {
                    alert(data.message || "Erro ao carregar clientes.");
                }
            }
        } catch (error) {
            console.error("Erro na requisição para carregar clientes:", error);
            if (modalErroCarregamentoClientes) {
                modalErroCarregamentoClientes.querySelector('.carregamento-clientes-msg').textContent = "Erro de conexão!";
                modalErroCarregamentoClientes.querySelector('.mensagem-clientes-ajuda').textContent = "Verifique o servidor ou sua internet.";
                modalErroCarregamentoClientes.style.display = "flex";
            } else {
                alert("Erro ao carregar clientes. Verifique sua conexão ou tente mais tarde.");
            }
        }
    }

    // Chama a função para carregar clientes quando a página é carregada
    carregarClientes();

});