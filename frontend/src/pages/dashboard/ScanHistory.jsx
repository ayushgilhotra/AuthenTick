import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getScanHistory } from '../../api';

const statusConfig = {
  genuine: { label: 'Authentic', color: '#22C55E', bg: '#F0FDF4' },
  suspicious: { label: 'Duplicate', color: '#F59E0B', bg: '#FFFBEB' },
  expired: { label: 'Expired', color: '#EF4444', bg: '#FEF2F2' },
  recalled: { label: 'Recalled', color: '#9333EA', bg: '#FAF5FF' },
};

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getScanHistory()
      .then(res => setScans(res.data))
      .catch(err => console.error('Failed to load scan history:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter(s =>
    (s.medicineName || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.batchNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.token || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-end pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Scan History</h1>
          <p className="text-sm font-light text-gray mt-1">{scans.length} total verifications</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ height: '48px', border: '1px solid #F3F4F6', borderRadius: '14px', overflow: 'hidden', display: 'flex', alignItems: 'center' }} className="bg-white shadow-sm">
        <div style={{ paddingLeft: '16px', paddingRight: '8px', color: '#94A3B8' }}>
          <svg style={{ width: '18px', height: '18px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by medicine name, batch, or token..."
          style={{ flex: 1, padding: '0 8px', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontWeight: 500, fontSize: '13px' }} />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="saas-card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>📋</p>
          <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>No scans found</p>
          <p style={{ fontSize: '13px', color: '#94A3B8' }}>{search ? 'Try a different search term' : 'Verify some medicines to see history here'}</p>
        </div>
      ) : (
        <div className="saas-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Medicine', 'Batch ID', 'Token', 'Status', 'Date & Time'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((scan, i) => {
                  const st = statusConfig[scan.status] || statusConfig.genuine;
                  return (
                    <tr key={scan.id || i} style={{ borderBottom: '1px solid #F8FAFC' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#F8FAFC'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '14px 20px', fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{scan.medicineName || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: '#64748B', fontFamily: 'monospace' }}>{scan.batchNumber || '—'}</td>
                      <td style={{ padding: '14px 20px', fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>{scan.token || '—'}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, color: st.color, background: st.bg }}>{st.label}</span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '12px', color: '#64748B' }}>
                        {scan.scannedAt ? new Date(scan.scannedAt).toLocaleString() : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
