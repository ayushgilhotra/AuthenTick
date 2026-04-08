import { motion } from 'framer-motion';

const illustrations = {
  box: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="25" y="40" width="70" height="55" rx="8" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <path d="M25 55L60 40L95 55" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" fill="none" />
      <line x1="60" y1="40" x2="60" y2="95" stroke="var(--text-muted, #94A3B8)" strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx="60" cy="32" r="6" fill="#2563EB" opacity="0.2" />
      <path d="M57 32L59 34L63 30" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  magnifier: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <circle cx="52" cy="52" r="25" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <line x1="70" y1="70" x2="90" y2="90" stroke="var(--text-muted, #94A3B8)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="52" cy="52" r="10" fill="#2563EB" opacity="0.1" />
    </svg>
  ),
  bell: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M60 25C47 25 36 36 36 49V65L30 75H90L84 65V49C84 36 73 25 60 25Z" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <circle cx="60" cy="85" r="6" fill="#2563EB" opacity="0.2" />
      <path d="M54 85H66" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  shield: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <path d="M60 20L30 35V60C30 80 45 95 60 100C75 95 90 80 90 60V35L60 20Z" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <path d="M50 60L57 67L72 52" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  ),
  package: (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
      <rect x="30" y="35" width="60" height="50" rx="6" stroke="var(--text-muted, #94A3B8)" strokeWidth="2" strokeDasharray="6 4" fill="none" />
      <line x1="30" y1="55" x2="90" y2="55" stroke="var(--text-muted, #94A3B8)" strokeWidth="1.5" strokeDasharray="4 3" />
      <rect x="50" y="45" width="20" height="10" rx="3" fill="#2563EB" opacity="0.15" />
    </svg>
  ),
};

export default function EmptyState({ type = 'box', title, subtitle, action, onAction }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '64px 24px', textAlign: 'center',
        background: 'var(--bg-surface, #FFF)', borderRadius: '20px', border: '1px solid var(--border-color, #F1F5F9)',
      }}
    >
      <div style={{ marginBottom: '24px', opacity: 0.6 }}>
        {illustrations[type] || illustrations.box}
      </div>
      <h3 style={{ fontWeight: 800, fontSize: '18px', color: 'var(--text-primary, #0F172A)', margin: '0 0 8px' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748B)', maxWidth: '320px', margin: '0 0 24px', lineHeight: 1.5 }}>{subtitle}</p>
      {action && (
        <button onClick={onAction}
          style={{
            padding: '12px 24px', borderRadius: '14px', border: 'none',
            background: '#2563EB', color: '#FFF', fontWeight: 700, fontSize: '14px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
          {action}
        </button>
      )}
    </motion.div>
  );
}
