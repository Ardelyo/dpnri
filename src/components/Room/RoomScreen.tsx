import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';
import type { DPNState } from '../../types';
import { buildProvinceVotes } from '../../utils/opinion-logic';
import { CharacterSheet } from './CharacterSheet';
import { RoomBottomBar } from './RoomBottomBar';
import { RoomHeader } from './RoomHeader';
import { PodiumSection } from './PodiumSection';
import { HemicycleGrid } from './HemicycleGrid';
import { SuaraTerbaru } from './SuaraTerbaru';
import { IndonesiaMap } from '../Map/IndonesiaMap';

// ─── Read-only banner ────────────────────────────────────────────────────
const ReadOnlyBanner: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div style={{
    margin: '0 16px 16px',
    padding: '12px 16px',
    background: 'rgba(184,164,114,0.06)',
    border: '1px solid rgba(184,164,114,0.15)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  }}>
    <span style={{
      fontSize: '13px', color: 'var(--text-primary)',
      fontFamily: 'var(--font-ui)', lineHeight: 1.4,
    }}>
      Kamu belum masuk.
    </span>
    <button
      onClick={onLogin}
      style={{
        background: 'none', border: 'none',
        color: 'var(--accent)', fontFamily: 'var(--font-ui)',
        fontSize: '13px', fontWeight: 600,
        cursor: 'pointer', flexShrink: 0,
        padding: 0, WebkitTapHighlightColor: 'transparent',
      }}
    >
      Masuk untuk bersuara →
    </button>
  </div>
);

export const RoomScreen: React.FC = () => {
  const opinions    = useDPNStore((s: DPNState) => s.opinions);
  const session     = useDPNStore((s: DPNState) => s.activeSession);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const setScreen   = useDPNStore((s: DPNState) => s.setScreen);

  const isLoggedIn  = useUserStore(s => s.isLoggedIn);
  const hasVotedOn  = useUserStore(s => s.hasVotedOn);
  const provinceName = useUserStore(s => s.provinceName);

  const sidangNomor = String(session.nomor);
  const hasVoted    = hasVotedOn(sidangNomor);

  const [selectedProv, setSelectedProv]       = useState<string | null>(null);
  const [newlyVotedProv, setNewlyVotedProv]   = useState<string | null>(null);
  const prevOpCount = useRef(opinions.length);

  // Detect new opinion for node glow
  useEffect(() => {
    if (opinions.length > prevOpCount.current) {
      const newest = opinions[opinions.length - 1];
      setNewlyVotedProv(newest.provinsi);
      setTimeout(() => setNewlyVotedProv(null), 2200);
      prevOpCount.current = opinions.length;
    }
  }, [opinions.length]);

  const provinceVotes = useMemo(() => buildProvinceVotes(opinions), [opinions]);
  const totalOnline   = opinions.length + 7;

  const handleNodeClick = (provName: string) => {
    setSelectedProv(prev => prev === provName ? null : provName);
  };

  const handleBicara = () => {
    setSelectedProv(null);
    if (!isLoggedIn) {
      setScreen('auth');
    } else if (!userProvinsi && !provinceName) {
      setScreen('onboarding');
    } else {
      setScreen('speak');
    }
  };

  // User's province name comes from either user store or legacy dpn store
  const userProvince = provinceName ?? userProvinsi;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'var(--surface-0)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* 1. TOP BAR */}
      <RoomHeader
        totalOnline={totalOnline}
        session={session}
        onArchive={() => setScreen('archive')}
      />

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '32px' }}>

        {/* Read-only banner */}
        {!isLoggedIn && (
          <ReadOnlyBanner onLogin={() => setScreen('auth')} />
        )}

        {/* Judul sidang */}
        <div style={{ padding: '16px 16px 0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              fontSize: '11px', fontWeight: 600,
              color: 'var(--accent)', fontFamily: 'var(--font-ui)',
              letterSpacing: '0.04em',
            }}>
              #{String(session.nomor).padStart(3, '0')}
            </span>
            <span style={{
              fontSize: '10px', fontWeight: 600, color: 'var(--setuju)',
              background: 'var(--setuju-muted)',
              padding: '2px 6px', borderRadius: '2px',
              fontFamily: 'var(--font-ui)', letterSpacing: '0.04em',
            }}>
              AKTIF
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '24px',
            color: 'var(--text-primary)', lineHeight: 1.2,
            margin: '0 0 8px', fontWeight: 400,
          }}>
            {session.judul}
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)', fontStyle: 'italic',
            fontSize: '15px', color: 'var(--text-secondary)',
            margin: 0, lineHeight: 1.5,
          }}>
            {session.pertanyaan}
          </p>
        </div>

        {/* Podium & Summary */}
        <PodiumSection votes={session.votes} totalSuara={opinions.length} />

        {/* Hemicycle nodes */}
        <HemicycleGrid
          provinceVotes={provinceVotes}
          newlyVotedProv={newlyVotedProv}
          selectedProv={selectedProv}
          onNodeClick={handleNodeClick}
          userProvince={hasVoted ? (userProvince ?? null) : null}
        />

        {/* Suara Terbaru */}
        <SuaraTerbaru opinions={opinions} />
      </div>

      {/* Map preview */}
      <div onClick={() => setScreen('map')} style={{ cursor: 'pointer' }}>
        <IndonesiaMap fullscreen={false} onClose={() => setScreen('map')} />
      </div>

      {/* Bottom CTA */}
      <RoomBottomBar
        onBicara={handleBicara}
        hasVoted={hasVoted}
        sidangNomor={sidangNomor}
      />

      {/* Province detail sheet */}
      {selectedProv && (
        <CharacterSheet
          provinsi={selectedProv}
          opinion={opinions.find(o => o.provinsi === selectedProv) ?? null}
          onClose={() => setSelectedProv(null)}
          onReply={() => { setSelectedProv(null); handleBicara(); }}
        />
      )}
    </div>
  );
};
