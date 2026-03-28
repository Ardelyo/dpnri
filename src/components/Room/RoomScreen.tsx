import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { DPNState } from '../../types';
import { buildProvinceVotes } from '../../utils/opinion-logic';
import { CharacterSheet } from './CharacterSheet';
import { RoomBottomBar } from './RoomBottomBar';
import { RoomHeader } from './RoomHeader';
import { PodiumSection } from './PodiumSection';
import { HemicycleGrid } from './HemicycleGrid';
import { SuaraTerbaru } from './SuaraTerbaru';

export const RoomScreen: React.FC = () => {
  const opinions = useDPNStore((s: DPNState) => s.opinions);
  const session = useDPNStore((s: DPNState) => s.activeSession);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const hasVoted = useDPNStore((s: DPNState) => s.hasVoted);

  const [selectedProv, setSelectedProv] = useState<string | null>(null);
  const [newlyVotedProv, setNewlyVotedProv] = useState<string | null>(null);
  const prevOpCount = useRef(opinions.length);

  // Detect new opinion for glow
  useEffect(() => {
    if (opinions.length > prevOpCount.current) {
      const newest = opinions[opinions.length - 1];
      setNewlyVotedProv(newest.provinsi);
      setTimeout(() => setNewlyVotedProv(null), 2200);
      prevOpCount.current = opinions.length;
    }
  }, [opinions.length]);

  const provinceVotes = useMemo(() => buildProvinceVotes(opinions), [opinions]);
  const totalOnline = opinions.length + 7;

  const handleNodeClick = (provName: string) => {
    setSelectedProv((prev) => prev === provName ? null : provName);
  };

  const handleBicara = () => {
    setSelectedProv(null);
    if (!userProvinsi) {
      setScreen('onboarding');
    } else {
      setScreen('speak');
    }
  };

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

      {/* Main scrollable area */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '32px' }}>
        
        {/* 2. JUDUL SIDANG */}
        <div style={{ padding: '16px 16px 0', marginBottom: '16px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 600, 
              color: 'var(--accent)', 
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.04em'
            }}>
              #{session.nomor.toString().padStart(3, '0')}
            </span>
            <span style={{ 
              fontSize: '10px', 
              fontWeight: 600, 
              color: 'var(--setuju)', 
              background: 'var(--setuju-muted)',
              padding: '2px 6px',
              borderRadius: '2px',
              fontFamily: 'var(--font-ui)',
              letterSpacing: '0.04em'
            }}>
              AKTIF
            </span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            margin: '0 0 8px',
            fontWeight: 400
          }}>
            {session.judul}
          </h1>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: '15px',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.5
          }}>
            {session.pertanyaan}
          </p>
        </div>

        {/* 3 & 4. PODIUM & SUMMARY */}
        <PodiumSection votes={session.votes} totalSuara={opinions.length} />

        {/* 5. NODE HEMICYCLE */}
        <HemicycleGrid
          provinceVotes={provinceVotes}
          newlyVotedProv={newlyVotedProv}
          selectedProv={selectedProv}
          onNodeClick={handleNodeClick}
        />

        {/* 6. SUARA TERBARU */}
        <SuaraTerbaru opinions={opinions} />
      </div>

      <RoomBottomBar onBicara={handleBicara} hasVoted={hasVoted} />

      {selectedProv && (
        <CharacterSheet
          provinsi={selectedProv}
          opinion={opinions.find(o => o.provinsi === selectedProv) ?? null}
          onClose={() => setSelectedProv(null)}
          onReply={() => {
            setSelectedProv(null);
            handleBicara();
          }}
        />
      )}
    </div>
  );
};
