import React from 'react';

interface PodiumSectionProps {
  votes: { setuju: number; abstain: number; tolak: number };
  totalSuara: number;
}

export const PodiumSection: React.FC<PodiumSectionProps> = ({ votes, totalSuara }: PodiumSectionProps) => {
  const { setuju, abstain, tolak } = votes;
  const total = Math.max(totalSuara, 1);
  
  const pSetuju = Math.round((setuju / total) * 100);
  const pAbstain = Math.round((abstain / total) * 100);
  const pTolak = 100 - pSetuju - pAbstain; // Ensure 100% total

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingBottom: '16px',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '120px',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, var(--surface-1) 0%, transparent 70%)',
        opacity: 0.3,
        zIndex: 0,
        pointerEvents: 'none',
      }} />

      {/* Podium SVG */}
      <div style={{ position: 'relative', width: '80px', height: '70px', marginBottom: '8px', zIndex: 1 }}>
        <svg
          viewBox="0 0 80 70"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Base */}
          <path d="M10 65 L25 10 L55 10 L70 65 Z" fill="var(--surface-2)" stroke="var(--accent)" strokeWidth="0.5" opacity="0.8" />
          <path d="M25 10 H55" stroke="var(--accent)" strokeWidth="1" />
          {/* Microphones */}
          <path d="M35 10 L30 2" stroke="var(--text-tertiary)" strokeWidth="1" strokeLinecap="round" />
          <path d="M45 10 L50 2" stroke="var(--text-tertiary)" strokeWidth="1" strokeLinecap="round" />
          <circle cx="30" cy="2" r="1.5" fill="var(--text-tertiary)" />
          <circle cx="50" cy="2" r="1.5" fill="var(--text-tertiary)" />
          {/* Logo/Badge placeholder */}
          <rect x="35" y="25" width="10" height="10" rx="1" fill="var(--accent)" opacity="0.2" />
        </svg>
      </div>

      {/* Summary Bar (Task 3.4) */}
      <div style={{ width: '100%', padding: '0 32px', textAlign: 'center', zIndex: 1 }}>
        {/* Voting Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'var(--surface-3)',
          borderRadius: '3px',
          overflow: 'hidden',
          display: 'flex',
          gap: '2px', // Gap between segments
          marginBottom: '8px',
        }}>
          {setuju > 0 && (
            <div style={{ 
              width: `${pSetuju}%`, 
              minWidth: '4px',
              background: 'var(--setuju)', 
              borderRadius: '2px 0 0 2px' 
            }} />
          )}
          {abstain > 0 && (
            <div style={{ 
              width: `${pAbstain}%`, 
              minWidth: '4px',
              background: 'var(--abstain)' 
            }} />
          )}
          {tolak > 0 && (
            <div style={{ 
              width: `${pTolak}%`, 
              minWidth: '4px',
              background: 'var(--tolak)', 
              borderRadius: '0 2px 2px 0' 
            }} />
          )}
        </div>

        {/* Labels with dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          flexWrap: 'wrap',
          gap: '4px',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--setuju)' }} />
            {pSetuju}% setuju
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--abstain)' }} />
            {pAbstain}% abstain
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--tolak)' }} />
            {pTolak}% tolak
          </span>
        </div>

        {/* Total voices */}
        <div style={{
          marginTop: '4px',
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          {totalSuara} suara tercatat
        </div>
      </div>
    </div>
  );
};
