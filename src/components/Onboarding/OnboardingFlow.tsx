import React, { useState, useRef } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useDPNStore } from '../../store/dpnStore';

// ─── Slide data ───────────────────────────────────────────────────────────
const SLIDES = [
  {
    icon: '🗳',
    heading: 'Rakyat bersuara.',
    body: 'Baca isu kebijakan yang sedang dibahas DPR. Pilih posisimu: setuju, abstain, atau tolak.',
  },
  {
    icon: '📜',
    heading: 'Semua tercatat.',
    body: 'Suaramu tersimpan permanen. Tidak bisa diubah, tidak bisa dihapus. Seperti sidang sungguhan.',
  },
  {
    icon: '⚖️',
    heading: 'Bandingkan.',
    body: 'Lihat apakah keputusan DPR sejalan dengan suara rakyat. Data bicara.',
  },
];

export const OnboardingFlow: React.FC = () => {
  const completeOnboarding = useUserStore(s => s.completeOnboarding);
  const setScreen = useDPNStore(s => s.setScreen);

  const [current, setCurrent] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('left');

  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number, dir: 'left' | 'right') => {
    if (index < 0 || index >= SLIDES.length) return;
    setDirection(dir);
    setExiting(true);
    setTimeout(() => {
      setCurrent(index);
      setExiting(false);
    }, 250);
  };

  const next = () => {
    if (current < SLIDES.length - 1) goTo(current + 1, 'left');
  };
  const prev = () => {
    if (current > 0) goTo(current - 1, 'right');
  };

  const finish = () => {
    completeOnboarding();
    setScreen('room');
  };

  const skip = () => {
    completeOnboarding();
    setScreen('room');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -50) next();
    else if (dx > 50) prev();
    touchStartX.current = null;
  };

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        background: 'var(--surface-0)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '480px',
        userSelect: 'none',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip button */}
      <div style={{
        display: 'flex', justifyContent: 'flex-end',
        padding: '16px 20px 0',
      }}>
        {!isLast && (
          <button
            onClick={skip}
            style={{
              background: 'none', border: 'none',
              color: 'var(--text-tertiary)', fontSize: '14px',
              fontFamily: 'var(--font-ui)', cursor: 'pointer',
              padding: '4px 0',
            }}
          >
            Lewati
          </button>
        )}
      </div>

      {/* Slide content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 40px',
          textAlign: 'center',
          opacity: exiting ? 0 : 1,
          transform: exiting
            ? `translateX(${direction === 'left' ? '-20px' : '20px'})`
            : 'translateX(0)',
          transition: 'opacity 250ms ease-out, transform 250ms ease-out',
        }}
      >
        {/* Icon */}
        <div style={{
          fontSize: '40px',
          marginBottom: '20px',
          lineHeight: 1,
        }}>
          {slide.icon}
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '22px',
          color: 'var(--text-primary)',
          fontWeight: 400,
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          {slide.heading}
        </h2>

        {/* Body */}
        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.65,
          margin: 0,
          maxWidth: '260px',
        }}>
          {slide.body}
        </p>
      </div>

      {/* Bottom area */}
      <div style={{
        padding: '0 24px',
        paddingBottom: 'max(32px, env(safe-area-inset-bottom, 32px))',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i, i > current ? 'left' : 'right')}
              style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                background: i === current ? 'var(--accent)' : 'var(--surface-3)',
                transition: 'background 300ms, transform 300ms',
                transform: i === current ? 'scale(1.3)' : 'scale(1)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        {isLast ? (
          <button
            onClick={finish}
            style={{
              width: '100%', height: '48px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--surface-0)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700, fontSize: '15px',
              cursor: 'pointer',
              letterSpacing: '0.03em',
            }}
          >
            Mulai →
          </button>
        ) : (
          <div style={{
            display: 'flex', width: '100%', gap: '12px',
          }}>
            <button
              onClick={prev}
              disabled={current === 0}
              style={{
                flex: 1, height: '48px',
                background: 'none',
                border: '1px solid var(--surface-3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)', fontSize: '14px',
                cursor: current === 0 ? 'default' : 'pointer',
                opacity: current === 0 ? 0.3 : 1,
              }}
            >
              ←
            </button>
            <button
              onClick={next}
              style={{
                flex: 3, height: '48px',
                background: 'var(--surface-2)',
                border: '1px solid var(--surface-3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-ui)', fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Lanjut →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
