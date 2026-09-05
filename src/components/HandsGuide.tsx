import React from 'react';
import { FingerType } from '../types';
import { FINGER_COLORS } from '../data/persianKeyboard';

interface HandsGuideProps {
  activeFinger?: FingerType;
  nextChar?: string;
}

export const HandsGuide: React.FC<HandsGuideProps> = ({ activeFinger, nextChar }) => {
  const getFingerIndicatorClass = (finger: FingerType) => {
    const isTarget = activeFinger === finger;
    const config = FINGER_COLORS[finger];
    if (isTarget) {
      return `ring-2 ring-white ring-offset-2 ring-offset-slate-900 ${config.bg} ${config.text} scale-110 font-black shadow-lg shadow-teal-500/30 animate-pulse`;
    }
    return 'bg-slate-800/80 text-slate-400 border border-slate-700/50 hover:border-slate-600';
  };

  const activeFingerInfo = activeFinger ? FINGER_COLORS[activeFinger] : null;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3 sm:p-4 transition-all">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
          <span className="text-xs font-semibold text-slate-200">راهنمای جایگاه انگشتان</span>
        </div>

        {activeFingerInfo && (
          <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-xs">
            <span className="text-slate-400">کلید بعدی:</span>
            <span className="text-teal-300 font-bold px-1.5 py-0.2 bg-teal-950 rounded border border-teal-800/50">
              {nextChar === ' ' ? 'فاصله' : nextChar === '‌' ? 'نیم‌فاصله' : nextChar || '-'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="font-medium" style={{ color: activeFingerInfo.accent }}>
              {activeFingerInfo.handFa} - {activeFingerInfo.labelFa}
            </span>
          </div>
        )}
      </div>

      {/* Hands Visual Graphic */}
      <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto" dir="ltr">
        {/* Left Hand */}
        <div className="flex flex-col items-center bg-slate-950/50 border border-slate-800/80 rounded-xl p-3" dir="ltr">
          <span className="text-[11px] font-medium text-slate-400 mb-2.5" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>دست چپ (Left Hand)</span>
          
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-24 sm:h-28 w-full px-2" dir="ltr">
            {/* Pinky Left */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-12 sm:h-14 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('left-pinky')}`}
                title="انگشت کوچک چپ: ش، س، ض، ظ، ۱"
              >
                ش
              </div>
              <span className="text-[9px] text-slate-400">کوچک</span>
            </div>

            {/* Ring Left */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-16 sm:h-18 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('left-ring')}`}
                title="انگشت حلقه چپ: س، ص، ط، ۲"
              >
                س
              </div>
              <span className="text-[9px] text-slate-400">حلقه</span>
            </div>

            {/* Middle Left */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-20 sm:h-22 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('left-middle')}`}
                title="انگشت میانی چپ: ی، ث، ز، ۳"
              >
                ی
              </div>
              <span className="text-[9px] text-slate-400">میانی</span>
            </div>

            {/* Index Left */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-18 sm:h-20 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] relative ${getFingerIndicatorClass('left-index')}`}
                title="انگشت اشاره چپ: ب، ل، ف، ق، ر، ذ، ۴، ۵"
              >
                ب
                <span className="absolute -top-1 w-1.5 h-1.5 bg-teal-400 rounded-full" />
              </div>
              <span className="text-[9px] text-teal-300 font-bold">اشاره</span>
            </div>

            {/* Thumb Left */}
            <div className="flex flex-col items-center gap-1 ml-1">
              <div 
                className={`w-7 sm:w-9 h-10 sm:h-12 rounded-t-xl transition-all duration-200 flex items-center justify-center text-[9px] ${getFingerIndicatorClass('thumbs')}`}
                title="شست: کلید فاصله (Space)"
              >
                فاصله
              </div>
              <span className="text-[9px] text-slate-400">شست</span>
            </div>
          </div>
        </div>

        {/* Right Hand */}
        <div className="flex flex-col items-center bg-slate-950/50 border border-slate-800/80 rounded-xl p-3" dir="ltr">
          <span className="text-[11px] font-medium text-slate-400 mb-2.5" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>دست راست (Right Hand)</span>
          
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 h-24 sm:h-28 w-full px-2" dir="ltr">
            {/* Thumb Right */}
            <div className="flex flex-col items-center gap-1 mr-1">
              <div 
                className={`w-7 sm:w-9 h-10 sm:h-12 rounded-t-xl transition-all duration-200 flex items-center justify-center text-[9px] ${getFingerIndicatorClass('thumbs')}`}
                title="شست: کلید فاصله (Space)"
              >
                فاصله
              </div>
              <span className="text-[9px] text-slate-400">شست</span>
            </div>

            {/* Index Right */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-18 sm:h-20 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] relative ${getFingerIndicatorClass('right-index')}`}
                title="انگشت اشاره راست: ت، ا، غ، ع، د، پ، ۶، ۷"
              >
                ت
                <span className="absolute -top-1 w-1.5 h-1.5 bg-teal-400 rounded-full" />
              </div>
              <span className="text-[9px] text-teal-300 font-bold">اشاره</span>
            </div>

            {/* Middle Right */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-20 sm:h-22 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('right-middle')}`}
                title="انگشت میانی راست: ن، ه، و، ۸"
              >
                ن
              </div>
              <span className="text-[9px] text-slate-400">میانی</span>
            </div>

            {/* Ring Right */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-16 sm:h-18 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('right-ring')}`}
                title="انگشت حلقه راست: م، خ، نقطه، ۹"
              >
                م
              </div>
              <span className="text-[9px] text-slate-400">حلقه</span>
            </div>

            {/* Pinky Right */}
            <div className="flex flex-col items-center gap-1">
              <div 
                className={`w-6 sm:w-8 h-12 sm:h-14 rounded-t-full transition-all duration-200 flex items-center justify-center text-[10px] ${getFingerIndicatorClass('right-pinky')}`}
                title="انگشت کوچک راست: ک، گ، ح، ج، چ، پ، اینتر"
              >
                ک
              </div>
              <span className="text-[9px] text-slate-400">کوچک</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
