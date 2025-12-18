import React, { useState } from 'react';
import './cadastro.css'; // Importa o seu CSS novo

export function Cadastro() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    cpf: '',
    matricula: '',
    cargo: 'servidor'
  });
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // 'sucesso' ou 'erro'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Salvando...");
    setStatus("");

    try {
      const res = await fetch('https://hanniker.onrender.com/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const dados = await res.json();

      if (res.ok) {
        setMsg(`✅ Cadastrado com sucesso!`);
        setStatus("sucesso");
        // Limpa o formulário
        setForm({ nome: '', email: '', senha: '', cpf: '', matricula: '', cargo: 'servidor' });
      } else {
        setMsg(`❌ Erro: ${dados.erro || 'Falha ao salvar.'}`);
        setStatus("erro");
      }
    } catch (error) {
      setMsg("❌ Erro de conexão com o servidor.");
      setStatus("erro");
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">📋 Novo Cadastro</h1>
      
      <form onSubmit={enviar} className="formulario">
        
        <div className="grupoInput">
          <label>Nome Completo:</label>
          <input className="input" name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="grupoInput">
          <label>Email:</label>
          <input className="input" type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="grupoInput">
          <label>Senha:</label>
          <input className="input" type="password" name="senha" value={form.senha} onChange={handleChange} required placeholder="Crie uma senha" />
        </div>

        {/* CPF e Matrícula lado a lado */}
        <div className="linhaDupla">
          <div className="coluna grupoInput">
            <label>CPF:</label>
            <input className="input" name="cpf" value={form.cpf} onChange={handleChange} required />
          </div>
          <div className="coluna grupoInput">
            <label>Matrícula:</label>
            <input className="input" name="matricula" value={form.matricula} onChange={handleChange} required />
          </div>
        </div>

        <div className="grupoInput">
          <label>Cargo:</label>
          <select className="input" name="cargo" value={form.cargo} onChange={handleChange}>
            <option value="servidor">Servidor</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="botao">Cadastrar</button>
      </form>

      {/* Exibe a mensagem com a classe certa do CSS */}
      {msg && (
        <p className={status === "erro" ? "mensagemErro" : "mensagemSucesso"}>
          {msg}
        </p>
      )}
    </div>
  );
}