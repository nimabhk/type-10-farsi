import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { RefreshCw, Play, Award, CheckCircle2, AlertCircle, Volume2, FastForward } from 'lucide-react';
import { KeyDefinition, TypingStats, KeyboardLayoutType } from '../types';
import { getCharToKeyMap } from '../data/persianKeyboard';
import { normalizePersianChar, calculateTypingMetrics, toPersianDigits, formatTimeFa } from '../utils/persianUtils';
import { soundManager } from '../utils/audio';

interface TypingAreaProps {
  targetText: string;
  title?: string;
  categoryLabel?: string;
  timeLimitSeconds?: number; // if speed test mode
  keyboardLayout?: KeyboardLayoutType;
  onComplete: (stats: TypingStats) => void;
  onTargetKeyChange?: (keyDef: KeyDefinition | null, nextChar: string) => void;
  onPhysicalKeyPress?: (code: string | null, isError: boolean) => void;
  autoFocus?: boolean;
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetText,
  title,
  categoryLabel,
  timeLimitSeconds,
  keyboardLayout = 'universal',
  onComplete,
  onTargetKeyChange,
  onPhysicalKeyPress,
  autoFocus = true,
}) => {
  const [typedChars, setTypedChars] = useState<string[]>([]);
  const [charStatus, setCharStatus] = useState<('correct' | 'incorrect')[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [errorKeysMap, setErrorKeysMap] = useState<Record<string, number>>({});
  const [keyTimesMap, setKeyTimesMap] = useState<Record<string, number[]>>({});
  const [lastKeystrokeTime, setLastKeystrokeTime] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentIndex = typedChars.length;
  const currentChar = targetText[currentIndex] || '';

  const charMap = useMemo(() => getCharToKeyMap(keyboardLayout), [keyboardLayout]);

  // Notify parent of active key definition
  useEffect(() => {
    if (onTargetKeyChange) {
      if (currentIndex < targetText.length) {
        const nextChar = targetText[currentIndex];
        const keyDef = charMap[nextChar] || null;
        onTargetKeyChange(keyDef, nextChar);
      } else {
        onTargetKeyChange(null, '');
      }
    }
  }, [currentIndex, targetText, onTargetKeyChange, charMap]);

  // Reset state on targetText change
  const handleReset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedChars([]);
    setCharStatus([]);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
    setErrorKeysMap({});
    setKeyTimesMap({});
    setLastKeystrokeTime(0);
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    handleReset();
  }, [targetText, handleReset]);

  // Timer runner
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.max(1, Math.floor((now - startTime) / 1000));
        setElapsedSeconds(elapsed);

        // Check if timed test limit reached
        if (timeLimitSeconds && elapsed >= timeLimitSeconds) {
          clearInterval(timerRef.current!);
          setIsFinished(true);
        }
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished, timeLimitSeconds]);

  // Auto scroll text container so the active character is always comfortably visible
  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const charEl = activeCharRef.current;
      const boxEl = containerRef.current;
      const charTop = charEl.offsetTop;
      const boxScrollTop = boxEl.scrollTop;
      const boxHeight = boxEl.clientHeight;

      if (charTop < boxScrollTop + 40 || charTop > boxScrollTop + boxHeight - 70) {
        boxEl.scrollTo({
          top: Math.max(0, charTop - 60),
          behavior: 'smooth',
        });
      }
    }
  }, [currentIndex]);

  // Complete session trigger
  useEffect(() => {
    if (isFinished) {
      const correctCount = charStatus.filter((s) => s === 'correct').length;
      const incorrectCount = charStatus.filter((s) => s === 'incorrect').length;
      const finalMetrics = calculateTypingMetrics(correctCount, incorrectCount, elapsedSeconds || 1);

      onComplete({
        ...finalMetrics,
        correctChars: correctCount,
        incorrectChars: incorrectCount,
        elapsedSeconds: elapsedSeconds || 1,
        errorKeys: errorKeysMap,
        keyTimes: keyTimesMap,
      });
    }
  }, [isFinished, charStatus, elapsedSeconds, errorKeysMap, keyTimesMap, onComplete]);

  // Keystroke handler
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isFinished) return;

    // Handle restart shortcut: Escape or Ctrl+R
    if (e.key === 'Escape') {
      e.preventDefault();
      handleReset();
      return;
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedChars.length > 0) {
        setTypedChars((prev) => prev.slice(0, -1));
        setCharStatus((prev) => prev.slice(0, -1));
        soundManager.playKeyClick();
      }
      return;
    }

    // Ignore system / modifier keys alone
    if (
      e.key === 'Shift' ||
      e.key === 'Control' ||
      e.key === 'Alt' ||
      e.key === 'Meta' ||
      e.key === 'CapsLock' ||
      e.key === 'Tab'
    ) {
      return;
    }

    // Process typed key
    let keyInput = e.key;
    const expectedChar = targetText[currentIndex];

    // Adaptive recognition for Persian ZWNJ (Shift + Space or Ctrl+Shift+2 or zero width non-joiner or backquote)
    if (
      (e.code === 'Space' && e.shiftKey) ||
      (e.ctrlKey && e.shiftKey && e.code === 'Digit2') ||
      e.key === '\u200C' ||
      e.code === 'Backquote'
    ) {
      keyInput = '‌'; // Persian zero-width non-joiner
      e.preventDefault();
    } else if (e.key === ' ') {
      keyInput = ' ';
      e.preventDefault();
    } else if (expectedChar === 'پ') {
      // Support 'پ' across all physical key variations (M on Windows, \ or ] on ISIRI/Mac)
      if (
        e.key === 'پ' || 
        e.code === 'KeyM' || 
        e.code === 'Backslash' || 
        e.code === 'BracketRight' || 
        e.code === 'BracketLeft'
      ) {
        keyInput = 'پ';
      }
    } else if (expectedChar === 'ژ') {
      // Support 'ژ' across all physical key variations (Shift+C, Backslash, Shift+Z)
      if (
        e.key === 'ژ' || 
        e.code === 'Backslash' || 
        (e.code === 'KeyC' && e.shiftKey) || 
        (e.code === 'KeyZ' && e.shiftKey)
      ) {
        keyInput = 'ژ';
      }
    }

    // Normalize
    const normalizedInput = normalizePersianChar(keyInput);
    if (!normalizedInput || normalizedInput.length > 1) {
      // Functional non-char key
      return;
    }

    e.preventDefault();

    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
      setLastKeystrokeTime(now);
    } else {
      const delta = now - lastKeystrokeTime;
      setLastKeystrokeTime(now);
      if (delta < 5000 && currentChar) {
        setKeyTimesMap((prev) => ({
          ...prev,
          [currentChar]: [...(prev[currentChar] || []), delta],
        }));
      }
    }

    const normalizedExpected = normalizePersianChar(expectedChar);
    const isCorrect = normalizedInput === normalizedExpected;

    if (isCorrect) {
      soundManager.playKeyClick();
      if (onPhysicalKeyPress) onPhysicalKeyPress(e.code, false);
    } else {
      soundManager.playError();
      if (onPhysicalKeyPress) onPhysicalKeyPress(e.code, true);

      // Record error for weak key diagnosis
      setErrorKeysMap((prev) => ({
        ...prev,
        [expectedChar]: (prev[expectedChar] || 0) + 1,
      }));
    }

    const newTypedChars = [...typedChars, normalizedInput];
    const newCharStatus = [...charStatus, isCorrect ? 'correct' : 'incorrect'];

    setTypedChars(newTypedChars);
    setCharStatus(newCharStatus);

    // Check completion
    if (newTypedChars.length >= targetText.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsFinished(true);
    }
  };

  // Live Metrics Calculation
  const correctCount = charStatus.filter((s) => s === 'correct').length;
  const incorrectCount = charStatus.filter((s) => s === 'incorrect').length;
  const currentMetrics = calculateTypingMetrics(correctCount, incorrectCount, elapsedSeconds);
  const progressPercent = Math.min(100, Math.round((currentIndex / (targetText.length || 1)) * 100));

  const displayTime = timeLimitSeconds
    ? Math.max(0, timeLimitSeconds - elapsedSeconds)
    : elapsedSeconds;

  return (
    <div className="w-full flex flex-col gap-4">
      {/* HUD Header with real-time stats */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Title / Category */}
        <div className="flex items-center gap-2">
          {categoryLabel && (
            <span className="text-xs px-2.5 py-1 bg-teal-500/15 text-teal-300 font-semibold rounded-lg border border-teal-500/30">
              {categoryLabel}
            </span>
          )}
          {title && <h3 className="text-sm sm:text-base font-bold text-slate-100">{title}</h3>}
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          {/* WPM */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">سرعت (WPM)</span>
            <span className="text-lg sm:text-2xl font-black text-teal-400 font-mono">
              {toPersianDigits(currentMetrics.wpm)}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">دقت</span>
            <span className="text-lg sm:text-2xl font-black text-cyan-300 font-mono">
              ٪{toPersianDigits(currentMetrics.accuracy)}
            </span>
          </div>

          {/* Timer */}
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">
              {timeLimitSeconds ? 'زمان باقیمانده' : 'زمان سپری‌شده'}
            </span>
            <span className="text-lg sm:text-2xl font-black text-amber-400 font-mono">
              {formatTimeFa(displayTime)}
            </span>
          </div>

          {/* Progress bar pill */}
          <div className="hidden sm:flex flex-col items-center min-w-[80px]">
            <span className="text-[11px] text-slate-400">پیشرفت</span>
            <span className="text-sm font-bold text-slate-200 font-mono">
              ٪{toPersianDigits(progressPercent)}
            </span>
          </div>

          {/* Reset button */}
          <button
            id="btn-restart-typing"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all flex items-center gap-1 text-xs"
            title="شروع مجدد (Esc)"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden md:inline">شروع مجدد</span>
          </button>
        </div>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 to-cyan-400 h-full transition-all duration-200 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Interactive Text Display & Input Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative min-h-[140px] max-h-[220px] overflow-y-auto bg-slate-900/90 border-2 border-slate-800 focus:border-teal-500/70 rounded-2xl p-5 sm:p-6 outline-none transition-all cursor-text shadow-inner"
        autoFocus={autoFocus}
      >
        {!startTime && (
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none z-10">
            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700 px-4 py-2 rounded-xl shadow-lg">
              <Play className="w-4 h-4 text-teal-400 animate-pulse" />
              <span className="text-xs sm:text-sm text-slate-300 font-medium">
                برای شروع تایپ، کلیک کنید یا هر کلیدی را فشار دهید
              </span>
            </div>
          </div>
        )}

        {/* Text stream */}
        <div 
          className="text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed tracking-wide text-slate-300 text-right select-none break-words"
          style={{ fontFamily: 'Vazirmatn, sans-serif' }}
        >
          {targetText.split('').map((char, index) => {
            const isCurrent = index === currentIndex;
            const status = charStatus[index];

            let charClass = 'text-slate-500';

            if (status === 'correct') {
              charClass = 'text-teal-400 font-semibold';
            } else if (status === 'incorrect') {
              charClass = 'text-rose-400 bg-rose-950/60 rounded px-0.5 underline decoration-rose-500 decoration-2 font-bold';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative inline-block transition-colors duration-100 ${charClass} ${
                  isCurrent ? 'bg-teal-500/20 text-white rounded px-0.5 ring-1 ring-teal-400' : ''
                }`}
              >
                {/* Active blinking cursor */}
                {isCurrent && (
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-teal-400 rounded-full animate-cursor" />
                )}
                {/* Render visible representation for space or ZWNJ */}
                {char === ' ' ? ' ' : char === '‌' ? '‌' : char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Helpful shortcut legend */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <div className="flex items-center gap-3">
          <span>
            کلید <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Esc</kbd> : شروع مجدد
          </span>
          <span>
            <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">Shift + Space</kbd> : نیم‌فاصله
          </span>
        </div>
        <div className="text-slate-400">
          کاراکترهای تایپ شده: {toPersianDigits(currentIndex)} از {toPersianDigits(targetText.length)}
        </div>
      </div>
    </div>
  );
};
