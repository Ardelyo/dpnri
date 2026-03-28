export interface Province {
  name: string;
  color: string;  // Identifier color for canvas/avatar (muted, warm)
  short: string;
  region: string;
}

export const PROVINCE_REGIONS = [
  "Sumatera",
  "Jawa",
  "Kalimantan",
  "Sulawesi",
  "Bali & Nusa Tenggara",
  "Maluku",
  "Papua",
] as const;

export type ProvinceRegion = typeof PROVINCE_REGIONS[number];

export const PROVINCES: Province[] = [
  // Sumatera (10)
  { name: "Aceh",                    short: "AC", color: "#7a5c3a", region: "Sumatera" },
  { name: "Sumatera Utara",          short: "SU", color: "#6b4e38", region: "Sumatera" },
  { name: "Sumatera Barat",          short: "SB", color: "#7a6040", region: "Sumatera" },
  { name: "Riau",                    short: "RI", color: "#5c6b4a", region: "Sumatera" },
  { name: "Jambi",                   short: "JA", color: "#6b5c3a", region: "Sumatera" },
  { name: "Sumatera Selatan",        short: "SS", color: "#5a5870", region: "Sumatera" },
  { name: "Bengkulu",                short: "BE", color: "#6b4a4a", region: "Sumatera" },
  { name: "Lampung",                 short: "LA", color: "#4a6b5a", region: "Sumatera" },
  { name: "Kep. Bangka Belitung",    short: "BB", color: "#706050", region: "Sumatera" },
  { name: "Kep. Riau",               short: "KR", color: "#507060", region: "Sumatera" },

  // Jawa (6)
  { name: "DKI Jakarta",             short: "JK", color: "#5c5070", region: "Jawa" },
  { name: "Jawa Barat",              short: "JB", color: "#3a5c6b", region: "Jawa" },
  { name: "Jawa Tengah",             short: "JT", color: "#6b4038", region: "Jawa" },
  { name: "DI Yogyakarta",           short: "YO", color: "#705038", region: "Jawa" },
  { name: "Jawa Timur",              short: "JI", color: "#3a6b5a", region: "Jawa" },
  { name: "Banten",                  short: "BT", color: "#6b5038", region: "Jawa" },

  // Kalimantan (5)
  { name: "Kalimantan Barat",        short: "KB", color: "#3a5870", region: "Kalimantan" },
  { name: "Kalimantan Tengah",       short: "KT", color: "#5a7048", region: "Kalimantan" },
  { name: "Kalimantan Selatan",      short: "KS", color: "#704a38", region: "Kalimantan" },
  { name: "Kalimantan Timur",        short: "KI", color: "#486870", region: "Kalimantan" },
  { name: "Kalimantan Utara",        short: "KU", color: "#385870", region: "Kalimantan" },

  // Sulawesi (6)
  { name: "Sulawesi Utara",          short: "SA", color: "#4a6858", region: "Sulawesi" },
  { name: "Sulawesi Tengah",         short: "ST", color: "#5a6840", region: "Sulawesi" },
  { name: "Sulawesi Selatan",        short: "SN", color: "#684840", region: "Sulawesi" },
  { name: "Sulawesi Tenggara",       short: "SG", color: "#505870", region: "Sulawesi" },
  { name: "Gorontalo",               short: "GO", color: "#485868", region: "Sulawesi" },
  { name: "Sulawesi Barat",          short: "SR", color: "#686048", region: "Sulawesi" },

  // Bali & Nusa Tenggara (3)
  { name: "Bali",                    short: "BA", color: "#705848", region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Barat",     short: "NB", color: "#5a7058", region: "Bali & Nusa Tenggara" },
  { name: "Nusa Tenggara Timur",     short: "NT", color: "#684848", region: "Bali & Nusa Tenggara" },

  // Maluku (2)
  { name: "Maluku",                  short: "MA", color: "#406870", region: "Maluku" },
  { name: "Maluku Utara",            short: "MU", color: "#386070", region: "Maluku" },

  // Papua (6)
  { name: "Papua",                   short: "PA", color: "#3a6858", region: "Papua" },
  { name: "Papua Barat",             short: "PB", color: "#385870", region: "Papua" },
  { name: "Papua Selatan",           short: "PS", color: "#486058", region: "Papua" },
  { name: "Papua Tengah",            short: "PT", color: "#406858", region: "Papua" },
  { name: "Papua Pegunungan",        short: "PP", color: "#385068", region: "Papua" },
  { name: "Papua Barat Daya",        short: "PD", color: "#405870", region: "Papua" },
];

export const PROVINCES_BY_REGION = PROVINCE_REGIONS.map(region => ({
  region,
  provinces: PROVINCES.filter(p => p.region === region),
}));

export const getProvinceColor = (name: string): string => {
  return PROVINCES.find(p => p.name === name)?.color || "#5a5248";
};

export const getProvinceShort = (name: string): string => {
  return PROVINCES.find(p => p.name === name)?.short || "??";
};

export const getProvinceRegion = (name: string): string => {
  return PROVINCES.find(p => p.name === name)?.region || "Lainnya";
};
