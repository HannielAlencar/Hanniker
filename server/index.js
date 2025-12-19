const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => res.json({ msg: 'Servidor Online 🚀' }));

// --- ROTA DE LOGIN ---
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    // 1. Buscar usuário pelo email
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(400).json({ erro: 'Usuário não encontrado.' });
    }

    const usuario = result.rows[0];

    // 2. Verificar senha (se não estiver criptografada no banco antigo, compare direto)
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    // OBS: Se você tiver senhas antigas não criptografadas, isso vai falhar nelas.
    // Mas para os novos cadastros funcionará.

    if (!senhaValida) {
      return res.status(400).json({ erro: 'Senha incorreta.' });
    }

    // 3. Login Sucesso (Retorna dados básicos)
    res.json({ 
      id: usuario.id, 
      nome: usuario.nome, 
      email: usuario.email, 
      cargo: usuario.cargo 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro interno no login' });
  }
});

// --- ROTA CADASTRO (Mantida) ---
app.post('/usuarios', async (req, res) => {
  const { nome, email, senha, cargo, matricula, cpf } = req.body;
  try {
    const duplicado = await pool.query('SELECT * FROM usuarios WHERE email = $1 OR cpf = $2', [email, cpf]);
    if (duplicado.rows.length > 0) return res.status(400).json({ erro: 'Email ou CPF já cadastrados.' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(senha, salt);

    const novo = await pool.query(
      `INSERT INTO usuarios (nome, email, senha, cargo, matricula, cpf) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nome`,
      [nome, email, hash, cargo, matricula, cpf]
    );
    res.status(201).json({ mensagem: "Sucesso!", usuario: novo.rows[0] });
  } catch (err) { console.error(err); res.status(500).json({ erro: 'Erro ao cadastrar' }); }
});

// --- ROTA BATER PONTO (Agora recebe o ID do usuário também, se quiser) ---
app.post('/bater-ponto', async (req, res) => {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ erro: 'Nome obrigatório' });
  try {
    const result = await pool.query('INSERT INTO pontos (nome, data_hora) VALUES ($1, NOW()) RETURNING *', [nome]);
    res.status(201).json({ mensagem: 'Ponto registrado', ponto: result.rows[0] });
  } catch (err) { console.error(err); res.status(500).json({ erro: 'Erro no banco' }); }
});

app.get('/pontos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pontos ORDER BY data_hora DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) { res.status(500).json({ erro: 'Erro ao buscar' }); }
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));