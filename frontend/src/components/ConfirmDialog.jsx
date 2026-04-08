import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmColor = '#EF4444', icon = '⚠️' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              background: 'var(--bg-surface, #FFF)', borderRadius: '24px', padding: '36px',
              width: '100%', maxWidth: '420px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
              border: '1px solid var(--border-color, #F1F5F9)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px',
                background: confirmColor === '#EF4444' ? 'rgba(239,68,68,0.08)' : 'rgba(37,99,235,0.08)',
              }}>
                {icon}
              </div>
              <h3 style={{ fontWeight: 800, fontSize: '20px', color: 'var(--text-primary)', margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{message}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onClose}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  border: '1px solid var(--border-color)', background: 'transparent',
                  color: 'var(--text-secondary)',
                }}>
                Cancel
              </button>
              <button onClick={() => { onConfirm(); onClose(); }}
                style={{
                  flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
                  border: 'none', background: confirmColor, color: '#FFF',
                }}>
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
