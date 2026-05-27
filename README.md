# Sistema de Autenticação Segura #

## Descrição do Projeto

Este projeto implementa um sistema de autenticação web com **hash parcial** e **validação progressiva**, conforme os requisitos da atividade avaliativa de Segurança de Banco de Dados. O sistema utiliza:

- **Frontend**: HTML5, JavaScript (com Web Crypto API para SHA-256)
- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL com TRIGGERS para armazenamento de hash parcial

## Arquitetura do Sistema

### Fluxo de Autenticação

1. **Validação Progressiva do Email**:
   - Ao perder o foco, o frontend envia uma requisição ao backend
   - O backend verifica se o usuário existe no banco de dados
   - Se existe, retorna o fragmento do hash armazenado (17 caracteres)
   - Se não existe, exibe mensagem "Usuário não conhecido"

2. **Validação Progressiva da Senha**:
   - Ao perder o foco, o frontend concatena a matrícula com a senha digitada
   - Gera localmente um hash SHA-256 dessa concatenação
   - Verifica se o fragmento armazenado está contido no hash gerado
   - Se sim, habilita o botão "Entrar"
   - Se não, exibe mensagem "Senha incorreta"

3. **Login**:
   - O frontend envia o email e o hash completo ao backend
   - O backend verifica se o fragmento armazenado está contido no hash completo
   - Se sim, login bem-sucedido
   - Se não, login falha

4. **Cadastro**:
   - O usuário preenche nome, email e senha
   - O frontend concatena a matrícula com a senha
   - Gera o hash SHA-256 localmente
   - Envia o hash completo ao backend
   - O backend insere o usuário no banco de dados
   - A TRIGGER extrai 17 caracteres do hash e armazena

## Configuração do Ambiente

### Pré-requisitos

- Node.js 14+ (recomendado v22.13.0)
- MySQL 8.0+
- npm ou yarn

### Instalação de Dependências

```bash
cd /home/ubuntu/seguranca
npm install
```

### Configuração do Banco de Dados

1. **Criar o banco de dados e tabelas**:

```bash
mysql -u root -p < app.sql
```

Ou, se estiver usando Docker:

```bash
docker exec -i mysql-db mysql -u root -pmy-secret-pw < app.sql
```

2. **Verificar a criação das tabelas**:

```bash
mysql -u root -p uscs_news -e "SHOW TABLES;"
mysql -u root -p uscs_news -e "DESCRIBE tb_usuarios;"
mysql -u root -p uscs_news -e "SHOW TRIGGERS;"
```

### Configuração do Backend

O arquivo `db.js` contém as configurações de conexão com o MySQL:

```javascript
const pool = mysql.createPool({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: 'my-secret-pw',
	database: 'uscs_news',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
```

Se você estiver usando credenciais diferentes, atualize este arquivo.

### Configuração do Frontend

O arquivo `seguranca.html` contém a constante de matrícula:

```javascript
const MATRICULA = '818174-7';
const API_URL = 'http://localhost:3000';
```

A matrícula é usada para concatenar com a senha e gerar o hash SHA-256.

## Executando o Projeto

### 1. Iniciar o Backend

```bash
cd /home/ubuntu/seguranca
node app.js
```

O servidor iniciará em `http://localhost:3000`.

### 2. Abrir o Frontend

Abra o arquivo `seguranca.html` em um navegador web:

```bash
# Opção 1: Abrir diretamente
open seguranca.html

# Opção 2: Usar um servidor HTTP simples
python3 -m http.server 8000
# Depois acesse http://localhost:8000/seguranca.html
```

## Endpoints da API

### 1. POST /api/auth/check-email

**Descrição**: Verifica se o usuário existe e retorna o fragmento do hash armazenado.

**Parâmetros**:
```json
{
	"email": "usuario@email.com"
}
```

**Resposta (Sucesso)**:
```json
{
	"existe": true,
	"fragmentoHash": "a1b2c3d4e5f6g7h8i"
}
```

**Resposta (Usuário não existe)**:
```json
{
	"existe": false,
	"fragmentoHash": null
}
```

### 2. POST /api/auth/login

**Descrição**: Realiza o login verificando se o hash completo contém o fragmento armazenado.

**Parâmetros**:
```json
{
	"email": "usuario@email.com",
	"hashCompleto": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0"
}
```

**Resposta (Sucesso)**:
```json
{
	"sucesso": true,
	"mensagem": "Login realizado com sucesso"
}
```

**Resposta (Falha)**:
```json
{
	"sucesso": false,
	"mensagem": "Senha incorreta"
}
```

### 3. POST /api/auth/register

**Descrição**: Cadastra um novo usuário com o hash da senha.

**Parâmetros**:
```json
{
	"nome": "João Silva",
	"email": "joao@email.com",
	"hashCompleto": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0"
}
```

**Resposta (Sucesso)**:
```json
{
	"sucesso": true,
	"mensagem": "Usuário cadastrado com sucesso"
}
```

**Resposta (Falha)**:
```json
{
	"sucesso": false,
	"mensagem": "Email já cadastrado"
}
```

## Estrutura do Banco de Dados

### Tabela: tb_usuarios

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id_usuario | INT | Identificador único (AUTO_INCREMENT) |
| nome | VARCHAR(100) | Nome do usuário |
| email | VARCHAR(150) | Email do usuário (UNIQUE) |
| senha | VARCHAR(17) | Fragmento do hash (17 caracteres) |

### TRIGGERS

#### tr_usuarios_insert

Intercepta operações de INSERT e extrai 17 caracteres do hash a partir de uma posição aleatória entre 1 e 14.

```sql
CREATE TRIGGER tr_usuarios_insert BEFORE INSERT ON tb_usuarios
FOR EACH ROW
BEGIN
	SET NEW.senha = SUBSTRING(NEW.senha, FLOOR(1 + (RAND() * 14)), 17);
END
```

#### tr_usuarios_update

Intercepta operações de UPDATE e aplica a mesma lógica.

```sql
CREATE TRIGGER tr_usuarios_update BEFORE UPDATE ON tb_usuarios
FOR EACH ROW
BEGIN
	SET NEW.senha = SUBSTRING(NEW.senha, FLOOR(1 + (RAND() * 14)), 17);
END
```

## Fluxo de Geração de Hash

### No Frontend

1. Concatena a matrícula com a senha: `"818174-7" + "senha123"` = `"818174-7senha123"`
2. Gera o hash SHA-256 localmente usando a Web Crypto API
3. Resultado: `hash_completo` (64 caracteres hexadecimais)

### No Backend

1. Recebe o hash completo do frontend
2. Verifica se o fragmento armazenado está contido no hash completo
3. Se sim, autenticação bem-sucedida

### No Banco de Dados

1. Recebe o hash completo via INSERT
2. A TRIGGER extrai 17 caracteres a partir de uma posição aleatória entre 1 e 14
3. Armazena apenas o fragmento (17 caracteres)

## Segurança

**Nota**: Este é um modelo **didático** e não deve ser usado em produção. O projeto foi desenvolvido para fins educacionais e não implementa proteções contra:

- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- SQL Injection
- HTTPS/TLS
- Rate Limiting
- Proteção contra força bruta

Para um sistema de produção, seria necessário implementar essas proteções e usar bibliotecas especializadas como bcrypt ou Argon2.

## Testando o Sistema

### Teste 1: Cadastro de Novo Usuário

1. Clique em "Me cadastrar"
2. Preencha os campos:
   - Nome: "João Silva"
   - Email: "joao@email.com"
   - Senha: "senha123"
   - Confirmar Senha: "senha123"
3. Clique em "Cadastrar"
4. Você deve ver a mensagem "Cadastro realizado com sucesso!"

### Teste 2: Login com Usuário Cadastrado

1. Digite o email: "joao@email.com"
2. Pressione TAB ou clique fora do campo
3. Você deve ver "Usuário encontrado"
4. Digite a senha: "senha123"
5. Pressione TAB ou clique fora do campo
6. Você deve ver "Senha válida" e o botão "Entrar" deve estar habilitado
7. Clique em "Entrar"
8. Você deve ver "Login realizado com sucesso!"

### Teste 3: Login com Senha Incorreta

1. Digite o email: "joao@email.com"
2. Pressione TAB
3. Digite uma senha incorreta: "senhaErrada"
4. Pressione TAB
5. Você deve ver "Senha incorreta" e o botão "Entrar" deve estar desabilitado

## Troubleshooting

### Erro: "Cannot find module 'express'"

**Solução**: Execute `npm install` no diretório do projeto.

### Erro: "connect ECONNREFUSED 127.0.0.1:3306"

**Solução**: Certifique-se de que o MySQL está rodando. Se estiver usando Docker:

```bash
sudo docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql/mysql-server:8.0
```

### Erro: "Access denied for user 'root'@'localhost'"

**Solução**: Verifique as credenciais em `db.js` e certifique-se de que estão corretas.

### Erro: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Solução**: O backend já possui CORS configurado. Certifique-se de que o backend está rodando em `http://localhost:3000`.

## Arquivos do Projeto

```
/home/ubuntu/seguranca/
├── app.js              # Backend (Express)
├── db.js               # Configuração do banco de dados
├── app.sql             # Script SQL para criar banco de dados e tabelas
├── seguranca.html      # Frontend (HTML, CSS, JavaScript)
├── package.json        # Dependências do Node.js
├── node_modules/       # Módulos instalados
└── README.md           # Este arquivo
```

## Dependências

- **express**: Framework web para Node.js
- **mysql2**: Driver MySQL para Node.js

## Autor

Desenvolvido como atividade avaliativa de Segurança de Banco de Dados.

**Matrícula**: 818174-7

## Licença

Este projeto é fornecido como material educacional.

---

**Última atualização**: 27 de maio de 2026
