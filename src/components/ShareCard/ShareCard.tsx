import React from 'react';
import { useDPNStore } from '../../store/dpnStore';

// TASK 1.3 + TASK 2.2 — Share card with:
// - min 20 char threshold for showing personal quote
// - fallback = session title in serif (not empty, not generic)
// - clear visual hierarchy: quote > identity > header > stats > footer

const VOTE_DISPLAY: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  verb: string;
}> = {
  setuju:  { label: 'SETUJU',  color: 'var(--setuju-text)',  bgColor: 'var(--setuju-muted)',  verb: 'mendukung' },
  abstain: { label: 'ABSTAIN', color: 'var(--abstain-text)', bgColor: 'var(--abstain-muted)', verb: 'memilih abstain terhadap' },
  tolak:   { label: 'TOLAK',   color: 'var(--tolak-text)',   bgColor: 'var(--tolak-muted)',   verb: 'menolak' },
};

// TASK 1.3: min 20 chars AND must pass basic readability check
function getDisplayQuote(
  text: string | undefined,
  _vote: string,
  _provinsi: string,
  judul: string
): { quote: string; isPersonal: boolean } {
  const trimmed = text?.trim() ?? '';
  if (trimmed.length >= 20) {
    // Basic gibberish check: vowel ratio
    const lower = trimmed.toLowerCase();
    const vowels = (lower.match(/[aiueo]/g) || []).length;
    const ratio = vowels / lower.replace(/\s/g, '').length;
    if (ratio >= 0.2) {
      // Truncate at 180 chars for card
      const truncated = trimmed.length > 180 ? trimmed.slice(0, 177) + '…' : trimmed;
      return { quote: truncated, isPersonal: true };
    }
  }
  // Fallback: auto-generated — use session title as the "quote" surface
  return {
    quote: judul,
    isPersonal: false,
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export const ShareCard: React.FC = () => {
  const opinion = useDPNStore(s => s.lastSubmittedOpinion);
  const session = useDPNStore(s => s.activeSession);
  const setShowShareCard = useDPNStore(s => s.setShowShareCard);

  if (!opinion) return null;

  const votes = session.votes;
  const total = votes.setuju + votes.abstain + votes.tolak || 1;
  const sPct = Math.round(votes.setuju / total * 100);
  const aPct = Math.round(votes.abstain / total * 100);
  const tPct = Math.round(votes.tolak / total * 100);

  const vd = VOTE_DISPLAY[opinion.vote];
  const dateStr = formatDate(opinion.createdAt);
  const { quote, isPersonal } = getDisplayQuote(
    opinion.text, opinion.vote, opinion.provinsi, session.judul
  );

  const handleShare = async () => {
    const shareBody = isPersonal
      ? `"${quote}"\n\n— Warga ${opinion.provinsi}, ${opinion.vote.toUpperCase()} terhadap ${session.judul}\n\nSuara ini tersimpan permanen di DPN RI.\nhttps://dpn.id/sidang/${session.nomor}`
      : `Sebagai warga ${opinion.provinsi}, saya ${vd.verb} ${session.judul}.\n\nSuara ini tersimpan permanen di DPN RI.\nhttps://dpn.id/sidang/${session.nomor}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Suara DPN RI — Sidang #${session.nomor}`,
          text: shareBody,
          url: `https://dpn.id/sidang/${session.nomor}`,
        });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(shareBody);
      alert('Teks tersalin ke clipboard!');
    }
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(12,12,10,0.82)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        overflowY: 'auto',
      }}
    >
      {/* Label above card */}
      <div className="label-overline" style={{ marginBottom: '14px', textAlign: 'center' }}>
        SUARAMU TERCATAT
      </div>

      {/* Card — TASK 2.2: clear hierarchy */}
      <div
        className="animate-fade-in-up"
        style={{
          width: '100%',
          maxWidth: '340px',
          background: 'var(--surface-1)',
          // TASK 3.4: visible border for depth
          border: '1px solid rgba(184,164,114,0.25)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}
      >
        {/* LEVEL 3 — Header DPN (small, kop surat) */}
        <div style={{
          padding: '14px 20px 12px',
          borderBottom: '1px solid rgba(184,164,114,0.12)',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* DPN wordmark */}
            <span style={{
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--accent-primary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              🏛 DEWAN PERWAKILAN NETIZEN
            </span>
            {/* Removed "REPUBLIK INDONESIA" — TASK 2.2 */}
          </div>
          {/* Sidang info — same line or below */}
          <div style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            marginTop: '2px',
          }}>
            Sidang #{session.nomor} · {dateStr}
          </div>
        </div>

        {/* LEVEL 1 — Quote (star of the card) — TASK 2.2 */}
        <div style={{
          padding: '22px 20px 18px',
        }}>
          {isPersonal ? (
            /* Personal quote: serif italic, largest, no border-left (cleaner on card) */
            <div
              className="citizen-voice"
              style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
              }}
            >
              "{quote}"
            </div>
          ) : (
            /* Fallback: session title in serif, centered, slightly dimmer */
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '16px',
              lineHeight: 1.45,
              color: 'var(--text-body)',
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
              {quote}
            </div>
          )}
        </div>

        {/* LEVEL 2 — Identity + vote (directly below quote) */}
        <div style={{
          padding: '0 20px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
          }}>
            Warga {opinion.provinsi}
          </span>
          {/* Vote as text, not badge — TASK 2.2 */}
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            color: vd.color,
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.05em',
          }}>
            {vd.label}
          </span>
        </div>

        {/* LEVEL 4 — Stats (compact) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1px',
          background: 'var(--border-faint)',
          margin: '0 20px 0',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          {[
            { label: 'Setuju',  pct: sPct,  color: 'var(--setuju-text)' },
            { label: 'Abstain', pct: aPct,  color: 'var(--abstain-text)' },
            { label: 'Tolak',   pct: tPct,  color: 'var(--tolak-text)' },
          ].map(s => (
            <div
              key={s.label}
              style={{
                background: 'var(--surface-2)',
                padding: '7px 4px',
                textAlign: 'center',
              }}
            >
              {/* Smaller numbers — TASK 2.2 */}
              <div style={{
                fontSize: '15px',
                fontWeight: 700,
                color: s.color,
                fontFamily: 'var(--font-ui)',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                marginBottom: '2px',
              }}>
                {s.pct}%
              </div>
              <div style={{
                fontSize: '9px',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* LEVEL 5 — Footer (url + disclaimer) */}
        <div style={{
          padding: '10px 20px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: '10px',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-ui)',
          }}>
            dpn.id/sidang/{session.nomor}
          </span>
          <span style={{
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
          }}>
            Tersimpan permanen.
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginTop: '16px',
        width: '100%',
        maxWidth: '340px',
      }}>
        <button
          onClick={() => setShowShareCard(false)}
          style={{
            flex: 1,
            height: '48px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-mid)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '14px',
            cursor: 'pointer',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          Tutup
        </button>
        <button
          onClick={handleShare}
          style={{
            flex: 2,
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
          Bagikan
        </button>
      </div>

      {/* Nomor dokumen */}
      <div style={{
        marginTop: '10px',
        fontSize: '10px',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {opinion.nomorDokumen}
      </div>
    </div>
  );
};
