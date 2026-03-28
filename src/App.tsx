import { useDPNStore } from './store/dpnStore';
import type { DPNState } from './types';
import { RoomScreen } from './components/Room/RoomScreen';
import { SpeakScreen } from './components/Speak/SpeakScreen';
import { ArchiveScreen } from './components/Archive/ArchiveScreen';
import { ShareCard } from './components/ShareCard/ShareCard';
import { LandingScreen } from './components/Onboarding/LandingScreen';
import { ProvinsiPicker } from './components/Onboarding/ProvinsiPicker';
import { AppLayout } from './layouts/AppLayout';

import { IndonesiaMap } from './components/Map/IndonesiaMap';

function App() {
  const screen = useDPNStore((s: DPNState) => s.screen);
  const showShareCard = useDPNStore((s: DPNState) => s.showShareCard);

  const isRoomActive = (screen === 'room' || screen === 'landing' || screen === 'onboarding') && !showShareCard;

  return (
    <AppLayout>
      {/* Room or Landing/Onboarding context */}
      <div style={{
        position: 'absolute',
        inset: 0,
        visibility: isRoomActive ? 'visible' : 'hidden',
      }}>
        {screen === 'landing' && <LandingScreen />}
        {screen === 'onboarding' && <ProvinsiPicker />}
        {screen === 'room' && <RoomScreen />}
      </div>

      {/* Full screen overlays */}
      {screen === 'speak' && <SpeakScreen />}
      {screen === 'archive' && <ArchiveScreen />}
      {screen === 'map' && <IndonesiaMap fullscreen onClose={() => useDPNStore.getState().setScreen('room')} />}

      {/* Share card */}
      {showShareCard && <ShareCard onClose={() => useDPNStore.getState().setShowShareCard(false)} opinion={useDPNStore.getState().lastSubmittedOpinion} />}
    </AppLayout>
  );
}

export default App;
