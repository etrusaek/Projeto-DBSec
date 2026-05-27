// db.js
// Módulo de conexão com o banco de dados MySQL

const mysql = require('mysql2/promise');

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

module.exports = pool;
