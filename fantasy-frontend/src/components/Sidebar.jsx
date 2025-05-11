import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <NavLink to="/classificacio" className={({ isActive }) => isActive ? 'active' : ''}>
        Classificació
      </NavLink>
      <NavLink to="/alineacio" className={({ isActive }) => isActive ? 'active' : ''}>
        Alineació
      </NavLink>
      <NavLink to="/mercat" className={({ isActive }) => isActive ? 'active' : ''}>
        Mercat
      </NavLink>
    </nav>
  );
}
