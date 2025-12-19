import React, { useState } from 'react';
import './cadastro.css'; 

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch('https://hanniker.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('usuario_hanniker', JSON.stringify(data));
        window.location.reload(); // Recarrega para entrar na Home
      } else {
        setErro(data.erro || "Falha no login");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
  };

  return (
    <div className="container">
      <div className="formulario" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1 className="titulo">🔒 Acesso Hanniker</h1>
        <form onSubmit={handleLogin} className="grupoInput">
          <label>Email:</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Senha:</label>
          <input className="input" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
          <button type="submit" className="botao">Entrar</button>
        </form>
        {erro && <p className="mensagemErro">{erro}</p>}
      </div>
    </div>
  );
}