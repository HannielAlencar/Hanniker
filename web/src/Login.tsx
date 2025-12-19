import { useState } from 'react';
import './cadastro.css'; // Usando o mesmo estilo para ficar bonito

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
        // Salva o usuário no navegador e recarrega para ir pro Home
        localStorage.setItem('usuario_hanniker', JSON.stringify(data));
        window.location.href = "/";
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
        
        <hr style={{margin: '20px 0'}}/>
        <p style={{textAlign: 'center', fontSize: '0.9rem', color: '#666'}}>
          Não tem login? <br/> Peça para um servidor cadastrado te registrar.
        </p>
      </div>
    </div>
  );
}