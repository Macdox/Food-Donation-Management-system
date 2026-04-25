import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, User, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { donationService } from '../services/api';

const NGODashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('available'); // 'available' or 'my-claims'

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const response = activeTab === 'available' 
        ? await donationService.getAvailableDonations()
        : await donationService.getNGODonations(user.id);
        
      if (response.data.success) {
        setDonations(response.data.donations);
      }
    } catch (err) {
      console.error('Error fetching donations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [activeTab]);

  const filteredDonations = donations.filter(d => 
    d.food_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClaim = async (donationId) => {
    try {
      const response = await donationService.claimDonation(donationId, user.id);
      if (response.data.success) {
        alert('Donation claimed successfully!');
        fetchDonations();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim donation.');
    }
  };

  return (
    <div style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Available Donations</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome, {user.name}. Browse and claim surplus food for your cause.</p>
        </div>
        
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search food type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '0.5rem', background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'white', outline: 'none' }}
          />
        </div>
      </header>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('available')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: activeTab === 'available' ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'available' ? 'white' : 'var(--text-muted)', fontWeight: '600', transition: 'var(--transition)' }}
        >
          <ShoppingBag size={20} /> Available Donations
        </button>
        <button 
          onClick={() => setActiveTab('my-claims')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', background: activeTab === 'my-claims' ? 'var(--primary)' : 'var(--surface)', color: activeTab === 'my-claims' ? 'white' : 'var(--text-muted)', fontWeight: '600', transition: 'var(--transition)' }}
        >
          <CheckCircle size={20} /> Past Orders
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid var(--glass)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading donations...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
          {filteredDonations.length === 0 ? (
            <div className="glass" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>{activeTab === 'available' ? 'No donations available matching your search.' : 'You haven’t claimed any donations yet.'}</p>
            </div>
          ) : (
            filteredDonations.map((donation, index) => (
              <motion.div 
                key={donation.donation_id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass" 
                style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', border: donation.status?.toLowerCase() === 'claimed' ? '1px solid var(--primary)' : '1px solid var(--glass-border)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{donation.food_type}</h3>
                  <div style={{ padding: '0.4rem 0.8rem', borderRadius: '2rem', background: donation.status?.toLowerCase() === 'claimed' ? 'var(--primary-light)' : 'rgba(255,255,255,0.1)', color: donation.status?.toLowerCase() === 'claimed' ? 'var(--primary-dark)' : 'var(--text)', fontSize: '0.85rem', fontWeight: '700' }}>
                    {donation.status?.toLowerCase() === 'claimed' ? 'Claimed' : donation.quantity}
                  </div>
                </div>

                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                    <MapPin size={18} />
                    <span>Hotel: {donation.hotel_name || `ID: ${donation.hotel_id}`}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                    <Calendar size={18} />
                    <span>Pickup Time: {donation.pickup_time}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                    <Clock size={18} />
                    <span>Expires: {donation.expiry_time} • Posted: {new Date(donation.created_at).toLocaleDateString()}</span>
                  </div>
                  {donation.status?.toLowerCase() === 'claimed' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: '600' }}>
                      <CheckCircle size={18} />
                      <span>Claimed by: {donation.ngo_name}</span>
                    </div>
                  )}
                </div>

                {donation.status?.toLowerCase() === 'available' && (
                  <button 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', background: 'var(--secondary)', color: 'white', fontWeight: '700', transition: 'var(--transition)' }}
                    onClick={() => handleClaim(donation.donation_id)}
                  >
                    Claim Donation
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default NGODashboard;
