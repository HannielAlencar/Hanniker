const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
// Usa a porta que o Render manda ou a 3000
const port = process.env.PORT || 3000;

// Permite que o site na Vercel fale com este servidor
app.use(cors());
app.use(express.json());

// Conexão com o Banco (Funciona no PC e na Nuvem)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Obrigatório para o Render/Neon
});

// --- ROTA 1: Teste ---
app.get('/', (req, res) => {
  res.json({ mensagem: 'Servidor Hanniker Online e Pronto! 🚀' });
});

// --- ROTA 2: Bater Ponto ---
app.post('/bater-ponto', async (req, res) => {
  const { nome } = req.body;
  
  if (!nome) {
    return res.status(400).json({ erro: 'O nome é obrigatório para bater o ponto.' });
  }

  try {
    const resultado = await pool.query(
      'INSERT INTO pontos (nome, data_hora) VALUES ($1, NOW()) RETURNING *',
      [nome]
    );
    console.log("Ponto registrado:", resultado.rows[0]);
    res.status(201).json({ mensagem: 'Sucesso!', ponto: resultado.rows[0] });
  } catch (erro) {
    console.error("Erro no banco:", erro);
    res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
  }
});

// --- ROTA 3: Listar Pontos ---
app.get('/pontos', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC LIMIT 50');
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar histórico.' });
  }
});

// --- ROTA 4: Cadastro de Usuários (Com Senha) ---
app.post('/usuarios', async (req, res) => {
  // Agora recebemos a SENHA também
  const { nome, email, senha, cargo, matricula, cpf } = req.body;

  try {
    // Verifica se já existe
    const duplicado = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR cpf = $2', [email, cpf]);
    if (duplicado.rows.length > 0) {
      return res.status(400).json({ erro: 'Email ou CPF já cadastrados.' });
    }

    // Salva com a senha
    const novo = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, cargo, matricula, cpf) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome`,
      [nome, email, senha, cargo, matricula, cpf]
    );

    res.status(201).json({ mensagem: "Usuário criado!", usuario: novo.rows[0] });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro interno ao cadastrar usuário.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});