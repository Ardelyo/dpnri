import React from 'react';
import type { VoteType } from '../../types';

interface ProvinceNodeProps {
  province: { name: string; color: string; short?: string };
  voteStatus?: VoteType | 'none';
  isSelected?: boolean;
  isNew?: boolean;
  isUser?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  rowFraction: number;
}

export const ProvinceNode: React.FC<ProvinceNodeProps> = ({ 
  province, 
  voteStatus = 'none', 
  isSelected = false, 
  isNew = false,
  isUser = false,
  onClick,
}: ProvinceNodeProps) => {
  const getGlow = () => {
    if (voteStatus === 'setuju') return '0 0 12px var(--setuju)';
    if (voteStatus === 'tolak') return '0 0 12px var(--tolak)';
    if (voteStatus === 'abstain') return '0 0 12px var(--abstain)';
    return 'none';
  };

  const getBackground = () => {
    if (voteStatus === 'none') return 'var(--surface-3)';
    return `var(--${voteStatus})`;
  };

  const getTextColor = () => {
    if (voteStatus === 'none') return 'var(--text-tertiary)';
    return '#ffffff';
  };

  return (
    <div
      onClick={onClick}
      style={{
        width: '36px',
        height: '26px',
        borderRadius: 'var(--radius-sm)',
        background: getBackground(),
        border: isSelected || isUser
          ? '2px solid var(--accent)'
          : '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 300ms ease-out',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        boxShadow: isNew ? '0 0 15px var(--accent)' : (isSelected ? getGlow() : 'none'),
        position: 'relative',
        zIndex: isSelected ? 10 : 1,
        opacity: voteStatus === 'none' ? 0.5 : 1,
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      <div style={{
        fontSize: '10px',
        fontWeight: '600',
        color: getTextColor(),
        fontFamily: 'var(--font-ui)',
        pointerEvents: 'none',
        letterSpacing: '-0.01em'
      }}>
        {province.short || province.name.substring(0, 2).toUpperCase()}
      </div>

      {isNew && (
        <span style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '6px',
          border: '2px solid var(--accent)',
          animation: 'pulse-live 2s infinite',
        }} />
      )}
    </div>
  );
};
