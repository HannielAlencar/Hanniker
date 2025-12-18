const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Conexão com o banco
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rota Principal (Teste)
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Hanniker Online! 🚀' });
});

// Rota Bater Ponto
app.post('/bater-ponto', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });

  try {
    const result = await pool.query('INSERT INTO pontos (nome, data_hora) VALUES ($1, NOW()) RETURNING *', [nome]);
    res.status(201).json({ mensagem: 'Sucesso', ponto: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro no banco de dados' });
  }
});

// Rota Listar Pontos
app.get('/pontos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
});

// Rota Criar Usuário
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cargo, matricula, cpf } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, cargo, matricula, cpf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [nome, email, senha, cargo, matricula, cpf]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar usuário' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    // Busca todos os usuários (exceto a senha, por segurança)
    const resultado = await pool.query('SELECT id, nome, email, cargo, matricula, cpf FROM usuarios ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));