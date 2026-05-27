// app.js
// Backend para autenticação com hash parcial e validação progressiva

const express = require('express');
const pool = require('./db');
const crypto = require('crypto');

const app = express();
const PORTA = 3000;

// Middleware para tratamento de JSON
app.use(express.json());

// CORS simples para permitir requisições do frontend
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

/**
 * Rota: POST /api/auth/check-email
 * Descrição: Verifica se o usuário existe e retorna o fragmento do hash armazenado
 * Parâmetros: { email: string }
 * Resposta: { existe: boolean, fragmentoHash: string | null }
 */
app.post('/api/auth/check-email', async (req, res) => {
	const { email } = req.body;

	if (!email) {
		return res.status(400).json({ erro: 'Email é obrigatório' });
	}

	try {
		const sql = 'SELECT senha FROM tb_usuarios WHERE email = ?';
		const [results] = await pool.query(sql, [email]);

		if (results.length > 0) {
			// Usuário existe, retorna o fragmento do hash armazenado
			return res.json({
				existe: true,
				fragmentoHash: results[0].senha
			});
		} else {
			// Usuário não existe
			return res.json({
				existe: false,
				fragmentoHash: null
			});
		}
	} catch (err) {
		console.error('Erro ao verificar email:', err);
		return res.status(500).json({ erro: 'Erro ao verificar email' });
	}
});

/**
 * Rota: POST /api/auth/login
 * Descrição: Realiza o login verificando se o hash completo contém o fragmento armazenado
 * Parâmetros: { email: string, hashCompleto: string }
 * Resposta: { sucesso: boolean, mensagem: string }
 */
app.post('/api/auth/login', async (req, res) => {
	const { email, hashCompleto } = req.body;

	if (!email || !hashCompleto) {
		return res.status(400).json({ erro: 'Email e hash completo são obrigatórios' });
	}

	try {
		const sql = 'SELECT senha FROM tb_usuarios WHERE email = ?';
		const [results] = await pool.query(sql, [email]);

		if (results.length === 0) {
			return res.status(401).json({
				sucesso: false,
				mensagem: 'Usuário não encontrado'
			});
		}

		const fragmentoArmazenado = results[0].senha;

		// Verifica se o fragmento armazenado está contido no hash completo
		if (hashCompleto.includes(fragmentoArmazenado)) {
			return res.json({
				sucesso: true,
				mensagem: 'Login realizado com sucesso'
			});
		} else {
			return res.status(401).json({
				sucesso: false,
				mensagem: 'Senha incorreta'
			});
		}
	} catch (err) {
		console.error('Erro ao fazer login:', err);
		return res.status(500).json({ erro: 'Erro ao fazer login' });
	}
});

/**
 * Rota: POST /api/auth/register
 * Descrição: Cadastra um novo usuário com o hash da senha
 * Parâmetros: { nome: string, email: string, hashCompleto: string }
 * Resposta: { sucesso: boolean, mensagem: string }
 */
app.post('/api/auth/register', async (req, res) => {
	const { nome, email, hashCompleto } = req.body;

	if (!nome || !email || !hashCompleto) {
		return res.status(400).json({ erro: 'Nome, email e hash completo são obrigatórios' });
	}

	try {
		// Verifica se o email já existe
		const sqlCheck = 'SELECT id_usuario FROM tb_usuarios WHERE email = ?';
		const [checkResults] = await pool.query(sqlCheck, [email]);

		if (checkResults.length > 0) {
			return res.status(409).json({
				sucesso: false,
				mensagem: 'Email já cadastrado'
			});
		}

		// Insere o novo usuário (a TRIGGER irá extrair o fragmento do hash)
		const sqlInsert = 'INSERT INTO tb_usuarios (nome, email, senha) VALUES (?, ?, ?)';
		await pool.query(sqlInsert, [nome, email, hashCompleto]);

		return res.status(201).json({
			sucesso: true,
			mensagem: 'Usuário cadastrado com sucesso'
		});
	} catch (err) {
		console.error('Erro ao cadastrar usuário:', err);
		return res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
	}
});

/**
 * Rota: GET /posts
 * Descrição: Retorna todos os posts (mantida para compatibilidade com o código modelo)
 */
app.post('/posts', async (req, res) => {
	try {
		const sql = 'SELECT * FROM tb_posts';
		const [results] = await pool.query(sql);
		res.json(results);
	} catch (err) {
		console.error('Erro ao buscar posts:', err);
		return res.status(500).json({ erro: 'Erro ao buscar os posts' });
	}
});

// Inicia o servidor
app.listen(PORTA, () => {
	console.log(`Servidor rodando em http://localhost:${PORTA}`);
	console.log('Endpoints disponíveis:');
	console.log('  POST /api/auth/check-email - Verifica se o usuário existe');
	console.log('  POST /api/auth/login - Realiza o login');
	console.log('  POST /api/auth/register - Cadastra um novo usuário');
	console.log('  POST /posts - Retorna todos os posts');
});
