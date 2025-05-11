// src/components/Layout.jsx
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '1rem', background: '#fafafa' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

