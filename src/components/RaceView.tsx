import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Flag, Sparkles, RefreshCw, Zap, Gauge, Users } from 'lucide-react';
import { TypingArea } from './TypingArea';
import { KeyDefinition, TypingStats, RacerBot, KeyboardLayoutType } from '../types';
import { SPEED_TEST_SNIPPETS } from '../data/practiceTexts';
import { toPersianDigits } from '../utils/persianUtils';

interface RaceViewProps {
  keyboardLayout?: KeyboardLayoutType;
  onRaceComplete: (stats: TypingStats) => void;
  onTargetKeyChange: (keyDef: KeyDefinition | null, nextChar: string) => void;
  onPhysicalKeyPress: (code: string | null, isError: boolean) => void;
}

export const RaceView: React.FC<RaceViewProps> = ({
  keyboardLayout = 'universal',
  onRaceComplete,
  onTargetKeyChange,
  onPhysicalKeyPress,
}) => {
  const [raceTextIndex, setRaceTextIndex] = useState<number>(0);
  const raceText = SPEED_TEST_SNIPPETS[raceTextIndex % SPEED_TEST_SNIPPETS.length];

  // Bots and user racers state
  const [racers, setRacers] = useState<RacerBot[]>([
    {
      id: 'user',
      name: 'شما (تایپیست)',
      avatar: '🏎️',
      carColor: 'from-emerald-400 to-teal-500',
      targetWpm: 0,
      progress: 0,
      currentWpm: 0,
      isUser: true,
    },
    {
      id: 'bot-1',
      name: 'سحر (دانشجو)',
      avatar: '🚙',
      carColor: 'from-blue-400 to-indigo-500',
      targetWpm: 38,
      progress: 0,
      currentWpm: 38,
    },
    {
      id: 'bot-2',
      name: 'آرش (برنامه‌نویس)',
      avatar: '🏎️',
      carColor: 'from-amber-400 to-orange-500',
      targetWpm: 58,
      progress: 0,
      currentWpm: 58,
    },
    {
      id: 'bot-3',
      name: 'یوز ایرانی (استاد)',
      avatar: '🚀',
      carColor: 'from-rose-500 to-purple-600',
      targetWpm: 78,
      progress: 0,
      currentWpm: 78,
    },
  ]);

  const [raceStarted, setRaceStarted] = useState<boolean>(false);
  const [raceFinished, setRaceFinished] = useState<boolean>(false);
  const botIntervalRef = useRef<number | null>(null);

  // Restart race
  const handleRestartRace = () => {
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    setRaceStarted(false);
    setRaceFinished(false);
    setRacers((prev) =>
      prev.map((r) => ({ ...r, progress: 0, currentWpm: r.isUser ? 0 : r.targetWpm }))
    );
  };

  // Switch race track text
  const handleChangeText = () => {
    setRaceTextIndex((prev) => prev + 1);
    handleRestartRace();
  };

  // Bot simulation loop when user starts typing
  const startBotSimulation = () => {
    if (raceStarted) return;
    setRaceStarted(true);

    const startTime = Date.now();
    const charsTotal = raceText.length;

    botIntervalRef.current = window.setInterval(() => {
      const elapsedMinutes = (Date.now() - startTime) / (1000 * 60);

      setRacers((prev) =>
        prev.map((racer) => {
          if (racer.isUser) return racer;

          // Jitter speed +/- 4 WPM for realism
          const jitter = (Math.random() - 0.5) * 6;
          const effectiveWpm = Math.max(15, racer.targetWpm + jitter);
          const charsTyped = effectiveWpm * 5 * elapsedMinutes;
          const prog = Math.min(100, Math.round((charsTyped / charsTotal) * 100));

          return {
            ...racer,
            progress: prog,
            currentWpm: Math.round(effectiveWpm),
          };
        })
      );
    }, 400);
  };

  // Clean up
  useEffect(() => {
    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, []);

  // Update user progress from TypingArea
  const handleUserProgressUpdate = (stats: TypingStats) => {
    if (!raceStarted) {
      startBotSimulation();
    }

    const userProg = Math.min(100, Math.round((stats.correctChars / (raceText.length || 1)) * 100));

    setRacers((prev) =>
      prev.map((r) =>
        r.isUser
          ? {
              ...r,
              progress: userProg,
              currentWpm: stats.wpm,
            }
          : r
      )
    );
  };

  const handleFinish = (finalStats: TypingStats) => {
    if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    setRaceFinished(true);

    setRacers((prev) =>
      prev.map((r) => (r.isUser ? { ...r, progress: 100, currentWpm: finalStats.wpm } : r))
    );

    onRaceComplete(finalStats);
  };

  // Standings sorted by progress desc
  const sortedRacers = [...racers].sort((a, b) => b.progress - a.progress);
  const userRank = sortedRacers.findIndex((r) => r.isUser) + 1;

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* Race Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5" />
            <span>حالت رقابتی زنده (Typing Racer)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            مسابقه اتومبیل‌رانی تایپ سریع
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            با رقبای هوشمند مسابقه دهید! با افزایش سرعت و تایپ بدون خطای خود، اتومبیل خود را در پیست به سمت خط پایان برانید و بر سکوی قهرمانی بایستید.
          </p>
        </div>

        {/* User live position badge */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 p-4 rounded-2xl">
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-400">رتبه فعلی شما</span>
            <div className="flex items-center gap-1.5 text-2xl font-black text-amber-400">
              <Trophy className="w-6 h-6 text-amber-400" />
              <span>مقام {toPersianDigits(userRank)}</span>
            </div>
            <span className="text-[10px] text-slate-500">از ۴ شرکت‌کننده</span>
          </div>
        </div>
      </div>

      {/* Speedway / Race Track */}
      <div className="bg-slate-950 border border-slate-800/90 rounded-3xl p-4 sm:p-6 flex flex-col gap-3 shadow-2xl relative overflow-hidden">
        
        {/* Track Title Bar */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="font-semibold text-slate-200">پیست مسابقه بزرگ</span>
          </div>

          <button
            onClick={handleChangeText}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تغییر متن پیست</span>
          </button>
        </div>

        {/* 4 Lanes */}
        <div className="flex flex-col gap-3 py-2">
          {racers.map((racer, index) => {
            return (
              <div
                key={racer.id}
                className={`relative rounded-2xl p-3 border transition-all ${
                  racer.isUser
                    ? 'bg-slate-900/90 border-teal-500/50 shadow-md shadow-teal-500/10'
                    : 'bg-slate-900/40 border-slate-800/60'
                }`}
              >
                {/* Lane Info Header */}
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{racer.avatar}</span>
                    <span className={`font-bold ${racer.isUser ? 'text-teal-300' : 'text-slate-300'}`}>
                      {racer.name}
                    </span>
                    {racer.isUser && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-teal-500/20 text-teal-300 rounded font-bold">
                        اتومبیل شما
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] font-mono">
                    <span className="text-slate-400">
                      {toPersianDigits(racer.currentWpm)} <span className="text-[9px] text-slate-500">WPM</span>
                    </span>
                    <span className="font-bold text-slate-200">
                      ٪{toPersianDigits(racer.progress)}
                    </span>
                  </div>
                </div>

                {/* Road surface track with animated car */}
                <div className="relative h-9 bg-slate-950 rounded-xl border border-slate-800/90 overflow-hidden flex items-center px-1">
                  
                  {/* Road dashed center line */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] border-b border-dashed border-slate-700/60" />
                  
                  {/* Checkered Finish Line at the left (RTL track) */}
                  <div className="absolute left-0 top-0 bottom-0 w-4 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-50 z-10" />

                  {/* Racing Car */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-300 ease-out z-20 flex items-center gap-1"
                    style={{
                      right: `calc(${racer.progress}% * 0.94)`,
                    }}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5 bg-gradient-to-r ${racer.carColor} text-slate-950`}
                    >
                      <span className="text-sm">{racer.avatar}</span>
                      <span className="text-[10px] whitespace-nowrap">{racer.name.split(' ')[0]}</span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Typing Interaction Canvas */}
      <TypingArea
        key={raceTextIndex}
        targetText={raceText}
        title="پیست رقابت سرعت"
        categoryLabel="مسابقه زنده"
        keyboardLayout={keyboardLayout}
        onComplete={handleFinish}
        onTargetKeyChange={onTargetKeyChange}
        onPhysicalKeyPress={(code, isError) => {
          onPhysicalKeyPress(code, isError);
          if (!raceStarted) startBotSimulation();
        }}
      />

    </div>
  );
};
