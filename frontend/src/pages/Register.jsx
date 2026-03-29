import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'RETAILER' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 48px' }} className="page-container bg-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '1280px', display: 'flex', flexDirection: 'row', borderRadius: '32px', overflow: 'hidden', minHeight: '650px' }}
        className="shadow-2xl border border-gray-100 bg-white"
      >
        {/* Left Side: Brand Story */}
        <div 
          style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', position: 'relative', overflow: 'hidden' }}
          className="bg-dark register-left-panel"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-40" />
          
          <div className="relative z-10 text-white w-full" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-primary/20 border border-white/10">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, color: 'white' }}>Supply Chain <br /><span className="text-primary" style={{ fontStyle: 'italic' }}>Integrity.</span></h2>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.5)', fontWeight: 300, maxWidth: '24rem', lineHeight: 1.6 }}>Join the global network of verified pharmaceutical nodes.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '2px', height: '48px', borderRadius: '9999px' }} className="bg-primary/30" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Cryptographic Trust</h4>
                  <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Immutable tracking for every medical asset.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '2px', height: '48px', borderRadius: '9999px' }} className="bg-primary/30" />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>Verification Node</h4>
                  <p style={{ fontSize: '0.875rem', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Verify authenticity at any point with instant results.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div 
          style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 80px', minHeight: '650px' }}
          className="bg-gray-50/20 register-right-panel"
        >
          <div style={{ maxWidth: '448px', margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '8px' }} className="text-dark">Create Account</h1>
              <p style={{ fontSize: '0.875rem', fontWeight: 300 }} className="text-gray">Initialize your member node for network access.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Full Identity</label>
                  <input
                  required type="text" value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. XYZ Pharmacies"
                  style={{ width: '100%', padding: '16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                  className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Network Email</label>
                  <input
                  required type="email" value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="name@organization.com"
                  style={{ width: '100%', padding: '16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                  className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Node Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  style={{ width: '100%', padding: '16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500, appearance: 'none', cursor: 'pointer' }}
                  className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                >
                  <option value="RETAILER">Authorized Retailer</option>
                  <option value="ADMIN">Manufacturer Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '8px' }}>
                <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Security Token</label>
                <div style={{ position: 'relative' }}>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create secure password"
                    style={{ width: '100%', padding: '16px 50px 16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500 }}
                    className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{ padding: '16px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2' }} className="bg-red-50 text-red-600">
                  {error}
                </div>
              )}

              <button
                disabled={loading} type="submit"
                style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', marginTop: '8px', opacity: loading ? 0.5 : 1 }}
                className="bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
              >
                {loading ? 'Initializing...' : 'Register Member'}
              </button>

              <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F1F5F9', padding: '4px', borderRadius: '99px' }}>
                  <div style={{ padding: '8px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, background: 'white', color: '#0F172A', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Sign Up</div>
                  <Link to="/login" style={{ padding: '8px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', color: '#64748B', transition: 'all 0.2s' }}>Sign In</Link>
                </div>
                <p style={{ fontSize: '0.875rem', fontWeight: 300 }} className="text-gray">
                  Already have a node? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
              </div>
            </form>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
