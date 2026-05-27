-- Criação do banco de dados e tabela de usuários
CREATE DATABASE IF NOT EXISTS uscs_news;
USE uscs_news;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS tb_usuarios (
	id_usuario INT NOT NULL AUTO_INCREMENT,
	nome VARCHAR(100) NOT NULL,
	email VARCHAR(150) NOT NULL UNIQUE,
	senha VARCHAR(17) NOT NULL,
	PRIMARY KEY (id_usuario)
);

-- Trigger para interceptar INSERT e armazenar apenas um fragmento de 17 caracteres do hash
DELIMITER //
CREATE TRIGGER tr_usuarios_insert BEFORE INSERT ON tb_usuarios
FOR EACH ROW
BEGIN
	-- Extrai 17 caracteres a partir de uma posição aleatória entre 1 e 14 do hash recebido
	SET NEW.senha = SUBSTRING(NEW.senha, FLOOR(1 + (RAND() * 14)), 17);
END//
DELIMITER ;

-- Trigger para interceptar UPDATE e aplicar a mesma lógica
DELIMITER //
CREATE TRIGGER tr_usuarios_update BEFORE UPDATE ON tb_usuarios
FOR EACH ROW
BEGIN
	-- Extrai 17 caracteres a partir de uma posição aleatória entre 1 e 14 do hash recebido
	SET NEW.senha = SUBSTRING(NEW.senha, FLOOR(1 + (RAND() * 14)), 17);
END//
DELIMITER ;

-- Tabela de posts (mantida para compatibilidade com o código modelo)
CREATE TABLE IF NOT EXISTS tb_posts (
	idNoticias INT NOT NULL AUTO_INCREMENT,
	titulo VARCHAR(100) NOT NULL,
	conteudo VARCHAR(255) NOT NULL,
	id_usuario INT NOT NULL,
	PRIMARY KEY (idNoticias),
	CONSTRAINT fk_Noticias_tb_usuarios FOREIGN KEY (id_usuario) REFERENCES tb_usuarios (id_usuario)
);

-- Dados de exemplo
INSERT INTO tb_usuarios (nome, email, senha) VALUES 
('John Hammond', 'john.hammond@fakemail.com', 'hash_completo_exemplo_123456789012345'),
('Antoine Vastel', 'antoine.vasteld@fakemail.com', 'hash_completo_exemplo_abcdefghijklmno'),
('Bill Rucker', 'bill.rucker@fakemail.com', 'hash_completo_exemplo_zyxwvutsrqponml'),
('Ravi Itha', 'ravi.itha@fakemail.com', 'hash_completo_exemplo_qwertyuiopasdfgh');

INSERT INTO tb_posts (titulo, conteudo, id_usuario) VALUES
('A ascensão do hacking automotivo', 'Veículos modernos utilizam softwares e conectividade para controle de funções como motor e sistemas de segurança. Tecnologias como Bluetooth e Wi-Fi também ampliam os riscos de ataques.', 1),
('O potencial da Inteligência Artificial', 'A Inteligência Artificial tem transformado a cibersegurança com automação e detecção de ameaças. Ao mesmo tempo, também pode ser usada no desenvolvimento de ataques mais sofisticados.', 3),
('Dispositivos móveis como novo alvo', 'O aumento de ataques a dispositivos móveis tornou smartphones alvos frequentes. Aplicativos bancários, mensagens e dados pessoais exigem cada vez mais atenção em segurança digital.', 1);
