import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Breadcrumb from '../../components/Breadcrumb';
import { motion, AnimatePresence } from 'framer-motion';

const adminLinks = [
  { path: '/dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/dashboard/medicines', label: 'Medicines', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { path: '/dashboard/batches', label: 'Batches', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/dashboard/analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { path: '/dashboard/reports', label: 'Reports', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { path: '/dashboard/activity-log', label: 'Activity Log', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const retailerLinks = [
  { path: '/dashboard', label: 'Scan History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/dashboard/verify', label: 'Verify Stock', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar-collapsed') === 'true');
  const [mobileOpen, setMobileOpen] = useState(false);

  if (user?.role === 'CUSTOMER') {
    return <Navigate to="/customer" replace />;
  }

  const links = user?.role === 'ADMIN' ? adminLinks : retailerLinks;
  const roleLabel = user?.role === 'ADMIN' ? 'Manufacturer' : 'Retailer';
  const sidebarWidth = collapsed ? '72px' : '268px';

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const SidebarContent = ({ isMobile = false }) => (
    <div style={{ padding: collapsed && !isMobile ? '24px 10px' : '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
      {/* User Info */}
      {(!collapsed || isMobile) && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '16px',
          background: 'var(--bg-surface-hover, #F8FAFC)', borderRadius: '14px',
          border: '1px solid var(--border-color, #F1F5F9)',
        }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 800, fontSize: '15px', flexShrink: 0,
          }}>
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 5px 0' }}>{roleLabel}</p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary, #0F172A)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</p>
          </div>
        </div>
      )}
      {collapsed && !isMobile && (
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', margin: '0 auto',
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 800, fontSize: '15px',
        }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      )}

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {(!collapsed || isMobile) && (
          <p style={{ padding: '0 8px', fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.5)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>
            {user?.role === 'ADMIN' ? 'Management' : 'Verification'}
          </p>
        )}
        {links.map(link => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => isMobile && setMobileOpen(false)}
              title={collapsed && !isMobile ? link.label : undefined}
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: collapsed && !isMobile ? '12px' : '12px 14px',
                borderRadius: '12px', textDecoration: 'none', transition: 'all 0.2s ease',
                background: isActive ? '#2563EB' : 'transparent',
                color: isActive ? 'white' : 'var(--text-secondary, #64748B)',
                boxShadow: isActive ? '0 4px 12px rgba(37,99,235,0.2)' : 'none',
                fontWeight: isActive ? 700 : 500, fontSize: '14px',
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                borderLeft: isActive ? '3px solid #FFF' : '3px solid transparent',
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'var(--bg-surface-hover, #F8FAFC)'; e.currentTarget.style.color = 'var(--text-primary, #0F172A)'; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary, #64748B)'; } }}
            >
              <svg style={{ width: '20px', height: '20px', flexShrink: 0, color: isActive ? 'white' : 'var(--text-muted, #94A3B8)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              {(!collapsed || isMobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch', minHeight: '100vh' }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: sidebarWidth, flexShrink: 0, transition: 'width 0.25s ease',
        background: 'var(--bg-surface, #FFF)', borderRight: '1px solid var(--border-color, #F1F5F9)',
        position: 'sticky', top: 0, height: '100vh', zIndex: 40, display: 'none',
      }} className="sidebar-desktop">
        <SidebarContent />
        {/* Collapse Toggle */}
        <button onClick={handleCollapse}
          style={{
            position: 'absolute', top: '50%', right: '-14px', transform: 'translateY(-50%)',
            width: '28px', height: '28px', borderRadius: '50%', border: '1px solid var(--border-color, #E5E7EB)',
            background: 'var(--bg-surface, #FFF)', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="var(--text-muted, #94A3B8)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d={collapsed ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'} />
          </svg>
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 60 }} />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: '280px', zIndex: 70,
                background: 'var(--bg-surface, #FFF)', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                borderRight: '1px solid var(--border-color, #F1F5F9)',
              }}
            >
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
                  <svg width="24" height="24" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <SidebarContent isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        {/* Mobile hamburger */}
        <div className="md:hidden" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color, #F1F5F9)' }}>
          <button onClick={() => setMobileOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}>
            <svg width="24" height="24" fill="none" stroke="var(--text-secondary)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>
        <div style={{ padding: '24px 40px', maxWidth: '1400px' }} className="dashboard-content">
          <Breadcrumb />
          <Outlet />
        </div>
      </main>

      <style>{`
        @media (min-width: 768px) {
          .sidebar-desktop { display: block !important; }
        }
        @media (max-width: 768px) {
          .dashboard-content { padding: 16px !important; }
        }
      `}</style>
    </div>
  );
}
