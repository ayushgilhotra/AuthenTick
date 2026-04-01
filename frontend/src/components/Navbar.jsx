import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handleClick = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [drawerOpen]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!drawerOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(255,255,255,0.92)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: '1px solid #F1F5F9',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const innerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    height: '72px',
    gap: '12px',
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    color: 'inherit',
  };

  const hamburgerBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid #E5E7EB',
    background: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.25)',
    zIndex: 200,
    backdropFilter: 'blur(2px)',
    WebkitBackdropFilter: 'blur(2px)',
  };

  const drawerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '320px',
    maxWidth: '85vw',
    background: '#FFFFFF',
    zIndex: 210,
    boxShadow: '8px 0 30px rgba(0,0,0,0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  };

  const drawerHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px',
    borderBottom: '1px solid #F1F5F9',
  };

  const closeButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: '#F8FAFC',
    cursor: 'pointer',
    color: '#64748B',
    transition: 'all 0.2s ease',
  };

  const menuItemStyle = (isRed = false) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '14px 24px',
    fontSize: '14px',
    fontWeight: 600,
    color: isRed ? '#EF4444' : '#334155',
    textDecoration: 'none',
    border: 'none',
    background: 'transparent',
    width: '100%',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    borderRadius: '0',
    textAlign: 'left',
  });

  const dividerStyle = {
    height: '1px',
    background: '#F1F5F9',
    margin: '8px 24px',
  };

  const iconBoxStyle = (isRed = false) => ({
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: isRed ? 'rgba(239,68,68,0.06)' : '#F1F5F9',
    flexShrink: 0,
    color: isRed ? '#EF4444' : '#64748B',
  });

  // Public menu items (visible to everyone)
  const publicMenuItems = [
    {
      label: 'Home',
      to: '/',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Verify',
      to: '/verify',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Help',
      to: '/help',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Contact',
      to: '/contact',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  // Authenticated-only menu items
  const dashboardPath = user?.role === 'CUSTOMER' ? '/customer' : '/dashboard';
  const authMenuItems = [
    {
      label: user?.role === 'CUSTOMER' ? 'My Dashboard' : 'Control Panel',
      to: dashboardPath,
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      label: 'Configuration',
      to: '/settings',
      icon: (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  // Build final menu items based on auth state
  const menuItems = isAuthenticated
    ? [
        ...authMenuItems,
        'divider',
        ...publicMenuItems.filter(i => i.label !== 'Home'),
        'divider',
        {
          label: 'Terminate Session',
          action: handleLogout,
          isRed: true,
          icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ),
        },
      ]
    : [
        ...publicMenuItems,
        'divider',
        {
          label: 'Log In',
          to: '/login',
          icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ),
        },
        {
          label: 'Get Started',
          to: '/register',
          isHighlight: true,
          icon: (
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          ),
        },
      ];

  return (
    <>
      <nav style={navbarStyle}>
        <div style={innerStyle}>
          {/* Hamburger icon — left of logo */}
          <button
            id="hamburger-menu-btn"
            style={hamburgerBtnStyle}
            onClick={() => setDrawerOpen(true)}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.borderColor = '#D1D5DB';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.borderColor = '#E5E7EB';
            }}
            aria-label="Open menu"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#334155">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <img src="/logo.svg" alt="AuthenTick" style={{ width: '36px', height: '36px' }} />
            <span style={{
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              color: '#1E293B',
              fontFamily: "'Inter', sans-serif",
            }}>
              Authen<span style={{ fontWeight: 700, color: '#2563EB' }}>Tick</span>
            </span>
          </Link>

          {/* Spacer pushes nothing — rest of navbar is clean/empty */}
          <div style={{ flex: 1 }} />

          {/* Auth buttons — only when NOT authenticated */}
          {!isAuthenticated && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link
                to="/login"
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#64748B',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#0F172A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="btn-saas-primary"
                style={{
                  padding: '10px 20px',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Slide-in Drawer Menu — for all users */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={overlayStyle}
              onClick={() => setDrawerOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={drawerStyle}
            >
              {/* Drawer Header */}
              <div style={drawerHeaderStyle}>
                <Link
                  to="/"
                  style={{ ...logoStyle, gap: '10px' }}
                  onClick={() => setDrawerOpen(false)}
                >
                  <img src="/logo.svg" alt="AuthenTick" style={{ width: '36px', height: '36px' }} />
                  <span style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                    color: '#1E293B',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    Authen<span style={{ fontWeight: 700, color: '#2563EB' }}>Tick</span>
                  </span>
                </Link>

                <button
                  onClick={() => setDrawerOpen(false)}
                  style={closeButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#F1F5F9';
                    e.currentTarget.style.color = '#0F172A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F8FAFC';
                    e.currentTarget.style.color = '#64748B';
                  }}
                  aria-label="Close menu"
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info Card — only for authenticated users */}
              {isAuthenticated && (
                <div style={{
                  margin: '16px 24px',
                  padding: '16px',
                  background: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #F1F5F9',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '16px',
                      flexShrink: 0,
                    }}>
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0F172A',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{user?.name}</p>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#94A3B8',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>{user?.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Guest welcome — only for non-authenticated users */}
              {!isAuthenticated && (
                <div style={{
                  margin: '16px 24px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)',
                  borderRadius: '12px',
                  border: '1px solid #DBEAFE',
                }}>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0F172A',
                    margin: '0 0 4px 0',
                  }}>Welcome to AuthenTick</p>
                  <p style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#64748B',
                    margin: 0,
                  }}>Verify medicine authenticity instantly</p>
                </div>
              )}

              {/* Menu Items */}
              <div style={{ flex: 1, paddingTop: '4px', paddingBottom: '24px' }}>
                {menuItems.map((item, index) => {
                  if (item === 'divider') {
                    return <div key={`div-${index}`} style={dividerStyle} />;
                  }

                  if (item.action) {
                    // Terminate Session button
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        style={menuItemStyle(true)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(239,68,68,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={iconBoxStyle(true)}>{item.icon}</div>
                        {item.label}
                      </button>
                    );
                  }

                  // Highlighted item (e.g. Get Started)
                  if (item.isHighlight) {
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setDrawerOpen(false)}
                        style={{
                          ...menuItemStyle(false),
                          background: '#2563EB',
                          color: 'white',
                          borderRadius: '12px',
                          margin: '4px 16px',
                          width: 'calc(100% - 32px)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#1D4ED8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#2563EB';
                        }}
                      >
                        <div style={{ ...iconBoxStyle(false), background: 'rgba(255,255,255,0.2)', color: 'white' }}>{item.icon}</div>
                        {item.label}
                      </Link>
                    );
                  }

                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setDrawerOpen(false)}
                      style={menuItemStyle(false)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(37,99,235,0.04)';
                        e.currentTarget.style.color = '#2563EB';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#334155';
                      }}
                    >
                      <div style={iconBoxStyle(false)}>{item.icon}</div>
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
