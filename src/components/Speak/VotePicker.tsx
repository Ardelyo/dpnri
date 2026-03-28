import React from 'react';
import type { VoteType } from '../../types';

interface Props {
  value: VoteType | null;
  onChange: (v: VoteType) => void;
}

const VOTES: { type: VoteType; icon: string; label: string; color: string }[] = [
  { type: 'setuju', icon: '✓', label: 'Setuju', color: '#27AE60' },
  { type: 'abstain', icon: '?', label: 'Abstain', color: '#8A9BA8' },
  { type: 'tolak', icon: '✕', label: 'Tolak', color: '#C0392B' },
];

export const VotePicker: React.FC<Props> = ({ value, onChange }: Props) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{
        fontSize: '8px',
        letterSpacing: '1.5px',
        color: '#C9A227',
        fontWeight: 700,
        textTransform: 'uppercase',
        marginBottom: '8px',
      }}>
        PILIH POSISIMU
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        {VOTES.map(v => {
          const isActive = value === v.type;
          return (
            <button
              key={v.type}
              onClick={() => onChange(v.type)}
              style={{
                flex: 1,
                padding: '12px 8px',
                background: isActive ? `${v.color}20` : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${isActive ? v.color : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 150ms ease',
                transform: isActive ? 'scale(1.04)' : 'scale(1)',
              }}
            >
              <span style={{
                fontSize: '18px',
                color: isActive ? v.color : '#555',
                fontWeight: 700,
              }}>
                {v.icon}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isActive ? v.color : '#555',
              }}>
                {v.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
