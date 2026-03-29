import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemo = (role) => {
    const email = role === 'ADMIN' ? 'abc@gmail.com' : 'retailer@gmail.com';
    setFormData({ email, password: 'password' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px 48px' }} className="page-container bg-gray-50/50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.8 }}
        style={{ width: '100%', maxWidth: '1152px', display: 'flex', flexDirection: 'row', borderRadius: '32px', overflow: 'hidden', minHeight: '600px' }}
        className="shadow-2xl border border-gray-100 bg-white"
      >
        {/* Left Side: Brand Story */}
        <div 
          style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '64px', position: 'relative', overflow: 'hidden' }}
          className="bg-dark login-left-panel"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-40" />
          
          <div className="relative z-10 text-white w-full" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-white/10 backdrop-blur-xl border border-white/20">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.2, color: 'white' }}>Enterprise Infrastructure</h2>
              <p style={{ fontSize: '1.125rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, maxWidth: '24rem', lineHeight: 1.6 }}>Secure pharmaceutical verification and reporting network.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-white/5 border border-white/10">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.025em' }}>End-to-end encryption</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-white/5 border border-white/10">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.025em' }}>Real-time status nodes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div 
          style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 80px', minHeight: '600px' }}
          className="bg-gray-50/20 login-right-panel"
        >
          <div style={{ maxWidth: '384px', margin: '0 auto', width: '100%' }}>
            <div style={{ marginBottom: '40px' }}>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '8px' }} className="text-dark">Login</h1>
              <p style={{ fontSize: '0.875rem', fontWeight: 300 }} className="text-gray">Authentication required for node access.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Network Identifier</label>
                    <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email address"
                    style={{ width: '100%', padding: '16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                    className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingLeft: '4px' }} className="text-gray">Security Token</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                      style={{ width: '100%', padding: '16px 50px 16px 24px', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', fontSize: '0.875rem', fontWeight: 500, boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
                      className="bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
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
              </div>

              {error && (
                <div style={{ padding: '16px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2' }} className="bg-red-50 text-red-600">
                   {error}
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                style={{ width: '100%', padding: '16px', borderRadius: '16px', fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
                className="bg-dark text-white hover:bg-black transition-all shadow-xl shadow-gray-200"
              >
                {loading ? 'Validating...' : 'Access Node'}
              </button>

              <div style={{ position: 'relative', padding: '16px 0' }}>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}><div style={{ width: '100%', borderTop: '1px solid #F3F4F6' }}></div></div>
                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}><span style={{ padding: '0 8px' }} className="bg-white text-gray/40">Developer Access</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  type="button"
                  onClick={() => handleDemo('ADMIN')}
                  style={{ padding: '12px 16px', border: '1px solid #F3F4F6', borderRadius: '12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  className="bg-white text-dark hover:bg-gray-50 transition-all"
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3B82F6' }}></span>
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('RETAILER')}
                  style={{ padding: '12px 16px', border: '1px solid #F3F4F6', borderRadius: '12px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  className="bg-white text-dark hover:bg-gray-50 transition-all"
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }}></span>
                  Retailer Demo
                </button>
              </div>
            </form>

            <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F1F5F9', padding: '4px', borderRadius: '99px' }}>
                <Link to="/register" style={{ padding: '8px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, textDecoration: 'none', color: '#64748B', transition: 'all 0.2s' }}>Sign Up</Link>
                <div style={{ padding: '8px 20px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, background: 'white', color: '#0F172A', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>Sign In</div>
              </div>
              <p style={{ fontSize: '0.875rem', fontWeight: 300 }} className="text-gray">
                New node? <Link to="/register" className="text-primary font-bold hover:underline">Register Account</Link>
              </p>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
