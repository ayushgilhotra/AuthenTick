import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { getStats, getScanActivity, getRecentScans } from '../../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import ScanHistory from './ScanHistory';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retailers see scan history as their dashboard home
  if (user?.role === 'RETAILER') {
    return <ScanHistory />;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, a, r] = await Promise.all([getStats(), getScanActivity(), getRecentScans()]);
        setStats(s.data);
        setActivity(a.data);
        setRecent(r.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-6"
    >
      <div className="flex justify-between items-end pb-4 border-b border-gray-100">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">Overview</h1>
          <p className="text-sm font-light text-gray mt-1">Real-time network analytics and supply chain activity.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/dashboard/medicines" className="btn-saas-primary py-2 px-4 text-xs no-underline">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Register Product
          </Link>
          <div className="text-right hidden sm:block">
          <p className="text-[10px] font-bold text-gray uppercase tracking-widest leading-none">Status</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-dark">Live Uplink</span>
          </div>
        </div>
      </div>
    </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Products', value: stats?.totalMedicines || 0, icon: '💊', color: 'text-primary' },
          { label: 'Network Batches', value: stats?.totalBatches || 0, icon: '📦', color: 'text-indigo-600' },
          { label: 'Verified Scans', value: stats?.totalScans || 0, icon: '⚡', color: 'text-emerald-600' },
          { label: 'Flagged Duplicates', value: stats?.duplicateScans || 0, icon: '🛡️', color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="saas-card flex flex-col justify-between group p-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity`}>{stat.label.split(' ')[0]}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray mb-1">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-dark">{stat.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 saas-card p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-lg font-bold">Verification Velocity</h3>
              <p className="text-xs font-light text-gray">Daily cryptographic confirmation volume</p>
            </div>
            <div className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray uppercase tracking-wider">
              System Cycle: 30D
            </div>
          </div>
          <div className="h-64 w-full">
            {activity.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activity}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#94A3B8' }}
                  />
                  <YAxis 
                    fontSize={10} 
                    axisLine={false} 
                    tickLine={false}
                    tick={{ fill: '#94A3B8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: 'var(--shadow-lg)' }}
                    itemStyle={{ fontWeight: 700, color: '#2563EB' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scans" 
                    stroke="#2563EB" 
                    strokeWidth={3} 
                    dot={{ fill: '#2563EB', r: 3, strokeWidth: 0 }} 
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray/30">
                <p className="text-sm font-medium">Telemetry data pending...</p>
              </div>
            )}
          </div>
        </div>

        {/* Live Feed */}
        <div className="saas-card overflow-hidden flex flex-col p-0">
          <div className="p-6 border-b border-gray-50">
            <h3 className="text-lg font-bold">Network Activity</h3>
            <p className="text-xs font-light text-gray">Live verification events</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {recent.map((scan, idx) => (
              <div key={scan.id} className="flex gap-4 group">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dark truncate">{scan.medicineName}</p>
                  <p className="text-[10px] text-gray uppercase font-semibold truncate leading-tight mt-0.5">{scan.location}</p>
                  <p className="text-[10px] text-gray/40 font-light mt-1">
                    {new Date(scan.scannedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Secure
                  </p>
                </div>
              </div>
            ))}
            {recent.length === 0 && (
              <div className="py-12 text-center opacity-30">
                <p className="text-xs font-bold italic">Awaiting network pulse...</p>
              </div>
            )}
          </div>
          <div className="p-4 bg-gray-50 mt-auto">
            <Link to="/dashboard/reports" className="block text-center text-[10px] font-bold text-gray uppercase tracking-widest no-underline hover:text-primary transition-colors">
              Full Security Ledger →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
