const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
// O Render diz qual porta usar. Se não disser, usa a 3000.
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Configuração do Banco de Dados ---
const connectionString = process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = new Pool({
  connectionString: connectionString,
  // O Neon/Render exige SSL (criptografia). O local geralmente não.
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// --- Rotas ---

// 1. Rota de Teste (Para ver se o servidor está online)
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Hanniker Online! 🚀' });
});

// 2. Rota para Bater Ponto
app.post('/bater-ponto', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });

  try {
    const resultado = await pool.query(
      'INSERT INTO pontos (nome, data_hora) VALUES ($1, NOW()) RETURNING *',
      [nome]
    );
    res.status(201).json({ mensagem: 'Ponto registrado!', ponto: resultado.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao registrar ponto' });
  }
});

// 3. Rota para Listar Pontos (Opcional, bom para debug)
app.get('/pontos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
});

// 4. Rota para Cadastrar Usuários (FALTAVA ESSA!) ⚠️
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cargo, matricula, cpf } = req.body;

  try {
    // Verifica se já existe
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR cpf = $2', [email, cpf]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ erro: 'Usuário já cadastrado (Email ou CPF)' });
    }

    const novoUsuario = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, cargo, matricula, cpf) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome, email, cargo`,
      [nome, email, senha, cargo, matricula, cpf]
    );

    res.status(201).json(novoUsuario.rows[0]);
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ erro: 'Erro interno ao cadastrar' });
  }
});

// Inicia o Servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});