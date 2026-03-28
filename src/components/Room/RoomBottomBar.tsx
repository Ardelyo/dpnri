import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { VoteReceiptSheet } from '../Settings/SettingsScreen';

interface Props {
  onBicara: () => void;
  hasVoted: boolean;
  sidangNomor?: string;
}

export const RoomBottomBar: React.FC<Props> = ({ onBicara, hasVoted, sidangNomor }) => {
  const isLoggedIn = useUserStore(s => s.isLoggedIn);
  const getVote = useUserStore(s => s.getVote);
  const [showReceipt, setShowReceipt] = useState(false);

  const voteRecord = sidangNomor ? getVote(sidangNomor) : null;

  return (
    <>
      <div style={{
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
        borderTop: '1px solid var(--surface-3)',
        background: 'var(--surface-0)',
        flexShrink: 0,
        marginBottom: '56px', // room for bottom nav
      }}>
        {hasVoted ? (
          /* Already voted — tappable bar opens receipt */
          <button
            onClick={() => setShowReceipt(true)}
            style={{
              width: '100%',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <span style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
            }}>
              ✓ Kamu sudah bersuara
            </span>
          </button>
        ) : isLoggedIn ? (
          /* Primary CTA — Naik Podium */
          <button
            onClick={onBicara}
            style={{
              width: '100%',
              height: '48px',
              background: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary-dim)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--surface-0)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              letterSpacing: '0.02em',
              transition: 'transform var(--dur-fast) var(--ease-enter)',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
            }}
            onPointerDown={e => (e.currentTarget.style.transform = 'scale(0.98)')}
            onPointerUp={e => (e.currentTarget.style.transform = 'scale(1)')}
            onPointerCancel={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="10" width="12" height="5" rx="1" fill="currentColor" opacity="0.55" />
              <rect x="5" y="6" width="6" height="5" rx="1" fill="currentColor" opacity="0.75" />
              <rect x="7" y="2" width="2" height="5" rx="0.5" fill="currentColor" />
            </svg>
            Naik Podium
          </button>
        ) : (
          /* Not logged in — prompt to sign in */
          <button
            onClick={onBicara}
            style={{
              width: '100%',
              height: '48px',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--accent)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              letterSpacing: '0.02em',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Masuk untuk Bersuara →
          </button>
        )}
      </div>

      {showReceipt && voteRecord && sidangNomor && (
        <VoteReceiptSheet
          voteRecord={{ ...voteRecord, sidangNomor }}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </>
  );
};
