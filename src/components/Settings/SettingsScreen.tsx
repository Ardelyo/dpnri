import React, { useState } from 'react';
import { useUserStore } from '../../store/useUserStore';
import { useDPNStore } from '../../store/dpnStore';
import type { VoteRecord } from '../../store/useUserStore';
import { LegalSheet, LegalDocType } from './LegalDocs';

// ─── Vote Receipt Bottom Sheet ────────────────────────────────────────────
interface VoteReceiptSheetProps {
  voteRecord: VoteRecord & { sidangNomor: string };
  onClose: () => void;
  onShare?: () => void;
}

const voteColors: Record<string, string> = {
  setuju: 'var(--setuju)',
  abstain: 'var(--abstain)',
  tolak: 'var(--tolak)',
};

const voteLabels: Record<string, string> = {
  setuju: 'Setuju',
  abstain: 'Abstain',
  tolak: 'Tolak',
};

export const VoteReceiptSheet: React.FC<VoteReceiptSheetProps> = ({ voteRecord, onClose, onShare }) => {
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Kartu Suara DPN',
        text: `Suaraku di Sidang #${voteRecord.sidangNomor}: ${voteLabels[voteRecord.position]}. "${voteRecord.opinionText}"`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(voteRecord.voteId).then(() => {
        useUserStore.getState().showToast('Vote ID disalin ke clipboard', 'success');
      });
    }
    if (onShare) onShare();
  };

  const formattedDate = (() => {
    try {
      return new Date(voteRecord.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
      });
    } catch { return voteRecord.timestamp; }
  })();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: 'rgba(12,12,10,0.6)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 260ms ease',
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'fixed', bottom: 0, 
        left: '50%', transform: visible ? 'translate(-50%, 0)' : 'translate(-50%, 100%)',
        width: '100%',
        zIndex: 401,
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--surface-3)',
        borderRadius: '16px 16px 0 0',
        maxWidth: '480px',
        maxHeight: '55vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        {/* Handle */}
        <div style={{
          display: 'flex', justifyContent: 'center', paddingTop: '12px',
        }}>
          <div style={{
            width: '40px', height: '4px',
            borderRadius: '2px',
            background: 'var(--surface-3)',
          }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 16px 0',
        }}>
          <span style={{
            fontSize: '16px', fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-ui)',
          }}>
            Suaramu di Sidang #{voteRecord.sidangNomor.padStart(3, '0')}
          </span>
          <button
            onClick={handleClose}
            style={{
              width: '44px', height: '44px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'none', border: 'none',
              color: 'var(--text-tertiary)', fontSize: '18px',
              cursor: 'pointer', margin: '-8px -8px -8px 0',
            }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 0' }}>
          {/* Position */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '14px',
          }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: voteColors[voteRecord.position],
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '14px', fontWeight: 600,
              color: voteColors[voteRecord.position],
              fontFamily: 'var(--font-ui)',
            }}>
              {voteLabels[voteRecord.position]}
            </span>
          </div>

          {/* Judul sidang */}
          {voteRecord.sidangJudul && (
            <div style={{
              fontSize: '13px', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', marginBottom: '14px',
              lineHeight: 1.5,
            }}>
              {voteRecord.sidangJudul}
            </div>
          )}

          {/* Quote */}
          {voteRecord.opinionText && (
            <div style={{
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '14px',
              marginBottom: '14px',
            }}>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic', fontSize: '15px',
                color: 'var(--text-primary)',
                margin: 0, lineHeight: 1.55,
              }}>
                "{voteRecord.opinionText}"
              </p>
            </div>
          )}

          {/* Metadata */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{
              fontFamily: 'monospace', fontSize: '11px',
              color: 'var(--text-tertiary)',
              marginBottom: '4px',
              wordBreak: 'break-all',
            }}>
              {voteRecord.voteId}
            </div>
            <div style={{
              fontSize: '11px', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)',
            }}>
              {formattedDate}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--surface-3)', margin: '0 0 16px' }} />
        </div>

        {/* Actions */}
        <div style={{
          padding: '0 16px',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        }}>
          <button
            onClick={handleShare}
            style={{
              width: '100%', height: '44px',
              background: 'var(--accent)',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: 'var(--surface-0)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700, fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            ↗ Bagikan Kartu Suara
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Settings Screen ──────────────────────────────────────────────────────
export const SettingsScreen: React.FC = () => {
  const user = useUserStore();
  const setScreen = useDPNStore(s => s.setScreen);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [selectedVote, setSelectedVote] = useState<(VoteRecord & { sidangNomor: string }) | null>(null);
  const [selectedLegal, setSelectedLegal] = useState<LegalDocType | null>(null);

  const voteEntries = Object.entries(user.votes) as [string, VoteRecord][];

  const formattedAuth = user.authMethod === 'google' ? 'Google' : user.authMethod === 'magic_link' ? 'Email (Magic Link)' : '—';
  const registeredDate = (() => {
    const firstVote = voteEntries[0]?.[1];
    if (firstVote) {
      return new Date(firstVote.timestamp).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric',
      });
    }
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  })();

  const handleLogout = () => {
    user.logout();
    user.showToast('Kamu sudah keluar', 'default');
    setShowLogoutDialog(false);
    setScreen('landing');
  };

  const infoRows = [
    { label: 'Provinsi', value: user.provinceName ?? '—' },
    { label: 'Metode login', value: formattedAuth },
    { label: 'Terdaftar sejak', value: registeredDate },
    { label: 'Jumlah suara', value: voteEntries.length ? `${voteEntries.length} sidang` : '0 sidang' },
  ];

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        background: 'var(--surface-0)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '480px',
      }}>
        {/* Header */}
        <div style={{
          padding: '48px 16px 24px',
          flexShrink: 0,
        }}>
          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--accent)',
            fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '6px',
          }}>PENGATURAN</div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '24px',
            color: 'var(--text-primary)', fontWeight: 400, margin: 0,
          }}>
            Akunmu
          </h1>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          {/* Info Card */}
          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--surface-3)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden', marginBottom: '32px',
          }}>
            {infoRows.map((row, i) => (
              <div key={row.label} style={{
                padding: '14px 16px',
                borderBottom: i < infoRows.length - 1 ? '1px solid var(--surface-2)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{
                  fontSize: '12px', color: 'var(--text-tertiary)',
                  fontFamily: 'var(--font-ui)',
                }}>{row.label}</span>
                <span style={{
                  fontSize: '15px', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)', fontWeight: 500,
                }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Vote History */}
          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--accent)',
            fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>RIWAYAT SUARAMU</div>

          {voteEntries.length === 0 ? (
            <div style={{ paddingBottom: '24px' }}>
              <p style={{
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 4px',
              }}>Belum ada suara tercatat.</p>
              <p style={{
                fontSize: '12px', color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)', margin: 0,
              }}>Kunjungi sidang aktif untuk bersuara.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
              {voteEntries.map(([nomor, vote]) => (
                <button
                  key={nomor}
                  onClick={() => setSelectedVote({ ...vote, sidangNomor: nomor })}
                  style={{
                    background: 'var(--surface-1)',
                    border: '1px solid var(--surface-3)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', marginBottom: '6px',
                  }}>
                    <span style={{
                      fontSize: '12px', color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      #{nomor.padStart(3, '0')} · {new Date(vote.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                    }}>
                      <div style={{
                        width: '6px', height: '6px', borderRadius: '50%',
                        background: voteColors[vote.position],
                      }} />
                      <span style={{
                        fontSize: '12px', fontWeight: 600,
                        color: voteColors[vote.position],
                        fontFamily: 'var(--font-ui)',
                      }}>{voteLabels[vote.position]}</span>
                    </div>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '15px', color: 'var(--text-primary)',
                    lineHeight: 1.3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {vote.sidangJudul ?? `Sidang #${nomor}`}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Actions */}
          <div style={{ marginTop: '16px', marginBottom: '40px' }}>
            <button
              onClick={() => setShowLogoutDialog(true)}
              style={{
                width: '100%', height: '44px',
                background: 'transparent',
                border: '1px solid var(--surface-3)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-ui)', fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Keluar dari DPN
            </button>
          </div>

          {/* Legal Information Section */}
          <div style={{
            fontSize: '11px', fontWeight: 600, color: 'var(--accent)',
            fontFamily: 'var(--font-ui)', letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '12px',
          }}>INFORMASI HUKUM</div>

          <div style={{
            background: 'var(--surface-1)',
            border: '1px solid var(--surface-3)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden', marginBottom: '32px',
          }}>
            {[
              { id: 'disclaimer', label: 'Disclaimer Resmi' },
              { id: 'privacy', label: 'Kebijakan Privasi' },
              { id: 'terms', label: 'Syarat & Ketentuan' },
            ].map((item, i, arr) => (
              <button 
                key={item.id}
                onClick={() => setSelectedLegal(item.id as LegalDocType)}
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'none', border: 'none',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--surface-2)' : 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer', textAlign: 'left',
                }}
              >
                <span style={{
                  fontSize: '14px', color: 'var(--text-primary)',
                  fontFamily: 'var(--font-ui)',
                }}>{item.label}</span>
                <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>→</span>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', marginBottom: '80px',
          }}>
            <div style={{
              fontSize: '11px', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)', marginBottom: '4px',
            }}>DPN v0.1</div>
            <div style={{
              fontSize: '11px', color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-ui)', fontStyle: 'italic',
            }}>Platform aspirasi publik. Bukan lembaga negara.</div>
          </div>
        </div>
      </div>

      {/* Logout confirm dialog */}
      {showLogoutDialog && (
        <>
          <div
            onClick={() => setShowLogoutDialog(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 500,
              background: 'rgba(12,12,10,0.7)',
            }}
          />
          <div style={{
            position: 'fixed', bottom: '50%', left: '50%',
            transform: 'translate(-50%, 50%)',
            zIndex: 501,
            background: 'var(--surface-1)',
            border: '1px solid var(--surface-3)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            width: 'calc(100% - 48px)',
            maxWidth: '320px',
            textAlign: 'center',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-display)', fontSize: '18px',
              color: 'var(--text-primary)', fontWeight: 400, margin: '0 0 8px',
            }}>Yakin mau keluar?</h3>
            <p style={{
              fontSize: '13px', color: 'var(--text-secondary)',
              fontFamily: 'var(--font-ui)', margin: '0 0 24px', lineHeight: 1.5,
            }}>Semua vote yang sudah kamu buat tetap tersimpan.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowLogoutDialog(false)}
                style={{
                  flex: 1, height: '44px',
                  background: 'none', border: '1px solid var(--surface-3)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-ui)', cursor: 'pointer',
                }}
              >Batal</button>
              <button
                onClick={handleLogout}
                style={{
                  flex: 1, height: '44px',
                  background: 'var(--tolak-muted)',
                  border: '1px solid var(--tolak-dim)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--tolak-text)',
                  fontFamily: 'var(--font-ui)', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >Keluar</button>
            </div>
          </div>
        </>
      )}

      {/* Vote receipt bottom sheet */}
      {selectedVote && (
        <VoteReceiptSheet
          voteRecord={selectedVote}
          onClose={() => setSelectedVote(null)}
        />
      )}

      {/* Legal documents bottom sheet */}
      {selectedLegal && (
        <LegalSheet
          type={selectedLegal}
          onClose={() => setSelectedLegal(null)}
        />
      )}
    </>
  );
};
