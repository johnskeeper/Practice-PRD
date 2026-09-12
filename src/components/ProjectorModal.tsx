import React, { useEffect } from 'react';
import { useSeating } from '../context/SeatingContext';
import { X, ChevronRight, ChevronLeft, DoorOpen } from 'lucide-react';

export const ProjectorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const {
    language,
    viewMode,
    currentStepIndex,
    currentSafetySteps,
    nextSafetyStep,
    prevSafetyStep,
  } = useSeating();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSafetyStep();
      if (e.key === 'ArrowLeft') prevSafetyStep();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nextSafetyStep, prevSafetyStep]);

  if (!isOpen) return null;

  const step = currentSafetySteps[currentStepIndex];
  const isExit = viewMode === 'exit';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      backgroundColor: '#000000',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '40px 60px',
      overflow: 'hidden',
    }}>
      {/* Top Bar: Event Header & Close */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: '2rem' }}>🎵</span>
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: 600, color: 'rgba(255, 255, 255, 0.7)' }}>
              학교 전체 음악회 안전 관람 시스템
            </div>
            <div style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.4)' }}>
              Total 29 Classes (580 Students) • Hall Safe Routing Display
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.95rem',
            cursor: 'pointer',
          }}
        >
          <X size={18} />
          <span>전체화면 종료 (ESC)</span>
        </button>
      </div>

      {/* Main Massive Announcement Center */}
      <div style={{
        textAlign: 'center',
        maxWidth: 1100,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 32,
      }}>
        {/* Phase Pill */}
        <div style={{
          padding: '10px 32px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: isExit ? '#ff9f0a' : '#0071e3',
          color: '#fff',
          fontSize: '1.4rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          boxShadow: `0 0 40px ${isExit ? 'rgba(255, 159, 10, 0.5)' : 'rgba(0, 113, 227, 0.5)'}`,
        }}>
          {isExit ? '안전 퇴장 안내' : '안전 순차 입장'} • {currentStepIndex + 1}단계 ({currentStepIndex + 1} / {currentSafetySteps.length})
        </div>

        {/* Phase Title */}
        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}>
          {language === 'ko' ? step.titleKo : step.titleEn}
        </h1>

        {/* Big Active Row Numbers Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.4rem', color: 'rgba(255, 255, 255, 0.6)', fontWeight: 600 }}>
            호명 및 이동 구역:
          </span>
          {step.activeRows.map(r => (
            <div
              key={r}
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: `2px solid ${isExit ? '#ff9f0a' : '#0071e3'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: '#fff',
              }}
            >
              {r}열
            </div>
          ))}

          {step.focusWheelchair && (
            <div style={{
              height: 72,
              padding: '0 24px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(52, 199, 89, 0.2)',
              border: '2px solid #34c759',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#34c759',
            }}>
              <span>♿</span>
              <span>휠체어 배려석 전체</span>
            </div>
          )}
        </div>

        {/* Guidance Description */}
        <p style={{
          fontSize: '1.6rem',
          color: 'rgba(255, 255, 255, 0.78)',
          maxWidth: 950,
          lineHeight: 1.5,
        }}>
          {language === 'ko' ? step.descKo : step.descEn}
        </p>
      </div>

      {/* Bottom Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'rgba(255, 255, 255, 0.5)', fontSize: '1.05rem' }}>
          <DoorOpen size={22} color="#34c759" />
          <span>비상 대피 유도 요원의 지시에 따라 통로를 비워두시고 이동해 주시기 바랍니다.</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            onClick={prevSafetyStep}
            disabled={currentStepIndex === 0}
            style={{
              padding: '12px 24px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: currentStepIndex > 0 ? 'pointer' : 'not-allowed',
              opacity: currentStepIndex > 0 ? 1 : 0.4,
            }}
          >
            <ChevronLeft size={20} />
            <span>이전 단계 (←)</span>
          </button>

          <button
            onClick={nextSafetyStep}
            disabled={currentStepIndex === currentSafetySteps.length - 1}
            style={{
              padding: '12px 28px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: isExit ? '#ff9f0a' : '#0071e3',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: currentStepIndex < currentSafetySteps.length - 1 ? 'pointer' : 'not-allowed',
              opacity: currentStepIndex < currentSafetySteps.length - 1 ? 1 : 0.4,
            }}
          >
            <span>다음 단계 안내 (→)</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
