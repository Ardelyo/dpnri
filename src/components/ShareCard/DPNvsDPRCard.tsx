import React from 'react';
import type { Session } from '../../types';

// TASK 2.3 — Comparison modal rebalance:
// - Compact header
// - Stronger label contrast on columns
// - DPR column: serif font, stronger visual weight
// - "suara" count as plain text (no chip)
// - Verdict section BELOW both columns (not in DPR column)
// - Badge: BERLAWANAN / SEJALAN centered below data
// - Footer: url left, "Rakyat sudah bicara." right — subtle

interface Props {
  session: Session;
  onClose: () => void;
}

function formatNum(n: number) {
  return n.toLocaleString('id-ID');
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export const DPNvsDPRCard: React.FC<Props> = ({ session, onClose }: Props) => {
  if (!session.putusanDPR) return null;

  const votes = session.votes;
  const total = votes.setuju + votes.abstain + votes.tolak || 1;
  const tolakPct = Math.round(votes.tolak / total * 100);
  const setujuPct = Math.round(votes.setuju / total * 100);

  const dpnMajority = votes.tolak > votes.setuju ? 'tolak' : 'setuju';
  const dpnPct = dpnMajority === 'tolak' ? tolakPct : setujuPct;
  const dpnLabel = dpnMajority === 'tolak' ? 'TOLAK' : 'SETUJU';
  const dpnColor = dpnMajority === 'tolak' ? 'var(--tolak-text)' : 'var(--setuju-text)';

  // Determine if DPR decision is opposite
  const isOpposite = session.putusanDPN && session.putusanDPR &&
    !session.putusanDPR.toLowerCase().includes(session.putusanDPN === 'tolak' ? 'tolak' : 'setuju');

  const verdictLabel = isOpposite ? 'BERLAWANAN' : 'SEJALAN';
  const verdictBg = isOpposite ? 'var(--tolak-muted)' : 'var(--setuju-muted)';
  const verdictColor = isOpposite ? 'var(--tolak-text)' : 'var(--setuju-text)';
  const verdictText = isOpposite
    ? 'Keputusan DPR berbeda dari suara rakyat.'
    : 'Keputusan DPR sejalan dengan suara rakyat.';

  const sessionDate = session.closedAt
    ? formatDate(session.closedAt)
    : formatDate(session.openedAt);

  const handleShare = async () => {
    const text = [
      `DPN vs DPR — ${session.judul}`,
      '',
      `Suara Rakyat (DPN): ${dpnPct}% ${dpnLabel} (${formatNum(session.totalPendapat)} suara)`,
      `Keputusan DPR: ${session.putusanDPR}`,
      '',
      verdictText,
      '',
      `https://dpn.id/sidang/${session.nomor}`,
    ].join('\n');

    if (navigator.share) {
      try {
        await navigator.share({ title: `DPN vs DPR — Sidang #${session.nomor}`, text });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      alert('Teks tersalin ke clipboard!');
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(12,12,10,0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 70,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Label */}
      <div className="label-overline" style={{ marginBottom: '14px' }}>
        PERBANDINGAN KEPUTUSAN
      </div>

      {/* Card */}
      <div
        className="animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '360px',
          background: 'var(--surface-1)',
          border: '1px solid var(--surface-3)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* TASK 2.3 — Compact header: max 80px */}
        <div style={{
          padding: '14px 20px 12px',
          borderBottom: '1px solid var(--border-faint)',
        }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 600,
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px',
          }}>
            🏛 DEWAN PERWAKILAN NETIZEN
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            // TASK 2.3: 16px (down from current)
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.3,
          }}>
            {session.judul}
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            marginTop: '3px',
          }}>
            {sessionDate}
          </div>
        </div>

        {/* TASK 2.3 — Comparison columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr',
        }}>
          {/* Left: Suara DPN */}
          <div style={{ padding: '18px 16px' }}>
            {/* TASK 2.3: higher contrast label — text-secondary */}
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              SUARA DPN
              <br />
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>
                Rakyat
              </span>
            </div>

            {/* Big number */}
            <div style={{
              fontSize: '36px',
              fontWeight: 800,
              fontFamily: 'var(--font-ui)',
              color: dpnColor,
              lineHeight: 1,
              marginBottom: '4px',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {dpnPct}%
            </div>

            {/* Position label */}
            <div style={{
              fontSize: '15px',
              fontWeight: 700,
              color: dpnColor,
              fontFamily: 'var(--font-ui)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '10px',
            }}>
              {dpnLabel}
            </div>

            {/* TASK 2.3: suara count as plain text, no chip */}
            <div style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatNum(session.totalPendapat)} suara
            </div>
          </div>

          {/* Vertical divider */}
          <div style={{ background: 'var(--surface-3)' }} />

          {/* Right: Keputusan DPR */}
          <div style={{
            padding: '18px 16px',
            // Subtle tint if opposite
            background: isOpposite ? 'rgba(138,64,64,0.04)' : 'transparent',
          }}>
            {/* TASK 2.3: higher contrast label */}
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              KEPUTUSAN DPR
              <br />
              <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>
                Resmi
              </span>
            </div>

            {/* TASK 2.3: DPR decision in SERIF font, stronger weight */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 400,
              color: 'var(--text-primary)',
              lineHeight: 1.35,
            }}>
              {session.putusanDPR}
            </div>
          </div>
        </div>

        {/* TASK 2.3 — Verdict section: BELOW both columns, centered */}
        <div style={{
          borderTop: '1px solid var(--border-faint)',
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}>
          {/* Badge centered */}
          <span style={{
            display: 'inline-block',
            background: verdictBg,
            color: verdictColor,
            borderRadius: 'var(--radius-sm)',
            padding: '4px 12px',
            fontSize: '10px',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            {verdictLabel}
          </span>
          {/* Verdict text — serif italic, centered */}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: verdictColor,
            textAlign: 'center',
          }}>
            {verdictText}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--border-faint)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '11px',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-ui)',
          }}>
            dpn.id/sidang/{session.nomor}
          </span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
          }}>
            Rakyat sudah bicara.
          </span>
        </div>
      </div>

      {/* Action buttons — TASK 2.3: share full width, tutup = text button */}
      <div style={{
        marginTop: '16px',
        width: '100%',
        maxWidth: '360px',
      }}>
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--accent-primary)',
            border: '1px solid var(--accent-primary-dim)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--surface-0)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M12 1L15 4L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 4H6C3.2 4 1 6.2 1 9v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Bagikan Perbandingan
        </button>
        {/* TASK 2.3: Tutup = text button, not styled button */}
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '12px',
            width: '100%',
            textAlign: 'center',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
