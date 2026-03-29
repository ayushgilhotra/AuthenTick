import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { verifyToken, submitReport } from '../api';

const statusConfig = {
  genuine: { icon: '✅', label: 'Genuine', bg: 'bg-genuine-tint', border: 'border-success/20', color: 'text-success' },
  suspicious: { icon: '⚠️', label: 'Suspicious', bg: 'bg-suspicious-tint', border: 'border-warning/20', color: 'text-warning' },
  expired: { icon: '🔴', label: 'Expired', bg: 'bg-expired-tint', border: 'border-error/20', color: 'text-error' },
  recalled: { icon: '🚫', label: 'Recalled', bg: 'bg-purple-50', border: 'border-purple-200', color: 'text-purple-600' },
  invalid: { icon: '❌', label: 'Invalid', bg: 'bg-expired-tint', border: 'border-error/20', color: 'text-error' },
};

export default function Result() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: '', details: '', reporterEmail: '' });
  const [reportSent, setReportSent] = useState(false);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await verifyToken(token);
        setData(res.data);
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
      setTimeout(() => setShowReport(false), 2000);
    } catch {}
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50/50">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray font-light">Decrypting authenticity...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50/50">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4 saas-card">
          <div className="text-5xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-dark mb-4">Verification Fault</h2>
          <p className="text-gray font-light mb-8">{error}</p>
          <Link to="/verify" className="btn-saas-primary no-underline inline-block">
            New Audit
          </Link>
        </motion.div>
      </div>
    );
  }

  const status = statusConfig[data?.status] || statusConfig.invalid;

  return (
    <div className="min-h-screen container-saas py-12">
      <div className="container-saas py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/verify" className="inline-flex items-center gap-2 text-xs font-semibold text-gray hover:text-primary transition-colors no-underline mb-8">
            ← Back to scanner
          </Link>

          {/* Status Main Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className={`saas-card mb-12 p-12 flex flex-col items-center text-center border-2 ${status.bg} ${status.border}`}
          >
            <div className="text-6xl mb-6">{status.icon}</div>
            <h1 className="text-4xl font-extrabold text-dark mb-4">Authentication Report</h1>
            <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white border ${status.border} ${status.color} font-bold text-sm mb-6`}>
              <span className={`w-2 h-2 rounded-full ${status.bg.replace('tint', '600')} animate-pulse`} />
              {status.label} Status
            </div>
            <div className="w-full max-w-3xl mx-auto">
              <p className="text-gray font-light leading-relaxed">
                {data?.message || "Internal protocol discrepancy detected. The token signature did not match the manufacturer node."}
              </p>
            </div>
          </motion.div>

          {/* Detailed Info Grid */}
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <div className="saas-card">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold">Medicine Passport</h3>
                  <code className="text-[10px] bg-gray-50 px-2 py-1 rounded text-primary">{token}</code>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                  {[
                    { label: 'Product Name', value: data?.medicineName, icon: '💊' },
                    { label: 'Manufacturer', value: data?.manufacturer, icon: '🏭' },
                    { label: 'Batch ID', value: data?.batchNumber, icon: '📦' },
                    { label: 'Classification', value: data?.category, icon: '🏷️' },
                    { label: 'Mfg Date', value: data?.manufactureDate, icon: '🗓️' },
                    { label: 'Expiry Date', value: data?.expiryDate, icon: '⌛' },
                  ].map((item, i) => (
                    <div key={i}>
                      <p className="text-[10px] font-bold text-gray uppercase tracking-widest mb-1">{item.label}</p>
                      <div className="flex items-center gap-2">
                         <span className="opacity-40">{item.icon}</span>
                         <p className="text-md font-medium text-dark">{item.value || 'Data Restricted'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Audit Log */}
              <div className="saas-card bg-dark text-white border-none shadow-xl">
                 <h3 className="text-xs font-bold mb-8 uppercase tracking-widest flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
                   Network Log
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Global Scan Count</span>
                      <span className="text-xl font-bold text-primary">{data?.scanCount || 0}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Last Verifier</span>
                      <span className="text-sm font-medium">{data?.lastScanLocation || 'Unified Secure Node'}</span>
                    </div>
                    
                    {data?.scanCount > 10 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-3 items-start">
                         <span className="text-xl">⚠️</span>
                         <div>
                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">High Frequency Alert</p>
                            <p className="text-[11px] text-red-300/60 font-medium">Excessive scan propagation detected across multiple nodes. Potential illicit duplicate.</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
            </div>

            {/* Sidebar Actions */}
            <div className="space-y-6">
              <div className="saas-card p-xl">
                <h3 className="text-[10px] font-bold text-gray uppercase tracking-widest mb-6">History</h3>
                <div className="relative pl-6 space-y-8 border-l border-gray-100 ml-1">
                  {(data?.scanTimeline?.length > 0 ? data.scanTimeline.slice(0, 3) : [
                    { location: 'Manufacturer Entry', date: data?.manufactureDate || 'Origin' },
                    { location: 'Current Verification', date: 'Today' }
                  ]).map((entry, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[30px] top-1 w-2 h-2 bg-white border-2 border-primary rounded-full" />
                      <p className="text-sm font-bold text-dark">{entry.location}</p>
                      <p className="text-[10px] text-gray font-light">{entry.date}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  onClick={() => setShowReport(true)}
                  className="w-full btn-saas-secondary text-error border-error/10 hover:bg-error/5"
                >
                  Report Anomaly
                </button>
                <Link to="/verify" className="w-full btn-saas-primary no-underline">
                  Next Scan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }}
              className="bg-white rounded-[24px] p-10 w-full max-w-lg shadow-2xl"
            >
              {reportSent ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-success/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Report Transmitted</h3>
                  <p className="text-gray font-light">The security core has successfully logged the anomaly.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-error/5 rounded-xl flex items-center justify-center text-2xl">🚨</div>
                    <h3 className="text-2xl font-bold">Health Alert Report</h3>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold text-gray uppercase tracking-widest mb-2 block">Anomaly Classification</label>
                      <select
                        value={reportForm.reason}
                        onChange={(e) => setReportForm({...reportForm, reason: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm"
                      >
                        <option value="">Choose risk type...</option>
                        <option value="Duplicate Scan Result">Duplicate Node ID</option>
                        <option value="Packaging Tampering">Physical Tamper</option>
                        <option value="Incorrect Batch Info">Data Inconsistency</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray uppercase tracking-widest mb-2 block">Discrepancy Details</label>
                      <textarea
                        value={reportForm.details}
                        onChange={(e) => setReportForm({...reportForm, details: e.target.value})}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-sm resize-none"
                        placeholder="Provide details about the discrepancy..."
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowReport(false)} className="flex-1 py-3 text-sm font-bold text-gray hover:text-dark transition-colors">Cancel</button>
                      <button onClick={handleReport} className="flex-1 btn-saas-primary bg-error hover:bg-red-700">Submit Report</button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
