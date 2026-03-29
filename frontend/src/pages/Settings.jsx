import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { updateProfile, updatePassword } from '../api';

export default function Settings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch { }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    if (pass.newPassword !== pass.confirmPassword) {
      setPassError('Passwords do not match');
      return;
    }
    if (pass.newPassword.length < 6) {
      setPassError('Password must be at least 6 characters');
      return;
    }
    try {
      await updatePassword(pass);
      setPassMsg('Password updated successfully!');
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassError(err.response?.data?.error || 'Failed to update password');
    }
  };

  return (
    <div className="page-container bg-bg/50">
      <div style={{ maxWidth: '48rem', margin: '0 auto', padding: '0 24px 64px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-black text-dark tracking-tight">Account Configuration</h1>
            <p className="text-gray font-medium mt-2">Manage your administrative profile and security protocols</p>
          </div>

          <div className="grid gap-8">
            {/* Profile */}
            <section className="premium-card border-none shadow-premium bg-white relative" style={{ padding: '48px', paddingBottom: '80px', overflow: 'visible' }}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-dark tracking-tight">Identity Settings</h2>
                  <p className="text-[10px] font-black text-gray/40 uppercase tracking-widest mt-0.5">Public profile and contact information</p>
                </div>
              </div>

              {profileMsg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {profileMsg}
                </motion.div>
              )}

              <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-3 block ml-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      style={{ height: '56px', padding: '0 24px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', width: '100%', maxWidth: '448px' }}
                      className="focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                      placeholder="e.g. XYZ Pharmacies"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-3 block ml-1">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      style={{ height: '56px', padding: '0 24px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', width: '100%', maxWidth: '448px' }}
                      className="focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                      placeholder="name@organization.com"
                    />
                  </div>
                </div>
                <div style={{ paddingTop: '24px' }}>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#2563EB', color: 'white', padding: '16px 40px', borderRadius: '16px', border: 'none', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                      className="shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:scale-95"
                    >
                    Commit Profile Updates
                  </button>
                </div>
              </form>
            </section>

            {/* Password */}
            <section className="premium-card border-none shadow-premium bg-white relative" style={{ padding: '48px', paddingBottom: '80px', overflow: 'visible' }}>
              <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500/20" />
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-black text-dark tracking-tight">Security Credentials</h2>
                  <p className="text-[10px] font-black text-gray/40 uppercase tracking-widest mt-0.5">Authentication and data protection</p>
                </div>
              </div>

              {passMsg && (
                <div className="mb-8 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {passMsg}
                </div>
              )}
              {passError && (
                <div className="mb-8 p-4 bg-rose-50 text-rose-500 rounded-2xl text-xs font-bold border border-rose-100 flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {passError}
                </div>
              )}

              <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {[
                    { key: 'currentPassword', stateKey: 'current', label: 'Existing Password', placeholder: '••••••••' },
                    { key: 'newPassword', stateKey: 'new', label: 'Novel Password', placeholder: 'Minimum 8 characters' },
                    { key: 'confirmPassword', stateKey: 'confirm', label: 'Verify Novel Password', placeholder: 'Repeat new password' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-black text-gray uppercase tracking-widest mb-3 block ml-1">{field.label}</label>
                      <div className="relative">
                        <input
                          type={showPass[field.stateKey] ? "text" : "password"}
                          value={pass[field.key]}
                          onChange={(e) => setPass({ ...pass, [field.key]: e.target.value })}
                          style={{ height: '56px', padding: '0 24px', backgroundColor: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '12px', outline: 'none', width: '100%', maxWidth: '448px' }}
                          className="focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 transition-all font-bold text-sm"
                          placeholder={field.placeholder}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass({ ...showPass, [field.stateKey]: !showPass[field.stateKey] })}
                          style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}
                        >
                          {showPass[field.stateKey] ? (
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
                  ))}
                </div>
                <div style={{ paddingTop: '24px' }}>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#0F172A', color: 'white', padding: '16px 40px', borderRadius: '16px', border: 'none', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '12px', cursor: 'pointer', transition: 'all 0.3s' }}
                    className="shadow-xl shadow-dark/10 hover:shadow-dark/25 hover:-translate-y-1 active:scale-95"
                  >
                    Authorize Password Reset
                  </button>
                </div>
              </form>
            </section>
          </div>
        </motion.div>
      </div>
    </div>

  );
}
