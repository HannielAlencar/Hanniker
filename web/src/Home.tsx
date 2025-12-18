import { useState } from 'react';
import './App.css'; 

export function Home() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  const baterPonto = async () => {
    if (!nome) return setMensagem("Digite seu nome!");
    setMensagem("Enviando...");

    try {
      // ⚠️ USEI O LINK QUE VOCÊ DISSE QUE FUNCIONA
      const response = await fetch('https://hanniker.onrender.com/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });

      if (response.ok) {
        setMensagem(`✅ Ponto de ${nome} registrado!`);
        setNome("");
      } else {
        setMensagem("❌ Erro no servidor.");
      }
    } catch (error) {
      setMensagem("❌ Erro de conexão (Link errado?).");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>⏰ Ponto Eletrônico</h1>
        <input 
          placeholder="Seu Nome" 
          value={nome} 
          onChange={e => setNome(e.target.value)} 
        />
        <button onClick={baterPonto}>Bater Ponto</button>
        <p>{mensagem}</p>
      </div>
    </div>
  );
}