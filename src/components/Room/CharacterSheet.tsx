import React from 'react';
import type { Opinion } from '../../types';

// TASK 3.2 — Bottom sheet refinement
// - Backdrop: rgba 0.6, blur 4px (not 8px)
// - Handle bar: 40px wide, 4px, surface-3
// - Vote as text + dot (not badge)
// - Spacing: handle → 16px → name/close → 4px → vote → 16px → quote → 12px → meta → 20px → CTA

const VOTE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  setuju:  { label: 'Setuju',  color: 'var(--setuju-text)',  bg: 'var(--setuju)' },
  abstain: { label: 'Abstain', color: 'var(--abstain-text)', bg: 'var(--abstain)' },
  tolak:   { label: 'Tolak',   color: 'var(--tolak-text)',   bg: 'var(--tolak)' },
};

interface Props {
  provinsi: string;
  opinion: Opinion | null;
  onClose: () => void;
  onReply: () => void;
}

export const CharacterSheet: React.FC<Props> = ({ provinsi, opinion, onClose, onReply }) => {
  const vote = opinion?.vote;
  const voteStyle = vote ? VOTE_STYLE[vote] : null;

  const dateStr = opinion?.createdAt
    ? new Date(opinion.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null;

  return (
    <>
      {/* Backdrop — TASK 3.2: rgba 0.6, blur 4px */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(12, 12, 10, 0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 50,
        }}
      />

      {/* Sheet */}
      <div
        className="animate-slide-up"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--surface-3)',
          borderRadius: '12px 12px 0 0',
          maxHeight: '55vh',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '480px',
          margin: '0 auto',
        }}
      >
        {/* Handle bar — TASK 3.2: 40px wide, 4px tall, surface-3 */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '12px',
          paddingBottom: '4px',
          flexShrink: 0,
        }}>
          <div style={{
            width: '40px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--surface-3)',
          }} />
        </div>

        {/* Content — scrollable */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          paddingBottom: '0',
          minHeight: 0,
        }}>
          {/* Name + Close — TASK 3.2 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '4px',
          }}>
            <div style={{
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '16px',
              color: 'var(--text-primary)',
              lineHeight: 1.3,
            }}>
              Warga {provinsi}
            </div>
            {/* Close button — 24px visual, 44px tap target */}
            <button
              onClick={onClose}
              aria-label="Tutup"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-tertiary)',
                fontSize: '16px',
                lineHeight: 1,
                padding: '10px',
                margin: '-10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              ✕
            </button>
          </div>

          {/* Vote position — dot + text (not badge) — TASK 3.2 */}
          <div style={{ marginBottom: '16px' }}>
            {voteStyle ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  width: '6px', height: '6px',
                  borderRadius: '50%',
                  background: voteStyle.bg,
                  display: 'inline-block',
                  flexShrink: 0,
                }} />
                <span style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: voteStyle.color,
                  fontFamily: 'var(--font-ui)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {voteStyle.label}
                </span>
              </div>
            ) : (
              <span style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)',
                fontStyle: 'italic',
              }}>
                Belum bersuara
              </span>
            )}
          </div>

          {/* Quote — .citizen-voice with border-left */}
          {opinion?.text ? (
            <>
              <div
                className="citizen-voice"
                style={{
                  borderLeft: `2px solid ${voteStyle?.bg || 'var(--border-mid)'}`,
                  paddingLeft: '14px',
                  fontSize: '15px',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  color: 'var(--text-primary)',
                  lineHeight: 1.5
                }}
              >
                "{opinion.text}"
              </div>
              {/* Metadata — monospace, text-tertiary */}
              {dateStr && (
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                  fontVariantNumeric: 'tabular-nums',
                  marginBottom: '12px',
                }}>
                  {opinion.nomorDokumen} · {dateStr}
                </div>
              )}
            </>
          ) : (
            <div style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '14px',
              color: 'var(--text-tertiary)',
              marginBottom: '12px',
              lineHeight: 1.5,
            }}>
              {opinion ? 'Memilih tanpa kata — suara tetap tercatat.' : 'Provinsi ini belum menyampaikan pendapat.'}
            </div>
          )}
        </div>

        {/* CTA — fixed at bottom of sheet */}
        <div style={{
          padding: '20px 20px',
          paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
          flexShrink: 0,
        }}>
          <button
            onClick={onReply}
            style={{
              width: '100%',
              height: '48px',
              background: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--surface-0)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              border: 'none'
            }}
          >
            Sampaikan Pendapatmu
            <span style={{ fontSize: '18px' }}>→</span>
          </button>
        </div>
      </div>
    </>
  );
};
