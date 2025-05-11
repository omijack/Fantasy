import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.name || 'Manager';
  const money = user?.money || 0;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
        <div>
          <div><strong>{username}</strong></div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            {money.toLocaleString()} €
          </div>
        </div>
      </div>
      <button onClick={handleLogout}>Sortir</button>
    </header>
  );
}
