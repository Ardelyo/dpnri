import { create } from 'zustand';
import { SAMPLE_OPINIONS, ACTIVE_SESSION, PAST_SESSIONS, type SampleOpinion } from '../constants/opinions';

export type VoteType = "setuju" | "abstain" | "tolak";
export type Screen = "room" | "speak" | "archive" | "map";

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

interface DPNState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  userProvinsi: string | null;
  setUserProvinsi: (p: string) => void;

  showOnboarding: boolean;
  setShowOnboarding: (v: boolean) => void;

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

const convertSampleToOpinion = (s: SampleOpinion, idx: number): Opinion => ({
  id: s.id,
  sessionId: "sid-014",
  provinsi: s.provinsi,
  vote: s.vote,
  text: s.text,
  createdAt: s.createdAt,
  nomorDokumen: `DPN/SID/014/2026/${String(idx + 1).padStart(8, '0')}`,
});

const savedProvinsi = typeof window !== 'undefined' ? localStorage.getItem('dpn_provinsi') : null;

export const useDPNStore = create<DPNState>((set, get) => ({
  screen: "room",
  setScreen: (s) => set({ screen: s }),

  userProvinsi: savedProvinsi,
  setUserProvinsi: (p) => {
    localStorage.setItem('dpn_provinsi', p);
    set({ userProvinsi: p, showOnboarding: false });
  },

  showOnboarding: false,
  setShowOnboarding: (v) => set({ showOnboarding: v }),

  activeSession: {
    ...ACTIVE_SESSION,
    pertanyaan: "Haruskah pendidikan dari SD hingga perguruan tinggi di Indonesia sepenuhnya gratis dan dibiayai negara?",
  } as Session,

  pastSessions: PAST_SESSIONS as Session[],

  opinions: SAMPLE_OPINIONS.map(convertSampleToOpinion),

  addOpinion: (op) => {
    const state = get();
    const idx = state.opinions.length;
    const newOp: Opinion = {
      ...op,
      id: `op${String(idx + 1).padStart(3, '0')}`,
      sessionId: state.activeSession.id,
      createdAt: new Date().toISOString(),
      nomorDokumen: `DPN/SID/${state.activeSession.nomor}/2026/${String(idx + 1).padStart(8, '0')}`,
    };

    const newVotes = { ...state.activeSession.votes };
    newVotes[op.vote] += 1;

    set({
      opinions: [...state.opinions, newOp],
      activeSession: {
        ...state.activeSession,
        totalPendapat: state.activeSession.totalPendapat + 1,
        votes: newVotes,
      },
      lastSubmittedOpinion: newOp,
      hasVoted: true,
    });
  },

  selectedCharId: null,
  setSelectedCharId: (id) => set({ selectedCharId: id }),

  playerPos: null,
  setPlayerPos: (p) => set({ playerPos: p }),

  showShareCard: false,
  setShowShareCard: (v) => set({ showShareCard: v }),
  lastSubmittedOpinion: null,

  hasVoted: false,
}));
