import React, { useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';

const VOTE_BORDER: Record<string, string> = {
  setuju:  'var(--setuju)',
  abstain: 'var(--abstain)',
  tolak:   'var(--tolak)',
};

const VOTE_TEXT_COLOR: Record<string, string> = {
  setuju:  'var(--setuju-text)',
  abstain: 'var(--abstain-text)',
  tolak:   'var(--tolak-text)',
};

const VOTE_LABEL: Record<string, string> = {
  setuju: 'Setuju',
  abstain: 'Abstain',
  tolak: 'Tolak',
};

export const OpinionCarousel: React.FC = () => {
  const opinions = useDPNStore(s => s.opinions);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Show opinions with text, most recent first, max 10
  const displayOpinions = [...opinions]
    .reverse()
    .filter(o => o.text && o.text.trim().length > 0)
    .slice(0, 10);

  if (displayOpinions.length === 0) {
    return (
      <div style={{
        padding: '16px',
        background: 'var(--surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        fontStyle: 'italic',
      }}>
        Belum ada pendapat yang masuk. Jadilah yang pertama.
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      style={{
        display: 'flex',
        gap: '10px',
        overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        paddingBottom: '4px',
        paddingRight: '16px', // Hint there's more
        cursor: 'grab',
      }}
    >
      {displayOpinions.map(op => (
        <div
          key={op.id}
          style={{
            flexShrink: 0,
            width: '220px',
            background: 'var(--surface-1)',
            border: '1px solid var(--border-subtle)',
            borderLeft: `3px solid ${VOTE_BORDER[op.vote] || 'var(--border-mid)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            scrollSnapAlign: 'start',
          }}
        >
          {/* Province + vote */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
            }}>
              {op.provinsi}
            </span>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              color: VOTE_TEXT_COLOR[op.vote] || 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {VOTE_LABEL[op.vote]}
            </span>
          </div>
          {/* Quote */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-body)',
            lineHeight: 1.5,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}>
            "{op.text}"
          </div>
        </div>
      ))}

      {/* End spacer */}
      <div style={{ flexShrink: 0, width: '4px' }} />
    </div>
  );
};
