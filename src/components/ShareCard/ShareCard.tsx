import React, { useRef } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import type { DPNState, Opinion } from '../../types';

interface ShareCardProps {
  opinion: Opinion | null;
  onClose: () => void;
}

export const ShareCard: React.FC<ShareCardProps> = ({ opinion, onClose }) => {
  const session = useDPNStore((s: DPNState) => s.activeSession);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!opinion) return null;

  const total = session.votes.setuju + session.votes.abstain + session.votes.tolak;
  const pSetuju = Math.round((session.votes.setuju / total) * 100);
  const pAbstain = Math.round((session.votes.abstain / total) * 100);
  const pTolak = 100 - pSetuju - pAbstain;

  const handleShare = () => {
    // Basic share implementation (to be replaced with html-to-image if needed)
    if (navigator.share) {
      navigator.share({
        title: 'Suara Rakyat - DPN RI',
        text: `Saya baru saja menyampaikan pendapat di DPN RI mengenai ${session.judul}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert('Tautan disalin ke papan klip!');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Mini Poster Card */}
      <div 
        ref={cardRef}
        style={{
          width: '100%',
          maxWidth: '340px',
          aspectRatio: '3/4',
          background: 'var(--surface-1)',
          border: '1px solid rgba(184, 164, 114, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            DEWAN PERWAKILAN NETIZEN
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
            Sidang #{session.nomor.toString().padStart(3, '0')} · {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(184, 164, 114, 0.15)', margin: '8px 0 24px' }} />

        {/* Focal Point: Quote or Statement */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {opinion.text ? (
            <div style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '17px', 
              fontStyle: 'italic', 
              color: 'var(--text-primary)', 
              lineHeight: 1.5,
              textAlign: 'left'
            }}>
              "{opinion.text}"
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '17px', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {session.judul}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                {session.pertanyaan}
              </div>
            </div>
          )}
          
          <div style={{ marginTop: '20px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>
              Warga {opinion.provinsi}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: `var(--${opinion.vote})` }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: `var(--${opinion.vote})`, textTransform: 'capitalize' }}>
                {opinion.vote}
              </span>
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(184, 164, 114, 0.1) martign', margin: '24px 0 16px' }} />

        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1px', 
          background: 'rgba(184, 164, 114, 0.05)',
          border: '1px solid rgba(184, 164, 114, 0.1)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          {[
            { label: 'Setuju',  val: pSetuju, color: 'var(--setuju)' },
            { label: 'Abstain', val: pAbstain, color: 'var(--abstain)' },
            { label: 'Tolak',   val: pTolak, color: 'var(--tolak)' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'var(--surface-2)', padding: '10px 4px', textAlign: 'center' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: stat.color, fontFamily: 'var(--font-ui)' }}>{stat.val}%</div>
              <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-ui)' }}>
            dpn.id/sidang/{session.nomor}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            Tersimpan permanen.
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ width: '100%', maxWidth: '340px', marginTop: '32px' }}>
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--accent)',
            color: 'var(--surface-0)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          ↗ Bagikan
        </button>
        <button
          onClick={() => {
            onClose();
            useDPNStore.getState().setScreen('map');
          }}
          style={{
            width: '100%',
            height: '48px',
            background: 'rgba(201, 162, 39, 0.15)',
            color: 'var(--accent)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--accent)',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '12px',
          }}
        >
          🌏 Lihat Peta Suara Nasional
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
            marginTop: '16px',
            cursor: 'pointer',
          }}
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
