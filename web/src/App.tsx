import { useState, useEffect } from 'react';
import { Home } from './Home';
import { Cadastro } from './cadastro';
import { Login } from './Login.tsx';
import './App.css';

function App() {
  const [pagina, setPagina] = useState("home");
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const userSalvo = localStorage.getItem('usuario_hanniker');
    if (userSalvo) {
      setUsuario(JSON.parse(userSalvo));
    }
  }, []);

  const sair = () => {
    localStorage.removeItem('usuario_hanniker');
    setUsuario(null);
    setPagina("home");
  };

  
  if (!usuario) {
    return <Login />;
  }

  // Se TIVER usuário, mostra o Sistema (Menu + Página escolhida)
  return (
    <div>
      <nav className="navbar" style={{ padding: '15px', background: '#f4f4f4', display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px', borderRadius: '8px' }}>
        <span>👤 <strong>{usuario.nome}</strong></span>
        
        <button onClick={() => setPagina('home')} style={{padding: '5px 10px'}}>
          Início
        </button>
        
        {/* Só Gestor/Admin vê o botão de cadastro */}
        {(usuario.cargo === 'admin' || usuario.cargo === 'gestor') && (
          <button onClick={() => setPagina('cadastro')} style={{padding: '5px 10px'}}>
            Cadastrar Equipe
          </button>
        )}
        
        <button onClick={sair} style={{ marginLeft: 'auto', background: '#ff4d4d', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
          Sair
        </button>
      </nav>

      {pagina === 'home' && <Home usuario={usuario} />}
      {pagina === 'cadastro' && <Cadastro />}
    </div>
  );
}

export default App;