import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getMedicines, createMedicine } from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AddMedicine() {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    manufacturer: '',
    description: '',
    category: '',
    manufactureDate: '',
    expiryDate: '',
    quantity: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMedicines();
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

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const res = await getMedicines();
      if (res && res.data && Array.isArray(res.data)) {
        setMedicines(res.data);
      } else if (res && Array.isArray(res)) {
        setMedicines(res);
      } else {
        setMedicines([]);
      }
    } catch (err) {
      console.error("API Error:", err);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createMedicine(form);
      setShowModal(false);
      setForm({ name: '', manufacturer: '', description: '', category: '', manufactureDate: '', expiryDate: '', quantity: '' });
      fetchMedicines();
    } catch {}
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
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Medicine Inventory</h1>
          <p className="text-sm font-light text-gray mt-1">Manage and register pharmaceutical products on the network.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-saas-primary"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <div className="lg:col-span-2 py-20 text-center">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray font-light">Retrieving inventory...</p>
          </div>
        ) : Array.isArray(medicines) && medicines.length > 0 ? (
          medicines.map((m, idx) => (
          <div 
            key={m._id || m.id || `med-${idx}`} 
            className="saas-card group flex flex-col h-full"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex-1">
                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded inline-block mb-3 uppercase tracking-widest border border-primary/10">
                  {m.category || 'General'}
                </span>
                <h3 className="text-xl font-bold text-dark leading-tight">{m.name}</h3>
                <p className="text-xs font-semibold text-gray/50 mt-1 uppercase tracking-tight">{m.manufacturer}</p>
              </div>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray/30 group-hover:text-primary transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray font-light line-clamp-2 mb-8 flex-1 leading-relaxed">{m.description}</p>
            <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray/30">
              <span>Added: {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : 'Pending'}</span>
              <span>ID: {m.id ? String(m.id).slice(0, 8) : 'GEN-TRK'}...</span>
            </div>
          </div>
        ))
        ) : !loading && (
          <div className="lg:col-span-2 py-32 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-[24px] text-center">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray/20">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-dark mb-1 tracking-tight">Empty Inventory</h3>
            <p className="text-sm text-gray font-light mb-6">Register a pharmaceutical product to begin tracking.</p>
            <button
              onClick={() => setShowModal(true)}
              className="btn-saas-primary mx-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Register First Medicine
            </button>
          </div>
        )}
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
                    New Product
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#94A3B8',
                    margin: '6px 0 0 0',
                  }}>
                    Register a new medicine in the network.
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
                    <label style={labelStyle}>Product Name</label>
                    <input
                      required
                      type="text"
                      style={inputStyle}
                      placeholder="e.g. Paracetamol 500mg"
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={fieldGap}>
                    <label style={labelStyle}>Manufacturer</label>
                    <input
                      required
                      type="text"
                      style={inputStyle}
                      placeholder="e.g. PharmaCorp"
                      value={form.manufacturer}
                      onChange={e => setForm({...form, manufacturer: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={fieldGap}>
                    <label style={labelStyle}>Category</label>
                    <select
                      style={{ ...inputStyle, appearance: 'auto' }}
                      value={form.category}
                      onChange={e => setForm({...form, category: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    >
                      <option value="">Select category...</option>
                      <option value="Analgesic">Analgesic</option>
                      <option value="Antibiotic">Antibiotic</option>
                      <option value="Antifungal">Antifungal</option>
                      <option value="Antiseptic">Antiseptic</option>
                      <option value="Cardiovascular">Cardiovascular</option>
                      <option value="Supplement">Supplement</option>
                      <option value="Vaccine">Vaccine</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div style={fieldGap}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      rows={3}
                      style={{ ...inputStyle, resize: 'none' }}
                      placeholder="Standard dosage or indications..."
                      value={form.description}
                      onChange={e => setForm({...form, description: e.target.value})}
                      onFocus={(e) => { e.target.style.borderColor = '#2563EB'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                      onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', ...fieldGap }}>
                    <div>
                      <label style={labelStyle}>Manufacturing Date</label>
                      <input
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
                    <label style={labelStyle}>Quantity / Units in Batch</label>
                    <input
                      type="number"
                      min="1"
                      style={inputStyle}
                      placeholder="e.g. 5000"
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
                    {submitting ? 'Registering...' : 'Complete Registration'}
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
