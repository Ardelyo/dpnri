import { useDPNStore } from './store/dpnStore';
import { RoomScreen } from './components/Room/RoomScreen';
import { SpeakScreen } from './components/Speak/SpeakScreen';
import { ArchiveScreen } from './components/Archive/ArchiveScreen';
import { ShareCard } from './components/ShareCard/ShareCard';
import { ProvinsiPicker } from './components/Onboarding/ProvinsiPicker';

function App() {
  const screen = useDPNStore(s => s.screen);
  const showShareCard = useDPNStore(s => s.showShareCard);
  const showOnboarding = useDPNStore(s => s.showOnboarding);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '430px',
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--surface-0)',
      }}
    >
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

      {/* Landscape warning (CSS handles display) */}
      <div
        className="landscape-warning"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'var(--surface-0)',
          zIndex: 9999,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '36px' }}>📱</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '16px',
          color: 'var(--text-primary)',
          textAlign: 'center',
          padding: '0 40px',
          lineHeight: 1.5,
        }}>
          Putar HP ke mode portrait untuk pengalaman terbaik.
        </div>
      </div>
    </div>
  );
}

export default App;
