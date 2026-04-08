import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api';

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  return Math.floor(seconds / 86400) + 'd ago';
}

const typeIcons = {
  EXPIRY_WARNING: '⏰', BATCH_EXPIRED: '📅', FAKE_REPORT: '🚨',
  AUTO_RECALL: '🔴', INTEGRITY_DROP: '📉',
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000); // Fallback polling
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnread(res.data.count);
    } catch {}
  };

  const fetchAll = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.slice(0, 5));
    } catch {}
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnread(prev => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {}
  };

  const handleToggle = () => {
    if (!open) fetchAll();
    setOpen(!open);
  };

  if (!isAuthenticated) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={handleToggle}
        style={{
          width: '40px', height: '40px', borderRadius: '12px', border: '1px solid var(--border-color, #E5E7EB)',
          background: 'var(--bg-surface, #FFF)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover, #F8FAFC)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-surface, #FFF)'}
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="var(--text-secondary, #64748B)">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: '-4px', right: '-4px', minWidth: '18px', height: '18px',
            background: '#EF4444', color: '#FFF', borderRadius: '99px', fontSize: '10px', fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px',
            border: '2px solid var(--bg-primary, #FFF)',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute', top: '52px', right: 0, width: '360px',
              background: 'var(--bg-surface, #FFF)', borderRadius: '20px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12)', border: '1px solid var(--border-color, #F1F5F9)',
              overflow: 'hidden', zIndex: 100,
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color, #F1F5F9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-primary, #0F172A)', margin: 0 }}>Notifications</h3>
              {unread > 0 && (
                <button onClick={markAllRead}
                  style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</p>
                  <p style={{ fontWeight: 700, fontSize: '14px', color: 'var(--text-primary, #0F172A)' }}>You're all caught up!</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94A3B8)' }}>No new notifications</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div key={n.id}
                    onClick={() => !n.isRead && markRead(n.id)}
                    style={{
                      padding: '14px 20px', cursor: 'pointer', transition: 'background 0.15s',
                      background: n.isRead ? 'transparent' : 'rgba(37,99,235,0.03)',
                      borderBottom: '1px solid var(--border-color, #F8FAFC)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover, #F8FAFC)'}
                    onMouseLeave={e => e.currentTarget.style.background = n.isRead ? 'transparent' : 'rgba(37,99,235,0.03)'}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{typeIcons[n.type] || '🔔'}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary, #0F172A)', margin: 0 }}>{n.title}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94A3B8)', margin: '4px 0 0', lineHeight: 1.4 }}>{n.message}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted, #CBD5E1)', margin: '6px 0 0', fontWeight: 600 }}>{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563EB', flexShrink: 0, marginTop: '6px' }} />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
