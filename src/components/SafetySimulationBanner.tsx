import React from 'react';
import { useSeating } from '../context/SeatingContext';
import { getTranslation } from '../utils/i18n';
import { ShieldCheck, ChevronRight, ChevronLeft, RotateCcw, AlertCircle, Maximize2 } from 'lucide-react';

export const SafetySimulationBanner: React.FC<{ onOpenProjector: () => void }> = ({ onOpenProjector }) => {
  const {
    language,
    viewMode,
    currentStepIndex,
    currentSafetySteps,
    nextSafetyStep,
    prevSafetyStep,
    resetSafetyStep,
  } = useSeating();

  const t = getTranslation(language);
  const step = currentSafetySteps[currentStepIndex];
  const isExit = viewMode === 'exit';

  return (
    <div className="apple-card" style={{
      padding: '20px 24px',
      borderLeft: `5px solid ${isExit ? 'var(--accent-amber)' : 'var(--accent-blue)'}`,
      background: isExit
        ? 'linear-gradient(135deg, rgba(255, 159, 10, 0.08) 0%, rgba(255, 59, 48, 0.05) 100%)'
        : 'linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(52, 199, 89, 0.05) 100%)',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      {/* Top Header & Mode Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-sm)',
            backgroundColor: isExit ? 'rgba(255, 159, 10, 0.2)' : 'rgba(0, 113, 227, 0.2)',
            color: isExit ? 'var(--accent-amber)' : 'var(--accent-blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <ShieldCheck size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: isExit ? 'var(--accent-amber)' : 'var(--accent-blue)',
              }}>
                {isExit ? t.exitGuideTitle : t.entranceGuideTitle}
              </span>
              <span className="apple-glass-pill" style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
              }}>
                {currentStepIndex + 1} / {currentSafetySteps.length} {t.stepLabel}
              </span>
            </div>
            <h2 style={{ fontSize: '1.18rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              {language === 'ko' ? step.titleKo : step.titleEn}
            </h2>
          </div>
        </div>

        {/* Projector View Button */}
        <button
          onClick={onOpenProjector}
          className="apple-btn-secondary"
          style={{ padding: '8px 14px', fontSize: '0.82rem' }}
        >
          <Maximize2 size={14} />
          <span>{t.btnFullscreen}</span>
        </button>
      </div>

      {/* Description & Target Row Highlights */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, maxWidth: 720 }}>
          <AlertCircle size={17} color={isExit ? 'var(--accent-amber)' : 'var(--accent-blue)'} />
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            {language === 'ko' ? step.descKo : step.descEn}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {t.evacuationUnderway}:
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {step.activeRows.map(r => (
              <span
                key={r}
                style={{
                  padding: '2px 7px',
                  borderRadius: 4,
                  backgroundColor: isExit ? 'var(--accent-amber)' : 'var(--accent-blue)',
                  color: '#fff',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                R{r}
              </span>
            ))}
            {step.focusWheelchair && (
              <span style={{
                padding: '2px 7px',
                borderRadius: 4,
                backgroundColor: 'var(--accent-emerald)',
                color: '#fff',
                fontSize: '0.72rem',
                fontWeight: 700,
              }}>
                ♿ 휠체어석
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Progress Bar & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {currentSafetySteps.map((s, idx) => (
            <div
              key={s.step}
              style={{
                height: 6,
                width: idx === currentStepIndex ? 36 : 14,
                borderRadius: 'var(--radius-full)',
                backgroundColor: idx <= currentStepIndex
                  ? (isExit ? 'var(--accent-amber)' : 'var(--accent-blue)')
                  : 'var(--border-light)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={resetSafetyStep}
            className="apple-btn-secondary"
            style={{ padding: '7px 12px', fontSize: '0.82rem' }}
            title={t.resetSimulation}
          >
            <RotateCcw size={13} />
            <span>{t.btnReset}</span>
          </button>

          <button
            onClick={prevSafetyStep}
            disabled={currentStepIndex === 0}
            className="apple-btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
          >
            <ChevronLeft size={14} />
            <span>{t.prevStep}</span>
          </button>

          <button
            onClick={nextSafetyStep}
            disabled={currentStepIndex === currentSafetySteps.length - 1}
            className="apple-btn-primary"
            style={{
              padding: '7px 16px',
              fontSize: '0.82rem',
              backgroundColor: isExit ? 'var(--accent-amber)' : 'var(--accent-blue)',
            }}
          >
            <span>{t.startStep}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
