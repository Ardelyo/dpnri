import React, { useState, useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';
import type { VoteType, DPNState } from '../../types';

const VOTE_OPTIONS: { value: VoteType; label: string; sub: string; color: string }[] = [
  { value: 'setuju',  label: 'Setuju',  sub: 'Saya mendukung',   color: 'var(--setuju)'  },
  { value: 'abstain', label: 'Abstain', sub: 'Saya belum yakin', color: 'var(--abstain)' },
  { value: 'tolak',   label: 'Tolak',   sub: 'Saya menolak',     color: 'var(--tolak)'   },
];

const Spinner: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ animation: 'dpn-spin 0.7s linear infinite' }}>
    <style>{`@keyframes dpn-spin { to { transform: rotate(360deg); } }`}</style>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40 20" strokeLinecap="round"/>
  </svg>
);

export const SpeakScreen: React.FC = () => {
  const setScreen  = useDPNStore((s: DPNState) => s.setScreen);
  const session    = useDPNStore((s: DPNState) => s.activeSession);
  const provinsi   = useDPNStore((s: DPNState) => s.userProvinsi);
  const addOpinion = useDPNStore((s: DPNState) => s.addOpinion);

  const isLoggedIn  = useUserStore(s => s.isLoggedIn);
  const recordVote  = useUserStore(s => s.recordVote);
  const provinceName = useUserStore(s => s.provinceName);
  const showToast   = useUserStore(s => s.showToast);

  const [myVote, setMyVote]   = useState<VoteType | null>(null);
  const [text, setText]       = useState('');
  const [status, setStatus]   = useState<'idle' | 'loading' | 'success'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typingStart = useRef<number | null>(null);
  const typingDuration = useRef(0);

  const textLen  = text.trim().length;
  const isValid  = textLen === 0 || textLen >= 20;
  const canSubmit = myVote !== null && isValid && status === 'idle';

  // Guard: if not logged in, redirect to auth on mount
  React.useEffect(() => {
    if (!isLoggedIn) {
      setScreen('auth');
    }
  }, []);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const effectiveProv = provinceName ?? provinsi ?? 'Anonim';

    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));

    addOpinion({
      provinsi: effectiveProv,
      vote: myVote!,
      text: text.trim(),
    });

    // Record vote in user store
    const voteId = `DPN/SID/${String(session.nomor).padStart(3, '0')}/2026/${String(Date.now()).slice(-8)}`;

    recordVote(String(session.nomor), {
      position: myVote!,
      opinionText: text.trim(),
      timestamp: new Date().toISOString(),
      voteId,
      sidangJudul: session.judul,
      nomor: String(session.nomor),
    });

    setStatus('success');
    showToast('Suaramu tercatat!', 'success');
    // Small delay so user sees the success state before transition
    setTimeout(() => setScreen('postvote'), 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ padding: '0 16px 8px' }}>
        <button
          onClick={() => setScreen('room')}
          style={{
            height: '48px', background: 'none', border: 'none',
            color: 'var(--text-tertiary)', fontSize: '14px',
            fontFamily: 'var(--font-ui)', cursor: 'pointer',
            padding: '12px 0', display: 'flex', alignItems: 'center',
            WebkitTapHighlightColor: 'transparent', fontWeight: 500,
          }}
        >
          ← Kembali ke Sidang
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
        {/* Overline */}
        <div style={{
          fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
          fontFamily: 'var(--font-ui)', letterSpacing: '0.1em',
          textTransform: 'uppercase', marginBottom: '8px',
        }}>
          NAIK PODIUM
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '28px',
          margin: '0 0 24px', color: 'var(--text-primary)',
          fontWeight: 400, lineHeight: 1.1,
        }}>
          Sampaikan<br />Pendapatmu
        </h1>

        {/* Context Box */}
        <div style={{
          background: 'var(--surface-1)', border: '1px solid var(--surface-3)',
          borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '9px', fontWeight: 700, color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)', letterSpacing: '0.08em', marginBottom: '6px',
          }}>
            TEMA SIDANG #{String(session.nomor).padStart(3, '0')}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: '17px',
            color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '6px',
          }}>
            {session.judul}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)', fontStyle: 'italic',
            fontSize: '13px', color: 'var(--text-secondary)',
            lineHeight: 1.5, opacity: 0.8,
          }}>
            "{session.pertanyaan}"
          </div>
        </div>

        {/* Vote options */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
            fontFamily: 'var(--font-ui)', letterSpacing: '0.08em', marginBottom: '12px',
          }}>
            PILIH POSISIMU
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {VOTE_OPTIONS.map(opt => {
              const checked = myVote === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setMyVote(opt.value)}
                  style={{
                    width: '100%', padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: `1px solid ${checked ? opt.color : 'var(--surface-3)'}`,
                    background: checked ? 'var(--surface-1)' : 'var(--surface-0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 200ms ease-out',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '15px', fontWeight: 600,
                      color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-ui)',
                    }}>{opt.label}</div>
                    <div style={{
                      fontSize: '11px', color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-ui)',
                    }}>{opt.sub}</div>
                  </div>
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
                    border: `1.5px solid ${checked ? opt.color : 'var(--surface-3)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: checked ? opt.color : 'transparent',
                  }}>
                    {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Textarea */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: '10px',
          }}>
            <div style={{
              fontSize: '11px', fontWeight: 700, color: 'var(--accent)',
              fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
            }}>
              CERITAKAN ALASANMU
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => setText(e.target.value.slice(0, 300))}
            onFocus={() => { typingStart.current = Date.now(); }}
            onBlur={() => {
              if (typingStart.current) {
                typingDuration.current += Date.now() - typingStart.current;
                typingStart.current = null;
              }
            }}
            placeholder="Tuliskan keresahanmu di sini..."
            style={{
              width: '100%', height: '120px',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              color: 'var(--text-primary)', fontFamily: 'var(--font-ui)',
              fontSize: '14px', lineHeight: 1.6,
              resize: 'none', outline: 'none',
              transition: 'border-color 200ms ease-out',
              boxSizing: 'border-box',
            }}
            onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
            onBlurCapture={e => e.target.style.borderColor = 'var(--surface-3)'}
          />
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: '10px',
          }}>
            <div style={{
              fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)',
              fontStyle: 'italic', maxWidth: '70%',
            }}>
              {textLen < 20 ? 'Min. 20 karakter untuk tampil di kartu suara' : 'Sangat membantu dalam pengambilan keputusan'}
            </div>
            <div style={{
              fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-ui)',
              color: text.length >= 300 ? 'var(--tolak)' : 'var(--text-tertiary)',
            }}>
              {text.length}/300
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%', height: '52px',
            background: status === 'success'
              ? 'var(--setuju-muted)'
              : canSubmit
              ? 'var(--accent)'
              : 'var(--surface-2)',
            border: status === 'success' ? '1px solid var(--setuju-dim)' : 'none',
            color:
              status === 'success'
                ? 'var(--setuju-text)'
                : canSubmit
                ? 'var(--surface-0)'
                : 'var(--text-disabled)',
            borderRadius: 'var(--radius-md)',
            fontSize: '15px', fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            cursor: canSubmit ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'all 200ms ease-out',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {status === 'loading' && <Spinner />}
          {status === 'success' ? '✓ Tercatat' : status === 'loading' ? 'Mengirim...' : myVote ? 'Kirim ke Sidang' : 'Tentukan Sikap Terlebih Dahulu'}
        </button>
      </div>
    </div>
  );
};
