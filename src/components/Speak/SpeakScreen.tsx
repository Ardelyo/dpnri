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
      maxWidth: '500px',
      margin: '0 auto',
    }}>
      {/* 1. Header */}
      <div style={{ padding: '0 16px 8px' }}>
        <button
          onClick={() => setScreen('room')}
          style={{
            height: '48px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            WebkitTapHighlightColor: 'transparent',
            fontWeight: 500,
          }}
        >
          ← Kembali ke Sidang
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent)',
          fontFamily: 'var(--font-ui)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '8px'
        }}>
          NAIK PODIUM
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          margin: '0 0 24px',
          color: 'var(--text-primary)',
          fontWeight: 400,
          lineHeight: 1.1
        }}>
          Sampaikan<br />Pendapatmu
        </h1>

        {/* 2. Context Box */}
        <div style={{
          background: 'var(--surface-1)',
          border: '1px solid var(--border-faint)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <div style={{
            fontSize: '9px',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            marginBottom: '6px'
          }}>
            TEMA SIDANG #{activeSession.nomor.toString().padStart(3, '0')}
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '17px',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '6px',
          }}>
            {activeSession.judul}
          </div>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontStyle: 'italic',
            fontSize: '13px',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            opacity: 0.8
          }}>
            "{activeSession.pertanyaan}"
          </div>
        </div>

        {/* 3. Pilih Posisimu */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            marginBottom: '12px'
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
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid',
                    borderColor: checked ? opt.color : 'var(--border-faint)',
                    background: checked ? `var(--surface-1)` : 'var(--surface-0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 200ms ease-out',
                    WebkitTapHighlightColor: 'transparent',
                    boxShadow: checked ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {opt.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {opt.sub}
                    </div>
                  </div>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    border: `1.5px solid ${checked ? opt.color : 'var(--border-subtle)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: checked ? opt.color : 'transparent',
                  }}>
                    {checked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'white' }} />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Ceritakan Alasanmu */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent)',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.08em'
            }}>
              CERITAKAN ALASANMU
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 300))}
            placeholder="Tuliskan keresahanmu di sini..."
            style={{
              width: '100%',
              height: '120px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '14px',
              lineHeight: 1.6,
              resize: 'none',
              outline: 'none',
              transition: 'all 200ms ease-out',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px'
          }}>
            <div style={{
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              fontStyle: 'italic',
              maxWidth: '70%',
            }}>
              {text.length < 20 ? 'Min. 20 karakter untuk tampil di kartu suara' : 'Sangat membantu dalam pengambilan keputusan'}
            </div>
            <div style={{
              fontSize: '11px',
              color: text.length >= 300 ? 'var(--tolak)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600
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
            height: '52px',
            background: canSubmit ? 'var(--accent)' : 'var(--surface-2)',
            color: canSubmit ? 'var(--surface-0)' : 'var(--text-disabled)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            cursor: canSubmit ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 200ms ease-out',
            boxShadow: canSubmit ? 'var(--shadow-md)' : 'none',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {status === 'loading' ? 'Memproses...' : (myVote ? `Sampaikan Sebagai Pendapat` : 'Tentukan Sikap Terlebih Dahulu')}
        </button>
      </div>
    </div>
  );
};
