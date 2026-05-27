# Quick Start - Sistema de Autenticação

Guia rápido para iniciar o projeto em menos de 5 minutos.

## Pré-requisitos

- Node.js instalado (v14+)
- MySQL instalado e rodando
- Navegador web moderno

## Passo 1: Configurar o Banco de Dados

### Opção A: MySQL Local

```bash
# Importar o script SQL
mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql
```

### Opção B: Docker

```bash
# Executar MySQL em container
docker run --name mysql-db -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql/mysql-server:8.0

# Aguardar alguns segundos e importar o script
sleep 10
docker exec -i mysql-db mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql
```

## Passo 2: Instalar Dependências

```bash
cd /home/ubuntu/seguranca
npm install
```

## Passo 3: Iniciar o Backend

```bash
node app.js
```

Você deve ver:
```
Servidor rodando em http://localhost:3000
Endpoints disponíveis:
  POST /api/auth/check-email - Verifica se o usuário existe
  POST /api/auth/login - Realiza o login
  POST /api/auth/register - Cadastra um novo usuário
  POST /posts - Retorna todos os posts
```

## Passo 4: Abrir o Frontend

Em outro terminal, abra o arquivo `seguranca.html`:

```bash
# Opção 1: Abrir diretamente (Linux/Mac)
open /home/ubuntu/seguranca/seguranca.html

# Opção 2: Usar Python para servir
cd /home/ubuntu/seguranca
python3 -m http.server 8000
# Depois acesse http://localhost:8000/seguranca.html
```

## Passo 5: Testar o Sistema

### Teste 1: Login com Usuário Pré-existente

1. Email: `john.hammond@fakemail.com`
2. Senha: `123456`
3. Clique em "Entrar"

### Teste 2: Cadastro de Novo Usuário

1. Clique em "Me cadastrar"
2. Preencha os campos:
   - Nome: `Seu Nome`
   - Email: `seu@email.com`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
3. Clique em "Cadastrar"

### Teste 3: Login com Novo Usuário

1. Email: `seu@email.com`
2. Senha: `senha123`
3. Clique em "Entrar"

## Estrutura do Projeto

```
/home/ubuntu/seguranca/
├── app.js              # Backend (Express)
├── db.js               # Configuração do banco de dados
├── app.sql             # Script SQL
├── seguranca.html      # Frontend (HTML, CSS, JavaScript)
├── package.json        # Dependências
├── README.md           # Documentação completa
├── SETUP_MYSQL.md      # Guia de configuração do MySQL
├── TESTING.md          # Guia de testes
└── QUICKSTART.md       # Este arquivo
```

## Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/check-email` | Verifica se o usuário existe |
| POST | `/api/auth/login` | Realiza o login |
| POST | `/api/auth/register` | Cadastra novo usuário |
| POST | `/posts` | Retorna todos os posts |

## Matrícula Configurada

- **Matrícula**: `818174-7`
- **Localização**: Constante `MATRICULA` em `seguranca.html`

## Troubleshooting Rápido

| Problema | Solução |
|----------|---------|
| "Cannot find module 'express'" | Execute `npm install` |
| "connect ECONNREFUSED 127.0.0.1:3306" | Inicie o MySQL |
| "CORS policy error" | Certifique-se que o backend está em `http://localhost:3000` |
| "Usuário não conhecido" | Verifique se o email está correto |
| "Senha incorreta" | Verifique a senha (case-sensitive) |

## Próximos Passos

- Consulte `README.md` para documentação completa
- Consulte `TESTING.md` para guia de testes detalhado
- Consulte `SETUP_MYSQL.md` para configuração avançada do MySQL

---

**Última atualização**: 27 de maio de 2026
