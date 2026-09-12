import React, { useState } from 'react';
import { SeatingProvider, useSeating } from './context/SeatingContext';
import { Header } from './components/Header';
import { ConcertHallView } from './components/ConcertHallView';
import { ClassDirectoryView } from './components/ClassDirectoryView';
import { SafetySimulationBanner } from './components/SafetySimulationBanner';
import { ProjectorModal } from './components/ProjectorModal';
import { PrintExportModal } from './components/PrintExportModal';

const MainContent: React.FC = () => {
  const { viewMode } = useSeating();
  const [isProjectorOpen, setIsProjectorOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header onOpenProjector={() => setIsProjectorOpen(true)} />

      <main style={{
        flex: 1,
        maxWidth: 1440,
        margin: '0 auto',
        width: '100%',
        padding: '24px 20px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        {/* If in entrance or exit mode, display the safety flow banner */}
        {(viewMode === 'entrance' || viewMode === 'exit') && (
          <SafetySimulationBanner onOpenProjector={() => setIsProjectorOpen(true)} />
        )}

        {/* Dynamic view router */}
        {viewMode === 'classes' ? (
          <ClassDirectoryView />
        ) : (
          <ConcertHallView />
        )}
      </main>

      {/* Apple Minimalist Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-light)',
        padding: '16px 24px',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <span>학교 음악회 안전 좌석 배치 시스템 • 29학급 580석 완전 자동 연동</span>
        <span>•</span>
        <button
          onClick={() => setIsPrintModalOpen(true)}
          style={{ color: 'var(--accent-blue)', fontWeight: 500 }}
        >
          학급별 좌석표 명단 인쇄
        </button>
      </footer>

      {/* Modals */}
      <ProjectorModal
        isOpen={isProjectorOpen}
        onClose={() => setIsProjectorOpen(false)}
      />

      <PrintExportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <SeatingProvider>
      <MainContent />
    </SeatingProvider>
  );
}

export default App;
