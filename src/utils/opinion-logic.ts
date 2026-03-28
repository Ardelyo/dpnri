import { Opinion, SampleOpinion, VoteType, Session } from '../types';
import { PROVINCES } from '../constants/provinces';

/**
 * Converts a sample opinion record to a full Opinion object.
 */
export const convertSampleToOpinion = (s: SampleOpinion, idx: number, sessionId: string = "sid-014"): Opinion => ({
  id: s.id,
  sessionId,
  provinsi: s.provinsi,
  vote: s.vote,
  text: s.text,
  createdAt: s.createdAt,
  nomorDokumen: `DPN/SID/014/2026/${String(idx + 1).padStart(8, '0')}`,
});

/**
 * Builds a mapping of province names to their dominant vote status.
 */
export function buildProvinceVotes(
  opinions: Opinion[]
): Record<string, VoteType | 'none'> {
  const counts: Record<string, { setuju: number; abstain: number; tolak: number }> = {};
  for (const op of opinions) {
    if (!counts[op.provinsi]) counts[op.provinsi] = { setuju: 0, abstain: 0, tolak: 0 };
    counts[op.provinsi][op.vote]++;
  }
  const result: Record<string, VoteType | 'none'> = {};
  for (const prov of PROVINCES) {
    const c = counts[prov.name];
    if (!c) { result[prov.name] = 'none'; continue; }
    const max = Math.max(c.setuju, c.abstain, c.tolak);
    if (max === 0) result[prov.name] = 'none';
    else if (c.setuju === max) result[prov.name] = 'setuju';
    else if (c.tolak === max) result[prov.name] = 'tolak';
    else result[prov.name] = 'abstain';
  }
  return result;
}

/**
 * Finds the latest opinion for a given province.
 */
export function getLatestOpinionForProvince(opinions: Opinion[], prov: string): Opinion | null {
  const arr = opinions.filter(o => o.provinsi === prov);
  return arr.length ? arr[arr.length - 1] : null;
}

/**
 * Generates a new Opinion object with metadata.
 */
export function createNewOpinion(
  state: { opinions: Opinion[]; activeSession: Session },
  op: Omit<Opinion, 'id' | 'nomorDokumen' | 'createdAt' | 'sessionId'>
): Opinion {
  const idx = state.opinions.length;
  return {
    ...op,
    id: `op${String(idx + 1).padStart(3, '0')}`,
    sessionId: state.activeSession.id,
    createdAt: new Date().toISOString(),
    nomorDokumen: `DPN/SID/${state.activeSession.nomor}/2026/${String(idx + 1).padStart(8, '0')}`,
  };
}

/**
 * Returns a consistent color for a given vote type.
 */
export function getVoteColor(vote: VoteType): string {
  switch (vote) {
    case 'setuju': return '#27AE60';
    case 'abstain': return '#F1C40F';
    case 'tolak': return '#C0392B';
    default: return 'var(--text-tertiary)';
  }
}
