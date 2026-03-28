import React from 'react';

interface Props {
  onBicara: () => void;
  hasVoted: boolean;
}

// TASK 3.3 — Simplified bottom bar: single full-width CTA.
// Arsip moved to top bar. If already voted, show subtle confirmation.
export const RoomBottomBar: React.FC<Props> = ({ onBicara, hasVoted }) => {
  return (
    <div style={{
      padding: '10px 16px',
      paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
      borderTop: '1px solid var(--border-faint)',
      background: 'var(--surface-0)',
      flexShrink: 0,
    }}>
      {hasVoted ? (
        /* Already voted — subtle confirmation bar */
        <div style={{
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}>
          <span style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
          }}>
            Kamu sudah bersuara di sidang ini.
          </span>
        </div>
      ) : (
        /* Primary CTA */
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
          onPointerDown={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.98)'; }}
          onPointerUp={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
          onPointerCancel={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
        >
          {/* Podium icon */}
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="2" y="10" width="12" height="5" rx="1" fill="currentColor" opacity="0.55" />
            <rect x="5" y="6" width="6" height="5" rx="1" fill="currentColor" opacity="0.75" />
            <rect x="7" y="2" width="2" height="5" rx="0.5" fill="currentColor" />
          </svg>
          Naik Podium
        </button>
      )}
    </div>
  );
};
