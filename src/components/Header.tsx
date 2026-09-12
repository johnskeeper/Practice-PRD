import React from 'react';
import { useSeating } from '../context/SeatingContext';
import { getTranslation } from '../utils/i18n';
import type { ViewMode } from '../types/seating';
import {
  Shuffle,
  RotateCcw,
  Download,
  Moon,
  Sun,
  Globe,
  Users,
  Accessibility,
  LayoutGrid,
  LogIn,
  LogOut,
  Maximize2
} from 'lucide-react';

export const Header: React.FC<{ onOpenProjector: () => void }> = ({ onOpenProjector }) => {
  const {
    language,
    toggleLanguage,
    theme,
    toggleTheme,
    viewMode,
    setViewMode,
    shuffleSeats,
    resetToInitial,
    exportCsvData,
    isShuffling,
    totalStats,
  } = useSeating();

  const t = getTranslation(language);

  const navItems: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'hall', label: t.viewHall, icon: <LayoutGrid size={16} /> },
    { mode: 'classes', label: t.viewClasses, icon: <Users size={16} /> },
    { mode: 'entrance', label: t.viewEntrance, icon: <LogIn size={16} /> },
    { mode: 'exit', label: t.viewExit, icon: <LogOut size={16} /> },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'var(--blur-header)',
      WebkitBackdropFilter: 'var(--blur-header)',
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-light)',
      padding: '12px 24px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Left: Branding & Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #0071e3 0%, #af52de 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.25rem',
            boxShadow: '0 4px 12px rgba(0, 113, 227, 0.3)',
          }}>
            🎵
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{
                fontSize: '1.18rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
              }}>
                {t.appTitle}
              </h1>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(52, 199, 89, 0.15)',
                color: 'var(--accent-emerald)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                580 SEATS
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              marginTop: 1,
            }}>
              {t.appSubtitle}
            </p>
          </div>

          {/* Quick Metrics Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }} className="hidden-mobile">
            <div className="apple-glass-pill" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}>
              <Users size={13} color="var(--accent-blue)" />
              <span>29{language === 'ko' ? '학급' : ' Classes'}</span>
            </div>

            <div className="apple-glass-pill" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
            }}>
              <Accessibility size={13} color="var(--accent-emerald)" />
              <span>{t.wheelchairAssigned} {totalStats.wheelchairCount}</span>
            </div>
          </div>
        </div>

        {/* Center: Apple Segmented View Controller */}
        <div className="apple-segmented-control">
          {navItems.map(item => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
              className={`apple-segmented-item ${viewMode === item.mode ? 'active' : ''}`}
              title={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: Actions (Shuffle, Export, Projector, Theme, Lang) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={shuffleSeats}
            disabled={isShuffling}
            className="apple-btn-primary"
            style={{
              background: isShuffling
                ? 'linear-gradient(135deg, #af52de, #0071e3)'
                : 'var(--accent-blue)',
            }}
          >
            <Shuffle
              size={16}
              style={{
                animation: isShuffling ? 'spin 1s linear infinite' : 'none',
              }}
            />
            <span>{isShuffling ? t.btnShuffling : t.btnShuffle}</span>
          </button>

          <button
            onClick={exportCsvData}
            className="apple-btn-secondary"
            title={t.btnExport}
          >
            <Download size={15} />
            <span className="hidden-tablet">{t.btnExport}</span>
          </button>

          <button
            onClick={onOpenProjector}
            className="apple-btn-secondary"
            title={t.btnFullscreen}
          >
            <Maximize2 size={15} />
            <span className="hidden-tablet">{t.btnFullscreen}</span>
          </button>

          <button
            onClick={resetToInitial}
            className="apple-btn-secondary"
            title={t.btnReset}
            style={{ padding: '9px 12px' }}
          >
            <RotateCcw size={15} />
          </button>

          <div style={{
            width: 1,
            height: 22,
            backgroundColor: 'var(--border-light)',
            margin: '0 4px',
          }} />

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="apple-btn-secondary"
            style={{ padding: '9px 11px' }}
            title={t.themeToggle}
          >
            {theme === 'dark' ? <Sun size={15} color="#ffd60a" /> : <Moon size={15} color="#0071e3" />}
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="apple-glass-pill"
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
            }}
            title={t.langToggle}
          >
            <Globe size={13} />
            <span>{language.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
