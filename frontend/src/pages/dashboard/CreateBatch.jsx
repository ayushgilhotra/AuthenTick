import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMedicines, getBatches, createBatch } from '../../api';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateBatch() {
  const [medicines, setMedicines] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ medicineId: '', batchNumber: '', manufactureDate: '', expiryDate: '', quantity: '' });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showModal]);

  const fetchData = async () => {
    try {
      const [mRes, bRes] = await Promise.all([getMedicines(), getBatches()]);
      setMedicines(mRes.data);
      setBatches(bRes.data);
    } catch {}
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createBatch(form);
      setShowModal(false);
      setForm({ medicineId: '', batchNumber: '', manufactureDate: '', expiryDate: '', quantity: '' });
      fetchData();
      navigate(`/dashboard/generate-qr/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create batch');
    }
    setSubmitting(false);
  };

  /* ── Inline style definitions ── */
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
  };

  const modalBoxStyle = {
    background: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '480px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
    position: 'relative',
    overflow: 'hidden',
  };

  const modalHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    flexShrink: 0,
  };

  const modalBodyStyle = {
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
    paddingRight: '4px',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 700,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px',
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: 500,
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    outline: 'none',
    background: '#F9FAFB',
    color: '#0F172A',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  };

  const fieldGap = { marginBottom: '16px' };

  const closeBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#F1F5F9',
    cursor: 'pointer',
    color: '#94A3B8',
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  const footerStyle = {
    display: 'flex',
    gap: '16px',
    paddingTop: '20px',
    borderTop: '1px solid #F1F5F9',
    marginTop: '8px',
    flexShrink: 0,
  };

  const cancelBtnStyle = {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748B',
    background: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  const submitBtnStyle = {
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 700,
    color: '#FFFFFF',
    background: '#2563EB',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Production Batches</h1>
          <p className="text-sm font-light text-gray mt-1">Track and manage medicine manufacturing series on the network.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-saas-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Batch
        </button>
      </div>

      <div className="saas-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Batch ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Medicine</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Exp. Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Qty</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {batches.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-dark">{b.batchNumber}</td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-dark leading-none">{b.medicineName}</p>
                  </td>
                  <td className="px-6 py-4 text-gray font-light">
                    {b.expiryDate ? new Date(b.expiryDate).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-dark">{(b.quantity || 0).toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray/30 uppercase ml-1">Units</span>
                  </td>
                  <td className="px-6 py-4">
                    {b.isRecalled ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-error/5 text-error text-[10px] font-bold uppercase tracking-widest border border-error/10">
                        Recalled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-success/5 text-success text-[10px] font-bold uppercase tracking-widest border border-success/10">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right space-x-4">
                    <button 
                      onClick={() => window.open(`http://localhost:8080/api/products/batch/${b.id}/download`, '_blank')}
                      className="text-emerald-600 hover:text-emerald-700 font-bold text-xs no-underline inline-flex items-center gap-1 group"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Bulk QR
                    </button>
                    <Link 
                      to={`/dashboard/generate-qr/${b.id}`} 
                      className="text-primary hover:text-primary-dark font-bold text-xs no-underline inline-flex items-center gap-1 group"
                    >
                      Retrieve QRs
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && batches.length === 0 && (
            <div className="py-20 text-center opacity-30">
              <p className="text-sm font-bold italic">No production cycles initialized.</p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ Fixed Modal ═══ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={overlayStyle}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              style={modalBoxStyle}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={modalHeaderStyle}>
                <div>
                  <h3 style={{
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.2,
                  }}>
                    New Batch
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#94A3B8',
                    margin: '6px 0 0 0',
                  }}>
                    Register a new manufacturing series.
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={closeBtnStyle}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.background = '#E2E8F0'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.background = '#F1F5F9'; }}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Scrollable Body */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div style={modalBodyStyle}>
                  <div style={fieldGap}>
                    <label style={labelStyle}>Batch Number</label>
                    <input
                      required
                      type="text"
                      style={inputStyle}
                      placeholder="e.g. BATCH-001"
                      value={form.batchNumber}
                      onChange={e => setForm({...form, batchNumber: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={fieldGap}>
                    <label style={labelStyle}>Medicine Name</label>
                    <select
                      required
                      style={{ ...inputStyle, appearance: 'auto' }}
                      value={form.medicineId}
                      onChange={e => setForm({...form, medicineId: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="">Select product...</option>
                      {medicines.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldGap }}>
                    <div>
                      <label style={labelStyle}>Manufacturing Date</label>
                      <input
                        required
                        type="date"
                        style={inputStyle}
                        value={form.manufactureDate}
                        onChange={e => setForm({...form, manufactureDate: e.target.value})}
                        onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Expiry Date</label>
                      <input
                        required
                        type="date"
                        style={inputStyle}
                        value={form.expiryDate}
                        onChange={e => setForm({...form, expiryDate: e.target.value})}
                        onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                        onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                      />
                    </div>
                  </div>

                  <div style={fieldGap}>
                    <label style={labelStyle}>Quantity</label>
                    <input
                      required
                      type="number"
                      min="1"
                      style={inputStyle}
                      placeholder="e.g. 1000"
                      value={form.quantity}
                      onChange={e => setForm({...form, quantity: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>
                </div>

                {/* Footer Buttons */}
                <div style={footerStyle}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={cancelBtnStyle}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      ...submitBtnStyle,
                      opacity: submitting ? 0.7 : 1,
                      cursor: submitting ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = '#1D4ED8'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#2563EB'; }}
                  >
                    {submitting ? 'Initializing...' : 'Complete Registration'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
