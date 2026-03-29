import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductsByBatch, getProductQr } from '../../api';

export default function GenerateQR() {
  const { batchId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [batchId]);

  const fetchProducts = async () => {
    try {
      const res = await getProductsByBatch(batchId);
      setProducts(res.data);
    } catch {}
    setLoading(false);
  };

  const handleShowQr = async (product) => {
    setSelectedProduct(product);
    setQrLoading(true);
    setQrData(null);
    try {
      const res = await getProductQr(product.id);
      setQrData(res.data.qrCode);
    } catch {}
    setQrLoading(false);
  };

  const downloadQr = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.href = qrData;
    link.download = `QR-${selectedProduct.token}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
        <Link 
          to="/dashboard/batches" 
          className="p-2 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 text-gray transition-all no-underline"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Identity Retrieval</h1>
          <p className="text-sm font-light text-gray mt-1">Unit identifiers for Batch ID: {batchId?.slice(0, 8)}...</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="md:col-span-2">
          <div className="saas-card p-0 flex flex-col h-full max-h-[600px] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
              <h3 className="text-sm font-bold">Medicine Units</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                {products.length} Units
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {products.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleShowQr(p)}
                  className={`w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-all text-left ${selectedProduct?.id === p.id ? 'bg-primary/[0.02] border-l-2 border-primary' : 'border-l-2 border-transparent'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedProduct?.id === p.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray/40'}`}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeWidth="2.5" /></svg>
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${selectedProduct?.id === p.id ? 'text-primary' : 'text-dark'}`}>{p.token?.slice(0, 16)}...</p>
                      <p className="text-[10px] text-gray/50 font-semibold uppercase tracking-tight mt-0.5">Scanned: {p.scanCount}</p>
                    </div>
                  </div>
                  <svg className={`w-4 h-4 transition-colors ${selectedProduct?.id === p.id ? 'text-primary' : 'text-gray/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 5l7 7-7 7" strokeWidth="2.5" /></svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* QR Preview Area */}
        <div className="space-y-6">
          <div className="saas-card p-8 sticky top-28 text-center bg-white border-2 border-gray-50">
            <h3 className="text-lg font-bold mb-6">Security Token</h3>
            
            {selectedProduct ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="bg-gray-50/50 rounded-2xl p-8 mb-6 flex items-center justify-center min-h-[240px] border border-gray-100 relative">
                  {qrLoading ? (
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  ) : qrData ? (
                    <img 
                      src={qrData} 
                      alt="Product QR" 
                      className="w-40 h-40 shadow-xl bg-white p-2 rounded-xl border border-gray-100" 
                    />
                  ) : (
                    <p className="text-xs text-error font-bold uppercase tracking-widest">Load Fault</p>
                  )}
                </div>
                
                <div className="mb-8">
                  <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg inline-block mb-2">
                    <p className="text-xs font-bold text-dark tracking-tight">{selectedProduct.token}</p>
                  </div>
                  <p className="text-[10px] font-bold text-gray uppercase tracking-widest opacity-40">Encrypted Identifier</p>
                </div>

                <button
                  onClick={downloadQr}
                  disabled={!qrData}
                  className="w-full btn-saas-primary flex items-center justify-center gap-2 group"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2.5" /></svg>
                  Download PNG
                </button>
              </motion.div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-gray/20">
                <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" strokeWidth="1.5" /></svg>
                <p className="text-xs font-bold uppercase tracking-widest max-w-[160px] leading-relaxed">Select a unit to preview its unique encrypted identity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
