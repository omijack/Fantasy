import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Layout from './components/Layout';
import Classificacio from './pages/Classificacio';
import Alineacio from './pages/Alineacio';
import Mercat from './pages/Mercat';
import Benvinguda from './pages/Benvinguda'

// Protecció de rutes
function RequireAuth({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Routes>
      {/* Ruta pública per login */}
      <Route path="/login" element={<Login />} />

      {/* Ruta protegida amb layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
         <Route index element={<Benvinguda />} />
        <Route path="classificacio" element={<Classificacio />} />
        <Route path="alineacio" element={<Alineacio />} />
        <Route path="mercat" element={<Mercat />} />
      </Route>
    </Routes>
  );
}
