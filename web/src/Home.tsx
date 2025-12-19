import { useState, useEffect } from 'react';
import './App.css'; 

export function Home({ usuario }: { usuario: any }) {
  const [mensagem, setMensagem] = useState("");
  const [tipoMsg, setTipoMsg] = useState(""); // 'sucesso', 'erro', 'loading'
  const [historico, setHistorico] = useState<any[]>([]);

  // Carrega histórico ao entrar
  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = async () => {
    try {
      const res = await fetch('https://hanniker.onrender.com/pontos');
      const dados = await res.json();
      setHistorico(dados);
    } catch (error) {
      console.error("Erro ao carregar histórico");
    }
  };

  const baterPonto = async () => {
    // Confirmação simples para evitar cliques acidentais
    if(!window.confirm(`Confirma o registro de ponto para ${usuario.nome}?`)) {
      return;
    }

    setMensagem("Registrando...");
    setTipoMsg("loading");

    try {
      const resposta = await fetch('https://hanniker.onrender.com/bater-ponto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: usuario.nome }),
      });

      if (resposta.ok) {
        const hora = new Date().toLocaleTimeString();
        setMensagem(`✅ Ponto registrado às ${hora}!`);
        setTipoMsg("sucesso");
        carregarHistorico(); // Atualiza a lista na hora
        
        // Limpa a mensagem após 3 segundos
        setTimeout(() => { setMensagem(""); setTipoMsg(""); }, 3000);
      } else {
        setMensagem("❌ Erro ao registrar.");
        setTipoMsg("erro");
      }
    } catch (erro) {
      setMensagem("❌ Erro de conexão.");
      setTipoMsg("erro");
    }
  };

  return (
    <div className="container">
      
      {/* --- CABEÇALHO DA HOME --- */}
      <div className="home-header">
        <div>
          <h1>Olá, {usuario.nome.split(' ')[0]}</h1>
          <small style={{color: '#777'}}>{usuario.cargo}</small>
        </div>
        
        {/* BOTÃO NO CANTO SUPERIOR DIREITO */}
        <button onClick={baterPonto} className="btn-novo-ponto">
          <span>➕</span> NOVO PONTO
        </button>
      </div>

      {/* --- MENSAGEM DE STATUS --- */}
      {mensagem && (
        <div className={`mensagem-box msg-${tipoMsg}`}>
          {mensagem}
        </div>
      )}

      {/* --- HISTÓRICO --- */}
      <div className="historico-card">
        <h3 style={{marginTop: 0, color: '#444'}}>📜 Últimos Registros</h3>
        
        {historico.length === 0 ? (
          <p style={{textAlign: 'center', color: '#999'}}>Nenhum ponto registrado hoje.</p>
        ) : (
          <ul className="lista-pontos">
            {historico.map((ponto) => (
              <li key={ponto.id} className="item-ponto">
                <strong>{ponto.nome}</strong>
                <span className="data-hora">
                  {new Date(ponto.data_hora).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}