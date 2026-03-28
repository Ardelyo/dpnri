import { create } from 'zustand';
import { SAMPLE_OPINIONS, ACTIVE_SESSION, PAST_SESSIONS } from '../constants/opinions';
import { 
  Opinion, 
  Session, 
  Screen,
  DPNState
} from '../types';
import { 
  convertSampleToOpinion, 
  createNewOpinion 
} from '../utils/opinion-logic';

// Determine correct initial screen from user store (localStorage read)
function getInitialScreen(): Screen {
  const savedProvinsi = typeof window !== 'undefined' ? localStorage.getItem('dpn_provinsi') : null;
  const userRaw = typeof window !== 'undefined' ? localStorage.getItem('dpn-user-state') : null;
  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      if (user.isLoggedIn && user.provinceId && user.hasCompletedOnboarding) return 'room';
      if (user.isLoggedIn && !user.provinceId) return 'onboarding';
    } catch {}
  }
  if (savedProvinsi) return 'room';
  return 'landing';
}

const savedProvinsi = typeof window !== 'undefined' ? localStorage.getItem('dpn_provinsi') : null;

export const useDPNStore = create<DPNState>((set: any, get: any) => ({
  screen: getInitialScreen(),
  setScreen: (s: Screen) => set({ screen: s }),

  userProvinsi: savedProvinsi,
  setUserProvinsi: (p: string) => {
    localStorage.setItem('dpn_provinsi', p);
    set({ userProvinsi: p });
  },

  activeSession: {
    ...ACTIVE_SESSION,
    pertanyaan: "Haruskah pendidikan dari SD hingga perguruan tinggi di Indonesia sepenuhnya gratis dan dibiayai negara?",
  } as Session,

  pastSessions: PAST_SESSIONS as Session[],

  opinions: SAMPLE_OPINIONS.map((op, idx) => convertSampleToOpinion(op, idx)),

  addOpinion: (op: Omit<Opinion, 'id' | 'nomorDokumen' | 'createdAt' | 'sessionId'>) => {
    const state = get();
    const newOp = createNewOpinion(state, op);

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
  setSelectedCharId: (id: number | null) => set({ selectedCharId: id }),

  playerPos: null,
  setPlayerPos: (p: { x: number; y: number } | null) => set({ playerPos: p }),

  showShareCard: false,
  setShowShareCard: (v: boolean) => set({ showShareCard: v }),
  lastSubmittedOpinion: null,

  hasVoted: false,
}));
