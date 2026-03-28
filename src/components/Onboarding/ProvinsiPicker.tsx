import React, { useState, useRef, useEffect } from 'react';
import { useDPNStore } from '../../store/dpnStore';
import { PROVINCES_BY_REGION, PROVINCES } from '../../constants/provinces';

export const ProvinsiPicker: React.FC = () => {
  const setUserProvinsi = useDPNStore(s => s.setUserProvinsi);
  const setShowOnboarding = useDPNStore(s => s.setShowOnboarding);

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 300);
  }, []);

  const filteredBySearch = search.trim()
    ? PROVINCES.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.region.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const handleSelect = (provName: string) => {
    setSelected(provName);
  };

  const handleConfirm = () => {
    if (!selected) return;
    setUserProvinsi(selected);
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--surface-0)',
        zIndex: 80,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--border-faint)',
        flexShrink: 0,
      }}>
        <button
          onClick={() => setShowOnboarding(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-tertiary)',
            fontSize: '13px',
            fontFamily: 'var(--font-ui)',
            cursor: 'pointer',
            padding: '0',
            marginBottom: '16px',
          }}
        >
          ← Kembali
        </button>

        <div className="label-overline" style={{ marginBottom: '8px' }}>
          REGISTRASI ANGGOTA DPN
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 400,
          color: 'var(--text-primary)',
          lineHeight: 1.2,
          marginBottom: '8px',
        }}>
          Kamu dari provinsi mana?
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          fontFamily: 'var(--font-ui)',
          lineHeight: 1.5,
          marginBottom: '16px',
        }}>
          Ini menentukan representasi suaramu dalam sidang DPN.
        </p>

        {/* Search input */}
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ketik nama provinsimu..."
          className="input-base"
          style={{ fontSize: '15px' }}
        />
      </div>

      {/* Province list */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {filteredBySearch ? (
          /* Search results — flat list */
          <div style={{ padding: '8px 0' }}>
            {filteredBySearch.length === 0 ? (
              <div style={{
                padding: '32px 20px',
                textAlign: 'center',
                fontSize: '14px',
                color: 'var(--text-tertiary)',
                fontFamily: 'var(--font-ui)',
                fontStyle: 'italic',
              }}>
                Provinsi tidak ditemukan.
              </div>
            ) : (
              filteredBySearch.map(prov => (
                <button
                  key={prov.name}
                  onClick={() => handleSelect(prov.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '14px 20px',
                    background: selected === prov.name ? 'var(--accent-primary-muted)' : 'transparent',
                    border: 'none',
                    borderBottom: '1px solid var(--border-faint)',
                    color: selected === prov.name ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: selected === prov.name ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background var(--dur-fast)',
                  }}
                >
                  <span>{prov.name}</span>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-ui)',
                  }}>
                    {prov.region}
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          /* Grouped by region */
          PROVINCES_BY_REGION.map(group => (
            <div key={group.region}>
              {/* Region sticky header */}
              <div style={{
                padding: '10px 20px 6px',
                background: 'var(--surface-0)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                borderBottom: '1px solid var(--border-faint)',
              }}>
                <div className="label-overline" style={{ color: 'var(--text-tertiary)' }}>
                  {group.region}
                </div>
              </div>

              {/* Province items */}
              {group.provinces.map((prov, i) => (
                <button
                  key={prov.name}
                  onClick={() => handleSelect(prov.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    height: '52px',
                    padding: '0 20px',
                    background: selected === prov.name ? 'var(--accent-primary-muted)' : 'transparent',
                    border: 'none',
                    borderBottom: i < group.provinces.length - 1 ? '1px solid var(--border-faint)' : 'none',
                    color: selected === prov.name ? 'var(--accent-primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: selected === prov.name ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background var(--dur-fast)',
                  }}
                >
                  <span>{prov.name}</span>
                  {selected === prov.name && (
                    <span style={{ color: 'var(--accent-primary)', fontSize: '16px' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          ))
        )}

        {/* Bottom spacing */}
        <div style={{ height: '80px' }} />
      </div>

      {/* Confirm button — fixed bottom */}
      {selected && (
        <div
          className="animate-fade-in-up"
          style={{
            padding: '12px 20px',
            paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
            borderTop: '1px solid var(--border-faint)',
            background: 'var(--surface-0)',
            flexShrink: 0,
          }}
        >
          <div style={{
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            marginBottom: '10px',
            textAlign: 'center',
          }}>
            Kamu terdaftar sebagai warga <strong style={{ color: 'var(--text-primary)' }}>{selected}</strong>
          </div>
          <button
            onClick={handleConfirm}
            style={{
              width: '100%',
              height: '52px',
              background: 'var(--accent-primary)',
              border: '1px solid var(--accent-primary-dim)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--surface-0)',
              fontFamily: 'var(--font-ui)',
              fontWeight: 700,
              fontSize: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            Masuk ke Sidang →
          </button>
        </div>
      )}
    </div>
  );
};
