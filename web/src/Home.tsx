import { useState } from 'react';
import './App.css'; 

export function Home() {
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState(""); // Para mensagens de sucesso/erro

  const baterPonto = async () => {
    if (!nome) {
      setStatus("⚠️ Por favor, digite seu nome.");
      return;
    }
    
    setStatus("⏳ Registrando ponto...");

    try {
      // LINK DO RENDER (CONFIRA SE ESTÁ IGUAL AO SEU)
      const resposta = await fetch('https://hanniker-backend.onrender.com/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });

      if (resposta.ok) {
        setStatus(`✅ Ponto registrado com sucesso para: ${nome}!`);
        setNome(""); // Limpa o campo
      } else {
        setStatus("❌ Erro ao registrar. O servidor respondeu com erro.");
      }
    } catch (erro) {
      console.error(erro);
      setStatus("❌ Erro de conexão. O servidor está ligado?");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>⏰ Hanniker Ponto</h1>
        <p>Sistema de Registro de Jornada</p>
        
        <div style={{ margin: '20px 0' }}>
          <input
            type="text"
            placeholder="Digite seu nome completo..."
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            style={{ padding: '10px', width: '80%', marginBottom: '10px' }}
          />
          <br />
          <button 
            onClick={baterPonto} 
            className="btn-bater"
            style={{ padding: '10px 30px', fontSize: '1.2em', cursor: 'pointer', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Bater Ponto Agora
          </button>
        </div>

        {/* Mensagem de Status */}
        {status && (
          <p style={{ 
            marginTop: '15px', 
            fontWeight: 'bold', 
            color: status.includes('✅') ? 'green' : (status.includes('⏳') ? 'blue' : 'red') 
          }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
}