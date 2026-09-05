import React from 'react';
import { 
  GraduationCap, 
  Timer, 
  Trophy, 
  FileText, 
  BarChart3, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  HandMetal,
  Sparkles
} from 'lucide-react';
import { AppMode, SoundTheme, KeyboardLayoutType } from '../types';
import { toPersianDigits } from '../utils/persianUtils';

interface NavbarProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  soundTheme: SoundTheme;
  onChangeSoundTheme: (theme: SoundTheme) => void;
  showHandsGuide: boolean;
  onToggleHandsGuide: () => void;
  showKeyboard: boolean;
  onToggleKeyboard: () => void;
  completedLessonsCount: number;
  bestWpm: number;
  keyboardLayout: KeyboardLayoutType;
  onOpenKeyboardSetup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMode,
  onSelectMode,
  isMuted,
  onToggleMute,
  soundTheme,
  onChangeSoundTheme,
  showHandsGuide,
  onToggleHandsGuide,
  showKeyboard,
  onToggleKeyboard,
  completedLessonsCount,
  bestWpm,
  keyboardLayout,
  onOpenKeyboardSetup,
}) => {
  const navItems = [
    { id: 'lessons' as AppMode, label: 'تمرین مرحله‌ای', icon: GraduationCap },
    { id: 'speedtest' as AppMode, label: 'آزمون سرعت', icon: Timer },
    { id: 'race' as AppMode, label: 'مسابقه رانندگی', icon: Trophy },
    { id: 'custom' as AppMode, label: 'متن سفارشی', icon: FileText },
    { id: 'analytics' as AppMode, label: 'تحلیل هوشمند خطاها', icon: BarChart3 },
  ];

  const layoutNames: Record<KeyboardLayoutType, string> = {
    universal: 'سازگار هوشمند',
    windows: 'ویندوز',
    isiri: 'استاندارد ملی',
    mac: 'مک / لینوکس',
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-teal-300 via-cyan-200 to-white bg-clip-text text-transparent">
                  تایپیست
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-teal-500/20 text-teal-300 rounded border border-teal-500/30">
                  فارسی
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal">آموزش ده انگشتی هوشمند</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-slate-950/60 p-1.5 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentMode === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectMode(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-md shadow-teal-900/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Controls & Stats */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick stats pills */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
              <span className="text-slate-400">بهترین سرعت:</span>
              <span className="font-bold text-teal-300 font-mono">
                {toPersianDigits(bestWpm)}
              </span>
              <span className="text-[10px] text-slate-500">WPM</span>
            </div>

            {/* Keyboard Setup & Detection Button */}
            <button
              id="btn-open-keyboard-setup"
              onClick={onOpenKeyboardSetup}
              title="تنظیم و تشخیص پیشرفته کیبورد"
              className="px-2.5 py-1.5 rounded-lg border border-teal-500/30 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 transition-all text-xs flex items-center gap-1.5"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">کیبورد:</span>
              <span className="font-bold text-white text-[11px]">{layoutNames[keyboardLayout]}</span>
            </button>

            {/* Hands Guide Toggle */}
            <button
              id="btn-toggle-hands"
              onClick={onToggleHandsGuide}
              title={showHandsGuide ? 'مخفی کردن راهنمای دست‌ها' : 'نمایش راهنمای دست‌ها'}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                showHandsGuide
                  ? 'bg-teal-500/15 border-teal-500/30 text-teal-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <HandMetal className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">دست‌ها</span>
            </button>

            {/* Keyboard Guide Toggle */}
            <button
              id="btn-toggle-keyboard"
              onClick={onToggleKeyboard}
              title={showKeyboard ? 'مخفی کردن کیبورد مجازی' : 'نمایش کیبورد مجازی'}
              className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
                showKeyboard
                  ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden xl:inline text-[11px]">کیبورد</span>
            </button>

            {/* Sound Selector & Toggle */}
            <div className="flex items-center bg-slate-950/70 border border-slate-800 rounded-lg p-0.5">
              <button
                id="btn-toggle-sound"
                onClick={onToggleMute}
                title={isMuted ? 'فعال کردن صدا' : 'قطع صدا'}
                className={`p-1.5 rounded-md transition-colors ${
                  isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-teal-400 hover:text-teal-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {!isMuted && (
                <select
                  id="select-sound-theme"
                  value={soundTheme}
                  onChange={(e) => onChangeSoundTheme(e.target.value as SoundTheme)}
                  className="bg-transparent text-[11px] text-slate-300 border-none outline-none pr-1 pl-2 py-1 cursor-pointer hover:text-white"
                >
                  <option value="mechanical" className="bg-slate-900 text-slate-200">مکانیکی آبی</option>
                  <option value="thock" className="bg-slate-900 text-slate-200">تاک عمیق</option>
                  <option value="typewriter" className="bg-slate-900 text-slate-200">ماشین تحریر</option>
                  <option value="silent" className="bg-slate-900 text-slate-200">بی‌صدا</option>
                </select>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Submenu bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 space-x-reverse border-t border-slate-800/60 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMode(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
