

# DPN Frontend Full Ecosystem — Task Plan

> Ini LANJUTAN dari yang sudah ada. Bukan build ulang. Yang sudah selesai dan bagus: risalah cards, comparison modal, bottom sheet, filter chips, top bar sidang aktif. Jangan sentuh yang sudah benar.

---

## TASK 0 — Context Update

```
CONTEXT PROYEK — UPDATE:

Kamu melanjutkan pengembangan frontend DPN (Dewan Perwakilan Netizen). Platform sudah punya beberapa halaman yang berfungsi. Sekarang kita melengkapi SELURUH EKOSISTEM frontend end-to-end.

YANG SUDAH ADA DAN JANGAN DIUBAH:
- Risalah card list (Putusan Resmi tab) — sudah bagus
- Comparison modal DPN vs DPR — sudah mendekati final
- Bottom sheet detail pendapat — sudah bersih
- Filter chips + search di tab Semua Pendapat — sudah konsisten
- Top bar sidang aktif — sudah clean
- Halaman Naik Podium (form vote) — sudah ada, perlu minor fix saja

YANG PERLU DITAMBAHKAN (BELUM ADA SAMA SEKALI):
1. Landing page — belum ada
2. Auth flow (Google OAuth + Magic Link) — belum ada
3. Registrasi provinsi — sudah ada tapi belum di-redesign
4. Onboarding singkat — belum ada
5. User state management (logged in/out, sudah vote/belum) — belum ada
6. Navigation/routing yang lengkap — belum ada
7. Profile/settings minimal — belum ada
8. Empty states, loading states, error states — belum ada
9. Konfirmasi setelah vote — belum ada
10. Post-vote state di sidang aktif (sudah bersuara) — belum ada

TECH STACK:
- Next.js 14+ (App Router)
- Tailwind CSS + CSS custom properties (design tokens sudah ada)
- Supabase Auth (Google OAuth + Magic Link) — untuk auth
- Supabase Database — untuk data (nanti, sekarang mock dulu)
- Zustand — untuk client state management
- LocalStorage — sebagai fallback/cache

PRINSIP:
- Mobile-first. 360px viewport harus sempurna.
- Semua data masih MOCK/DUMMY di frontend. Backend belum ada. Simulasikan API calls dengan delay 500-1000ms untuk realistis.
- Auth flow harus BENAR secara UI/UX meski belum konek ke Supabase. Buat mock auth yang bisa di-swap ke real Supabase nanti.
- Jangan bikin halaman yang tidak disebutkan. Fokus pada flow yang didefinisikan.

DESIGN TOKENS (sudah ada, pakai ini):
--surface-0: #0c0c0a
--surface-1: #16150f
--surface-2: #201e16
--surface-3: #2a2820
--text-primary: #e8e4d9
--text-secondary: #9c9787
--text-tertiary: #6b6557
--accent: #b8a472
--setuju: #7a9c6e
--tolak: #b5564e
--abstain: #8a8475
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px

FONT:
- Heading/kutipan: Instrument Serif (fallback: Lora, Georgia, serif)
- Body/UI: Plus Jakarta Sans (fallback: Inter, system-ui, sans-serif)
- Overline: Plus Jakarta Sans 600, 11px, uppercase, 0.08em spacing, --accent

USER FLOW LENGKAP YANG HARUS DIDUKUNG:
Landing → Auth (Google/Magic Link) → Pilih Provinsi → Onboarding → Risalah → Sidang Aktif → Naik Podium → Konfirmasi → Share → Kembali ke Risalah
```

---

## PHASE 1 — Auth & Entry Flow

### TASK 1.1 — Landing Page

```
HALAMAN: / (root)

Halaman ini HANYA muncul jika user belum login. Jika sudah login, redirect ke /sidang.

BUKAN landing page marketing yang panjang. Satu layar. 10 detik untuk baca. Langsung ke poin.

LAYOUT (satu viewport, TANPA scroll):

Struktur vertikal, centered:

1. SPACER ATAS — 25% viewport height (push konten ke center-atas)

2. ICON:
   - Emoji 🏛 atau custom SVG gedung parlemen sederhana
   - Ukuran: 36px
   - Warna: --accent
   - Centered

3. WORDMARK:
   - "DEWAN PERWAKILAN NETIZEN" — overline style (11px, 600, 0.08em, uppercase)
   - Warna: --accent
   - Margin top: 12px
   - Centered

4. HEADLINE:
   - "Suaramu untuk Indonesia." — Instrument Serif, 28px, --text-primary
   - Centered
   - Margin top: 24px

5. SUBHEADLINE:
   - "Ikut voting isu kebijakan nyata. Lihat apakah DPR sejalan dengan rakyat. Semua tercatat permanen."
   - Plus Jakarta Sans, 14px, --text-secondary, centered
   - Max-width: 280px (agar tidak terlalu lebar di tablet)
   - Line-height: 1.6
   - Margin top: 12px

6. CTA UTAMA:
   - "Masuk sebagai Warga" — full width (minus 32px padding), height 48px
   - Background: --accent, text: --surface-0, weight 600
   - Radius: --radius-md
   - Margin top: 40px
   - Tap → navigasi ke /auth

7. CTA SEKUNDER (untuk yang sudah punya akun):
   - "Lihat sidang tanpa masuk →" — text button, 13px, --text-secondary
   - Tap → navigasi ke /sidang (read-only mode, tanpa bisa vote)
   - Margin top: 16px

8. DISCLAIMER:
   - "Platform aspirasi publik. Bukan lembaga negara."
   - 11px, --text-tertiary, italic, centered
   - Position: absolute bottom, margin bottom env(safe-area-inset-bottom) + 24px

VISUAL:
- Background: --surface-0
- Tidak ada gambar, pattern, atau dekorasi
- Typography saja yang bicara
- Nuansa: tenang, bermartabat, serius tapi inviting

LOGIC:
- Cek auth state saat mount
- Jika sudah login DAN sudah pilih provinsi → redirect /sidang
- Jika sudah login TAPI belum pilih provinsi → redirect /register
- Jika belum login → tampilkan landing
```

### TASK 1.2 — Auth Page

```
HALAMAN: /auth

Halaman login/register. DPN tidak bedakan login dan register — kalau akun belum ada, otomatis dibuat.

LAYOUT:

1. BACK BUTTON:
   - "← Kembali" — 14px, --text-secondary, tap area 44px height
   - Navigasi ke /

2. HEADER:
   - .overline-label: "MASUK"
   - Heading: "Verifikasi identitasmu" — serif, 24px
   - Subtitle: "Satu akun, satu suara. Agar setiap suara berarti." — 13px, --text-secondary
   - Margin bottom: 32px

3. GOOGLE BUTTON (primary):
   - Full width, height 52px
   - Background: #FFFFFF (putih — standar Google branding)
   - Text: "Masuk dengan Google" — 15px, weight 500, color #1f1f1f
   - Icon: Google "G" logo SVG di kiri teks (ukuran 20px)
   - Border-radius: --radius-md
   - Border: 1px solid #dadce0
   - Ini HARUS mengikuti Google branding guidelines — warna putih, bukan custom.

4. DIVIDER:
   - "atau" — 12px, --text-tertiary, centered
   - Garis horizontal di kiri dan kanan teks
   - Warna garis: --surface-3
   - Margin vertikal: 24px

5. MAGIC LINK (secondary):
   - Label: "Masuk dengan email" — 13px, --text-secondary, margin bottom 8px
   - Input email:
     - Height: 48px
     - Background: --surface-1
     - Border: 1px --surface-3
     - Radius: --radius-md
     - Placeholder: "alamat@email.com" — italic, --text-tertiary
     - Font: 15px
   - Button submit:
     - Full width, height 48px, margin top 12px
     - Background: --surface-2, text --text-primary, weight 600
     - Teks: "Kirim link masuk"
     - Radius: --radius-md
     - Saat loading: text ganti jadi spinner kecil

6. FOOTER INFO:
   - "Kami hanya menyimpan ID akunmu (di-hash). Nama, foto, dan data pribadimu tidak disimpan."
   - 11px, --text-tertiary, centered, max-width 280px
   - Margin top: 32px

STATES:

A. DEFAULT — tampilkan layout di atas

B. MAGIC LINK SENT:
   - Sembunyikan form email
   - Tampilkan:
     - ✉ icon, 32px, --accent
     - "Cek emailmu" — serif, 20px
     - "Kami kirim link masuk ke [email]. Klik link itu untuk masuk." — 13px, --text-secondary
     - "Tidak terima? Kirim ulang" — text button, --accent, 13px
     - Kirim ulang disabled selama 60 detik (tampilkan countdown)
   - Centered vertikal

C. AUTH ERROR:
   - Error bar di atas buttons:
     - Background: rgba(--tolak, 0.1)
     - Border: 1px rgba(--tolak, 0.2)
     - Text: error message, 13px, --tolak
     - Radius: --radius-sm
     - Auto-dismiss 5 detik

D. AUTH LOADING (Google popup terbuka):
   - Google button disabled, text: "Menunggu Google..." + spinner
   - Semua elemen lain opacity 0.5

MOCK AUTH:
Untuk sekarang (belum konek Supabase), buat mock:
- Google button tap → delay 1 detik → set auth state → redirect
- Magic link → delay 1 detik → tampilkan "link sent" state → ada button "Simulasi klik link" → set auth state → redirect
- Simpan auth state di localStorage: { isLoggedIn: true, authMethod: 'google'|'magic_link', userId: 'mock-uuid-123' }
- Nanti tinggal swap mock functions dengan Supabase client calls

SETELAH AUTH BERHASIL:
- Cek apakah user sudah punya province_id di state
- Jika belum → redirect ke /register (pilih provinsi)
- Jika sudah → redirect ke /sidang
```

### TASK 1.3 — Registrasi Provinsi (Redesign)

```
HALAMAN: /register

Halaman ini muncul SETELAH auth berhasil, hanya jika user belum pilih provinsi. Jika sudah punya provinsi, redirect ke /sidang.

LAYOUT:

1. HEADER (tidak ada back button — user harus pilih provinsi untuk lanjut):
   - .overline-label: "REGISTRASI"
   - Heading: "Kamu dari mana?" — serif, 24px
   - Subtitle: "Menentukan representasi suaramu di sidang." — 13px, --text-secondary
   - Margin bottom: 16px

2. SEARCH:
   - Input: height 44px, background --surface-1, border 1px --surface-3
   - Radius: --radius-md
   - Placeholder: "Cari provinsi..." — italic, --text-tertiary
   - Padding left: 40px (ruang untuk icon)
   - Icon search (magnifying glass SVG, 16px) di kiri, --text-tertiary
   - Saat mengetik: filter list real-time, sembunyikan group headers
   - Clear button (✕) muncul di kanan saat ada input
   - Margin bottom: 12px

3. LIST PROVINSI — grouped by region:

   Saat TIDAK searching, tampilkan grouped:

   SUMATERA (header sticky)
   Aceh
   Sumatera Utara
   Sumatera Barat
   Riau
   Jambi
   Sumatera Selatan
   Bengkulu
   Lampung
   Kep. Bangka Belitung
   Kep. Riau

   JAWA
   DKI Jakarta
   Jawa Barat
   Jawa Tengah
   DI Yogyakarta
   Jawa Timur
   Banten

   KALIMANTAN
   Kalimantan Barat
   Kalimantan Tengah
   Kalimantan Selatan
   Kalimantan Timur
   Kalimantan Utara

   BALI & NUSA TENGGARA
   Bali
   Nusa Tenggara Barat
   Nusa Tenggara Timur

   SULAWESI
   Sulawesi Utara
   Sulawesi Tengah
   Sulawesi Selatan
   Sulawesi Tenggara
   Gorontalo
   Sulawesi Barat

   MALUKU
   Maluku
   Maluku Utara

   PAPUA
   Papua
   Papua Barat
   Papua Selatan
   Papua Tengah
   Papua Pegunungan
   Papua Barat Daya

4. STYLING LIST:
   - Region header: overline style, --accent, height 32px, padding-left 16px
   - STICKY saat scroll — background --surface-0 agar tidak tembus
   - Province item: full width, height 48px, padding 16px horizontal
   - Text provinsi: 15px, --text-primary, weight 400
   - Separator: 1px solid --surface-2 antar item (BUKAN antar region)
   - TIDAK ada colored dots, TIDAK ada icon — plain text
   - Tap state: background --surface-2 (150ms transition)
   - Tidak ada selected state visual di list — tap langsung trigger konfirmasi

5. SAAT SEARCHING:
   - Sembunyikan group headers
   - Tampilkan flat filtered list
   - Highlight matching characters di nama provinsi (bold/--accent)
   - Jika tidak ada hasil: "Provinsi tidak ditemukan." — centered, 14px, --text-secondary, margin top 40px

6. SETELAH TAP PROVINSI — Konfirmasi (inline, bukan modal):
   - List hilang (fade out 200ms)
   - Search hilang
   - Ganti dengan konfirmasi centered:
     
     ✓ (checkmark dalam lingkaran)
     - Lingkaran: 56px, border 2px --accent, background transparent
     - Checkmark: SVG --accent, 24px
     
     "Terdaftar sebagai"
     - 13px, --text-secondary, margin top 16px
     
     "Warga Jawa Timur"
     - Serif, 22px, --text-primary, margin top 4px
     
     CTA: "Masuk ke Sidang →"
     - Full width, height 48px, --accent background
     - Margin top: 32px
     - Tap → navigasi ke /onboarding
     
     "Bukan provinsimu? Ubah"
     - Text button, --text-secondary, 13px
     - Margin top: 16px
     - Tap → kembali ke list (fade in)

STATE MANAGEMENT:
- Setelah konfirmasi, simpan province_id ke user state (localStorage + Zustand)
- Province TIDAK BISA diubah setelah confirm (kecuali lewat settings nanti)
```

### TASK 1.4 — Onboarding (3 Screens)

```
HALAMAN: /onboarding

Muncul SATU KALI setelah registrasi provinsi. Setelah selesai, tidak pernah muncul lagi. Tujuannya: user paham DPN itu apa dan cara pakainya dalam 15 detik.

BUKAN tutorial panjang. 3 screen singkat. Bisa di-skip.

LAYOUT:

Setiap screen punya struktur yang sama:
- Konten centered
- Dot indicators di bawah (● ○ ○ untuk screen 1, ○ ● ○ untuk screen 2, dst)
- Swipe horizontal atau tap untuk next
- "Lewati" text button di kanan atas — skip ke /sidang

SCREEN 1 — "Rakyat Bersuara":
- Icon: 🗳 atau voting box SVG, 40px, --accent
- Heading: "Rakyat bersuara." — serif, 22px, --text-primary
- Body: "Baca isu kebijakan yang sedang dibahas DPR. Pilih posisimu: setuju, abstain, atau tolak." — 14px, --text-secondary, centered, max-width 260px, line-height 1.6
- Margin icon ke heading: 16px
- Margin heading ke body: 8px

SCREEN 2 — "Semua Tercatat":
- Icon: 📜 atau scroll/document SVG, 40px, --accent
- Heading: "Semua tercatat." — serif, 22px
- Body: "Suaramu tersimpan permanen. Tidak bisa diubah, tidak bisa dihapus. Seperti sidang sungguhan."

SCREEN 3 — "Bandingkan":
- Icon: ⚖️ atau scales SVG, 40px, --accent
- Heading: "Bandingkan." — serif, 22px
- Body: "Lihat apakah keputusan DPR sejalan dengan suara rakyat. Data bicara."
- CTA: "Mulai →" — full width, --accent, 48px (GANTI "Lewati" dengan ini di screen terakhir)
- Tap → navigasi ke /sidang + set onboarding_complete = true di localStorage

BOTTOM AREA:
- Dot indicators: 3 dots, active = --accent, inactive = --surface-3
- Dot size: 6px, gap 8px, centered
- Margin bottom: env(safe-area-inset-bottom) + 32px

GESTURES:
- Swipe left → next screen
- Swipe right → previous screen
- Tap kanan layar → next
- Tap kiri layar → previous (kecuali screen 1)

TRANSITIONS:
- Slide horizontal, 250ms, ease-out
- Content fade in saat masuk: 200ms delay setelah slide selesai

STATE:
- Simpan onboarding_complete di localStorage
- Jika true, skip halaman ini — redirect ke /sidang
- "Lewati" juga set onboarding_complete = true
```

---

## PHASE 2 — Global State & Navigation

### TASK 2.1 — User State Management

```
BUAT global state management menggunakan Zustand.

FILE: /store/useUserStore.ts

STATE SHAPE:

{
  // Auth
  isLoggedIn: boolean
  userId: string | null
  authMethod: 'google' | 'magic_link' | null
  
  // Profile
  provinceId: string | null
  provinceName: string | null
  provinceCode: string | null  // 2 huruf: "JI", "JK", dll
  
  // Onboarding
  hasCompletedOnboarding: boolean
  
  // Votes (cache lokal)
  votes: Record<number, {  // key = sidang_id
    position: 'setuju' | 'abstain' | 'tolak'
    opinionText: string
    timestamp: string
    voteId: string
  }>
  
  // Device
  deviceFingerprint: string | null
  
  // Actions
  login: (data: { userId, authMethod }) => void
  logout: () => void
  setProvince: (id, name, code) => void
  completeOnboarding: () => void
  recordVote: (sidangId, voteData) => void
  hasVotedOn: (sidangId: number) => boolean
  setDeviceFingerprint: (fp: string) => void
}

PERSISTENCE:
- Gunakan Zustand persist middleware
- Persist ke localStorage dengan key 'dpn-user-state'
- Semua state otomatis persist dan rehydrate saat page load

MOCK DATA (untuk development):
Buat fungsi mockLogin() yang set state dengan data dummy:
{
  isLoggedIn: true,
  userId: 'mock-user-001',
  authMethod: 'google',
  provinceId: 'jatim',
  provinceName: 'Jawa Timur',
  provinceCode: 'JI',
  hasCompletedOnboarding: true,
  votes: {
    14: {
      position: 'setuju',
      opinionText: 'Pendidikan gratis itu hak dasar.',
      timestamp: '2026-03-28T14:30:00Z',
      voteId: 'DPN/SID/014/2026/00000026'
    }
  }
}

Buat juga fungsi mockReset() yang clear semua state — untuk testing flow dari awal.
```

### TASK 2.2 — Route Protection & Navigation Logic

```
BUAT middleware/logic routing yang mengontrol akses halaman berdasarkan user state.

FILE: /lib/navigation.ts dan/atau middleware.ts

ROUTING RULES:

/ (Landing)
  → Jika logged in + punya provinsi → redirect /sidang
  → Jika logged in + belum provinsi → redirect /register
  → Jika belum login → tampilkan landing

/auth
  → Jika sudah logged in → redirect sesuai state (register/sidang)
  → Jika belum login → tampilkan auth

/register
  → Jika belum login → redirect /auth
  → Jika sudah punya provinsi → redirect /sidang
  → Jika login tapi belum provinsi → tampilkan register

/onboarding
  → Jika belum login → redirect /auth
  → Jika belum provinsi → redirect /register
  → Jika sudah onboarding → redirect /sidang
  → Jika login + provinsi + belum onboarding → tampilkan

/sidang
  → Jika belum login → TETAP TAMPILKAN (read-only mode)
  → Jika login tapi belum provinsi → tampilkan banner "Daftar dulu untuk bersuara"
  → Jika login + provinsi → full access

/sidang/[id]
  → Sama seperti /sidang — bisa dilihat tanpa login, tapi tidak bisa vote

/sidang/[id]/podium
  → Jika belum login → redirect /auth dengan return URL
  → Jika belum provinsi → redirect /register
  → Jika sudah vote di sidang ini → redirect /sidang/[id] dengan toast "Kamu sudah bersuara"
  → Jika login + provinsi + belum vote → tampilkan form

/settings
  → Jika belum login → redirect /auth

IMPLEMENTASI:
- Untuk Next.js App Router: gunakan server-side redirect di layout.tsx atau page.tsx
- ATAU gunakan client-side hook useAuthGuard() yang cek state dan redirect
- Return URL: saat redirect ke /auth, simpan intended destination di query param (?redirect=/sidang/14/podium) agar setelah login bisa kembali

READ-ONLY MODE:
Saat user belum login tapi buka /sidang atau /sidang/[id]:
- Semua konten terlihat normal
- Tombol "Naik Podium" diganti: "Masuk untuk Bersuara →" — tap → /auth
- Node yang di-tap tetap buka bottom sheet
- Share card tetap bisa dilihat
- Tapi tidak bisa submit vote
```

### TASK 2.3 — Global Layout & Navigation Bar

```
BUAT layout wrapper yang ada di seluruh halaman (kecuali landing, auth, onboarding).

FILE: /app/(main)/layout.tsx

LAYOUT:

1. HALAMAN TANPA NAV BAR:
   / (landing), /auth, /register, /onboarding — full screen, tanpa nav

2. HALAMAN DENGAN NAV BAR:
   /sidang, /sidang/[id], /sidang/[id]/podium, /settings — ada bottom nav

BOTTOM NAVIGATION BAR:
- Fixed di bottom, background --surface-1, border-top 1px --surface-3
- Height: 56px + env(safe-area-inset-bottom)
- Padding horizontal: 24px

3 item navigasi:

[Sidang]        [Aktif]        [Akun]
  📋              🏛              👤

- Sidang (📋): navigasi ke /sidang — list semua sidang
- Aktif (🏛): navigasi ke sidang yang sedang aktif (/sidang/[id] yang status='aktif' pertama)
- Akun (👤): navigasi ke /settings

Item styling:
- Icon: 20px, centered di atas label
- Label: 10px, weight 500, centered
- Inactive: --text-tertiary (icon dan label)
- Active: --accent (icon dan label)
- Tap area: masing-masing 1/3 lebar bar, full height

JANGAN gunakan icon library berat. Gunakan emoji atau SVG sederhana yang inline.

SPECIAL CASE:
- Jika user BELUM LOGIN, nav bar tetap ada tapi item "Akun" diganti dengan "Masuk" (→ /auth)
- Halaman /sidang/[id]/podium: nav bar HIDDEN (form penuh layar, ada breadcrumb sendiri)
```

---

## PHASE 3 — User-Aware UI Updates

### TASK 3.1 — Sidang Aktif: Post-Vote State

```
MASALAH:
Setelah user vote di sidang tertentu, halaman sidang aktif (/sidang/[id]) tidak berubah. Tidak ada feedback bahwa user sudah bersuara. CTA "Naik Podium" masih muncul.

INSTRUKSI:

Cek user state: apakah user sudah vote di sidang ini (useUserStore.hasVotedOn(sidangId)).

JIKA SUDAH VOTE:

1. CTA "Naik Podium" DIGANTI dengan:
   - Bar kecil, full width, height 44px, background --surface-1, border-top 1px --surface-3
   - Centered text: "✓ Kamu sudah bersuara" — 13px, --text-secondary, serif italic
   - Saat di-tap: buka modal/bottom sheet dengan vote receipt user (lihat TASK 3.3)
   - Fixed di bottom (gantikan posisi CTA Naik Podium)

2. NODE PROVINSI USER di-highlight:
   - Node provinsi user punya ring 2px --accent permanen (bukan hanya saat di-tap)
   - Ini memberi visual: "itu kamu di ruang sidang ini"

3. SECTION SUARA TERBARU:
   - Jika suara user adalah yang terbaru, tampilkan suara user
   - Label tambahan: "Suaramu" — badge kecil, --accent background, teks gelap
   - Di samping nama provinsi

JIKA BELUM VOTE:
- Tampilkan CTA "Naik Podium" seperti biasa (sudah ada)

JIKA BELUM LOGIN:
- CTA diganti: "Masuk untuk Bersuara →" — style sama dengan "Naik Podium" tapi teks berbeda
- Tap → /auth?redirect=/sidang/[id]/podium
```

### TASK 3.2 — Konfirmasi Setelah Vote

```
HALAMAN: masih di /sidang/[id]/podium — bukan route baru, tapi state baru setelah submit.

Setelah user tap "Kirim ke Sidang" dan berhasil:

FLOW ANIMASI:
0ms:     Button text → spinner (CSS, 16px, border 2px --accent)
1000ms:  Spinner → checkmark SVG (draw-on, 400ms)
1400ms:  Seluruh form content fade out (200ms)
1600ms:  Konfirmasi content fade in + slide up 8px (300ms)

KONTEN KONFIRMASI (replace form, centered):

1. CHECKMARK:
   - Lingkaran: 64px, border 2px --accent, background transparent
   - Checkmark: SVG stroke --accent, 24px
   - Centered

2. HEADING:
   - "Suaramu tercatat." — serif, 22px, --text-primary
   - Margin top: 20px

3. SUBTEXT:
   - "Tersimpan permanen di arsip DPN." — 13px, --text-tertiary
   - Margin top: 8px

4. VOTE RECEIPT CARD:
   - Card dari desain share card yang sudah diperbaiki
   - Margin top: 32px
   - Max-width: 340px, centered
   - Menampilkan: header DPN, kutipan user, posisi, statistik, footer

5. ACTIONS:
   - "↗ Bagikan" — full width, --accent, 48px height, radius --radius-md
   - Tap → Web Share API jika available, fallback copy link
   - Margin top: 24px

   - "Kembali ke Sidang" — text button, --text-secondary, centered, 14px
   - Tap → navigasi ke /sidang/[id]
   - Margin top: 12px

6. SPACER BAWAH:
   - env(safe-area-inset-bottom) + 24px

STATE:
- Setelah konfirmasi tampil, recordVote() di Zustand store
- Jika user tap back (browser back), bawa ke /sidang/[id] BUKAN kembali ke form
- Jika user refresh halaman setelah vote, tampilkan konfirmasi lagi (cek store)
```

### TASK 3.3 — Riwayat Vote User (Bottom Sheet)

```
Di halaman sidang aktif, saat user sudah vote dan tap bar "✓ Kamu sudah bersuara", buka bottom sheet yang menampilkan vote receipt mereka.

BOTTOM SHEET:

1. HANDLE BAR:
   - 40px lebar, 4px tinggi, --surface-3, centered, radius 2px
   - Margin top: 12px

2. HEADER:
   - "Suaramu di Sidang #014" — sans-serif, 16px, weight 600, --text-primary
   - Close button (✕) kanan, 24px, tap area 44px, --text-tertiary
   - Margin top: 16px dari handle

3. KONTEN:
   - Posisi vote: dot warna + "Setuju"/"Tolak"/"Abstain" — 14px, weight 600, warna semantic
   - Margin top: 12px
   
   - Kutipan (jika ada):
     - Serif italic, 15px, --text-primary
     - Border-left: 2px --accent
     - Padding-left: 14px
     - Margin top: 12px
   
   - Metadata:
     - Vote ID: "DPN/SID/014/2026/00000026" — monospace, 11px, --text-tertiary
     - Tanggal: "28 Mar 2026" — 11px, --text-tertiary
     - Margin top: 12px
   
   - Divider: 1px --surface-3, margin 16px vertikal

4. ACTIONS dalam sheet:
   - "↗ Bagikan Kartu Suara" — full width, --accent, 44px
   - Margin bottom: env(safe-area-inset-bottom) + 16px

MAX HEIGHT: 50% viewport
BACKDROP: rgba(12,12,10, 0.6) + blur(4px)
SLIDE: dari bawah, 250ms ease-out
```

---

## PHASE 4 — Settings & Profile

### TASK 4.1 — Settings Page

```
HALAMAN: /settings

Halaman minimal. Bukan profile page yang kompleks — ini cuma settings dasar.

LAYOUT:

1. HEADER:
   - .overline-label: "PENGATURAN"
   - Heading: "Akunmu" — serif, 24px
   - Margin bottom: 24px

2. INFO SECTION:
   - Card background --surface-1, radius --radius-md, padding 16px
   
   Baris 1:
   - Label: "Provinsi" — 12px, --text-tertiary
   - Value: "Jawa Timur" — 15px, --text-primary, weight 500
   
   Baris 2:
   - Label: "Metode login" — 12px, --text-tertiary
   - Value: "Google" — 15px, --text-primary
   
   Baris 3:
   - Label: "Terdaftar sejak" — 12px, --text-tertiary
   - Value: "28 Maret 2026" — 15px, --text-primary
   
   Baris 4:
   - Label: "Jumlah suara" — 12px, --text-tertiary
   - Value: "3 sidang" — 15px, --text-primary
   
   Spacing antar baris: 16px
   Divider antar baris: 1px --surface-2

3. RIWAYAT VOTE:
   - .overline-label: "RIWAYAT SUARAMU" — margin top 32px, margin bottom 12px
   
   List card kecil per sidang yang sudah di-vote:
   
   ┌────────────────────────────────────────┐
   │ #014 · 28 Mar 2026         ● Setuju   │
   │ RUU Pendidikan Gratis Nasional        │
   └────────────────────────────────────────┘
   
   - Background: --surface-1, radius --radius-md, padding 12px 16px
   - Nomor + tanggal: 12px, --text-tertiary
   - Posisi: dot + text, warna semantic, 12px, weight 600, aligned right
   - Judul: serif, 15px, --text-primary
   - Gap antar card: 8px
   - Tap card → buka bottom sheet vote receipt (TASK 3.3)
   
   Jika belum vote apapun:
   - "Belum ada suara tercatat." — 14px, --text-secondary, serif italic
   - "Kunjungi sidang aktif untuk bersuara." — 12px, --text-tertiary

4. ACTIONS:
   - Margin top: 32px
   
   "Keluar" — full width, height 44px
   - Background: transparent
   - Border: 1px --surface-3
   - Text: "Keluar dari DPN" — 14px, --text-secondary
   - Radius: --radius-md
   - Tap → konfirmasi: "Yakin mau keluar?" di simple dialog
   - Konfirmasi → logout() di store, redirect ke /

5. FOOTER:
   - Margin top: 40px
   - "DPN v0.1" — 11px, --text-tertiary
   - "Platform aspirasi publik. Bukan lembaga negara." — 11px, --text-tertiary, italic
   - Margin bottom: nav bar height + 16px
```

---

## PHASE 5 — States & Polish

### TASK 5.1 — Empty States

```
Buat empty state untuk setiap skenario. SEMUA empty state hanya teks — tidak ada ilustrasi, tidak ada emoji besar, tidak ada gambar.

1. FILTER TIDAK ADA HASIL (Semua Pendapat):
   Centered dalam area konten:
   "Tidak ada pendapat dengan filter ini." — serif italic, 15px, --text-secondary
   "Coba ubah filter atau jadi yang pertama bersuara." — 13px, --text-tertiary, margin top 4px

2. SIDANG BELUM ADA PENDAPAT:
   Di area SUARA TERBARU:
   "Belum ada suara." — serif italic, 15px, --text-secondary, centered dalam container
   "Jadilah yang pertama." — 13px, --text-tertiary

3. RISALAH KOSONG (tidak mungkin tapi just in case):
   "Belum ada sidang terdaftar." — serif italic, 15px, --text-secondary, centered

4. SEARCH PROVINSI TIDAK KETEMU:
   "Provinsi tidak ditemukan." — 14px, --text-secondary, centered, margin top 40px
   "Pastikan ejaan benar." — 12px, --text-tertiary

5. RIWAYAT VOTE KOSONG (Settings):
   "Belum ada suara tercatat." — serif italic, 14px, --text-secondary
   "Kunjungi sidang aktif untuk bersuara." — 12px, --text-tertiary

6. READ-ONLY BANNER (belum login, buka /sidang):
   Banner di atas list:
   - Background: rgba(--accent, 0.08)
   - Border: 1px rgba(--accent, 0.15)
   - Padding: 12px 16px, radius --radius-md
   - Teks: "Kamu belum masuk." — 13px, --text-primary
   - CTA inline: "Masuk untuk bersuara →" — --accent, weight 600
   - Margin bottom: 16px

7. BELUM DAFTAR PROVINSI BANNER (login tapi belum provinsi):
   Sama seperti #6 tapi:
   - Teks: "Pilih provinsimu dulu untuk bersuara."
   - CTA: "Daftar sekarang →" — tap ke /register
```

### TASK 5.2 — Loading States

```
Buat loading states untuk setiap halaman/komponen yang memuat data.

PRINSIP: Skeleton screens, bukan spinner. Skeleton yang pulse halus.

1. RISALAH LIST LOADING:
   3 skeleton cards:
   - Rectangle --surface-2, height 20px, width 50%, radius --radius-sm (judul)
   - Rectangle --surface-2, height 12px, width 30%, margin top 8px (meta)
   - Rectangle --surface-2, height 6px, width 100%, margin top 12px (voting bar)
   - Card wrapper: background --surface-1, padding 16px, radius --radius-md, border 1px --surface-3
   - Gap antar skeleton card: 12px
   - Animasi pulse: opacity 0.3 → 0.6 → 0.3, duration 1.5s, ease-in-out, infinite

2. PENDAPAT LIST LOADING:
   3 skeleton items:
   - Rectangle --surface-2, height 14px, width 25% (provinsi)
   - Rectangle --surface-2, height 14px, width 85%, margin top 10px (kutipan baris 1)
   - Rectangle --surface-2, height 14px, width 65%, margin top 6px (kutipan baris 2)
   - Rectangle --surface-2, height 10px, width 40%, margin top 10px (metadata)
   - Border-left: 2px --surface-3
   - Padding-left: 16px
   - Pulse sama

3. SIDANG AKTIF LOADING:
   - Podium: rectangle --surface-2, 80x70px, centered, radius --radius-sm
   - Summary bar: rectangle --surface-2, height 6px, width 60%, centered, margin top 16px
   - Node area: 3 baris of rectangles --surface-2, masing-masing 36x26px, gap 6px, centered, staggered widths
   - Pulse sama

4. SUBMIT VOTE LOADING:
   Sudah didefinisikan di TASK 3.2: button spinner → checkmark → konfirmasi

5. PAGE TRANSITION:
   - Setiap halaman saat pertama load: content fade in + translateY(8px → 0), 250ms, ease-out
   - Stagger: max 3 children, 50ms interval, lalu semua langsung muncul

6. MOCK API DELAY:
   Semua mock data harus punya artificial delay:
   - List data: 500ms delay
   - Submit vote: 1000ms delay
   - Auth: 1000ms delay
   Ini untuk testing UX loading states agar realistis.

SEMUA skeleton pulse harus di-disable jika prefers-reduced-motion.
```

### TASK 5.3 — Error States

```
Buat error handling visual untuk berbagai skenario.

1. NETWORK ERROR (halaman gagal load):
   Centered dalam area konten:
   - "Gagal memuat." — serif, 16px, --text-secondary
   - "Periksa koneksi internet." — 13px, --text-tertiary, margin top 4px
   - Button: "Coba Lagi" — outlined, border 1px --accent, text --accent, height 40px, padding 0 24px, radius --radius-md, margin top 20px
   - Tap → re-fetch data

2. SUBMIT ERROR (vote gagal):
   Error bar muncul di atas submit button:
   - Background: rgba(--tolak, 0.1)
   - Border: 1px rgba(--tolak, 0.2)
   - Text: "Gagal mengirim suara. Coba lagi." — 13px, --tolak
   - Padding: 10px 16px, radius --radius-sm
   - Auto-dismiss: 5 detik (fade out 200ms)
   - Button kembali ke state enabled

3. AUTH ERROR:
   Sudah didefinisikan di TASK 1.2

4. ALREADY VOTED ERROR:
   Jika entah bagaimana user sampai ke /podium tapi sudah vote:
   - Tampilkan centered:
     "Kamu sudah bersuara di sidang ini." — serif, 16px, --text-secondary
     "← Kembali ke Sidang" — text button, --accent, margin top 16px

5. SIDANG CLOSED ERROR:
   Jika user buka /podium tapi sidang sudah selesai:
   - "Sidang ini sudah ditutup." — serif, 16px, --text-secondary
   - "Lihat hasil →" — text button, --accent → navigasi ke /sidang/[id]

PRINSIP:
- Error teks saja, tidak ada ilustrasi
- Selalu ada action (coba lagi / kembali) — jangan dead end
- Error TIDAK persistent — auto-dismiss atau bisa di-dismiss manual
```

### TASK 5.4 — Toast/Notification System

```
Buat simple toast notification system untuk feedback singkat.

KOMPONEN: <Toast />

POSISI: top center, di bawah status bar/notch, fixed
STYLING:
- Background: --surface-1
- Border: 1px --surface-3
- Border-radius: --radius-md
- Padding: 12px 16px
- Max-width: 320px
- Text: 13px, --text-primary
- Shadow: tidak ada (sesuai design system — pakai border saja)

TYPES:
- default: border --surface-3, text --text-primary
- success: border-left 3px --setuju, text --text-primary
- error: border-left 3px --tolak, text --text-primary

BEHAVIOR:
- Slide in dari atas: translateY(-20px → 0) + opacity(0 → 1), 250ms ease-out
- Auto-dismiss setelah 3 detik
- Slide out: translateY(0 → -20px) + opacity(1 → 0), 200ms ease-in
- Hanya 1 toast visible sekaligus (yang baru replace yang lama)

USAGE:
- Setelah login berhasil: toast success "Berhasil masuk"
- Setelah logout: toast default "Kamu sudah keluar"
- Redirect karena sudah vote: toast default "Kamu sudah bersuara di sidang ini"
- Copy link berhasil: toast success "Link disalin"
- Error: toast error dengan pesan error

STORE:
Tambahkan ke Zustand atau buat store terpisah:
{
  toast: { message: string, type: 'default'|'success'|'error' } | null,
  showToast: (message, type) => void,
  hideToast: () => void
}
```

---

## PHASE 6 — Final Integration

### TASK 6.1 — Behavioral Data Collection

```
Buat invisible behavioral tracking untuk anti-fraud scoring.

FILE: /lib/behavioral.ts

HOOK: useBehavioralTracker()

Gunakan di halaman /sidang/[id] dan /sidang/[id]/podium.

YANG DI-TRACK:

const behavioralData = {
  timeOnPage: number,         // detik sejak halaman mount
  scrollDepth: number,        // 0-1, max scroll position / page height
  touchEvents: number,        // counter setiap touch/click
  typingDuration: number,     // ms total waktu mengetik di textarea
  typingPauses: number,       // jumlah pause > 500ms saat mengetik
  pagesVisitedBefore: number, // berapa route change sebelum sampai di podium
  readOpinions: boolean,      // apakah pernah buka tab "Semua Pendapat"
  timeBeforeVote: number,     // detik antara halaman podium mount dan klik posisi
  tappedNodes: number,        // berapa node provinsi yang di-tap di sidang aktif
}

COLLECTION:
- timeOnPage: increment setiap detik via setInterval
- scrollDepth: listen scroll event, track max
- touchEvents: listen touchstart/click, increment counter
- typingDuration: track onFocus dan onBlur di textarea, hitung delta
- typingPauses: track keydown timing, count gaps > 500ms
- pagesVisitedBefore: increment counter di Zustand on route change
- readOpinions: set true saat tab "Semua Pendapat" di-tap
- timeBeforeVote: timestamp saat mount - timestamp saat posisi dipilih
- tappedNodes: increment saat node bottom sheet dibuka

SCORING:
Hitung score 0-100 berdasarkan rules:

timeOnPage > 10 detik: +15
scrollDepth > 0.3: +10
touchEvents > 5: +10
typingDuration > 3000ms: +15 (mengetik > 3 detik)
typingPauses > 1: +10 (ada jeda berpikir)
readOpinions == true: +10
timeBeforeVote > 5 detik: +15
tappedNodes > 0: +15

Total max: 100

KIRIM:
Saat vote di-submit, sertakan behavioralData dan behaviorScore bersama vote payload.
Untuk sekarang (mock), simpan di localStorage bersama vote record.
Nanti saat backend ada, kirim sebagai bagian dari POST /vote request.

PRIVASI:
- Data ini ANONYMIZED — tidak ada PII
- Simpan aggregated score, bukan raw tracking data
- Tidak perlu consent popup karena ini bukan PII

USER TIDAK BOLEH TAHU tracking ini ada. Tidak ada visual indicator apapun.
```

### TASK 6.2 — Device Fingerprint Integration

```
Integrasikan device fingerprinting menggunakan @fingerprintjs/fingerprintjs (open source).

INSTALL: @fingerprintjs/fingerprintjs (MIT license, gratis)

FILE: /lib/fingerprint.ts

INIT:
- Saat app pertama kali load (di root layout), generate fingerprint
- Simpan di Zustand store (deviceFingerprint)
- Simpan juga di localStorage sebagai backup

USAGE:
- Sertakan device fingerprint di setiap vote submission
- Sertakan saat registrasi (create user)
- Nanti backend bisa cross-check: 1 device = max 2 akun

IMPLEMENTASI:
import FingerprintJS from '@fingerprintjs/fingerprintjs'

async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId // string hash unik per device
}

Panggil sekali saat app mount, simpan hasilnya. Jangan panggil setiap page load (expensive).

JANGAN tampilkan fingerprint ke user. Ini invisible infrastructure.
```

### TASK 6.3 — Full Flow Test Checklist

```
INI BUKAN CODING TASK. Ini checklist manual untuk memastikan seluruh flow bekerja end-to-end.

Buka app di viewport 360x800 (Chrome DevTools → iPhone SE atau custom).

TEST 1 — First Time User:
[ ] Buka / → landing page muncul
[ ] Tap "Masuk sebagai Warga" → /auth
[ ] Tap "Masuk dengan Google" → loading → mock login → redirect /register
[ ] Search "jawa" → filter berfungsi, tampilkan provinsi Jawa
[ ] Tap "Jawa Timur" → konfirmasi muncul
[ ] Tap "Masuk ke Sidang →" → /onboarding
[ ] Swipe 3 screens → tap "Mulai" → /sidang
[ ] Risalah list muncul dengan cards
[ ] Nav bar ada di bawah dengan 3 item

TEST 2 — Browsing:
[ ] Tap card sidang aktif → /sidang/14
[ ] Halaman sidang aktif muncul: judul, podium, nodes, suara terbaru
[ ] Semua 38 nodes visible, tidak terpotong
[ ] Tap node → bottom sheet muncul dengan pendapat
[ ] Tutup bottom sheet
[ ] Tap tab "Semua Pendapat" di risalah → list pendapat muncul
[ ] Filter chips berfungsi
[ ] Search berfungsi

TEST 3 — Voting:
[ ] Tap "Naik Podium" → /sidang/14/podium
[ ] Context box sidang ada
[ ] Tap "Setuju" → tombol berubah warna, lainnya dim
[ ] Ketik pendapat di textarea → counter update
[ ] Tap "Kirim ke Sidang" → spinner → checkmark → konfirmasi
[ ] Vote receipt card muncul
[ ] Tap "Bagikan" → share dialog atau copy feedback
[ ] Tap "Kembali ke Sidang" → /sidang/14
[ ] CTA "Naik Podium" diganti "✓ Kamu sudah bersuara"
[ ] Node provinsi user punya ring accent

TEST 4 — Return Visit:
[ ] Refresh halaman → masih logged in (state persist)
[ ] Buka / → redirect ke /sidang (skip landing)
[ ] Buka /sidang/14/podium → redirect karena sudah vote → toast muncul

TEST 5 — Read-Only:
[ ] Logout → redirect ke /
[ ] Tap "Lihat sidang tanpa masuk" → /sidang
[ ] Banner "Kamu belum masuk" muncul di atas
[ ] Bisa browse semua sidang dan pendapat
[ ] Tap "Naik Podium" → tombol berteks "Masuk untuk Bersuara" → redirect /auth

TEST 6 — Settings:
[ ] Tap "Akun" di nav bar → /settings
[ ] Info provinsi, metode login, tanggal daftar muncul
[ ] Riwayat vote muncul (card kecil per sidang)
[ ] Tap card → bottom sheet vote receipt
[ ] Tap "Keluar dari DPN" → konfirmasi → logout → redirect /

TEST 7 — Edge Cases:
[ ] Di setiap halaman: tidak ada overflow horizontal
[ ] Di setiap halaman: tidak ada teks yang terpotong
[ ] Semua heading serif, semua kutipan serif italic
[ ] Semua tombol bisa di-tap (min 44px)
[ ] Loading states muncul saat delay (skeleton/spinner)
[ ] Empty states muncul saat data kosong
```

---

## Execution Order

```
HARI 1:
├── TASK 0    — Context update (paste sekali)
├── TASK 2.1  — User state management (Zustand) ← PERTAMA
├── TASK 1.1  — Landing page
└── TASK 1.2  — Auth page

HARI 2:
├── TASK 1.3  — Registrasi provinsi redesign
├── TASK 1.4  — Onboarding 3 screens
└── TASK 2.2  — Route protection & navigation logic

HARI 3:
├── TASK 2.3  — Global layout & nav bar
├── TASK 3.1  — Post-vote state di sidang aktif
└── TASK 3.2  — Konfirmasi setelah vote

HARI 4:
├── TASK 3.3  — Riwayat vote bottom sheet
├── TASK 4.1  — Settings page
└── TASK 5.4  — Toast system

HARI 5:
├── TASK 5.1  — Empty states (semua)
├── TASK 5.2  — Loading states (semua)
└── TASK 5.3  — Error states (semua)

HARI 6:
├── TASK 6.1  — Behavioral tracking
├── TASK 6.2  — Device fingerprint
└── TASK 6.3  — Full flow test (manual)

TOTAL: 6 hari kerja
Setelah ini: seluruh frontend DPN lengkap end-to-end, siap disambungkan ke Supabase backend.
```