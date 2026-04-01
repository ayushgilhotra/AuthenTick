import React from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const adminLinks = [
  { path: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/dashboard/medicines', label: 'Medicines', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { path: '/dashboard/batches', label: 'Batches', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/dashboard/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const retailerLinks = [
  { path: '/dashboard', label: 'Scan History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/dashboard/verify', label: 'Verify Stock', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();

  // Redirect customers to their own dashboard
  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/customer" replace />;
  }

  const links = user?.role === 'ADMIN' ? adminLinks : retailerLinks;
  const roleLabel = user?.role === 'ADMIN' ? 'Manufacturer' : 'Retailer';

  return (
    <div 
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: '100vh' }}
      className="bg-gray-50 relative"
    >
      {/* Dashboard Sidebar */}
      <aside 
        style={{ width: '288px', flexShrink: 0 }}
        className="bg-white border-r border-gray-100 hidden md:block sticky top-0 h-screen z-40"
      >
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px', height: '100%' }}>
          {/* User Info Card */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: '#F8FAFC',
            borderRadius: '14px',
            border: '1px solid #F1F5F9',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '15px',
              flexShrink: 0,
            }}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1, margin: '0 0 5px 0' }}>{roleLabel}</p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <p style={{ padding: '0 8px', fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
              {user?.role === 'ADMIN' ? 'Management' : 'Verification'}
            </p>
            {links.map(link => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    background: isActive ? '#2563EB' : 'transparent',
                    color: isActive ? 'white' : '#64748B',
                    boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#F8FAFC';
                      e.currentTarget.style.color = '#0F172A';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#64748B';
                    }
                  }}
                >
                  <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: isActive ? 'white' : '#94A3B8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto min-w-0">
        <div className="w-full max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
