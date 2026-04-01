import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getScanHistory } from '../../api';

const statusConfig = {
  genuine: { label: 'Authentic', color: '#22C55E', bg: '#F0FDF4', icon: '✅' },
  suspicious: { label: 'Duplicate', color: '#F59E0B', bg: '#FFFBEB', icon: '⚠️' },
  expired: { label: 'Expired', color: '#EF4444', bg: '#FEF2F2', icon: '📅' },
  recalled: { label: 'Recalled', color: '#9333EA', bg: '#FAF5FF', icon: '🚨' },
  invalid: { label: 'Fake', color: '#EF4444', bg: '#FEF2F2', icon: '❌' },
};

export default function CustomerHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getScanHistory()
      .then(res => setScans(res.data))
      .catch(err => console.error('Error:', err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = scans.filter(s =>
    (s.medicineName || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.batchNumber || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Scan History</h1>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#64748B', marginTop: '4px' }}>{scans.length} medicines verified</p>
      </div>

      {/* Search */}
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍 Search by medicine or batch..."
        style={{ width: '100%', padding: '16px 20px', border: '1px solid #F3F4F6', borderRadius: '16px', outline: 'none', fontSize: '15px', fontWeight: 500 }}
        className="bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />

      {/* Cards */}
      {filtered.length === 0 ? (
        <div style={{ background: '#FFF', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: '36px', marginBottom: '12px' }}>📋</p>
          <p style={{ fontWeight: 700, color: '#0F172A' }}>{search ? 'No matches found' : 'No scans yet'}</p>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>{search ? 'Try different keywords' : 'Verify a medicine to see it here'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((scan, i) => {
            const st = statusConfig[scan.status] || statusConfig.genuine;
            return (
              <motion.div key={scan.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSelected(scan)}
                style={{ background: '#FFF', borderRadius: '16px', padding: '18px', border: '1px solid #F1F5F9', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{scan.medicineName || 'Unknown Medicine'}</p>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Batch: {scan.batchNumber || '—'}</p>
                    <p style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}>
                      {scan.scannedAt ? new Date(scan.scannedAt).toLocaleString() : '—'}
                    </p>
                  </div>
                  <span style={{ padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, color: st.color, background: st.bg, flexShrink: 0 }}>
                    {st.icon} {st.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>{selected.medicineName || 'Unknown'}</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {[
                { label: 'Manufacturer', value: selected.manufacturer },
                { label: 'Batch Number', value: selected.batchNumber },
                { label: 'Category', value: selected.category },
                { label: 'Expiry Date', value: selected.expiryDate },
                { label: 'Scanned At', value: selected.scannedAt ? new Date(selected.scannedAt).toLocaleString() : '—' },
                { label: 'Status', value: (statusConfig[selected.status] || statusConfig.genuine).label },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px', borderRadius: '12px', background: '#F8FAFC' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', marginBottom: '2px' }}>{item.label}</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{item.value || '—'}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} style={{ marginTop: '20px', width: '100%', padding: '14px', borderRadius: '14px', border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
