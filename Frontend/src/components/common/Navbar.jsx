import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, LogOut, User } from 'lucide-react';
import { authService } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 1000 }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.5rem', color: 'var(--primary)' }}>
        <Utensils size={32} />
        <span>FoodShare</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {user ? (
          <>
            <Link to={user.role === 'hotel' ? '/hotel-dashboard' : '/ngo-dashboard'} style={{ color: 'var(--text-muted)', transition: 'var(--transition)' }} onMouseEnter={(e) => e.target.style.color = 'var(--text)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
              Dashboard
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '2rem', background: 'var(--surface-light)' }}>
                <User size={18} />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} style={{ background: 'none', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: '500' }}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/login" style={{ padding: '0.6rem 1.5rem', borderRadius: '0.5rem', transition: 'var(--transition)' }}>Login</Link>
            <Link to="/register" style={{ background: 'var(--primary)', color: 'white', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600', transition: 'var(--transition)' }}>Join Now</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
