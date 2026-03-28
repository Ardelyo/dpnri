import React from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';
import type { DPNState } from '../../types';

type NavItem = {
  key: string;
  label: string;
  screen: string;
  icon: React.ReactNode;
};

const SidangIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
);

const PodiumIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="16" width="18" height="5" rx="1"/>
    <rect x="7" y="10" width="10" height="7" rx="1"/>
    <rect x="10" y="4" width="4" height="7" rx="1"/>
  </svg>
);

const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const HIDDEN_ON: string[] = ['landing', 'auth', 'onboarding', 'onboarding-flow'];

export const BottomNav: React.FC = () => {
  const screen = useDPNStore((s: DPNState) => s.screen);
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const isLoggedIn = useUserStore(s => s.isLoggedIn);

  if (HIDDEN_ON.includes(screen)) return null;
  // Also hide on speak screen (full-screen form)
  if (screen === 'speak' || screen === 'postvote') return null;

  const navItems: NavItem[] = [
    {
      key: 'archive',
      label: 'Sidang',
      screen: 'archive',
      icon: <SidangIcon />,
    },
    {
      key: 'room',
      label: 'Aktif',
      screen: 'room',
      icon: <PodiumIcon />,
    },
    {
      key: isLoggedIn ? 'settings' : 'auth',
      label: isLoggedIn ? 'Akun' : 'Masuk',
      screen: isLoggedIn ? 'settings' : 'auth',
      icon: <AccountIcon />,
    },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 300,
      background: 'var(--surface-1)',
      borderTop: '1px solid var(--surface-3)',
      display: 'flex',
      maxWidth: '500px',
      margin: '0 auto',
      height: `calc(56px + env(safe-area-inset-bottom, 0px))`,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      {navItems.map(item => {
        const isActive = screen === item.screen;
        return (
          <button
            key={item.key}
            onClick={() => setScreen(item.screen as DPNState['screen'])}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
              transition: 'color 200ms ease',
              WebkitTapHighlightColor: 'transparent',
              minHeight: '44px',
            }}
          >
            {item.icon}
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              fontFamily: 'var(--font-ui)',
              lineHeight: 1,
            }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
