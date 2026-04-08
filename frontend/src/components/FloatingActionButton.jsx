import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function FloatingActionButton() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  const isCustomer = user?.role === 'CUSTOMER';
  const isRetailer = user?.role === 'RETAILER';
  if (!isCustomer && !isRetailer) return null;

  // Hide on scan/verify pages
  const hidePaths = ['/customer', '/dashboard/verify', '/verify'];
  if (hidePaths.includes(location.pathname)) return null;

  const handleClick = () => {
    if (isCustomer) navigate('/customer');
    else navigate('/dashboard/verify');
  };

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
      onClick={handleClick}
      className="fab-mobile-only"
      style={{
        position: 'fixed', bottom: '80px', right: '20px', zIndex: 50,
        width: '56px', height: '56px', borderRadius: '50%',
        background: '#2563EB', border: 'none', cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white',
      }}
    >
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    </motion.button>
  );
}
