import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Droplets, 
  Zap, 
  Heart, 
  ShieldAlert, 
  X, 
  Play, 
  Square, 
  RotateCcw, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  Sparkles,
  Flame
} from 'lucide-react';
import { startEmergencySiren, stopEmergencySiren, playRadioClick, playSaluteSound } from '../utils/audio';
import { DRILL_SERGEANT_QUOTES } from '../utils/mockData';

interface TemptationDefusalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemptationDefusal: React.FC<TemptationDefusalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTool, setActiveTool] = useState<'shower' | 'pushups' | 'game' | 'breathing'>('shower');
  const [sirenActive, setSirenActive] = useState(false);

  // Cold Shower Timer State
  const [showerSeconds, setShowerSeconds] = useState(120);
  const [isShowerRunning, setIsShowerRunning] = useState(false);

  // Pushups counter
  const [pushupCount, setPushupCount] = useState(0);

  // Drill quote
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Reflex game state
  const [gameScore, setGameScore] = useState(0);
  const [targetPosition, setTargetPosition] = useState({ top: 40, left: 50 });
  const [targetLabel, setTargetLabel] = useState('Instagram Reel');

  useEffect(() => {
    if (!isOpen) {
      stopEmergencySiren();
      setSirenActive(false);
      setIsShowerRunning(false);
    }
  }, [isOpen]);

  // Cold shower timer tick
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isShowerRunning && showerSeconds > 0) {
      interval = setInterval(() => {
        setShowerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (showerSeconds === 0 && isShowerRunning) {
      setIsShowerRunning(false);
      playSaluteSound();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isShowerRunning, showerSeconds]);

  // Siren toggle
  const toggleSiren = () => {
    if (sirenActive) {
      stopEmergencySiren();
      setSirenActive(false);
    } else {
      startEmergencySiren();
      setSirenActive(true);
    }
  };

  const nextQuote = () => {
    playRadioClick();
    setCurrentQuoteIndex((prev) => (prev + 1) % DRILL_SERGEANT_QUOTES.length);
  };

  // Reflex Game: Hit trigger
  const hitTrigger = () => {
    playRadioClick();
    setGameScore((prev) => prev + 1);
    const triggers = ['Instagram Reel', 'Late Night Bed Phone', 'Ex DM', 'Warm Blanket', 'Reddit NSFW', 'Anime Episode', 'Weak Mind'];
    setTargetLabel(triggers[Math.floor(Math.random() * triggers.length)]);
    setTargetPosition({
      top: Math.floor(15 + Math.random() * 65),
      left: Math.floor(10 + Math.random() * 75)
    });
  };

  if (!isOpen) return null;

  const minutes = Math.floor(showerSeconds / 60);
  const remainingSeconds = showerSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-neutral-900 border-2 border-rose-600 rounded-2xl shadow-2xl shadow-rose-950/80 overflow-hidden text-neutral-100 flex flex-col max-h-[92vh]">
        {/* Urgent Alert Banner */}
        <div className="bg-rose-950/80 border-b border-rose-800/80 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 flex items-center justify-center text-neutral-950 animate-bounce">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-rose-300 uppercase tracking-widest font-black">
                DEFCON RED // TEMPTATION INTERVENTION PROTOCOL
              </div>
              <h2 className="text-xl font-stencil uppercase tracking-wide text-white">
                TACTICAL DEFUSAL CHAMBER
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSiren}
              className={`p-2 rounded-lg border text-xs font-mono-code flex items-center gap-1.5 transition-all cursor-pointer ${
                sirenActive
                  ? 'bg-rose-600 text-white border-white animate-pulse'
                  : 'bg-neutral-950 border-neutral-750 text-neutral-300 hover:text-white'
              }`}
              title="Toggle Klaxon Alarm Sound"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">{sirenActive ? 'SIREN ON' : 'SIREN OFF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drill Sergeant Tactical Radio Broadcast */}
        <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Radio className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="text-xs font-mono-code text-amber-300 truncate">
              <strong>DRILL SGT:</strong> "{DRILL_SERGEANT_QUOTES[currentQuoteIndex]}"
            </div>
          </div>
          <button
            onClick={nextQuote}
            className="text-[11px] font-mono-code text-neutral-400 hover:text-amber-400 underline shrink-0 cursor-pointer"
          >
            New Order
          </button>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-950 text-center text-xs font-mono-code">
          <button
            onClick={() => setActiveTool('shower')}
            className={`py-2.5 px-1 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTool === 'shower' ? 'border-sky-500 text-sky-400 font-bold bg-sky-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cold Shower</span>
            <span className="sm:hidden">Shower</span>
          </button>

          <button
            onClick={() => setActiveTool('pushups')}
            className={`py-2.5 px-1 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTool === 'pushups' ? 'border-amber-500 text-amber-400 font-bold bg-amber-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pushup Drill</span>
            <span className="sm:hidden">Pushups</span>
          </button>

          <button
            onClick={() => setActiveTool('game')}
            className={`py-2.5 px-1 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTool === 'game' ? 'border-rose-500 text-rose-400 font-bold bg-rose-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Defuse Triggers</span>
            <span className="sm:hidden">Reflex</span>
          </button>

          <button
            onClick={() => setActiveTool('breathing')}
            className={`py-2.5 px-1 border-b-2 transition-all flex items-center justify-center gap-1.5 ${
              activeTool === 'breathing' ? 'border-emerald-500 text-emerald-400 font-bold bg-emerald-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tactical Zen</span>
            <span className="sm:hidden">Breath</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Tool 1: Cold Shower Timer */}
          {activeTool === 'shower' && (
            <div className="text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-sky-400 font-bold">
                  2-MINUTE SUB-ZERO HYDROTHERAPY
                </span>
                <p className="text-xs font-mono-code text-neutral-400 max-w-md mx-auto">
                  Turn the handle completely cold. Step under the stream. Glacial water instantly drops heart rate, triggers vasoconstriction, and completely terminates dopamine loop signals.
                </p>
              </div>

              {/* Big Digits */}
              <div className="py-6 bg-neutral-950 border border-sky-900/60 rounded-2xl max-w-xs mx-auto shadow-inner">
                <div className="text-6xl font-stencil text-sky-300 tracking-wider">
                  {String(minutes).padStart(2, '0')}:{String(remainingSeconds).padStart(2, '0')}
                </div>
                <div className="text-[10px] font-mono-code text-sky-500 mt-1 uppercase">
                  {isShowerRunning ? 'HYDROTHERAPY IN PROGRESS' : showerSeconds === 0 ? 'REACTOR COOLED' : 'READY TO ENGAGE'}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-3">
                {!isShowerRunning ? (
                  <button
                    onClick={() => setIsShowerRunning(true)}
                    className="px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-neutral-950 font-stencil font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-sky-950/50 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-neutral-950" /> START WATER STREAM
                  </button>
                ) : (
                  <button
                    onClick={() => setIsShowerRunning(false)}
                    className="px-6 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-mono-code font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <Square className="w-4 h-4" /> PAUSE
                  </button>
                )}

                <button
                  onClick={() => {
                    setIsShowerRunning(false);
                    setShowerSeconds(120);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-750 text-neutral-400 hover:text-white font-mono-code text-xs uppercase flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> RESET
                </button>
              </div>
            </div>
          )}

          {/* Tool 2: Pushup Drill Counter */}
          {activeTool === 'pushups' && (
            <div className="text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-400 font-bold">
                  DROP AND GIVE THE BATTALION 30 REPS
                </span>
                <p className="text-xs font-mono-code text-neutral-400 max-w-md mx-auto">
                  Physical exhaustion is the ultimate circuit breaker. Redirect blood from the subconscious mind to the pectorals and triceps immediately.
                </p>
              </div>

              {/* Pushup Big Counter Button */}
              <div 
                onClick={() => {
                  playSaluteSound();
                  setPushupCount((prev) => prev + 1);
                }}
                className="w-44 h-44 rounded-full bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 border-4 border-amber-400 flex flex-col items-center justify-center mx-auto cursor-pointer shadow-xl shadow-amber-950/70 hover:scale-105 active:scale-95 transition-all select-none"
              >
                <div className="text-5xl font-stencil text-neutral-950 font-black">{pushupCount}</div>
                <div className="text-[10px] font-mono-code font-bold text-neutral-950 uppercase tracking-widest mt-1">
                  TAP FOR EACH REP
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setPushupCount(0)}
                  className="px-4 py-2 rounded bg-neutral-950 border border-neutral-750 text-neutral-400 hover:text-white text-xs font-mono-code uppercase cursor-pointer"
                >
                  Reset Counter
                </button>
                {pushupCount >= 30 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-mono-code font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> MISSION ACCOMPLISHED, SOLDIER!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Tool 3: Whack-a-Trigger Reflex Game */}
          {activeTool === 'game' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[11px] font-mono-code text-rose-400 font-bold uppercase">
                    NEUTRALIZE INCOMING ALGORITHMIC THREATS
                  </span>
                  <div className="text-xs font-mono-code text-neutral-400">
                    Tap the triggers as they appear to redirect your focus!
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono-code text-neutral-500">TRIGGERS DEFUSED</div>
                  <div className="text-xl font-stencil text-rose-400">{gameScore}</div>
                </div>
              </div>

              {/* Arena */}
              <div className="w-full h-64 bg-neutral-950 border-2 border-dashed border-rose-900/60 rounded-xl relative overflow-hidden select-none">
                <button
                  onClick={hitTrigger}
                  style={{ top: `${targetPosition.top}%`, left: `${targetPosition.left}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 active:scale-90 text-white font-mono-code text-xs font-bold uppercase shadow-lg shadow-rose-950 transition-transform cursor-pointer border border-rose-300 flex items-center gap-1.5 animate-pulse"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  SMASH: {targetLabel}
                </button>
              </div>
            </div>
          )}

          {/* Tool 4: Combat Box Breathing Guide */}
          {activeTool === 'breathing' && (
            <div className="text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-mono-code uppercase tracking-wider text-emerald-400 font-bold">
                  TACTICAL BOX BREATHING (NAVY SEAL PROTOCOL)
                </span>
                <p className="text-xs font-mono-code text-neutral-400 max-w-md mx-auto">
                  Inhale for 4 seconds, Hold for 4 seconds, Exhale for 4 seconds, Hold for 4 seconds. Restores autonomic nervous balance and clears impulsive fog.
                </p>
              </div>

              {/* Pulsing Breathing Circle */}
              <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/40 animate-ping opacity-25" />
                <div className="w-36 h-36 rounded-full bg-emerald-950/40 border-2 border-emerald-400 flex flex-col items-center justify-center text-emerald-300 font-stencil text-base shadow-xl shadow-emerald-950/60">
                  <span>INHALE (4s)</span>
                  <span className="text-[10px] font-mono-code text-emerald-500 mt-1">HOLD • EXHALE</span>
                </div>
              </div>

              <div className="text-xs font-mono-code text-neutral-400">
                Repeat 4 full cycles before touching your phone again.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-neutral-950 border-t border-neutral-800 px-6 py-3 flex items-center justify-between text-xs font-mono-code text-neutral-500">
          <span>HIGH COMMAND PROTOCOL 77-B</span>
          <button
            onClick={onClose}
            className="text-neutral-300 hover:text-white font-bold cursor-pointer"
          >
            Dismiss Defusal Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
