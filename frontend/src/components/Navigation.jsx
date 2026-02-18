import { Link, useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';

function Navigation() {
  const navigate = useNavigate();
  const { auth, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', gap: '12px', padding: '12px', borderBottom: '1px solid #ccc' }}>
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
      <Link to="/dashboard/client">Client Dashboard</Link>
      <Link to="/dashboard/psw">PSW Dashboard</Link>
      <Link to="/dashboard/admin">Admin Dashboard</Link>
      {isAuthenticated ? (
        <>
          <span>Role: {auth.role}</span>
          <button type="button" onClick={handleLogout}>Logout</button>
        </>
      ) : null}
    </nav>
  );
}

export default Navigation;
