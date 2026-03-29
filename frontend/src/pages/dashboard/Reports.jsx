import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getReports } from '../../api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await getReports();
      setReports(res.data);
    } catch {}
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-8"
    >
      <div className="pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-extrabold text-dark tracking-tight">Security Anomalies</h1>
        <p className="text-sm font-light text-gray mt-1">Review flagged security incidents and suspicious network activity.</p>
      </div>

      <div className="saas-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Token ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Telemetry Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest">Reporter</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray uppercase tracking-widest text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {reports.map((r, idx) => (
                <tr key={r.id} className="hover:bg-error/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <code className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-1 rounded border border-primary/10">
                      {r.productToken?.slice(0, 12)}...
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                      <p className="font-bold text-dark">{r.reason}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-[13px] text-gray font-light line-clamp-1 max-w-xs">{r.details || 'No additional data.'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-dark">{r.reporterEmail || 'Public Node'}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs font-semibold text-gray/50">{new Date(r.createdAt).toLocaleDateString()}</p>
                    <p className="text-[10px] text-gray/30 font-bold uppercase tracking-tighter">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && reports.length === 0 && (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-success/5 text-success rounded-2xl flex items-center justify-center mx-auto mb-4 border border-success/10">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-dark mb-1">Network Integrity Secure</h3>
              <p className="text-sm font-light text-gray">No suspicious activities have been reported across nodes.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
