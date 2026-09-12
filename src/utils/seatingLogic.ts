import type { ClassInfo, SafetyStep, Seat, Student } from '../types/seating';

// 29 Curated Apple-grade Harmonious Colors for 29 Classes
export const CLASS_COLORS: string[] = [
  '#0071e3', // Apple Blue
  '#34c759', // Apple Emerald
  '#ff9500', // Apple Orange
  '#ff2d55', // Apple Pink/Rose
  '#af52de', // Apple Purple
  '#5856d6', // Apple Indigo
  '#00c7be', // Apple Teal
  '#32ade6', // Apple Cyan
  '#a2845e', // Apple Brown
  '#ff3b30', // Apple Red
  '#30b0c7', // Slate Cyan
  '#63e6e2', // Mint
  '#ffd60a', // Apple Yellow
  '#64d2ff', // Sky Blue
  '#bf5af2', // Lavender
  '#30d158', // Spring Green
  '#ff453a', // Coral
  '#ff9f0a', // Bright Amber
  '#d1a374', // Warm Sand
  '#7d7aff', // Periwinkle
  '#0a84ff', // Ocean
  '#34d399', // Jade
  '#fb7185', // Strawberry
  '#c084fc', // Orchid
  '#38bdf8', // Light Blue
  '#f59e0b', // Sunset
  '#10b981', // Forest Mint
  '#ec4899', // Deep Rose
  '#8b5cf6', // Violet
];

export const TOTAL_ROWS = 20;
export const BLOCK_A_COLS = 8;
export const BLOCK_B_COLS = 13;
export const BLOCK_C_COLS = 8;
export const TOTAL_SEATS = 580; // (8 + 13 + 8) * 20 = 29 * 20 = 580

/**
 * Generate 29 classes with 20 students each (total 580 students).
 * Default 1 wheelchair student for the first 5 classes, 0 for others (configurable).
 */
export function generateInitialClasses(): ClassInfo[] {
  const classes: ClassInfo[] = [];

  for (let i = 1; i <= 29; i++) {
    const defaultWheelchair = i <= 6 ? 1 : 0;
    const students: Student[] = [];

    for (let s = 1; s <= 20; s++) {
      students.push({
        id: `c${i}-s${s}`,
        classId: i,
        studentNumber: s,
        name: `${i}반 ${s}번`,
        isWheelchair: s <= defaultWheelchair,
        assignedSeatId: null,
      });
    }

    classes.push({
      id: i,
      name: `${i}반`,
      nameEn: `Class ${i}`,
      color: CLASS_COLORS[(i - 1) % CLASS_COLORS.length],
      studentCount: 20,
      wheelchairCount: defaultWheelchair,
      students,
    });
  }

  return classes;
}

/**
 * Generate empty 580-seat hall layout with Aisle markers and front row identification.
 */
export function generateEmptyHall(): Seat[] {
  const seats: Seat[] = [];

  for (let r = 1; r <= TOTAL_ROWS; r++) {
    const isFront = r <= 2;

    // Block A: 8 columns
    for (let c = 1; c <= BLOCK_A_COLS; c++) {
      const isAisle = c === BLOCK_A_COLS; // Column 8 borders Left Center Aisle
      seats.push({
        id: `A-${r}-${c}`,
        block: 'A',
        row: r,
        col: c,
        isAisleEdge: isAisle,
        isFrontRow: isFront,
        isWheelchairSpot: isFront || isAisle,
        assignedStudent: null,
      });
    }

    // Block B: 13 columns
    for (let c = 1; c <= BLOCK_B_COLS; c++) {
      const isAisle = c === 1 || c === BLOCK_B_COLS; // Col 1 borders Left Aisle, Col 13 borders Right Aisle
      seats.push({
        id: `B-${r}-${c}`,
        block: 'B',
        row: r,
        col: c,
        isAisleEdge: isAisle,
        isFrontRow: isFront,
        isWheelchairSpot: isFront || isAisle,
        assignedStudent: null,
      });
    }

    // Block C: 8 columns
    for (let c = 1; c <= BLOCK_C_COLS; c++) {
      const isAisle = c === 1; // Col 1 borders Right Center Aisle
      seats.push({
        id: `C-${r}-${c}`,
        block: 'C',
        row: r,
        col: c,
        isAisleEdge: isAisle,
        isFrontRow: isFront,
        isWheelchairSpot: isFront || isAisle,
        assignedStudent: null,
      });
    }
  }

  return seats;
}

/**
 * Assign students to seats:
 * 1. Pre-pins wheelchair students safely along front rows and accessible aisle edges.
 * 2. If shuffle is requested, randomly permutes student assignments while respecting wheelchair safety anchors.
 */
export function assignSeatsToHall(
  classes: ClassInfo[],
  emptySeats: Seat[],
  shuffle: boolean = false
): { updatedSeats: Seat[]; updatedClasses: ClassInfo[] } {
  const seatsCopy: Seat[] = emptySeats.map(s => ({ ...s, assignedStudent: null as Seat['assignedStudent'] }));
  const classesCopy: ClassInfo[] = JSON.parse(JSON.stringify(classes));

  // Flatten all students
  const wheelchairStudents: { student: Student; classInfo: ClassInfo }[] = [];
  const regularStudents: { student: Student; classInfo: ClassInfo }[] = [];

  classesCopy.forEach(c => {
    c.students.forEach(st => {
      st.assignedSeatId = null;
      if (st.isWheelchair) {
        wheelchairStudents.push({ student: st, classInfo: c });
      } else {
        regularStudents.push({ student: st, classInfo: c });
      }
    });
  });

  // Identify accessible wheelchair-safe seats (Row 1-2 or Aisle Edge)
  const safeWheelchairSeats = seatsCopy
    .filter(s => s.isWheelchairSpot)
    .sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row; // Front rows first
      return a.col - b.col;
    });

  // If shuffle requested
  if (shuffle) {
    // Fisher-Yates shuffle for regular students
    for (let i = regularStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [regularStudents[i], regularStudents[j]] = [regularStudents[j], regularStudents[i]];
    }
    // Also randomize wheelchair student positions among safe seats
    for (let i = wheelchairStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wheelchairStudents[i], wheelchairStudents[j]] = [wheelchairStudents[j], wheelchairStudents[i]];
    }
  }

  // 1. Assign wheelchair students into safe accessible spots
  const usedSeatIds = new Set<string>();

  wheelchairStudents.forEach(({ student, classInfo }, idx) => {
    const targetSeat = safeWheelchairSeats[idx % safeWheelchairSeats.length];
    targetSeat.assignedStudent = {
      classId: classInfo.id,
      studentNumber: student.studentNumber,
      className: classInfo.name,
      classNameEn: classInfo.nameEn,
      isWheelchair: true,
      color: classInfo.color,
    };
    student.assignedSeatId = targetSeat.id;
    usedSeatIds.add(targetSeat.id);
  });

  // Remaining available seats (combines unassigned safe seats + regular seats)
  const remainingAvailableSeats = seatsCopy.filter(s => !usedSeatIds.has(s.id));

  // If shuffle, shuffle the fill order
  if (shuffle) {
    for (let i = remainingAvailableSeats.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingAvailableSeats[i], remainingAvailableSeats[j]] = [remainingAvailableSeats[j], remainingAvailableSeats[i]];
    }
  }

  // 2. Assign regular students
  regularStudents.forEach(({ student, classInfo }, idx) => {
    if (idx < remainingAvailableSeats.length) {
      const seat = remainingAvailableSeats[idx];
      seat.assignedStudent = {
        classId: classInfo.id,
        studentNumber: student.studentNumber,
        className: classInfo.name,
        classNameEn: classInfo.nameEn,
        isWheelchair: false,
        color: classInfo.color,
      };
      student.assignedSeatId = seat.id;
    }
  });

  return {
    updatedSeats: seatsCopy,
    updatedClasses: classesCopy,
  };
}

/**
 * Pre-defined safe entrance flow steps to avoid crowd choke points.
 */
export const ENTRANCE_STEPS: SafetyStep[] = [
  {
    step: 1,
    titleKo: '1단계: 후면 16~20열 및 외곽 블록 입장',
    titleEn: 'Phase 1: Rear Rows (16-20) & Outer Wings',
    descKo: '무대에서 가장 먼 후면 좌석부터 착석하여 중앙 통로 병목 현상을 방지합니다.',
    descEn: 'Patrons in rear rows enter first through main foyer to keep central aisles clear.',
    activeRows: [16, 17, 18, 19, 20],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
  {
    step: 2,
    titleKo: '2단계: 중후면 11~15열 입장',
    titleEn: 'Phase 2: Mid-Rear Rows (11-15)',
    descKo: '중간 열 관람객이 차례대로 입장하여 좌석을 채웁니다.',
    descEn: 'Mid-rear audiences proceed systematically through dedicated side aisles.',
    activeRows: [11, 12, 13, 14, 15],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
  {
    step: 3,
    titleKo: '3단계: 중전면 6~10열 입장',
    titleEn: 'Phase 3: Mid-Front Rows (6-10)',
    descKo: '무대와 가까운 전면 좌석 관람객이 안내에 따라 착석합니다.',
    descEn: 'Audiences in rows 6-10 enter calmly as rear sections are now seated.',
    activeRows: [6, 7, 8, 9, 10],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
  {
    step: 4,
    titleKo: '4단계: 전면 1~5열 및 휠체어 배려석 안심 착석',
    titleEn: 'Phase 4: Front Rows (1-5) & Wheelchair Safe Entry',
    descKo: '전담 안전 도우미와 함께 휠체어 관람객 및 1~5열 관람객이 여유롭게 착석합니다.',
    descEn: 'Front rows and wheelchair patrons enter with safety staff guidance.',
    activeRows: [1, 2, 3, 4, 5],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: true,
    durationSeconds: 180,
  },
];

/**
 * Pre-defined orderly evacuation/exit flow steps based on emergency exits.
 */
export const EXIT_STEPS: SafetyStep[] = [
  {
    step: 1,
    titleKo: '1단계: 휠체어 배려석 및 전면 1~4열 비상구 우선 퇴장',
    titleEn: 'Phase 1: Wheelchair Priority & Front Rows (1-4)',
    descKo: '무대 좌우측 비상 대피구를 통해 휠체어 관람객과 전면 학생이 신속하고 안전하게 퇴장합니다.',
    descEn: 'Wheelchair patrons and front rows exit safely via front-stage emergency exits.',
    activeRows: [1, 2, 3, 4],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: true,
    durationSeconds: 150,
  },
  {
    step: 2,
    titleKo: '2단계: 후면 17~20열 중앙 출입구 퇴장',
    titleEn: 'Phase 2: Rear Rows (17-20) via Main Exits',
    descKo: '로비와 인접한 맨 뒷열 학생부터 후면 대형 비상구를 통해 질서정연하게 이동합니다.',
    descEn: 'Audience nearest to main rear exits proceed outward without queueing.',
    activeRows: [17, 18, 19, 20],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
  {
    step: 3,
    titleKo: '3단계: 11~16열 측면 비상구 순차 퇴장',
    titleEn: 'Phase 3: Rows 11-16 via Lateral Exits',
    descKo: '중후면 학생들이 좌우 측면 비상 유도등을 따라 이동합니다.',
    descEn: 'Middle-rear sections vacate guided by lateral green exit signs.',
    activeRows: [11, 12, 13, 14, 15, 16],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
  {
    step: 4,
    titleKo: '4단계: 5~10열 최종 안전 퇴장 및 완료 점검',
    titleEn: 'Phase 4: Rows 5-10 Final Orderly Clearance',
    descKo: '남은 중전면 학생들이 안전하게 이동하며 객석 내 잔여 인원을 최종 확인합니다.',
    descEn: 'Remaining middle section departs safely followed by safety sweep.',
    activeRows: [5, 6, 7, 8, 9, 10],
    activeBlocks: ['A', 'B', 'C'],
    targetClassIds: [],
    focusWheelchair: false,
    durationSeconds: 120,
  },
];
