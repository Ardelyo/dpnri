import React from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { DPNState } from '../../types';

export const LandingScreen: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);

  // If user already registered, we should ideally not be here, 
  // but if we are, allow skip.
  const handleStart = () => {
    if (userProvinsi) {
      setScreen('room');
    } else {
      setScreen('onboarding'); // This will show the Province Picker
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px',
      zIndex: 300,
      textAlign: 'center',
    }}>
      {/* Header Area */}
      <div style={{ marginTop: '20vh' }}>
        <div style={{ fontSize: '32px', marginBottom: '16px' }}>🏛</div>
        <div style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: 'var(--accent)', 
          letterSpacing: '0.08em', 
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase'
        }}>
          DEWAN PERWAKILAN NETIZEN
        </div>
      </div>

      {/* Value Proposition */}
      <div style={{ paddingBottom: '16vh' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          color: 'var(--text-primary)',
          margin: '0 0 12px',
          fontWeight: 400,
          lineHeight: 1.1
        }}>
          Suaramu untuk Indonesia.
        </h1>
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '280px',
          margin: '0 auto',
        }}>
          Ikut voting isu kebijakan nyata. Bandingkan suara rakyat dengan keputusan DPR. Semua tercatat permanen.
        </p>

        <button
          onClick={handleStart}
          style={{
            marginTop: '32px',
            width: '100%',
            height: '48px',
            background: 'var(--accent)',
            color: 'var(--surface-0)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font-ui)'
          }}
        >
          Masuk sebagai Warga →
        </button>
      </div>

      {/* Footer */}
      <div style={{
        paddingBottom: 'env(safe-area-inset-bottom, 24px)',
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        fontStyle: 'italic',
        fontFamily: 'var(--font-ui)'
      }}>
        Platform aspirasi publik. Bukan lembaga negara.
      </div>
    </div>
  );
};
