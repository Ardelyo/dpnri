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
        className="label-meta"
        style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
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
  session, 
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
        borderBottom: '1px solid var(--border-faint)',
        background: 'var(--surface-0)',
      }}>
        <div>
          <span className="label-overline">DPN RI</span>
          <span style={{ color: 'var(--border-loud)', margin: '0 5px', fontSize: '10px' }}>·</span>
          <span className="label-overline" style={{ color: 'var(--text-tertiary)' }}>
            SIDANG AKTIF
          </span>
        </div>
        <LiveCounter count={totalOnline} onArchive={onArchive} />
      </div>

      <div style={{
        padding: '12px 16px 10px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-faint)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            background: 'var(--surface-3)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            letterSpacing: '0.04em',
          }}>
            #{session.nomor}
          </span>
          <span className="badge badge-aktif">Aktif</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginBottom: '3px',
        }}>
          {session.judul}
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          lineHeight: 1.4,
          fontStyle: 'italic',
          fontFamily: 'var(--font-display)',
        }}>
          {session.pertanyaan}
        </p>
      </div>
    </>
  );
};
