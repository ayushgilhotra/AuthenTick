import { useEffect, useState } from 'react';

export default function CursorGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (isMobile) return null;

  return (
    <div 
      className="cursor-glow"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)',
        borderRadius: '50%'
      }}
    />
  );
}
