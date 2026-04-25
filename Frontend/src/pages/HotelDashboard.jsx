import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, History, Clock, PieChart, CheckCircle, AlertCircle } from 'lucide-react';
import { donationService } from '../services/api';

const HotelDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'history'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [donations, setDonations] = useState([]);

  const [formData, setFormData] = useState({
    food_type: '',
    quantity: '',
    pickup_time: '',
    expiry_time: ''
  });

  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      if (editingId) {
        const response = await donationService.updateDonation(editingId, formData);
        if (response.data.success) {
          setMessage({ type: 'success', text: 'Donation updated successfully!' });
          setEditingId(null);
        }
      } else {
        const response = await donationService.addDonation({
          ...formData,
          hotel_id: user.id
        });
        if (response.data.success) {
          setMessage({ type: 'success', text: 'Donation listed successfully!' });
        }
      }
      setFormData({ food_type: '', quantity: '', pickup_time: '', expiry_time: '' });
      fetchDonations();
      if (editingId) setActiveTab('history');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || `Failed to ${editingId ? 'update' : 'add'} donation. Please try again.` });
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await donationService.getHotelDonations(user.id);
      if (response.data.success) {
        setDonations(response.data.donations);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    }
  };

  const handleEdit = (donation) => {
    setFormData({
      food_type: donation.food_type,
      quantity: donation.quantity,
      pickup_time: donation.pickup_time,
      expiry_time: donation.expiry_time
    });
    setEditingId(donation.donation_id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this donation?')) return;
    try {
      const response = await donationService.deleteDonation(id);
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Donation deleted successfully!' });
        fetchDonations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete donation.');
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hotel Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}. Manage your surplus food donations here.</p>
      </header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => { setActiveTab('add'); setEditingId(null); setFormData({ food_type: '', quantity: '', pickup_time: '', expiry_time: '' }); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: activeTab === 'add' && !editingId ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'add' && !editingId ? 'white' : 'var(--text-muted)', fontWeight: '600', transition: 'var(--transition)' }}
        >
          <Plus size={20} /> List New Donation
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: activeTab === 'history' ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'history' ? 'white' : 'var(--text-muted)', fontWeight: '600', transition: 'var(--transition)' }}
        >
          <History size={20} /> Donation History
        </button>
      </div>

      <motion.div 
        key={activeTab + editingId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'add' ? (
          <div className="glass" style={{ padding: '2.5rem', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={24} color="var(--primary)" /> {editingId ? 'Edit Donation' : 'Donation Details'}
            </h2>

            {message.text && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '0.5rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? 'var(--success)' : 'var(--error)', marginBottom: '1.5rem', border: '1px solid currentColor' }}>
                {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Food Type</label>
                <input 
                  type="text" 
                  name="food_type"
                  required
                  value={formData.food_type}
                  onChange={handleChange}
                  placeholder="e.g. Rice, Curry, Sandwiches"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Quantity (servings/kg)</label>
                <input 
                  type="number" 
                  name="quantity"
                  required
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 50"
                  style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Pickup Time</label>
                  <input 
                    type="time" 
                    name="pickup_time"
                    required
                    value={formData.pickup_time}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Expiry Time</label>
                  <input 
                    type="time" 
                    name="expiry_time"
                    required
                    value={formData.expiry_time}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ flex: 2, padding: '1rem', borderRadius: '0.5rem', background: 'var(--primary)', color: 'white', fontWeight: '700', fontSize: '1rem', transition: 'var(--transition)', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Processing...' : (editingId ? 'Update Donation' : 'Post Donation')}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={() => { setEditingId(null); setFormData({ food_type: '', quantity: '', pickup_time: '', expiry_time: '' }); setActiveTab('history'); }}
                    style={{ flex: 1, padding: '1rem', borderRadius: '0.5rem', background: 'var(--surface-light)', color: 'white', fontWeight: '600' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {donations.length === 0 ? (
              <div className="glass" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <p>No donations listed yet.</p>
              </div>
            ) : (
              donations.map((donation) => (
                <div key={donation.donation_id} className="glass" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: donation.status?.toLowerCase() === 'claimed' ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{donation.food_type}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      Quantity: {donation.quantity} • Posted: {new Date(donation.created_at).toLocaleDateString()}
                    </p>
                    {donation.status?.toLowerCase() === 'claimed' && (
                      <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.5rem' }}>
                        Claimed by: {donation.ngo_name}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                      Expires: {donation.expiry_time}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      {donation.status === 'available' && (
                        <>
                          <button 
                            onClick={() => handleEdit(donation)}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', background: 'var(--secondary)', color: 'white', fontSize: '0.8rem', fontWeight: '600' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(donation.donation_id)}
                            style={{ padding: '0.4rem 0.8rem', borderRadius: '0.4rem', background: 'rgba(239, 68, 68, 0.2)', color: 'var(--error)', fontSize: '0.8rem', fontWeight: '600', border: '1px solid var(--error)' }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      <div style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', background: donation.status?.toLowerCase() === 'claimed' ? 'var(--primary-light)' : 'var(--primary)', color: donation.status?.toLowerCase() === 'claimed' ? 'var(--primary-dark)' : 'white', fontSize: '0.85rem', fontWeight: '700' }}>
                        {donation.status?.toLowerCase() === 'claimed' ? 'Claimed' : 'Available'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default HotelDashboard;
