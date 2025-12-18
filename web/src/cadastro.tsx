import React, { useState } from 'react';
import './cadastro.css'; // Certifique-se de que este arquivo existe

export function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '', // Campo de senha adicionado no estado
    cpf: '',
    matricula: '',
    cargo: 'servidor'
  });

  const [mensagem, setMensagem] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const salvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("⏳ Salvando...");

    try {
      const resposta = await fetch('https://hanniker-backend.onrender.com/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setMensagem(`✅ Sucesso! Usuário ${dados.usuario?.nome || 'criado'} salvo.`);
        setForm({ nome: '', email: '', senha: '', cpf: '', matricula: '', cargo: 'servidor' });
      } else {
        setMensagem(`❌ Erro: ${dados.erro || 'Falha desconhecida'}`);
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>📋 Novo Cadastro</h1>
        <form onSubmit={salvarUsuario}>
          
          <div className="campo">
            <label>Nome:</label>
            <input name="nome" value={form.nome} onChange={handleChange} required />
          </div>

          <div className="campo">
            <label>Email:</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          {/* --- CAMPO DE SENHA AQUI --- */}
          <div className="campo">
            <label>Senha:</label>
            <input type="password" name="senha" value={form.senha} onChange={handleChange} required placeholder="Mínimo 6 caracteres" />
          </div>

          <div className="linha-dupla">
            <div className="campo">
              <label>CPF:</label>
              <input name="cpf" value={form.cpf} onChange={handleChange} required />
            </div>
            <div className="campo">
              <label>Matrícula:</label>
              <input name="matricula" value={form.matricula} onChange={handleChange} required />
            </div>
          </div>

          <div className="campo">
            <label>Cargo:</label>
            <select name="cargo" value={form.cargo} onChange={handleChange}>
              <option value="servidor">Servidor</option>
              <option value="gestor">Gestor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn-salvar">Salvar Cadastro</button>
        </form>

        {mensagem && <p className="status-msg">{mensagem}</p>}
      </div>
    </div>
  );
}