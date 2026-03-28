import { useDPNStore } from './store/dpnStore';
import type { DPNState } from './types';
import { RoomScreen } from './components/Room/RoomScreen';
import { SpeakScreen } from './components/Speak/SpeakScreen';
import { ArchiveScreen } from './components/Archive/ArchiveScreen';
import { ShareCard } from './components/ShareCard/ShareCard';
import { ProvinsiPicker } from './components/Onboarding/ProvinsiPicker';
import { AppLayout } from './layouts/AppLayout';

function App() {
  const screen = useDPNStore((s: DPNState) => s.screen);
  const showShareCard = useDPNStore((s: DPNState) => s.showShareCard);
  const showOnboarding = useDPNStore((s: DPNState) => s.showOnboarding);

  return (
    <AppLayout>
      {/* Room is always rendered underneath */}
      <div style={{
        position: 'absolute',
        inset: 0,
        visibility: screen === 'room' && !showOnboarding && !showShareCard ? 'visible' : 'hidden',
      }}>
        <RoomScreen />
      </div>

      {/* Full screen overlays */}
      {screen === 'speak' && <SpeakScreen />}
      {screen === 'archive' && <ArchiveScreen />}

      {/* Onboarding */}
      {showOnboarding && <ProvinsiPicker />}

      {/* Share card */}
      {showShareCard && <ShareCard />}
    </AppLayout>
  );
}

export default App;
