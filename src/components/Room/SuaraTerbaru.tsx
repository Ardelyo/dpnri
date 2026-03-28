import React, { useMemo } from 'react';
import type { Opinion } from '../../types';
import { EmptyState } from '../Common/EmptyState';

interface OpinionItemProps {
  opinion: Opinion;
}

const OpinionItem: React.FC<OpinionItemProps> = ({ opinion }: OpinionItemProps) => (
  <div
    style={{
      padding: '16px',
      background: 'var(--surface-1)',
      border: '1px solid var(--surface-3)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '12px'
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        color: 'var(--accent)', 
        fontFamily: 'var(--font-ui)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase'
      }}>
        SUARA TERBARU
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: `var(--${opinion.vote})`,
        }} />
        <span style={{ 
          fontSize: '11px', 
          fontWeight: 600, 
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          textTransform: 'uppercase'
        }}>
          {opinion.provinsi} · {opinion.vote}
        </span>
      </div>
    </div>
    
    <blockquote style={{
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      fontSize: '15px',
      color: 'var(--text-primary)',
      lineHeight: 1.5,
      margin: 0,
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }}>
      "{opinion.text}"
    </blockquote>

    <div style={{
      fontSize: '12px',
      color: 'var(--text-secondary)',
      fontFamily: 'var(--font-ui)',
    }}>
      — Warga {opinion.provinsi}
    </div>
  </div>
);

interface SuaraTerbaruProps {
  opinions: Opinion[];
}

export const SuaraTerbaru: React.FC<SuaraTerbaruProps> = ({ opinions }: SuaraTerbaruProps) => {
  const latestOpinions = useMemo(() => opinions.slice(-1), [opinions]);

  if (opinions.length === 0) {
    return (
      <div style={{ padding: '0 16px', marginTop: '16px' }}>
        <EmptyState 
          title="Belum ada suara. Jadilah yang pertama."
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 16px', marginTop: '16px' }}>
      {latestOpinions.map((op: Opinion) => (
        <OpinionItem key={op.id} opinion={op} />
      ))}
    </div>
  );
};
