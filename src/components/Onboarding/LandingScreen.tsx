import React, { useEffect, useState } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';

export const LandingScreen: React.FC = () => {
  const setScreen = useDPNStore(s => s.setScreen);
  const { isLoggedIn, provinceId, hasCompletedOnboarding } = useUserStore();
  const [visible, setVisible] = useState(false);

  // Auth guard — redirect if already logged in
  useEffect(() => {
    if (isLoggedIn && provinceId && hasCompletedOnboarding) {
      setScreen('room');
      return;
    }
    if (isLoggedIn && !provinceId) {
      setScreen('onboarding');
      return;
    }
    // Show landing
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '0 24px',
      textAlign: 'center',
      overflow: 'hidden',
      opacity: visible ? 1 : 0,
      transition: 'opacity 400ms ease',
    }}>
      {/* Subtle top glow */}
      <div style={{
        position: 'absolute',
        top: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: '100%', height: '35%',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(184,164,114,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Top spacer */}
      <div style={{ flex: '0 0 22vh' }} />

      {/* Icon */}
      <div style={{
        fontSize: '36px',
        color: 'var(--accent)',
        lineHeight: 1,
        marginBottom: '12px',
      }}>🏛</div>

      {/* Wordmark */}
      <div style={{
        fontSize: '11px',
        fontWeight: 600,
        color: 'var(--accent)',
        fontFamily: 'var(--font-ui)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '24px',
      }}>
        Dewan Perwakilan Netizen
      </div>

      {/* Headline */}
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '28px',
        color: 'var(--text-primary)',
        fontWeight: 400,
        lineHeight: 1.2,
        margin: '0 0 12px',
      }}>
        Suaramu untuk Indonesia.
      </h1>

      {/* Subheadline */}
      <p style={{
        fontFamily: 'var(--font-ui)',
        fontSize: '14px',
        color: 'var(--text-secondary)',
        lineHeight: 1.65,
        margin: '0 0 40px',
        maxWidth: '280px',
      }}>
        Ikut voting isu kebijakan nyata. Lihat apakah DPR sejalan dengan rakyat. Semua tercatat permanen.
      </p>

      {/* Primary CTA */}
      <button
        onClick={() => setScreen('auth')}
        style={{
          width: '100%',
          maxWidth: '360px',
          height: '48px',
          background: 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          color: 'var(--surface-0)',
          fontFamily: 'var(--font-ui)',
          fontWeight: 600,
          fontSize: '15px',
          cursor: 'pointer',
          letterSpacing: '0.02em',
          transition: 'transform 150ms ease',
          WebkitTapHighlightColor: 'transparent',
        }}
        onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
        onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
        onPointerCancel={e => (e.currentTarget.style.transform = 'scale(1)')}
      >
        Masuk sebagai Warga
      </button>

      {/* Secondary CTA */}
      <button
        onClick={() => setScreen('room')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          fontSize: '13px',
          cursor: 'pointer',
          marginTop: '16px',
          padding: '8px 4px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        Lihat sidang tanpa masuk →
      </button>

      {/* Flex spacer */}
      <div style={{ flex: 1 }} />

      {/* Disclaimer */}
      <div style={{
        position: 'absolute',
        bottom: 'max(24px, env(safe-area-inset-bottom, 24px))',
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        fontStyle: 'italic',
      }}>
        Platform aspirasi publik. Bukan lembaga negara.
      </div>
    </div>
  );
};
