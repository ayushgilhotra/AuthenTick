import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/customer', label: 'Verify', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/customer/history', label: 'History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/customer/reports', label: 'Reports', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  { path: '/customer/profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const location = useLocation();

  if (user?.role !== 'CUSTOMER') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="bg-gray-50">
      {/* Desktop top nav */}
      <div className="hidden md:block" style={{ background: '#FFF', borderBottom: '1px solid #F1F5F9', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 800, fontSize: '13px' }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{user?.name}</span>
          </div>
          <nav style={{ display: 'flex', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}
                  style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: isActive ? 700 : 500, textDecoration: 'none', transition: 'all 0.2s', color: isActive ? '#2563EB' : '#64748B', background: isActive ? '#EFF6FF' : 'transparent' }}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: '800px', margin: '0 auto', width: '100%', padding: '24px 16px 100px' }}>
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#FFF', borderTop: '1px solid #F1F5F9', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '8px 0' }}>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 12px', textDecoration: 'none', transition: 'all 0.2s', color: isActive ? '#2563EB' : '#94A3B8', minWidth: '64px' }}>
                <svg style={{ width: '22px', height: '22px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
                </svg>
                <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
