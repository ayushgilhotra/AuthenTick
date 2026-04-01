import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

const roles = [
  { key: 'ADMIN', label: 'Manufacturer', icon: '🏭', desc: 'Register products & batches', color: '#2563EB' },
  { key: 'RETAILER', label: 'Retailer', icon: '🏪', desc: 'Verify stock authenticity', color: '#F59E0B' },
  { key: 'CUSTOMER', label: 'Customer', icon: '👤', desc: 'Verify your purchases', color: '#22C55E' },
];

export default function Register() {
  const [selectedRole, setSelectedRole] = useState('CUSTOMER');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ ...formData, role: selectedRole });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 48px' }} className="page-container bg-gray-50/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', maxWidth: '520px' }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
          <img src="/logo.svg" alt="AuthenTick" style={{ width: '48px', height: '48px' }} />
          <span style={{ fontSize: '26px', fontWeight: 500, color: '#1E293B', fontFamily: "'Inter', sans-serif" }}>Authen<span style={{ fontWeight: 700, color: '#2563EB' }}>Tick</span></span>
        </div>

        {/* Role Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '28px' }}>
          {roles.map(role => {
            const isActive = selectedRole === role.key;
            return (
              <button key={role.key}
                onClick={() => { setSelectedRole(role.key); setError(''); }}
                style={{
                  padding: '20px 12px', borderRadius: '16px', border: isActive ? `2px solid ${role.color}` : '2px solid #F1F5F9',
                  background: isActive ? `${role.color}08` : '#FFF', cursor: 'pointer', transition: 'all 0.25s',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                  boxShadow: isActive ? `0 4px 16px ${role.color}20` : 'none',
                }}>
                <span style={{ fontSize: '28px' }}>{role.icon}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? role.color : '#64748B' }}>{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Card */}
        <div style={{ background: '#FFF', borderRadius: '24px', padding: '36px', border: '1px solid #F1F5F9', boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '4px', textAlign: 'center' }} className="text-dark">
            Create Account
          </h1>
          <p style={{ fontSize: '13px', fontWeight: 300, textAlign: 'center', marginBottom: '28px' }} className="text-gray">
            Register as {roles.find(r => r.key === selectedRole)?.label}
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Full Name</label>
              <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={selectedRole === 'CUSTOMER' ? 'e.g. xyz' : selectedRole === 'ADMIN' ? 'e.g. xyz Pharma Pvt. Ltd.' : 'e.g. ABC Retailers'}
                style={{ width: '100%', padding: '16px 20px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Email</label>
              <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder={selectedRole === 'CUSTOMER' ? 'xyz@gmail.com' : selectedRole === 'ADMIN' ? 'xyz@organisation.in' : 'name@example.com'}
                style={{ width: '100%', padding: '16px 20px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" />
            </div>

            {selectedRole === 'CUSTOMER' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Phone Number <span style={{ color: '#CBD5E1' }}>(optional)</span></label>
                <input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="98765*****"
                  style={{ width: '100%', padding: '16px 20px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                  className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Password</label>
              <div style={{ position: 'relative' }}>
                <input required type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Minimum 6 characters"
                  style={{ width: '100%', padding: '16px 50px 16px 20px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                  className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex' }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {showPassword ?
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /> :
                      <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>
                    }
                  </svg>
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2' }} className="bg-red-50 text-red-600">
                {error}
              </div>
            )}

            <button disabled={loading} type="submit"
              style={{ width: '100%', padding: '16px', borderRadius: '14px', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
              className="bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 300 }} className="text-gray">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
