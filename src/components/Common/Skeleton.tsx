import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  margin?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  width = '100%', 
  height = '20px', 
  borderRadius = 'var(--radius-sm)',
  margin = '0'
}) => {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      margin,
      background: 'var(--surface-2)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
        animation: 'skeleton-pulse 1.5s infinite linear',
      }} />
      <style>{`
        @keyframes skeleton-pulse {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export const RisalahCardSkeleton: React.FC = () => (
  <div style={{
    padding: '16px',
    background: 'var(--surface-1)',
    borderRadius: 'var(--radius-md)',
    marginBottom: '12px',
    border: '1px solid var(--surface-3)',
  }}>
    <Skeleton width="60%" height="24px" margin="0 0 12px 0" />
    <Skeleton width="40%" height="12px" margin="0 0 16px 0" />
    <div style={{ display: 'flex', gap: '2px', marginBottom: '8px' }}>
      <Skeleton width="50%" height="6px" />
      <Skeleton width="20%" height="6px" />
      <Skeleton width="30%" height="6px" />
    </div>
    <Skeleton width="100%" height="12px" />
  </div>
);
