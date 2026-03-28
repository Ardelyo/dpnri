import React from 'react';

interface StatItemProps {
  label: string;
  value: number;
  color: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, color }: StatItemProps) => (
  <div style={{ textAlign: 'center', minWidth: '45px' }}>
    <div style={{
      fontSize: '14px',
      fontWeight: '600',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)',
      lineHeight: 1,
      marginBottom: '2px',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '9px',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: color,
      fontWeight: '600',
    }}>
      {label}
    </div>
  </div>
);

interface PodiumSectionProps {
  votes: { setuju: number; abstain: number; tolak: number };
  totalSuara: number;
}

export const PodiumSection: React.FC<PodiumSectionProps> = ({ votes, totalSuara }: PodiumSectionProps) => {
  const { setuju, abstain, tolak } = votes;

  return (
    <div style={{
      padding: '16px 16px 8px',
      background: 'linear-gradient(to bottom, var(--surface-0), var(--surface-1))',
      borderBottom: '1px solid var(--border-faint)',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingBottom: '10px',
      }}>
        {/* Simple Podium SVG */}
        <svg
          width="180"
          height="80"
          viewBox="0 0 180 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}
        >
          <path d="M10 80 L30 15 L150 15 L170 80 Z" fill="var(--podium-dark)" stroke="var(--border-subtle)" strokeWidth="1" />
          <path d="M30 15 L150 15" stroke="var(--accent-primary-dim)" strokeWidth="2" opacity="0.6" />
          <rect x="60" y="25" width="60" height="2" fill="var(--accent-primary-glow)" />
          <circle cx="90" cy="15" r="3" fill="var(--accent-primary)" />
          <path d="M0 80 H 180" stroke="var(--border-subtle)" strokeWidth="1" />
        </svg>

        {/* Stats overlay */}
        <div style={{
          position: 'absolute',
          bottom: '22px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
        }}>
          <StatItem label="Setuju" value={setuju} color="var(--setuju)" />
          <StatItem label="Abstain" value={abstain} color="var(--abstain)" />
          <StatItem label="Tolak" value={tolak} color="var(--tolak)" />
        </div>
      </div>

      {/* Vote Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
        <div className="vote-bar-track">
          <div className="vote-bar-segment" style={{ width: `${(setuju / (totalSuara || 1)) * 100}%`, background: 'var(--setuju)' }} />
          <div className="vote-bar-segment" style={{ width: `${(abstain / (totalSuara || 1)) * 100}%`, background: 'var(--abstain)' }} />
          <div className="vote-bar-segment" style={{ width: `${(tolak / (totalSuara || 1)) * 100}%`, background: 'var(--tolak)' }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-ui)',
        }}>
          <span>{totalSuara} SUARA MASUK</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>LIVE TALLY</span>
        </div>
      </div>
    </div>
  );
};
