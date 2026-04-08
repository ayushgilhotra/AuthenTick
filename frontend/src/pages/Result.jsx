import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyToken, submitReport } from '../api';
import { useToast } from '../context/ToastContext';

const statusConfig = {
  genuine: { label: 'Authentic', animation: 'check', color: '#22C55E', bg: 'rgba(34,197,94,0.06)' },
  suspicious: { label: 'Suspicious', animation: 'warning', color: '#F59E0B', bg: 'rgba(245,158,11,0.06)' },
  expired: { label: 'Expired', animation: 'expired', color: '#94A3B8', bg: 'rgba(148,163,184,0.06)' },
  recalled: { label: 'Recalled', animation: 'recalled', color: '#EF4444', bg: 'rgba(239,68,68,0.06)' },
  invalid: { label: 'Not Authentic', animation: 'fail', color: '#EF4444', bg: 'rgba(239,68,68,0.06)' },
};

function AnimatedCheck({ color }) {
  return (
    <motion.svg width="100" height="100" viewBox="0 0 100 100">
      <motion.circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="3"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
      <motion.circle cx="50" cy="50" r="45" fill={color} opacity={0.06}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
      <motion.path d="M30 52L44 66L72 38" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3, ease: 'easeInOut' }} />
    </motion.svg>
  );
}

function AnimatedFail({ color }) {
  return (
    <motion.svg width="100" height="100" viewBox="0 0 100 100" initial={{ scale: 0.8 }} animate={{ scale: 1, rotate: [0, -3, 3, -3, 0] }} transition={{ duration: 0.6 }}>
      <motion.circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="3"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
      <motion.circle cx="50" cy="50" r="45" fill={color} opacity={0.06}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
      <motion.path d="M35 35L65 65" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.3 }} />
      <motion.path d="M65 35L35 65" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay: 0.45 }} />
    </motion.svg>
  );
}

function AnimatedWarning({ color }) {
  return (
    <motion.svg width="100" height="100" viewBox="0 0 100 100" animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: 2, duration: 0.5 }}>
      <motion.path d="M50 15L90 85H10L50 15Z" fill="none" stroke={color} strokeWidth="3" strokeLinejoin="round"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
      <motion.path d="M50 15L90 85H10L50 15Z" fill={color} opacity={0.06}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }} />
      <motion.text x="50" y="68" textAnchor="middle" fontSize="36" fontWeight="800" fill={color}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>!</motion.text>
    </motion.svg>
  );
}

function StatusAnimation({ status }) {
  const config = statusConfig[status] || statusConfig.invalid;
  if (config.animation === 'check') return <AnimatedCheck color={config.color} />;
  if (config.animation === 'fail') return <AnimatedFail color={config.color} />;
  if (config.animation === 'warning') return <AnimatedWarning color={config.color} />;
  if (config.animation === 'recalled') return <AnimatedFail color={config.color} />;
  if (config.animation === 'expired') return (
    <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      style={{ width: '100px', height: '100px', borderRadius: '50%', background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '48px' }}>⏰</span>
    </motion.div>
  );
  return <AnimatedFail color={config.color} />;
}

export default function Result() {
  const { token } = useParams();
  const toast = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', details: '', reporterEmail: '' });
  const [reportSent, setReportSent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await verifyToken(token);
        setData(res.data);
        // Trigger haptic on mobile for authentic
        if (res.data?.status === 'genuine' && navigator.vibrate) navigator.vibrate(50);
        // Show details after animation completes
        setTimeout(() => setShowDetails(true), 800);
      } catch (err) {
        setError('Unable to verify this token. Please try again.');
      }
      setLoading(false);
    };
    fetchResult();
  }, [token]);

  const handleReport = async () => {
    if (!reportForm.reason) return;
    try {
      await submitReport({ token, ...reportForm });
      setReportSent(true);
      toast.success('Report Submitted', 'Thank you for helping keep medicine safe.');
      setTimeout(() => setShowReport(false), 2000);
    } catch {
      toast.error('Failed', 'Could not submit report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '4px solid #2563EB', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-secondary)', fontWeight: 300 }}>Decrypting authenticity...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center', maxWidth: '400px', padding: '40px', background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>Verification Fault</h2>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 300, marginBottom: '24px' }}>{error}</p>
          <Link to="/verify" style={{ padding: '12px 24px', borderRadius: '12px', background: '#2563EB', color: '#FFF', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
            New Audit
          </Link>
        </motion.div>
      </div>
    );
  }

  const status = statusConfig[data?.status] || statusConfig.invalid;

  return (
    <div style={{ minHeight: '100vh', padding: '100px 16px 60px', background: 'var(--bg-primary)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <Link to="/verify" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '32px' }}>
          ← Back to scanner
        </Link>

        {/* Animated Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'var(--bg-surface, #FFF)', borderRadius: '28px', padding: '60px 40px',
            border: `2px solid ${status.color}20`, textAlign: 'center', marginBottom: '32px',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Recalled banner */}
          {data?.status === 'recalled' && (
            <motion.div initial={{ y: -50 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 300 }}
              style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '10px', background: '#EF4444', color: '#FFF', fontWeight: 700, fontSize: '13px', letterSpacing: '0.1em' }}>
              🚨 THIS BATCH HAS BEEN RECALLED 🚨
            </motion.div>
          )}

          <motion.div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            <StatusAnimation status={data?.status} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {status.label}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '99px', background: status.bg, border: `1px solid ${status.color}30`, marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: status.color, animation: 'pulse 2s infinite' }} />
            <span style={{ fontWeight: 700, fontSize: '13px', color: status.color }}>{status.label} Status</span>
          </motion.div>
          <p style={{ color: 'var(--text-secondary)', fontWeight: 300, maxWidth: '500px', margin: '0 auto' }}>
            {data?.message || "Verification complete."}
          </p>
        </motion.div>

        {/* Details Card — slides up after animation */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}
            >
              {/* Medicine Details */}
              <div style={{ background: 'var(--bg-surface)', borderRadius: '20px', border: '1px solid var(--border-color)', padding: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>Medicine Passport</h3>
                  <code style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '8px', background: 'var(--bg-surface-hover)', color: '#2563EB', fontWeight: 600 }}>{token?.slice(0, 12)}...</code>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {[
                    { label: 'Product Name', value: data?.medicineName, icon: '💊' },
                    { label: 'Manufacturer', value: data?.manufacturer, icon: '🏭' },
                    { label: 'Batch ID', value: data?.batchNumber, icon: '📦' },
                    { label: 'Classification', value: data?.category, icon: '🏷️' },
                    { label: 'Mfg Date', value: data?.manufactureDate, icon: '🗓️' },
                    { label: 'Expiry Date', value: data?.expiryDate, icon: '⌛' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ opacity: 0.4, fontSize: '14px' }}>{item.icon}</span>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>{item.value || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scan Info + Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#0F172A', borderRadius: '20px', padding: '24px', color: '#FFF', flex: 1 }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '6px', height: '6px', background: '#2563EB', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                    Network Log
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>Total Scans</span>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563EB' }}>{data?.scanCount || 0}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '14px' }}>
                      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase' }}>Last Location</span>
                      <span style={{ fontSize: '13px', fontWeight: 500 }}>{data?.lastScanLocation || 'Secure Node'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowReport(true)}
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.04)', cursor: 'pointer', fontWeight: 700, color: '#EF4444', fontSize: '13px' }}>
                    Report Anomaly
                  </button>
                  <Link to="/verify"
                    style={{ flex: 1, padding: '14px', borderRadius: '14px', background: '#2563EB', color: '#FFF', fontWeight: 700, fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>
                    Next Scan
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              style={{ background: 'var(--bg-surface)', borderRadius: '24px', padding: '36px', width: '100%', maxWidth: '440px', boxShadow: '0 24px 64px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}
            >
              {reportSent ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <AnimatedCheck color="#22C55E" />
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '16px' }}>Report Transmitted</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '8px' }}>The security core has logged the anomaly.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(239,68,68,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🚨</div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Report Anomaly</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>Anomaly Classification</label>
                      <select value={reportForm.reason} onChange={e => setReportForm({ ...reportForm, reason: e.target.value })}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', outline: 'none' }}>
                        <option value="">Choose risk type...</option>
                        <option value="Duplicate Scan Result">Duplicate Node ID</option>
                        <option value="Packaging Tampering">Physical Tamper</option>
                        <option value="Incorrect Batch Info">Data Inconsistency</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px', display: 'block' }}>Details</label>
                      <textarea value={reportForm.details} onChange={e => setReportForm({ ...reportForm, details: e.target.value })} rows={3}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface-hover)', fontSize: '14px', color: 'var(--text-primary)', resize: 'none', outline: 'none' }}
                        placeholder="Provide details..." />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                      <button onClick={() => setShowReport(false)}
                        style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        Cancel
                      </button>
                      <button onClick={handleReport}
                        style={{ flex: 1, padding: '14px', borderRadius: '14px', fontWeight: 700, fontSize: '14px', border: 'none', background: '#EF4444', color: '#FFF', cursor: 'pointer' }}>
                        Submit Report
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
