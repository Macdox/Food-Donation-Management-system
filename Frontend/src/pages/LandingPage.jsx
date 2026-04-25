import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Heart, Shield, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page" style={{ padding: '4rem 0' }}>
      <section style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ fontSize: '4rem', fontWeight: '800', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          Connecting Surplus Food <br /> to Those in Need
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem' }}
        >
          FoodShare is a bridge between hotels with surplus food and NGOs working to eliminate hunger. Join our mission to reduce food waste and feed the hungry.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}
        >
          <Link to="/register" style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '0.75rem', fontWeight: '700', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 10px 20px -10px var(--primary)' }}>
            Get Started <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="glass" style={{ padding: '1rem 2.5rem', fontWeight: '600', fontSize: '1.1rem' }}>
            Login
          </Link>
        </motion.div>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {[
          { icon: <Zap size={32} color="var(--primary)" />, title: 'Real-time Updates', desc: 'NGOs get instant notifications when hotels add new surplus food.' },
          { icon: <Shield size={32} color="var(--secondary)" />, title: 'Secure Platform', desc: 'Verified accounts for both hotels and NGOs to ensure safe food distribution.' },
          { icon: <Heart size={32} color="var(--error)" />, title: 'Make an Impact', desc: 'Every donation counts. Help us reduce food waste and fight hunger together.' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
            className="glass" 
            style={{ padding: '2.5rem', textAlign: 'center' }}
          >
            <div style={{ marginBottom: '1.5rem', display: 'inline-block', padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.05)' }}>
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default LandingPage;
