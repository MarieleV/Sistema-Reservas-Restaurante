-- Configurações iniciais
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Criação do schema
CREATE SCHEMA IF NOT EXISTS `db_restaurante_reserva` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `db_restaurante_reserva`;

-- Tabela de Usuário (com campo 'telefone')
CREATE TABLE IF NOT EXISTS `Usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome_Usuario` VARCHAR(100) NOT NULL,
  `cpf_Usuario` CHAR(11) NOT NULL UNIQUE,
  `email_Usuario` VARCHAR(100) NOT NULL UNIQUE,
  `telefone_Usuario` VARCHAR(20),
  `senha_Usuario` VARCHAR(255) NOT NULL, -- deve ser hash
  `datacadastro_Usuario` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- Tabela de Cliente (vinculado a um usuário)
CREATE TABLE IF NOT EXISTS `Cliente` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_Usuario` INT NOT NULL,
  `datacadastro_Cliente` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuario_cliente` (`id_Usuario`),
  CONSTRAINT `fk_usuario_cliente`
    FOREIGN KEY (`id_Usuario`)
    REFERENCES `Usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Tabela de Administrador (vinculado a um usuário)
CREATE TABLE IF NOT EXISTS `Administrador` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_Usuario` INT NOT NULL,
  `cargo_Adm` VARCHAR(50) NOT NULL,
  `datacadastro_Adm` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuario_admin` (`id_Usuario`),
  CONSTRAINT `fk_usuario_admin`
    FOREIGN KEY (`id_Usuario`)
    REFERENCES `Usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Tabela de Reserva
CREATE TABLE IF NOT EXISTS `Reserva` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `Cliente_id` INT NOT NULL,
  `numeropessoas_Reserva` INT NOT NULL CHECK (`numeropessoas_Reserva` > 0),
  `data_Reserva` DATETIME NOT NULL,
  `status_Reserva` ENUM('pendente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendente',
  `datacadastro_Reserva` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_cliente_reserva` (`Cliente_id`),
  CONSTRAINT `fk_reserva_cliente`
    FOREIGN KEY (`Cliente_id`)
    REFERENCES `Cliente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Restaurar configurações
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
