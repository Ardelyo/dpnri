import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { DPNState } from '../../types';
import { PROVINCES } from '../../constants/provinces';
import { 
  buildProvinceVotes, 
  getLatestOpinionForProvince 
} from '../../utils/opinion-logic';
import { CharacterSheet } from './CharacterSheet';
import { RoomBottomBar } from './RoomBottomBar';
import { ProvinceNode } from './ProvinceNode';
import { PodiumSection } from './PodiumSection';
import { SuaraTerbaru } from './SuaraTerbaru';
import { RoomHeader } from './RoomHeader';

const ROWS = [5, 7, 9, 9, 8];

export const RoomScreen: React.FC = () => {
  const opinions = useDPNStore((s: DPNState) => s.opinions);
  const session = useDPNStore((s: DPNState) => s.activeSession);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const setShowOnboarding = useDPNStore((s: DPNState) => s.setShowOnboarding);
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

  const selectedOpinion = useMemo(() => 
    selectedProv ? getLatestOpinionForProvince(opinions, selectedProv) : null,
    [selectedProv, opinions]
  );

  const handleNodeClick = (provName: string) => {
    setSelectedProv((prev: string | null) => prev === provName ? null : provName);
  };

  const handleBicara = () => {
    setSelectedProv(null);
    if (!userProvinsi) {
      setShowOnboarding(true);
    } else {
      setScreen('speak');
    }
  };

  // Build the hemicycle rows
  const rows = useMemo(() => {
    const result: (typeof PROVINCES[0])[][] = [];
    let idx = 0;
    for (const count of ROWS) {
      result.push(PROVINCES.slice(idx, idx + count));
      idx += count;
    }
    return result;
  }, []);

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
      <RoomHeader 
        totalOnline={totalOnline} 
        session={session} 
        onArchive={() => setScreen('archive')} 
      />

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <PodiumSection votes={session.votes} totalSuara={opinions.length} />

        <div style={{
          padding: '8px 16px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {/* Subtle arc guide lines SVG */}
          <div style={{ position: 'relative' }}>
            <svg
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none',
                opacity: 0.35,
              }}
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              {[20, 40, 60, 80].map((y, i) => (
                <path
                  key={i}
                  d={`M 5 ${y + 5} Q 50 ${y - 5} 95 ${y + 5}`}
                  fill="none"
                  stroke="var(--border-faint)"
                  strokeWidth="0.5"
                  strokeDasharray="2 3"
                />
              ))}
            </svg>

            {/* Node rows */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {rows.map((rowProvs: (typeof PROVINCES)[0][], rowIdx: number) => (
                <div
                  key={rowIdx}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    marginBottom: rowIdx < ROWS.length - 1 ? '6px' : '0',
                    paddingLeft: `${Math.max(0, (9 - rowProvs.length) * 2)}px`,
                    paddingRight: `${Math.max(0, (9 - rowProvs.length) * 2)}px`,
                    alignItems: 'flex-start',
                  }}
                >
                  {rowProvs.map((prov, colIdx: number) => {
                    const rowFraction = rowProvs.length === 1 ? 0.5 : colIdx / (rowProvs.length - 1);
                    return (
                      <ProvinceNode
                        key={prov.name}
                        province={prov}
                        voteStatus={provinceVotes[prov.name] || 'none'}
                        isSelected={selectedProv === prov.name}
                        isNew={newlyVotedProv === prov.name}
                        onClick={() => handleNodeClick(prov.name)}
                        rowFraction={rowFraction}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '14px',
            paddingTop: '8px',
          }}>
            {[
              { label: 'Setuju',  color: 'var(--setuju)' },
              { label: 'Abstain', color: 'var(--abstain)' },
              { label: 'Tolak',   color: 'var(--tolak)' },
              { label: 'Belum',   color: 'var(--surface-4)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  width: '7px', height: '7px',
                  borderRadius: '2px',
                  background: item.color,
                  display: 'inline-block',
                }} />
                <span style={{
                  fontSize: '10px',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <SuaraTerbaru opinions={opinions} />
        <div style={{ height: '16px' }} />
      </div>

      <RoomBottomBar onBicara={handleBicara} hasVoted={hasVoted} />

      {selectedProv && (
        <CharacterSheet
          provinsi={selectedProv}
          opinion={selectedOpinion}
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
