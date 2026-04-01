import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

export default function Verify() {
  const [token, setToken] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('scan');
  const [cameraError, setCameraError] = useState('');
  const [qrDetected, setQrDetected] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const scannerInstanceRef = useRef(null);
  const isScanningRef = useRef(false);
  const navigate = useNavigate();

  const handleVerify = (inputToken) => {
    const t = inputToken || token;
    if (!t.trim()) {
      setError('Please enter a valid Token ID');
      return;
    }
    setVerifying(true);
    setError('');
    setTimeout(() => {
      navigate(`/result/${t}`);
    }, 1500);
  };

  // Safe cleanup function
  const stopScanner = async () => {
    if (scannerInstanceRef.current) {
      try {
        if (isScanningRef.current) {
          await scannerInstanceRef.current.stop();
          isScanningRef.current = false;
        }
      } catch (e) { /* ignore */ }
      try {
        scannerInstanceRef.current.clear();
      } catch (e) { /* ignore */ }
      scannerInstanceRef.current = null;
      setScannerReady(false);
    }
  };

  // Start camera scanner
  useEffect(() => {
    if (activeTab !== 'scan') {
      stopScanner();
      return;
    }

    let cancelled = false;

    const startScanner = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (cancelled) return;

      const elementId = 'qr-reader';
      const el = document.getElementById(elementId);
      if (!el) return;

      try {
        const html5QrCode = new Html5Qrcode(elementId);
        scannerInstanceRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;

        if (!cameras || cameras.length === 0) {
          setCameraError('No camera found on this device.');
          return;
        }

        let cameraId = cameras[0].id;
        const rearCam = cameras.find(c =>
          c.label.toLowerCase().includes('back') ||
          c.label.toLowerCase().includes('rear') ||
          c.label.toLowerCase().includes('environment')
        );
        if (rearCam) cameraId = rearCam.id;

        if (cancelled) return;

        await html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
          (decodedText) => {
            html5QrCode.stop().catch(() => {});
            isScanningRef.current = false;
            setQrDetected(true);
            setTimeout(() => {
              navigate(`/result/${decodedText}`);
            }, 1200);
          },
          () => {}
        );

        if (!cancelled) {
          isScanningRef.current = true;
          setScannerReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          setCameraError(
            err.toString().includes('NotAllowed') || err.toString().includes('Permission')
              ? 'Camera access was denied. Please allow camera permissions.'
              : 'Could not start camera. Please try again.'
          );
        }
      }
    };

    setCameraError('');
    setQrDetected(false);
    setScannerReady(false);
    startScanner();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [activeTab, navigate]);

  const tabContainerStyle = {
    display: 'flex',
    width: '100%',
    background: '#F1F5F9',
    borderRadius: '14px',
    padding: '4px',
    gap: '4px',
  };

  const tabStyle = (isActive) => ({
    flex: 1,
    padding: '12px 16px',
    borderRadius: '11px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.25s ease',
    background: isActive ? '#2563EB' : 'transparent',
    color: isActive ? '#FFFFFF' : '#64748B',
    boxShadow: isActive ? '0 2px 8px rgba(37,99,235,0.25)' : 'none',
  });

  const viewfinderStyle = {
    width: '100%',
    maxWidth: '400px',
    aspectRatio: '1',
    margin: '0 auto',
    borderRadius: '20px',
    overflow: 'hidden',
    position: 'relative',
    background: '#0F172A',
  };

  return (
    <div className="page-container bg-gray-50/50">
      <div className="container-saas py-12">
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'center' }} className="verify-two-col">
          
          {/* Left: Hero Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '32px' }}
            className="verify-left-col"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', width: 'fit-content' }} className="text-primary bg-primary/5 border border-primary/10">
                Verification Hub
              </span>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1 }} className="text-dark">
                Trust, <span className="text-primary">Verified.</span>
              </h1>
              <p style={{ fontSize: '1.125rem', fontWeight: 300, maxWidth: '28rem', lineHeight: 1.6 }} className="text-gray">
                Scan a QR code or enter your pharmaceutical token ID to perform an instant cryptographic audit of the supply chain history.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', paddingTop: '16px' }}>
              <div style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="bg-white border border-gray-100 shadow-sm">
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-primary/5 text-primary">
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '0.875rem' }} className="text-dark">Genuine Check</h4>
                <p style={{ fontSize: '0.75rem', fontWeight: 300 }} className="text-gray">Verify manufacturer signatures and batch origins.</p>
              </div>
              <div style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }} className="bg-white border border-gray-100 shadow-sm">
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-amber-500/5 text-amber-500">
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: '0.875rem' }} className="text-dark">Integrity Audit</h4>
                <p style={{ fontSize: '0.75rem', fontWeight: 300 }} className="text-gray">Detect potential tampering or counterfeit batches.</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Input Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            style={{ width: '50%', flexShrink: 0, padding: '36px', position: 'relative', overflow: 'hidden' }}
            className="saas-card verify-right-col"
          >
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '32px', opacity: 0.05 }}>
              <svg style={{ width: '128px', height: '128px' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Tab Switcher */}
              <div style={tabContainerStyle}>
                <button
                  style={tabStyle(activeTab === 'scan')}
                  onClick={() => { setActiveTab('scan'); setError(''); }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Scan QR Code
                </button>
                <button
                  style={tabStyle(activeTab === 'token')}
                  onClick={() => { setActiveTab('token'); setError(''); setCameraError(''); }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Enter Token ID
                </button>
              </div>

              {/* ===== SCAN TAB — always in DOM, toggled with display ===== */}
              <div style={{ display: activeTab === 'scan' ? 'flex' : 'none', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                {qrDetected ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{
                      ...viewfinderStyle,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                      style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                    <p style={{ color: '#22C55E', fontWeight: 700, fontSize: '16px' }}>QR Detected ✓</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: '12px' }}>Verifying...</p>
                  </motion.div>
                ) : cameraError ? (
                  <div style={{
                    ...viewfinderStyle,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px', padding: '32px',
                  }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l-2 2m0 0l-2 2m2-2l2 2m-2-2l-2-2m9 3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '14px', textAlign: 'center', lineHeight: 1.5 }}>{cameraError}</p>
                    <button
                      onClick={() => { setCameraError(''); setActiveTab('token'); setTimeout(() => setActiveTab('scan'), 150); }}
                      style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: '#2563EB', color: '#FFFFFF', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <div style={viewfinderStyle}>
                      <div id="qr-reader" style={{ width: '100%', height: '100%' }} />
                      {scannerReady && (
                        <div style={{ position: 'absolute', inset: '20%', pointerEvents: 'none', zIndex: 10 }}>
                          <div style={{ position: 'absolute', top: 0, left: 0, width: '28px', height: '28px', borderTop: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '4px 0 0 0', animation: 'pulse-bracket 2s ease-in-out infinite' }} />
                          <div style={{ position: 'absolute', top: 0, right: 0, width: '28px', height: '28px', borderTop: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 4px 0 0', animation: 'pulse-bracket 2s ease-in-out infinite 0.5s' }} />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '28px', height: '28px', borderBottom: '3px solid #2563EB', borderLeft: '3px solid #2563EB', borderRadius: '0 0 0 4px', animation: 'pulse-bracket 2s ease-in-out infinite 1s' }} />
                          <div style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderBottom: '3px solid #2563EB', borderRight: '3px solid #2563EB', borderRadius: '0 0 4px 0', animation: 'pulse-bracket 2s ease-in-out infinite 1.5s' }} />
                          <div style={{ position: 'absolute', left: '4px', right: '4px', height: '2px', background: 'linear-gradient(90deg, transparent, #2563EB, transparent)', animation: 'scan-line 2.5s ease-in-out infinite' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#94A3B8', textAlign: 'center', lineHeight: 1.6, maxWidth: '300px' }}>
                  Point your camera at the QR code on the medicine packaging
                </p>
              </div>

              {/* ===== TOKEN TAB — always in DOM, toggled with display ===== */}
              <div style={{ display: activeTab === 'token' ? 'flex' : 'none', flexDirection: 'column', gap: '24px' }}>
                <div style={{ textAlign: 'center' }}>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }} className="text-dark">Manual Verification</h3>
                  <p style={{ fontSize: '0.875rem', fontWeight: 300, marginTop: '8px' }} className="text-gray">Enter the ID located on the product packaging.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ height: '56px', border: '1px solid #F3F4F6', borderRadius: '16px', overflow: 'hidden', display: 'flex', alignItems: 'center', transition: 'all 0.2s' }} className="bg-gray-50 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
                    <div style={{ paddingLeft: '20px', paddingRight: '12px', color: 'rgba(100,116,139,0.4)' }}>
                      <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <input 
                      type="text" value={token}
                      onChange={(e) => setToken(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                      placeholder="Enter Token ID"
                      style={{ flex: 1, padding: '0 8px', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontWeight: 500, fontSize: '0.875rem' }}
                    />
                  </div>
                  
                  <button
                    onClick={() => handleVerify()}
                    disabled={verifying}
                    style={{ width: '100%', height: '56px', borderRadius: '16px', fontWeight: 800, fontSize: '0.875rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', opacity: verifying ? 0.5 : 1 }}
                    className="bg-primary text-white hover:bg-primary/90 transition-all shadow-xl shadow-primary/20"
                  >
                    {verifying ? (
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <>
                        <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Perform Comprehensive Audit
                      </>
                    )}
                  </button>
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    style={{ padding: '16px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 500, textAlign: 'center', border: '1px solid #FEE2E2' }}
                    className="bg-red-50 text-red-600"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(243,244,246,1)', textAlign: 'center' }}>
                 <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(100,116,139,0.3)', marginBottom: '16px' }}>Secured by AuthenTick Network</p>
                 <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', opacity: 0.2 }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#9CA3AF' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#9CA3AF' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#9CA3AF' }} />
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-bracket {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes scan-line {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        #qr-reader video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          border-radius: 20px;
        }
        #qr-reader { border: none !important; }
        #qr-reader > div:last-child { display: none !important; }
        #qr-reader img { display: none !important; }
        #qr-reader__scan_region { min-height: unset !important; }
        #qr-reader__dashboard { display: none !important; }
        #qr-reader__dashboard_section { display: none !important; }
        #qr-reader__dashboard_section_swaplink { display: none !important; }
      `}</style>
    </div>
  );
}
