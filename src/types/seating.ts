export type Language = 'ko' | 'en';

export type ViewMode = 'hall' | 'classes' | 'entrance' | 'exit';

export interface Student {
  id: string;
  classId: number;
  studentNumber: number;
  name: string;
  isWheelchair: boolean;
  assignedSeatId: string | null;
}

export interface ClassInfo {
  id: number;
  name: string;
  nameEn: string;
  color: string;
  studentCount: number;
  wheelchairCount: number;
  students: Student[];
}

export type BlockType = 'A' | 'B' | 'C';

export interface Seat {
  id: string; // e.g., 'A-1-1'
  block: BlockType;
  row: number; // 1 to 20
  col: number; // 1 to 8 (A, C) or 1 to 13 (B)
  isAisleEdge: boolean;
  isFrontRow: boolean;
  isWheelchairSpot: boolean;
  assignedStudent: {
    classId: number;
    studentNumber: number;
    className: string;
    classNameEn: string;
    isWheelchair: boolean;
    color: string;
  } | null;
}

export interface SafetyStep {
  step: number;
  titleKo: string;
  titleEn: string;
  descKo: string;
  descEn: string;
  activeRows: number[];
  activeBlocks: BlockType[];
  targetClassIds: number[];
  focusWheelchair: boolean;
  durationSeconds: number;
}

export interface FilterState {
  selectedClassId: number | null;
  onlyWheelchair: boolean;
  searchQuery: string;
  highlightBlock: BlockType | null;
}
