import React, { useState, useRef, useEffect } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { VoteType, DPNState } from '../../types';
import { OpinionCarousel } from './OpinionCarousel';

// TASK 1.2 — Vote options: 3 columns, height 64px, no icons, subtitle readable
const VOTE_OPTIONS: {
  value: VoteType;
  label: string;
  sub: string;
  activeStyle: { bg: string; border: string; text: string };
}[] = [
  {
    value: 'setuju',
    label: 'Setuju',
    sub: 'Saya mendukung',
    activeStyle: {
      bg: 'rgba(90,138,106,0.15)',
      border: 'var(--setuju)',
      text: 'var(--setuju-text)',
    },
  },
  {
    value: 'abstain',
    label: 'Abstain',
    sub: 'Saya belum yakin',
    activeStyle: {
      bg: 'rgba(122,112,96,0.15)',
      border: 'var(--abstain)',
      text: 'var(--text-primary)',
    },
  },
  {
    value: 'tolak',
    label: 'Tolak',
    sub: 'Saya menolak',
    activeStyle: {
      bg: 'rgba(138,64,64,0.15)',
      border: 'var(--tolak)',
      text: 'var(--tolak-text)',
    },
  },
];

// Animated checkmark SVG
const AnimatedCheck: React.FC = () => (
  <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
    <circle cx="14" cy="14" r="12" stroke="var(--setuju)" strokeWidth="1.5" opacity="0.4" />
    <polyline
      points="8,14 12,18 20,10"
      stroke="var(--setuju-text)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      style={{
        strokeDasharray: 20,
        strokeDashoffset: 0,
        animation: 'draw-check 400ms ease-out both',
      }}
    />
  </svg>
);

export const SpeakScreen: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const activeSession = useDPNStore((s: DPNState) => s.activeSession);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const addOpinion = useDPNStore((s: DPNState) => s.addOpinion);
  const setShowShareCard = useDPNStore((s: DPNState) => s.setShowShareCard);

  const [myVote, setMyVote] = useState<VoteType | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textLen = text.trim().length;
  // TASK 1.3 — validation: text must be ≥20 chars OR empty
  const isTextValid = textLen === 0 || textLen >= 20;
  const canSubmit = myVote !== null && isTextValid && status === 'idle';

  // Character counter color: 0-19 tertiary, 20+ setuju-text
  const counterColor = textLen === 0
    ? 'var(--text-tertiary)'
    : textLen < 20
      ? 'var(--tolak-text)'
      : 'var(--setuju-text)';

  // Keyboard avoidance: scroll textarea into view when keyboard opens
  useEffect(() => {
    const handleResize = () => {
      setTimeout(() => {
        if (document.activeElement === textareaRef.current && scrollRef.current) {
          textareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
    };
    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit || !userProvinsi) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 900));
    addOpinion({
      provinsi: userProvinsi,
      vote: myVote!,
      text: text.trim(),
    });
    setStatus('success');
    setTimeout(() => {
      setScreen('room');
      setShowShareCard(true);
    }, 1100);
  };

  // Submit button state
  let submitBg = 'var(--surface-3)';
  let submitColor = 'var(--text-disabled)';
  let submitText = 'Pilih posisimu dahulu';
  let submitDisabled = true;

  if (status === 'loading') {
    submitBg = 'var(--surface-3)';
    submitColor = 'var(--text-secondary)';
    submitText = 'Mengirim…';
    submitDisabled = true;
  } else if (status === 'success') {
    submitBg = 'var(--setuju-muted)';
    submitColor = 'var(--setuju-text)';
    submitText = '✓ Suaramu tercatat.';
    submitDisabled = true;
  } else if (canSubmit) {
    submitBg = 'var(--accent-primary)';
    submitColor = 'var(--surface-0)';
    submitText = 'Kirim ke Sidang';
    submitDisabled = false;
  } else if (myVote && !isTextValid) {
    submitBg = 'var(--surface-3)';
    submitColor = 'var(--text-disabled)';
    submitText = 'Min. 20 karakter';
    submitDisabled = true;
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--surface-0)',
        zIndex: 30,
        display: 'flex',
        flexDirection: 'column',
        // Use 100dvh for proper mobile viewport handling
        height: '100dvh',
      }}
    >
      {/* ── HEADER ── */}
      <div style={{
        padding: '8px 16px 12px',
        borderBottom: '1px solid var(--border-faint)',
        flexShrink: 0,
      }}>
        {/* Breadcrumb — TASK 1.2: min 44px tap area */}
        <button
          onClick={() => setScreen('room')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Kembali ke Sidang
        </button>
        <div className="label-overline" style={{ marginBottom: '3px' }}>NAIK PODIUM</div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '19px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          margin: 0,
        }}>
          Sampaikan Pendapatmu
        </h1>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          padding: '16px 16px 0',
        }}
      >
        {/* Context box */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          marginBottom: '20px',
        }}>
          <div className="label-overline" style={{ marginBottom: '5px' }}>
            SIDANG #{activeSession.nomor}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '15px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '5px',
            lineHeight: 1.3,
          }}>
            {activeSession.judul}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
          }}>
            {activeSession.pertanyaan}
          </div>
        </div>

        {/* ── VOTE PICKER — TASK 1.2 ── */}
        <div style={{ marginBottom: '20px' }}>
          <div className="label-overline" style={{ marginBottom: '10px' }}>
            PILIH POSISIMU
          </div>
          {/* 3 columns, Option A — keeps equal-width columns */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {VOTE_OPTIONS.map(opt => {
              const isSelected = myVote === opt.value;
              const isOtherSelected = myVote !== null && !isSelected;
              return (
                <button
                  key={opt.value}
                  onClick={() => status === 'idle' && setMyVote(opt.value)}
                  aria-pressed={isSelected}
                  style={{
                    flex: 1,
                    // TASK 1.2: height 64px
                    height: '64px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '3px',
                    background: isSelected ? opt.activeStyle.bg : 'var(--surface-2)',
                    border: `1px solid ${isSelected ? opt.activeStyle.border : 'var(--surface-3)'}`,
                    borderRadius: 'var(--radius-md)',
                    color: isSelected ? opt.activeStyle.text : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                    cursor: status === 'idle' ? 'pointer' : 'default',
                    opacity: isOtherSelected ? 0.4 : 1,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                    transition: [
                      'background 200ms ease-out',
                      'border-color 200ms ease-out',
                      'color 200ms ease-out',
                      'opacity 200ms ease-out',
                      'transform 150ms ease-out',
                    ].join(', '),
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    padding: '0 4px',
                    minWidth: 0,
                  }}
                >
                  {/* Label — TASK 1.2: font 15px, weight 600 */}
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    lineHeight: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    {opt.label}
                  </span>
                  {/* Subtitle — TASK 1.2: 11px, must be readable */}
                  <span style={{
                    fontSize: '11px',
                    lineHeight: 1.2,
                    opacity: isSelected ? 0.85 : 0.6,
                    textAlign: 'center',
                    // Wrap if needed on very narrow screens
                    overflowWrap: 'break-word',
                    maxWidth: '100%',
                  }}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TEXTAREA — TASK 1.2: min-height 100px ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '8px',
          }}>
            <div className="label-overline">CERITAKAN ALASANMU</div>
            <span style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              OPSIONAL
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setText(e.target.value.slice(0, 300))}
            placeholder={`Contoh: "Teman saya di NTT harus jalan 2 jam ke sekolah. Ini bukan wacana."\n\nMinimal 20 huruf agar pendapatmu tampil di kartu suara.`}
            disabled={status !== 'idle'}
            rows={4}
            style={{
              width: '100%',
              // TASK 1.2: reduced from 120px to 100px
              minHeight: '100px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-mid)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: '15px',
              lineHeight: 1.6,
              padding: '12px 14px',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 200ms ease-out',
              boxSizing: 'border-box',
            }}
            onFocus={(e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => { e.currentTarget.style.borderColor = 'var(--border-mid)'; }}
          />
          {/* Counter row — TASK 1.3 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '5px',
          }}>
            {textLen > 0 && textLen < 20 ? (
              <span style={{
                fontSize: '11px',
                color: 'var(--tolak-text)',
                fontFamily: 'var(--font-ui)',
              }}>
                Min. 20 karakter untuk tampil di kartu suara
              </span>
            ) : (
              <span />
            )}
            <span style={{
              fontSize: '11px',
              color: counterColor,
              fontFamily: 'var(--font-ui)',
              fontVariantNumeric: 'tabular-nums',
              marginLeft: 'auto',
              transition: 'color 200ms ease-out',
            }}>
              {textLen}/300
            </span>
          </div>
        </div>

        {/* Success state */}
        {status === 'success' && (
          <div
            className="animate-fade-in-up"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              padding: '18px 16px',
              background: 'var(--setuju-muted)',
              border: '1px solid var(--setuju-dim)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '16px',
            }}
          >
            <AnimatedCheck />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '17px',
              color: 'var(--setuju-text)',
              textAlign: 'center',
            }}>
              Suaramu tercatat.
            </div>
            <div style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              textAlign: 'center',
            }}>
              Tersimpan permanen sebagai bagian dari arsip DPN RI.
            </div>
          </div>
        )}

        {/* Opinion carousel */}
        <div style={{ marginBottom: '16px' }}>
          <div className="label-overline" style={{ marginBottom: '10px' }}>
            SUARA RAKYAT LAINNYA
          </div>
          <OpinionCarousel />
        </div>

        {/* Bottom spacer so user can see submit button cue when scrolling */}
        <div style={{ height: '4px' }} />
      </div>

      {/* ── FIXED SUBMIT BUTTON — TASK 1.2: always visible ── */}
      <div style={{
        padding: '10px 16px',
        paddingBottom: 'max(10px, env(safe-area-inset-bottom))',
        borderTop: '1px solid var(--border-faint)',
        background: 'var(--surface-0)',
        flexShrink: 0,
      }}>
        <button
          onClick={handleSubmit}
          disabled={submitDisabled}
          style={{
            width: '100%',
            height: '52px',
            background: submitBg,
            border: 'none',
            borderRadius: 'var(--radius-md)',
            color: submitColor,
            fontFamily: 'var(--font-ui)',
            fontWeight: 700,
            fontSize: '15px',
            cursor: submitDisabled ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'background 200ms ease-out, color 200ms ease-out',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          {status === 'loading' ? (
            <>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                style={{ animation: 'spin 1s linear infinite' }}
              >
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.2" />
                <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Mengirim…
            </>
          ) : status === 'success' ? (
            submitText
          ) : (
            <>
              {/* Building/podium icon */}
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="10" width="12" height="5" rx="1" fill="currentColor" opacity="0.55" />
                <rect x="5" y="6" width="6" height="5" rx="1" fill="currentColor" opacity="0.75" />
                <rect x="7" y="2" width="2" height="5" rx="0.5" fill="currentColor" />
              </svg>
              {submitText}
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 20; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};
