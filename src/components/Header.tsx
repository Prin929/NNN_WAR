import React, { useState } from 'react';
import { 
  Shield, 
  Skull, 
  Award, 
  Flame, 
  Volume2, 
  VolumeX, 
  AlertTriangle, 
  Calendar, 
  UserPlus, 
  Radio, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Soldier } from '../types';
import { playRadioClick } from '../utils/audio';

interface HeaderProps {
  activeTab: 'hq' | 'enlist' | 'memorial' | 'medals' | 'panic';
  setActiveTab: (tab: 'hq' | 'enlist' | 'memorial' | 'medals' | 'panic') => void;
  userSoldier: Soldier | null;
  simulatedDay: number;
  setSimulatedDay: (day: number) => void;
  onOpenCasualtyModal: () => void;
  onOpenPanicProtocol: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userSoldier,
  simulatedDay,
  setSimulatedDay,
  onOpenCasualtyModal,
  onOpenPanicProtocol,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleTabChange = (tab: 'hq' | 'enlist' | 'memorial' | 'medals' | 'panic') => {
    if (soundEnabled) playRadioClick();
    setActiveTab(tab);
  };

  const isVictoryPeriod = simulatedDay > 30;

  return (
    <header className="sticky top-0 z-40 border-b border-amber-950/60 bg-neutral-950/90 backdrop-blur-md">
      {/* Top Tactical Alert Marquee / Time Machine */}
      <div className="bg-amber-950/40 border-b border-amber-900/30 px-3 py-1.5 flex flex-wrap items-center justify-between text-xs font-mono-code text-amber-300">
        <div className="flex items-center space-x-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            DEFCON 1: FRONT LINE ACTIVE
          </span>
          <span className="hidden md:inline text-neutral-500">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {isVictoryPeriod ? (
              <span className="text-amber-400 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> VICTORY DAY (POST-NOV 30) - MEDALS OF HONOR CEREMONY
              </span>
            ) : (
              <span>OPERATION CLEAN SLATE: <strong className="text-amber-400">DAY {simulatedDay} OF 30</strong> (NOV {simulatedDay}, 2026)</span>
            )}
          </span>
        </div>

        {/* Date Time Machine Simulation Toggle */}
        <div className="flex items-center gap-2 mt-1 sm:mt-0">
          <span className="text-[11px] text-neutral-400 uppercase tracking-wider hidden sm:inline">Simulation Time Machine:</span>
          <div className="flex items-center bg-neutral-900 border border-neutral-750 rounded p-0.5">
            <button
              onClick={() => {
                setSimulatedDay(2);
                if (soundEnabled) playRadioClick();
              }}
              title="Set to Current Real Timeline (Nov 2)"
              className={`px-2 py-0.5 text-[11px] rounded transition-all ${
                !isVictoryPeriod
                  ? 'bg-amber-600 text-white font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Nov 2 (Trenches)
            </button>
            <button
              onClick={() => {
                setSimulatedDay(31);
                if (soundEnabled) playRadioClick();
              }}
              title="Simulate After November 30 (Dec 1) to test Medal of Honor awarding!"
              className={`px-2 py-0.5 text-[11px] rounded transition-all flex items-center gap-1 ${
                isVictoryPeriod
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-neutral-950 font-bold shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300'
              }`}
            >
              <Award className="w-3 h-3" />
              Dec 1 (Victory Day)
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-neutral-400 hover:text-amber-300 hover:bg-neutral-900 transition-colors"
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-500" /> : <VolumeX className="w-4 h-4 text-neutral-500" />}
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Crest */}
          <div 
            onClick={() => handleTabChange('hq')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded bg-gradient-to-br from-amber-600 to-amber-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-950/50 group-hover:border-amber-400 transition-all">
              <Shield className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-stencil tracking-wider text-xl sm:text-2xl text-amber-400 uppercase font-black">
                  NNN COMMAND
                </span>
                <span className="text-[10px] font-mono-code font-bold bg-neutral-900 text-amber-500 border border-amber-500/30 px-1.5 py-0.2 rounded uppercase">
                  OPS-2026
                </span>
              </div>
              <p className="text-[11px] font-mono-code text-neutral-400 tracking-tight hidden sm:block">
                OPERATION CLEAN SLATE // DISCIPLINE CITADEL
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleTabChange('hq')}
              className={`px-3 py-2 rounded-md text-xs font-mono-code font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'hq'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Radio className="w-4 h-4" />
              Command HQ
            </button>

            <button
              onClick={() => handleTabChange('enlist')}
              className={`px-3 py-2 rounded-md text-xs font-mono-code font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'enlist'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              {userSoldier ? 'My Dog Tag' : 'Enlist Soldier'}
            </button>

            <button
              onClick={() => handleTabChange('memorial')}
              className={`px-3 py-2 rounded-md text-xs font-mono-code font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                activeTab === 'memorial'
                  ? 'bg-rose-500/15 text-rose-400 border border-rose-500/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Skull className="w-4 h-4 text-rose-500" />
              The Fallen Wall
            </button>

            <button
              onClick={() => handleTabChange('medals')}
              className={`px-3 py-2 rounded-md text-xs font-mono-code font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 relative ${
                activeTab === 'medals'
                  ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 shadow-sm shadow-yellow-500/20'
                  : 'text-neutral-400 hover:text-yellow-300 hover:bg-neutral-900'
              }`}
            >
              <Award className="w-4 h-4 text-yellow-500" />
              Medals of Honor
              {isVictoryPeriod && (
                <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping absolute top-1.5 right-1.5" />
              )}
            </button>
          </nav>

          {/* Action CTAs: Panic & Casualty Report */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenPanicProtocol}
              className="px-2.5 py-1.5 rounded bg-rose-950/70 border border-rose-600/70 text-rose-300 text-xs font-mono-code font-bold hover:bg-rose-900 hover:text-white transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/50 animate-pulse"
              title="EMERGENCY TEMPTATION DEFUSAL: Cold shower, pushups, distraction"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">PANIC BUTTON</span>
              <span className="sm:hidden">DEFUSE</span>
            </button>

            {userSoldier && userSoldier.status === 'ACTIVE' && !isVictoryPeriod && (
              <button
                onClick={onOpenCasualtyModal}
                className="px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-mono-code hover:border-rose-500 hover:text-rose-400 transition-colors flex items-center gap-1.5"
                title="If you breached defenses, report to the tribunal"
              >
                <Skull className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden md:inline">I Have Fallen</span>
              </button>
            )}

            {userSoldier && (
              <div 
                onClick={() => handleTabChange('enlist')}
                className="cursor-pointer hidden sm:flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded px-2.5 py-1 hover:border-amber-500/40 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-stencil text-xs">
                  {userSoldier.rank[0]}
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-neutral-200 leading-none">
                    {userSoldier.callsign}
                  </div>
                  <div className="text-[10px] font-mono-code text-amber-400/80">
                    {userSoldier.status === 'FALLEN' ? 'KIA (FALLEN)' : isVictoryPeriod ? 'HONORED' : `DAY ${userSoldier.daysSurvived}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-neutral-800/80 py-2 overflow-x-auto space-x-1">
          <button
            onClick={() => handleTabChange('hq')}
            className={`px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'hq' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-neutral-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5" /> HQ
          </button>
          <button
            onClick={() => handleTabChange('enlist')}
            className={`px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'enlist' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-neutral-400'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> {userSoldier ? 'Dog Tag' : 'Enlist'}
          </button>
          <button
            onClick={() => handleTabChange('memorial')}
            className={`px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'memorial' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'text-neutral-400'
            }`}
          >
            <Skull className="w-3.5 h-3.5 text-rose-400" /> Memorial
          </button>
          <button
            onClick={() => handleTabChange('medals')}
            className={`px-2.5 py-1 rounded text-xs font-mono-code whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'medals' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40' : 'text-neutral-400'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-yellow-400" /> Medals
          </button>
        </div>
      </div>
    </header>
  );
};
