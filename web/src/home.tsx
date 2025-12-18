import { useState } from 'react';
import './App.css'; // Mantemos o estilo

export function Home() {
  const [nome, setNome] = useState("");
  const [mensagem, setMensagem] = useState("");

  const baterPonto = async () => {
    if (!nome) {
      setMensagem("Por favor, insira seu nome.");
      return;
    }
    setMensagem("Registrando...");

    try {
      // ⚠️ IMPORTANTE: Aqui trocamos localhost pelo link do Render
      const resposta = await fetch('https://hanniker-backend.onrender.com/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome }),
      });
      
      if (resposta.ok) {
        setMensagem(`✅ Ponto de ${nome} registrado!`);
        setNome(""); 
      } else {
        setMensagem("❌ Falha ao registrar o ponto.");
      }
    } catch (erro) {
      setMensagem("❌ Erro de rede ao registrar o ponto.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Hanniker Ponto</h1>
        <p>Digite seu nome para registrar a entrada.</p>
        
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <button onClick={baterPonto} className="btn-bater">
          Bater Ponto
        </button>

        {mensagem && <p className="mensagem">{mensagem}</p>}
      </div>
    </div>
  );
}