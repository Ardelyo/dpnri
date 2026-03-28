import React, { useEffect, useState } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';
import type { DPNState } from '../../types';

const voteColors: Record<string, string> = {
  setuju: 'var(--setuju)',
  abstain: 'var(--abstain)',
  tolak: 'var(--tolak)',
};

const voteLabels: Record<string, string> = {
  setuju: 'Setuju',
  abstain: 'Abstain',
  tolak: 'Tolak',
};

export const PostVoteConfirmation: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const session   = useDPNStore((s: DPNState) => s.activeSession);

  const getVote = useUserStore(s => s.getVote);
  const showToast = useUserStore(s => s.showToast);

  const [showContent, setShowContent] = useState(false);

  const voteRecord = getVote(String(session.nomor));

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!voteRecord) {
    // No vote — go back
    setScreen('room');
    return null;
  }

  const positionColor = voteColors[voteRecord.position];
  const positionLabel = voteLabels[voteRecord.position];

  const handleShare = async () => {
    const shareText = `Suaraku di Sidang DPN #${String(session.nomor).padStart(3, '0')}: ${positionLabel}.\n"${voteRecord.opinionText}"\n\nID: ${voteRecord.voteId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Kartu Suara DPN', text: shareText });
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast('Teks disalin ke clipboard', 'success');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      zIndex: 150,
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      overflowY: 'auto',
    }}>
      {/* Back nav */}
      <div style={{ padding: '0 16px', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('room')}
          style={{
            height: '44px', background: 'none', border: 'none',
            color: 'var(--text-secondary)', fontSize: '14px',
            fontFamily: 'var(--font-ui)', cursor: 'pointer',
            padding: '0', WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Kembali ke Sidang
        </button>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 24px 0',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(16px)',
        transition: 'all 500ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        {/* Checkmark circle */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%',
          border: '2px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '20px',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polyline points="20 6 9 17 4 12"
              stroke="var(--accent)" strokeWidth="3"
              strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '22px',
          color: 'var(--text-primary)', fontWeight: 400,
          margin: '0 0 8px', textAlign: 'center',
        }}>
          Suaramu tercatat.
        </h2>
        <p style={{
          fontSize: '13px', color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-ui)', margin: '0 0 32px',
          textAlign: 'center',
        }}>
          Tersimpan permanen di arsip DPN.
        </p>

        {/* Vote receipt card */}
        <div style={{
          width: '100%', maxWidth: '340px',
          background: 'var(--surface-1)',
          border: '1px solid var(--surface-3)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}>
          {/* Card header */}
          <div style={{
            background: 'var(--surface-2)',
            padding: '12px 16px',
            borderBottom: '1px solid var(--surface-3)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '10px', fontWeight: 700, color: 'var(--accent)',
                fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
                textTransform: 'uppercase', marginBottom: '2px',
              }}>
                DEWAN PERWAKILAN NETIZEN
              </div>
              <div style={{
                fontSize: '11px', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)',
              }}>
                Sidang #{String(session.nomor).padStart(3, '0')}
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: positionColor,
              }} />
              <span style={{
                fontSize: '12px', fontWeight: 700,
                color: positionColor, fontFamily: 'var(--font-ui)',
              }}>
                {positionLabel}
              </span>
            </div>
          </div>

          {/* Quote */}
          <div style={{ padding: '16px' }}>
            {voteRecord.opinionText ? (
              <div style={{
                borderLeft: '2px solid var(--accent)',
                paddingLeft: '12px',
                marginBottom: '14px',
              }}>
                <p style={{
                  fontFamily: 'var(--font-display)', fontStyle: 'italic',
                  fontSize: '14px', color: 'var(--text-primary)',
                  margin: 0, lineHeight: 1.55,
                }}>
                  "{voteRecord.opinionText}"
                </p>
              </div>
            ) : (
              <p style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: '13px', color: 'var(--text-tertiary)',
                margin: '0 0 14px',
              }}>Tidak ada pernyataan.</p>
            )}

            {/* Judul */}
            <div style={{
              fontSize: '12px', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', marginBottom: '14px',
              lineHeight: 1.4,
            }}>
              {session.judul}
            </div>

            {/* Vote ID */}
            <div style={{ borderTop: '1px solid var(--surface-3)', paddingTop: '12px' }}>
              <div style={{
                fontFamily: 'monospace', fontSize: '10px',
                color: 'var(--text-tertiary)', wordBreak: 'break-all',
                marginBottom: '4px',
              }}>
                {voteRecord.voteId}
              </div>
              <div style={{
                fontSize: '10px', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)',
              }}>
                {new Date(voteRecord.timestamp).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: '0 24px',
        paddingBottom: 'max(40px, env(safe-area-inset-bottom, 40px))',
        flexShrink: 0,
      }}>
        <button
          onClick={handleShare}
          style={{
            width: '100%', height: '48px',
            background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius-md)',
            color: 'var(--surface-0)',
            fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '15px',
            cursor: 'pointer', marginBottom: '12px',
            letterSpacing: '0.03em',
          }}
        >
          ↗ Bagikan
        </button>
        <button
          onClick={() => setScreen('room')}
          style={{
            width: '100%', height: '44px',
            background: 'none', border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)', fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Kembali ke Sidang
        </button>
      </div>
    </div>
  );
};
