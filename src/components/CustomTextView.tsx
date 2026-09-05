import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Sparkles, 
  BookOpen, 
  Cpu, 
  CheckCircle2, 
  ArrowLeft, 
  RotateCcw,
  Sliders,
  Type
} from 'lucide-react';
import { PRESET_CATEGORIES } from '../data/practiceTexts';
import { generateSmartRemedialDrill, toPersianDigits, normalizePersianText } from '../utils/persianUtils';
import { getGlobalErrorHeatmap } from '../utils/storage';

interface CustomTextViewProps {
  onStartCustomPractice: (text: string, title: string, category: string) => void;
  onLaunchRemedial: (weakKeys: string[]) => void;
}

export const CustomTextView: React.FC<CustomTextViewProps> = ({
  onStartCustomPractice,
  onLaunchRemedial,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'smart'>('presets');
  const [customInputText, setCustomInputText] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('متن سفارشی شما');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Read current weak keys for smart tab
  const errorHeatmap = getGlobalErrorHeatmap();
  const topWeakKeys = Object.entries(errorHeatmap)
    .filter(([char]) => char.trim().length > 0 || char === '‌')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([char]) => char);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.txt')) {
      setErrorMsg('لطفاً یک فایل متنی با پسوند .txt انتخاب کنید.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const cleaned = normalizePersianText(content);
        setCustomInputText(cleaned);
        setCustomTitle(file.name.replace('.txt', ''));
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  const handleStartCustom = () => {
    const clean = normalizePersianText(customInputText);
    if (!clean || clean.length < 10) {
      setErrorMsg('طول متن تمرینی باید حداقل شامل ۱۰ کاراکتر باشد.');
      return;
    }
    setErrorMsg(null);
    onStartCustomPractice(clean, customTitle || 'متن دلخواه', 'شخصی‌سازی شده');
  };

  const handleStartSmartDrill = () => {
    const generated = generateSmartRemedialDrill(topWeakKeys);
    onStartCustomPractice(
      generated,
      `تمرین تقویتی حروف: ${topWeakKeys.join('، ')}`,
      'هوشمند تشخیصی'
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Sliders className="w-3.5 h-3.5" />
            <span>شخصی‌سازی نامحدود متون</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            شخصی‌سازی و متون تمرینی دلخواه
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            متن، کتاب یا مقاله مورد علاقه خود را بارگذاری کنید، از بین صدها نمونه ادبی و علمی آماده انتخاب کنید، یا بگذارید الگوریتم هوشمند متنی اختصاصی برای رفع نقاط ضعف شما بسازد.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('presets')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'presets'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            متون آماده
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'custom'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ورود متن دستی / فایل
          </button>

          <button
            onClick={() => setActiveTab('smart')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'smart'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>تمرین هوشمند</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Presets */}
      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col gap-3 shadow-lg"
            >
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">{cat.title}</h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {cat.texts.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onStartCustomPractice(item.text, item.title, cat.title)}
                    className="group bg-slate-950/60 border border-slate-800/80 hover:border-purple-500/50 p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-purple-300 transition-colors">
                        {item.title}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.text}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-purple-400 font-medium">
                      <span>{toPersianDigits(item.text.length)} کاراکتر</span>
                      <span className="flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                        <span>شروع تمرین</span>
                        <ArrowLeft className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Custom Text / File Upload */}
      {activeTab === 'custom' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 w-full">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                عنوان متن تمرینی:
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="مثال: مقاله من، سخنرانی، خلاصه کتاب..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 outline-none focus:border-purple-500"
              />
            </div>

            {/* File upload button */}
            <div className="flex flex-col sm:items-end">
              <label className="text-xs font-bold text-slate-300 block mb-1">
                یا بارگذاری فایل متنی (.txt):
              </label>
              <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center gap-2 transition-all">
                <Upload className="w-3.5 h-3.5 text-purple-400" />
                <span>انتخاب فایل TXT</span>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Text Area */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              متن فارسی دلخواه خود را در کادر زیر جای‌گذاری (Paste) کنید:
            </label>
            <textarea
              rows={7}
              value={customInputText}
              onChange={(e) => {
                setCustomInputText(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="متن فارسی خود را در اینجا بنویسید یا کپی کنید تا بلافاصله به یک تمرین تعاملی با کیبورد هوشمند تبدیل شود..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-100 leading-relaxed outline-none focus:border-purple-500 resize-none font-sans"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/50 p-2.5 rounded-xl">
              ⚠️ {errorMsg}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400">
              تعداد کاراکتر: <strong className="text-slate-200 font-mono">{toPersianDigits(customInputText.length)}</strong> | 
              تعداد کلمات تقریبی: <strong className="text-slate-200 font-mono">{toPersianDigits(customInputText.trim().split(/\s+/).filter(Boolean).length)}</strong>
            </div>

            <button
              onClick={handleStartCustom}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-900/30"
            >
              <span>شروع تمرین با این متن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Smart Diagnostic Generator */}
      {activeTab === 'smart' && (
        <div className="bg-slate-900/80 border border-purple-900/40 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/30">
              <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                تولیدکننده تمرین اختصاصی بر پایه نقاط ضعف شما
              </h3>
              <p className="text-xs text-slate-300">
                الگوریتم هوشمند با بررسی سابقه خطاهای تایپی شما، کلمات هدفمندی را انتخاب و کنار هم می‌چیند تا در کمترین زمان بر کلیدهای پرخطا مسلط شوید.
              </p>
            </div>
          </div>

          {topWeakKeys.length > 0 ? (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
              <div className="text-xs text-slate-300 font-medium">
                حروف شناسایی شده با بیشترین تکرار خطا در جلسات قبلی شما:
              </div>
              <div className="flex flex-wrap gap-2">
                {topWeakKeys.map((key, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-lg font-bold text-sm"
                  >
                    «{key}»
                  </span>
                ))}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                با کلیک بر روی دکمه زیر، یک تمرین هماهنگ با کلمات واقعی زبان فارسی شامل این حروف تولید خواهد شد.
              </p>

              <button
                onClick={handleStartSmartDrill}
                className="mt-2 w-full py-3 px-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-600 hover:opacity-95 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/30"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>ساخت و شروع تمرین تقویتی هوشمند</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400">
              <p className="mb-3 text-slate-300">
                هنوز خطای تکرارشونده‌ای ثبت نشده است! ابتدا چند تمرین یا آزمون سرعت را انجام دهید تا الگوریتم نقاط ضعف شما را تحلیل کند.
              </p>
              <button
                onClick={() => setActiveTab('presets')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl font-medium"
              >
                مشاهده تمرین‌های آماده
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
