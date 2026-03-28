import React, { useState, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { DPNvsDPRCard } from '../ShareCard/DPNvsDPRCard';
import { EmptyState } from '../Common/EmptyState';
import type { Session, Opinion, DPNState } from '../../types';

// --- Sub-components for Archive ---

interface OpinionCardProps {
  op: Opinion;
}

const OpinionCard: React.FC<OpinionCardProps> = ({ op }: OpinionCardProps) => (
  <div style={{
    padding: '16px',
    background: 'var(--surface-1)',
    border: '1px solid var(--surface-3)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
         <span style={{
           width: '6px', height: '6px', borderRadius: '50%',
           background: `var(--${op.vote})`
         }} />
         <span style={{ 
           fontSize: '11px', 
           fontWeight: 600, 
           color: 'var(--text-secondary)', 
           fontFamily: 'var(--font-ui)',
           textTransform: 'uppercase',
           letterSpacing: '0.04em'
         }}>
           {op.provinsi} · {op.vote}
         </span>
      </div>
      <span style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
        {op.nomorDokumen}
      </span>
    </div>
    <blockquote style={{ 
      fontSize: '15px', 
      color: 'var(--text-primary)', 
      lineHeight: 1.5, 
      fontFamily: 'var(--font-display)',
      fontStyle: 'italic',
      margin: 0
    }}>
      "{op.text}"
    </blockquote>
    <div style={{ 
      fontSize: '11px', 
      color: 'var(--text-tertiary)', 
      fontFamily: 'var(--font-ui)'
    }}>
      — Warga {op.provinsi} · {new Date(op.createdAt).toLocaleDateString('id-ID')}
    </div>
  </div>
);

interface SessionRowProps {
  session: Session;
  onViewComparison?: () => void;
}

const SessionRow: React.FC<SessionRowProps> = ({ session, onViewComparison }: SessionRowProps) => (
  <div style={{
    padding: '16px',
    background: 'var(--surface-1)',
    border: '1px solid var(--surface-3)',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  }}>
    <div style={{ flex: 1 }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        color: 'var(--accent)', 
        marginBottom: '4px',
        fontFamily: 'var(--font-ui)',
        letterSpacing: '0.08em'
      }}>
        SIDANG #{session.nomor.toString().padStart(3, '0')}
      </div>
      <h4 style={{ 
        fontSize: '16px', 
        color: 'var(--text-primary)', 
        fontWeight: 400,
        fontFamily: 'var(--font-display)',
        margin: 0
      }}>
        {session.judul}
      </h4>
      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontFamily: 'var(--font-ui)' }}>
        {new Date(session.openedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </div>
    {onViewComparison && (
      <button
        onClick={onViewComparison}
        style={{
          background: 'none',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-ui)',
          whiteSpace: 'nowrap'
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
  const [search, setSearch] = useState('');
  const [viewDPNvsDPR, setViewDPNvsDPR] = useState<Session | null>(null);

  const filteredOpinions = useMemo(() => {
    let list = [...opinions].reverse();
    if (filterVote.length > 0) list = list.filter(o => filterVote.includes(o.vote));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(o => o.text?.toLowerCase().includes(q) || o.provinsi.toLowerCase().includes(q));
    }
    return list;
  }, [opinions, filterVote, search]);

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
          maxWidth: '500px',
          margin: '0 auto',
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          padding: '8px 16px 0',
          borderBottom: '1px solid var(--surface-3)',
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
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            ← Kembali ke Sidang
          </button>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent)',
            fontFamily: 'var(--font-ui)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '4px'
          }}>
            ARSIP NASIONAL
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 400,
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            margin: '0 0 16px',
          }}>
            Risalah Sidang DPN RI
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex' }}>
            {(['pendapat', 'putusan'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: `2px solid ${tab === t ? 'var(--accent)' : 'transparent'}`,
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
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
            {/* Filter bar */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid var(--surface-3)',
              flexShrink: 0,
            }}>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: '4px'
              }}>
                {(['all', 'setuju', 'abstain', 'tolak'] as const).map(v => {
                  const isActive = v === 'all' ? filterVote.length === 0 : filterVote.includes(v);
                  return (
                    <button
                      key={v}
                      onClick={() => v === 'all' ? setFilterVote([]) : toggleVoteFilter(v)}
                      style={{
                        flexShrink: 0,
                        height: '32px',
                        padding: '0 14px',
                        borderRadius: 'var(--radius-sm)',
                        background: isActive ? 'var(--accent)' : 'var(--surface-2)',
                        color: isActive ? 'var(--surface-0)' : 'var(--text-secondary)',
                        fontFamily: 'var(--font-ui)',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    >
                      {v === 'all' ? 'Semua' : v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredOpinions.length > 0 ? (
                filteredOpinions.map((op: Opinion) => (
                  <OpinionCard key={op.id} op={op} />
                ))
              ) : (
                <EmptyState 
                  title="Tidak ada pendapat dengan filter ini."
                  subtitle="Coba ubah filter atau jadi yang pertama bersuara."
                />
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

      {viewDPNvsDPR && (
        <DPNvsDPRCard
          session={viewDPNvsDPR}
          onClose={() => setViewDPNvsDPR(null)}
        />
      )}
    </>
  );
};
