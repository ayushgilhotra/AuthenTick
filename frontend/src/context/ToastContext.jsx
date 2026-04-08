import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, title, message, duration, createdAt: Date.now() }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((title, message) => addToast('success', title, message), [addToast]);
  const error = useCallback((title, message) => addToast('error', title, message), [addToast]);
  const warning = useCallback((title, message) => addToast('warning', title, message), [addToast]);
  const info = useCallback((title, message) => addToast('info', title, message), [addToast]);

  const icons = {
    success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️'
  };
  const colors = {
    success: '#22C55E', error: '#EF4444', warning: '#F59E0B', info: '#2563EB'
  };

  return (
    <ToastContext.Provider value={{ success, error, warning, info, removeToast }}>
      {children}

      {/* Desktop: bottom-right. Mobile: top-center */}
      <div style={{
        position: 'fixed', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '8px', pointerEvents: 'none',
        bottom: '24px', right: '24px', maxWidth: '400px', width: '100%',
      }} className="toast-container">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                pointerEvents: 'all',
                background: 'var(--bg-surface, #FFF)',
                borderRadius: '16px',
                padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-color, #F1F5F9)',
                borderLeft: `4px solid ${colors[toast.type]}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{icons[toast.type]}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary, #0F172A)', margin: 0 }}>{toast.title}</p>
                {toast.message && <p style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', margin: '4px 0 0', lineHeight: 1.4 }}>{toast.message}</p>}
              </div>
              <button onClick={() => removeToast(toast.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted, #94A3B8)', padding: '4px', fontSize: '14px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>
                ✕
              </button>
              {/* Progress bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                style={{
                  position: 'absolute', bottom: 0, left: 0, height: '3px',
                  background: colors[toast.type], borderRadius: '0 0 0 16px', opacity: 0.5,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .toast-container {
            bottom: auto !important;
            top: 16px !important;
            right: 16px !important;
            left: 16px !important;
            max-width: none !important;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
