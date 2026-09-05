import { UserLessonProgress, TestResult, SoundTheme, KeyboardLayoutType } from '../types';

const STORAGE_KEYS = {
  LESSON_PROGRESS: 'typist_lesson_progress_v1',
  TEST_RESULTS: 'typist_test_results_v1',
  GLOBAL_STATS: 'typist_global_stats_v1',
  SETTINGS: 'typist_settings_v1',
  ERROR_HEATMAP: 'typist_error_heatmap_v1',
};

export interface AppSettings {
  soundTheme: SoundTheme;
  isMuted: boolean;
  showHandsGuide: boolean;
  showKeyboard: boolean;
  showWpmLive: boolean;
  highlightFingers: boolean;
  keyboardLayout: KeyboardLayoutType;
  keyboardSetupCompleted: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  soundTheme: 'mechanical',
  isMuted: false,
  showHandsGuide: true,
  showKeyboard: true,
  showWpmLive: true,
  highlightFingers: true,
  keyboardLayout: 'universal',
  keyboardSetupCompleted: false,
};

export function getLessonProgress(): Record<string, UserLessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLessonProgress(progress: UserLessonProgress) {
  try {
    const all = getLessonProgress();
    const existing = all[progress.lessonId];

    // Only update if better or first time
    if (!existing || progress.stars >= existing.stars || progress.bestWpm > existing.bestWpm) {
      all[progress.lessonId] = {
        ...existing,
        ...progress,
        bestWpm: Math.max(progress.bestWpm, existing?.bestWpm || 0),
        bestAccuracy: Math.max(progress.bestAccuracy, existing?.bestAccuracy || 0),
        stars: Math.max(progress.stars, existing?.stars || 0),
        completed: true,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(all));
    }
  } catch {
    // Ignore storage issues
  }
}

export function getTestHistory(): TestResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTestResult(result: TestResult) {
  try {
    const history = getTestHistory();
    history.unshift(result);
    // Keep last 50
    const trimmed = history.slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(trimmed));
  } catch {
    // Ignore
  }
}

export function getGlobalErrorHeatmap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ERROR_HEATMAP);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function recordErrorsToHeatmap(errors: Record<string, number>) {
  try {
    const map = getGlobalErrorHeatmap();
    Object.entries(errors).forEach(([char, count]) => {
      map[char] = (map[char] || 0) + count;
    });
    localStorage.setItem(STORAGE_KEYS.ERROR_HEATMAP, JSON.stringify(map));
  } catch {
    // Ignore
  }
}

export function getAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveAppSettings(settings: AppSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}
