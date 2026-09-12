import React from 'react';
import { useSeating } from '../context/SeatingContext';
import { getTranslation } from '../utils/i18n';
import { Accessibility, Eye, Plus, Minus } from 'lucide-react';

export const ClassDirectoryView: React.FC = () => {
  const {
    language,
    classes,
    seats,
    updateClassWheelchairCount,
    setFilters,
    setViewMode,
  } = useSeating();

  const t = getTranslation(language);

  const handleInspectClass = (classId: number) => {
    setFilters(prev => ({ ...prev, selectedClassId: classId, onlyWheelchair: false }));
    setViewMode('hall');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Overview Banner */}
      <div className="apple-card" style={{
        padding: '24px 28px',
        background: 'linear-gradient(135deg, rgba(0, 113, 227, 0.08) 0%, rgba(52, 199, 89, 0.08) 100%)',
        border: '1px solid var(--border-light)',
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
          {t.classManagerTitle}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: 780 }}>
          {t.classManagerDesc}
        </p>
      </div>

      {/* 29 Classes Responsive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {classes.map(c => {
          // Find seats allocated to this class
          const classSeats = seats.filter(s => s.assignedStudent?.classId === c.id);

          return (
            <div
              key={c.id}
              className="apple-card"
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top Accent Stripe */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                backgroundColor: c.color,
              }} />

              {/* Class Title & Badges */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: `${c.color}25`,
                    color: c.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    border: `1px solid ${c.color}50`,
                  }}>
                    {c.id}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {language === 'ko' ? c.name : c.nameEn}
                    </h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                      20{language === 'ko' ? '명 전원 배정됨' : ' Students Assigned'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleInspectClass(c.id)}
                  className="apple-glass-pill"
                  style={{
                    padding: '5px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    cursor: 'pointer',
                  }}
                  title="홀에서 해당 학급 좌석 위치 확인"
                >
                  <Eye size={13} />
                  <span>{language === 'ko' ? '홀에서 보기' : 'Locate'}</span>
                </button>
              </div>

              {/* Wheelchair Pre-Pinning Controller */}
              <div style={{
                backgroundColor: 'rgba(0,0,0,0.025)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <Accessibility size={16} color="var(--accent-emerald)" />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.wheelchairCountLabel}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                      앞열/통로 안전 배정
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateClassWheelchairCount(c.id, -1)}
                    disabled={c.wheelchairCount <= 0}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      cursor: c.wheelchairCount > 0 ? 'pointer' : 'default',
                    }}
                  >
                    <Minus size={13} />
                  </button>

                  <span style={{
                    minWidth: 20,
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: c.wheelchairCount > 0 ? 'var(--accent-emerald)' : 'var(--text-tertiary)',
                  }}>
                    {c.wheelchairCount}
                  </span>

                  <button
                    onClick={() => updateClassWheelchairCount(c.id, 1)}
                    disabled={c.wheelchairCount >= 5}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-app)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      cursor: c.wheelchairCount < 5 ? 'pointer' : 'default',
                    }}
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Assigned Seat Pills Preview */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 6,
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                }}>
                  <span>좌석 배정 현황</span>
                  <span>{classSeats.length} / 20</span>
                </div>

                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 4,
                  maxHeight: 74,
                  overflowY: 'auto',
                }}>
                  {classSeats.map(seat => (
                    <span
                      key={seat.id}
                      style={{
                        fontSize: '0.7rem',
                        padding: '2px 6px',
                        borderRadius: 4,
                        backgroundColor: seat.assignedStudent?.isWheelchair
                          ? 'rgba(52, 199, 89, 0.2)'
                          : 'rgba(0,0,0,0.04)',
                        border: seat.assignedStudent?.isWheelchair
                          ? '1px solid var(--accent-emerald)'
                          : '1px solid var(--border-subtle)',
                        color: seat.assignedStudent?.isWheelchair
                          ? 'var(--accent-emerald)'
                          : 'var(--text-secondary)',
                        fontWeight: seat.assignedStudent?.isWheelchair ? 700 : 500,
                      }}
                      title={`${seat.assignedStudent?.studentNumber}번 -> ${seat.id}`}
                    >
                      {seat.assignedStudent?.isWheelchair ? '♿ ' : ''}
                      {seat.assignedStudent?.studentNumber}번: {seat.id}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
