import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Home } from './Home.tsx'; 
import { Cadastro } from './cadastro.tsx'; 
import './App.css';

function App() {
  return (
    <BrowserRouter>
      {/* Barra de Navegação */}
      <nav style={{ padding: '15px', background: '#2c3e50', marginBottom: '20px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>🏠 Início</Link>
        <Link to="/cadastro" style={{ color: '#ffd700', textDecoration: 'none', fontWeight: 'bold' }}>➕ Cadastrar</Link>
      </nav>

      {/* Definição das Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;