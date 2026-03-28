# Node Grid — Full Deep Dive

Sebelum task plan, saya perlu jujur tentang **akar masalahnya dulu**.

---

## Diagnosis Akar Masalah

Setelah melihat semua iterasi node grid yang sudah ada, masalahnya bukan di styling atau warna. **Masalahnya ada di konsep layout yang salah dari awal.**

Semua versi yang sudah dibuat menggunakan pendekatan:
- Force simulation → hasilnya random scatter
- Absolute positioning manual → hasilnya random scatter yang berbeda
- CSS grid biasa → hasilnya grid kaku tanpa makna

**Kenapa hemicycle susah diimplementasikan dengan prompt AI?**

Karena hemicycle butuh **trigonometri** — setiap node posisinya dihitung dari sudut dan radius, bukan dari grid row/column. AI coding agent sering "memahami" konsep ini tapi mengeksekusinya dengan approximation yang salah, atau menghasilkan kode yang secara matematis benar tapi secara visual broken karena tidak memperhitungkan viewport constraint.

**Keputusan yang harus dibuat sekarang:**

Hemicycle murni (kurva parlemen) vs pendekatan alternatif yang lebih implementable tapi tetap bermakna.

Saya akan kasih **dua opsi**, pilih satu, lalu ada task plan spesifik untuk opsi yang dipilih.

---

## Opsi A — Hemicycle Matematis (Yang Selalu Dimaksud)

```
Tampak dari atas:

          [ PODIUM ]
        ● ● ● ● ● ← Arc 1 (5 nodes, radius terkecil)
      ● ● ● ● ● ● ● ← Arc 2 (7 nodes)
    ● ● ● ● ● ● ● ● ● ← Arc 3 (9 nodes)
  ● ● ● ● ● ● ● ● ● ● ← Arc 4 (10 nodes)
● ● ● ● ● ● ● ● ● ● ● ← Arc 5 (7 nodes)
```

Posisi setiap node = f(sudut, radius)  
Butuh trigonometri yang benar  
Paling visual impactful jika berhasil  
Paling sering gagal dalam implementasi AI

---

## Opsi B — Staggered Pyramid (Rekomendasi Saya)

```
Tampak dari atas:

            [ PODIUM ]
          ● ● ● ● ●         ← Baris 1: 5 nodes, centered
        ● ● ● ● ● ● ●       ← Baris 2: 7 nodes, centered
      ● ● ● ● ● ● ● ● ●     ← Baris 3: 9 nodes, centered
    ● ● ● ● ● ● ● ● ● ● ●   ← Baris 4: 11 nodes, centered
  ● ● ● ● ● ●               ← Baris 5: 6 nodes, centered
```

Baris lurus horizontal, tapi setiap baris centered dan jumlah node bertambah  
Memberi kesan "mengembang ke luar" seperti kursi parlemen  
Jauh lebih mudah diimplementasikan dengan CSS Flexbox  
Tidak ada trigonometri  
Tetap bermakna: "baris depan lebih dekat podium, baris belakang lebih banyak orang"

**Saya rekomendasikan Opsi B** karena:
1. Dijamin implementable tanpa bug matematika
2. Di mobile 360px, perbedaan visual antara hemicycle kurva dan pyramid lurus hampir tidak terlihat
3. Lebih mudah maintain dan debug
4. Bisa di-upgrade ke hemicycle nanti setelah yang lain beres

---

## Keputusan Layout Opsi B: Distribusi 38 Provinsi

```
Urutan node: Geografis barat→timur, utara→selatan per row

Baris 1 (5 node) — Jawa Inti:
JK  JB  JT  YO  BT

Baris 2 (7 node) — Sumatera Selatan + Jawa sisa:
BE  LA  BB  KR  JI  BA  NB

Baris 3 (9 node) — Sumatera Utara + Kalimantan:
AC  SU  SB  RI  JA  KB  KT  KS  KI

Baris 4 (9 node) — Sulawesi + Nusa Tenggara:
SN  ST  SG  GO  SR  SA  NT  KU  SS

Baris 5 (8 node) — Maluku + Papua:
MA  MU  PA  PB  PS  PT  PP  PD
```

Total: 5 + 7 + 9 + 9 + 8 = 38 ✓

---

## TASK PLAN — NODE GRID DEFINITIVE FIX

### TASK NODE-0 — Isolated Sandbox First

```
SEBELUM mengubah apapun di codebase utama, buat file HTML TERPISAH 
untuk develop dan test node grid secara isolated.

Buat file: node-grid-test.html

File ini standalone — tidak perlu Next.js, tidak perlu import apapun.
Hanya HTML + CSS + vanilla JS dalam satu file.

Tujuan: kita pastikan node grid benar di isolated environment dulu,
baru kemudian dipindahkan ke codebase utama.

SETUP:

<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <title>DPN Node Grid Test</title>
  <style>
    /* CSS custom properties */
    :root {
      --surface-0: #0c0c0a;
      --surface-1: #16150f;
      --surface-2: #201e16;
      --surface-3: #2a2820;
      --text-primary: #e8e4d9;
      --text-secondary: #9c9787;
      --text-tertiary: #6b6557;
      --accent: #b8a472;
      --setuju: #7a9c6e;
      --tolak: #b5564e;
      --abstain: #8a8475;
      --radius-sm: 4px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      background: var(--surface-0);
      color: var(--text-primary);
      font-family: system-ui, sans-serif;
      /* SIMULASI MOBILE VIEWPORT */
      max-width: 390px;
      margin: 0 auto;
      padding: 16px;
      min-height: 100vh;
    }

    /* DEBUG OVERLAY — tampilkan viewport info */
    #debug {
      position: fixed;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255,0,0,0.8);
      color: white;
      padding: 4px 8px;
      font-size: 11px;
      z-index: 999;
    }
  </style>
</head>
<body>
  <div id="debug">viewport: <span id="vw"></span>px</div>
  <div id="grid-container"></div>
  
  <script>
    // Update viewport info
    document.getElementById('vw').textContent = window.innerWidth;
    window.addEventListener('resize', () => {
      document.getElementById('vw').textContent = window.innerWidth;
    });
  </script>
</body>
</html>

Buka file ini di browser.
Buka DevTools → device toolbar → set ke 390x844 (iPhone 14).
Test di sini. JANGAN di desktop full width.
```

### TASK NODE-1 — Data Layer

```
Dalam node-grid-test.html, tambahkan JavaScript data layer.

TAMBAHKAN di dalam <script>:

const PROVINCES = [
  // BARIS 1 — Jawa Inti (5 node)
  { id: 'jk',  code: 'JK',  name: 'DKI Jakarta',          row: 0 },
  { id: 'jb',  code: 'JB',  name: 'Jawa Barat',            row: 0 },
  { id: 'jt',  code: 'JT',  name: 'Jawa Tengah',           row: 0 },
  { id: 'yo',  code: 'YO',  name: 'DI Yogyakarta',         row: 0 },
  { id: 'bt',  code: 'BT',  name: 'Banten',                row: 0 },

  // BARIS 2 (7 node)
  { id: 'be',  code: 'BE',  name: 'Bengkulu',              row: 1 },
  { id: 'la',  code: 'LA',  name: 'Lampung',               row: 1 },
  { id: 'bb',  code: 'BB',  name: 'Kep. Bangka Belitung',  row: 1 },
  { id: 'kr',  code: 'KR',  name: 'Kep. Riau',             row: 1 },
  { id: 'ji',  code: 'JI',  name: 'Jawa Timur',            row: 1 },
  { id: 'ba',  code: 'BA',  name: 'Bali',                  row: 1 },
  { id: 'nb',  code: 'NB',  name: 'Nusa Tenggara Barat',   row: 1 },

  // BARIS 3 (9 node)
  { id: 'ac',  code: 'AC',  name: 'Aceh',                  row: 2 },
  { id: 'su',  code: 'SU',  name: 'Sumatera Utara',        row: 2 },
  { id: 'sb',  code: 'SB',  name: 'Sumatera Barat',        row: 2 },
  { id: 'ri',  code: 'RI',  name: 'Riau',                  row: 2 },
  { id: 'ja',  code: 'JA',  name: 'Jambi',                 row: 2 },
  { id: 'kb',  code: 'KB',  name: 'Kalimantan Barat',      row: 2 },
  { id: 'kt',  code: 'KT',  name: 'Kalimantan Timur',      row: 2 },
  { id: 'ks',  code: 'KS',  name: 'Kalimantan Selatan',    row: 2 },
  { id: 'ki',  code: 'KI',  name: 'Kalimantan Utara',      row: 2 },

  // BARIS 4 (9 node)
  { id: 'sn',  code: 'SN',  name: 'Sulawesi Selatan',      row: 3 },
  { id: 'st',  code: 'ST',  name: 'Sulawesi Tengah',       row: 3 },
  { id: 'sg',  code: 'SG',  name: 'Sulawesi Tenggara',     row: 3 },
  { id: 'go',  code: 'GO',  name: 'Gorontalo',             row: 3 },
  { id: 'sr',  code: 'SR',  name: 'Sulawesi Barat',        row: 3 },
  { id: 'sa',  code: 'SA',  name: 'Sulawesi Utara',        row: 3 },
  { id: 'nt',  code: 'NT',  name: 'Nusa Tenggara Timur',   row: 3 },
  { id: 'ku',  code: 'KU',  name: 'Kalimantan Tengah',     row: 3 },
  { id: 'ss',  code: 'SS',  name: 'Sumatera Selatan',      row: 3 },

  // BARIS 5 (8 node)
  { id: 'ma',  code: 'MA',  name: 'Maluku',                row: 4 },
  { id: 'mu',  code: 'MU',  name: 'Maluku Utara',          row: 4 },
  { id: 'pa',  code: 'PA',  name: 'Papua',                 row: 4 },
  { id: 'pb',  code: 'PB',  name: 'Papua Barat',           row: 4 },
  { id: 'ps',  code: 'PS',  name: 'Papua Selatan',         row: 4 },
  { id: 'pt',  code: 'PT',  name: 'Papua Tengah',          row: 4 },
  { id: 'pp',  code: 'PP',  name: 'Papua Pegunungan',      row: 4 },
  { id: 'pd',  code: 'PD',  name: 'Papua Barat Daya',      row: 4 },
];

// Mock vote data — campuran status
// Ini nanti akan datang dari props/state di komponen React
const MOCK_VOTES = {
  'jk': 'tolak',
  'jb': 'setuju',
  'jt': 'setuju',
  'yo': 'abstain',
  'bt': 'tolak',
  'be': 'tolak',
  'la': 'setuju',
  'bb': null,
  'kr': null,
  'ji': 'setuju',
  'ba': 'setuju',
  'nb': 'abstain',
  'ac': 'setuju',
  'su': 'tolak',
  'sb': 'setuju',
  'ri': null,
  'ja': null,
  'kb': 'setuju',
  'kt': 'tolak',
  'ks': null,
  'ki': 'setuju',
  'sn': 'setuju',
  'st': null,
  'sg': 'abstain',
  'go': 'setuju',
  'sr': null,
  'sa': 'setuju',
  'nt': 'tolak',
  'ku': null,
  'ss': 'setuju',
  'ma': 'setuju',
  'mu': null,
  'pa': 'setuju',
  'pb': 'abstain',
  'ps': null,
  'pt': null,
  'pp': null,
  'pd': null,
};

// Grouping per row
const ROWS = [
  PROVINCES.filter(p => p.row === 0),
  PROVINCES.filter(p => p.row === 1),
  PROVINCES.filter(p => p.row === 2),
  PROVINCES.filter(p => p.row === 3),
  PROVINCES.filter(p => p.row === 4),
];

// Verifikasi total
console.assert(PROVINCES.length === 38, 'Harus 38 provinsi');
console.log('Total provinsi:', PROVINCES.length);
console.log('Per baris:', ROWS.map(r => r.length));
// Output yang diharapkan: [5, 7, 9, 9, 8]
```

### TASK NODE-2 — CSS Node Styling

```
Dalam node-grid-test.html, tambahkan CSS untuk node styling.

TAMBAHKAN ke dalam <style>:

/* === GRID CONTAINER === */
.node-grid-wrapper {
  width: 100%;
  padding: 0;          /* tidak ada padding ekstra — sudah ada di body */
  overflow: visible;   /* BUKAN overflow hidden */
}

/* === SETIAP BARIS === */
.node-row {
  display: flex;
  flex-direction: row;
  justify-content: center;  /* centered horizontal */
  align-items: center;
  gap: 6px;                 /* jarak antar node dalam satu baris */
  margin-bottom: 6px;       /* jarak antar baris */
  width: 100%;
}

.node-row:last-child {
  margin-bottom: 0;
}

/* === INDIVIDUAL NODE === */
.node {
  /* UKURAN — KRITIS: harus cukup kecil agar semua muat */
  /* Di viewport 390px dengan padding 32px total = 358px usable */
  /* Baris terpanjang 9 node + 8 gap (6px) = 9*W + 48 = 358 */
  /* Jadi: 9W = 310, W = 34px */
  /* Kita pakai 32px untuk safety margin */
  width: 32px;
  height: 26px;
  
  /* Typography */
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  line-height: 1;
  
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  
  /* Shape */
  border-radius: var(--radius-sm);  /* 4px */
  border: 1px solid transparent;
  
  /* Interaction */
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  
  /* Transition */
  transition: transform 150ms ease-out,
              background-color 300ms ease-out,
              border-color 300ms ease-out,
              opacity 300ms ease-out;
  
  /* Prevent text selection on tap */
  touch-action: manipulation;
}

/* === NODE STATES === */

/* Default — belum ada vote dari provinsi ini */
.node[data-status="null"],
.node[data-status=""] {
  background: var(--surface-2);
  border-color: var(--surface-3);
  color: var(--text-tertiary);
  opacity: 0.45;
}

/* Setuju */
.node[data-status="setuju"] {
  background: var(--setuju);
  border-color: var(--setuju);
  color: #ffffff;
  opacity: 1;
}

/* Tolak */
.node[data-status="tolak"] {
  background: var(--tolak);
  border-color: var(--tolak);
  color: #ffffff;
  opacity: 1;
}

/* Abstain */
.node[data-status="abstain"] {
  background: var(--abstain);
  border-color: var(--abstain);
  color: #ffffff;
  opacity: 1;
}

/* === INTERACTION STATES === */

/* Tap/click feedback */
.node:active {
  transform: scale(0.95);
  transition: transform 100ms ease-out;
}

/* Selected (after tap, before bottom sheet closes) */
.node.selected {
  transform: scale(1.05);
  box-shadow: 0 0 0 2px var(--accent);
  transition: transform 150ms ease-out;
}

/* === LEGENDA === */
.node-legend {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 14px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  color: var(--text-tertiary);
  font-family: system-ui, sans-serif;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.setuju  { background: var(--setuju); }
.legend-dot.abstain { background: var(--abstain); }
.legend-dot.tolak   { background: var(--tolak); }
.legend-dot.belum   { background: var(--surface-3); }

/* === TOOLTIP (nama provinsi saat hover/tap) === */
/* Akan diimplementasikan di TASK NODE-4 */
```

### TASK NODE-3 — JavaScript Render Engine

```
Dalam node-grid-test.html, tambahkan JavaScript untuk render grid.

TAMBAHKAN di dalam <script>, setelah data layer:

function getNodeStatus(provinceId) {
  return MOCK_VOTES[provinceId] || null;
}

function renderNode(province) {
  const status = getNodeStatus(province.id);
  const node = document.createElement('div');
  
  node.className = 'node';
  node.setAttribute('data-status', status || '');
  node.setAttribute('data-id', province.id);
  node.setAttribute('data-name', province.name);
  node.textContent = province.code;
  
  // Touch/click handler
  node.addEventListener('click', () => handleNodeTap(province, status));
  
  return node;
}

function renderRow(provinces) {
  const row = document.createElement('div');
  row.className = 'node-row';
  
  provinces.forEach(p => {
    row.appendChild(renderNode(p));
  });
  
  return row;
}

function renderLegend() {
  const legend = document.createElement('div');
  legend.className = 'node-legend';
  
  const items = [
    { label: 'Setuju',  cls: 'setuju' },
    { label: 'Abstain', cls: 'abstain' },
    { label: 'Tolak',   cls: 'tolak' },
    { label: 'Belum',   cls: 'belum' },
  ];
  
  items.forEach(({ label, cls }) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <div class="legend-dot ${cls}"></div>
      <span>${label}</span>
    `;
    legend.appendChild(item);
  });
  
  return legend;
}

function renderGrid() {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';
  
  const wrapper = document.createElement('div');
  wrapper.className = 'node-grid-wrapper';
  
  // Render setiap baris
  ROWS.forEach(rowProvinces => {
    wrapper.appendChild(renderRow(rowProvinces));
  });
  
  // Render legenda
  wrapper.appendChild(renderLegend());
  
  container.appendChild(wrapper);
  
  // POST-RENDER VALIDATION (kritis!)
  validateLayout(wrapper);
}

function validateLayout(wrapper) {
  // Cek apakah ada overflow
  const wrapperRect = wrapper.getBoundingClientRect();
  const bodyWidth = document.body.clientWidth;
  
  if (wrapperRect.width > bodyWidth) {
    console.error(
      '❌ OVERFLOW DETECTED!',
      'Grid width:', wrapperRect.width,
      'Body width:', bodyWidth,
      'Overflow by:', wrapperRect.width - bodyWidth, 'px'
    );
  } else {
    console.log(
      '✅ No overflow.',
      'Grid width:', Math.round(wrapperRect.width) + 'px',
      'Body width:', bodyWidth + 'px',
      'Remaining space:', Math.round(bodyWidth - wrapperRect.width) + 'px'
    );
  }
  
  // Cek setiap node
  const nodes = wrapper.querySelectorAll('.node');
  let allSameSize = true;
  let firstWidth = null;
  
  nodes.forEach(node => {
    const rect = node.getBoundingClientRect();
    if (firstWidth === null) firstWidth = rect.width;
    if (Math.abs(rect.width - firstWidth) > 1) {
      allSameSize = false;
      console.warn('⚠️ Node size inconsistency:', node.dataset.id, rect.width, 'vs expected', firstWidth);
    }
  });
  
  if (allSameSize) {
    console.log('✅ All nodes same size:', firstWidth + 'px');
  }
  
  console.log('Total nodes rendered:', nodes.length);
}

// Handler untuk tap node — nanti dihubungkan ke bottom sheet
function handleNodeTap(province, status) {
  console.log('Tapped:', province.name, '| Status:', status || 'belum vote');
  
  // Hapus selected dari semua node
  document.querySelectorAll('.node.selected').forEach(n => {
    n.classList.remove('selected');
  });
  
  // Tambah selected ke node yang di-tap
  const node = document.querySelector(`[data-id="${province.id}"]`);
  if (node) node.classList.add('selected');
  
  // Placeholder untuk bottom sheet (TASK NODE-4)
  showBottomSheet(province, status);
}

// INIT
renderGrid();
```

### TASK NODE-4 — Overflow Safety System

```
Ini adalah safeguard paling penting.

Masalah yang selalu terjadi: node ukuran fixed + banyak node per baris = overflow di viewport kecil.

Solusinya: hitung ukuran node SECARA DINAMIS berdasarkan viewport width yang tersedia,
bukan hardcode. Ini memastikan grid SELALU muat di viewport apapun.

GANTI ukuran node dari hardcode CSS ke calculated JavaScript.

TAMBAHKAN fungsi ini sebelum renderGrid():

function calculateNodeSize() {
  const VIEWPORT_WIDTH = document.body.clientWidth;
  const PADDING_TOTAL = 32;         // 16px kiri + 16px kanan (dari body padding)
  const USABLE_WIDTH = VIEWPORT_WIDTH - PADDING_TOTAL;
  
  const MAX_NODES_PER_ROW = 9;      // Baris terpanjang (baris 3 dan 4)
  const GAP_PER_ROW = 6;            // CSS gap value
  const GAPS_IN_MAX_ROW = MAX_NODES_PER_ROW - 1;  // 8 gaps untuk 9 nodes
  const TOTAL_GAP = GAPS_IN_MAX_ROW * GAP_PER_ROW; // 48px
  
  const SAFETY_MARGIN = 4;          // Extra buffer
  
  // Max node width agar 9 nodes + 8 gaps muat di usable width
  const maxNodeWidth = Math.floor(
    (USABLE_WIDTH - TOTAL_GAP - SAFETY_MARGIN) / MAX_NODES_PER_ROW
  );
  
  // Clamp: min 24px (masih readable), max 38px (tidak terlalu besar)
  const nodeWidth = Math.max(24, Math.min(38, maxNodeWidth));
  
  // Height: proporsi 3:4 (lebar:tinggi) — lebih tinggi dari lebar
  const nodeHeight = Math.round(nodeWidth * 0.8);
  
  // Font size: proporsional dengan ukuran node
  // Di node 32px lebar, font 9px itu pas. Skala dari sana.
  const fontSize = Math.max(8, Math.round(nodeWidth * 0.28));
  
  console.log('Calculated node size:', {
    viewportWidth: VIEWPORT_WIDTH,
    usableWidth: USABLE_WIDTH,
    nodeWidth,
    nodeHeight,
    fontSize,
    check: `${MAX_NODES_PER_ROW} nodes × ${nodeWidth}px + ${TOTAL_GAP}px gaps = ${MAX_NODES_PER_ROW * nodeWidth + TOTAL_GAP}px (limit: ${USABLE_WIDTH}px)`
  });
  
  return { nodeWidth, nodeHeight, fontSize };
}

MODIFIKASI renderGrid() untuk menggunakan calculated size:

function renderGrid() {
  const container = document.getElementById('grid-container');
  container.innerHTML = '';
  
  // HITUNG UKURAN DULU
  const { nodeWidth, nodeHeight, fontSize } = calculateNodeSize();
  
  const wrapper = document.createElement('div');
  wrapper.className = 'node-grid-wrapper';
  
  // INJECT dynamic styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .node {
      width: ${nodeWidth}px !important;
      height: ${nodeHeight}px !important;
      font-size: ${fontSize}px !important;
    }
  `;
  wrapper.appendChild(styleEl);
  
  ROWS.forEach(rowProvinces => {
    wrapper.appendChild(renderRow(rowProvinces));
  });
  
  wrapper.appendChild(renderLegend());
  container.appendChild(wrapper);
  
  // Recalculate on resize (untuk testing di browser)
  window.addEventListener('resize', () => {
    renderGrid();
  });
  
  validateLayout(wrapper);
}
```

### TASK NODE-5 — Bottom Sheet untuk Node Tap

```
Tambahkan bottom sheet yang muncul saat node di-tap.

TAMBAHKAN ke <style>:

/* === BOTTOM SHEET === */
.bottom-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(12, 12, 10, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity 200ms ease-out;
}

.bottom-sheet-backdrop.visible {
  opacity: 1;
  pointer-events: all;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateY(100%);
  width: 100%;
  max-width: 390px;
  background: var(--surface-1);
  border-top: 1px solid var(--surface-3);
  border-radius: 12px 12px 0 0;
  z-index: 101;
  transition: transform 250ms ease-out;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  
  /* Max height */
  max-height: 55vh;
  overflow-y: auto;
}

.bottom-sheet.visible {
  transform: translateX(-50%) translateY(0);
}

/* Handle bar */
.sheet-handle {
  width: 40px;
  height: 4px;
  background: var(--surface-3);
  border-radius: 2px;
  margin: 12px auto 0;
}

/* Sheet content */
.sheet-content {
  padding: 16px 20px 20px;
}

.sheet-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.sheet-province-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  font-family: system-ui, sans-serif;
}

.sheet-close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-tertiary);
  font-size: 18px;
  margin: -8px -8px 0 0;
  border-radius: 50%;
  -webkit-tap-highlight-color: transparent;
}

.sheet-position {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 16px;
}

.sheet-position-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.sheet-position[data-pos="setuju"] { color: var(--setuju); }
.sheet-position[data-pos="tolak"]  { color: var(--tolak); }
.sheet-position[data-pos="abstain"]{ color: var(--text-secondary); }

.sheet-position-dot[data-pos="setuju"] { background: var(--setuju); }
.sheet-position-dot[data-pos="tolak"]  { background: var(--tolak); }
.sheet-position-dot[data-pos="abstain"]{ background: var(--abstain); }

.sheet-quote {
  font-style: italic;
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.5;
  padding-left: 14px;
  border-left: 2px solid;
  margin-bottom: 12px;
}

.sheet-quote[data-pos="setuju"] { border-color: var(--setuju); }
.sheet-quote[data-pos="tolak"]  { border-color: var(--tolak); }
.sheet-quote[data-pos="abstain"]{ border-color: var(--abstain); }

.sheet-meta {
  font-size: 11px;
  color: var(--text-tertiary);
  font-family: monospace;
  margin-bottom: 20px;
}

.sheet-cta {
  display: block;
  width: 100%;
  height: 44px;
  background: var(--accent);
  color: var(--surface-0);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: system-ui, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

.sheet-empty {
  font-style: italic;
  font-size: 14px;
  color: var(--text-secondary);
  text-align: center;
  padding: 20px 0;
}

TAMBAHKAN ke <body> sebelum closing </body>:

<div class="bottom-sheet-backdrop" id="backdrop"></div>
<div class="bottom-sheet" id="bottom-sheet">
  <div class="sheet-handle"></div>
  <div class="sheet-content" id="sheet-content"></div>
</div>

TAMBAHKAN ke <script>:

// Mock pendapat per provinsi (untuk testing)
const MOCK_OPINIONS = {
  'jk': { text: 'Jakarta sudah terlalu padat. Desentralisasi lebih penting dari pendidikan gratis.', id: 'DPN/SID/014/2026/00000001', date: '14 Mar 2026' },
  'jb': { text: 'Kami dari keluarga petani. Pendidikan gratis = harapan anak kami kuliah.', id: 'DPN/SID/014/2026/00000002', date: '14 Mar 2026' },
  'jt': { text: 'Setuju, tapi mulai dari SD-SMP dulu. Universitas gratis butuh dana lebih besar.', id: 'DPN/SID/014/2026/00000003', date: '14 Mar 2026' },
  'go': { text: 'Kami di pelosok Gorontalo butuh guru, bukan gedung megah. Prioritaskan SDM.', id: 'DPN/SID/014/2026/00000004', date: '14 Mar 2026' },
  'be': { text: 'Gaji guru honorer Rp 500 ribu. Mau gratis atau bayar, kalau gurunya tidak sejahtera, hasilnya sama.', id: 'DPN/SID/014/2026/00000005', date: '14 Mar 2026' },
};

function showBottomSheet(province, status) {
  const backdrop = document.getElementById('backdrop');
  const sheet = document.getElementById('bottom-sheet');
  const content = document.getElementById('sheet-content');
  
  const opinion = MOCK_OPINIONS[province.id];
  const positionLabel = status === 'setuju' ? 'Setuju' : status === 'tolak' ? 'Tolak' : status === 'abstain' ? 'Abstain' : null;
  
  if (status === null) {
    // Province belum ada vote
    content.innerHTML = `
      <div class="sheet-header">
        <span class="sheet-province-name">Warga ${province.name}</span>
        <div class="sheet-close" onclick="closeBottomSheet()">✕</div>
      </div>
      <div class="sheet-empty">Belum ada suara dari provinsi ini.</div>
      <button class="sheet-cta" onclick="closeBottomSheet()">
        Sampaikan Pendapatmu →
      </button>
    `;
  } else {
    content.innerHTML = `
      <div class="sheet-header">
        <span class="sheet-province-name">Warga ${province.name}</span>
        <div class="sheet-close" onclick="closeBottomSheet()">✕</div>
      </div>
      <div class="sheet-position" data-pos="${status}">
        <div class="sheet-position-dot" data-pos="${status}"></div>
        ${positionLabel}
      </div>
      ${opinion ? `
        <div class="sheet-quote" data-pos="${status}">
          "${opinion.text}"
        </div>
        <div class="sheet-meta">${opinion.id} · ${opinion.date}</div>
      ` : ''}
      <button class="sheet-cta" onclick="closeBottomSheet()">
        Sampaikan Pendapatmu →
      </button>
    `;
  }
  
  // Show
  requestAnimationFrame(() => {
    backdrop.classList.add('visible');
    sheet.classList.add('visible');
  });
}

function closeBottomSheet() {
  const backdrop = document.getElementById('backdrop');
  const sheet = document.getElementById('bottom-sheet');
  
  backdrop.classList.remove('visible');
  sheet.classList.remove('visible');
  
  // Remove selected state dari nodes
  document.querySelectorAll('.node.selected').forEach(n => {
    n.classList.remove('selected');
  });
}

// Close saat tap backdrop
document.getElementById('backdrop').addEventListener('click', closeBottomSheet);
```

### TASK NODE-6 — Validation Checklist

```
SEBELUM PINDAH KE CODEBASE UTAMA, lakukan semua cek ini di node-grid-test.html.

BUKA browser console (F12). Semua harus hijau, tidak ada merah.

TEST 1 — Viewport 360px:
- Buka DevTools → device toolbar → set ke 360x800
- Reload halaman
- Console harus print: "✅ No overflow."
- Console harus print: "✅ All nodes same size: XXpx"
- Console harus print: "Total nodes rendered: 38"
- VISUAL: semua 38 node terlihat, tidak ada yang terpotong di kiri/kanan

TEST 2 — Viewport 390px (iPhone 14):
- Ubah ke 390x844
- Reload
- Semua cek sama seperti TEST 1
- VISUAL: node sedikit lebih besar dari TEST 1 (karena calculated size)

TEST 3 — Viewport 320px (iPhone SE lama):
- Ubah ke 320x568
- Reload
- Semua cek sama
- VISUAL: node lebih kecil tapi masih bisa dibaca, tidak overflow

TEST 4 — Warna node benar:
- [ ] Node dengan status "setuju" → background hijau sage
- [ ] Node dengan status "tolak" → background brick red
- [ ] Node dengan status "abstain" → background warm gray
- [ ] Node dengan status null → background surface-2, opacity 0.45
- [ ] SEMUA node ukurannya IDENTIK (cek visual, bandingkan node di baris berbeda)

TEST 5 — Tap interaction:
- [ ] Tap node yang sudah vote → bottom sheet muncul dengan nama provinsi dan posisi
- [ ] Tap node belum vote → bottom sheet muncul dengan "Belum ada suara"
- [ ] Tap backdrop → bottom sheet tutup
- [ ] Tap ✕ → bottom sheet tutup
- [ ] Setelah bottom sheet tutup, tidak ada node yang masih "selected"

TEST 6 — Scroll:
- [ ] Halaman bisa di-scroll vertical (untuk lihat semua konten jika viewport pendek)
- [ ] Tidak ada horizontal scroll

TEST 7 — Resize (di desktop browser):
- [ ] Perkecil browser window → grid recalculate → tidak overflow
- [ ] Perbesar browser window → grid recalculate → node lebih besar tapi max 38px

JIKA SEMUA TEST PASS: lanjut ke TASK NODE-7.
JIKA ADA YANG FAIL: debug di isolated file ini dulu, JANGAN pindah ke main codebase.
```

### TASK NODE-7 — Migrasi ke Main Codebase

```
Setelah semua test di TASK NODE-6 pass, baru pindahkan ke codebase utama.

INSTRUKSI MIGRASI:

1. BUAT file komponen baru:
   /components/sidang/ProvinceNodeGrid.tsx

2. KONVERSI dari vanilla HTML/JS ke React component:
   - PROVINCES array → export sebagai constant
   - ROWS array → derived dari PROVINCES
   - CSS → Tailwind inline styles atau CSS modules
   - JavaScript render functions → React JSX
   - Event handlers → React onClick
   - Bottom sheet → komponen <BottomSheet /> yang sudah ada di codebase

3. PROPS komponen:

   type Province = {
     id: string
     code: string
     name: string
     row: number
   }
   
   type VoteStatus = 'setuju' | 'abstain' | 'tolak' | null
   
   type ProvinceVote = {
     position: VoteStatus
     opinionText?: string
     voteId?: string
     date?: string
   }
   
   type ProvinceNodeGridProps = {
     votes: Record<string, ProvinceVote>  // key = province id
     onNodeTap: (province: Province, vote: ProvinceVote | null) => void
     userProvinceId?: string | null  // untuk highlight provinsi user
   }

4. DYNAMIC SIZE CALCULATION dalam React:

   import { useState, useEffect, useRef } from 'react'
   
   function useNodeSize(maxNodesPerRow: number = 9) {
     const [nodeSize, setNodeSize] = useState({
       width: 32,
       height: 26,
       fontSize: 9,
       gap: 6,
     })
     
     useEffect(() => {
       function calculate() {
         const viewportWidth = window.innerWidth
         const containerPadding = 32  // sesuaikan dengan actual padding page
         const usableWidth = viewportWidth - containerPadding
         const totalGap = (maxNodesPerRow - 1) * 6
         const safetyMargin = 4
         const maxWidth = Math.floor(
           (usableWidth - totalGap - safetyMargin) / maxNodesPerRow
         )
         const nodeWidth = Math.max(24, Math.min(38, maxWidth))
         const nodeHeight = Math.round(nodeWidth * 0.8)
         const fontSize = Math.max(8, Math.round(nodeWidth * 0.28))
         
         setNodeSize({
           width: nodeWidth,
           height: nodeHeight,
           fontSize,
           gap: 6,
         })
       }
       
       calculate()
       window.addEventListener('resize', calculate)
       return () => window.removeEventListener('resize', calculate)
     }, [maxNodesPerRow])
     
     return nodeSize
   }

5. JSX STRUCTURE:

   export function ProvinceNodeGrid({ votes, onNodeTap, userProvinceId }: ProvinceNodeGridProps) {
     const nodeSize = useNodeSize(9)
     
     return (
       <div className="w-full">
         {ROWS.map((rowProvinces, rowIndex) => (
           <div
             key={rowIndex}
             style={{ gap: nodeSize.gap, marginBottom: rowIndex < ROWS.length - 1 ? nodeSize.gap : 0 }}
             className="flex flex-row justify-center items-center"
           >
             {rowProvinces.map(province => {
               const vote = votes[province.id] || null
               const status = vote?.position || null
               const isUserProvince = province.id === userProvinceId
               
               return (
                 <div
                   key={province.id}
                   onClick={() => onNodeTap(province, vote)}
                   style={{
                     width: nodeSize.width,
                     height: nodeSize.height,
                     fontSize: nodeSize.fontSize,
                   }}
                   className={getNodeClassName(status, isUserProvince)}
                 >
                   {province.code}
                 </div>
               )
             })}
           </div>
         ))}
         
         <NodeLegend />
       </div>
     )
   }
   
   function getNodeClassName(status: VoteStatus, isUserProvince: boolean): string {
     const base = "flex items-center justify-center font-bold rounded cursor-pointer select-none transition-all duration-300"
     const userRing = isUserProvince ? " ring-2 ring-accent ring-offset-1 ring-offset-surface-0" : ""
     
     switch (status) {
       case 'setuju':
         return `${base} bg-setuju text-white border border-setuju${userRing}`
       case 'tolak':
         return `${base} bg-tolak text-white border border-tolak${userRing}`
       case 'abstain':
         return `${base} bg-abstain text-white border border-abstain${userRing}`
       default:
         return `${base} bg-surface-2 text-tertiary border border-surface-3 opacity-45${userRing}`
     }
   }

6. SETELAH MIGRASI — test lagi:
   - Buka /sidang/[id] di browser
   - DevTools → 360x800
   - Semua 38 node visible, tidak overflow
   - Tap node → bottom sheet muncul
   - Ukuran semua node identik
```

### TASK NODE-8 — Integration dengan Halaman Sidang Aktif

```
Integrasikan ProvinceNodeGrid ke dalam halaman Sidang Aktif.

HALAMAN: /sidang/[id] atau /app/(main)/sidang/[id]/page.tsx

LAYOUT FINAL halaman setelah integrasi:

┌─────────────────────────────────────┐
│ DPN RI · SIDANG AKTIF    ≡  ● 32 H │  ← Top bar (sticky, 48px)
├─────────────────────────────────────┤
│ [Banner "Kamu belum masuk" — jika   │  ← Conditional, 44px
│  belum login]                       │
├─────────────────────────────────────┤
│ #014  AKTIF                         │
│ RUU Pendidikan Gratis Nasional      │  ← Judul section, ~110px
│ Haruskah pendidikan...?             │
├─────────────────────────────────────┤
│           [PODIUM SVG]              │  ← 70px
│    ════════════════════             │  ← Voting bar, 6px
│  ●52% setuju ●16% abstain ●32% tolak│  ← 20px
│         25 SUARA TERCATAT          │  ← 16px
├─────────────────────────────────────┤
│  JK  JB  JT  YO  BT               │  ← Baris 1 (5 nodes)
│ BE  LA  BB  KR  JI  BA  NB        │  ← Baris 2 (7 nodes)
│AC SU SB RI JA KB KT KS KI         │  ← Baris 3 (9 nodes)
│SN ST SG GO SR SA NT KU SS         │  ← Baris 4 (9 nodes)
│ MA MU PA PB PS PT PP PD           │  ← Baris 5 (8 nodes)
│  ●Setuju ●Abstain ●Tolak ●Belum   │  ← Legenda
├─────────────────────────────────────┤
│ SUARA TERBARU      ●GORONTALO SETUJU│
│ "Kami di pelosok Gorontalo..."     │  ← Card suara terbaru
│ — Warga Gorontalo                  │
├─────────────────────────────────────┤
│      Naik Podium / Masuk           │  ← CTA button, 48px
└─────────────────────────────────────┘

SPACING antar section: 16px (bukan 24px atau lebih)
Seluruh halaman scrollable secara vertikal
TIDAK ada elemen yang overflow secara horizontal

PASTIKAN:
- ProvinceNodeGrid menerima votes dari state/props
- onNodeTap terhubung ke bottom sheet yang sudah ada
- userProvinceId dipass dari user state (Zustand store)
- Bottom sheet yang muncul adalah komponen yang sudah di-redesign sebelumnya

JANGAN:
- Hardcode ukuran node
- Pakai absolute positioning untuk node
- Pakai force simulation atau physics library
- Render lebih dari 38 nodes
```

---

## Summary — Kenapa Ini Berbeda dari Instruksi Sebelumnya

Semua task plan node grid sebelumnya gagal karena **langsung ke React component** tanpa validasi terlebih dahulu. AI agent menghasilkan kode yang terlihat benar secara logika tapi tidak pernah di-test di viewport 360px yang sebenarnya.

Pendekatan ini berbeda:

```
SEBELUMNYA:                    SEKARANG:
Prompt → React Component       Isolated HTML test → Validation → React
     ↓                                  ↓
Langsung ke main codebase      Semua test harus pass dulu
     ↓                                  ↓
Bug ditemukan di production    Bug ditemukan di isolated sandbox
     ↓                                  ↓
Fix → bug baru muncul          Setelah fix verified, baru migrate
     ↓
Loop tidak selesai
```

**Node-grid-test.html adalah safety net.** Jika task NODE-6 semua pass, task NODE-7 dan NODE-8 akan jauh lebih smooth.