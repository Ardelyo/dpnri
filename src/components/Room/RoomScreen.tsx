import React, { useState, useEffect, useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES } from '../../constants/provinces';
import type { Opinion } from '../../store/dpnStore';
import { CharacterSheet } from './CharacterSheet';
import { RoomBottomBar } from './RoomBottomBar';

// ------------------------------------------------------------------
// TASK 1.1 — Node layout: CSS Grid rows (no absolute positioning)
// Hemicycle rows, centered per row, guaranteed to fit 360px viewport
// Row counts: 5 / 7 / 9 / 9 / 8 = 38 total
// ------------------------------------------------------------------

const ROWS = [5, 7, 9, 9, 8];

// Province abbreviation → vote status
function buildProvinceVotes(
  opinions: Opinion[]
): Record<string, 'setuju' | 'abstain' | 'tolak' | 'none'> {
  const counts: Record<string, { setuju: number; abstain: number; tolak: number }> = {};
  for (const op of opinions) {
    if (!counts[op.provinsi]) counts[op.provinsi] = { setuju: 0, abstain: 0, tolak: 0 };
    counts[op.provinsi][op.vote]++;
  }
  const result: Record<string, 'setuju' | 'abstain' | 'tolak' | 'none'> = {};
  for (const prov of PROVINCES) {
    const c = counts[prov.name];
    if (!c) { result[prov.name] = 'none'; continue; }
    const max = Math.max(c.setuju, c.abstain, c.tolak);
    if (max === 0) result[prov.name] = 'none';
    else if (c.setuju === max) result[prov.name] = 'setuju';
    else if (c.tolak === max) result[prov.name] = 'tolak';
    else result[prov.name] = 'abstain';
  }
  return result;
}

function getLatestOpinionForProvince(opinions: Opinion[], prov: string): Opinion | null {
  const arr = opinions.filter(o => o.provinsi === prov);
  return arr.length ? arr[arr.length - 1] : null;
}

// ------------------------------------------------------------------
// TASK 2.1 — Podium SVG: trapezoid + mic, stroke-based line art
// ------------------------------------------------------------------
const PodiumSVG: React.FC = () => (
  <svg
    width="110"
    height="88"
    viewBox="0 0 110 88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Podium DPN"
    style={{ display: 'block' }}
  >
    {/* Spotlight radial behind podium */}
    <defs>
      <radialGradient id="spotlight" cx="50%" cy="55%" r="50%">
        <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.07" />
        <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cx="55" cy="68" rx="50" ry="28" fill="url(#spotlight)" />

    {/* Podium body — trapezoid (wider at top) */}
    <path
      d="M22 44 L88 44 L82 80 L28 80 Z"
      stroke="var(--accent-primary)"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />

    {/* Panel line on front face */}
    <line
      x1="32" y1="56"
      x2="78" y2="56"
      stroke="var(--accent-primary)"
      strokeWidth="0.8"
      strokeOpacity="0.5"
    />

    {/* Top face of podium / lectern surface */}
    <rect
      x="18" y="36"
      width="74" height="10"
      rx="2"
      stroke="var(--accent-primary)"
      strokeWidth="1.2"
    />

    {/* Lectern face panel */}
    <rect
      x="34" y="12"
      width="42" height="26"
      rx="1.5"
      stroke="var(--accent-primary)"
      strokeWidth="1.2"
    />

    {/* Small emblem line inside lectern */}
    <line
      x1="42" y1="22"
      x2="68" y2="22"
      stroke="var(--accent-primary)"
      strokeWidth="0.6"
      strokeOpacity="0.45"
    />

    {/* Lectern connect to top face */}
    <line x1="55" y1="36" x2="55" y2="38"
      stroke="var(--accent-primary)" strokeWidth="1" strokeOpacity="0.5" />

    {/* Microphone stem */}
    <line
      x1="55" y1="12"
      x2="55" y2="5"
      stroke="var(--accent-primary)"
      strokeWidth="1"
      strokeLinecap="round"
    />
    {/* Microphone capsule */}
    <circle
      cx="55" cy="4"
      r="2.8"
      stroke="var(--accent-primary)"
      strokeWidth="1"
    />
    {/* Mic stand arm */}
    <line
      x1="51" y1="8"
      x2="55" y2="12"
      stroke="var(--accent-primary)"
      strokeWidth="0.8"
      strokeOpacity="0.6"
      strokeLinecap="round"
    />
  </svg>
);

// ------------------------------------------------------------------
// TASK 3.3 — Live counter (pulse dot)
// ------------------------------------------------------------------
const LiveCounter: React.FC<{ count: number; onArchive: () => void }> = ({ count, onArchive }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
    {/* Archive icon — moved to top bar per TASK 3.3 */}
    <button
      onClick={onArchive}
      aria-label="Buka Arsip"
      style={{
        background: 'none',
        border: 'none',
        padding: '4px',
        cursor: 'pointer',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        lineHeight: 1,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="15" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1.5" y="7.5" width="15" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <rect x="1.5" y="13.5" width="10" height="3" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </button>
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      <span
        className="animate-pulse-live"
        style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#a04040',
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span
        className="label-meta"
        style={{ color: 'var(--text-secondary)', fontSize: '11px' }}
      >
        {count} HADIR
      </span>
    </div>
  </div>
);

// ------------------------------------------------------------------
// Vote summary bar (compact)
// ------------------------------------------------------------------
const VoteSummaryBar: React.FC<{ setuju: number; abstain: number; tolak: number }> = ({
  setuju, abstain, tolak,
}) => {
  const total = setuju + abstain + tolak || 1;
  const sPct = (setuju / total * 100).toFixed(0);
  const aPct = (abstain / total * 100).toFixed(0);
  const tPct = (tolak / total * 100).toFixed(0);
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="vote-bar-track"
        style={{ width: '140px', margin: '0 auto 6px' }}
        role="meter"
        aria-label={`Setuju ${sPct}%, Abstain ${aPct}%, Tolak ${tPct}%`}
      >
        <div className="vote-bar-segment" style={{ width: `${setuju / total * 100}%`, background: 'var(--setuju)' }} />
        <div className="vote-bar-segment" style={{ width: `${abstain / total * 100}%`, background: 'var(--abstain)' }} />
        <div className="vote-bar-segment" style={{ width: `${tolak / total * 100}%`, background: 'var(--tolak)' }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        fontFamily: 'var(--font-ui)',
      }}>
        <span style={{ color: 'var(--setuju-text)' }}>{sPct}% setuju</span>
        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
        <span style={{ color: 'var(--abstain-text)' }}>{aPct}% abstain</span>
        <span style={{ color: 'var(--text-tertiary)' }}>·</span>
        <span style={{ color: 'var(--tolak-text)' }}>{tPct}% tolak</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// TASK 1.1 — Province node (now receives row/col context for curve)
// ------------------------------------------------------------------
interface NodeProps {
  province: typeof PROVINCES[0];
  voteStatus: 'setuju' | 'abstain' | 'tolak' | 'none';
  isSelected: boolean;
  isNew: boolean;
  onClick: () => void;
  // For arc curve: fraction 0..1 within the row (edge nodes dip down)
  rowFraction: number;
}

const NODE_VOTE_STYLE: Record<string, { bg: string; border: string; text: string }> = {
  setuju:  { bg: 'var(--setuju)',         border: 'var(--setuju-dim)',    text: '#fff' },
  abstain: { bg: 'var(--abstain)',         border: 'var(--abstain-dim)',   text: '#fff' },
  tolak:   { bg: 'var(--tolak)',           border: 'var(--tolak-dim)',     text: '#fff' },
  none:    { bg: 'var(--surface-2)',       border: 'var(--border-subtle)', text: 'var(--text-tertiary)' },
};

const ProvinceNode: React.FC<NodeProps> = ({
  province, voteStatus, isSelected, isNew, onClick, rowFraction,
}) => {
  const style = NODE_VOTE_STYLE[voteStatus];
  // Arc curve: nodes at edges (rowFraction near 0 or 1) get +marginTop
  // to simulate the hemicycle curve. Max sag = 8px at edges.
  const edgeness = Math.abs(rowFraction - 0.5) * 2; // 0 at center, 1 at edges
  const arcSag = edgeness * edgeness * 6; // 0px at center, 6px at edges (quadratic)

  return (
    <button
      onClick={onClick}
      aria-label={`${province.name} — ${voteStatus === 'none' ? 'belum bersuara' : voteStatus}`}
      style={{
        // Sizing — calculated for 9 nodes in 328px usable space, gap 6px:
        // (328 - 8*6) / 9 = (328-48)/9 = 31px. Use 30px to be safe.
        width: '30px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Touch target via padding trick — visually 30x26, tap target 44x44
        padding: '9px 7px',
        margin: '-9px -7px',
        boxSizing: 'content-box',
        background: isSelected ? 'var(--accent-primary-muted)' : style.bg,
        border: `1px solid ${isSelected ? 'var(--accent-primary)' : style.border}`,
        borderRadius: 'var(--radius-sm)',
        color: isSelected ? 'var(--accent-primary)' : style.text,
        fontFamily: 'var(--font-ui)',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.02em',
        cursor: 'pointer',
        opacity: voteStatus === 'none' ? 0.38 : 1,
        marginTop: `${arcSag}px`,
        transition: [
          'background var(--dur-normal) var(--ease-enter)',
          'border-color var(--dur-normal) var(--ease-enter)',
          'color var(--dur-normal) var(--ease-enter)',
          'opacity var(--dur-normal) var(--ease-enter)',
          'box-shadow var(--dur-normal) var(--ease-enter)',
        ].join(', '),
        boxShadow: isSelected
          ? '0 0 0 2px var(--accent-primary-muted)'
          : isNew
            ? '0 0 6px 1px var(--accent-primary-glow)'
            : 'none',
        flexShrink: 0,
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
      }}
      onPointerDown={e => { (e.currentTarget as HTMLElement).style.opacity = '0.7'; }}
      onPointerUp={e => { (e.currentTarget as HTMLElement).style.opacity = voteStatus === 'none' ? '0.38' : '1'; }}
      onPointerCancel={e => { (e.currentTarget as HTMLElement).style.opacity = voteStatus === 'none' ? '0.38' : '1'; }}
    >
      {province.short}
    </button>
  );
};

// ------------------------------------------------------------------
// TASK 3.5 — Suara Terbaru section (redesigned as contained card)
// ------------------------------------------------------------------
const SuaraTerbaru: React.FC<{ opinions: Opinion[] }> = ({ opinions }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const textOps = opinions.filter(o => o.text && o.text.trim().length > 0);

  useEffect(() => {
    if (textOps.length <= 1) return;
    const iv = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(p => (p + 1) % textOps.length);
        setVisible(true);
      }, 350);
    }, 4800);
    return () => clearInterval(iv);
  }, [textOps.length]);

  if (textOps.length === 0) return null;
  const op = textOps[idx % textOps.length];
  const voteColor =
    op.vote === 'setuju' ? 'var(--setuju-text)' :
    op.vote === 'tolak' ? 'var(--tolak-text)' :
    'var(--abstain-text)';
  const voteLabel =
    op.vote === 'setuju' ? 'Setuju' :
    op.vote === 'tolak' ? 'Tolak' :
    'Abstain';

  return (
    <div style={{
      margin: '12px 16px 0',
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
    }}>
      {/* Header row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
      }}>
        <span className="label-meta" style={{ color: 'var(--accent-primary)' }}>
          SUARA TERBARU
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: voteColor,
            display: 'inline-block',
            flexShrink: 0,
          }} />
          <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
            {op.provinsi}
          </span>
          <span style={{ fontSize: '11px', color: voteColor, fontFamily: 'var(--font-ui)', fontWeight: 600 }}>
            · {voteLabel}
          </span>
        </div>
      </div>

      {/* Quote */}
      <div style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 350ms var(--ease-inout)',
      }}>
        <div
          className="citizen-voice-sm"
          style={{
            fontSize: '14px',
            lineHeight: 1.55,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            marginBottom: '6px',
          }}
        >
          "{op.text}"
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
          — Warga {op.provinsi}
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------
// Main Room Screen
// ------------------------------------------------------------------
export const RoomScreen: React.FC = () => {
  const opinions = useDPNStore(s => s.opinions);
  const session = useDPNStore(s => s.activeSession);
  const userProvinsi = useDPNStore(s => s.userProvinsi);
  const setScreen = useDPNStore(s => s.setScreen);
  const setShowOnboarding = useDPNStore(s => s.setShowOnboarding);
  const hasVoted = useDPNStore(s => s.hasVoted);

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

  const provinceVotes = React.useMemo(() => buildProvinceVotes(opinions), [opinions]);
  const votes = session.votes;
  const totalOnline = opinions.length + 7;

  const selectedOpinion = selectedProv
    ? getLatestOpinionForProvince(opinions, selectedProv)
    : null;

  const handleNodeClick = (provName: string) => {
    setSelectedProv(prev => prev === provName ? null : provName);
  };

  const handleBicara = () => {
    setSelectedProv(null);
    if (!userProvinsi) {
      setShowOnboarding(true);
    } else {
      setScreen('speak');
    }
  };

  // Build the hemicycle rows by assigning provinces to rows
  // ROWS = [5, 7, 9, 9, 8] — innermost to outermost arc
  const rows: (typeof PROVINCES[0])[][] = [];
  let idx = 0;
  for (const count of ROWS) {
    rows.push(PROVINCES.slice(idx, idx + count));
    idx += count;
  }

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

      {/* ── TOP BAR ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: '48px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-faint)',
        background: 'var(--surface-0)',
      }}>
        <div>
          <span className="label-overline">DPN RI</span>
          <span style={{ color: 'var(--border-loud)', margin: '0 5px', fontSize: '10px' }}>·</span>
          <span className="label-overline" style={{ color: 'var(--text-tertiary)' }}>
            SIDANG AKTIF
          </span>
        </div>
        <LiveCounter count={totalOnline} onArchive={() => setScreen('archive')} />
      </div>

      {/* ── SESSION TITLE ── */}
      <div style={{
        padding: '12px 16px 10px',
        flexShrink: 0,
        borderBottom: '1px solid var(--border-faint)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            background: 'var(--surface-3)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            letterSpacing: '0.04em',
          }}>
            #{session.nomor}
          </span>
          <span className="badge badge-aktif">Aktif</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '17px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.3,
          marginBottom: '3px',
        }}>
          {session.judul}
        </h2>
        <p style={{
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          lineHeight: 1.4,
          fontStyle: 'italic',
          fontFamily: 'var(--font-display)',
        }}>
          {session.pertanyaan}
        </p>
      </div>

      {/* ── SCROLLABLE CONTENT ── */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>

        {/* Podium area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 16px 8px',
          background: `radial-gradient(ellipse 55% 45% at 50% 30%, rgba(201,185,122,0.05) 0%, transparent 70%)`,
        }}>
          <PodiumSVG />
          <div style={{ marginTop: '10px' }}>
            <VoteSummaryBar
              setuju={votes.setuju}
              abstain={votes.abstain}
              tolak={votes.tolak}
            />
          </div>
          <div style={{
            marginTop: '4px',
            fontSize: '10px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
          }}>
            {opinions.length} suara tercatat
          </div>
        </div>

        {/* ── HEMICYCLE NODE GRID ── TASK 1.1 */}
        {/* 
          Layout: rows of flex items, each row centered.
          Nodes are 30px wide, gap is 6px between them.
          Longest row = 9 nodes: 9×30 + 8×6 = 270+48 = 318px < 328px usable. ✓
          rowFraction drives the arc curve (marginTop on edge nodes).
        */}
        <div style={{
          padding: '8px 16px 4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {/* Subtle arc guide lines SVG behind nodes */}
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
              {rows.map((rowProvs, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '6px',
                    // Row spacing increases slightly for outer rows (more arc depth)
                    marginBottom: rowIdx < ROWS.length - 1 ? '6px' : '0',
                    // Outer rows indent more to reinforce hemicycle feel
                    paddingLeft: `${Math.max(0, (9 - rowProvs.length) * 2)}px`,
                    paddingRight: `${Math.max(0, (9 - rowProvs.length) * 2)}px`,
                    // Align items to bottom so arc curve works via marginTop on nodes
                    alignItems: 'flex-start',
                  }}
                >
                  {rowProvs.map((prov, colIdx) => {
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
                  flexShrink: 0,
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

        {/* ── SUARA TERBARU ── TASK 3.5 */}
        <SuaraTerbaru opinions={opinions} />

        {/* Bottom spacer */}
        <div style={{ height: '16px' }} />
      </div>

      {/* ── BOTTOM BAR ── TASK 3.3: simplified, single CTA */}
      <RoomBottomBar onBicara={handleBicara} hasVoted={hasVoted} />

      {/* ── BOTTOM SHEET ── */}
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
