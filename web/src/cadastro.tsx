import React, { useState } from 'react';
import './cadastro.css';

export function Cadastro() {
  const usuarioLogado = { cargo: 'admin' };

  // CORREÇÃO 1: Valores iniciais para não dar erro se o usuário não mexer
  const [novoUsuario, setNovoUsuario] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '', // Vamos adicionar o input para isto
    cargo: 'servidor', // Já começa preenchido como Servidor
    matricula: '',
  });

  const [mensagem, setMensagem] = useState("");

  if (usuarioLogado.cargo !== 'admin' && usuarioLogado.cargo !== 'gestor' && usuarioLogado.cargo !== 'servidor gestor') {
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>
        <h2>Acesso Negado</h2>
        <p>Apenas administradores podem cadastrar novos usuários.</p>
      </div>
    );
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: Veja no console o que está a ser enviado
    console.log("Dados do formulário:", novoUsuario);

    if (!novoUsuario.nome || !novoUsuario.email || !novoUsuario.cpf || !novoUsuario.senha || !novoUsuario.cargo || !novoUsuario.matricula) {
      setMensagem("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const resposta = await fetch('https://hanniker-backend.onrender.com/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoUsuario),
      });

      if (resposta.ok) {
        setMensagem(`✅ Usuário ${novoUsuario.nome} cadastrado com sucesso!`);
        // Limpa o formulário
        setNovoUsuario({
          nome: '',
          email: '',
          cpf: '',
          senha: '',
          cargo: 'servidor',
          matricula: '',
        });
      } else {
        const dadosErro = await resposta.json(); // Tenta pegar a mensagem do backend
        setMensagem(`❌ Falha: ${dadosErro.erro || 'Erro desconhecido'}`);
      }
    } catch (erro) {
      setMensagem("❌ Erro de rede ao cadastrar o usuário.");
    }
  }

  return (
    <div className="container">
      <h1 className="titulo">📋 Cadastrar Novo Servidor</h1>

      <form onSubmit={handleCadastro} className="formulario">

        {/* Nome */}
        <div className="grupoInput">
          <label>Nome Completo:</label>
          <input
            className="input"
            type="text"
            required
            value={novoUsuario.nome}
            onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
          />
        </div>

        {/* Email */}
        <div className="grupoInput">
          <label>Email Corporativo:</label>
          <input
            className="input"
            type="email"
            required
            value={novoUsuario.email}
            onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
          />
        </div>

        {/* Senha (CORREÇÃO 2: Adicionado campo de senha) */}
        <div className="grupoInput">
          <label>Senha Inicial:</label>
          <input
            className="input"
            type="password"
            placeholder="Crie uma senha"
            required
            value={novoUsuario.senha}
            onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
          />
        </div>

        {/* CPF e Matrícula */}
        <div className="linhaDupla">
          <div className="coluna">
            <label>CPF:</label>
            <input
              className="input"
              type="text"
              placeholder="000.000.000-00"
              required
              value={novoUsuario.cpf}
              onChange={e => setNovoUsuario({ ...novoUsuario, cpf: e.target.value })}
            />
          </div>
          <div className="coluna">
            <label>Matrícula:</label>
            <input
              className="input"
              type="text"
              placeholder="Ex: 2023001"
              required
              value={novoUsuario.matricula}
              onChange={e => setNovoUsuario({ ...novoUsuario, matricula: e.target.value })}
            />
          </div>
        </div>

        {/* Cargo */}
        <div className="grupoInput">
          <label>Cargo / Função:</label>
          <select
            className="input"
            value={novoUsuario.cargo}
            onChange={e => setNovoUsuario({ ...novoUsuario, cargo: e.target.value })}
          >
            <option value="servidor">Servidor</option>
            <option value="gestor">Gestor</option>
            {usuarioLogado.cargo === 'admin' && <option value="admin">Administrador</option>}
          </select>
        </div>

        <button type="submit" className="botao">
          Salvar Cadastro
        </button>
      </form>

      {mensagem && (
        <p className={mensagem.includes("❌") || mensagem.includes("Por favor") ? "mensagemErro" : "mensagemSucesso"}>
          {mensagem}
        </p>
      )}
    </div>
  );
}