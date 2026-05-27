# Guia de Testes - Sistema de Autenticação

Este documento fornece um guia completo para testar o sistema de autenticação com hash parcial e validação progressiva.

## Pré-requisitos para Testes

1. MySQL configurado e rodando (consulte `SETUP_MYSQL.md`)
2. Backend iniciado: `node app.js`
3. Frontend aberto em um navegador web
4. Navegador com suporte a Web Crypto API (Chrome, Firefox, Safari, Edge)

---

## Teste 1: Verificar Conexão com o Backend

### Objetivo
Verificar se o backend está respondendo corretamente.

### Passos

1. Abra o terminal e execute:
```bash
curl -X POST http://localhost:3000/api/auth/check-email \
  -H "Content-Type: application/json" \
  -d '{"email": "john.hammond@fakemail.com"}'
```

2. Você deve receber uma resposta JSON:
```json
{
  "existe": true,
  "fragmentoHash": "a1b2c3d4e5f6g7h"
}
```

### Resultado Esperado
✅ O backend retorna o fragmento do hash para um usuário existente.

---

## Teste 2: Validação Progressiva - Email Válido (Usuário Existe)

### Objetivo
Testar se o frontend detecta corretamente um usuário existente.

### Passos

1. Abra `seguranca.html` em um navegador
2. No campo "Login (E-mail)", digite: `john.hammond@fakemail.com`
3. Clique fora do campo (ou pressione TAB)
4. Observe o campo de email

### Resultado Esperado
✅ O campo de email fica com borda verde
✅ Mensagem exibida: "Usuário encontrado"
✅ O fragmento do hash é armazenado internamente

---

## Teste 3: Validação Progressiva - Email Inválido (Usuário Não Existe)

### Objetivo
Testar se o frontend detecta corretamente um usuário inexistente.

### Passos

1. No campo "Login (E-mail)", digite: `usuario.inexistente@email.com`
2. Clique fora do campo (ou pressione TAB)
3. Observe o campo de email

### Resultado Esperado
✅ O campo de email fica com borda laranja
✅ Mensagem exibida: "Usuário não conhecido"
✅ Botão "Entrar" permanece desabilitado

---

## Teste 4: Validação Progressiva - Senha Correta

### Objetivo
Testar se o frontend valida corretamente uma senha correta.

### Passos

1. Digite o email: `john.hammond@fakemail.com`
2. Pressione TAB (valida o email)
3. No campo "Senha", digite: `123456`
4. Clique fora do campo (ou pressione TAB)
5. Observe o campo de senha

### Resultado Esperado
✅ O campo de senha fica com borda verde
✅ Mensagem exibida: "Senha válida"
✅ Botão "Entrar" fica habilitado (cor azul, não mais cinza)

### Explicação Técnica
- Matrícula: `818174-7`
- Concatenação: `818174-7` + `123456` = `818174-7123456`
- Hash SHA-256 gerado localmente
- O fragmento armazenado (`a1b2c3d4e5f6g7h`) está contido no hash gerado
- Logo, a senha é válida

---

## Teste 5: Validação Progressiva - Senha Incorreta

### Objetivo
Testar se o frontend rejeita corretamente uma senha incorreta.

### Passos

1. Digite o email: `john.hammond@fakemail.com`
2. Pressione TAB (valida o email)
3. No campo "Senha", digite: `senhaErrada`
4. Clique fora do campo (ou pressione TAB)
5. Observe o campo de senha

### Resultado Esperado
✅ O campo de senha fica com borda vermelha
✅ Mensagem exibida: "Senha incorreta"
✅ Botão "Entrar" permanece desabilitado

### Explicação Técnica
- Concatenação: `818174-7` + `senhaErrada` = `818174-7senhaErrada`
- Hash SHA-256 gerado localmente
- O fragmento armazenado NÃO está contido no hash gerado
- Logo, a senha é inválida

---

## Teste 6: Login com Credenciais Corretas

### Objetivo
Testar se o login funciona corretamente com credenciais válidas.

### Passos

1. Digite o email: `john.hammond@fakemail.com`
2. Pressione TAB
3. Digite a senha: `123456`
4. Pressione TAB
5. Clique no botão "Entrar"
6. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta verde exibido: "Login realizado com sucesso! Bem-vindo!"
✅ Formulário é limpo após 2 segundos
✅ Botão "Entrar" volta a ficar desabilitado

---

## Teste 7: Login com Credenciais Incorretas

### Objetivo
Testar se o login falha corretamente com credenciais inválidas.

### Passos

1. Digite o email: `john.hammond@fakemail.com`
2. Pressione TAB
3. Digite a senha: `senhaErrada`
4. Pressione TAB
5. Tente clicar no botão "Entrar" (deve estar desabilitado)

### Resultado Esperado
✅ Botão "Entrar" permanece desabilitado
✅ Nenhuma requisição é enviada ao backend

---

## Teste 8: Cadastro de Novo Usuário

### Objetivo
Testar se o cadastro de novo usuário funciona corretamente.

### Passos

1. Clique no botão "Me cadastrar"
2. Preencha os campos:
   - Nome: `Maria Silva`
   - Email: `maria.silva@email.com`
   - Senha: `senha123`
   - Confirmar Senha: `senha123`
3. Clique em "Cadastrar"
4. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta verde exibido: "Cadastro realizado com sucesso! Você já pode fazer login."
✅ Modal de cadastro é fechado
✅ Formulário de login está pronto para novo login

### Verificação no Banco de Dados

```bash
# Conectar ao MySQL
mysql -u root -pmy-secret-pw uscs_news

# Verificar o novo usuário
SELECT * FROM tb_usuarios WHERE email = 'maria.silva@email.com';

# Você deve ver algo como:
# | id_usuario | nome        | email                 | senha            |
# | 5          | Maria Silva | maria.silva@email.com | f6g7h8i9j0k1l2m3 |
```

---

## Teste 9: Cadastro com Email Duplicado

### Objetivo
Testar se o sistema rejeita cadastro com email já existente.

### Passos

1. Clique no botão "Me cadastrar"
2. Preencha os campos:
   - Nome: `João Silva`
   - Email: `maria.silva@email.com` (email já cadastrado)
   - Senha: `senha456`
   - Confirmar Senha: `senha456`
3. Clique em "Cadastrar"
4. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta vermelho exibido: "Email já cadastrado"
✅ Modal permanece aberto
✅ Você pode tentar com outro email

---

## Teste 10: Cadastro com Senhas Diferentes

### Objetivo
Testar se o sistema valida a confirmação de senha.

### Passos

1. Clique no botão "Me cadastrar"
2. Preencha os campos:
   - Nome: `Pedro Santos`
   - Email: `pedro.santos@email.com`
   - Senha: `senha123`
   - Confirmar Senha: `senhadiferente`
3. Clique em "Cadastrar"
4. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta vermelho exibido: "As senhas não coincidem"
✅ Modal permanece aberto
✅ Você pode corrigir as senhas

---

## Teste 11: Cadastro com Senha Curta

### Objetivo
Testar se o sistema valida o comprimento mínimo da senha.

### Passos

1. Clique no botão "Me cadastrar"
2. Preencha os campos:
   - Nome: `Ana Costa`
   - Email: `ana.costa@email.com`
   - Senha: `123` (menos de 6 caracteres)
   - Confirmar Senha: `123`
3. Clique em "Cadastrar"
4. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta vermelho exibido: "A senha deve ter no mínimo 6 caracteres"
✅ Modal permanece aberto

---

## Teste 12: Login com Novo Usuário Cadastrado

### Objetivo
Testar se o novo usuário cadastrado consegue fazer login.

### Passos

1. Feche o modal de cadastro
2. Digite o email: `maria.silva@email.com`
3. Pressione TAB
4. Digite a senha: `senha123`
5. Pressione TAB
6. Clique em "Entrar"
7. Observe a mensagem de alerta

### Resultado Esperado
✅ Alerta verde exibido: "Login realizado com sucesso! Bem-vindo!"
✅ O novo usuário consegue fazer login

---

## Teste 13: Verificação do Hash no Banco de Dados

### Objetivo
Verificar se o hash está sendo armazenado corretamente como fragmento de 17 caracteres.

### Passos

1. Conectar ao MySQL:
```bash
mysql -u root -pmy-secret-pw uscs_news
```

2. Executar a query:
```sql
SELECT id_usuario, nome, email, LENGTH(senha) as comprimento_senha, senha FROM tb_usuarios;
```

3. Observe os resultados

### Resultado Esperado
✅ Todos os valores na coluna `comprimento_senha` devem ser `17`
✅ Cada `senha` deve ser um fragmento de 17 caracteres hexadecimais
✅ Exemplo: `a1b2c3d4e5f6g7h8i`

---

## Teste 14: Verificação dos Triggers

### Objetivo
Verificar se os triggers estão funcionando corretamente.

### Passos

1. Conectar ao MySQL:
```bash
mysql -u root -pmy-secret-pw uscs_news
```

2. Verificar os triggers:
```sql
SHOW TRIGGERS FROM uscs_news;
```

3. Ver o código do trigger:
```sql
SHOW CREATE TRIGGER tr_usuarios_insert;
SHOW CREATE TRIGGER tr_usuarios_update;
```

### Resultado Esperado
✅ Dois triggers devem estar listados: `tr_usuarios_insert` e `tr_usuarios_update`
✅ Ambos devem estar associados à tabela `tb_usuarios`
✅ Ambos devem estar no evento `BEFORE INSERT/UPDATE`

---

## Teste 15: Teste de Stress - Múltiplos Cadastros

### Objetivo
Testar se o sistema aguenta múltiplos cadastros consecutivos.

### Passos

1. Cadastre 5 usuários diferentes:
   - usuario1@email.com
   - usuario2@email.com
   - usuario3@email.com
   - usuario4@email.com
   - usuario5@email.com

2. Verifique no banco de dados:
```sql
SELECT COUNT(*) as total_usuarios FROM tb_usuarios;
```

### Resultado Esperado
✅ Todos os 5 usuários são cadastrados com sucesso
✅ Nenhum erro é exibido
✅ O total de usuários aumenta corretamente

---

## Teste 16: Teste de Segurança - Verificar Que o Hash Completo Não É Armazenado

### Objetivo
Verificar que apenas o fragmento do hash é armazenado, não o hash completo.

### Passos

1. Cadastre um novo usuário com uma senha específica
2. Obtenha o hash completo gerado (você pode adicionar um `console.log` no frontend)
3. Verifique no banco de dados:
```sql
SELECT senha FROM tb_usuarios WHERE email = 'seu@email.com';
```

4. Compare o fragmento armazenado com o hash completo

### Resultado Esperado
✅ O fragmento armazenado é apenas 17 caracteres
✅ O fragmento é uma parte do hash completo
✅ O hash completo NÃO está armazenado no banco de dados

---

## Teste 17: Teste de Validação - Email Inválido

### Objetivo
Testar se o frontend valida o formato do email.

### Passos

1. No campo "Login (E-mail)", digite: `email-invalido`
2. Clique fora do campo
3. Observe o campo de email

### Resultado Esperado
✅ O campo de email fica com borda vermelha
✅ Mensagem exibida: "Email inválido"
✅ Botão "Entrar" permanece desabilitado

---

## Teste 18: Teste de Validação - Campo Vazio

### Objetivo
Testar se o frontend valida campos vazios.

### Passos

1. Deixe o campo "Login (E-mail)" vazio
2. Deixe o campo "Senha" vazio
3. Tente clicar em "Entrar"

### Resultado Esperado
✅ Botão "Entrar" permanece desabilitado
✅ Nenhuma requisição é enviada ao backend

---

## Checklist de Testes

- [ ] Teste 1: Verificar Conexão com o Backend
- [ ] Teste 2: Validação Progressiva - Email Válido
- [ ] Teste 3: Validação Progressiva - Email Inválido
- [ ] Teste 4: Validação Progressiva - Senha Correta
- [ ] Teste 5: Validação Progressiva - Senha Incorreta
- [ ] Teste 6: Login com Credenciais Corretas
- [ ] Teste 7: Login com Credenciais Incorretas
- [ ] Teste 8: Cadastro de Novo Usuário
- [ ] Teste 9: Cadastro com Email Duplicado
- [ ] Teste 10: Cadastro com Senhas Diferentes
- [ ] Teste 11: Cadastro com Senha Curta
- [ ] Teste 12: Login com Novo Usuário Cadastrado
- [ ] Teste 13: Verificação do Hash no Banco de Dados
- [ ] Teste 14: Verificação dos Triggers
- [ ] Teste 15: Teste de Stress - Múltiplos Cadastros
- [ ] Teste 16: Teste de Segurança - Hash Completo Não Armazenado
- [ ] Teste 17: Teste de Validação - Email Inválido
- [ ] Teste 18: Teste de Validação - Campo Vazio

---

## Troubleshooting

### Problema: "Erro ao verificar email"

**Solução**: Certifique-se de que o backend está rodando:
```bash
node app.js
```

### Problema: "Erro ao fazer login"

**Solução**: Verifique se o banco de dados está configurado corretamente em `db.js`.

### Problema: "Email já cadastrado" mesmo com email diferente

**Solução**: Verifique se há espaços em branco no email. Tente limpar o campo e digitar novamente.

### Problema: Botão "Entrar" não fica habilitado

**Solução**: Verifique se ambas as validações (email e senha) foram bem-sucedidas. Consulte o console do navegador para mais detalhes.

---

## Relatório de Testes

Após executar todos os testes, você pode gerar um relatório:

| Teste | Status | Observações |
|-------|--------|-------------|
| 1 | ✅ | Backend respondendo corretamente |
| 2 | ✅ | Email válido detectado |
| 3 | ✅ | Email inválido detectado |
| 4 | ✅ | Senha correta validada |
| 5 | ✅ | Senha incorreta rejeitada |
| 6 | ✅ | Login bem-sucedido |
| 7 | ✅ | Login falhado corretamente |
| 8 | ✅ | Novo usuário cadastrado |
| 9 | ✅ | Email duplicado rejeitado |
| 10 | ✅ | Senhas diferentes detectadas |
| 11 | ✅ | Senha curta rejeitada |
| 12 | ✅ | Novo usuário consegue fazer login |
| 13 | ✅ | Hash armazenado como fragmento |
| 14 | ✅ | Triggers funcionando |
| 15 | ✅ | Múltiplos cadastros bem-sucedidos |
| 16 | ✅ | Hash completo não armazenado |
| 17 | ✅ | Email inválido rejeitado |
| 18 | ✅ | Campos vazios validados |

---

**Última atualização**: 27 de maio de 2026
