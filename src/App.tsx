import { useDPNStore } from './store/dpnStore';
import type { DPNState } from './types';

import { AppLayout } from './layouts/AppLayout';
import { Toast } from './components/Common/Toast';
import { BottomNav } from './components/Navigation/BottomNav';

// Onboarding / Auth screens (no nav bar)
import { LandingScreen } from './components/Onboarding/LandingScreen';
import { AuthScreen } from './components/Onboarding/AuthScreen';
import { ProvinsiPicker } from './components/Onboarding/ProvinsiPicker';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';

// Main app screens
import { RoomScreen } from './components/Room/RoomScreen';
import { SpeakScreen } from './components/Speak/SpeakScreen';
import { PostVoteConfirmation } from './components/Speak/PostVoteConfirmation';
import { ArchiveScreen } from './components/Archive/ArchiveScreen';
import { IndonesiaMap } from './components/Map/IndonesiaMap';
import { SettingsScreen } from './components/Settings/SettingsScreen';

// Legacy share card
import { ShareCard } from './components/ShareCard/ShareCard';

function App() {
  const screen        = useDPNStore((s: DPNState) => s.screen);
  const setScreen     = useDPNStore((s: DPNState) => s.setScreen);
  const showShareCard = useDPNStore((s: DPNState) => s.showShareCard);
  const lastOpinion   = useDPNStore.getState().lastSubmittedOpinion;

  // Derive whether content behind overlays should be mounted but hidden
  const isMainVisible = screen === 'room';

  return (
    <AppLayout>
      {/* ── Global Toast (always rendered) ── */}
      <Toast />

      {/* ── Full-screen overlay screens ── */}

      {screen === 'landing' && <LandingScreen />}
      {screen === 'auth'    && <AuthScreen />}
      {screen === 'onboarding' && <ProvinsiPicker />}
      {screen === 'onboarding-flow' && <OnboardingFlow />}

      {/* ── Always-mounted room (hidden when overlays are active) ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        visibility: isMainVisible ? 'visible' : 'hidden',
        // Keep mounted so state doesn't reset when navigating back
        pointerEvents: isMainVisible ? 'auto' : 'none',
      }}>
        <RoomScreen />
      </div>

      {/* ── Full-screen overlays over room ── */}
      {screen === 'speak'    && <SpeakScreen />}
      {screen === 'postvote' && <PostVoteConfirmation />}
      {screen === 'archive'  && <ArchiveScreen />}
      {screen === 'settings' && <SettingsScreen />}
      {screen === 'map' && (
        <IndonesiaMap
          fullscreen
          onClose={() => setScreen('room')}
        />
      )}

      {/* ── Legacy share card (triggered after vote in old flow) ── */}
      {showShareCard && lastOpinion && (
        <ShareCard
          onClose={() => useDPNStore.getState().setShowShareCard(false)}
          opinion={lastOpinion}
        />
      )}

      {/* ── Bottom navigation (shown on main screens) ── */}
      <BottomNav />
    </AppLayout>
  );
}

export default App;
