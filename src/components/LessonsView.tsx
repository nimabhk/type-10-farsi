import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Award, 
  Compass, 
  Layers, 
  Sparkles, 
  Filter 
} from 'lucide-react';
import { Lesson, UserLessonProgress } from '../types';
import { LESSONS } from '../data/lessons';
import { toPersianDigits } from '../utils/persianUtils';

interface LessonsViewProps {
  progressMap: Record<string, UserLessonProgress>;
  onSelectLesson: (lesson: Lesson) => void;
  activeLessonId?: string;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  progressMap,
  onSelectLesson,
  activeLessonId,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'همه مراحل' },
    { id: 'home-row', label: 'ردیف خانه' },
    { id: 'top-row', label: 'ردیف بالا' },
    { id: 'bottom-row', label: 'ردیف پایین' },
    { id: 'special-keys', label: 'نیم‌فاصله و علائم' },
    { id: 'fluency', label: 'تسلط و واژگان' },
    { id: 'literature', label: 'ادبیات کهن' },
  ];

  const filteredLessons = selectedCategory === 'all'
    ? LESSONS
    : LESSONS.filter((l) => l.category === selectedCategory);

  // Overall statistics
  const totalLessons = LESSONS.length;
  const progressList = Object.values(progressMap) as UserLessonProgress[];
  const completedCount = progressList.filter((p) => p.completed).length;
  const totalStars = progressList.reduce((acc, p) => acc + (p.stars || 0), 0);
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Banner & Curriculum Stats */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>مسیر یادگیری گام‌به‌گام ده انگشتی</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
              تمرین‌های مرحله‌بندی شده کیبورد فارسی
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              از پایه‌ای‌ترین ردیف (ت، ب، ن، م) تا تسلط کامل بر نیم‌فاصله، نشانه‌ها و شاهکارهای ادبیات پارسی، گام‌به‌گام سرعت تایپ خود را افزایش دهید.
            </p>
          </div>

          {/* Quick Curriculum Progress Card */}
          <div className="w-full md:w-auto flex items-center gap-4 bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-400">پیشرفت کل دوره:</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-teal-400 font-mono">
                  ٪{toPersianDigits(completionPercentage)}
                </span>
                <span className="text-xs text-slate-400">
                  ({toPersianDigits(completedCount)} از {toPersianDigits(totalLessons)})
                </span>
              </div>
              <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div
                  className="bg-teal-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            <div className="border-r border-slate-800 pr-4 flex flex-col items-center">
              <span className="text-[11px] text-slate-400">ستاره‌های کسب‌شده</span>
              <div className="flex items-center gap-1 mt-1 text-amber-400 font-bold font-mono text-lg">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{toPersianDigits(totalStars)}</span>
                <span className="text-xs text-slate-500 font-normal">/ {toPersianDigits(totalLessons * 3)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border ${
              selectedCategory === cat.id
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Lessons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLessons.map((lesson, index) => {
          const progress = progressMap[lesson.id];
          const isCompleted = progress?.completed;
          const stars = progress?.stars || 0;
          const bestWpm = progress?.bestWpm || 0;
          const isActive = activeLessonId === lesson.id;

          return (
            <div
              key={lesson.id}
              id={`lesson-card-${lesson.id}`}
              onClick={() => onSelectLesson(lesson)}
              className={`relative group bg-slate-900/80 border rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:scale-[1.01] shadow-lg ${
                isActive
                  ? 'border-teal-500 ring-2 ring-teal-500/20 bg-slate-900'
                  : isCompleted
                  ? 'border-teal-900/50 hover:border-teal-600/60'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top: Category & Stars */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                    {lesson.categoryFa}
                  </span>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Lesson Title */}
                <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors mb-1.5 font-['Vazirmatn']">
                  {lesson.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2 font-['Vazirmatn']">
                  {lesson.description}
                </p>

                {/* Practice Text Preview Box */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5 mb-3.5 text-xs text-slate-300 leading-relaxed font-['Vazirmatn']">
                  <span className="text-[10px] text-teal-400 font-semibold block mb-0.5">نمونه متن تمرین:</span>
                  <p className="line-clamp-2 text-slate-300 select-none">
                    {lesson.practiceText}
                  </p>
                </div>

                {/* Target Keys Badges */}
                <div className="flex flex-wrap items-center gap-1 mb-4 font-['Vazirmatn']">
                  <span className="text-[10px] text-slate-400 ml-1">کلیدهای هدف:</span>
                  {lesson.targetKeys.map((key, kIdx) => (
                    <span
                      key={kIdx}
                      className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-teal-300 text-xs font-bold font-['Vazirmatn']"
                    >
                      {key === ' ' ? 'فاصله' : key}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Best WPM & Action */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {isCompleted ? (
                  <div className="flex items-center gap-1.5 text-xs text-teal-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>بهترین رکورد: <strong className="font-mono font-bold text-white">{toPersianDigits(bestWpm)}</strong> WPM</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">
                    شرط قبولی: حداقل {toPersianDigits(lesson.minWpm)} WPM
                  </span>
                )}

                <button
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    isCompleted
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                  }`}
                >
                  <span>{isCompleted ? 'تکرار' : 'شروع درس'}</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
