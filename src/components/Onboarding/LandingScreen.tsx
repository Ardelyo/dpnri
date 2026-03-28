import React from 'react';
import { useDPNStore } from '../../store/dpnStore';

export const LandingScreen: React.FC = () => {
  const setScreen = useDPNStore(s => s.setScreen);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '24px',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* Background Decorative Flare */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '120%',
        height: '40%',
        background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: '12px',
        color: 'var(--accent)',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginBottom: '16px',
        fontFamily: 'var(--font-ui)',
      }}>
        PROYEK DEMOKRASI DIGITAL
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '42px',
        lineHeight: 1,
        color: 'var(--text-primary)',
        margin: '0 0 16px',
        fontWeight: 400,
      }}>
        DEWAN <br />
        PERWAKILAN <br />
        NETIZEN
      </h1>

      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '15px',
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
        maxWidth: '300px',
        margin: '0 0 48px',
        fontWeight: 400,
      }}>
        Suaramu adalah kedaulatan. Ikut serta dalam sidang rakyat digital pertama di Indonesia.
      </p>

      <button
        onClick={() => setScreen('onboarding')}
        style={{
          width: '200px',
          height: '52px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          color: 'var(--surface-0)',
          fontWeight: 700,
          fontSize: '15px',
          fontFamily: 'var(--font-ui)',
          cursor: 'pointer',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          boxShadow: 'var(--shadow-lg)',
          transition: 'transform 200ms ease',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        MASUK SIDANG
      </button>

      <div style={{
        position: 'absolute',
        bottom: '32px',
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        letterSpacing: '0.05em',
        opacity: 0.6,
      }}>
        VERSI KONSEP 0.2 • 2024
      </div>
    </div>
  );
};
