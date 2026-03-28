import React, { useState, useMemo } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES_BY_REGION } from '../../constants/provinces';
import type { DPNState } from '../../types';

export const ProvinsiPicker: React.FC = () => {
  const setScreen = useDPNStore((s: DPNState) => s.setScreen);
  const setUserProvinsi = useDPNStore((s: DPNState) => s.setUserProvinsi);
  const userProvinsi = useDPNStore((s: DPNState) => s.userProvinsi);

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
      setScreen('room');
    }
  };

  if (confirmed && selected) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--surface-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        zIndex: 400,
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'none',
          border: '2px solid var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          color: 'var(--accent)',
          marginBottom: '24px'
        }}>
          ✓
        </div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Terdaftar sebagai
        </div>
        <div style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '20px', 
          color: 'var(--text-primary)',
          marginBottom: '32px'
        }}>
          Warga {selected}
        </div>

        <button
          onClick={handleConfirm}
          style={{
            width: '100%',
            height: '48px',
            background: 'var(--accent)',
            color: 'var(--surface-0)',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Masuk ke Sidang →
        </button>

        <button
          onClick={() => setConfirmed(false)}
          style={{
            marginTop: '16px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          Bukan provinsimu? Ubah
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'var(--surface-0)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 400,
    }}>
      {/* Header */}
      <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
        <button
          onClick={() => setScreen('landing')}
          style={{
            height: '44px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '12px 0'
          }}
        >
          ← Kembali
        </button>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--accent)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px'
        }}>
          REGISTRASI
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          margin: '0 0 4px',
          color: 'var(--text-primary)',
          fontWeight: 400
        }}>
          Kamu dari mana?
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: 0
        }}>
          Menentukan representasi suaramu.
        </p>
      </div>

      {/* Search bar */}
      <div style={{ padding: '0 16px 16px', flexShrink: 0 }}>
        <div style={{ position: 'relative' }}>
          <span style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
            fontSize: '16px'
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
              height: '44px',
              background: 'var(--surface-1)',
              border: '1px solid var(--surface-3)',
              borderRadius: 'var(--radius-md)',
              padding: '0 12px 0 40px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              fontStyle: 'italic'
            }}
          />
        </div>
      </div>

      {/* List - Grouped */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredGroups.map(group => (
          <div key={group.region}>
            <div style={{
              position: 'sticky',
              top: 0,
              background: 'var(--surface-0)',
              padding: '8px 16px',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--accent)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--surface-3)',
              zIndex: 10
            }}>
              {group.region}
            </div>
            {group.provinces.map((prov, i) => (
              <button
                key={prov.name}
                onClick={() => handleSelect(prov.name)}
                style={{
                  width: '100%',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 16px',
                  background: selected === prov.name ? 'var(--accent)' : 'none',
                  border: 'none',
                  borderBottom: i < group.provinces.length - 1 ? '1px solid var(--surface-3)' : 'none',
                  color: selected === prov.name ? 'var(--surface-0)' : 'var(--text-primary)',
                  fontSize: '15px',
                  fontWeight: selected === prov.name ? 600 : 400,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 150ms'
                }}
              >
                {prov.name}
              </button>
            ))}
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Provinsi tidak ditemukan.</div>
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>Pastikan ejaan sudah benar.</div>
          </div>
        )}
      </div>
    </div>
  );
};
