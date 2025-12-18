import React, { useState } from 'react';
import './cadastro.css';

export function Cadastro() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '', matricula: '', cargo: 'servidor'
  });
  const [msg, setMsg] = useState("");

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Salvando...");

    try {
      // ⚠️ LINK CORRIGIDO
      const res = await fetch('https://hanniker.onrender.com/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMsg("✅ Cadastrado com sucesso!");
        setForm({ ...form, nome: '', email: '', senha: '', cpf: '', matricula: '' });
      } else {
        setMsg("❌ Erro ao salvar.");
      }
    } catch (error) {
      setMsg("❌ Erro de conexão.");
    }
  };

  return (
    <div className="container">
      <h1>Novo Usuário</h1>
      <form onSubmit={enviar}>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
        {/* CAMPO DE SENHA AQUI EM BAIXO 👇 */}
        <input placeholder="Senha" type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required />
        
        <input placeholder="CPF" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} required />
        <input placeholder="Matrícula" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} required />
        
        <select value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
          <option value="servidor">Servidor</option>
          <option value="gestor">Gestor</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Cadastrar</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}