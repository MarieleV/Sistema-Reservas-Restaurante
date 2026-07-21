/*document.getElementById("btnEntrar").addEventListener("click", function() {
    // Pegando os valores digitados
    let email = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    // Definindo um usuário fixo para simular um login correto
    let emailCorreto = "teste@email.com";
    let senhaCorreta = "123456";

    if (email === emailCorreto && senha === senhaCorreta) {
        // Se o login estiver correto, redireciona para outra página
        window.location.href = "painel.html"; // Substitui "painel.html" pela sua página
    } else {
        // Se o login estiver errado, mostra o erro
        document.getElementById("modalErro").style.display = "flex";
    }
});

// Fecha o modal ao clicar no botão "ok"
document.getElementById("btnFecharErro").addEventListener("click", function() {
    document.getElementById("modalErro").style.display = "none";
});


document.addEventListener("DOMContentLoaded", function () {
    const btnEntrar = document.getElementById("btnEntrar");

    btnEntrar.addEventListener("click", function () {
        // Pegando valores dos inputs
        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        // Simulação de um usuário válido (substituir por validação real depois)
        if (email === "admin@teste.com" && senha === "123456") {
            window.location.href = "painel.html"; // Redireciona para o painel
        } else {
            alert("Usuário ou senha incorretos!");
        }
    });
});
*/

/*
document.addEventListener("DOMContentLoaded", function () {
    const btnEntrar = document.getElementById("btnEntrar");

    if (btnEntrar) {
        btnEntrar.addEventListener("click", function () {
            // Pegando valores dos inputs
            const email = document.getElementById("email").value;
            const senha = document.getElementById("senha").value;

            // Simulação de um usuário válido
            if (email === "admin@teste.com" && senha === "123456") {
                window.location.href = "painel.html"; // Redireciona para o painel
            } else {
                // Exibir modal de erro, se existir
                const modalErro = document.getElementById("modalErro");
                if (modalErro) {
                    modalErro.style.display = "flex";
                } else {
                    alert("Usuário ou senha incorretos!");
                }
            }
        });
    }

    // Fecha o modal de erro ao clicar no botão "ok"
    const btnFecharErro = document.getElementById("btnFecharErro");
    if (btnFecharErro) {
        btnFecharErro.addEventListener("click", function () {
            document.getElementById("modalErro").style.display = "none";
        });
    }

    // modal 2
    const btnFecharErro2 = document.getElementById("btnFecharErro2");
    if(btnFecharErro2){
        btnFecharErro2.addEventListener("click", function(){
            document.getElementById("modalErroCarregamento").style.display = "none";
        });
    }

    function abrirModalErroCarregamento() {
        const modal = document.getElementById("modalErroCarregamento");
        if (modal) {
            modal.style.display = "flex";
        } else {
            console.error("Modal de carregamento não encontrado!");
        }
    }
        

    setTimeout(abrirModalErroCarregamento, 1000); // abre o modal 1s depois do carregamento


    const formCadastro = document.querySelector("form");
    if(formCadastro){
        formCadastro.addEventListener("submit", function (e){
            e.preventDefault(); // impede o envio do formulário

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const telefone = document.getElementById("telefone").value.trim();
            const senha = document.getElementById("senha").value.trim();
            const confirmarSenha = document.getElementById("confirmar-senha").value.trim();

            if(!nome || !email || !telefone || !senha || !confirmarSenha){
                // Exibir modal de erro
                const modalErroCampos = document.getElementById("modalErroCampos");
                if(modalErroCampos){
                    modalErroCampos.style.display = "flex";
                }
                return; // para aqui
            }

            // se tudo estiver preenchido, redireciona
            window.location.href = "index.html";
        });
    }

    /*const btnFecharErroCadastro = document.getElementById("btnFecharErroCadastro");
    if(btnFecharErroCadastro){
        btnFecharErroCadastro.addEventListener("click", function(){
            document.getElementById("modalErroCampos").style.display = "none";
        });
    } */

    /*document.getElementById("modalErroCampos").style.display = "flex";*/
/*
    document.getElementById("btnFecharErroCadastro").addEventListener("click", () => {
        document.getElementById("modalErroCampos").style.display = "none"; 
    });




    // modal Carregamento Cadastro
    const btnFecharErroCadastro2 = document.getElementById("btnFecharErroCadastro2");
    if(btnFecharErroCadastro2){
        btnFecharErroCadastro2.addEventListener("click", function(){
            document.getElementById("modalErroCarregamentoCadastro").style.display = "none";
        });
    }
    
    function abrirModalErroCarregamentoCadastro() {
        const modal = document.getElementById("modalErroCarregamentoCadastro");
        if (modal) {
            modal.style.display = "flex";
        } else {
            console.error("Modal de carregamento não encontrado!");
        }
    }
            
    
    setTimeout(abrirModalErroCarregamentoCadastro, 1000); // abre o modal 1s depois do carregamento

    document.getElementById("btnFecharErroCarregamentoCadastro").addEventListener("click", () => {
        document.getElementById("modalErroCarregamentoCadastro").style.display = "none"; 
    });


/*
    lucide.createIcons();



    const hojeReservas = document.getElementById('painel-reservas-hoje');
    const proximasReservas = document.getElementById('painel-reservas-proximas');

    const reservasHoje = [
        { nome: 'Maria', data: '06/04', hora: '12:00', pessoas: 2, status: 'Confirmada'}, 
        { nome: 'João', data: '06/04', hora: '13:00', pessoas: 4, status: 'Cancelada'}
    ]; 

    const reservasFuturas = [
        { nome: 'Ana', data: '07/04', hora: '14:00', pessoas: 3}, 
        { nome: 'Carlos', data: '08/04', hora: '19:00', pessoas: 2}, 
        { nome: 'Fernanda', data: '09/04', hora: '20:30', pessoas: 5}
    ];

    function carregarReservas(){
        reservasHoje.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${r.nome}</td>
            <td>${r.data}</td>
            <td>${r.hora}</td>
            <td>${r.pessoas}</td>
            <td class="${r.status === 'Cancelada' ? 'painel-status-cancelada' : 'painel-status-confirmada'}">${r.status}</td>
            <td><button class="painel-btn-cancelar">Cancelar Reserva</button></td>
            `;
            hojeReservas.appendChild(tr);
        }); 

        reservasFuturas.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
            <td>${r.nome}</td>
            <td>${r.data}</td>
            <td>${r.hora}</td>
            <td>${r.pessoas}</td>
            <td>
            <button class="painel-btn-confirmar">Confirmar Reserva</button>
            <button class="painel-btn-cancelar">Cancelar Reserva</button>
            </td>
            `;
            proximasReservas.appendChild(tr);
        });
    }

    carregarReservas();

    document.addEventListener('click', (e) => {
        if(e.target.classList.contains('painel-btn-cancelar')){
            const row = e.target.closest('tr');
            row.remove();
        }

        if(e.target.classList.contains('painel-btn-confirmar')){
            const row = e.target.closest('tr');
            const tdStatus = document.createElement('td');
            tdStatus.textContent = 'Confirmada';
            tdStatus.classList.add('painel-status-confirmada');
            row.replaceChild(tdStatus, row.Children[4]);
            e.target.remove(); // tira o botão de confirmar
        }
    }); */

  /*  
    const reservasHoje = [
        { nome: 'João Silva', data: '07/04/2025', hora: '12:00', pessoas: 3 },
        { nome: 'Maria Costa', data: '07/04/2025', hora: '13:00', pessoas: 2 },
        { nome: 'Carlos Souza', data: '07/04/2025', hora: '14:00', pessoas: 4 },
      ];
      
      const reservasFuturas = [
        { nome: 'Ana Paula', data: '08/04/2025', hora: '12:00', pessoas: 2 },
        { nome: 'Roberto Lima', data: '09/04/2025', hora: '15:00', pessoas: 6 },
      ];
      
      const hojeTbody = document.getElementById('painel-adm-hoje');
      const futurasTbody = document.getElementById('painel-adm-futuras');
      
      reservasHoje.forEach(reserva => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${reserva.nome}</td>
          <td>${reserva.data}</td>
          <td>${reserva.hora}</td>
          <td>${reserva.pessoas}</td>
          <td>Confirmada</td>
          <td><button class="btn-cancelar">Cancelar Reserva</button></td>
        `;
        hojeTbody.appendChild(tr);
      });
      
      reservasFuturas.forEach(reserva => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${reserva.nome}</td>
          <td>${reserva.data}</td>
          <td>${reserva.hora}</td>
          <td>${reserva.pessoas}</td>
          <td>
            <button class="btn-confirmar">Confirmar Reserva</button>
            <button class="btn-cancelar">Cancelar Reserva</button>
          </td>
        `;
        futurasTbody.appendChild(tr);
      });

      <script>
        const botoesAbas = document.querySelectorAll(".aba");
        const abaDia = document.getElementById("aba-dia");
        const abaProximos = document.getElementById("aba-proximos");

        botoesAbas.forEach(botao => {
            botao.addEventListener("click", () => {
                botoesAbas.forEach(b => b.classList.remove("ativa"));
                botao.classList.add("ativa");

                if(botao.dataset.aba === "dia"){
                    abaDia.style.display = "block";
                    abaProximos.style.display = "none";
                }else{
                    abaDia.style.display = "none";
                    abaProximos.style.display = "block";
                }
            });
        });
      </script>
      
});




*/