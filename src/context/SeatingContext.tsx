import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type {
  ClassInfo,
  FilterState,
  Language,
  SafetyStep,
  Seat,
  ViewMode
} from '../types/seating';
import {
  assignSeatsToHall,
  ENTRANCE_STEPS,
  EXIT_STEPS,
  generateEmptyHall,
  generateInitialClasses,
} from '../utils/seatingLogic';
import confetti from 'canvas-confetti';

interface SeatingContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  classes: ClassInfo[];
  seats: Seat[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isShuffling: boolean;
  selectedSeat: Seat | null;
  setSelectedSeat: (seat: Seat | null) => void;
  currentStepIndex: number;
  currentSafetySteps: SafetyStep[];
  nextSafetyStep: () => void;
  prevSafetyStep: () => void;
  resetSafetyStep: () => void;
  shuffleSeats: () => Promise<void>;
  resetToInitial: () => void;
  updateClassWheelchairCount: (classId: number, delta: number) => void;
  exportCsvData: () => void;
  totalStats: {
    totalSeats: number;
    assignedSeats: number;
    wheelchairCount: number;
  };
}

const STORAGE_KEY = 'concert_seating_state_v1';

const SeatingContext = createContext<SeatingContextType | undefined>(undefined);

export const SeatingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('concert_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Language state
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('concert_lang');
    return saved === 'en' ? 'en' : 'ko';
  });

  // View Mode
  const [viewMode, setViewMode] = useState<ViewMode>('hall');

  // Classes & Seats State
  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.classes && parsed.classes.length === 29) {
          return parsed.classes;
        }
      }
    } catch {
      // ignore
    }
    return generateInitialClasses();
  });

  const [seats, setSeats] = useState<Seat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.seats && parsed.seats.length === 580) {
          return parsed.seats;
        }
      }
    } catch {
      // ignore
    }
    const initialClasses = generateInitialClasses();
    const emptyHall = generateEmptyHall();
    const { updatedSeats } = assignSeatsToHall(initialClasses, emptyHall, false);
    return updatedSeats;
  });

  // Filter & Interaction State
  const [filters, setFilters] = useState<FilterState>({
    selectedClassId: null,
    onlyWheelchair: false,
    searchQuery: '',
    highlightBlock: null,
  });

  const [isShuffling, setIsShuffling] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  // Safety simulation step index (0-based)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Theme attribute synchronization
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('concert_theme', theme);
  }, [theme]);

  // Language attribute synchronization
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('concert_lang', language);
  }, [language]);

  // LocalStorage persistence
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ classes, seats }));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [classes, seats]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'ko' ? 'en' : 'ko'));
  };

  // Switch between entrance and exit safety steps
  const currentSafetySteps = viewMode === 'exit' ? EXIT_STEPS : ENTRANCE_STEPS;

  const nextSafetyStep = () => {
    if (currentStepIndex < currentSafetySteps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const prevSafetyStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const resetSafetyStep = () => {
    setCurrentStepIndex(0);
  };

  // Adjust wheelchair count for a specific class
  const updateClassWheelchairCount = useCallback((classId: number, delta: number) => {
    setClasses(prevClasses => {
      const updatedClasses = prevClasses.map(c => {
        if (c.id !== classId) return c;
        const newCount = Math.max(0, Math.min(5, c.wheelchairCount + delta));
        const updatedStudents = c.students.map((st, sIdx) => ({
          ...st,
          isWheelchair: sIdx < newCount,
        }));
        return {
          ...c,
          wheelchairCount: newCount,
          students: updatedStudents,
        };
      });

      // Automatically re-assign hall with updated wheelchair positions smoothly
      const emptyHall = generateEmptyHall();
      const { updatedSeats } = assignSeatsToHall(updatedClasses, emptyHall, false);
      setSeats(updatedSeats);

      return updatedClasses;
    });
  }, []);

  // Apple-grade Random Shuffle with fluid texture timing
  const shuffleSeats = async () => {
    if (isShuffling) return;
    setIsShuffling(true);
    setSelectedSeat(null);

    // Initial ripple feedback
    await new Promise(res => setTimeout(res, 400));

    // Execute constrained random shuffle
    const emptyHall = generateEmptyHall();
    const { updatedSeats, updatedClasses } = assignSeatsToHall(classes, emptyHall, true);
    
    setClasses(updatedClasses);
    setSeats(updatedSeats);

    // Confetti celebration trigger
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#0071e3', '#34c759', '#ff9500', '#af52de'],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }

    // Keep shimmer animation active for smooth tactile experience
    setTimeout(() => {
      setIsShuffling(false);
    }, 700);
  };

  // Reset to initial clean state
  const resetToInitial = () => {
    const initialClasses = generateInitialClasses();
    const emptyHall = generateEmptyHall();
    const { updatedSeats, updatedClasses } = assignSeatsToHall(initialClasses, emptyHall, false);
    setClasses(updatedClasses);
    setSeats(updatedSeats);
    setSelectedSeat(null);
    setCurrentStepIndex(0);
    setFilters({
      selectedClassId: null,
      onlyWheelchair: false,
      searchQuery: '',
      highlightBlock: null,
    });
  };

  // CSV Export for school teachers and administrators
  const exportCsvData = () => {
    const headers = ['Seat ID', 'Block', 'Row', 'Column', 'Class', 'Student Number', 'Wheelchair', 'Aisle Seat'];
    const rows = seats.map(s => [
      s.id,
      s.block,
      s.row,
      s.col,
      s.assignedStudent?.className || 'Unassigned',
      s.assignedStudent?.studentNumber || '',
      s.assignedStudent?.isWheelchair ? 'YES (Wheelchair)' : 'NO',
      s.isAisleEdge ? 'YES' : 'NO',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `concert_safe_seating_manifest_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics calculation
  const totalStats = {
    totalSeats: seats.length,
    assignedSeats: seats.filter(s => s.assignedStudent !== null).length,
    wheelchairCount: seats.filter(s => s.assignedStudent?.isWheelchair).length,
  };

  return (
    <SeatingContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        theme,
        toggleTheme,
        viewMode,
        setViewMode,
        classes,
        seats,
        filters,
        setFilters,
        isShuffling,
        selectedSeat,
        setSelectedSeat,
        currentStepIndex,
        currentSafetySteps,
        nextSafetyStep,
        prevSafetyStep,
        resetSafetyStep,
        shuffleSeats,
        resetToInitial,
        updateClassWheelchairCount,
        exportCsvData,
        totalStats,
      }}
    >
      {children}
    </SeatingContext.Provider>
  );
};

export const useSeating = () => {
  const context = useContext(SeatingContext);
  if (!context) {
    throw new Error('useSeating must be used within a SeatingProvider');
  }
  return context;
};
