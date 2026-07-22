<div align="center">

# 🍽️ Sistema de Reserva de Restaurante

### Plataforma web para gestão de reservas de mesas

<p>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

<p>
  <img src="https://img.shields.io/badge/arquitetura-monolítica-blue?style=flat-square" alt="arquitetura monolítica" />
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=flat-square" alt="status" />
</p>

</div>

---

<div align="center">

### 🧭 Sumário

 [Funcionalidades Principais](#-funcionalidades-principais) • [Requisitos Funcionais](#-requisitos-funcionais-rf) • [Requisitos Não Funcionais](#-requisitos-não-funcionais-rnf) • [Arquitetura](#-arquitetura) • [Tecnologias](#-principais-tecnologias)

</div>

---
<div align="center">
Sistema que permite que os clientes do restaurante realizem reservas de mesas de maneira online, e que a administração do restaurante gerencie as reservas, controlando os horários e a disponibilidade.
</div>  

## ✨ Funcionalidades Principais

| Módulo | Descrição |
|:---:|---|
| **CRUD de Clientes** | Cadastro de clientes (nome, e-mail, telefone, senha), edição e exclusão de cadastro, listagem dos clientes cadastrados. |
| **CRUD de Reservas** | Criação de reserva (data, horário, número de pessoas), edição e exclusão de reservas, listagem das reservas ativas. |
| **Transação** | Cliente e restaurante podem confirmar uma reserva, garantindo a disponibilização da mesa; ambos também podem cancelar uma reserva, liberando a mesa para novas reservas. |


## ✅ Requisitos Funcionais (RF)

| ID | Descrição |
|:---:|---|
| **RF001** | O sistema deve permitir o cadastro de novos clientes com informações como nome, e-mail, telefone e CPF. |
| **RF002** | O sistema deve permitir que os clientes editem e excluam os seus cadastros. |
| **RF003** | O sistema deve permitir a visualização da lista de clientes cadastrados pelos administradores. |
| **RF004** | O sistema deve permitir que os clientes realizem reservas informando data, número de pessoas e horário. |
| **RF005** | O sistema deve permitir a edição ou cancelamento de reservas. |
| **RF006** | O sistema deve exibir uma lista das reservas ativas para os administradores. |
| **RF007** | O sistema deve permitir a confirmação de reservas. |
| **RF008** | O sistema deve permitir que o cliente visualize o status da sua reserva (pendente, confirmada, cancelada). |

## 🔒 Requisitos Não Funcionais (RNF)

| ID | Descrição |
|:---:|---|
| **RNF001** | O sistema deve utilizar um banco de dados para armazenar informações de clientes, reservas e disponibilidade de mesas. |
| **RNF002** | O tempo de resposta do sistema deve ser inferior a 10 segundos. |
| **RNF003** | O sistema deve permitir, no mínimo, 30 reservas simultâneas sem perda de desempenho. |
| **RNF004** | O sistema deve ter autenticação segura para clientes e administração, com e-mail e senha. |
| **RNF005** | O sistema deve permitir reservas apenas no horário de funcionamento do restaurante. |
| **RNF006** | As senhas dos usuários devem ser armazenadas de forma segura. |
| **RNF007** | O sistema deve apresentar mensagens de erro claras e compreensíveis. |
| **RNF008** | O sistema deve estar disponível a maior parte do tempo. |
| **RNF009** | O sistema deve limitar o número de reservas simultâneas conforme a capacidade total de mesas do restaurante. |
| **RNF010** | O sistema deve impedir reservas duplicadas para o mesmo cliente. |

## 🏗️ Arquitetura

**Tipo:** Monolítica

O sistema será projetado já com **separação lógica clara entre módulos** (autenticação, cliente, reserva, administração), o que facilitará uma eventual migração futura para microsserviços, caso necessário.

A transição de um arquivo único para um Monolito Modular (separação lógica baseada em domínios) é o movimento mais inteligente que você pode fazer agora. Isso não apenas limpa o seu código atual, mas cria fronteiras claras: se amanhã você quiser transformar a "Reserva" em um microsserviço ou micro-frontend isolado, a lógica já estará encapsulada.

### A Arquitetura Proposta: Feature-Sliced / Monolito Modular

A ideia central é criar uma pasta para cada domínio de negócio ("futuros microsserviços") e uma pasta para coisas globais que todos podem usar.
Estruturação do front-end/src

```bash
front-end/src/
├── shared/                 # 1. Tudo que é genérico e reaproveitável (compartilhado)
│   ├── components/         # Button, Label, Input, StatusBadge, NavBar, Tabs
│   ├── utils/              # formatDate, todayStr, load (localStorage)
│   └── types/              # (Opcional) Tipos globais que cruzam domínios
│
├── modules/                # 2. A separação lógica (Seus domínios)
│   ├── auth/               # ➔ Domínio de Autenticação
│   │   ├── pages/          # LandingPage.tsx, RegisterPage.tsx
│   │   └── hooks/          # useAuth.ts (lógica de login/registro)
│   │
│   ├── client/             # ➔ Domínio do Cliente
│   │   ├── components/     # Formulário de edição de perfil (isolado)
│   │   └── pages/          # ClientDashboard.tsx
│   │
│   ├── reservation/        # ➔ Domínio de Reservas
│   │   ├── components/     # ReservationCard.tsx
│   │   ├── pages/          # ReservationFormPage.tsx
│   │   └── types/          # Reservation, ReservationStatus
│   │
│   └── admin/              # ➔ Domínio de Administração
│       └── pages/          # AdminDashboard.tsx
│
├── routes/                 # 3. Orquestração das telas
│   └── AppRoutes.tsx       # Configuração do React Router Dom
│
├── App.tsx                 # 4. Ponto de entrada limpo (Apenas provedores)
├── main.tsx                
└── index.css
```

```bash
back-end/
├── src/
│   ├── config/              (Banco de dados, variáveis de ambiente)
│   ├── middlewares/         (Middlewares globais: erro, auth)
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── modules/             (Aqui entra a mágica!)
│   │   ├── auth/
│   │   │   ├── authController.js
│   │   │   └── authRoutes.js
│   │   │
│   │   ├── clientes/
│   │   │   ├── clienteController.js
│   │   │   ├── clienteModel.js
│   │   │   └── clienteRoutes.js
│   │   │
│   │   ├── reservas/
│   │   │   ├── reservaController.js
│   │   │   ├── reservaModel.js
│   │   │   └── reservaRoutes.js
│   │   │
│   │   └── usuarios/        (Admin)
│   │       ├── usuarioController.js
│   │       ├── usuarioModel.js
│   │       └── usuarioRoutes.js
│   │
│   └── app.js               (Apenas inicialização e injeção de rotas)
│
├── .github/workflows/       (padrão do Github)
│   └── sonarcloud.yml
├── package.json
└── package-lock.json
```
## 🛠️ Principais Tecnologias

<div align="center">

| Camada | Tecnologia | Justificativa |
|:---:|:---:|---|
| **Front-End** | JavaScript | Base para construção da interface consumida pelos clientes e administradores. |
| **Back-End** | Node.js + Express.js | O Node oferece um ambiente leve e eficiente para aplicações com múltiplas requisições simultâneas, como um sistema de reservas. O Express adiciona uma camada de estrutura, permitindo organização mais clara de rotas e lógica de negócio. |
| **Banco de Dados** | MySQL | Ampla documentação, forte suporte por ferramentas de desenvolvimento e reconhecida estabilidade. |
| **Autenticação** | JWT (JSON Web Token) | Permite autenticação sem necessidade de manter sessões ativas no servidor, contribuindo para a escalabilidade do sistema. |

</div>
