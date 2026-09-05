import React, { useEffect } from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowLeft, 
  Sparkles, 
  Share2, 
  Brain, 
  Star, 
  Zap, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TypingStats, Lesson } from '../types';
import { toPersianDigits, formatTimeFa, analyzeTypingErrors } from '../utils/persianUtils';
import { soundManager } from '../utils/audio';

interface ScoreModalProps {
  stats: TypingStats;
  lesson?: Lesson | null;
  onRetry: () => void;
  onNextLesson?: () => void;
  onStartRemedialDrill?: (weakKeys: string[]) => void;
  onClose: () => void;
  mode: 'lesson' | 'test' | 'race' | 'custom';
}

export const ScoreModal: React.FC<ScoreModalProps> = ({
  stats,
  lesson,
  onRetry,
  onNextLesson,
  onStartRemedialDrill,
  onClose,
  mode,
}) => {
  // Check if passed criteria if in lesson mode
  const isLessonPassed = lesson
    ? stats.wpm >= lesson.minWpm && stats.accuracy >= lesson.minAccuracy
    : true;

  // Calculate stars (0-3)
  let stars = 0;
  if (lesson) {
    if (isLessonPassed) {
      stars = 1;
      if (stats.wpm >= lesson.minWpm + 10 && stats.accuracy >= 94) stars = 2;
      if (stats.wpm >= lesson.minWpm + 20 && stats.accuracy >= 97) stars = 3;
    }
  } else {
    if (stats.accuracy >= 90) stars = 1;
    if (stats.wpm >= 40 && stats.accuracy >= 94) stars = 2;
    if (stats.wpm >= 65 && stats.accuracy >= 97) stars = 3;
  }

  // Run error analysis algorithm
  const analysis = analyzeTypingErrors(stats.errorKeys, stats.totalChars);

  useEffect(() => {
    if (isLessonPassed) {
      soundManager.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#14b8a6', '#06b6d4', '#f59e0b', '#ec4899'],
        });
      } catch {
        // Safe ignore
      }
    }
  }, [isLessonPassed]);

  const handleCopyResult = () => {
    const text = `🏆 کارنامه تایپیست من:\nسرعت: ${stats.wpm} WPM (کلمه بر دقیقه)\nدقت: ${stats.accuracy}%\nزمان: ${stats.elapsedSeconds} ثانیه\nسامانه آموزش تایپ ده انگشتی فارسی تایپیست`;
    navigator.clipboard.writeText(text);
    alert('کارنامه با موفقیت در کلیپ‌بورد کپی شد!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 text-right">
        
        {/* Header Ribbon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-xl shadow-teal-500/30 flex items-center justify-center mb-3">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              {isLessonPassed ? (
                <Trophy className="w-8 h-8 text-teal-400 animate-bounce" />
              ) : (
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-1">
            {isLessonPassed ? 'آفرین! تمرین با موفقیت انجام شد' : 'تلاش خوبی بود! نیاز به تکرار مجدد'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lesson ? lesson.title : 'نتیجه آزمون سرعت و عملکرد شما'}
          </p>

          {/* Stars display */}
          <div className="flex items-center gap-1 mt-2">
            {[1, 2, 3].map((starIdx) => (
              <Star
                key={starIdx}
                className={`w-6 h-6 transition-all ${
                  starIdx <= stars
                    ? 'fill-amber-400 text-amber-400 scale-110'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 mb-1">سرعت نهایی</span>
            <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
              {toPersianDigits(stats.wpm)}
            </span>
            <span className="text-[10px] text-slate-500">کلمه بر دقیقه</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 mb-1">دقت تایپ</span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              ٪{toPersianDigits(stats.accuracy)}
            </span>
            <span className="text-[10px] text-slate-500">صحت کاراکترها</span>
          </div>

          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/50">
            <span className="text-[11px] text-slate-400 mb-1">مدت زمان</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatTimeFa(stats.elapsedSeconds)}
            </span>
            <span className="text-[10px] text-slate-500">دقیقه:ثانیه</span>
          </div>
        </div>

        {/* Detailed Stats Row */}
        <div className="flex items-center justify-around text-xs text-slate-400 border-y border-slate-800 py-2.5 px-2">
          <div>
            کاراکتر در دقیقه (CPM): <strong className="text-slate-200 font-mono">{toPersianDigits(stats.cpm)}</strong>
          </div>
          <div>
            صحیح: <strong className="text-teal-400 font-mono">{toPersianDigits(stats.correctChars)}</strong>
          </div>
          <div>
            خطا: <strong className="text-rose-400 font-mono">{toPersianDigits(stats.incorrectChars)}</strong>
          </div>
        </div>

        {/* Smart Error Diagnostic Box */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-slate-200">
                تحلیل هوشمند خطاها و پیشنهادات
              </span>
            </div>
            <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              الگوریتم تشخیصی
            </span>
          </div>

          {analysis.weakestKeys.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                <span className="text-slate-400">بیشترین خطا روی کلیدهای:</span>
                {analysis.weakestKeys.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md font-bold text-xs"
                  >
                    «{item.char}» ({toPersianDigits(item.errorCount)} بار)
                  </span>
                ))}
              </div>

              {analysis.diagnosisPoints.map((pt, i) => (
                <p key={i} className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  💡 {pt}
                </p>
              ))}

              {onStartRemedialDrill && (
                <button
                  id="btn-remedial-drill"
                  onClick={() => onStartRemedialDrill(analysis.weakestKeys.map(k => k.char))}
                  className="mt-1 w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>تولید خودکار تمرین تقویتی برای رفع این خطاهای رایج</span>
                </button>
              )}
            </>
          ) : (
            <p className="text-xs text-teal-300 leading-relaxed">
              🎉 شگفت‌انگیز است! دقت ۱۰۰ درصدی داشتید و هیچ کلید پرخطایی شناسایی نشد.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            id="btn-score-retry"
            onClick={onRetry}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>تکرار مجدد تمرین</span>
          </button>

          {lesson && onNextLesson && isLessonPassed && (
            <button
              id="btn-score-next-lesson"
              onClick={onNextLesson}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-teal-500/20"
            >
              <span>درس بعدی</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            id="btn-score-share"
            onClick={handleCopyResult}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="کپی کردن کارنامه"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            id="btn-score-close"
            onClick={onClose}
            className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="بستن"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
