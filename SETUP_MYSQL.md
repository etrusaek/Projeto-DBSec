# Guia de Configuração do MySQL

Este documento fornece instruções detalhadas para configurar o MySQL para o projeto de autenticação.

## Opção 1: MySQL Local (Linux/Ubuntu)

### Instalação

```bash
# Atualizar os repositórios
sudo apt-get update

# Instalar MySQL Server
sudo apt-get install -y mysql-server

# Iniciar o serviço MySQL
sudo systemctl start mysql

# Verificar se está rodando
sudo systemctl status mysql
```

### Configuração Inicial

```bash
# Executar o script de segurança
sudo mysql_secure_installation

# Conectar ao MySQL como root
mysql -u root -p
```

### Criar Usuário e Banco de Dados

```sql
-- Conectar como root
mysql -u root -p

-- Executar os comandos SQL
CREATE USER 'root'@'localhost' IDENTIFIED BY 'my-secret-pw';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### Importar o Script SQL

```bash
# Importar o arquivo app.sql
mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql

# Verificar se foi criado
mysql -u root -pmy-secret-pw -e "USE uscs_news; SHOW TABLES;"
```

---

## Opção 2: MySQL via Docker

### Pré-requisitos

- Docker instalado e rodando

### Executar MySQL em Container

```bash
# Executar o container MySQL
docker run --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -p 3306:3306 \
  -d mysql/mysql-server:8.0

# Verificar se o container está rodando
docker ps
```

### Aguardar o MySQL Iniciar

O MySQL pode levar alguns segundos para iniciar. Você pode verificar os logs:

```bash
docker logs mysql-db
```

Procure por uma mensagem como: `[Server] X Plugin 'mysql_native_password' will be used as the default authentication plugin.`

### Importar o Script SQL

```bash
# Copiar o arquivo para o container e executar
docker exec -i mysql-db mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql

# Verificar se foi criado
docker exec mysql-db mysql -u root -pmy-secret-pw -e "USE uscs_news; SHOW TABLES;"
```

### Conectar ao MySQL dentro do Container

```bash
# Acessar o MySQL interativamente
docker exec -it mysql-db mysql -u root -pmy-secret-pw

# Dentro do MySQL
USE uscs_news;
SHOW TABLES;
DESCRIBE tb_usuarios;
SHOW TRIGGERS;
EXIT;
```

---

## Opção 3: MySQL Online (Serviço em Nuvem)

Se você preferir usar um serviço MySQL em nuvem, você pode usar:

- **AWS RDS**: https://aws.amazon.com/rds/
- **Google Cloud SQL**: https://cloud.google.com/sql
- **DigitalOcean Managed Database**: https://www.digitalocean.com/products/managed-databases/
- **Heroku**: https://www.heroku.com/

### Passos Gerais

1. Crie uma conta no serviço escolhido
2. Crie uma instância MySQL
3. Obtenha as credenciais de conexão (host, user, password, port)
4. Atualize o arquivo `db.js` com as credenciais
5. Importe o script `app.sql` usando um cliente MySQL

### Exemplo com Credenciais Remotas

Se você estiver usando um MySQL remoto, atualize `db.js`:

```javascript
const pool = mysql.createPool({
	host: 'seu-host-remoto.com',
	port: 3306,
	user: 'seu-usuario',
	password: 'sua-senha',
	database: 'uscs_news',
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0
});
```

---

## Verificação da Instalação

### Verificar Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -pmy-secret-pw

# Dentro do MySQL
SHOW DATABASES;
USE uscs_news;
SHOW TABLES;
DESCRIBE tb_usuarios;
SELECT * FROM tb_usuarios;
SHOW TRIGGERS;
EXIT;
```

### Verificar Triggers

```sql
-- Verificar os triggers criados
SHOW TRIGGERS FROM uscs_news;

-- Ver o código do trigger
SHOW CREATE TRIGGER tr_usuarios_insert;
SHOW CREATE TRIGGER tr_usuarios_update;
```

---

## Testando a Inserção com Trigger

```sql
-- Conectar ao MySQL
mysql -u root -pmy-secret-pw uscs_news

-- Inserir um novo usuário (o trigger irá extrair o fragmento)
INSERT INTO tb_usuarios (nome, email, senha) VALUES 
('Teste User', 'teste@email.com', 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0');

-- Verificar o resultado (a senha será um fragmento de 17 caracteres)
SELECT * FROM tb_usuarios WHERE email = 'teste@email.com';

-- Você deve ver algo como:
-- | id_usuario | nome       | email              | senha            |
-- | 5          | Teste User | teste@email.com    | f6g7h8i9j0k1l2m3 |
```

---

## Solução de Problemas

### Erro: "Access denied for user 'root'@'localhost'"

**Solução**: Verifique a senha em `db.js` e certifique-se de que está correta.

```bash
# Testar a conexão
mysql -u root -pmy-secret-pw -e "SELECT 1;"
```

### Erro: "Can't connect to MySQL server on 'localhost' (111)"

**Solução**: Certifique-se de que o MySQL está rodando.

```bash
# Para MySQL local
sudo systemctl status mysql

# Para Docker
docker ps | grep mysql-db
```

### Erro: "Table 'uscs_news.tb_usuarios' doesn't exist"

**Solução**: Importe o arquivo `app.sql`.

```bash
# Para MySQL local
mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql

# Para Docker
docker exec -i mysql-db mysql -u root -pmy-secret-pw < /home/ubuntu/seguranca/app.sql
```

### Erro: "Trigger 'tr_usuarios_insert' already exists"

**Solução**: O trigger já foi criado. Você pode deletá-lo e recriá-lo:

```sql
DROP TRIGGER IF EXISTS tr_usuarios_insert;
DROP TRIGGER IF EXISTS tr_usuarios_update;

-- Depois, reimporte o arquivo app.sql
```

---

## Parar e Remover o Container Docker

```bash
# Parar o container
docker stop mysql-db

# Remover o container
docker rm mysql-db

# Remover a imagem (opcional)
docker rmi mysql/mysql-server:8.0
```

---

## Próximos Passos

Após configurar o MySQL, você pode:

1. Iniciar o backend: `node app.js`
2. Abrir o frontend: `seguranca.html`
3. Testar o sistema de autenticação

Consulte o arquivo `README.md` para mais informações sobre como usar o sistema.

---

**Última atualização**: 27 de maio de 2026
