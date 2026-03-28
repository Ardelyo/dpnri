export type VoteType = "setuju" | "abstain" | "tolak";
export type Screen = "room" | "speak" | "archive" | "map" | "landing" | "onboarding" | "postvote";

export interface Opinion {
  id: string;
  sessionId: string;
  provinsi: string;
  vote: VoteType;
  text: string;
  createdAt: string;
  nomorDokumen: string;
}

export interface Session {
  id: string;
  nomor: string;
  judul: string;
  pertanyaan: string;
  status: "aktif" | "selesai" | "arsip";
  openedAt: string;
  closedAt?: string;
  totalPendapat: number;
  votes: { setuju: number; abstain: number; tolak: number };
  putusanDPN?: "setuju" | "tolak";
  putusanDPR?: string;
}

export interface CharData {
  id: number;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  provinsi: string;
  color: string;
  opinion: Opinion;
  vote: VoteType;
}

export interface SampleOpinion {
  id: string;
  text: string;
  provinsi: string;
  vote: VoteType;
  createdAt: string;
}

export interface DPNState {
  screen: Screen;
  setScreen: (s: Screen) => void;
  userProvinsi: string | null;
  setUserProvinsi: (p: string) => void;
  activeSession: Session;
  pastSessions: Session[];
  opinions: Opinion[];
  addOpinion: (op: Omit<Opinion, 'id' | 'nomorDokumen' | 'createdAt' | 'sessionId'>) => void;
  selectedCharId: number | null;
  setSelectedCharId: (id: number | null) => void;
  playerPos: { x: number; y: number } | null;
  setPlayerPos: (p: { x: number; y: number } | null) => void;
  showShareCard: boolean;
  setShowShareCard: (v: boolean) => void;
  lastSubmittedOpinion: Opinion | null;
  hasVoted: boolean;
}
