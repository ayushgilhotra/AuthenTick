import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { verifyToken } from '../../api';
import { Html5Qrcode } from 'html5-qrcode';

const statusConfig = {
  genuine: { icon: '✅', label: 'Authentic', color: '#22C55E', bg: '#F0FDF4' },
  suspicious: { icon: '⚠️', label: 'Duplicate', color: '#F59E0B', bg: '#FFFBEB' },
  expired: { icon: '📅', label: 'Expired', color: '#EF4444', bg: '#FEF2F2' },
  recalled: { icon: '🚨', label: 'Recalled', color: '#9333EA', bg: '#FAF5FF' },
  invalid: { icon: '❌', label: 'Fake / Not Found', color: '#EF4444', bg: '#FEF2F2' },
};

export default function VerifyStock() {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [qrDetected, setQrDetected] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerInstanceRef = useRef(null);
  const isScanningRef = useRef(false);

  const handleVerify = async (inputToken) => {
    const t = inputToken || token;
    if (!t.trim()) { setError('Please enter a valid Token ID'); return; }
    setVerifying(true);
    setError('');
    setResult(null);
    try {
      const res = await verifyToken(t);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Check the token and try again.');
    } finally {
      setVerifying(false);
    }
  };

  const stopScanner = async () => {
    if (scannerInstanceRef.current) {
      try { if (isScanningRef.current) { await scannerInstanceRef.current.stop(); isScanningRef.current = false; } } catch (e) {}
      try { scannerInstanceRef.current.clear(); } catch (e) {}
      scannerInstanceRef.current = null;
      setScannerReady(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'scan') { stopScanner(); return; }
    let cancelled = false;
    const startScanner = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;
      const el = document.getElementById('qr-reader-stock');
      if (!el) return;
      try {
        const html5QrCode = new Html5Qrcode('qr-reader-stock');
        scannerInstanceRef.current = html5QrCode;
        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;
        if (!cameras?.length) { setCameraError('No camera found.'); return; }
        let cameraId = cameras[0].id;
        const rear = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('rear'));
        if (rear) cameraId = rear.id;
        if (cancelled) return;
        await html5QrCode.start(cameraId, { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1.0 },
          (decodedText) => {
            html5QrCode.stop().catch(() => {});
            isScanningRef.current = false;
            setQrDetected(true);
            setTimeout(() => { setQrDetected(false); handleVerify(decodedText); }, 800);
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-dark tracking-tight">Verify Stock</h1>
        <p className="text-sm font-light text-gray mt-1">Scan QR code or enter token to verify medicine authenticity.</p>
      </div>

      <div className="saas-card" style={{ padding: '32px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '14px', padding: '4px', gap: '4px', marginBottom: '28px' }}>
          {[{ key: 'scan', label: 'Scan QR Code', icon: 'M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z' },
            { key: 'token', label: 'Enter Token ID', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' }
          ].map(tab => (
            <button key={tab.key}
              style={{ flex: 1, padding: '12px', borderRadius: '11px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.25s',
                background: activeTab === tab.key ? '#2563EB' : 'transparent', color: activeTab === tab.key ? '#FFF' : '#64748B',
                boxShadow: activeTab === tab.key ? '0 2px 8px rgba(37,99,235,0.25)' : 'none' }}
              onClick={() => { setActiveTab(tab.key); setError(''); setResult(null); }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scan Tab */}
        <div style={{ display: activeTab === 'scan' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          {qrDetected ? (
            <div style={{ width: '100%', maxWidth: '320px', aspectRatio: '1', borderRadius: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#FFF"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <p style={{ color: '#22C55E', fontWeight: 700, fontSize: '14px' }}>QR Detected ✓</p>
            </div>
          ) : cameraError ? (
            <div style={{ width: '100%', maxWidth: '320px', aspectRatio: '1', borderRadius: '20px', background: '#0F172A', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px' }}>
              <p style={{ color: '#FFF', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>{cameraError}</p>
              <button onClick={() => { setCameraError(''); setActiveTab('token'); setTimeout(() => setActiveTab('scan'), 150); }}
                style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                Try Again
              </button>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <div style={{ width: '100%', aspectRatio: '1', borderRadius: '20px', overflow: 'hidden', background: '#0F172A', position: 'relative' }}>
                <div id="qr-reader-stock" style={{ width: '100%', height: '100%' }} />
                {scannerReady && (
                  <div style={{ position: 'absolute', inset: '20%', pointerEvents: 'none', zIndex: 10 }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '4px 0 0 0', animation: 'pulse-bracket 2s ease-in-out infinite' }} />
                    <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 4px 0 0', animation: 'pulse-bracket 2s ease-in-out infinite 0.5s' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '0 0 0 4px', animation: 'pulse-bracket 2s ease-in-out infinite 1s' }} />
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 0 4px 0', animation: 'pulse-bracket 2s ease-in-out infinite 1.5s' }} />
                  </div>
                )}
              </div>
            </div>
          )}
          <p style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', textAlign: 'center' }}>Point camera at the medicine QR code</p>
        </div>

        {/* Token Tab */}
        <div style={{ display: activeTab === 'token' ? 'flex' : 'none', flexDirection: 'column', gap: '16px' }}>
          <div style={{ height: '56px', border: '1px solid #F3F4F6', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center' }} className="bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
            <div style={{ paddingLeft: '20px', paddingRight: '12px', color: 'rgba(100,116,139,0.4)' }}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleVerify()} placeholder="Enter Token ID"
              style={{ flex: 1, padding: '0 8px', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontWeight: 500, fontSize: '0.875rem' }} />
          </div>
          <button onClick={() => handleVerify()} disabled={verifying}
            style={{ width: '100%', height: '56px', borderRadius: '16px', fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: verifying ? 0.5 : 1 }}
            className="bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20">
            {verifying ? <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : 'Verify Medicine'}
          </button>
        </div>

        {error && <div style={{ padding: '16px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2', marginTop: '16px' }} className="bg-red-50 text-red-600">{error}</div>}
      </div>

      {/* Result Card */}
      {result && status && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="saas-card" style={{ padding: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '20px', borderRadius: '16px', background: status.bg, border: `1px solid ${status.color}22` }}>
            <span style={{ fontSize: '32px' }}>{status.icon}</span>
            <div>
              <p style={{ fontWeight: 800, fontSize: '18px', color: status.color }}>{status.label}</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#64748B', marginTop: '4px' }}>{result.message}</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {[
              { label: 'Medicine', value: result.medicineName },
              { label: 'Manufacturer', value: result.manufacturer },
              { label: 'Batch ID', value: result.batchNumber },
              { label: 'Category', value: result.category },
              { label: 'Mfg Date', value: result.manufactureDate },
              { label: 'Expiry Date', value: result.expiryDate },
            ].map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>{item.value || '—'}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', padding: '16px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Scans</span>
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>{result.scanCount || 0}</span>
          </div>
          <button onClick={() => { setResult(null); setToken(''); }} style={{ marginTop: '16px', width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #E5E7EB', background: '#FFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer', color: '#64748B' }}>
            Scan Another
          </button>
        </motion.div>
      )}

      <style>{`
        @keyframes pulse-bracket { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
        #qr-reader-stock video { width: 100% !important; height: 100% !important; object-fit: cover !important; border-radius: 20px; }
        #qr-reader-stock { border: none !important; }
        #qr-reader-stock > div:last-child { display: none !important; }
        #qr-reader-stock img { display: none !important; }
        #qr-reader-stock__dashboard { display: none !important; }
        #qr-reader-stock__dashboard_section { display: none !important; }
      `}</style>
    </motion.div>
  );
}
