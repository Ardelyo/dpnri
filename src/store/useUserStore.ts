import { create } from 'zustand';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type AuthMethod = 'google' | 'magic_link';

export interface VoteRecord {
  position: 'setuju' | 'abstain' | 'tolak';
  opinionText: string;
  timestamp: string;
  voteId: string;
  sidangJudul?: string;
  nomor?: string;
}

export interface ToastOptions {
  message: string;
  type: 'default' | 'success' | 'error';
}

interface UserState {
  // Auth
  isLoggedIn: boolean;
  userId: string | null;
  authMethod: AuthMethod | null;

  // Profile
  provinceId: string | null;
  provinceName: string | null;

  // Onboarding
  hasCompletedOnboarding: boolean;

  // Votes cache (key = sidang nomor as string)
  votes: Record<string, VoteRecord>;

  // Device
  deviceFingerprint: string | null;

  // Toast
  toast: ToastOptions | null;

  // Actions
  login: (data: { userId: string; authMethod: AuthMethod }) => void;
  logout: () => void;
  setProvince: (id: string, name: string) => void;
  completeOnboarding: () => void;
  recordVote: (sidangNomor: string, data: VoteRecord) => void;
  hasVotedOn: (sidangNomor: string) => boolean;
  getVote: (sidangNomor: string) => VoteRecord | null;
  setDeviceFingerprint: (fp: string) => void;
  showToast: (message: string, type?: ToastOptions['type']) => void;
  hideToast: () => void;
}

// ─────────────────────────────────────────────
// Persistence helpers (manual localStorage)
// ─────────────────────────────────────────────

const STORAGE_KEY = 'dpn-user-state';

function loadFromStorage(): Partial<UserState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function saveToStorage(state: Partial<UserState>) {
  if (typeof window === 'undefined') return;
  const toSave = {
    isLoggedIn: state.isLoggedIn,
    userId: state.userId,
    authMethod: state.authMethod,
    provinceId: state.provinceId,
    provinceName: state.provinceName,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    votes: state.votes,
    deviceFingerprint: state.deviceFingerprint,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

// ─────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────

const persisted = loadFromStorage();

export const useUserStore = create<UserState>((set, get) => ({
  // Initial state (merged from storage)
  isLoggedIn: persisted.isLoggedIn ?? false,
  userId: persisted.userId ?? null,
  authMethod: persisted.authMethod ?? null,
  provinceId: persisted.provinceId ?? null,
  provinceName: persisted.provinceName ?? null,
  hasCompletedOnboarding: persisted.hasCompletedOnboarding ?? false,
  votes: persisted.votes ?? {},
  deviceFingerprint: persisted.deviceFingerprint ?? null,
  toast: null,

  login(data) {
    const next = {
      isLoggedIn: true,
      userId: data.userId,
      authMethod: data.authMethod,
    };
    set(next);
    saveToStorage({ ...get(), ...next });
  },

  logout() {
    const next = {
      isLoggedIn: false,
      userId: null,
      authMethod: null,
      provinceId: null,
      provinceName: null,
      hasCompletedOnboarding: false,
      votes: {},
    };
    set(next);
    saveToStorage({ ...get(), ...next });
  },

  setProvince(id, name) {
    const next = { provinceId: id, provinceName: name };
    set(next);
    saveToStorage({ ...get(), ...next });
  },

  completeOnboarding() {
    const next = { hasCompletedOnboarding: true };
    set(next);
    saveToStorage({ ...get(), ...next });
  },

  recordVote(sidangNomor, data) {
    const votes = { ...get().votes, [sidangNomor]: data };
    set({ votes });
    saveToStorage({ ...get(), votes });
  },

  hasVotedOn(sidangNomor) {
    return !!get().votes[sidangNomor];
  },

  getVote(sidangNomor) {
    return get().votes[sidangNomor] ?? null;
  },

  setDeviceFingerprint(fp) {
    const next = { deviceFingerprint: fp };
    set(next);
    saveToStorage({ ...get(), ...next });
  },

  showToast(message, type = 'default') {
    set({ toast: { message, type } });
    setTimeout(() => get().hideToast(), 3000);
  },

  hideToast() {
    set({ toast: null });
  },
}));

// ─────────────────────────────────────────────
// Mock helpers (development only)
// ─────────────────────────────────────────────

export function mockLogin() {
  const store = useUserStore.getState();
  store.login({ userId: 'mock-user-001', authMethod: 'google' });
  store.setProvince('jatim', 'Jawa Timur');
  store.completeOnboarding();
}

export function mockReset() {
  localStorage.removeItem('dpn-user-state');
  // Also clear dpn_provinsi used by old store
  localStorage.removeItem('dpn_provinsi');
  window.location.reload();
}
