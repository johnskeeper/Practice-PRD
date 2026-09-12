import React from 'react';
import { useSeating } from '../context/SeatingContext';
import { getTranslation } from '../utils/i18n';
import type { Seat } from '../types/seating';
import { Accessibility, Search, DoorOpen, Sparkles, Filter } from 'lucide-react';

export const ConcertHallView: React.FC = () => {
  const {
    language,
    seats,
    classes,
    filters,
    setFilters,
    isShuffling,
    selectedSeat,
    setSelectedSeat,
    viewMode,
    currentStepIndex,
    currentSafetySteps,
  } = useSeating();

  const t = getTranslation(language);

  // Group seats by row (1 to 20)
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  // Check if a seat matches the current safety step in simulation mode
  const currentStep = (viewMode === 'entrance' || viewMode === 'exit')
    ? currentSafetySteps[currentStepIndex]
    : null;

  const isSeatActiveInSimulation = (seat: Seat) => {
    if (!currentStep) return true;
    if (currentStep.focusWheelchair && seat.assignedStudent?.isWheelchair) {
      return true;
    }
    return currentStep.activeRows.includes(seat.row);
  };

  // Check filter matches
  const isSeatFiltered = (seat: Seat) => {
    if (filters.onlyWheelchair && !seat.assignedStudent?.isWheelchair) {
      return false;
    }
    if (filters.selectedClassId !== null && seat.assignedStudent?.classId !== filters.selectedClassId) {
      return false;
    }
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      const matchClass = seat.assignedStudent?.className.toLowerCase().includes(q);
      const matchClassEn = seat.assignedStudent?.classNameEn.toLowerCase().includes(q);
      const matchNumber = seat.assignedStudent?.studentNumber.toString() === q;
      const matchSeatId = seat.id.toLowerCase().includes(q);
      if (!matchClass && !matchClassEn && !matchNumber && !matchSeatId) {
        return false;
      }
    }
    return true;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Control / Filter Bar */}
      <div className="apple-card" style={{
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
      }}>
        {/* Left: Class and Wheelchair filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: '0.86rem' }}>
            <Filter size={15} />
            <span style={{ fontWeight: 600 }}>{t.totalClasses}:</span>
          </div>

          <select
            value={filters.selectedClassId ?? ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              selectedClassId: e.target.value === '' ? null : Number(e.target.value),
            }))}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            <option value="">{t.filterAll} (29{language === 'ko' ? '학급' : ' Classes'})</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>
                {language === 'ko' ? c.name : c.nameEn} ({c.studentCount}명)
              </option>
            ))}
          </select>

          {/* Wheelchair Only Toggle */}
          <button
            onClick={() => setFilters(prev => ({ ...prev, onlyWheelchair: !prev.onlyWheelchair }))}
            className={`apple-glass-pill ${filters.onlyWheelchair ? 'active' : ''}`}
            style={{
              padding: '6px 14px',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              backgroundColor: filters.onlyWheelchair ? 'rgba(52, 199, 89, 0.2)' : undefined,
              borderColor: filters.onlyWheelchair ? 'var(--accent-emerald)' : undefined,
              color: filters.onlyWheelchair ? 'var(--accent-emerald)' : 'var(--text-secondary)',
            }}
          >
            <Accessibility size={14} />
            <span>{t.filterWheelchairOnly}</span>
          </button>
        </div>

        {/* Right: Search Input */}
        <div style={{ position: 'relative', minWidth: 260 }}>
          <Search size={15} style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-tertiary)',
          }} />
          <input
            type="text"
            placeholder={t.filterSearchPlaceholder}
            value={filters.searchQuery}
            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
            style={{
              width: '100%',
              padding: '7px 12px 7px 34px',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-light)',
              background: 'var(--bg-app)',
              color: 'var(--text-primary)',
              fontSize: '0.84rem',
            }}
          />
        </div>
      </div>

      {/* Main Auditorium Layout Container */}
      <div
        className={`apple-card ${isShuffling ? 'texture-shimmer-active' : ''}`}
        style={{
          padding: '24px 20px',
          overflowX: 'auto',
          position: 'relative',
        }}
      >
        {/* STAGE & EMERGENCY EXITS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 24,
          padding: '0 12px',
        }}>
          {/* Stage Left Exit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(52, 199, 89, 0.12)',
            border: '1px solid rgba(52, 199, 89, 0.3)',
            color: 'var(--accent-emerald)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            <DoorOpen size={15} />
            <span>{t.emergencyExit} A (STAGE L)</span>
          </div>

          {/* Curved Ambient Stage */}
          <div style={{
            flex: '0 1 540px',
            height: 48,
            borderRadius: '24px 24px 8px 8px',
            background: 'linear-gradient(180deg, rgba(0, 113, 227, 0.15) 0%, rgba(175, 82, 222, 0.08) 100%)',
            border: '1px solid rgba(0, 113, 227, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            boxShadow: '0 8px 24px -6px rgba(0, 113, 227, 0.2)',
          }}>
            <Sparkles size={16} color="var(--accent-blue)" />
            <span style={{
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.12em',
              color: 'var(--text-primary)',
            }}>
              {t.stage}
            </span>
          </div>

          {/* Stage Right Exit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'rgba(52, 199, 89, 0.12)',
            border: '1px solid rgba(52, 199, 89, 0.3)',
            color: 'var(--accent-emerald)',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}>
            <DoorOpen size={15} />
            <span>{t.emergencyExit} B (STAGE R)</span>
          </div>
        </div>

        {/* Column Block Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '40px 1fr 32px 1.62fr 32px 1fr 40px',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: 12,
          fontSize: '0.75rem',
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          <div></div>
          <div style={{ padding: '4px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 6 }}>
            {t.blockA} (8석 × 20열)
          </div>
          <div style={{ color: 'var(--accent-emerald)', fontSize: '0.7rem' }}>Aisle</div>
          <div style={{ padding: '4px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 6 }}>
            {t.blockB} (13석 × 20열)
          </div>
          <div style={{ color: 'var(--accent-emerald)', fontSize: '0.7rem' }}>Aisle</div>
          <div style={{ padding: '4px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: 6 }}>
            {t.blockC} (8석 × 20열)
          </div>
          <div></div>
        </div>

        {/* 20 Rows Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 980 }}>
          {rows.map(rowNum => {
            const blockASeats = seats.filter(s => s.block === 'A' && s.row === rowNum);
            const blockBSeats = seats.filter(s => s.block === 'B' && s.row === rowNum);
            const blockCSeats = seats.filter(s => s.block === 'C' && s.row === rowNum);

            return (
              <div
                key={`row-${rowNum}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 32px 1.62fr 32px 1fr 40px',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                {/* Left Row Indicator */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  textAlign: 'center',
                }}>
                  R{rowNum}
                </div>

                {/* Block A Seats (8 cols) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: 4,
                }}>
                  {blockASeats.map(seat => renderSeatCell(seat))}
                </div>

                {/* Left Aisle Safety Channel */}
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px dashed rgba(52, 199, 89, 0.3)',
                  borderRight: '1px dashed rgba(52, 199, 89, 0.3)',
                  backgroundColor: 'rgba(52, 199, 89, 0.03)',
                  fontSize: '0.65rem',
                  color: 'var(--accent-emerald)',
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(52, 199, 89, 0.4)' }} />
                </div>

                {/* Block B Seats (13 cols) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(13, 1fr)',
                  gap: 4,
                }}>
                  {blockBSeats.map(seat => renderSeatCell(seat))}
                </div>

                {/* Right Aisle Safety Channel */}
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderLeft: '1px dashed rgba(52, 199, 89, 0.3)',
                  borderRight: '1px dashed rgba(52, 199, 89, 0.3)',
                  backgroundColor: 'rgba(52, 199, 89, 0.03)',
                  fontSize: '0.65rem',
                  color: 'var(--accent-emerald)',
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: 'rgba(52, 199, 89, 0.4)' }} />
                </div>

                {/* Block C Seats (8 cols) */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: 4,
                }}>
                  {blockCSeats.map(seat => renderSeatCell(seat))}
                </div>

                {/* Right Row Indicator */}
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-tertiary)',
                  textAlign: 'center',
                }}>
                  R{rowNum}
                </div>
              </div>
            );
          })}
        </div>

        {/* REAR MAIN ENTRANCE FOYER */}
        <div style={{
          marginTop: 24,
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(0, 0, 0, 0.03)',
          border: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <DoorOpen size={16} color="var(--accent-emerald)" />
            <span style={{ fontWeight: 600 }}>{t.mainEntrance} (Foyer / Rear Gate)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: 'var(--accent-emerald)' }} />
              <span>{t.wheelchairBadge} (♿ {t.quickTipSafety})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: 'rgba(0, 113, 227, 0.5)' }} />
              <span>29개 학급별 고유 컬러</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating or Docked Hover/Selected Seat Card */}
      {selectedSeat && (
        <div className="apple-card" style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: `4px solid ${selectedSeat.assignedStudent?.color || 'var(--accent-blue)'}`,
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 'var(--radius-md)',
              backgroundColor: selectedSeat.assignedStudent?.color || 'var(--accent-blue)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
            }}>
              {selectedSeat.assignedStudent?.isWheelchair ? '♿' : selectedSeat.id}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {selectedSeat.assignedStudent
                    ? `${selectedSeat.assignedStudent.className} ${selectedSeat.assignedStudent.studentNumber}${t.studentNumberLabel}`
                    : t.emptySeat}
                </span>

                {selectedSeat.assignedStudent?.isWheelchair && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(52, 199, 89, 0.15)',
                    color: 'var(--accent-emerald)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    ♿ {t.wheelchairBadge}
                  </span>
                )}

                {selectedSeat.isAisleEdge && (
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(0, 113, 227, 0.1)',
                    color: 'var(--accent-blue)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}>
                    {t.aisleBadge}
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                구역: {selectedSeat.block}블록 {selectedSeat.row}열 {selectedSeat.col}번 좌석 (ID: {selectedSeat.id})
              </div>
            </div>
          </div>

          <button
            onClick={() => setSelectedSeat(null)}
            className="apple-btn-secondary"
            style={{ padding: '6px 14px', fontSize: '0.82rem' }}
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );

  // Seat Cell Render helper
  function renderSeatCell(seat: Seat) {
    const student = seat.assignedStudent;
    const isWheelchair = student?.isWheelchair;
    const isSelected = selectedSeat?.id === seat.id;
    const activeInSim = isSeatActiveInSimulation(seat);
    const passesFilter = isSeatFiltered(seat);

    // Opacity calculation based on filters & simulation
    let cellOpacity = 1;
    if (!passesFilter) cellOpacity = 0.15;
    else if (!activeInSim) cellOpacity = 0.35;

    // Background color: class color tone
    const classColor = student?.color || '#8e8e93';
    const bgColor = isWheelchair
      ? 'rgba(52, 199, 89, 0.22)'
      : `${classColor}20`;
    const borderColor = isWheelchair
      ? 'var(--accent-emerald)'
      : `${classColor}55`;

    return (
      <div
        key={seat.id}
        onClick={() => setSelectedSeat(seat)}
        title={`${seat.id}: ${student ? `${student.className} ${student.studentNumber}번` : 'Empty'}${isWheelchair ? ' (♿ 휠체어석)' : ''}`}
        style={{
          aspectRatio: '1 / 0.9',
          borderRadius: 6,
          backgroundColor: bgColor,
          border: `1px solid ${isSelected ? 'var(--text-primary)' : borderColor}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          opacity: cellOpacity,
          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
          boxShadow: isSelected
            ? '0 4px 12px rgba(0,0,0,0.2)'
            : isWheelchair
            ? '0 0 8px rgba(52, 199, 89, 0.45)'
            : 'none',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
          userSelect: 'none',
        }}
        className={isWheelchair ? 'wheelchair-seat-glow' : ''}
      >
        {isWheelchair ? (
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--accent-emerald)',
            fontWeight: 700,
            lineHeight: 1,
          }}>
            ♿
          </span>
        ) : (
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            {student?.studentNumber ?? seat.col}
          </span>
        )}

        {/* Small Class Color Dot */}
        {student && !isWheelchair && (
          <div style={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: student.color,
            marginTop: 2,
          }} />
        )}
      </div>
    );
  }
};
