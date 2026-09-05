import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Zap, 
  Award, 
  Brain, 
  Flame, 
  RotateCcw, 
  History, 
  Calendar, 
  Activity, 
  Sparkles 
} from 'lucide-react';
import { TestResult } from '../types';
import { VirtualKeyboard } from './VirtualKeyboard';
import { toPersianDigits, formatTimeFa } from '../utils/persianUtils';
import { getGlobalErrorHeatmap, getTestHistory } from '../utils/storage';

interface AnalyticsViewProps {
  onStartRemedialDrill: (weakKeys: string[]) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  onStartRemedialDrill,
}) => {
  const history: TestResult[] = getTestHistory();
  const errorHeatmap: Record<string, number> = getGlobalErrorHeatmap();

  // Compute summary stats
  const totalTests = history.length;
  const bestWpm = history.reduce((max, t) => Math.max(max, t.wpm), 0);
  const avgWpm = totalTests > 0
    ? Math.round(history.reduce((sum, t) => sum + t.wpm, 0) / totalTests)
    : 0;
  const avgAccuracy = totalTests > 0
    ? Math.round(history.reduce((sum, t) => sum + t.accuracy, 0) / totalTests)
    : 0;
  const totalPracticeSeconds = history.reduce((sum, t) => sum + (t.durationSeconds || 0), 0);

  // Extract top weakest keys
  const topWeakKeys = Object.entries(errorHeatmap)
    .filter(([char]) => char.trim().length > 0 || char === '‌')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // SVG Chart rendering helpers
  const chartData = [...history].reverse().slice(-15); // Last 15 sessions
  const maxChartWpm = Math.max(70, ...chartData.map((d) => d.wpm));

  const chartWidth = 600;
  const chartHeight = 160;
  const padding = 30;

  const getX = (index: number) => {
    if (chartData.length <= 1) return chartWidth / 2;
    return padding + (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
  };

  const getY = (val: number, maxVal: number) => {
    return chartHeight - padding - (val / (maxVal || 1)) * (chartHeight - 2 * padding);
  };

  const wpmPoints = chartData.map((d, i) => `${getX(i)},${getY(d.wpm, maxChartWpm)}`).join(' ');

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-teal-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>مرکز هوش مصنوعی و آمار تحلیلی</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            تحلیل هوشمند پیشرفت و خطاهای تایپی
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            روند رشد سرعت WPM، نمودار دقت، نقشه حرارتی خطاهای کیبورد فارسی و کلیدهای چالش‌برانگیز خود را در این بخش بررسی کنید.
          </p>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">بهترین رکورد ثبت شده</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {toPersianDigits(bestWpm)}
            </span>
            <span className="text-xs text-slate-400">WPM</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">بالاترین سرعت خالص</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">میانگین سرعت</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-teal-400 font-mono">
              {toPersianDigits(avgWpm)}
            </span>
            <span className="text-xs text-slate-400">WPM</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">در کل جلسات</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">میانگین دقت کلی</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
              ٪{toPersianDigits(avgAccuracy)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">صحت تایپ کاراکترها</span>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">کل زمان تمرین</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
              {formatTimeFa(totalPracticeSeconds)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1">
            {toPersianDigits(totalTests)} جلسه تکمیل شده
          </span>
        </div>

      </div>

      {/* Progress Line Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              نمودار روند سرعت تایپ (WPM) در جلسات اخیر
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {toPersianDigits(chartData.length)} جلسه اخیر
          </span>
        </div>

        {chartData.length > 1 ? (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[500px]">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44">
                {/* Horizontal grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                  const y = padding + ratio * (chartHeight - 2 * padding);
                  const val = Math.round(maxChartWpm * (1 - ratio));
                  return (
                    <g key={ratio}>
                      <line
                        x1={padding}
                        y1={y}
                        x2={chartWidth - padding}
                        y2={y}
                        stroke="#1e293b"
                        strokeDasharray="4 4"
                      />
                      <text
                        x={padding - 8}
                        y={y + 4}
                        fill="#64748b"
                        fontSize="10"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {toPersianDigits(val)}
                      </text>
                    </g>
                  );
                })}

                {/* Line path */}
                <polyline
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={wpmPoints}
                />

                {/* Data point circles */}
                {chartData.map((d, i) => {
                  const cx = getX(i);
                  const cy = getY(d.wpm, maxChartWpm);
                  return (
                    <g key={i} className="group cursor-pointer">
                      <circle
                        cx={cx}
                        cy={cy}
                        r="5"
                        fill="#0f172a"
                        stroke="#14b8a6"
                        strokeWidth="2.5"
                      />
                      <text
                        x={cx}
                        y={cy - 10}
                        fill="#e2e8f0"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        fontFamily="monospace"
                      >
                        {toPersianDigits(d.wpm)} WPM
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-slate-500">
            برای رسم نمودار پیشرفت، حداقل ۲ تمرین یا آزمون سرعت ثبت کنید.
          </div>
        )}
      </div>

      {/* Weak Keys & Smart Remedial Generator Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <div>
              <h3 className="text-sm font-bold text-white">کلیدهای پرخطا و نقاط ضعف شناسایی شده</h3>
              <p className="text-xs text-slate-400">تحلیل الگوریتمی حروف با بیشترین میزان خطا در طول زمان</p>
            </div>
          </div>

          {topWeakKeys.length > 0 && (
            <button
              onClick={() => onStartRemedialDrill(topWeakKeys.map(([k]) => k))}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-900/30"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>اجرای تمرین اختصاصی برای این حروف</span>
            </button>
          )}
        </div>

        {topWeakKeys.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {topWeakKeys.map(([char, count], idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl flex flex-col items-center justify-center gap-1"
              >
                <span className="text-2xl font-black text-rose-400 font-sans">
                  «{char === '‌' ? 'نیم‌فاصله' : char}»
                </span>
                <span className="text-xs text-slate-400">
                  {toPersianDigits(count)} خطا
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-400">
            هنوز خطای محسوسی ثبت نشده است! دقت شما تاکنون مثال‌زدنی بوده است.
          </div>
        )}

        {/* Heatmap keyboard view */}
        <div className="mt-2 pt-4 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
            <span>نقشه حرارتی کیبورد فارسی (Heatmap بر اساس تکرار خطا)</span>
            <span className="text-[11px] text-slate-400">کلیدهای قرمز نشان‌دهنده فراوانی خطاست</span>
          </div>
          <VirtualKeyboard
            heatmapData={errorHeatmap}
            highlightFingers={true}
          />
        </div>
      </div>

      {/* Test History Log Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-teal-400" />
          <h3 className="text-sm font-bold text-white">تاریخچه آخرین جلسات تمرین و آزمون</h3>
        </div>

        {history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 pb-2">
                  <th className="py-2.5 px-3 font-semibold">عنوان تمرین</th>
                  <th className="py-2.5 px-3 font-semibold">حالت</th>
                  <th className="py-2.5 px-3 font-semibold">سرعت (WPM)</th>
                  <th className="py-2.5 px-3 font-semibold">دقت</th>
                  <th className="py-2.5 px-3 font-semibold">زمان</th>
                  <th className="py-2.5 px-3 font-semibold">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {history.slice(0, 10).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-medium text-white">{row.title}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-slate-400 border border-slate-800">
                        {row.mode === 'lesson'
                          ? 'درس مرحله‌ای'
                          : row.mode === 'test'
                          ? 'آزمون سرعت'
                          : row.mode === 'race'
                          ? 'مسابقه'
                          : 'متن سفارشی'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-teal-400">
                      {toPersianDigits(row.wpm)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-cyan-300">
                      ٪{toPersianDigits(row.accuracy)}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-amber-300">
                      {formatTimeFa(row.durationSeconds)}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {new Date(row.date).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            هنوز سابقه‌ای ثبت نشده است.
          </div>
        )}
      </div>

    </div>
  );
};
