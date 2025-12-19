import React, { useState } from 'react';
import './cadastro.css';

export function Cadastro() {
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', cpf: '', matricula: '', cargo: 'servidor'
  });
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");

  // --- SCRIPT 1: VALIDAÇÃO E MÁSCARA DE CPF ---
  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    
    // Remove tudo que NÃO é número
    valor = valor.replace(/\D/g, ""); 
    
    // Limita a 11 números
    if (valor.length > 11) valor = valor.slice(0, 11);

    // Aplica a máscara (000.000.000-00) visualmente
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setForm({ ...form, cpf: valor });
  };

  // --- SCRIPT 2: VALIDAÇÃO INTELIGENTE DE EMAIL ---
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, email: e.target.value });
  };

  const verificarTyposEmail = (email: string) => {
    const dominiosComuns = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br", "icloud.com"];
    const partes = email.split('@');
    
    if (partes.length !== 2) return null; // Email inválido
    
    const dominioDigitado = partes[1];

    // Verifica se parece com algum domínio comum mas está errado
    for (let correto of dominiosComuns) {
      // Se for diferente, mas tiver comprimento parecido e começar/terminar igual
      if (dominioDigitado !== correto && 
          Math.abs(dominioDigitado.length - correto.length) < 3 &&
          (dominioDigitado.startsWith(correto[0]) || dominioDigitado.endsWith(correto[correto.length-1]))) {
        return `Você quis dizer "${partes[0]}@${correto}"?`;
      }
    }
    return null;
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Validando...");

    // Validação extra de email antes de enviar
    const sugestao = verificarTyposEmail(form.email);
    if (sugestao) {
      if (!window.confirm(`⚠️ O e-mail parece errado. ${sugestao}\n\nClique em OK para corrigir automaticamente, ou Cancelar para manter como está.`)) {
         // Se cancelar, segue o envio. Se OK, aborta e corrige.
         const partes = form.email.split('@');
         const correcao = sugestao.split('@')[1].replace('"?', ''); // Pega o dominio da mensagem
         setForm({...form, email: `${partes[0]}@${correcao}`});
         return; 
      }
    }

    try {
      // Remove pontuação do CPF antes de enviar pro banco (se preferir números puros)
      const dadosParaEnvio = {
        ...form,
        cpf: form.cpf.replace(/\D/g, '') // Envia apenas números: 12345678900
      };

      const res = await fetch('https://hanniker.onrender.com/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnvio),
      });

      const dados = await res.json();

      if (res.ok) {
        setMsg(`✅ Cadastrado com sucesso!`);
        setStatus("sucesso");
        setForm({ nome: '', email: '', senha: '', cpf: '', matricula: '', cargo: 'servidor' });
      } else {
        setMsg(`❌ Erro: ${dados.erro}`);
        setStatus("erro");
      }
    } catch (error) {
      setMsg("❌ Erro de conexão.");
      setStatus("erro");
    }
  };

  return (
    <div className="container">
      <h1 className="titulo">📋 Novo Cadastro</h1>
      <form onSubmit={enviar} className="formulario">
        
        <div className="grupoInput"><label>Nome:</label>
          <input className="input" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required />
        </div>

        <div className="grupoInput"><label>Email:</label>
          <input className="input" type="email" value={form.email} onChange={handleEmail} required />
        </div>

        <div className="grupoInput"><label>Senha:</label>
          <input className="input" type="password" value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} required />
        </div>

        <div className="linhaDupla">
          <div className="coluna grupoInput"><label>CPF:</label>
            <input 
              className="input" 
              value={form.cpf} 
              onChange={handleCPF} // Usa o Script do CPF aqui
              placeholder="000.000.000-00"
              required 
            />
          </div>
          <div className="coluna grupoInput"><label>Matrícula:</label>
            <input className="input" value={form.matricula} onChange={e => setForm({...form, matricula: e.target.value})} required />
          </div>
        </div>

        <div className="grupoInput"><label>Cargo:</label>
          <select className="input" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})}>
            <option value="servidor">Servidor</option>
            <option value="gestor">Gestor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="botao">Cadastrar</button>
      </form>
      {msg && <p className={status === "erro" ? "mensagemErro" : "mensagemSucesso"}>{msg}</p>}
    </div>
  );
}