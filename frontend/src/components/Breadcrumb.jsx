import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length <= 1) return null;

  const labelMap = {
    dashboard: 'Dashboard',
    customer: 'Dashboard',
    medicines: 'Medicines',
    batches: 'Batches',
    reports: 'Reports',
    verify: 'Verify Stock',
    'scan-history': 'Scan History',
    analytics: 'Analytics',
    'activity-log': 'Activity Log',
    history: 'History',
    profile: 'Profile',
    'generate-qr': 'QR Codes',
    settings: 'Settings',
  };

  const crumbs = segments.map((seg, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/');
    const label = labelMap[seg] || (seg.length > 12 ? seg.slice(0, 8) + '...' : seg.charAt(0).toUpperCase() + seg.slice(1));
    const isLast = i === segments.length - 1;
    return { path, label, isLast };
  });

  // On mobile, show only last 2
  const mobileCrumbs = crumbs.slice(-2);

  return (
    <nav style={{ padding: '12px 0 8px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      {/* Desktop: all crumbs */}
      <div className="hidden sm:flex" style={{ alignItems: 'center', gap: '8px' }}>
        {crumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && <span style={{ color: 'var(--text-muted, #CBD5E1)', fontSize: '11px' }}>/</span>}
            {crumb.isLast ? (
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #94A3B8)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#2563EB'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary, #94A3B8)'}>
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
      {/* Mobile: last 2 only */}
      <div className="sm:hidden" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {mobileCrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && <span style={{ color: 'var(--text-muted, #CBD5E1)', fontSize: '11px' }}>/</span>}
            {crumb.isLast ? (
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary, #0F172A)' }}>{crumb.label}</span>
            ) : (
              <Link to={crumb.path} style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary, #94A3B8)', textDecoration: 'none' }}>
                {crumb.label}
              </Link>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
