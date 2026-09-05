import React, { useState } from 'react';
import { Timer, Zap, Award, Flame, Play, RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { TypingArea } from './TypingArea';
import { TypingStats, KeyDefinition, KeyboardLayoutType } from '../types';
import { SPEED_TEST_SNIPPETS, PRESET_CATEGORIES } from '../data/practiceTexts';
import { toPersianDigits } from '../utils/persianUtils';

interface SpeedTestViewProps {
  keyboardLayout?: KeyboardLayoutType;
  onTestComplete: (stats: TypingStats, durationSeconds: number) => void;
  onTargetKeyChange: (keyDef: KeyDefinition | null, nextChar: string) => void;
  onPhysicalKeyPress: (code: string | null, isError: boolean) => void;
}

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  keyboardLayout = 'universal',
  onTestComplete,
  onTargetKeyChange,
  onPhysicalKeyPress,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedSnippetIndex, setSelectedSnippetIndex] = useState<number>(0);
  const [isTesting, setIsTesting] = useState<boolean>(false);

  const durationOptions = [
    { seconds: 30, label: '۳۰ ثانیه', desc: 'تست سریع و پرشتاب' },
    { seconds: 60, label: '۱ دقیقه', desc: 'آزمون استاندارد سرعت' },
    { seconds: 120, label: '۲ دقیقه', desc: 'سنجش استقامت و تمرکز' },
    { seconds: 180, label: '۳ دقیقه', desc: 'آزمون رسمی و حرفه‌ای' },
  ];

  const currentSnippet = SPEED_TEST_SNIPPETS[selectedSnippetIndex % SPEED_TEST_SNIPPETS.length];

  const handleNextSnippet = () => {
    setSelectedSnippetIndex((prev) => (prev + 1) % SPEED_TEST_SNIPPETS.length);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-cyan-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
            <Timer className="w-3.5 h-3.5" />
            <span>آزمون استاندارد و رتبه‌بندی WPM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            آزمون سرعت تایپ ده انگشتی فارسی
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            سرعت خالص (WPM)، دقت، تعداد کاراکتر در دقیقه (CPM) و درصد خطاهای خود را در شرایط زمانی استاندارد محک بزنید و گواهی رتبه خود را دریافت کنید.
          </p>
        </div>

        {/* Time Selector Pills */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
          {durationOptions.map((opt) => (
            <button
              key={opt.seconds}
              id={`btn-duration-${opt.seconds}`}
              onClick={() => setSelectedDuration(opt.seconds)}
              className={`flex flex-col items-center px-4 py-2 rounded-xl transition-all ${
                selectedDuration === opt.seconds
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold shadow-md shadow-cyan-900/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span className="text-xs">{opt.label}</span>
              <span className="text-[10px] opacity-70 font-normal">{opt.desc.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Test Controls Bar */}
      <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800 px-4 py-3 rounded-2xl text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>متن استاندارد آزمون #{toPersianDigits(selectedSnippetIndex + 1)}</span>
        </div>

        <button
          onClick={handleNextSnippet}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>تغییر متن آزمون</span>
        </button>
      </div>

      {/* Typing interactive canvas */}
      <TypingArea
        key={`${selectedSnippetIndex}-${selectedDuration}`}
        targetText={currentSnippet}
        title={`آزمون سرعت ${toPersianDigits(selectedDuration)} ثانیه‌ای`}
        categoryLabel="آزمون زمان‌دار"
        timeLimitSeconds={selectedDuration}
        keyboardLayout={keyboardLayout}
        onComplete={(stats) => onTestComplete(stats, selectedDuration)}
        onTargetKeyChange={onTargetKeyChange}
        onPhysicalKeyPress={onPhysicalKeyPress}
      />

      {/* Ranking Tier Guide */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" />
          <span>جدول رتبه‌بندی سرعت تایپ ده انگشتی در زبان فارسی</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-slate-400 block mb-1">مبتدی</span>
            <strong className="text-slate-300 font-mono text-sm block">&lt; ۲۵ WPM</strong>
            <span className="text-[10px] text-slate-500">نیاز به تمرین</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-cyan-400 block mb-1">متوسط</span>
            <strong className="text-cyan-300 font-mono text-sm block">۲۵ - ۴۰ WPM</strong>
            <span className="text-[10px] text-slate-500">سطح اداری</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-teal-400 block mb-1">خوب / پیشرفته</span>
            <strong className="text-teal-300 font-mono text-sm block">۴۰ - ۶۰ WPM</strong>
            <span className="text-[10px] text-slate-500">تایپیست ماهر</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl">
            <span className="text-[11px] text-purple-400 block mb-1">حرفه‌ای</span>
            <strong className="text-purple-300 font-mono text-sm block">۶۰ - ۸۰ WPM</strong>
            <span className="text-[10px] text-slate-500">سرعت فوق‌العاده</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-2.5 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[11px] text-amber-400 block mb-1">استاد تایپ</span>
            <strong className="text-amber-300 font-mono text-sm block">&gt; ۸۰ WPM</strong>
            <span className="text-[10px] text-slate-500">رکورددار کشوری</span>
          </div>
        </div>
      </div>

    </div>
  );
};
