import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Skull, 
  Award, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Clock, 
  Users, 
  Radio, 
  Zap, 
  Droplets, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Soldier, CasualtyReport } from '../types';
import { checkInSoldier } from '../utils/storage';
import { playSaluteSound, playRadioClick } from '../utils/audio';

interface CommandHQProps {
  userSoldier: Soldier | null;
  soldiers: Soldier[];
  casualtyReports: CasualtyReport[];
  simulatedDay: number;
  setSimulatedDay: (day: number) => void;
  onGoToEnlist: () => void;
  onGoToMemorial: () => void;
  onGoToMedals: () => void;
  onOpenCasualtyModal: () => void;
  onOpenPanicProtocol: () => void;
  onRefreshData: () => void;
}

export const CommandHQ: React.FC<CommandHQProps> = ({
  userSoldier,
  soldiers,
  casualtyReports,
  simulatedDay,
  setSimulatedDay,
  onGoToEnlist,
  onGoToMemorial,
  onGoToMedals,
  onOpenCasualtyModal,
  onOpenPanicProtocol,
  onRefreshData
}) => {
  // Check-in form state
  const [fortitudeRating, setFortitudeRating] = useState(90);
  const [tookColdShower, setTookColdShower] = useState(false);
  const [didPushups, setDidPushups] = useState(false);
  const [combatNotes, setCombatNotes] = useState('');
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);

  // Live countdown to November 30 23:59:59
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 28,
    hours: 14,
    minutes: 32,
    seconds: 45
  });

  useEffect(() => {
    const updateCountdown = () => {
      // November 30 23:59:59
      const targetDate = new Date(2026, 10, 30, 23, 59, 59).getTime();
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRollCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSoldier) return;

    playSaluteSound();
    const result = checkInSoldier(userSoldier.id);
    setCheckInMessage(result.message);
    onRefreshData();
    setTimeout(() => setCheckInMessage(null), 4000);
  };

  const isVictoryPeriod = simulatedDay > 30;

  // Statistics
  const totalSoldiers = soldiers.length;
  const activeSoldiers = soldiers.filter(s => s.status === 'ACTIVE').length;
  const fallenSoldiers = soldiers.filter(s => s.status === 'FALLEN').length;
  const survivalRate = totalSoldiers > 0 ? Math.round((activeSoldiers / totalSoldiers) * 100) : 100;

  // Check if user already checked in today
  const todayStr = new Date().toISOString().split('T')[0];
  const hasCheckedInToday = userSoldier?.dailyCheckIns.includes(todayStr);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Frontline Hero Banner */}
      <div className="relative rounded-2xl bg-neutral-900/90 border border-amber-900/40 p-6 sm:p-8 overflow-hidden shadow-2xl tactical-grid">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold">
                <Radio className="w-3.5 h-3.5 animate-pulse text-amber-400" />
                WAR ROOM // ACTIVE THEATER OF OPERATIONS
              </div>
              <h1 className="text-3xl sm:text-5xl font-stencil uppercase tracking-wide text-neutral-100">
                OPERATION CLEAN SLATE: <span className="text-amber-400">NNN-2026</span>
              </h1>
              <p className="text-xs sm:text-sm font-mono-code text-neutral-400 max-w-2xl">
                Front line discipline console. 30 days of unyielding perimeter defense. Enlist as a soldier, confess tactical failures with honesty, and earn your Medal of Honor upon surviving November 30.
              </p>
            </div>

            {/* Quick Emergency Red Phone CTA */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={onOpenPanicProtocol}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-stencil text-sm tracking-wider uppercase flex items-center justify-center gap-2 shadow-xl shadow-rose-950/80 animate-pulse cursor-pointer border border-rose-500/60"
              >
                <AlertTriangle className="w-4 h-4 text-rose-300" />
                RED PHONE: TEMPTATION DEFUSAL
              </button>
            </div>
          </div>

          {/* Countdown Clock to Nov 30 23:59:59 */}
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono-code uppercase tracking-wider text-amber-500 font-bold">
                  COUNTDOWN TO MEDAL OF HONOR CONFERRAL
                </div>
                <div className="text-xs font-mono-code text-neutral-400">
                  {isVictoryPeriod ? 'NOVEMBER 30 CONQUERED // MEDALS UNLOCKED' : 'SURVIVAL DEADLINE: NOV 30, 23:59:59'}
                </div>
              </div>
            </div>

            {/* Countdown Digits */}
            {isVictoryPeriod ? (
              <div 
                onClick={onGoToMedals}
                className="cursor-pointer px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500 text-amber-300 font-stencil text-base flex items-center gap-2 hover:bg-amber-500/30 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                VICTORY DAY ACTIVE // CLAIM YOUR MEDAL
                <ChevronRight className="w-4 h-4" />
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-4 font-mono-code">
                <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg min-w-[55px]">
                  <div className="text-xl sm:text-2xl font-stencil text-amber-400">{timeLeft.days}</div>
                  <div className="text-[9px] text-neutral-500 uppercase">DAYS</div>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg min-w-[55px]">
                  <div className="text-xl sm:text-2xl font-stencil text-amber-400">{timeLeft.hours}</div>
                  <div className="text-[9px] text-neutral-500 uppercase">HOURS</div>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg min-w-[55px]">
                  <div className="text-xl sm:text-2xl font-stencil text-amber-400">{timeLeft.minutes}</div>
                  <div className="text-[9px] text-neutral-500 uppercase">MINS</div>
                </div>
                <span className="text-amber-500 font-bold">:</span>
                <div className="text-center bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg min-w-[55px]">
                  <div className="text-xl sm:text-2xl font-stencil text-amber-400">{timeLeft.seconds}</div>
                  <div className="text-[9px] text-neutral-500 uppercase">SECS</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Vital Frontline Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Survival Rate */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono-code">
            <span className="uppercase font-semibold">TRENCH SURVIVAL RATE</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-stencil text-emerald-400">{survivalRate}%</div>
          <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
            <div 
              className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${survivalRate}%` }} 
            />
          </div>
          <div className="text-[11px] font-mono-code text-neutral-500">
            {activeSoldiers} of {totalSoldiers} troops holding perimeter
          </div>
        </div>

        {/* 2. Active Soldiers */}
        <div 
          onClick={onGoToEnlist}
          className="bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/50 p-5 rounded-xl space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono-code">
            <span className="uppercase font-semibold">ACTIVE COMBATANTS</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-stencil text-neutral-100">{activeSoldiers}</div>
          <div className="text-[11px] font-mono-code text-amber-400 flex items-center gap-1">
            <span>Enlist or view service record</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. Fallen Casualties */}
        <div 
          onClick={onGoToMemorial}
          className="bg-neutral-900/90 border border-neutral-800 hover:border-rose-900/80 p-5 rounded-xl space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono-code">
            <span className="uppercase font-semibold text-rose-400">FALLEN IN ACTION (KIA)</span>
            <Skull className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-stencil text-rose-400">{fallenSoldiers}</div>
          <div className="text-[11px] font-mono-code text-neutral-400 flex items-center gap-1">
            <span>Read What, Why & How reports</span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
          </div>
        </div>

        {/* 4. Medals Available */}
        <div 
          onClick={onGoToMedals}
          className="bg-neutral-900/90 border border-neutral-800 hover:border-yellow-500/50 p-5 rounded-xl space-y-2 cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400 text-xs font-mono-code">
            <span className="uppercase font-semibold text-yellow-400">MEDALS OF HONOR</span>
            <Award className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-3xl font-stencil text-yellow-400">5 ORDERS</div>
          <div className="text-[11px] font-mono-code text-neutral-400 flex items-center gap-1">
            <span>{isVictoryPeriod ? 'Bestowed to survivors' : 'Conferred after Nov 30'}</span>
            <ChevronRight className="w-3.5 h-3.5 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Main Section: Daily Roll Call / Enlistment & Battalions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Morning Roll Call Card or Enlistment Prompt */}
        <div className="lg:col-span-7 space-y-6">
          {userSoldier ? (
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-5">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-code text-amber-500 tracking-wider uppercase font-semibold">
                    DAILY COMBAT VIGILANCE
                  </span>
                  <h2 className="text-lg font-stencil text-neutral-100 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    MORNING ROLL CALL // {userSoldier.rank} {userSoldier.callsign}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono-code text-neutral-400">STREAK: </span>
                  <span className="text-sm font-stencil text-amber-400">{userSoldier.daysSurvived} DAYS</span>
                </div>
              </div>

              {checkInMessage && (
                <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-mono-code flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  {checkInMessage}
                </div>
              )}

              {userSoldier.status === 'FALLEN' ? (
                <div className="bg-rose-950/30 border border-rose-900/50 p-4 rounded-lg space-y-2 text-xs font-mono-code text-rose-300">
                  <div className="font-bold flex items-center gap-2">
                    <Skull className="w-4 h-4 text-rose-400" /> SOLDIER STATUS: DISHONORABLY DISCHARGED (KIA)
                  </div>
                  <p>
                    You have surrendered your perimeter and submitted your casualty debrief. Your record is engraved in the Wall of the Fallen. Stand by your comrades in the Memorial.
                  </p>
                  <button
                    onClick={onGoToMemorial}
                    className="mt-2 px-3 py-1.5 rounded bg-rose-900 text-white font-mono-code text-xs uppercase"
                  >
                    View Fallen Memorial
                  </button>
                </div>
              ) : hasCheckedInToday ? (
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-lg space-y-2 text-xs font-mono-code text-emerald-300">
                  <div className="font-bold flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> MORNING ROLL CALL LOGGED FOR TODAY
                  </div>
                  <p className="text-neutral-400">
                    Your mental defenses are intact. Keep your phone out of the bedroom tonight. If temptations surge, deploy the Panic Protocol immediately.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRollCallSubmit} className="space-y-4">
                  {/* Fortitude rating slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono-code mb-1">
                      <label className="text-neutral-300 font-semibold">
                        MENTAL FORTITUDE RATING: {fortitudeRating}%
                      </label>
                      <span className="text-emerald-400 font-bold">
                        {fortitudeRating >= 80 ? 'HIGH READINESS' : fortitudeRating >= 50 ? 'TIRED BUT STEADFAST' : 'DANGER ZONE'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={fortitudeRating}
                      onChange={(e) => setFortitudeRating(parseInt(e.target.value, 10))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  {/* Daily drills checkboxes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <label className="flex items-center gap-2.5 p-2.5 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono-code text-neutral-300 cursor-pointer hover:border-neutral-700">
                      <input
                        type="checkbox"
                        checked={tookColdShower}
                        onChange={(e) => setTookColdShower(e.target.checked)}
                        className="rounded bg-neutral-900 border-neutral-700 text-sky-500 focus:ring-0"
                      />
                      <span className="flex items-center gap-1.5">
                        <Droplets className="w-3.5 h-3.5 text-sky-400" /> Cold Shower Deployed
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-2.5 rounded bg-neutral-950 border border-neutral-800 text-xs font-mono-code text-neutral-300 cursor-pointer hover:border-neutral-700">
                      <input
                        type="checkbox"
                        checked={didPushups}
                        onChange={(e) => setDidPushups(e.target.checked)}
                        className="rounded bg-neutral-900 border-neutral-700 text-amber-500 focus:ring-0"
                      />
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> 25+ Pushups Completed
                      </span>
                    </label>
                  </div>

                  {/* Notes from the front lines */}
                  <div>
                    <label className="block text-xs font-mono-code text-neutral-400 mb-1">
                      NOTES FROM THE FRONT LINES (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      value={combatNotes}
                      onChange={(e) => setCombatNotes(e.target.value)}
                      placeholder="e.g. Defeated a 2 AM urge. Mind feels crisp."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-xs text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-stencil font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-neutral-950" />
                    CONFIRM ROLL CALL: STILL STANDING
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Prompt to Enlist */
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border-2 border-dashed border-amber-500/50 rounded-2xl p-6 sm:p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-stencil text-neutral-100 uppercase tracking-wide">
                  JOIN THE BATTALION: ENLIST AS A SOLDIER
                </h3>
                <p className="text-xs font-mono-code text-neutral-400 max-w-md mx-auto">
                  You are currently unassigned. Enlist to forge your custom stamped military dog tag, join an active battalion, and qualify for the Medal of Honor after November 30.
                </p>
              </div>

              <button
                onClick={onGoToEnlist}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-neutral-950 font-stencil font-black text-sm uppercase tracking-wider flex items-center gap-2 mx-auto shadow-lg shadow-amber-950/60 cursor-pointer transition-all"
              >
                <span>REPORT TO RECRUITMENT OFFICE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Emergency Failure Button for active soldiers */}
          {userSoldier && userSoldier.status === 'ACTIVE' && (
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-mono-code font-bold text-neutral-300">
                  DID YOUR DEFENSIVE PERIMETER COLLAPSE?
                </div>
                <div className="text-[11px] font-mono-code text-neutral-500">
                  Honesty is the only path forward. Confess what, why, and how you fell.
                </div>
              </div>
              <button
                onClick={onOpenCasualtyModal}
                className="px-3.5 py-2 rounded-lg bg-neutral-900 border border-rose-900 hover:border-rose-600 text-rose-400 text-xs font-mono-code font-bold uppercase cursor-pointer transition-colors"
              >
                I Have Fallen
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Active Battalions Defense Grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-xs font-mono-code font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" /> BATTALION FRONTLINE STANDINGS
              </h3>
              <span className="text-[10px] font-mono-code text-neutral-500">6 SECTORS</span>
            </div>

            <div className="space-y-3">
              {[
                { name: '1st Armored Ironclads', active: 4, fallen: 1, focus: 'Device Safe' },
                { name: '3rd Cold Shower Commandos', active: 3, fallen: 1, focus: 'Cold Water' },
                { name: '7th Midnight Watchdogs', active: 2, fallen: 1, focus: 'Night Patrol' },
                { name: '12th Zen Monks Division', active: 3, fallen: 0, focus: 'Meditation' },
                { name: '82nd Airborne Push-Up Corps', active: 2, fallen: 0, focus: 'Push-ups' },
                { name: 'Ghost Recon 404 Vanguard', active: 2, fallen: 1, focus: 'DNS Blocker' },
              ].map((b) => {
                const total = b.active + b.fallen;
                const pct = Math.round((b.active / total) * 100);

                return (
                  <div key={b.name} className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-1">
                    <div className="flex justify-between items-center text-xs font-mono-code">
                      <span className="font-bold text-neutral-200">{b.name}</span>
                      <span className="text-neutral-400 text-[11px]">{pct}% standing</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-500 h-full rounded-full" 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono-code text-neutral-500">
                      <span>Focus: {b.focus}</span>
                      <span>{b.active} active / {b.fallen} KIA</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Combat Activity Ticker */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-mono-code font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-500" /> TACTICAL WIRE (RECENT LOGS)
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400">ENCRYPTED</span>
            </div>

            <div className="space-y-2 text-xs font-mono-code">
              <div className="p-2 rounded bg-neutral-950 border-l-2 border-rose-500 text-neutral-300">
                <span className="text-rose-400 font-bold">[CASUALTY]</span> Pvt. DoomScroller99 fell on Day 1. Trigger: Instagram Reels algorithm.
              </div>
              <div className="p-2 rounded bg-neutral-950 border-l-2 border-emerald-500 text-neutral-300">
                <span className="text-emerald-400 font-bold">[ROLL CALL]</span> Staff Sgt. IronGrip confirmed Day 2 morning roll call. Fortitude 95%.
              </div>
              <div className="p-2 rounded bg-neutral-950 border-l-2 border-sky-500 text-neutral-300">
                <span className="text-sky-400 font-bold">[INTERVENTION]</span> Lt. SubZero deployed 2-min sub-zero hydrotherapy. Threat neutralized.
              </div>
              <div className="p-2 rounded bg-neutral-950 border-l-2 border-yellow-500 text-neutral-300">
                <span className="text-yellow-400 font-bold">[ORDER]</span> High Command begins forging the Grand Sovereign Medal of Diamond Will for survivors.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
