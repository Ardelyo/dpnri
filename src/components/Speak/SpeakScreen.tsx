import React, { useState, useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { VoteType, DPNState } from '../../types';

const VOTE_OPTIONS: {
  value: VoteType;
  label: string;
  sub: string;
  color: string;
}[] = [
  { value: 'setuju', label: 'Setuju',  sub: 'Saya mendukung', color: 'var(--setuju)' },
  { value: 'abstain', label: 'Abstain', sub: 'Saya belum yakin', color: 'var(--abstain)' },
  { value: 'tolak', label: 'Tolak',   sub: 'Saya menolak', color: 'var(--tolak)' },
];

export const SpeakScreen: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const activeSession = useDPNStore((s: DPNState) => s.activeSession);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const addOpinion = useDPNStore((s: DPNState) => s.addOpinion);
  const setShowShareCard = useDPNStore((s: DPNState) => s.setShowShareCard);

  const [myVote, setMyVote] = useState<VoteType | null>(null);
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const textLen = text.trim().length;
  const isTextValid = textLen === 0 || textLen >= 20;
  const canSubmit = myVote !== null && isTextValid && status === 'idle';

  const handleSubmit = async () => {
    if (!canSubmit || !userProvinsi) return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    addOpinion({
      provinsi: userProvinsi,
      vote: myVote!,
      text: text.trim(),
    });
    setStatus('success');
    // Success handling logic will go to Task 3.5 view
    // For now, let's just go back to room after a delay
    setTimeout(() => {
      setScreen('room');
      setShowShareCard(true);
    }, 1500);
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
      maxWidth: '500px', // Mobile-first constraint
      margin: '0 auto',
    }}>
      {/* 1. Header & Breadcrumb */}
      <div style={{ padding: '0 16px 16px' }}>
        <button
          onClick={() => setScreen('room')}
          style={{
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            WebkitTapHighlightColor: 'transparent',
          }}
        >
          ← Kembali ke Sidang
        </button>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--accent)',
          fontFamily: 'var(--font-ui)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          NAIK PODIUM
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          margin: 0,
          color: 'var(--text-primary)',
          fontWeight: 400
        }}>
          Sampaikan Pendapatmu
        </h1>
      </div>

      {/* Scrollable Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        
        {/* 2. Context Box */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--surface-3)',
          borderRadius: 'var(--radius-md)',
          padding: '14px',
          marginBottom: '20px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            fontSize: '9px',
            fontWeight: 600,
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            marginBottom: '4px'
          }}>
            SIDANG #{activeSession.nomor.toString().padStart(3, '0')}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            color: 'var(--text-primary)',
            lineHeight: 1.4,
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {activeSession.judul}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {activeSession.pertanyaan}
          </div>
        </div>

        {/* 3. Pilih Posisimu */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            marginBottom: '10px'
          }}>
            PILIH POSISIMU
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {VOTE_OPTIONS.map(opt => {
              const checked = myVote === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setMyVote(opt.value)}
                  style={{
                    flex: 1,
                    height: '60px',
                    borderRadius: 'var(--radius-md)',
                    border: checked ? `2px solid ${opt.color}` : '1px solid var(--surface-3)',
                    background: checked ? `rgba(${opt.value === 'abstain' ? '138,132,117' : opt.value === 'setuju' ? '122,156,110' : '181,86,78'}, 0.1)` : 'var(--surface-2)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 200ms ease-out',
                    WebkitTapHighlightColor: 'transparent',
                    opacity: myVote && !checked ? 0.5 : 1
                  }}
                >
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {opt.label}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: checked ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {opt.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Ceritakan Alasanmu */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.08em'
            }}>
              CERITAKAN ALASANMU
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)'
            }}>
              OPSIONAL
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="Teman saya di NTT harus jalan 2 jam ke sekolah."
            style={{
              width: '100%',
              height: '88px',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              lineHeight: 1.5,
              resize: 'none',
              outline: 'none',
              transition: 'border-color 200ms ease-out'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--surface-3)'}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '8px'
          }}>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              fontStyle: 'italic'
            }}>
              Minimal 20 huruf agar tampil di kartu suara
            </div>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)'
            }}>
              {text.length}/300
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          style={{
            width: '100%',
            height: '48px',
            background: canSubmit ? 'var(--accent)' : 'var(--surface-2)',
            color: canSubmit ? 'var(--surface-0)' : 'var(--text-disabled)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 600,
            fontFamily: 'var(--font-ui)',
            cursor: canSubmit ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease-out',
            marginBottom: 'max(24px, env(safe-area-inset-bottom))'
          }}
        >
          {status === 'loading' ? 'Mengirim...' : (myVote ? 'Kirim ke Sidang' : 'Pilih posisimu dahulu')}
        </button>
      </div>
    </div>
  );
};
