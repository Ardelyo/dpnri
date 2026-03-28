import { useEffect, useRef } from 'react';

export interface BehavioralData {
  timeOnPage: number;
  scrollDepth: number;
  touchEvents: number;
  typingDuration: number;
  typingPauses: number;
  readOpinions: boolean;
  tappedNodes: number;
}

export function computeBehaviorScore(data: BehavioralData): number {
  let score = 0;
  if (data.timeOnPage > 10)        score += 15;
  if (data.scrollDepth > 0.3)      score += 10;
  if (data.touchEvents > 5)        score += 10;
  if (data.typingDuration > 3000)  score += 15;
  if (data.typingPauses > 1)       score += 10;
  if (data.readOpinions)           score += 10;
  if (data.tappedNodes > 0)        score += 15;
  return Math.min(score, 100);
}

interface TrackerOptions {
  onReadOpinions?: () => void;
  onNodeTap?: () => void;
}

/**
 * Invisible behavioral tracker.
 * Usage: const { markReadOpinions, markNodeTap, getData } = useBehavioralTracker();
 */
export function useBehavioralTracker(options?: TrackerOptions) {
  const startTime      = useRef(Date.now());
  const scrollDepth    = useRef(0);
  const touchCount     = useRef(0);
  const typingMs       = useRef(0);
  const typingPauses   = useRef(0);
  const lastKeyTime    = useRef<number | null>(null);
  const readOpinions   = useRef(false);
  const tappedNodes    = useRef(0);

  useEffect(() => {
    // Scroll depth
    const handleScroll = () => {
      const el = document.documentElement;
      const depth = el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1);
      if (depth > scrollDepth.current) scrollDepth.current = depth;
    };

    // Touch / click count
    const handleTouch = () => { touchCount.current += 1; };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouch, { passive: true });
    window.addEventListener('click', handleTouch);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('click', handleTouch);
    };
  }, []);

  // Typing tracker — call these from your textarea handlers
  const onTypingKeyDown = () => {
    const now = Date.now();
    if (lastKeyTime.current !== null && now - lastKeyTime.current > 500) {
      typingPauses.current += 1;
    }
    lastKeyTime.current = now;
  };

  const onTypingFocus = (startMs: number) => {
    lastKeyTime.current = startMs;
  };

  const onTypingBlur = (startMs: number) => {
    typingMs.current += Date.now() - startMs;
  };

  const markReadOpinions = () => {
    readOpinions.current = true;
    options?.onReadOpinions?.();
  };

  const markNodeTap = () => {
    tappedNodes.current += 1;
    options?.onNodeTap?.();
  };

  const getData = (): BehavioralData => ({
    timeOnPage:     Math.round((Date.now() - startTime.current) / 1000),
    scrollDepth:    scrollDepth.current,
    touchEvents:    touchCount.current,
    typingDuration: typingMs.current,
    typingPauses:   typingPauses.current,
    readOpinions:   readOpinions.current,
    tappedNodes:    tappedNodes.current,
  });

  const getScore = () => computeBehaviorScore(getData());

  return { markReadOpinions, markNodeTap, onTypingKeyDown, onTypingFocus, onTypingBlur, getData, getScore };
}
