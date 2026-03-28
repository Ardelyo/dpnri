import React, { useState, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES } from '../../constants/provinces';
import { DPNvsDPRCard } from '../ShareCard/DPNvsDPRCard';
import type { Session, Opinion, DPNState } from '../../types';

// --- Sub-components for Archive ---

interface OpinionCardProps {
  op: Opinion;
}

const OpinionCard: React.FC<OpinionCardProps> = ({ op }: OpinionCardProps) => (
  <div style={{
    padding: '12px 14px',
    background: 'var(--surface-1)',
    border: '1px solid var(--surface-3)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    cursor: 'default',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
         <div style={{
           width: '10px', height: '10px', borderRadius: '50%',
           background: op.vote === 'setuju' ? '#27AE60' : op.vote === 'tolak' ? '#C0392B' : '#F1C40F'
         }} />
         <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>
           {op.provinsi.toUpperCase()}
         </span>
      </div>
      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-display)' }}>
        #{op.id}
      </span>
    </div>
    <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.4, fontFamily: 'var(--font-ui)' }}>
      {op.text}
    </div>
    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px', fontStyle: 'italic' }}>
      {new Date(op.createdAt).toLocaleString('id-ID')}
    </div>
  </div>
);

interface SessionRowProps {
  session: Session;
  onViewComparison?: () => void;
}

const SessionRow: React.FC<SessionRowProps> = ({ session, onViewComparison }: SessionRowProps) => (
  <div style={{
    padding: '14px 16px',
    background: 'var(--surface-1)',
    border: '1px solid var(--surface-3)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}>
    <div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '2px' }}>
        SIDANG #{session.nomor}
      </div>
      <div style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500 }}>
        {session.judul}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
        {new Date(session.openedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
    {onViewComparison && (
      <button
        onClick={onViewComparison}
        style={{
          background: 'none',
          border: '1px solid var(--accent-primary)',
          color: 'var(--accent-primary)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
        }}
      >
        Lihat Putusan
      </button>
    )}
  </div>
);

// --- Main Archive Screen ---
export const ArchiveScreen: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const opinions = useDPNStore((s: DPNState) => s.opinions);
  const pastSessions = useDPNStore((s: DPNState) => s.pastSessions);
  const activeSession = useDPNStore((s: DPNState) => s.activeSession);

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
    setFilterVote((prev: string[]) => prev.includes(v) ? prev.filter((x: string) => x !== v) : [...prev, v]);
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
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
                  onFocus={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; }}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => { e.currentTarget.style.borderColor = 'var(--surface-3)'; }}
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterProv(e.target.value)}
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
                filteredOpinions.map((op: Opinion) => (
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
            {allSessions.map((s: Session) => (
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
