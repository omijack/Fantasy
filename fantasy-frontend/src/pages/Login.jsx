import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("S'ha fet submit"); // afegeix això
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (res.ok) {
      // ✅ Guardar usuari i diners a localStorage
      localStorage.setItem('user', JSON.stringify({
        name: username,
        userId: data.userId,
        money: 20000000 // 20 milions
      }));

      // ✅ Redirigir a la pàgina principal
      navigate('/');
    } else {
      alert(data.error || 'Error de login');
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Inicia sessió</h2>
        <input
          type="text"
          placeholder="Nom d’usuari"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contrasenya"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Entrar</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    height: '100vh', background: '#f1f1f1', padding: '1rem'
  },
  form: {
    background: '#fff', padding: '2rem', borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px'
  },
  input: {
    display: 'block', width: '100%', marginBottom: '1rem',
    padding: '0.75rem', fontSize: '1rem', borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    width: '100%', padding: '0.75rem', fontSize: '1rem',
    backgroundColor: '#007bff', color: '#fff', border: 'none',
    borderRadius: '4px', cursor: 'pointer'
  }
};
