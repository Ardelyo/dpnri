import React from 'react';
import type { VoteType } from '../../types';

interface ProvinceNodeProps {
  province: { name: string; color: string };
  voteStatus?: VoteType | 'none';
  isSelected?: boolean;
  isNew?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  rowFraction: number;
}

export const ProvinceNode: React.FC<ProvinceNodeProps> = ({ 
  province, 
  voteStatus = 'none', 
  isSelected = false, 
  isNew = false, 
  onClick,
  rowFraction
}: ProvinceNodeProps) => {
  const getGlow = () => {
    if (voteStatus === 'setuju') return '0 0 8px var(--setuju)';
    if (voteStatus === 'tolak') return '0 0 8px var(--tolak)';
    if (voteStatus === 'abstain') return '0 0 8px var(--abstain)';
    return 'none';
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: '24px',
        height: '24px',
        borderRadius: '6px',
        background: voteStatus === 'none' ? 'var(--surface-3)' : `var(--${voteStatus})`,
        border: isSelected ? '2px solid var(--text-primary)' : '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: `translateY(${Math.sin(rowFraction * Math.PI) * -8}px) ${isSelected ? 'scale(1.2)' : 'scale(1)'}`,
        boxShadow: isNew ? '0 0 15px var(--accent-primary)' : (isSelected ? getGlow() : 'none'),
        position: 'relative',
        zIndex: isSelected ? 10 : 1,
      }}
    >
      <div style={{
        fontSize: '8px',
        fontWeight: '800',
        color: voteStatus === 'none' ? 'var(--text-tertiary)' : 'var(--surface-0)',
        pointerEvents: 'none',
      }}>
        {province.name.substring(0, 2)}
      </div>

      {isNew && (
        <span style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '7px',
          border: '2px solid var(--accent-primary)',
          animation: 'pulse-live 2s infinite',
        }} />
      )}
    </div>
  );
};
