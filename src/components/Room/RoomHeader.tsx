import React from 'react';
import type { Session } from '../../types';

interface LiveCounterProps {
  count: number;
  onArchive: () => void;
}

export const LiveCounter: React.FC<LiveCounterProps> = ({ count, onArchive }: LiveCounterProps) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    <button
      onClick={onArchive}
      aria-label="Buka Arsip"
      style={{
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="15" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1.5" y="7.5" width="15" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1.5" y="13.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        className="animate-pulse-live"
        style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#a04040',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span
        style={{ color: 'var(--text-secondary)', fontSize: '11px', fontFamily: 'var(--font-ui)', fontWeight: 600, letterSpacing: '0.04em' }}
      >
        {count} HADIR
      </span>
    </div>
  </div>
);

interface RoomHeaderProps {
  totalOnline: number;
  session: Session;
  onArchive: () => void;
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ 
  totalOnline, 
  onArchive 
}: RoomHeaderProps) => {
  return (
    <>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '48px',
        flexShrink: 0,
        borderBottom: '1px solid var(--surface-3)',
        background: 'var(--surface-0)',
      }}>
        <div>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 600, 
            color: 'var(--accent)', 
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-ui)'
          }}>DPN RI</span>
          <span style={{ color: 'var(--surface-3)', margin: '0 8px', fontSize: '10px' }}>·</span>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 600, 
            color: 'var(--text-tertiary)', 
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-ui)'
          }}>
            SIDANG AKTIF
          </span>
        </div>
        <LiveCounter count={totalOnline} onArchive={onArchive} />
      </div>
    </>
  );
};
