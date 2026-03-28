import React, { useState, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { useUserStore } from '../../store/useUserStore';
import { PROVINCES_BY_REGION } from '../../constants/provinces';
import type { DPNState } from '../../types';

export const ProvinsiPicker: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const setUserProvinsi = useDPNStore((s: DPNState) => s.setUserProvinsi);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);
  const setProvince = useUserStore(s => s.setProvince);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(userProvinsi);
  const [confirmed, setConfirmed] = useState(false);

  const filteredGroups = useMemo(() => {
    if (!search) return PROVINCES_BY_REGION;
    
    return PROVINCES_BY_REGION.map(group => ({
      ...group,
      provinces: group.provinces.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    })).filter(group => group.provinces.length > 0);
  }, [search]);

  const handleSelect = (prov: string) => {
    setSelected(prov);
    setConfirmed(true);
  };

  const handleConfirm = () => {
    if (selected) {
      setUserProvinsi(selected);
      // Persist to new user store too (province id = slugified name)
      const id = selected.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setProvince(id, selected);
      setScreen('onboarding-flow');
    }
  };

  if (confirmed && selected) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'var(--surface-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        zIndex: 500,
        textAlign: 'center',
      }}>
        {/* Decorative Circle */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          color: 'var(--accent)',
          marginBottom: '32px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          ✓
        </div>

        <div style={{ 
          fontSize: '12px', 
          fontWeight: 700,
          color: 'var(--accent)', 
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          fontFamily: 'var(--font-ui)',
        }}>
          IDENTITAS TERVERIFIKASI
        </div>
        
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '28px', 
          color: 'var(--text-primary)',
          fontWeight: 400,
          margin: '0 0 12px',
          lineHeight: 1.2,
        }}>
          Warga {selected}
        </h1>

        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '14px',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          maxWidth: '260px',
          margin: '0 0 40px',
        }}>
          Terima kasih telah bergabung. Representasimu sangat berarti bagi demokrasi kita.
        </p>

        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            maxWidth: '240px',
            height: '52px',
            background: 'var(--accent)',
            color: 'var(--surface-0)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            letterSpacing: '0.05em',
          }}
        >
          MULAI BERSIDANG
        </button>

        <button
          onClick={() => setConfirmed(false)}
          style={{
            marginTop: '20px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            textDecoration: 'underline',
            textUnderlineOffset: '4px',
          }}
        >
          Salah pilih? Ubah Provinsi
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      background: 'var(--surface-0)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 400,
      maxWidth: '480px',
    }}>
      {/* Header */}
      <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('landing')}
          style={{
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '14px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 500,
          }}
        >
          ← Kembali
        </button>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          color: 'var(--accent)',
          fontFamily: 'var(--font-ui)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          REGISTRASI
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          margin: '0 0 6px',
          color: 'var(--text-primary)',
          fontWeight: 400,
          lineHeight: 1.1,
        }}>
          Domisili Anda?
        </h1>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          margin: 0,
          lineHeight: 1.4,
        }}>
          Pilih provinsi asal untuk memvalidasi <br />representasi suara Anda.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '16px', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
            fontSize: '16px',
            opacity: 0.7
          }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Cari provinsi..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              height: '48px',
              background: 'var(--surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0 16px 0 44px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              outline: 'none',
              transition: 'all 200ms ease',
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>
      </div>

      {/* List - Grouped */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '40px' }}>
        {filteredGroups.map(group => (
          <div key={group.region}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'var(--surface-overlay)',
              backdropFilter: 'blur(8px)',
              padding: '12px 16px',
              fontSize: '10px',
              fontWeight: 700,
              color: 'var(--text-tertiary)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--border-faint)',
              zIndex: 10,
              fontFamily: 'var(--font-ui)',
            }}>
              {group.region}
            </div>
            {group.provinces.map((prov) => (
              <button
                key={prov.name}
                onClick={() => handleSelect(prov.name)}
                style={{
                  width: '100%',
                  height: '56px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid var(--border-faint)',
                  color: 'var(--text-primary)',
                  fontSize: '16px',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  WebkitTapHighlightColor: 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
              >
                {prov.name}
              </button>
            ))}
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ 
              fontSize: '16px', 
              color: 'var(--text-secondary)', 
              fontFamily: 'var(--font-display)',
              marginBottom: '4px'
            }}>
              Provinsi tidak ditemukan
            </div>
            <div style={{ 
              fontSize: '13px', 
              color: 'var(--text-tertiary)', 
              fontFamily: 'var(--font-ui)' 
            }}>
              Coba gunakan kata kunci lain.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
