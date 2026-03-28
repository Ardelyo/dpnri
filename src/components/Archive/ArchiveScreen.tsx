import React, { useState, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES } from '../../constants/provinces';
import { DPNvsDPRCard } from '../ShareCard/DPNvsDPRCard';
import type { Session, Opinion } from '../../store/dpnStore';

// --- Vote display helpers ---
const VOTE_BORDER: Record<string, string> = {
  setuju:  'var(--setuju)',
  abstain: 'var(--abstain)',
  tolak:   'var(--tolak)',
};
const VOTE_TEXT: Record<string, string> = {
  setuju:  'var(--setuju-text)',
  abstain: 'var(--abstain-text)',
  tolak:   'var(--tolak-text)',
};
const VOTE_LABEL_FULL: Record<string, string> = {
  setuju: 'Setuju',
  abstain: 'Abstain',
  tolak: 'Tolak',
};

// --- Session status helpers ---
function getSessionStatusDisplay(s: Session) {
  if (s.status === 'aktif') {
    return { label: 'AKTIF', color: 'var(--accent-primary)', bg: 'var(--accent-primary-muted)', borderColor: 'rgba(201,185,122,0.2)' };
  }
  const putusan = s.putusanDPN;
  if (putusan === 'setuju') {
    return { label: 'SETUJU', color: 'var(--setuju-text)', bg: 'var(--setuju-muted)', borderColor: 'rgba(90,138,106,0.2)' };
  }
  if (putusan === 'tolak') {
    return { label: 'DITOLAK', color: 'var(--tolak-text)', bg: 'var(--tolak-muted)', borderColor: 'rgba(138,64,64,0.2)' };
  }
  return { label: 'SELESAI', color: 'var(--text-secondary)', bg: 'var(--surface-3)', borderColor: 'var(--border-subtle)' };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatNum(n: number) {
  return n.toLocaleString('id-ID');
}

// --- Stacked vote bar ---
interface VoteBarProps {
  setuju: number;
  abstain: number;
  tolak: number;
  compact?: boolean;
}
const VoteBar: React.FC<VoteBarProps> = ({ setuju, abstain, tolak, compact }) => {
  const total = setuju + abstain + tolak || 1;
  const sPct = (setuju / total * 100).toFixed(0);
  const aPct = (abstain / total * 100).toFixed(0);
  const tPct = (tolak / total * 100).toFixed(0);
  return (
    <div>
      <div className="vote-bar-track" style={{ marginBottom: compact ? '4px' : '6px' }}>
        <div className="vote-bar-segment" style={{ width: `${setuju / total * 100}%`, background: 'var(--setuju)' }} />
        <div className="vote-bar-segment" style={{ width: `${abstain / total * 100}%`, background: 'var(--abstain)' }} />
        <div className="vote-bar-segment" style={{ width: `${tolak / total * 100}%`, background: 'var(--tolak)' }} />
      </div>
      <div style={{
        display: 'flex',
        gap: '8px',
        fontSize: '11px',
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

// --- Opinion card ---
const OpinionCard: React.FC<{ op: Opinion }> = ({ op }) => (
  <div style={{
    background: 'var(--surface-1)',
    border: '1px solid var(--border-subtle)',
    borderLeft: `2px solid ${VOTE_BORDER[op.vote] || 'var(--border-mid)'}`,
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
  }}>
    {/* Header row */}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: op.text ? '10px' : '0',
    }}>
      <span style={{
        fontSize: '13px',
        fontWeight: 600,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-ui)',
      }}>
        {op.provinsi}
      </span>
      <span style={{
        fontSize: '11px',
        fontWeight: 700,
        color: VOTE_TEXT[op.vote] || 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
      }}>
        {VOTE_LABEL_FULL[op.vote]}
      </span>
    </div>

    {/* Quote */}
    {op.text ? (
      <div
        className="citizen-voice-sm"
        style={{ marginBottom: '10px' }}
      >
        "{op.text}"
      </div>
    ) : (
      <div style={{
        fontSize: '12px',
        fontStyle: 'italic',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-display)',
        marginBottom: '10px',
      }}>
        Memilih tanpa kata.
      </div>
    )}

    {/* Meta */}
    <div style={{
      fontSize: '10px',
      color: 'var(--text-tertiary)',
      fontFamily: 'var(--font-ui)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '0.02em',
    }}>
      {op.nomorDokumen} &nbsp;·&nbsp; {formatDate(op.createdAt)}
    </div>
  </div>
);

// --- Session row ---
interface SessionRowProps {
  session: Session;
  onViewComparison?: () => void;
}
const SessionRow: React.FC<SessionRowProps> = ({ session, onViewComparison }) => {
  const status = getSessionStatusDisplay(session);
  const leftBorderColor = session.status === 'aktif'
    ? 'var(--accent-primary)'
    : session.putusanDPN === 'setuju'
      ? 'var(--setuju)'
      : session.putusanDPN === 'tolak'
        ? 'var(--tolak)'
        : 'var(--border-mid)';

  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderLeft: `3px solid ${leftBorderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
    }}>
      {/* Top row: number badge + status + date */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-tertiary)',
            background: 'var(--surface-3)',
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
          }}>
            #{session.nomor}
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 700,
            color: status.color,
            background: status.bg,
            border: `1px solid ${status.borderColor}`,
            borderRadius: 'var(--radius-sm)',
            padding: '2px 6px',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            {session.status === 'aktif' && (
              <span
                className="animate-pulse-live"
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'currentColor',
                  display: 'inline-block',
                }}
              />
            )}
            {status.label}
          </span>
        </div>
        <span style={{
          fontSize: '11px',
          color: 'var(--text-tertiary)',
          fontFamily: 'var(--font-ui)',
        }}>
          {formatDate(session.openedAt)}
        </span>
      </div>

      {/* Title */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '16px',
        fontWeight: 400,
        color: 'var(--text-primary)',
        lineHeight: 1.3,
        marginBottom: '12px',
      }}>
        {session.judul}
      </div>

      {/* Vote bar */}
      <VoteBar
        setuju={session.votes.setuju}
        abstain={session.votes.abstain}
        tolak={session.votes.tolak}
      />

      {/* Total suara */}
      <div style={{
        fontSize: '11px',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-ui)',
        marginTop: '6px',
      }}>
        {formatNum(session.totalPendapat)} suara tercatat
      </div>

      {/* DPR comparison callout */}
      {session.putusanDPR && onViewComparison && (
        <button
          onClick={onViewComparison}
          style={{
            marginTop: '12px',
            width: '100%',
            background: 'var(--surface-2)',
            border: '1px solid var(--border-mid)',
            borderLeft: `2px solid var(--accent-primary)`,
            borderRadius: 'var(--radius-sm)',
            padding: '10px 12px',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            textAlign: 'left',
          }}
        >
          <div>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              fontWeight: 600,
            }}>
              Keputusan DPR
            </div>
            <div style={{
              fontSize: '13px',
              color: 'var(--text-body)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 500,
            }}>
              {session.putusanDPR}
            </div>
          </div>
          <span style={{
            fontSize: '11px',
            color: 'var(--accent-primary)',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            flexShrink: 0,
            marginLeft: '8px',
          }}>
            Lihat perbandingan →
          </span>
        </button>
      )}
    </div>
  );
};

// --- Main Archive Screen ---
export const ArchiveScreen: React.FC = () => {
  const setScreen = useDPNStore(s => s.setScreen);
  const opinions = useDPNStore(s => s.opinions);
  const pastSessions = useDPNStore(s => s.pastSessions);
  const activeSession = useDPNStore(s => s.activeSession);

  const [tab, setTab] = useState<'pendapat' | 'putusan'>('pendapat');
  const [filterVote, setFilterVote] = useState<string[]>([]);
  const [filterProv, setFilterProv] = useState<string>('');
  const [search, setSearch] = useState('');
  const [viewDPNvsDPR, setViewDPNvsDPR] = useState<Session | null>(null);

  const filteredOpinions = useMemo(() => {
    let list = [...opinions].reverse();
    if (filterVote.length > 0) list = list.filter(o => filterVote.includes(o.vote));
    if (filterProv) list = list.filter(o => o.provinsi === filterProv);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => o.text?.toLowerCase().includes(q) || o.provinsi.toLowerCase().includes(q));
    }
    return list;
  }, [opinions, filterVote, filterProv, search]);

  const allSessions = [activeSession, ...pastSessions];

  const toggleVoteFilter = (v: string) => {
    setFilterVote(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]);
  };

  return (
    <>
      <div
        className="animate-fade-in"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--surface-0)',
          zIndex: 30,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '12px 16px 0',
          borderBottom: '1px solid var(--border-faint)',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setScreen('room')}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '14px',
              fontFamily: 'var(--font-ui)',
              cursor: 'pointer',
              padding: '10px 0',
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ← Kembali ke Sidang
          </button>
          <div className="label-overline" style={{ marginBottom: '4px' }}>ARSIP NASIONAL</div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '20px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: '14px',
          }}>
            Risalah Sidang DPN RI
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0' }}>
            {(['pendapat', 'putusan'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t ? 'var(--accent-primary)' : 'transparent'}`,
                  color: tab === t ? 'var(--accent-primary)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'color var(--dur-normal), border-color var(--dur-normal)',
                  letterSpacing: '0.02em',
                }}
              >
                {t === 'pendapat' ? 'Semua Pendapat' : 'Putusan Resmi'}
              </button>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        {tab === 'pendapat' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {/* TASK 3.1 — Filter bar: compact search + unified chips */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-faint)',
              flexShrink: 0,
            }}>
              {/* Search bar — height 40px */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{
                    position: 'absolute', left: '10px', top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                    pointerEvents: 'none',
                  }}
                  aria-hidden="true"
                >
                  <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.2" />
                  <line x1="9.5" y1="9.5" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari pendapat..."
                  style={{
                    width: '100%',
                    height: '40px',
                    background: 'var(--surface-1)',
                    border: '1px solid var(--surface-3)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '14px',
                    fontStyle: 'italic',
                    padding: '0 12px 0 32px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 200ms ease-out',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'var(--surface-3)'; }}
                />
              </div>

              {/* TASK 3.1 — Unified chips row (all same style) */}
              {/* At 360px: 5 chips × ~58px + 4×6px gap = 314px — fits in 328px usable */}
              <div style={{
                display: 'flex',
                gap: '6px',
                marginBottom: '10px',
                overflowX: 'auto',
                // Hide scrollbar
                scrollbarWidth: 'none',
              }}>
                {/* "Semua" chip */}
                {(['all', 'setuju', 'abstain', 'tolak'] as const).map(v => {
                  const isAll = v === 'all';
                  const isActive = isAll
                    ? filterVote.length === 0
                    : filterVote.includes(v);
                  const label = isAll ? 'Semua' : v.charAt(0).toUpperCase() + v.slice(1);
                  return (
                    <button
                      key={v}
                      onClick={() => {
                        if (isAll) setFilterVote([]);
                        else toggleVoteFilter(v);
                      }}
                      style={{
                        flexShrink: 0,
                        height: '32px',
                        padding: '0 14px',
                        borderRadius: 'var(--radius-sm)',
                        border: isActive ? '1px solid var(--accent-primary)' : '1px solid transparent',
                        background: isActive ? 'var(--accent-primary)' : 'var(--surface-2)',
                        color: isActive ? 'var(--surface-0)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '12px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 150ms ease-out, border-color 150ms ease-out, color 150ms ease-out',
                        outline: 'none',
                        WebkitTapHighlightColor: 'transparent',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}

                {/* Province — same chip style with ▾ */}
                <select
                  value={filterProv}
                  onChange={e => setFilterProv(e.target.value)}
                  style={{
                    flexShrink: 0,
                    height: '32px',
                    padding: '0 8px',
                    borderRadius: 'var(--radius-sm)',
                    border: filterProv ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    background: filterProv ? 'var(--accent-primary)' : 'var(--surface-2)',
                    color: filterProv ? 'var(--surface-0)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    outline: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <option value="">▾ Semua Provinsi</option>
                  {PROVINCES.map(p => (
                    <option key={p.name} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* TASK 3.1 — Counter row */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                }}>
                  {filteredOpinions.length} pendapat tercatat
                  {(filterVote.length > 0 || filterProv || search) && (
                    <button
                      onClick={() => { setFilterVote([]); setFilterProv(''); setSearch(''); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent-primary)',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginLeft: '8px',
                        padding: 0,
                      }}
                    >
                      Reset
                    </button>
                  )}
                </span>
                <span style={{
                  fontSize: '12px',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                }}>
                  Tersimpan permanen.
                </span>
              </div>
            </div>

            {/* Opinion list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredOpinions.length > 0 ? (
                filteredOpinions.map(op => (
                  <OpinionCard key={op.id} op={op} />
                ))
              ) : (
                <div style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '14px',
                  fontStyle: 'italic',
                }}>
                  Belum ada pendapat dengan filter ini.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Putusan tab */
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {allSessions.map(s => (
              <SessionRow
                key={s.id}
                session={s}
                onViewComparison={s.putusanDPR ? () => setViewDPNvsDPR(s) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* DPN vs DPR modal */}
      {viewDPNvsDPR && (
        <DPNvsDPRCard
          session={viewDPNvsDPR}
          onClose={() => setViewDPNvsDPR(null)}
        />
      )}
    </>
  );
};
