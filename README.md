# Sistema de Autenticação Segura

Este é um projeto de autenticação web desenvolvido para a matéria de Segurança de Banco de Dados. Ele implementa um fluxo de validação progressiva com hash parcial e armazenamento seguro via Triggers no MySQL.

## Funcionalidades

- **Validação Progressiva**: Verifica a existência do usuário e valida a senha localmente antes do login;
- **Hash Parcial**: Armazena apenas um fragmento aleatório de 17 caracteres do hash no banco de dados;
- **Segurança Local**: Geração de hash SHA-256 no frontend utilizando a matrícula do aluno como sal;
- **Interface Moderna**: Layout responsivo com alternância entre login e cadastro.

## Tecnologias Utilizadas

- **HTML & CSS**: Estrutura e estilização moderna com Bootstrap 5;
- **JavaScript**: Lógica de validação progressiva e integração com Web Crypto API;
- **Node.js & Express**: Servidor backend para processamento de rotas;
- **MySQL**: Banco de dados com implementação de Triggers para fragmentação de hash.

## Como Usar

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/projeto-seguranca.git

2. **Configure o Bancos de Dados** <br>
   I. Importe o arquivo app.sql no seu servidor MySQL para criar as tabelas e triggers. 
  
3. **Instale as dependências**
   ```bash
   npm install

4. **Inicie o servidor**
   ```bash
   node app.js

5. **Acesse o sistema** <br>
   I. Abra o arquivo seguranca.html em seu navegador.
