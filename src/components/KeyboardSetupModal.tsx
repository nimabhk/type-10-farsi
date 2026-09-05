import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Laptop, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  RefreshCw, 
  X,
  Zap,
  HelpCircle
} from 'lucide-react';
import { KeyboardLayoutType } from '../types';

interface KeyboardSetupModalProps {
  currentLayout: KeyboardLayoutType;
  onSaveLayout: (layout: KeyboardLayoutType) => void;
  onClose: () => void;
}

export const KeyboardSetupModal: React.FC<KeyboardSetupModalProps> = ({
  currentLayout,
  onSaveLayout,
  onClose,
}) => {
  const [selectedLayout, setSelectedLayout] = useState<KeyboardLayoutType>(currentLayout);
  const [activeTab, setActiveTab] = useState<'wizard' | 'manual' | 'test'>('wizard');

  // Wizard state
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [detectedPeKey, setDetectedPeKey] = useState<{ code: string; key: string } | null>(null);
  const [detectedZheKey, setDetectedZheKey] = useState<{ code: string; key: string; shift: boolean } | null>(null);
  const [detectedZwnjKey, setDetectedZwnjKey] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<KeyboardLayoutType | null>(null);

  // Live test input state
  const [testInput, setTestInput] = useState<string>('');
  const [testedKeys, setTestedKeys] = useState<{
    pe: boolean;
    zhe: boolean;
    gaf: boolean;
    che: boolean;
    zwnj: boolean;
  }>({
    pe: false,
    zhe: false,
    gaf: false,
    che: false,
    zwnj: false,
  });

  // Handle Wizard Key Detection
  useEffect(() => {
    if (activeTab !== 'wizard') return;

    const handleWizardKeyDown = (e: KeyboardEvent) => {
      // Ignore system keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'Tab', 'CapsLock'].includes(e.key)) return;

      if (wizardStep === 1) {
        // Step 1: Detect 'پ'
        e.preventDefault();
        setDetectedPeKey({ code: e.code, key: e.key });

        if (e.code === 'KeyM' || e.key === 'm') {
          // Windows Persian has 'پ' on KeyM
          setDetectionResult('windows');
          setSelectedLayout('windows');
        } else if (e.code === 'Backslash' || e.code === 'BracketRight') {
          // ISIRI 9147 standard has 'پ' on Backslash
          setDetectionResult('isiri');
          setSelectedLayout('isiri');
        } else {
          // Universal flexible mode
          setDetectionResult('universal');
          setSelectedLayout('universal');
        }
        setWizardStep(2);
      } else if (wizardStep === 2) {
        // Step 2: Detect 'ژ'
        e.preventDefault();
        setDetectedZheKey({ code: e.code, key: e.key, shift: e.shiftKey });
        setWizardStep(3);
      } else if (wizardStep === 3) {
        // Step 3: Detect ZWNJ (Shift+Space or Ctrl+Shift+2 or backquote)
        if (
          (e.code === 'Space' && e.shiftKey) || 
          (e.shiftKey && e.ctrlKey && e.code === 'Digit2') ||
          e.key === '\u200C' ||
          e.code === 'Backquote'
        ) {
          e.preventDefault();
          setDetectedZwnjKey(true);
        }
      }
    };

    window.addEventListener('keydown', handleWizardKeyDown);
    return () => window.removeEventListener('keydown', handleWizardKeyDown);
  }, [activeTab, wizardStep]);

  // Handle live test input
  const handleTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTestInput(val);
    setTestedKeys({
      pe: val.includes('پ'),
      zhe: val.includes('ژ'),
      gaf: val.includes('گ'),
      che: val.includes('چ'),
      zwnj: val.includes('‌'),
    });
  };

  const handleApply = () => {
    onSaveLayout(selectedLayout);
    onClose();
  };

  const resetWizard = () => {
    setWizardStep(1);
    setDetectedPeKey(null);
    setDetectedZheKey(null);
    setDetectedZwnjKey(false);
    setDetectionResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-teal-950/40 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-300">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
                پیکربندی و تشخیص پیشرفته کیبورد فارسی
              </h2>
              <p className="text-xs text-slate-400 mt-0.5" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
                تنظیم هوشمند چیدمان کلیدها (ویندوز، استاندارد ملی ISIRI یا حالت انطباق سازگار)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 p-3 sm:px-6 bg-slate-950/60 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('wizard')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'wizard'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تشخیص خودکار و زنده (Wizard)</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'manual'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>انتخاب مستقیم چیدمان</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'test'
                ? 'bg-teal-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>جعبه آزمایش کیبورد</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 flex flex-col gap-5 max-h-[70vh] overflow-y-auto">
          
          {/* TAB 1: Auto Detection Wizard */}
          {activeTab === 'wizard' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                
                {/* Step indicator */}
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-teal-300">مرحله {wizardStep} از ۳</span>
                  <button
                    onClick={resetWizard}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>آغاز مجدد تشخیص</span>
                  </button>
                </div>

                {wizardStep === 1 && (
                  <div className="flex flex-col items-center text-center py-4 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border-2 border-teal-400 flex items-center justify-center text-2xl font-black text-teal-300 animate-pulse font-['Vazirmatn']">
                      پ
                    </div>
                    <h3 className="text-base font-bold text-white font-['Vazirmatn']">
                      لطفاً کلید حرف «پ» را روی کیبورد خود فشار دهید
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      این کار به سیستم کمک می‌کند بفهمد کلید «پ» روی کلید M (ویندوز) قرار دارد یا روی دکمه \ یا ] (استاندارد ملی ISIRI و مک).
                    </p>
                    <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400">
                      منتظر فشردن کلید شما...
                    </div>
                  </div>
                )}

                {wizardStep === 2 && (
                  <div className="flex flex-col items-center text-center py-4 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border-2 border-indigo-400 flex items-center justify-center text-2xl font-black text-indigo-300 animate-pulse font-['Vazirmatn']">
                      ژ
                    </div>
                    <h3 className="text-base font-bold text-white font-['Vazirmatn']">
                      حالا کلید حرف «ژ» را فشار دهید
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      روی کیبورد استاندارد این کلید معمولاً با Shift+C و در کیبورد ویندوز روی دکمه \ یا Shift+C تایپ می‌شود.
                    </p>
                    {detectedPeKey && (
                      <span className="text-xs text-teal-400 bg-teal-950/60 border border-teal-800/40 px-3 py-1 rounded-lg">
                        ✓ کلید قبلی تشخیص داده شد: [{detectedPeKey.code}]
                      </span>
                    )}
                  </div>
                )}

                {wizardStep === 3 && (
                  <div className="flex flex-col items-center text-center py-4 gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border-2 border-purple-400 flex items-center justify-center text-sm font-black text-purple-300 animate-pulse font-['Vazirmatn']">
                      نیم‌فاصله
                    </div>
                    <h3 className="text-base font-bold text-white font-['Vazirmatn']">
                      کلید نیم‌فاصله را فشار دهید
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      ترکیب <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[11px] font-mono">Shift + Space</kbd> یا <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[11px] font-mono">Ctrl + Shift + 2</kbd> یا کلید <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-[11px] font-mono">`</kbd> را بزنید.
                    </p>
                    
                    {detectedZwnjKey ? (
                      <div className="p-3 bg-teal-950/80 border border-teal-700/60 rounded-xl text-teal-300 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-400" />
                        <span>نیم‌فاصله با موفقیت ثبت شد! تشخیص کامل شد.</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDetectedZwnjKey(true)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                        >
                          نیم‌فاصله ندارم / بعداً تنظیم شود
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Wizard Conclusion */}
              {detectionResult && (
                <div className="bg-gradient-to-r from-teal-950/60 to-slate-900 border border-teal-500/30 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-teal-300 font-bold text-sm font-['Vazirmatn']">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                    <span>
                      {detectionResult === 'windows' 
                        ? 'کیبورد شما به عنوان «کیبورد رایج ویندوز فارسی» تشخیص داده شد!'
                        : detectionResult === 'isiri'
                        ? 'کیبورد شما به عنوان «استاندارد ملی ایران (ISIRI 9147)» تشخیص داده شد!'
                        : 'چیدمان کیبورد شما با موفقیت شناسایی شد!'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-['Vazirmatn']">
                    پیشنهاد ما استفاده از <strong>«حالت انطباق سازگار (Universal Mode)»</strong> است تا هم کلیدهای ویندوز و هم استاندارد بدون هیچ خطایی توسط سیستم پذیرفته شوند.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Manual Preset Selection */}
          {activeTab === 'manual' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Option: Universal (Recommended) */}
              <div
                onClick={() => setSelectedLayout('universal')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedLayout === 'universal'
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Vazirmatn']">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span>حالت سازگار هوشمند (پیشنهاد ویژه)</span>
                    </span>
                    {selectedLayout === 'universal' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-['Vazirmatn']">
                    حرف «پ» را هم روی کلید M و هم روی \ می‌پذیرد. حرف «ژ» را هم با Shift+C و هم با \ می‌پذیرد. کاملاً تضمین‌شده برای انواع کیبوردها!
                  </p>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 self-start">
                  بدون خطا در هیچ کیبوردی
                </div>
              </div>

              {/* Option: Windows Persian */}
              <div
                onClick={() => setSelectedLayout('windows')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedLayout === 'windows'
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Vazirmatn']">
                      <Laptop className="w-4 h-4 text-indigo-400" />
                      <span>کیبورد پیش‌فرض ویندوز (Windows)</span>
                    </span>
                    {selectedLayout === 'windows' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-['Vazirmatn']">
                    چیدمان پیش‌فرض ویندوز در ایران؛ حرف «پ» روی کلید M و حرف «ژ» روی \ یا Shift+C.
                  </p>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 self-start">
                  پ روی کلید M
                </div>
              </div>

              {/* Option: ISIRI 9147 Standard */}
              <div
                onClick={() => setSelectedLayout('isiri')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedLayout === 'isiri'
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Vazirmatn']">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>استاندارد ملی ایران (ISIRI 9147)</span>
                    </span>
                    {selectedLayout === 'isiri' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-['Vazirmatn']">
                    چیدمان رسمی استاندارد ملی؛ حرف «پ» روی کلید Backslash (\) و کلید M برای حرف «ء».
                  </p>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 self-start">
                  پ روی کلید Backslash
                </div>
              </div>

              {/* Option: Mac / Linux */}
              <div
                onClick={() => setSelectedLayout('mac')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  selectedLayout === 'mac'
                    ? 'bg-teal-950/50 border-teal-500 ring-2 ring-teal-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 font-['Vazirmatn']">
                      <Keyboard className="w-4 h-4 text-cyan-400" />
                      <span>کیبورد فارسی اپل مک / لینوکس</span>
                    </span>
                    {selectedLayout === 'mac' && <Check className="w-4 h-4 text-teal-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-['Vazirmatn']">
                    سازگار با سیستم‌عامل macOS و لینوکس با نیم‌فاصله روی Shift+Space.
                  </p>
                </div>
                <div className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 self-start">
                  سازگار با مک‌بوک
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: Live Test Sandbox */}
          {activeTab === 'test' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-300 block font-['Vazirmatn']">
                  در کادر زیر حروف حساس فارسی («پ»، «ژ»، «گ»، «چ» و «نیم‌فاصله») را تایپ کنید تا فوراً از هماهنگی کیبورد خود مطمئن شوید:
                </label>

                <input
                  type="text"
                  value={testInput}
                  onChange={handleTestChange}
                  placeholder="اینجا کلیک کنید و حروف پ ژ گ چ را تایپ کنید..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-base text-white outline-none focus:border-teal-500 font-['Vazirmatn'] text-right"
                  autoFocus
                />

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                  <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${testedKeys.pe ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span>حرف «پ»</span>
                    {testedKeys.pe ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <span>-</span>}
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${testedKeys.zhe ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span>حرف «ژ»</span>
                    {testedKeys.zhe ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <span>-</span>}
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${testedKeys.gaf ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span>حرف «گ»</span>
                    {testedKeys.gaf ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <span>-</span>}
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${testedKeys.che ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span>حرف «چ»</span>
                    {testedKeys.che ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <span>-</span>}
                  </div>

                  <div className={`p-2 rounded-xl border flex items-center justify-between text-xs ${testedKeys.zwnj ? 'bg-teal-950/60 border-teal-500 text-teal-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                    <span>نیم‌فاصله</span>
                    {testedKeys.zwnj ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <span>-</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-950 p-4 sm:p-5 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5 font-['Vazirmatn']">
            <span>چیدمان انتخاب‌شده:</span>
            <strong className="text-teal-300">
              {selectedLayout === 'windows'
                ? 'ویندوز فارسی (Windows)'
                : selectedLayout === 'isiri'
                ? 'استاندارد ملی ایران (ISIRI 9147)'
                : selectedLayout === 'mac'
                ? 'مک / لینوکس'
                : 'سازگار هوشمند (Universal)'}
            </strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
            >
              بستن
            </button>

            <button
              onClick={handleApply}
              className="px-5 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-teal-900/30 flex items-center gap-1.5 font-['Vazirmatn']"
            >
              <Check className="w-4 h-4" />
              <span>ذخیره و اعمال چیدمان</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
