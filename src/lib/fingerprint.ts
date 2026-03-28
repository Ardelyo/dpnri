import { useUserStore } from '../store/useUserStore';

const STORAGE_KEY = 'dpn-device-fp';

/**
 * Lightweight device fingerprint — no external dependency needed for concept phase.
 * Combines stable browser signals into a hash-like string.
 */
async function generateFingerprint(): Promise<string> {
  const signals = [
    navigator.userAgent,
    navigator.language,
    String(screen.width) + 'x' + String(screen.height),
    String(screen.colorDepth),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.hardwareConcurrency ?? ''),
    String((navigator as unknown as Record<string, unknown>).deviceMemory ?? ''),
  ].join('|');

  // Simple djb2 hash for the concept phase
  let hash = 5381;
  for (let i = 0; i < signals.length; i++) {
    hash = (hash * 33) ^ signals.charCodeAt(i);
  }
  return 'fpjs-' + Math.abs(hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Init fingerprint once on app startup — reads from localStorage first,
 * generates if missing, and stores in useUserStore.
 */
export async function initFingerprint(): Promise<void> {
  try {
    let fp = localStorage.getItem(STORAGE_KEY);
    if (!fp) {
      fp = await generateFingerprint();
      localStorage.setItem(STORAGE_KEY, fp);
    }
    useUserStore.getState().setDeviceFingerprint(fp);
  } catch {
    // Fingerprinting failed silently — non-critical
  }
}

export function getStoredFingerprint(): string | null {
  try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
}
