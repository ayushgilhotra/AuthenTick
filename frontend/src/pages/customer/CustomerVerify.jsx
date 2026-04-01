import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { verifyToken, submitReport } from '../../api';
import { Html5Qrcode } from 'html5-qrcode';

const statusConfig = {
  genuine: { icon: '✅', label: 'Authentic', color: '#22C55E', bg: '#F0FDF4', desc: 'This medicine is verified as genuine.' },
  suspicious: { icon: '⚠️', label: 'Duplicate', color: '#F59E0B', bg: '#FFFBEB', desc: 'This token was scanned before — possible duplicate.' },
  expired: { icon: '📅', label: 'Expired', color: '#EF4444', bg: '#FEF2F2', desc: 'This medicine has expired.' },
  recalled: { icon: '🚨', label: 'Recalled', color: '#9333EA', bg: '#FAF5FF', desc: 'This medicine batch has been recalled.' },
  invalid: { icon: '❌', label: 'Not Found', color: '#EF4444', bg: '#FEF2F2', desc: 'No product found. This medicine may be counterfeit.' },
};

export default function CustomerVerify() {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [qrDetected, setQrDetected] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', details: '' });
  const [reportSent, setReportSent] = useState(false);
  const scannerRef = useRef(null);
  const isScanningRef = useRef(false);

  const handleVerify = async (inputToken) => {
    const t = inputToken || token;
    if (!t.trim()) { setError('Please enter a valid Token ID'); return; }
    setVerifying(true);
    setError('');
    setResult(null);
    try {
      const res = await verifyToken(t);
      setResult({ ...res.data, token: t });
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    } finally {
      setVerifying(false);
    }
  };

  const handleReport = async () => {
    if (!reportForm.reason) return;
    try {
      await submitReport({ token: result?.token, ...reportForm });
      setReportSent(true);
      setTimeout(() => { setShowReport(false); setReportSent(false); }, 2000);
    } catch {}
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try { if (isScanningRef.current) { await scannerRef.current.stop(); isScanningRef.current = false; } } catch {}
      try { scannerRef.current.clear(); } catch {}
      scannerRef.current = null;
      setScannerReady(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'scan') { stopScanner(); return; }
    let cancelled = false;
    const startScanner = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      const el = document.getElementById('qr-reader-customer');
      if (!el) return;
      try {
        const qr = new Html5Qrcode('qr-reader-customer');
        scannerRef.current = qr;
        const cameras = await Html5Qrcode.getCameras();
        if (cancelled || !cameras?.length) { !cancelled && setCameraError('No camera found.'); return; }
        let cameraId = cameras[0].id;
        const rear = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear'));
        if (rear) cameraId = rear.id;
        if (cancelled) return;
        await qr.start(cameraId, { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
          (decoded) => {
            qr.stop().catch(() => {});
            isScanningRef.current = false;
            setQrDetected(true);
            setTimeout(() => { setQrDetected(false); handleVerify(decoded); }, 800);
          }, () => {});
        if (!cancelled) { isScanningRef.current = true; setScannerReady(true); }
      } catch (err) {
        if (!cancelled) setCameraError(err.toString().includes('NotAllowed') ? 'Camera access denied.' : 'Could not start camera.');
      }
    };
    setCameraError(''); setQrDetected(false); setScannerReady(false); startScanner();
    return () => { cancelled = true; stopScanner(); };
  }, [activeTab]);

  const status = result ? (statusConfig[result.status] || statusConfig.invalid) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.025em' }}>Verify Medicine</h1>
        <p style={{ fontSize: '14px', fontWeight: 300, color: '#64748B', marginTop: '4px' }}>Scan or enter the code on your medicine to check authenticity.</p>
      </div>

      <div style={{ background: '#FFF', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '14px', padding: '4px', gap: '4px', marginBottom: '24px' }}>
          {[{ key: 'scan', label: '📷 Scan QR' }, { key: 'token', label: '⌨️ Enter Token' }].map(tab => (
            <button key={tab.key}
              style={{ flex: 1, padding: '14px', borderRadius: '11px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 700, transition: 'all 0.25s',
                background: activeTab === tab.key ? '#2563EB' : 'transparent', color: activeTab === tab.key ? '#FFF' : '#64748B',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(37,99,235,0.25)' : 'none' }}
              onClick={() => { setActiveTab(tab.key); setError(''); setResult(null); }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scan */}
        <div style={{ display: activeTab === 'scan' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          {qrDetected ? (
            <div style={{ width: '100%', maxWidth: '300px', aspectRatio: '1', borderRadius: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFF"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p style={{ color: '#22C55E', fontWeight: 700 }}>QR Detected ✓</p>
            </div>
          ) : cameraError ? (
            <div style={{ width: '100%', maxWidth: '300px', aspectRatio: '1', borderRadius: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
              <p style={{ color: '#FFF', fontWeight: 600, textAlign: 'center' }}>{cameraError}</p>
              <button onClick={() => { setCameraError(''); setActiveTab('token'); setTimeout(() => setActiveTab('scan'), 150); }}
                style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Retry</button>
            </div>
          ) : (
            <div style={{ width: '100%', maxWidth: '300px', aspectRatio: '1', borderRadius: '20px', overflow: 'hidden', background: '#0F172A', position: 'relative' }}>
              <div id="qr-reader-customer" style={{ width: '100%', height: '100%' }} />
              {scannerReady && (
                <div style={{ position: 'absolute', inset: '20%', pointerEvents: 'none', zIndex: 10 }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '4px 0 0 0' }} />
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 4px 0 0' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '0 0 0 4px' }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 0 4px 0' }} />
                </div>
              )}
            </div>
          )}
          <p style={{ fontSize: '13px', color: '#94A3B8', textAlign: 'center' }}>Point your camera at the medicine QR code</p>
        </div>

        {/* Token input */}
        <div style={{ display: activeTab === 'token' ? 'flex' : 'none', flexDirection: 'column', gap: '16px' }}>
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerify()} placeholder="Enter Token ID"
            style={{ width: '100%', padding: '18px 20px', border: '1px solid #F3F4F6', borderRadius: '16px', outline: 'none', fontSize: '16px', fontWeight: 500 }}
            className="bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          <button onClick={() => handleVerify()} disabled={verifying}
            style={{ width: '100%', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: verifying ? 0.5 : 1 }}
            className="bg-primary text-white shadow-xl shadow-primary/20">
            {verifying ? 'Verifying...' : '🔍 Verify Medicine'}
          </button>
        </div>
        {error && <div style={{ padding: '16px', borderRadius: '12px', fontSize: '14px', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2', marginTop: '12px' }} className="bg-red-50 text-red-600">{error}</div>}
      </div>

      {/* Result */}
      {result && status && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#FFF', borderRadius: '20px', padding: '24px', border: '1px solid #F1F5F9' }}>
          <div style={{ padding: '20px', borderRadius: '16px', background: status.bg, border: `1px solid ${status.color}22`, display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '36px' }}>{status.icon}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: '18px', color: status.color }}>{status.label}</p>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>{result.message || status.desc}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: '💊 Medicine', value: result.medicineName },
              { label: '🏭 Manufacturer', value: result.manufacturer },
              { label: '📦 Batch', value: result.batchNumber },
              { label: '🏷️ Category', value: result.category },
              { label: '🗓️ Mfg Date', value: result.manufactureDate },
              { label: '⌛ Expiry', value: result.expiryDate },
            ].map((item, i) => (
              <div key={i} style={{ padding: '12px', borderRadius: '12px', background: '#F8FAFC' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button onClick={() => { setResult(null); setToken(''); }}
              style={{ flex: 1, padding: '14px', borderRadius: '14px', border: '1px solid #E5E7EB', background: '#FFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: '#64748B' }}>
              Scan Another
            </button>
            {(result.status === 'invalid' || result.status === 'suspicious') && (
              <button onClick={() => setShowReport(true)}
                style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#EF4444', color: '#FFF', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                🚨 Report Fake
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Report modal */}
      {showReport && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}
          onClick={(e) => e.target === e.currentTarget && setShowReport(false)}>
          <div style={{ background: '#FFF', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            {reportSent ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <p style={{ fontSize: '48px', marginBottom: '12px' }}>✅</p>
                <h3 style={{ fontWeight: 800, fontSize: '18px' }}>Report Submitted</h3>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '8px' }}>Thank you for helping keep medicines safe.</p>
              </div>
            ) : (
              <>
                <h3 style={{ fontWeight: 800, fontSize: '18px', marginBottom: '20px' }}>🚨 Report Fake Medicine</h3>
                <select value={reportForm.reason} onChange={(e) => setReportForm({...reportForm, reason: e.target.value})}
                  style={{ width: '100%', padding: '14px', border: '1px solid #F3F4F6', borderRadius: '12px', marginBottom: '12px', fontSize: '14px' }}>
                  <option value="">Select reason...</option>
                  <option value="Counterfeit Product">Counterfeit Product</option>
                  <option value="Packaging Tampering">Packaging Tampering</option>
                  <option value="Incorrect Batch Info">Incorrect Batch Info</option>
                </select>
                <textarea value={reportForm.details} onChange={(e) => setReportForm({...reportForm, details: e.target.value})} rows={3}
                  placeholder="Add details..." style={{ width: '100%', padding: '14px', border: '1px solid #F3F4F6', borderRadius: '12px', resize: 'none', fontSize: '14px', marginBottom: '16px' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setShowReport(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#FFF', fontWeight: 700, cursor: 'pointer', color: '#64748B' }}>Cancel</button>
                  <button onClick={handleReport} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: '#EF4444', color: '#FFF', fontWeight: 700, cursor: 'pointer' }}>Submit Report</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        #qr-reader-customer video { width: 100% !important; height: 100% !important; object-fit: cover !important; border-radius: 20px; }
        #qr-reader-customer { border: none !important; }
        #qr-reader-customer > div:last-child { display: none !important; }
        #qr-reader-customer img { display: none !important; }
        #qr-reader-customer__dashboard { display: none !important; }
      `}</style>
    </div>
  );
}
