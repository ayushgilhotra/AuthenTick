import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, updatePassword } from '../../api';
import { useNavigate } from 'react-router-dom';

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [pass, setPass] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      setProfileMsg('Profile updated!');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch {}
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    setPassError('');
    if (pass.newPassword !== pass.confirmPassword) { setPassError('Passwords do not match'); return; }
    if (pass.newPassword.length < 6) { setPassError('Min 6 characters'); return; }
    try {
      await updatePassword(pass);
      setPassMsg('Password updated!');
      setPass({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassError(err.response?.data?.error || 'Failed');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Profile</h1>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#64748B', marginTop: '4px' }}>Manage your account settings.</p>
      </div>

      {/* Profile Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '20px' }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>{user?.name}</p>
            <p style={{ fontSize: '13px', color: '#94A3B8' }}>{user?.email}</p>
          </div>
        </div>

        {profileMsg && <div style={{ padding: '12px', borderRadius: '12px', background: '#F0FDF4', color: '#22C55E', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>✅ {profileMsg}</div>}

        <form onSubmit={handleProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>Full Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '15px' }}
              className="bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '15px' }}
              className="bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
            Save Changes
          </button>
        </form>
      </div>

      {/* Password Card */}
      <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
        <h3 style={{ fontWeight: 800, fontSize: '16px', color: '#0F172A', marginBottom: '16px' }}>🔒 Change Password</h3>
        {passMsg && <div style={{ padding: '12px', borderRadius: '12px', background: '#F0FDF4', color: '#22C55E', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>✅ {passMsg}</div>}
        {passError && <div style={{ padding: '12px', borderRadius: '12px', background: '#FEF2F2', color: '#EF4444', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>⚠️ {passError}</div>}
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { key: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
            { key: 'newPassword', label: 'New Password', placeholder: 'Minimum 6 characters' },
            { key: 'confirmPassword', label: 'Confirm Password', placeholder: 'Repeat new password' },
          ].map(field => (
            <div key={field.key}>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>{field.label}</label>
              <input type="password" value={pass[field.key]} onChange={(e) => setPass({...pass, [field.key]: e.target.value})} placeholder={field.placeholder}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #F3F4F6', borderRadius: '14px', outline: 'none', fontSize: '15px' }}
                className="bg-gray-50 focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          ))}
          <button type="submit" style={{ padding: '14px', borderRadius: '14px', border: 'none', background: '#0F172A', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>
            Update Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', border: '1px solid #FEE2E2' }}>
        <h3 style={{ fontWeight: 800, fontSize: '16px', color: '#EF4444', marginBottom: '12px' }}>⚠️ Danger Zone</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={handleLogout}
            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E5E7EB', background: '#FFF', fontWeight: 700, cursor: 'pointer', color: '#64748B' }}>
            Log Out
          </button>
          <button onClick={() => setShowDeleteConfirm(true)}
            style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#FEF2F2', color: '#EF4444', fontWeight: 700, cursor: 'pointer' }}>
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</p>
            <h3 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '8px' }}>Delete Account?</h3>
            <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '24px' }}>This action cannot be undone. All your data will be permanently deleted.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E5E7EB', background: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { logout(); navigate('/login'); }} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#EF4444', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
