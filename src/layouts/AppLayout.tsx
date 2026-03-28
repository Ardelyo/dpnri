import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }: AppLayoutProps) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface-0)',
      }}
    >
      {children}

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
