import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, AlertCircle, Building2, Heart } from 'lucide-react';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'hotel'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await authService.register(formData);
      if (response.data.success) {
        navigate('/login', { state: { message: 'Registration successful! Please login.' } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', padding: '2rem 0' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass" 
        style={{ padding: '3rem', width: '100%', maxWidth: '500px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Join Us</h2>
          <p style={{ color: 'var(--text-muted)' }}>Create an account to start sharing</p>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name / Organization Name</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                name="full_name"
                required
                value={formData.full_name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                placeholder="John Doe or Green Hotel"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div 
                onClick={() => setFormData({...formData, role: 'hotel'})}
                style={{ cursor: 'pointer', padding: '1rem', borderRadius: '0.5rem', border: '1px solid', borderColor: formData.role === 'hotel' ? 'var(--primary)' : 'var(--glass-border)', background: formData.role === 'hotel' ? 'rgba(16, 185, 129, 0.1)' : 'var(--surface)', textAlign: 'center', transition: 'var(--transition)' }}
              >
                <Building2 size={24} style={{ marginBottom: '0.5rem', color: formData.role === 'hotel' ? 'var(--primary)' : 'var(--text-muted)' }} />
                <div style={{ fontWeight: '600', color: formData.role === 'hotel' ? 'var(--primary)' : 'var(--text-muted)' }}>Hotel</div>
              </div>
              <div 
                onClick={() => setFormData({...formData, role: 'ngo'})}
                style={{ cursor: 'pointer', padding: '1rem', borderRadius: '0.5rem', border: '1px solid', borderColor: formData.role === 'ngo' ? 'var(--secondary)' : 'var(--glass-border)', background: formData.role === 'ngo' ? 'rgba(59, 130, 246, 0.1)' : 'var(--surface)', textAlign: 'center', transition: 'var(--transition)' }}
              >
                <Heart size={24} style={{ marginBottom: '0.5rem', color: formData.role === 'ngo' ? 'var(--secondary)' : 'var(--text-muted)' }} />
                <div style={{ fontWeight: '600', color: formData.role === 'ngo' ? 'var(--secondary)' : 'var(--text-muted)' }}>NGO</div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'var(--transition)', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={20} /> Register</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
