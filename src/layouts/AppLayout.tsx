import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100dvh',
        maxWidth: '430px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface-0)',
        color: 'var(--text-primary)',
        boxShadow: '0 0 100px rgba(0,0,0,0.5)', // Framing shadow
      }}
    >
      {/* Premium Texture Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 999,
        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />

      {/* Subtle Atmospheric Glows */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '60%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Landscape warning (CSS handles display) */}
      <div
        className="landscape-warning"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--surface-0)',
          zIndex: 9999,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '36px' }}>📱</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          padding: '0 40px',
          lineHeight: 1.5,
        }}>
          Putar HP ke mode portrait untuk pengalaman terbaik.
        </div>
      </div>
    </div>
  );
};
