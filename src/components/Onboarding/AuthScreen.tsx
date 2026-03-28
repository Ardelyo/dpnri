import React, { useState, useRef } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useDPNStore } from '../../store/dpnStore';

// ─── Spinner ───────────────────────────────────────────────────────────────
const Spinner: React.FC<{ color?: string }> = ({ color = 'var(--accent)' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'dpn-spin 0.7s linear infinite' }}>
    <style>{`@keyframes dpn-spin { to { transform: rotate(360deg); } }`}</style>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" strokeDasharray="40 20" strokeLinecap="round"/>
  </svg>
);

// ─── Google G SVG ─────────────────────────────────────────────────────────
const GoogleIcon: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

type AuthPhase = 'idle' | 'google-loading' | 'magic-loading' | 'magic-sent' | 'error';

export const AuthScreen: React.FC = () => {
  const login = useUserStore(s => s.login);
  const provinceId = useUserStore(s => s.provinceId);
  const hasCompletedOnboarding = useUserStore(s => s.hasCompletedOnboarding);
  const setScreen = useDPNStore(s => s.setScreen);

  const [phase, setPhase] = useState<AuthPhase>('idle');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [sentEmail, setSentEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goAfterLogin = () => {
    if (!provinceId) {
      setScreen('onboarding');
    } else if (!hasCompletedOnboarding) {
      setScreen('onboarding');
    } else {
      setScreen('room');
    }
  };

  const handleGoogle = async () => {
    setPhase('google-loading');
    setErrorMsg('');
    await new Promise(r => setTimeout(r, 1200));
    login({ userId: 'mock-user-' + Date.now(), authMethod: 'google' });
    goAfterLogin();
  };

  const handleMagicLink = async () => {
    if (!email.includes('@')) {
      setErrorMsg('Alamat email tidak valid.');
      setPhase('error');
      setTimeout(() => setPhase('idle'), 5000);
      return;
    }
    setPhase('magic-loading');
    await new Promise(r => setTimeout(r, 1000));
    setSentEmail(email);
    setPhase('magic-sent');
    startCooldown();
  };

  const startCooldown = () => {
    setResendCooldown(60);
    if (cooldownRef.current) clearInterval(cooldownRef.current);
    cooldownRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(cooldownRef.current!); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSimulate = () => {
    login({ userId: 'mock-user-' + Date.now(), authMethod: 'magic_link' });
    goAfterLogin();
  };

  const inputValid = email.length > 0;

  return (
    <div style={{
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
      padding: '0 24px',
      overflowY: 'auto',
    }}>
      {/* Back */}
      <button
        onClick={() => setScreen('landing')}
        style={{
          height: '44px', background: 'none', border: 'none',
          color: 'var(--text-secondary)', fontSize: '14px',
          fontFamily: 'var(--font-ui)', cursor: 'pointer',
          padding: '0', textAlign: 'left', marginTop: '8px',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        ← Kembali
      </button>

      {/* Header */}
      <div style={{ marginTop: '24px', marginBottom: '32px' }}>
        <div style={{
          fontSize: '11px', fontWeight: 600, color: 'var(--accent)',
          fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
          textTransform: 'uppercase', marginBottom: '8px',
        }}>MASUK</div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '24px',
          color: 'var(--text-primary)', fontWeight: 400,
          lineHeight: 1.2, margin: '0 0 8px',
        }}>
          Verifikasi identitasmu
        </h1>
        <p style={{
          fontSize: '13px', color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)', margin: 0, lineHeight: 1.6,
        }}>
          Satu akun, satu suara. Agar setiap suara berarti.
        </p>
      </div>

      {/* Error bar */}
      {phase === 'error' && errorMsg && (
        <div style={{
          background: 'rgba(181, 86, 78, 0.1)',
          border: '1px solid rgba(181, 86, 78, 0.2)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '16px',
          fontSize: '13px',
          color: 'var(--tolak)',
          fontFamily: 'var(--font-ui)',
        }}>
          {errorMsg}
        </div>
      )}

      {/* Magic link sent state */}
      {phase === 'magic-sent' ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          marginTop: '40px', textAlign: 'center',
        }}>
          <div style={{
            fontSize: '32px', color: 'var(--accent)', marginBottom: '20px',
          }}>✉</div>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '20px',
            color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 12px',
          }}>
            Cek emailmu
          </h2>
          <p style={{
            fontSize: '13px', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)', margin: '0 0 24px',
            lineHeight: 1.6, maxWidth: '280px',
          }}>
            Kami kirim link masuk ke <strong>{sentEmail}</strong>.
            Klik link itu untuk masuk.
          </p>
          <button
            onClick={resendCooldown > 0 ? undefined : handleMagicLink}
            disabled={resendCooldown > 0}
            style={{
              background: 'none', border: 'none',
              color: resendCooldown > 0 ? 'var(--text-tertiary)' : 'var(--accent)',
              fontSize: '13px', fontFamily: 'var(--font-ui)',
              cursor: resendCooldown > 0 ? 'default' : 'pointer',
              marginBottom: '8px',
            }}
          >
            {resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}d` : 'Tidak terima? Kirim ulang'}
          </button>
          <button
            onClick={handleSimulate}
            style={{
              marginTop: '32px', width: '100%', height: '48px',
              background: 'var(--surface-2)', border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            [Dev] Simulasi klik link masuk →
          </button>
        </div>
      ) : (
        <>
          {/* Google Button */}
          <button
            onClick={handleGoogle}
            disabled={phase === 'google-loading' || phase === 'magic-loading'}
            style={{
              width: '100%', height: '52px',
              background: '#FFFFFF',
              border: '1px solid #dadce0',
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '12px', cursor: 'pointer',
              opacity: phase === 'magic-loading' ? 0.5 : 1,
              transition: 'opacity 200ms',
            }}
          >
            {phase === 'google-loading' ? <Spinner color="#4285F4" /> : <GoogleIcon />}
            <span style={{
              fontSize: '15px', fontWeight: 500, color: '#1f1f1f',
              fontFamily: 'var(--font-ui)',
            }}>
              {phase === 'google-loading' ? 'Menunggu Google...' : 'Masuk dengan Google'}
            </span>
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            margin: '24px 0',
          }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-3)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
              atau
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--surface-3)' }} />
          </div>

          {/* Magic Link */}
          <label style={{
            fontSize: '13px', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)', marginBottom: '8px', display: 'block',
          }}>
            Masuk dengan email
          </label>
          <input
            type="email"
            placeholder="alamat@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--surface-3)'}
            style={{
              width: '100%', height: '48px',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              padding: '0 16px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              fontStyle: 'italic',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 200ms',
            }}
          />
          <button
            onClick={handleMagicLink}
            disabled={!inputValid || phase === 'magic-loading' || phase === 'google-loading'}
            style={{
              width: '100%', height: '48px', marginTop: '12px',
              background: 'var(--surface-2)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              color: inputValid ? 'var(--text-primary)' : 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '14px',
              cursor: inputValid ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              transition: 'all 200ms',
            }}
          >
            {phase === 'magic-loading' ? <Spinner /> : null}
            {phase === 'magic-loading' ? 'Mengirim...' : 'Kirim link masuk'}
          </button>
        </>
      )}

      {/* Footer */}
      <p style={{
        fontSize: '11px', color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)', textAlign: 'center',
        margin: '32px auto 40px', maxWidth: '280px', lineHeight: 1.6,
      }}>
        Kami hanya menyimpan ID akunmu (di-hash). Nama, foto, dan data pribadimu tidak disimpan.
      </p>
    </div>
  );
};
