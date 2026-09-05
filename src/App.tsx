import React, { useState, useEffect, useCallback } from 'react';
import { 
  AppMode, 
  Lesson, 
  TypingStats, 
  KeyDefinition, 
  UserLessonProgress, 
  TestResult, 
  SoundTheme,
  KeyboardLayoutType 
} from './types';
import { LESSONS } from './data/lessons';
import { Navbar } from './components/Navbar';
import { LessonsView } from './components/LessonsView';
import { SpeedTestView } from './components/SpeedTestView';
import { RaceView } from './components/RaceView';
import { CustomTextView } from './components/CustomTextView';
import { AnalyticsView } from './components/AnalyticsView';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { HandsGuide } from './components/HandsGuide';
import { TypingArea } from './components/TypingArea';
import { ScoreModal } from './components/ScoreModal';
import { KeyboardSetupModal } from './components/KeyboardSetupModal';
import { 
  getLessonProgress, 
  saveLessonProgress, 
  saveTestResult, 
  getTestHistory, 
  recordErrorsToHeatmap, 
  getAppSettings, 
  saveAppSettings, 
  AppSettings 
} from './utils/storage';
import { soundManager } from './utils/audio';
import { generateSmartRemedialDrill } from './utils/persianUtils';
import { ArrowRight, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function App() {
  const [currentMode, setCurrentMode] = useState<AppMode>('lessons');
  const [settings, setSettings] = useState<AppSettings>(() => getAppSettings());
  const [progressMap, setProgressMap] = useState<Record<string, UserLessonProgress>>(() => getLessonProgress());
  
  // Active session states
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeCustomPractice, setActiveCustomPractice] = useState<{
    text: string;
    title: string;
    category: string;
  } | null>(null);

  // Keyboard guides & interactive highlights
  const [targetKeyDef, setTargetKeyDef] = useState<KeyDefinition | null>(null);
  const [nextChar, setNextChar] = useState<string>('');
  const [activePhysicalKey, setActivePhysicalKey] = useState<string | null>(null);
  const [isPhysicalKeyError, setIsPhysicalKeyError] = useState<boolean>(false);

  // Keyboard layout configuration modal state
  const [isKeyboardSetupOpen, setIsKeyboardSetupOpen] = useState<boolean>(
    () => !settings.keyboardSetupCompleted
  );

  const handleSaveKeyboardLayout = (layout: KeyboardLayoutType) => {
    setSettings((prev) => ({
      ...prev,
      keyboardLayout: layout,
      keyboardSetupCompleted: true,
    }));
  };

  // Score modal state
  const [scoreModalData, setScoreModalData] = useState<{
    stats: TypingStats;
    lesson?: Lesson | null;
    mode: 'lesson' | 'test' | 'race' | 'custom';
  } | null>(null);

  // Best WPM overall
  const history = getTestHistory();
  const bestWpm = history.reduce((max, t) => Math.max(max, t.wpm), 0);
  const completedLessonsCount = (Object.values(progressMap) as UserLessonProgress[]).filter((p) => p.completed).length;

  // Sync settings with soundManager
  useEffect(() => {
    soundManager.setTheme(settings.soundTheme);
    soundManager.setMuted(settings.isMuted);
    saveAppSettings(settings);
  }, [settings]);

  const handleToggleMute = () => {
    setSettings((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const handleChangeSoundTheme = (theme: SoundTheme) => {
    setSettings((prev) => ({ ...prev, soundTheme: theme }));
  };

  const handleToggleHandsGuide = () => {
    setSettings((prev) => ({ ...prev, showHandsGuide: !prev.showHandsGuide }));
  };

  const handleToggleKeyboard = () => {
    setSettings((prev) => ({ ...prev, showKeyboard: !prev.showKeyboard }));
  };

  // Target key changed from TypingArea
  const handleTargetKeyChange = useCallback((keyDef: KeyDefinition | null, char: string) => {
    setTargetKeyDef(keyDef);
    setNextChar(char);
  }, []);

  // Physical key event from TypingArea
  const handlePhysicalKeyPress = useCallback((code: string | null, isError: boolean) => {
    setActivePhysicalKey(code);
    setIsPhysicalKeyError(isError);
    // Reset key highlight after 120ms
    setTimeout(() => {
      setActivePhysicalKey(null);
      setIsPhysicalKeyError(false);
    }, 120);
  }, []);

  // Lesson selection
  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveCustomPractice(null);
  };

  // Lesson completed
  const handleLessonComplete = (stats: TypingStats) => {
    if (!activeLesson) return;

    const isPassed = stats.wpm >= activeLesson.minWpm && stats.accuracy >= activeLesson.minAccuracy;
    let stars = 0;
    if (isPassed) {
      stars = 1;
      if (stats.wpm >= activeLesson.minWpm + 10 && stats.accuracy >= 94) stars = 2;
      if (stats.wpm >= activeLesson.minWpm + 20 && stats.accuracy >= 97) stars = 3;

      const progressUpdate: UserLessonProgress = {
        lessonId: activeLesson.id,
        completed: true,
        bestWpm: stats.wpm,
        bestAccuracy: stats.accuracy,
        stars,
      };
      saveLessonProgress(progressUpdate);
      setProgressMap(getLessonProgress());
    }

    // Save test result
    const result: TestResult = {
      id: `lesson-${Date.now()}`,
      date: new Date().toISOString(),
      mode: 'lesson',
      title: activeLesson.title,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      durationSeconds: stats.elapsedSeconds,
      errorRate: 100 - stats.accuracy,
      weakestKeys: Object.keys(stats.errorKeys).slice(0, 5),
    };
    saveTestResult(result);
    recordErrorsToHeatmap(stats.errorKeys);

    setScoreModalData({
      stats,
      lesson: activeLesson,
      mode: 'lesson',
    });
  };

  // Speed test completed
  const handleSpeedTestComplete = (stats: TypingStats, durationSeconds: number) => {
    const result: TestResult = {
      id: `test-${Date.now()}`,
      date: new Date().toISOString(),
      mode: 'test',
      title: `آزمون سرعت ${durationSeconds} ثانیه‌ای`,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      durationSeconds: stats.elapsedSeconds,
      errorRate: 100 - stats.accuracy,
      weakestKeys: Object.keys(stats.errorKeys).slice(0, 5),
    };
    saveTestResult(result);
    recordErrorsToHeatmap(stats.errorKeys);

    setScoreModalData({
      stats,
      mode: 'test',
    });
  };

  // Race completed
  const handleRaceComplete = (stats: TypingStats) => {
    const result: TestResult = {
      id: `race-${Date.now()}`,
      date: new Date().toISOString(),
      mode: 'race',
      title: 'مسابقه اتومبیل‌رانی تایپ سریع',
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      durationSeconds: stats.elapsedSeconds,
      errorRate: 100 - stats.accuracy,
      weakestKeys: Object.keys(stats.errorKeys).slice(0, 5),
    };
    saveTestResult(result);
    recordErrorsToHeatmap(stats.errorKeys);

    setScoreModalData({
      stats,
      mode: 'race',
    });
  };

  // Start custom practice text
  const handleStartCustomPractice = (text: string, title: string, category: string) => {
    setActiveCustomPractice({ text, title, category });
    setActiveLesson(null);
  };

  const handleCustomPracticeComplete = (stats: TypingStats) => {
    if (!activeCustomPractice) return;

    const result: TestResult = {
      id: `custom-${Date.now()}`,
      date: new Date().toISOString(),
      mode: 'custom',
      title: activeCustomPractice.title,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      durationSeconds: stats.elapsedSeconds,
      errorRate: 100 - stats.accuracy,
      weakestKeys: Object.keys(stats.errorKeys).slice(0, 5),
    };
    saveTestResult(result);
    recordErrorsToHeatmap(stats.errorKeys);

    setScoreModalData({
      stats,
      mode: 'custom',
    });
  };

  // Launch smart remedial drill
  const handleStartRemedialDrill = (weakKeys: string[]) => {
    const drillText = generateSmartRemedialDrill(weakKeys);
    setActiveCustomPractice({
      text: drillText,
      title: `تمرین تقویتی حروف: ${weakKeys.join('، ')}`,
      category: 'هوشمند تشخیصی',
    });
    setActiveLesson(null);
    setCurrentMode('custom');
    setScoreModalData(null);
  };

  // Next lesson trigger
  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex >= 0 && currentIndex < LESSONS.length - 1) {
      setActiveLesson(LESSONS[currentIndex + 1]);
      setScoreModalData(null);
    } else {
      setActiveLesson(null);
      setScoreModalData(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      
      {/* Top Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          setActiveLesson(null);
          setActiveCustomPractice(null);
        }}
        isMuted={settings.isMuted}
        onToggleMute={handleToggleMute}
        soundTheme={settings.soundTheme}
        onChangeSoundTheme={handleChangeSoundTheme}
        showHandsGuide={settings.showHandsGuide}
        onToggleHandsGuide={handleToggleHandsGuide}
        showKeyboard={settings.showKeyboard}
        onToggleKeyboard={handleToggleKeyboard}
        completedLessonsCount={completedLessonsCount}
        bestWpm={bestWpm}
        keyboardLayout={settings.keyboardLayout}
        onOpenKeyboardSetup={() => setIsKeyboardSetupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col gap-6">
        
        {/* Mode 1: Lessons Mode */}
        {currentMode === 'lessons' && (
          <>
            {activeLesson ? (
              <div className="flex flex-col gap-6">
                {/* Back to curriculum breadcrumb */}
                <div className="flex items-center justify-between">
                  <button
                    id="btn-back-curriculum"
                    onClick={() => setActiveLesson(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-300 transition-colors bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>بازگشت به فهرست مراحل</span>
                  </button>

                  <div className="text-xs text-slate-400">
                    مرحله: <span className="text-teal-300 font-bold">{activeLesson.categoryFa}</span>
                  </div>
                </div>

                {/* Interactive Typing Canvas */}
                <TypingArea
                  key={activeLesson.id}
                  targetText={activeLesson.practiceText}
                  title={activeLesson.title}
                  categoryLabel={activeLesson.categoryFa}
                  keyboardLayout={settings.keyboardLayout}
                  onComplete={handleLessonComplete}
                  onTargetKeyChange={handleTargetKeyChange}
                  onPhysicalKeyPress={handlePhysicalKeyPress}
                />
              </div>
            ) : (
              <LessonsView
                progressMap={progressMap}
                onSelectLesson={handleSelectLesson}
              />
            )}
          </>
        )}

        {/* Mode 2: Speed Test Mode */}
        {currentMode === 'speedtest' && (
          <SpeedTestView
            keyboardLayout={settings.keyboardLayout}
            onTestComplete={handleSpeedTestComplete}
            onTargetKeyChange={handleTargetKeyChange}
            onPhysicalKeyPress={handlePhysicalKeyPress}
          />
        )}

        {/* Mode 3: Race Mode */}
        {currentMode === 'race' && (
          <RaceView
            keyboardLayout={settings.keyboardLayout}
            onRaceComplete={handleRaceComplete}
            onTargetKeyChange={handleTargetKeyChange}
            onPhysicalKeyPress={handlePhysicalKeyPress}
          />
        )}

        {/* Mode 4: Custom Text Mode */}
        {currentMode === 'custom' && (
          <>
            {activeCustomPractice ? (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveCustomPractice(null)}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-purple-300 transition-colors bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>بازگشت به انتخاب متن</span>
                  </button>

                  <div className="text-xs text-slate-400">
                    نوع متن: <span className="text-purple-300 font-bold">{activeCustomPractice.category}</span>
                  </div>
                </div>

                <TypingArea
                  key={activeCustomPractice.title}
                  targetText={activeCustomPractice.text}
                  title={activeCustomPractice.title}
                  categoryLabel={activeCustomPractice.category}
                  keyboardLayout={settings.keyboardLayout}
                  onComplete={handleCustomPracticeComplete}
                  onTargetKeyChange={handleTargetKeyChange}
                  onPhysicalKeyPress={handlePhysicalKeyPress}
                />
              </div>
            ) : (
              <CustomTextView
                onStartCustomPractice={handleStartCustomPractice}
                onLaunchRemedial={handleStartRemedialDrill}
              />
            )}
          </>
        )}

        {/* Mode 5: Analytics Mode */}
        {currentMode === 'analytics' && (
          <AnalyticsView
            onStartRemedialDrill={handleStartRemedialDrill}
          />
        )}

        {/* Hands Guide Overlay (when typing session or toggled on) */}
        {settings.showHandsGuide && currentMode !== 'analytics' && (
          <HandsGuide
            activeFinger={targetKeyDef?.finger}
            nextChar={nextChar}
          />
        )}

        {/* Virtual Keyboard (when typing session or toggled on) */}
        {settings.showKeyboard && currentMode !== 'analytics' && (
          <VirtualKeyboard
            layout={settings.keyboardLayout}
            targetKeyDef={targetKeyDef}
            activePhysicalKey={activePhysicalKey}
            isErrorState={isPhysicalKeyError}
            highlightFingers={settings.highlightFingers}
          />
        )}

      </main>

      {/* Keyboard Setup & Detection Modal */}
      {isKeyboardSetupOpen && (
        <KeyboardSetupModal
          currentLayout={settings.keyboardLayout}
          onSaveLayout={handleSaveKeyboardLayout}
          onClose={() => setIsKeyboardSetupOpen(false)}
        />
      )}

      {/* Score Modal Popup */}
      {scoreModalData && (
        <ScoreModal
          stats={scoreModalData.stats}
          lesson={scoreModalData.lesson}
          mode={scoreModalData.mode}
          onRetry={() => setScoreModalData(null)}
          onNextLesson={handleNextLesson}
          onStartRemedialDrill={handleStartRemedialDrill}
          onClose={() => setScoreModalData(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            تایپیست — سامانه جامع آموزش و ارتقای سرعت تایپ ده انگشتی با کیبورد استاندارد فارسی
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>استاندارد ملی ISIRI 9147</span>
            <span>•</span>
            <span>نیم‌فاصله استاندارد</span>
            <span>•</span>
            <span>الگوریتم تشخیصی خطاها</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
