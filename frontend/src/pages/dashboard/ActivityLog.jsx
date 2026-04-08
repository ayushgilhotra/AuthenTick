import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuditLogs } from '../../api';
import { SkeletonRow } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const actionIcons = {
  REGISTERED_MEDICINE: '💊', CREATED_BATCH: '📦', GENERATED_QR: '🔐', DOWNLOADED_QR: '⬇️',
  RECALLED_BATCH: '🔴', VIEWED_ANALYTICS: '📊', VERIFIED_STOCK: '🔍', VERIFIED_MEDICINE: '✅',
  SUBMITTED_REPORT: '🚨', DELETED_ACCOUNT: '🗑️', BATCH_EXPIRED: '📅', AUTO_RECALL: '⚠️',
  EXPIRY_WARNING: '⏰', SUSPICIOUS_SCAN: '👁️',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 60) return 'Just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogs(page, 15, filter || undefined);
      setLogs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>Activity Log</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748B)', marginTop: '4px' }}>Immutable record of all system actions and events.</p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <input type="text" value={filter} onChange={e => { setFilter(e.target.value); setPage(0); }}
          placeholder="🔍 Filter by action..."
          style={{
            flex: 1, minWidth: '200px', padding: '12px 16px', borderRadius: '14px',
            border: '1px solid var(--border-color, #F3F4F6)', outline: 'none', fontSize: '14px',
            background: 'var(--bg-surface, #FFF)', color: 'var(--text-primary, #0F172A)',
          }} />
      </div>

      {/* Log entries */}
      <div style={{ background: 'var(--bg-surface, #FFF)', borderRadius: '20px', border: '1px solid var(--border-color, #F1F5F9)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '24px' }}><SkeletonRow count={8} /></div>
        ) : logs.length === 0 ? (
          <EmptyState type="shield" title="No activity recorded" subtitle="Actions and events will appear in this log as they happen." />
        ) : (
          <div>
            {logs.map((entry, i) => (
              <div key={entry.id || i}
                style={{
                  padding: '16px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start',
                  borderBottom: i < logs.length - 1 ? '1px solid var(--border-color, #F8FAFC)' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover, #F8FAFC)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{actionIcons[entry.action] || '📋'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--text-primary, #0F172A)' }}>
                      {entry.action?.replace(/_/g, ' ')}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted, #CBD5E1)' }}>{timeAgo(entry.createdAt)}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary, #94A3B8)', margin: '4px 0 0', lineHeight: 1.4 }}>{entry.description}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {entry.userRole && (
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '99px', background: 'rgba(37,99,235,0.06)', color: '#2563EB' }}>
                        {entry.userRole}
                      </span>
                    )}
                    {entry.entityType && (
                      <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)' }}>
                        {entry.entityType} #{entry.entityId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-secondary)', fontWeight: 700,
              cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1,
            }}>
            ← Prev
          </button>
          <span style={{ padding: '10px 16px', fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {page + 1} / {totalPages}
          </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}
            style={{
              padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-secondary)', fontWeight: 700,
              cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1,
            }}>
            Next →
          </button>
        </div>
      )}
    </motion.div>
  );
}
