import { motion } from 'framer-motion';

const shimmerStyle = {
  background: 'linear-gradient(90deg, var(--skeleton-base, #E2E8F0) 25%, var(--skeleton-shine, #F1F5F9) 50%, var(--skeleton-base, #E2E8F0) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '12px',
};

export function SkeletonCard({ height = '120px', className = '' }) {
  return <div style={{ ...shimmerStyle, height, width: '100%' }} className={className} />;
}

export function SkeletonRow({ count = 5 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...shimmerStyle, height: '56px', width: '100%' }} />
      ))}
    </div>
  );
}

export function SkeletonStats({ count = 4 }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(count, 4)}, 1fr)`, gap: '20px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ ...shimmerStyle, height: '130px', width: '100%' }} />
      ))}
    </div>
  );
}

export function SkeletonChart({ height = '300px' }) {
  return <div style={{ ...shimmerStyle, height, width: '100%' }} />;
}

export function SkeletonText({ width = '60%', height = '16px' }) {
  return <div style={{ ...shimmerStyle, height, width }} />;
}

export function SkeletonPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <SkeletonText width="200px" height="28px" />
      <SkeletonText width="300px" height="14px" />
      <SkeletonStats />
      <SkeletonChart />
    </motion.div>
  );
}

export default function Skeleton({ variant = 'card', ...props }) {
  switch (variant) {
    case 'card': return <SkeletonCard {...props} />;
    case 'row': return <SkeletonRow {...props} />;
    case 'stats': return <SkeletonStats {...props} />;
    case 'chart': return <SkeletonChart {...props} />;
    case 'text': return <SkeletonText {...props} />;
    case 'page': return <SkeletonPage {...props} />;
    default: return <SkeletonCard {...props} />;
  }
}
