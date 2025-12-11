const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hanniker_ponto',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Rota para bater ponto
app.post('/bater-ponto', async (req, res) => {
  const { nome } = req.body;

  if (!nome) {
    return res.status(400).json({ erro: 'Nome é obrigatório' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO pontos (nome, data_hora) VALUES ($1, NOW()) RETURNING *',
      [nome]
    );
    res.status(201).json({ 
      mensagem: 'Ponto registrado com sucesso', 
      ponto: resultado.rows[0] 
    });
  } catch (erro) {
    console.error('Erro ao registrar ponto:', erro);
    res.status(500).json({ erro: 'Erro ao registrar o ponto' });
  }
});

// Rota para listar todos os pontos
app.get('/pontos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC');
    res.json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao buscar pontos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
});

// Rota de teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Hanniker Ponto está rodando!' });
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
