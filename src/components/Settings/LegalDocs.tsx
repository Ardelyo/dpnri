import React, { useState, useEffect } from 'react';

// ─── Legal Document Types ────────────────────────────────────────────────
export type LegalDocType = 'disclaimer' | 'privacy' | 'terms';

interface LegalDocContent {
  title: string;
  sections: { title: string; content: string }[];
}

const LEGAL_CONTENT: Record<LegalDocType, LegalDocContent> = {
  disclaimer: {
    title: 'Disclaimer DPN RI',
    sections: [
      {
        title: 'Bukan Lembaga Negara',
        content: 'Dewan Perwakilan Netizen (DPN) adalah platform aspirasi digital independen dan BUKAN merupakan bagian dari lembaga pemerintah, DPR RI, atau instansi kenegaraan resmi Republik Indonesia. Segala aktivitas di platform ini merupakan inisiatif sipil untuk menyuarakan aspirasi publik.'
      },
      {
        title: 'Hasil Pemungutan Suara',
        content: 'Hasil voting dan statistik yang ditampilkan di platform ini bersifat representatif terhadap pengguna platform DPN saja dan tidak memiliki kekuatan hukum formal dalam proses pengambilan keputusan kenegaraan di dunia nyata.'
      },
      {
        title: 'Tanggung Jawab Konten',
        content: 'Opini dan komentar yang disampaikan oleh pengguna adalah tanggung jawab pribadi masing-masing individu. DPN berhak menghapus konten yang melanggar hukum atau mengandung unsur SARA.'
      }
    ]
  },
  privacy: {
    title: 'Kebijakan Privasi',
    sections: [
      {
        title: 'Data yang Kami Kumpulkan',
        content: 'Kami mengumpulkan data minimal yang diperlukan untuk verifikasi akun, mencakup alamat email, nama tampilan (opsional), dan data provinsi untuk statistik agregat pemetaan suara.'
      },
      {
        title: 'Kerahasiaan Suara',
        content: 'Pilihan suara Anda (Setuju/Abstain/Tolak) disimpan secara aman. Secara publik, suara Anda akan ditampilkan sebagai anonim kecuali jika Anda secara eksplisit membagikan kartu suara Anda ke platform lain.'
      },
      {
        title: 'Keamanan Data',
        content: 'Kami menggunakan enkripsi standar industri untuk melindungi data Anda dari akses yang tidak sah. Kami tidak menjual data pribadi Anda kepada pihak ketiga manapun.'
      }
    ]
  },
  terms: {
    title: 'Syarat & Ketentuan',
    sections: [
      {
        title: 'Ketentuan Pengguna',
        content: 'Pengguna wajib memberikan informasi yang jujur saat pendaftaran, terutama mengenai asal wilayah (provinsi) untuk menjaga integritas data statistik nasional.'
      },
      {
        title: 'Etika Berpendapat',
        content: 'Pengguna dilarang menggunakan bahasa kasar, melakukan perundungan, atau menyebarkan hoaks dalam kolom aspirasi/opini sidang. Pelanggaran berat dapat mengakibatkan penangguhan akun.'
      },
      {
        title: 'Pembaruan Layanan',
        content: 'DPN berhak mengubah fitur, mekanisme sidang, atau syarat ketentuan ini sewaktu-waktu untuk meningkatkan kualitas platform aspirasi ini.'
      }
    ]
  }
};

// ─── Legal Sheet Component ────────────────────────────────────────────────
interface LegalSheetProps {
  type: LegalDocType;
  onClose: () => void;
}

export const LegalSheet: React.FC<LegalSheetProps> = ({ type, onClose }) => {
  const [visible, setVisible] = useState(false);
  const content = LEGAL_CONTENT[type];

  useEffect(() => {
    // Small delay to trigger animation
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 260);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 600,
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
        zIndex: 601,
        background: 'var(--surface-1)',
        borderTop: '1px solid var(--surface-3)',
        borderRadius: '16px 16px 0 0',
        maxWidth: '480px',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        {/* Handle */}
        <div style={{
          display: 'flex', justifyContent: 'center', paddingTop: '12px', flexShrink: 0,
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
          padding: '16px 20px 10px',
          flexShrink: 0,
        }}>
          <h2 style={{
            fontSize: '18px', fontWeight: 600,
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-display)',
            margin: 0,
          }}>
            {content.title}
          </h2>
          <button
            onClick={handleClose}
            style={{
              width: '40px', height: '40px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--surface-2)', border: 'none',
              borderRadius: '50%',
              color: 'var(--text-tertiary)', fontSize: '16px',
              cursor: 'pointer',
            }}
          >✕</button>
        </div>

        {/* Scrollable content */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '10px 20px 40px',
          WebkitOverflowScrolling: 'touch'
        }}>
          {content.sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontSize: '14px', fontWeight: 600,
                color: 'var(--accent)',
                fontFamily: 'var(--font-ui)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
              }}>
                {section.title}
              </h3>
              <p style={{
                fontSize: '15px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-ui)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {section.content}
              </p>
            </div>
          ))}

          {/* Bottom attribution */}
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'var(--surface-2)',
            borderRadius: '12px',
            fontSize: '12px',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            lineHeight: 1.5,
            textAlign: 'center',
            border: '1px dashed var(--surface-3)',
          }}>
            Terakhir diperbarui: 28 Maret 2026<br/>
            Team Pengembang DPN RI
          </div>
        </div>
      </div>
    </>
  );
};
