const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs'); // 1. Importamos a biblioteca de segurança
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

// Rota Principal
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Hanniker Seguro e Online! 🔒' });
});

// --- ROTA DE CADASTRO (COM CRIPTOGRAFIA) ---
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cargo, matricula, cpf } = req.body;

  try {
    // Verifica duplicidade
    const duplicado = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR cpf = $2', [email, cpf]);
    if (duplicado.rows.length > 0) {
      return res.status(400).json({ erro: 'Email ou CPF já cadastrados.' });
    }

    // 2. Criptografar a senha antes de salvar
    // O '10' é o "custo" da segurança (quanto maior, mais difícil de quebrar)
    const salt = await bcrypt.genSalt(10);
    const senhaCriptografada = await bcrypt.hash(senha, salt);

    // 3. Salvamos a 'senhaCriptografada' no banco, NÃO a original
    const novo = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, cargo, matricula, cpf) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome`,
      [nome, email, senhaCriptografada, cargo, matricula, cpf]
    );

    res.status(201).json({ mensagem: "Usuário criado com segurança!", usuario: novo.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
});

// --- OUTRAS ROTAS ---

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

app.get('/pontos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar pontos' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT id, nome, email, cargo, matricula, cpf FROM usuarios ORDER BY id DESC');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar usuários' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor seguro rodando na porta ${port}`);
});