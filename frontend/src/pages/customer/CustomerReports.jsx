import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getReports } from '../../api';

export default function CustomerReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReports()
      .then(res => setReports(res.data))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>Reported Medicines</h1>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#64748B', marginTop: '4px' }}>Track the status of your fake medicine reports.</p>
      </div>

      {reports.length === 0 ? (
        <div style={{ background: '#FFF', borderRadius: '20px', padding: '48px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: '36px', marginBottom: '12px' }}>📝</p>
          <p style={{ fontWeight: 700, color: '#0F172A' }}>No reports submitted</p>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>If you find a suspicious medicine, report it from the verification result page.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map((report, i) => (
            <motion.div key={report.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: '#FFF', borderRadius: '16px', padding: '18px', border: '1px solid #F1F5F9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{report.reason || 'Report'}</p>
                  <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Token: {report.token || '—'}</p>
                  {report.details && <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>{report.details}</p>}
                  <p style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '6px' }}>
                    {report.createdAt ? new Date(report.createdAt).toLocaleString() : '—'}
                  </p>
                </div>
                <span style={{
                  padding: '6px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, flexShrink: 0,
                  color: report.status === 'REVIEWED' ? '#22C55E' : '#F59E0B',
                  background: report.status === 'REVIEWED' ? '#F0FDF4' : '#FFFBEB',
                }}>
                  {report.status === 'REVIEWED' ? '✅ Reviewed' : '⏳ Pending'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
