import React, { useMemo } from 'react';
import { getVoteColor } from '../../utils/opinion-logic';
import type { Opinion } from '../../types';

interface OpinionItemProps {
  opinion: Opinion;
}

const OpinionItem: React.FC<OpinionItemProps> = ({ opinion }: OpinionItemProps) => (
  <div
    className="animate-fade-in-up"
    style={{
      padding: '12px',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{
          width: '6px', height: '6px',
          borderRadius: '1px',
          background: getVoteColor(opinion.vote),
        }} />
        <span className="label-meta">{opinion.provinsi}</span>
      </div>
      <span className="label-meta" style={{ color: 'var(--text-tertiary)', fontSize: '9px' }}>
        {opinion.nomorDokumen}
      </span>
    </div>
    <p className="citizen-voice-sm" style={{
      color: 'var(--text-primary)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    }}>
      "{opinion.text}"
    </p>
  </div>
);

interface SuaraTerbaruProps {
  opinions: Opinion[];
}

export const SuaraTerbaru: React.FC<SuaraTerbaruProps> = ({ opinions }: SuaraTerbaruProps) => {
  const latestOpinions = useMemo(() => opinions.slice(-3).reverse(), [opinions]);

  return (
    <div style={{ padding: '0 16px', marginTop: '16px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
      }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
          SUARA TERBARU
        </h3>
        <span className="badge badge-aktif" style={{ fontSize: '9px' }}>Live</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {latestOpinions.map((op: Opinion) => (
          <OpinionItem key={op.id} opinion={op} />
        ))}
      </div>
    </div>
  );
};
