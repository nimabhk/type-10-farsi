export type FingerType = 
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumbs'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDefinition {
  code: string;           // e.g. "KeyF", "KeyJ"
  faChar: string;         // e.g. "ب", "ت"
  faShiftChar?: string;   // e.g. "ـ", "؛", "،"
  altFaChar?: string;     // alternative like standard vs windows
  enChar: string;         // e.g. "f", "j"
  finger: FingerType;     // which finger presses it
  width?: string;         // CSS width class like 'w-12', 'w-16', 'flex-1'
  isSpecial?: boolean;
}

export type LessonLevel = 'beginner' | 'intermediate' | 'advanced' | 'special';

export interface Lesson {
  id: string;
  category: string;
  categoryFa: string;
  level: LessonLevel;
  title: string;
  description: string;
  targetKeys: string[];
  practiceText: string;
  minWpm: number;
  minAccuracy: number;
}

export interface UserLessonProgress {
  lessonId: string;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  stars: number; // 0-3
  completedAt?: string;
}

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  rawWpm: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  elapsedSeconds: number;
  errorKeys: Record<string, number>; // key -> error count
  keyTimes: Record<string, number[]>; // key -> array of reaction times ms
}

export interface TestResult {
  id: string;
  date: string;
  mode: 'lesson' | 'test' | 'race' | 'custom';
  title: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  durationSeconds: number;
  errorRate: number;
  weakestKeys: string[];
}

export interface RacerBot {
  id: string;
  name: string;
  avatar: string;
  carColor: string;
  targetWpm: number;
  progress: number; // 0 to 100
  currentWpm: number;
  isUser?: boolean;
}

export type AppMode = 'lessons' | 'speedtest' | 'race' | 'custom' | 'analytics';

export type SoundTheme = 'mechanical' | 'thock' | 'typewriter' | 'silent';

export type KeyboardLayoutType = 'windows' | 'isiri' | 'mac' | 'universal';
