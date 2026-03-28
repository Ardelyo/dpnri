# Diagnosa Dulu — Kenapa Ini Penting

Sebelum task plan, perlu dipahami dulu **apa masalah sebenarnya**.

Platform ini mobile-first, tapi sekarang diakses dari PC dan tampilannya:
- Konten stuck di tengah dengan dead space masif di kiri dan kanan
- Typography yang pas di mobile jadi terlalu kecil di desktop
- Layout single-column mobile di tengah layar 1440px terlihat aneh
- Node grid yang sudah susah payah di-fit ke 390px, di desktop malah punya ruang berlebih yang tidak dimanfaatkan

**Keputusan fundamental yang harus dibuat:**

Ada dua filosofi berbeda dan kamu harus pilih salah satu sebelum task plan dibuat.

---

## Dua Pilihan Pendekatan

### Pilihan A — Mobile-Only dengan Centered Container

```
Desktop experience:

┌────────────────────────────────────────────────────┐
│                                                    │
│              ┌─────────────────┐                  │
│              │                 │                  │
│              │   DPN App       │                  │
│              │   (390px max)   │                  │
│              │                 │                  │
│              │                 │                  │
│              └─────────────────┘                  │
│                                                    │
└────────────────────────────────────────────────────┘

Background: --surface-0 (gelap) dengan subtle pattern
App container: max-width 480px, centered, dengan shadow/border
```

**Kelebihan:**
- Tidak perlu redesign layout sama sekali
- Konsisten — mobile dan desktop experience identik
- Development effort minimal
- Tidak ada risiko breaking mobile layout

**Kekurangan:**
- Di desktop terasa seperti "app yang belum selesai"
- Dead space di kiri kanan terlihat wasted
- User desktop mungkin merasa tidak dihargai

**Cocok untuk:** Platform yang memang pure mobile-first dan tidak mengharapkan traffic signifikan dari desktop. Contoh: Gojek web, beberapa platform voting sederhana.

---

### Pilihan B — Responsive Layout (Mobile + Desktop Proper)

```
Mobile (360-480px):          Desktop (1024px+):

┌──────────┐                 ┌─────────────────────────────────┐
│ Header   │                 │ Header/Top Bar                  │
├──────────┤                 ├──────────────────┬──────────────┤
│          │                 │                  │              │
│ Content  │                 │   Main Content   │  Sidebar     │
│ (full)   │                 │   (sidang list,  │  (stats,     │
│          │                 │    voting, dll)  │   context)   │
│          │                 │                  │              │
├──────────┤                 ├──────────────────┴──────────────┤
│ Nav bar  │                 │ Footer (minimal)                │
└──────────┘                 └─────────────────────────────────┘
```

**Kelebihan:**
- Terlihat professional dan intentional di semua device
- Bisa tambah informasi lebih di sidebar desktop
- User desktop dapat experience yang lebih kaya

**Kekurangan:**
- Development effort lebih besar
- Risiko breaking mobile jika tidak careful
- Node grid hemicycle perlu adaptasi untuk desktop

**Cocok untuk:** Platform yang ingin serius dan ingin traffic dari berbagai device.

---

## Rekomendasiku: Pilihan A Dulu, Pilihan B Nanti

Alasannya sederhana:

Platform ini belum launch. Node grid masih broken. Share card masih perlu perbaikan. Auth belum terhubung ke backend. Banyak hal fundamental yang belum selesai.

Mengerjakan responsive desktop layout sekarang = membangun lantai dua sebelum lantai satu selesai.

**Pilihan A bisa dikerjakan dalam 1 hari dan langsung terlihat jauh lebih baik dari sekarang.**

Setelah platform launch dan ada user, baru Pilihan B dikerjakan dengan data real tentang berapa persen user dari desktop.

---

## TASK PLAN — Pilihan A (Centered Container)

### TASK PC-0 — Context

```
CONTEXT:

Platform DPN adalah mobile-first web app. Saat ini saat dibuka di desktop/PC, 
layout terlihat broken — konten tidak centered, dead space tidak di-handle, 
typography tidak proporsional.

SOLUSI: Bungkus seluruh app dalam centered container dengan max-width, 
sehingga di desktop terlihat seperti "mobile app di tengah layar" — 
bukan layout yang broken.

YANG TIDAK BOLEH BERUBAH:
- Semua layout mobile yang sudah ada
- Semua komponen yang sudah bekerja di mobile
- Routing dan navigation
- Design tokens dan warna

YANG AKAN BERUBAH:
- Root layout wrapper
- Background di luar container
- Typography scale untuk desktop
- Beberapa spacing yang terlalu cramped di desktop

TARGET:
- Mobile (360-480px): identik seperti sekarang
- Tablet (481-768px): sama seperti mobile, centered
- Desktop (769px+): centered container 480px dengan background yang proper
```

### TASK PC-1 — Root Layout Container

```
FILE YANG DIUBAH: /app/layout.tsx atau root layout file

INSTRUKSI:

Tambahkan dua layer ke root layout:

Layer 1 — OUTER SHELL:
- Full viewport width dan height
- Background: --surface-0 (#0c0c0a)
- Tambahkan subtle pattern agar tidak terasa blank:
  
  Opsi A (paling simpel): 
  Radial gradient dari center, sangat subtle:
  background: radial-gradient(
    ellipse 80% 60% at 50% 40%,
    #16150f 0%,
    #0c0c0a 70%
  );
  
  Opsi B (lebih karakter):
  Dot grid pattern dengan CSS:
  background-image: radial-gradient(
    circle,
    rgba(184, 164, 114, 0.04) 1px,
    transparent 1px
  );
  background-size: 24px 24px;
  
  PILIH OPSI A untuk sekarang — lebih simpel, tidak berisiko.

Layer 2 — APP CONTAINER:
- max-width: 480px
- width: 100%
- margin: 0 auto
- min-height: 100dvh
- background: --surface-0
- position: relative

  Di desktop (>480px), tambahkan:
  - box-shadow: 0 0 0 1px rgba(184, 164, 114, 0.08),
                0 32px 64px rgba(0, 0, 0, 0.4)
  - Ini memberi subtle "frame" yang memisahkan app dari background
  - BUKAN border tebal, BUKAN shadow cartoonish — sangat subtle

IMPLEMENTASI (Next.js App Router):

// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ 
        background: '#0c0c0a',
        backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, #16150f 0%, #0c0c0a 70%)',
        minHeight: '100dvh',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
          minHeight: '100dvh',
          background: 'var(--surface-0)',
          position: 'relative',
          // Shadow hanya di desktop
        }} className="app-container">
          {children}
        </div>
      </body>
    </html>
  )
}

CSS untuk shadow (hanya di desktop):
@media (min-width: 481px) {
  .app-container {
    box-shadow: 
      0 0 0 1px rgba(184, 164, 114, 0.06),
      0 24px 48px rgba(0, 0, 0, 0.5);
  }
}

PENTING:
- max-width 480px, BUKAN 390px — beri sedikit ruang di tablet
- Di mobile (≤480px), container fill full width (width: 100%)
- Di desktop (>480px), container centered dengan shadow
- Jangan beri border-radius pada container — terlihat seperti popup

KECUALI halaman landing, auth, register, onboarding yang full-screen:
Halaman-halaman ini boleh tetap max-width 480px centered tapi 
background outer shell tetap terlihat di desktop.
```

### TASK PC-2 — Navigation Bar Desktop Fix

```
MASALAH:
Bottom navigation bar di mobile (Sidang · Aktif · Masuk) di desktop 
terlihat stuck di bottom tengah layar dan terlalu kecil.

INSTRUKSI:

Bottom nav harus tetap bottom nav — TIDAK diubah menjadi sidebar atau top nav.
Alasannya: kalau diubah, seluruh layout mobile harus diubah juga.

Yang perlu di-fix:
1. Bottom nav harus mengikuti container width (480px max), bukan full viewport
2. Di desktop, nav harus "menempel" pada container, bukan pada viewport

IMPLEMENTASI:

Bottom nav sudah ada di dalam app-container (dari TASK PC-1),
jadi secara otomatis mengikuti container.

YANG PERLU DI-CEK:
- position: fixed dengan left/right yang benar

Jika bottom nav menggunakan position: fixed, dia akan fixed ke viewport,
bukan ke container. Ini yang menyebabkan nav "lepas" dari container di desktop.

FIX:
Ganti position: fixed ke position: sticky pada bottom nav,
atau jika harus fixed, gunakan:

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
}

Ini memastikan fixed nav tetap aligned dengan container di desktop.

Tambahkan juga:
- padding-bottom: env(safe-area-inset-bottom) tetap ada
- background: --surface-1 dengan border-top --surface-3 tetap ada
- z-index yang benar (di atas konten tapi di bawah modal)
```

### TASK PC-3 — Top Bar Desktop Fix

```
MASALAH:
Top bar "DPN RI · SIDANG AKTIF · ● 32 HADIR" di desktop
bisa jadi terlihat terlalu kecil atau posisinya off.

INSTRUKSI:

Sama seperti bottom nav — top bar sudah seharusnya mengikuti container.
Tapi jika top bar menggunakan position: sticky atau fixed, perlu di-fix.

FIX untuk position: sticky:
- Sticky sudah benar — dia mengikuti parent container
- Pastikan z-index benar: z-index: 50 atau lebih

FIX untuk position: fixed:
.top-bar {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  z-index: 50;
}

TAMBAHAN untuk desktop:
- Di desktop, top bar terlihat di atas container yang centered
- Ini sudah benar dan tidak perlu perubahan visual
- Pastikan background top-bar ada (--surface-0 atau --surface-1) 
  agar konten yang scroll di belakangnya tidak tembus
```

### TASK PC-4 — Modal & Bottom Sheet Desktop Fix

```
MASALAH:
Modal (comparison modal) dan bottom sheet di desktop:
- Comparison modal muncul centered ke viewport, bukan ke container
- Bottom sheet muncul full viewport width, bukan 480px

INSTRUKSI:

BOTTOM SHEET di desktop:
- Bottom sheet harus max-width 480px dan centered
- Jika menggunakan position: fixed:

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);  /* default: hidden */
  width: 100%;
  max-width: 480px;
}

.bottom-sheet.visible {
  transform: translateX(-50%) translateY(0);
}

- Backdrop tetap full viewport (menutupi seluruh layar)
- Tapi sheet-nya sendiri max 480px centered

COMPARISON MODAL di desktop:
- Modal sudah max-width 360px dan centered — ini sudah benar
- Pastikan modal tidak keluar dari container secara visual
- Backdrop tetap full viewport

TOAST NOTIFICATION:
- Toast harus muncul di dalam container, bukan di atas viewport
- Jika position: fixed:

.toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 448px;    /* 480px - 32px padding */
  z-index: 200;
}
```

### TASK PC-5 — Typography Scale untuk Desktop

```
MASALAH:
Di mobile, typography dirancang untuk layar kecil.
Di desktop dalam container 480px, font size yang sama
terlihat sedikit lebih kecil secara perseptual karena
user lebih jauh dari layar.

Tapi karena kita pakai centered container (bukan responsive layout penuh),
perubahan typography minimal — hanya fine-tuning saja.

INSTRUKSI:

Tambahkan CSS untuk viewport > 481px:

@media (min-width: 481px) {
  
  /* Heading halaman sedikit lebih besar */
  .page-heading {
    font-size: 1.875rem;  /* 30px vs 24px di mobile */
  }
  
  /* Body text sedikit lebih besar */
  body {
    font-size: 1rem;      /* 16px vs 15px di mobile */
  }
  
  /* Line height sedikit lebih longgar */
  p, .body-text {
    line-height: 1.7;     /* vs 1.6 di mobile */
  }
  
  /* Padding halaman sedikit lebih besar */
  .page-padding {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  /* Card padding sedikit lebih besar */
  .card {
    padding: 20px;        /* vs 16px di mobile */
  }
}

YANG TIDAK BERUBAH:
- Overline label (11px) — sudah kecil dan intentional
- Metadata/footnote (11px) — sama
- Badge text — sama
- Button text — sama
- Node grid font size — sudah calculated dynamically

TOTAL PERUBAHAN MINIMAL — ini bukan redesign, hanya micro-adjustment.
```

### TASK PC-6 — Landing Page Desktop

```
MASALAH:
Landing page di desktop — konten centered dalam 480px container
di tengah layar lebar — terlihat seperti loading screen yang stuck.

Dari screenshot yang ada, landing page di desktop punya:
- Dead space masif di atas dan bawah konten
- Konten terlalu kecil relatif terhadap layar

INSTRUKSI:

Landing page mendapat treatment khusus karena ini first impression.

Di mobile: layout sudah benar (centered vertikal, satu viewport)

Di desktop: tambahkan elemen visual di OUTER SHELL
(di luar 480px container) untuk mengisi dead space.

OPSI — Background Enhancement:

Pada outer shell (body) di desktop, tambahkan:

1. Subtle noise/grain texture:
   Gunakan SVG filter atau CSS untuk grain effect yang sangat halus.
   Ini memberi "weight" pada background yang plain.

2. Atau: Two-column hint di luar container:
   Sebelah kiri container: tampilkan satu kutipan rakyat dalam italic serif, 
   sangat besar, transparan (opacity 0.04-0.06), sebagai watermark dekoratif.
   
   "Rakyat sudah bicara."
   
   Font: Instrument Serif, 72px, warna --accent, opacity 0.05
   Position: absolute, left: 5%, vertically centered
   
   Ini mengisi dead space dengan konteks tanpa menambah UI yang kompleks.

3. Atau yang paling simpel: biarkan background gelap dengan radial gradient
   yang sudah ada di TASK PC-1. Kesederhanaan juga valid.

REKOMENDASI: Pilih opsi 3 (paling simpel) untuk sekarang.
Fokus pada yang fungsional dulu.

YANG PERLU DI-FIX di landing page untuk desktop:
- Pastikan konten vertikal-centered di dalam container 480px
- Tidak ada elemen yang overflow container
- CTA button full width (padded 32px dari edge container)
- Disclaimer di bottom: absolute positioned dalam container, bukan viewport
```

### TASK PC-7 — Halaman Registrasi Provinsi Desktop

```
MASALAH:
List provinsi di desktop dalam container 480px bisa scroll dengan nyaman.
Tapi sticky region headers perlu dipastikan bekerja dalam container.

INSTRUKSI:

Sticky headers harus sticky relative ke scroll container (body atau container).

Jika menggunakan position: sticky:
.region-header {
  position: sticky;
  top: 0;              /* atau top: 48px jika ada top bar */
  z-index: 10;
  background: var(--surface-0);  /* PENTING: background solid, bukan transparent */
}

Di desktop, list item bisa sedikit lebih tinggi:
@media (min-width: 481px) {
  .province-item {
    height: 52px;      /* vs 48px di mobile */
  }
}

Tidak ada perubahan major lain — list dalam 480px container sudah nyaman di desktop.
```

### TASK PC-8 — Node Grid Desktop dalam Container

```
MASALAH:
Node grid yang sudah di-fix untuk 360px mobile,
di dalam 480px container desktop akan punya lebih banyak ruang.
Kalkulasi dynamic size dari TASK NODE-4 sudah handle ini —
node akan otomatis lebih besar di desktop.

Tapi perlu pastikan beberapa hal:

INSTRUKSI:

1. PASTIKAN calculateNodeSize() / useNodeSize() menggunakan
   CONTAINER WIDTH, bukan VIEWPORT WIDTH:
   
   // SALAH — menggunakan viewport:
   const viewportWidth = window.innerWidth;
   
   // BENAR — menggunakan container:
   const containerRef = useRef<HTMLDivElement>(null);
   const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
   
   Update hook useNodeSize untuk menerima containerRef:
   
   function useNodeSize(containerRef: RefObject<HTMLDivElement>, maxNodesPerRow = 9) {
     const [nodeSize, setNodeSize] = useState({ width: 32, height: 26, fontSize: 9, gap: 6 })
     
     useEffect(() => {
       function calculate() {
         const containerWidth = containerRef.current?.clientWidth 
           || Math.min(window.innerWidth, 480)
         
         const padding = 32
         const usableWidth = containerWidth - padding
         const totalGap = (maxNodesPerRow - 1) * 6
         const safetyMargin = 4
         const maxWidth = Math.floor(
           (usableWidth - totalGap - safetyMargin) / maxNodesPerRow
         )
         
         // Di desktop container (~480px), node bisa lebih besar
         // Tapi tetap clamp max 42px agar tidak terlalu besar
         const nodeWidth = Math.max(24, Math.min(42, maxWidth))
         const nodeHeight = Math.round(nodeWidth * 0.8)
         const fontSize = Math.max(8, Math.round(nodeWidth * 0.28))
         
         setNodeSize({ width: nodeWidth, height: nodeHeight, fontSize, gap: 6 })
       }
       
       calculate()
       
       const observer = new ResizeObserver(calculate)
       if (containerRef.current) observer.observe(containerRef.current)
       
       return () => observer.disconnect()
     }, [containerRef, maxNodesPerRow])
     
     return nodeSize
   }
   
   Dengan ResizeObserver, grid otomatis recalculate saat container resize.
   Ini lebih reliable dari window resize event.

2. DI DESKTOP, node akan lebih besar karena container lebih lebar (480px vs 360px):
   - Di 360px container: node sekitar 32px
   - Di 480px container: node sekitar 42px
   - Ini BAGUS — lebih mudah di-tap di desktop
   - Font size juga akan scale proporsional

3. Pastikan podium SVG juga di-centered dalam container, 
   bukan dalam viewport.
```

### TASK PC-9 — Scroll Behavior & Overflow Fix

```
MASALAH:
Di desktop dengan centered container, ada potensi double scrollbar:
- Scrollbar dari body/html
- Scrollbar dari container

INSTRUKSI:

// Global CSS
html, body {
  height: 100%;
  overflow-x: hidden;  /* Sembunyikan horizontal scroll */
}

body {
  overflow-y: auto;    /* Body yang scroll, bukan container */
}

.app-container {
  overflow-x: hidden;
  overflow-y: visible; /* Container tidak punya scroll sendiri */
  min-height: 100dvh;
}

/* Sembunyikan scrollbar di desktop tapi tetap scrollable */
@media (min-width: 481px) {
  body::-webkit-scrollbar {
    width: 6px;
  }
  body::-webkit-scrollbar-track {
    background: var(--surface-0);
  }
  body::-webkit-scrollbar-thumb {
    background: var(--surface-3);
    border-radius: 3px;
  }
  body::-webkit-scrollbar-thumb:hover {
    background: var(--surface-2);
    /* Memang sengaja lebih gelap saat hover — ini scrollbar yang subtle */
  }
}
```

### TASK PC-10 — Visual Checklist Desktop

```
INI BUKAN CODING TASK.
Checklist manual untuk verifikasi di desktop browser.

Buka Chrome di desktop. Set zoom ke 100%. Viewport standar ~1440px.

TEST 1 — Container:
[ ] App container centered di layar
[ ] Container max-width tidak lebih dari 480px
[ ] Background di luar container gelap (--surface-0 + radial gradient)
[ ] Subtle shadow/border pada container terlihat tapi tidak mencolok
[ ] Tidak ada horizontal scrollbar

TEST 2 — Landing Page:
[ ] Konten vertikal-centered dalam container
[ ] Tidak ada dead space yang mengkhawatirkan dalam container
[ ] CTA button full width dalam container (minus padding)
[ ] Disclaimer di bottom container, bukan bottom viewport

TEST 3 — Navigation:
[ ] Bottom nav mengikuti container (max 480px, centered)
[ ] Bottom nav tidak full 1440px width
[ ] Top bar juga mengikuti container
[ ] Tidak ada nav yang "lepas" ke luar container

TEST 4 — Modal & Bottom Sheet:
[ ] Bottom sheet max 480px, centered
[ ] Backdrop full viewport (menutupi seluruh layar)
[ ] Comparison modal centered dalam viewport (sudah benar)
[ ] Toast notification centered dan max 448px

TEST 5 — Node Grid:
[ ] Node lebih besar di desktop (sekitar 40-42px) vs mobile (32px)
[ ] Semua 38 node visible tanpa overflow
[ ] Legenda terlihat dengan jelas
[ ] Tap node berfungsi (bottom sheet muncul)

TEST 6 — Scrolling:
[ ] Halaman scroll dengan mulus
[ ] Tidak ada double scrollbar
[ ] Scrollbar (jika ada) subtle dan tidak mengganggu
[ ] Sticky elements (top bar, region headers) bekerja benar

TEST 7 — Form (Naik Podium):
[ ] Textarea bisa diketik
[ ] Tombol posisi bisa di-tap
[ ] Submit button visible tanpa scroll berlebihan
[ ] Keyboard muncul saat tap textarea (di desktop: fokus ke textarea)

TEST 8 — Breakpoints:
[ ] Di 360px (DevTools): layout mobile normal, identik seperti sebelumnya
[ ] Di 480px: container tepat full width, tidak ada gap di kiri/kanan
[ ] Di 768px: container 480px centered, dead space sudah di-handle
[ ] Di 1440px: sama seperti 768px, hanya dead space lebih banyak (ok)
[ ] Di 1920px: sama, dead space makin banyak (ok — by design)
```

---

## Urutan Eksekusi

```
ESTIMASI TOTAL: 1 hari kerja (4-6 jam)

JAM 1:
└── TASK PC-1 — Root layout container (ini yang paling impactful)

JAM 2:
├── TASK PC-2 — Bottom nav fix
└── TASK PC-3 — Top bar fix

JAM 3:
├── TASK PC-4 — Modal & bottom sheet fix
└── TASK PC-5 — Typography scale

JAM 4:
├── TASK PC-6 — Landing page desktop
├── TASK PC-7 — Registrasi provinsi
└── TASK PC-8 — Node grid container reference fix

JAM 5:
├── TASK PC-9 — Scroll behavior
└── TASK PC-10 — Visual checklist (manual testing)

SETELAH SELESAI:
Semua screenshot yang dikirim setelah ini seharusnya tidak lagi
terlihat "broken di desktop" — konten akan centered dan proper
meski tetap mobile-first.
```