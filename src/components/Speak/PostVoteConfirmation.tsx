import React, { useEffect, useState } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { DPNState } from '../../types';

export const PostVoteConfirmation: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const lastSubmittedOpinion = useDPNStore((s: DPNState) => s.lastSubmittedOpinion);

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!lastSubmittedOpinion) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      overflowY: 'auto',
      paddingBottom: '32px'
    }}>
      {/* 1. Header */}
      <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('room')}
          style={{
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '12px 0',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Kembali ke Sidang
        </button>
      </div>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Checkmark animation */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          border: '2px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline
              points="20 6 9 17 4 12"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--text-primary)',
          margin: '0 0 8px',
          fontWeight: 400
        }}>
          Suaramu tercatat.
        </h2>
        
        <p style={{
          fontSize: '13px',
          color: 'var(--text-tertiary)',
          margin: '0 0 32px',
          fontFamily: 'var(--font-ui)',
          textAlign: 'center'
        }}>
          Tercatat permanen di arsip DPN.
        </p>

        {/* Embedded Share Card (Static version for confirmation screen) */}
        <div style={{ 
          width: '100%', 
          maxWidth: '340px',
          transform: 'scale(0.95)',
          filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))'
        }}>
          {/* We'll modify ShareCard to be usable as a child or just re-implement the visual here */}
          {/* For now, just using it as is if hidden behind opacity logic */}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '11px', fontStyle: 'italic', marginTop: '-10px', marginBottom: '32px'}}>
          Lihat di bawah untuk membagikan kartu suaramu.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ padding: '0 24px' }}>
        <button
          onClick={() => {}} // This should trigger the share logic from ShareCard
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--accent)',
            color: 'var(--surface-0)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '12px'
          }}
        >
          ↗ Bagikan Kartu Suara
        </button>
        <button
          onClick={() => setScreen('room')}
          style={{
            width: '100%',
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Kembali ke Sidang
        </button>
      </div>
    </div>
  );
};
