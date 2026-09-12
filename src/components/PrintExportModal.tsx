import React from 'react';
import { useSeating } from '../context/SeatingContext';
import { getTranslation } from '../utils/i18n';
import { X, Printer, Download } from 'lucide-react';

export const PrintExportModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { language, classes, seats, exportCsvData } = useSeating();
  const t = getTranslation(language);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9990,
      backgroundColor: 'var(--bg-overlay)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div className="apple-card" style={{
        width: '100%',
        maxWidth: 960,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--bg-card)',
        overflow: 'hidden',
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {t.printTitle}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {t.printSubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => window.print()}
              className="apple-btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Printer size={15} />
              <span>좌석표 인쇄</span>
            </button>

            <button
              onClick={exportCsvData}
              className="apple-btn-secondary"
              style={{ padding: '8px 16px', fontSize: '0.84rem' }}
            >
              <Download size={15} />
              <span>CSV 다운로드</span>
            </button>

            <button
              onClick={onClose}
              className="apple-btn-secondary"
              style={{ padding: '8px 10px' }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Printable Content Scroll Body */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {classes.map(c => {
            const classSeats = seats.filter(s => s.assignedStudent?.classId === c.id);
            return (
              <div
                key={c.id}
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  backgroundColor: 'var(--bg-app)',
                  breakInside: 'avoid',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                  paddingBottom: 8,
                  borderBottom: '1px solid var(--border-light)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: c.color,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                      {language === 'ko' ? c.name : c.nameEn} (총 20명)
                    </span>
                  </div>

                  <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    휠체어 배려석: {c.wheelchairCount}명
                  </span>
                </div>

                {/* Table of 20 students */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: 8,
                }}>
                  {classSeats.map(seat => (
                    <div
                      key={seat.id}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        backgroundColor: seat.assignedStudent?.isWheelchair
                          ? 'rgba(52, 199, 89, 0.15)'
                          : 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {seat.assignedStudent?.studentNumber}번 학생
                      </span>
                      <span style={{
                        fontWeight: 700,
                        color: seat.assignedStudent?.isWheelchair ? 'var(--accent-emerald)' : 'var(--accent-blue)',
                      }}>
                        {seat.assignedStudent?.isWheelchair ? '♿ ' : ''}{seat.id}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
