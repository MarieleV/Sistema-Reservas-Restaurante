-- Criação das Tabelas no PostgreSQL (Supabase)

CREATE TABLE Usuario (
  id SERIAL PRIMARY KEY,
  nome_Usuario VARCHAR(100) NOT NULL,
  cpf_Usuario CHAR(11) NOT NULL UNIQUE,
  email_Usuario VARCHAR(100) NOT NULL UNIQUE,
  telefone_Usuario VARCHAR(20),
  senha_Usuario VARCHAR(255) NOT NULL,
  datacadastro_Usuario TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cliente (
  id SERIAL PRIMARY KEY,
  id_Usuario INT NOT NULL,
  datacadastro_Cliente TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_cliente FOREIGN KEY (id_Usuario) REFERENCES Usuario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Administrador (
  id SERIAL PRIMARY KEY,
  id_Usuario INT NOT NULL,
  cargo_Adm VARCHAR(50) NOT NULL,
  datacadastro_Adm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuario_admin FOREIGN KEY (id_Usuario) REFERENCES Usuario (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Reserva (
  id SERIAL PRIMARY KEY,
  Cliente_id INT NOT NULL,
  numeropessoas_Reserva INT NOT NULL CHECK (numeropessoas_Reserva > 0),
  data_Reserva TIMESTAMP NOT NULL,
  -- Substituindo o ENUM por um CHECK constraint (mais fácil de manter no Postgres)
  status_Reserva VARCHAR(20) CHECK (status_Reserva IN ('pendente', 'confirmada', 'cancelada')) DEFAULT 'pendente',
  datacadastro_Reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reserva_cliente FOREIGN KEY (Cliente_id) REFERENCES Cliente (id) ON DELETE CASCADE ON UPDATE CASCADE
);