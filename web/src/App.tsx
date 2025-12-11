function App() {
  return (
    <div style={{ 
      padding: '40px', 
      fontFamily: 'sans-serif', 
      textAlign: 'center' 
    }}>
      <h1 style={{ color: '#2c3e50' }}>Projeto Hanniker</h1>
      <p>Sistema de Controle de Ponto</p>
      
      <div style={{ marginTop: '20px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <p>Olá, <strong>Hanniel</strong>! O sistema está online.</p>
        <button onClick={() => alert("Função em construção!")} style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Registrar Entrada
        </button>
      </div>
    </div>
  )
}

export default App