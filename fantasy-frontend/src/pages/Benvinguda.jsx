export default function Benvinguda() {
    const user = JSON.parse(localStorage.getItem('user'));
    const username = user?.name || 'Manager';
    console.log('Render Benvinguda');
    return (
      <div>
        <h2>Benvingut/da, {username} 👋</h2>
        <p>Aquesta és la teva lliga Fantasy. Pots accedir a la Classificació, configurar l’Alineació o fitxar al Mercat des del menú lateral.</p>
      </div>
    );
  }
  