import React, { useState } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES } from '../../constants/provinces';

// Simplified province positions for the map grid visualization
const PROVINCE_GRID: { name: string; row: number; col: number }[] = [
  { name: "Aceh", row: 0, col: 0 },
  { name: "Sumatera Utara", row: 0, col: 1 },
  { name: "Riau", row: 0, col: 2 },
  { name: "Kep. Riau", row: 0, col: 3 },
  { name: "Kalimantan Barat", row: 0, col: 5 },
  { name: "Kalimantan Utara", row: 0, col: 6 },
  { name: "Sulawesi Utara", row: 0, col: 8 },
  { name: "Gorontalo", row: 0, col: 9 },
  { name: "Maluku Utara", row: 0, col: 10 },
  
  { name: "Sumatera Barat", row: 1, col: 0 },
  { name: "Jambi", row: 1, col: 1 },
  { name: "Kep. Bangka Belitung", row: 1, col: 2 },
  { name: "Kalimantan Tengah", row: 1, col: 5 },
  { name: "Kalimantan Timur", row: 1, col: 6 },
  { name: "Sulawesi Tengah", row: 1, col: 8 },
  { name: "Sulawesi Barat", row: 1, col: 9 },
  { name: "Papua Barat", row: 1, col: 11 },

  { name: "Bengkulu", row: 2, col: 0 },
  { name: "Sumatera Selatan", row: 2, col: 1 },
  { name: "Lampung", row: 2, col: 2 },
  { name: "Banten", row: 2, col: 3 },
  { name: "DKI Jakarta", row: 2, col: 4 },
  { name: "Kalimantan Selatan", row: 2, col: 5 },
  { name: "Sulawesi Selatan", row: 2, col: 8 },
  { name: "Sulawesi Tenggara", row: 2, col: 9 },
  { name: "Maluku", row: 2, col: 10 },
  { name: "Papua", row: 2, col: 11 },

  { name: "Jawa Barat", row: 3, col: 3 },
  { name: "Jawa Tengah", row: 3, col: 4 },
  { name: "DI Yogyakarta", row: 3, col: 5 },
  { name: "Jawa Timur", row: 3, col: 6 },
  { name: "Bali", row: 3, col: 7 },
  { name: "Nusa Tenggara Barat", row: 3, col: 8 },
  { name: "Nusa Tenggara Timur", row: 3, col: 9 },
];

function getVoteColor(setuju: number, tolak: number, abstain: number): string {
  const total = setuju + tolak + abstain;
  if (total === 0) return '#8A9BA8';
  const setujuPct = setuju / total;
  const tolakPct = tolak / total;
  if (Math.abs(setujuPct - tolakPct) < 0.05) return '#8A9BA8';
  if (setujuPct > tolakPct) {
    const intensity = Math.min(1, (setujuPct - 0.5) * 3 + 0.3);
    const r = Math.round(39 + (255 - 39) * (1 - intensity));
    const g = Math.round(174 + (255 - 174) * (1 - intensity));
    const b = Math.round(96 + (255 - 96) * (1 - intensity));
    return `rgb(${r},${g},${b})`;
  }
  const intensity = Math.min(1, (tolakPct - 0.5) * 3 + 0.3);
  const r = Math.round(192 + (255 - 192) * (1 - intensity));
  const g = Math.round(57 + (255 - 57) * (1 - intensity));
  const b = Math.round(43 + (255 - 43) * (1 - intensity));
  return `rgb(${r},${g},${b})`;
}

interface Props {
  fullscreen?: boolean;
  onClose?: () => void;
}

export const IndonesiaMap: React.FC<Props> = ({ fullscreen = false, onClose }) => {
  const opinions = useDPNStore(s => s.opinions);
  const [selected, setSelected] = useState<string | null>(null);

  // Build votes by province
  const votesByProv: Record<string, { setuju: number; abstain: number; tolak: number; total: number }> = {};
  PROVINCES.forEach(p => { votesByProv[p.name] = { setuju: 0, abstain: 0, tolak: 0, total: 0 }; });
  opinions.forEach(op => {
    if (votesByProv[op.provinsi]) {
      votesByProv[op.provinsi][op.vote]++;
      votesByProv[op.provinsi].total++;
    }
  });

  const selectedData = selected ? votesByProv[selected] : null;

  if (!fullscreen) {
    // Thumbnail version — with label
    return (
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          bottom: '180px',
          right: '8px',
          width: '82px',
          background: 'rgba(10,7,0,0.92)',
          border: '1px solid rgba(201,162,39,0.25)',
          borderRadius: '8px',
          padding: '5px 5px 4px',
          cursor: 'pointer',
          zIndex: 9,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3px',
        }}
      >
        <div style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '0.5px',
        }}>
          {PROVINCE_GRID.map(pg => {
            const data = votesByProv[pg.name];
            const color = data ? getVoteColor(data.setuju, data.tolak, data.abstain) : '#333';
            return (
              <div
                key={pg.name}
                style={{
                  gridRow: pg.row + 1,
                  gridColumn: pg.col + 1,
                  background: color,
                  borderRadius: '1px',
                  opacity: data && data.total > 0 ? 1 : 0.3,
                  aspectRatio: '1',
                }}
              />
            );
          })}
        </div>
        <div style={{
          fontSize: '6px',
          color: '#C9A227',
          fontWeight: 700,
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}>
          PETA SUARA
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0700',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#8A7A60',
            fontSize: '13px',
            cursor: 'pointer',
            padding: '4px 0',
            marginBottom: '4px',
          }}
        >
          ← Kembali
        </button>
        <div style={{
          fontSize: '7px',
          letterSpacing: '2px',
          color: '#C9A227',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}>
          PETA SUARA NASIONAL
        </div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '16px',
          color: '#F0E6D0',
          fontWeight: 700,
          margin: '4px 0 0',
        }}>
          Distribusi Suara per Provinsi
        </h1>
      </div>

      {/* Map grid */}
      <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(4, 1fr)',
          gap: '3px',
          maxWidth: '400px',
          margin: '0 auto',
          width: '100%',
        }}>
          {PROVINCE_GRID.map(pg => {
            const data = votesByProv[pg.name];
            const color = data ? getVoteColor(data.setuju, data.tolak, data.abstain) : '#333';
            const isSelected = selected === pg.name;
            const prov = PROVINCES.find(p => p.name === pg.name);
            return (
              <div
                key={pg.name}
                onClick={() => setSelected(isSelected ? null : pg.name)}
                style={{
                  gridRow: pg.row + 1,
                  gridColumn: pg.col + 1,
                  background: color,
                  borderRadius: '4px',
                  aspectRatio: '1',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid #C9A227' : '1px solid rgba(255,255,255,0.1)',
                  opacity: data && data.total > 0 ? 1 : 0.4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 150ms ease',
                }}
              >
                <span style={{
                  fontSize: '6px',
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.6)',
                }}>
                  {prov?.short}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginTop: '16px',
          fontSize: '9px',
          color: '#8A7A60',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', background: '#27AE60', borderRadius: '2px' }} />
            Setuju
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', background: '#8A9BA8', borderRadius: '2px' }} />
            Berimbang
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', background: '#C0392B', borderRadius: '2px' }} />
            Tolak
          </div>
        </div>

        {/* Selected province popup */}
        {selected && selectedData && (
          <div
            className="animate-fade-in"
            style={{
              marginTop: '16px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,162,39,0.2)',
              borderRadius: '10px',
              padding: '12px 16px',
              maxWidth: '300px',
              margin: '16px auto 0',
              width: '100%',
            }}
          >
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              color: '#F0E6D0',
              fontWeight: 700,
              marginBottom: '8px',
            }}>
              {selected}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Setuju', val: selectedData.setuju, color: '#27AE60' },
                { label: 'Abstain', val: selectedData.abstain, color: '#8A9BA8' },
                { label: 'Tolak', val: selectedData.tolak, color: '#C0392B' },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '6px',
                  background: 'rgba(0,0,0,0.2)',
                  borderRadius: '6px',
                }}>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: s.color,
                  }}>
                    {selectedData.total > 0 ? (s.val / selectedData.total * 100).toFixed(0) : 0}%
                  </div>
                  <div style={{ fontSize: '8px', color: '#8A7A60' }}>
                    {s.label} ({s.val})
                  </div>
                </div>
              ))}
            </div>
            <div style={{
              fontSize: '9px',
              color: '#8A7A60',
              marginTop: '6px',
              textAlign: 'center',
            }}>
              {selectedData.total} pendapat dari provinsi ini
            </div>
          </div>
        )}
      </div>

      {/* Share button */}
      <div style={{
        padding: '12px 16px',
        flexShrink: 0,
      }}>
        <button
          onClick={async () => {
            const text = `Peta Suara DPN RI — Distribusi pendapat rakyat Indonesia\n\nhttps://dpn.id/peta`;
            if (navigator.share) {
              try { await navigator.share({ title: 'Peta Suara DPN RI', text }); } catch {}
            } else {
              await navigator.clipboard.writeText(text);
              alert('Tersalin!');
            }
          }}
          style={{
            width: '100%',
            padding: '13px',
            background: 'linear-gradient(135deg, #C9A227 0%, #8B6010 100%)',
            border: 'none',
            borderRadius: '10px',
            color: '#1a1200',
            fontWeight: 800,
            fontSize: '13px',
            fontFamily: 'Georgia, serif',
            cursor: 'pointer',
          }}
        >
          📤 Bagikan Peta
        </button>
      </div>
    </div>
  );
};
