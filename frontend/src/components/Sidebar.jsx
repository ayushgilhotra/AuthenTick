import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const publicLinks = [
  { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/verify', label: 'Verify', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { path: '/help', label: 'Help Center', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  { path: '/contact', label: 'Support', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-[60] lg:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl z-[70] shadow-2xl lg:hidden flex flex-col border-r border-white/20"
          >
            {/* Header */}
            <div className="p-[var(--spacing-fluid-md)] flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-3 no-underline group" onClick={onClose}>
                <img src="/logo.svg" alt="AuthenTick" style={{ width: '40px', height: '40px' }} className="group-hover:scale-105 transition-transform" />
                <span style={{ fontSize: '18px', fontWeight: 500, color: '#1E293B', fontFamily: "'Inter', sans-serif", letterSpacing: '-0.01em' }}>Authen<span style={{ fontWeight: 700, color: '#2563EB' }}>Tick</span></span>
              </Link>
              <button onClick={onClose} className="p-2 text-gray hover:text-dark rounded-full hover:bg-gray-100 transition-all active:scale-90">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-[var(--spacing-fluid-md)] py-4 space-y-1">
              <p className="px-4 text-[10px] font-black text-gray/40 uppercase tracking-[0.3em] mb-6">Explore Network</p>
              <div className="space-y-2">
                {publicLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={onClose}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-500 no-underline group relative overflow-hidden ${
                        isActive 
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                          : 'text-gray hover:text-dark hover:bg-primary/5'
                      }`}
                    >
                      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />}
                      <div className={`p-1.5 rounded-lg transition-all duration-500 ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={link.icon} />
                        </svg>
                      </div>
                      <span className="font-bold text-[11px] uppercase tracking-wider">{link.label}</span>
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated && (
                <>
                  <div className="my-10 border-t border-border/50 mx-4" />
                  <p className="px-4 text-[10px] font-black text-gray/40 uppercase tracking-[0.3em] mb-6">Administrative</p>
                  <div className="space-y-2">
                    <Link
                      to="/dashboard"
                      onClick={onClose}
                      className={`flex items-center space-x-4 px-4 py-4 rounded-xl transition-all duration-500 no-underline group relative overflow-hidden ${
                        location.pathname.startsWith('/dashboard') 
                          ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1' 
                          : 'text-gray hover:text-dark hover:bg-primary/5'
                      }`}
                    >
                      {location.pathname.startsWith('/dashboard') && <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />}
                      <div className={`p-1.5 rounded-lg transition-all duration-500 ${location.pathname.startsWith('/dashboard') ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary'}`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <span className="font-bold text-[11px] uppercase tracking-wider">Control Panel</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Footer User */}
            {isAuthenticated && (
              <div className="p-8 bg-dark rounded-t-[32px] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary shadow-xl shadow-primary/20 flex items-center justify-center text-white text-lg font-black relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                    <span className="relative z-10">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-sm truncate tracking-tight">{user?.name}</p>
                    <p className="text-[10px] font-black text-white/30 truncate uppercase tracking-[0.2em]">{user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); onClose(); }}
                  className="w-full btn-premium py-4 text-[11px] uppercase tracking-widest bg-white/10 hover:bg-white/20 border-none shadow-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Terminate Session</span>
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
