import React from 'react';
import { getKeyboardRows, FINGER_COLORS } from '../data/persianKeyboard';
import { KeyDefinition, KeyboardLayoutType } from '../types';

interface VirtualKeyboardProps {
  targetKeyDef?: KeyDefinition | null;
  activePhysicalKey?: string | null;
  isErrorState?: boolean;
  highlightFingers?: boolean;
  heatmapData?: Record<string, number>; // char -> error count
  layout?: KeyboardLayoutType;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  targetKeyDef,
  activePhysicalKey,
  isErrorState = false,
  highlightFingers = true,
  heatmapData,
  layout = 'universal',
}) => {
  const keyboardRows = getKeyboardRows(layout);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl p-2.5 sm:p-4 select-none shadow-xl overflow-x-auto font-sans" dir="ltr">
      <div className="min-w-[680px] max-w-4xl mx-auto flex flex-col gap-1.5 sm:gap-2" dir="ltr">
        {keyboardRows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center items-center gap-1 sm:gap-1.5 w-full" dir="ltr">
            {row.map((key) => {
              // Check target match (in universal mode, check if char matches target char as well)
              let isTarget = targetKeyDef?.code === key.code;
              if (layout === 'universal' && targetKeyDef) {
                if (targetKeyDef.faChar === 'پ' && (key.code === 'KeyM' || key.code === 'Backslash')) {
                  isTarget = true;
                } else if (targetKeyDef.faChar === 'ژ' && (key.code === 'KeyC' || key.code === 'Backslash')) {
                  isTarget = true;
                }
              }

              const isPressed = activePhysicalKey === key.code;
              const fingerConfig = FINGER_COLORS[key.finger];
              const errorCount = heatmapData ? (heatmapData[key.faChar] || 0) : 0;
              const hasHeatmap = errorCount > 0;

              // Home row bumps on KeyF (ب) and KeyJ (ت)
              const hasBump = key.code === 'KeyF' || key.code === 'KeyJ';

              // Determine classes
              let bgClass = 'bg-slate-800 text-slate-200 border-slate-700/80 hover:bg-slate-750';
              let borderClass = 'border-b-2 border-slate-700';

              if (highlightFingers && fingerConfig && !isTarget && !isPressed) {
                bgClass = `${fingerConfig.bg} ${fingerConfig.text} border-slate-700/60`;
              }

              if (hasHeatmap) {
                // Tint reddish depending on errors
                bgClass = 'bg-rose-950/70 text-rose-200 border-rose-800/60';
              }

              if (isTarget) {
                if (isErrorState) {
                  bgClass = 'bg-rose-500 text-white shadow-lg shadow-rose-500/50 animate-shake';
                  borderClass = 'border-rose-400';
                } else {
                  bgClass = 'bg-teal-500 text-white font-bold ring-2 ring-teal-300 shadow-lg shadow-teal-500/40 animate-pulse';
                  borderClass = 'border-teal-300';
                }
              }

              if (isPressed && !isTarget) {
                bgClass = 'bg-cyan-600 text-white translate-y-0.5';
              }

              const widthClass = key.width || 'w-10 sm:w-12';

              return (
                <div
                  key={key.code}
                  className={`relative flex flex-col items-center justify-between h-10 sm:h-12 ${widthClass} rounded-lg p-1 transition-all duration-150 border text-center font-medium ${bgClass} ${borderClass}`}
                  title={`${key.faChar} (${fingerConfig?.handFa} - ${fingerConfig?.labelFa})`}
                >
                  {/* Top shift or secondary char */}
                  <div className="flex items-center justify-between w-full px-0.5 text-[9px] text-slate-400 leading-none" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
                    <span className="font-['Vazirmatn']">{key.faShiftChar || ''}</span>
                    <span className="font-mono text-[8px] opacity-40 uppercase">{key.enChar}</span>
                  </div>

                  {/* Primary Persian character */}
                  <div 
                    className="text-sm sm:text-base font-bold leading-tight select-none"
                    style={{ fontFamily: 'Vazirmatn, sans-serif' }}
                  >
                    {key.faChar}
                  </div>

                  {/* Home bump indicator on F and J */}
                  {hasBump && (
                    <div className="w-2.5 h-0.5 bg-teal-400/80 rounded-full mx-auto" />
                  )}

                  {/* Heatmap error badge if any */}
                  {hasHeatmap && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow font-mono">
                      {errorCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Finger Legend */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 hidden sm:flex flex-wrap items-center justify-center gap-2 text-[10px]" dir="rtl" style={{ fontFamily: 'Vazirmatn, sans-serif' }}>
        <span className="text-slate-400 ml-1">تفکیک رنگ انگشتان:</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-slate-300">انگشت کوچک</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-slate-300">انگشت حلقه</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-slate-300">انگشت میانی</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span className="text-slate-300">اشاره چپ</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <span className="text-slate-300">اشاره راست</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span className="text-slate-300">شست‌ها (فاصله)</span>
        </div>
      </div>
    </div>
  );
};

