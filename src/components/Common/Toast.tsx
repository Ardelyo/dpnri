import React, { useEffect, useRef, useState } from 'react';
import { useUserStore } from '../../store/useUserStore';

export const Toast: React.FC = () => {
  const toast = useUserStore(s => s.toast);
  const hideToast = useUserStore(s => s.hideToast);
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(toast);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (toast) {
      setCurrent(toast);
      setVisible(false);
      // Small tick to re-trigger entry animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
        setTimeout(hideToast, 220);
      }, 3000);
    } else {
      setVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast]);

  if (!current && !toast) return null;

  const borderColor =
    current?.type === 'success' ? 'var(--setuju)' :
    current?.type === 'error'   ? 'var(--tolak)' :
    'var(--surface-3)';

  const accentLeft =
    current?.type === 'success' || current?.type === 'error';

  return (
    <div style={{
      position: 'fixed',
      top: 'max(16px, env(safe-area-inset-top, 16px))',
      left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '-20px'})`,
      zIndex: 600,
      opacity: visible ? 1 : 0,
      transition: 'transform 250ms cubic-bezier(0.16,1,0.3,1), opacity 220ms ease',
      pointerEvents: 'none',
      maxWidth: '320px',
      width: 'calc(100vw - 32px)',
    }}>
      <div style={{
        background: 'var(--surface-1)',
        border: '1px solid var(--surface-3)',
        borderLeft: accentLeft ? `3px solid ${borderColor}` : `1px solid var(--surface-3)`,
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        fontSize: '13px',
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-ui)',
        lineHeight: 1.5,
      }}>
        {current?.message}
      </div>
    </div>
  );
};
