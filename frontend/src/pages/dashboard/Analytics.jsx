import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStats, getScanActivity, getRecentScans, getBatches } from '../../api';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { SkeletonStats, SkeletonChart } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const COLORS = ['#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

function AnimatedNumber({ value, duration = 1000 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

function ScoreLabel({ score }) {
  if (score >= 90) return <span style={{ color: '#22C55E', fontWeight: 700 }}>Excellent</span>;
  if (score >= 70) return <span style={{ color: '#2563EB', fontWeight: 700 }}>Good</span>;
  if (score >= 50) return <span style={{ color: '#F59E0B', fontWeight: 700 }}>Moderate</span>;
  return <span style={{ color: '#EF4444', fontWeight: 700 }}>Compromised</span>;
}

function ScoreBadge({ score }) {
  const bg = score >= 90 ? '#F0FDF4' : score >= 70 ? '#EFF6FF' : score >= 50 ? '#FFFBEB' : '#FEF2F2';
  const color = score >= 90 ? '#22C55E' : score >= 70 ? '#2563EB' : score >= 50 ? '#F59E0B' : '#EF4444';
  return (
    <span style={{ padding: '4px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, background: bg, color }}>{score}/100</span>
  );
}

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [s, a, b] = await Promise.all([getStats(), getScanActivity(), getBatches()]);
        setStats(s.data);
        setActivity(a.data);
        setBatches(b.data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>Analytics</h1></div>
        <SkeletonStats count={4} />
        <SkeletonChart />
        <SkeletonChart height="250px" />
      </motion.div>
    );
  }

  const filteredActivity = activity.slice(0, range);

  // Scan distribution data
  const scanDist = [
    { name: 'Authentic', value: Math.max(0, (stats?.totalScans || 0) - (stats?.duplicateScans || 0)), color: '#22C55E' },
    { name: 'Duplicate', value: stats?.duplicateScans || 0, color: '#F59E0B' },
  ];

  // Sort batches by integrity score
  const sortedBatches = [...batches]
    .filter(b => b.integrityScore !== undefined)
    .sort((a, b) => (a.integrityScore || 100) - (b.integrityScore || 100));

  const statCards = [
    { label: 'Total Scans', value: stats?.totalScans || 0, icon: '⚡', color: '#22C55E' },
    { label: 'This Week', value: filteredActivity.slice(0, 7).reduce((s, d) => s + (d.scans || 0), 0), icon: '📊', color: '#2563EB' },
    { label: 'Fake Reports', value: stats?.totalReports || 0, icon: '🚨', color: '#EF4444' },
    { label: 'Active Batches', value: stats?.totalBatches || 0, icon: '📦', color: '#8B5CF6' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-primary, #0F172A)' }}>Analytics</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary, #64748B)', marginTop: '4px' }}>Comprehensive supply chain intelligence and scan analytics.</p>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {statCards.map((stat, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface, #FFF)', borderRadius: '20px', padding: '24px',
            border: '1px solid var(--border-color, #F1F5F9)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '24px' }}>{stat.icon}</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color }} />
            </div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}><AnimatedNumber value={stat.value} /></p>
          </div>
        ))}
      </div>

      {/* Scan Activity Chart */}
      <div style={{ background: 'var(--bg-surface, #FFF)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-color, #F1F5F9)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>Scan Activity</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Daily verification volume</p>
          </div>
          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-surface-hover, #F1F5F9)', borderRadius: '12px', padding: '4px' }}>
            {[7, 30, 90].map(d => (
              <button key={d} onClick={() => setRange(d)}
                style={{
                  padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                  fontSize: '12px', fontWeight: 700, transition: 'all 0.2s',
                  background: range === d ? '#2563EB' : 'transparent',
                  color: range === d ? '#FFF' : 'var(--text-secondary)',
                }}>
                {d}D
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: '280px' }}>
          {filteredActivity.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color, #F1F5F9)" />
                <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted, #94A3B8)' }} />
                <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted, #94A3B8)' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="scans" stroke="#2563EB" strokeWidth={3} dot={{ fill: '#2563EB', r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState type="magnifier" title="No scan data yet" subtitle="Scan activity will be graphed here as verifications happen." />
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Scan Distribution Pie */}
        <div style={{ background: 'var(--bg-surface, #FFF)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-color, #F1F5F9)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>Scan Result Distribution</h3>
          <div style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={scanDist} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {scanDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Scanned Medicines Bar */}
        <div style={{ background: 'var(--bg-surface, #FFF)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-color, #F1F5F9)' }}>
          <h3 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>Top Scanned Medicines</h3>
          <div style={{ height: '220px' }}>
            {batches.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={batches.slice(0, 5).map(b => ({ name: b.medicineName || b.batchNumber, scans: b.totalScans || 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }} />
                  <Bar dataKey="scans" fill="#2563EB" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState type="box" title="No data yet" subtitle="Medicine scan distribution will appear here." />
            )}
          </div>
        </div>
      </div>

      {/* Batch Integrity Table */}
      <div style={{ background: 'var(--bg-surface, #FFF)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-color, #F1F5F9)' }}>
        <h3 style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', marginBottom: '20px' }}>Batch Integrity Overview</h3>
        {sortedBatches.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color, #F1F5F9)' }}>
                  {['Batch', 'Medicine', 'Score', 'Rating', 'Status', 'Expiry'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedBatches.map((b, i) => (
                  <tr key={b.id || i} style={{ borderBottom: '1px solid var(--border-color, #F8FAFC)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{b.batchNumber}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{b.medicineName || '—'}</td>
                    <td style={{ padding: '14px 16px' }}><ScoreBadge score={b.integrityScore || 100} /></td>
                    <td style={{ padding: '14px 16px' }}><ScoreLabel score={b.integrityScore || 100} /></td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 700,
                        background: b.status === 'RECALLED' ? '#FEF2F2' : b.status === 'EXPIRED' ? '#FEF2F2' : b.status === 'EXPIRING_SOON' ? '#FFFBEB' : '#F0FDF4',
                        color: b.status === 'RECALLED' ? '#EF4444' : b.status === 'EXPIRED' ? '#EF4444' : b.status === 'EXPIRING_SOON' ? '#F59E0B' : '#22C55E',
                      }}>
                        {b.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{b.expiryDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState type="box" title="No batches yet" subtitle="Register your first batch to see integrity scores." />
        )}
      </div>
    </motion.div>
  );
}
