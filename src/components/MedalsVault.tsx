import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Crown, 
  ShieldAlert, 
  Droplets, 
  Sparkles, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Star, 
  Calendar,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Soldier, Medal } from '../types';
import { MEDALS_CATALOG } from '../utils/mockData';
import { playMedalFanfare, playSaluteSound } from '../utils/audio';

interface MedalsVaultProps {
  userSoldier: Soldier | null;
  soldiers: Soldier[];
  simulatedDay: number;
  setSimulatedDay: (day: number) => void;
  onRefreshData: () => void;
}

export const MedalsVault: React.FC<MedalsVaultProps> = ({
  userSoldier,
  soldiers,
  simulatedDay,
  setSimulatedDay,
  onRefreshData
}) => {
  const [selectedMedal, setSelectedMedal] = useState<Medal>(MEDALS_CATALOG[0]);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const isPostNovember30 = simulatedDay > 30;

  // Trigger celebration on entering victory period
  useEffect(() => {
    if (isPostNovember30 && !hasCelebrated) {
      setHasCelebrated(true);
      playMedalFanfare();
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#d97706', '#ffffff']
        });
      } catch {
        // Fallback
      }
    }
  }, [isPostNovember30, hasCelebrated]);

  const handlePrintCertificate = () => {
    window.print();
  };

  // Survivors are soldiers who haven't fallen
  const survivors = soldiers.filter(s => s.status !== 'FALLEN');

  // Check which medals user qualifies for
  const userHasSurvivingStatus = userSoldier && userSoldier.status !== 'FALLEN';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-mono-code font-bold uppercase tracking-widest ${
          isPostNovember30
            ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
            : 'bg-neutral-900 border-neutral-750 text-neutral-400'
        }`}>
          <Award className="w-4 h-4 text-amber-400" />
          {isPostNovember30 
            ? 'HIGH COMMAND CITATION // MEDALS OF HONOR CONFERRED' 
            : 'ARMORY VAULT // OPERATION CLEAN SLATE MEDALS'}
        </div>

        <h1 className="text-3xl sm:text-5xl font-stencil uppercase tracking-wide text-neutral-100 flex items-center justify-center gap-3">
          <span>HALL OF HEROES: MEDALS OF HONOR</span>
        </h1>

        <p className="text-sm font-mono-code text-neutral-400 max-w-2xl mx-auto">
          {isPostNovember30
            ? 'November 30 has passed. The smoke has cleared. The survivors who held the citadel unbroken for 30 days are hereby decorated with the highest military orders.'
            : 'Per Military Orders: Official Medals of Honor are formally forged and awarded upon surviving past 23:59:59 November 30. Preview the armory decorations below.'}
        </p>

        {/* Date Mode Switcher if in November */}
        {!isPostNovember30 && (
          <div className="pt-2">
            <button
              onClick={() => {
                setSimulatedDay(31);
                playMedalFanfare();
              }}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-neutral-950 font-stencil font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 flex items-center gap-2 mx-auto cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              FAST-FORWARD TO VICTORY DAY (TEST MEDAL AWARDING CEREMONY)
            </button>
          </div>
        )}
      </div>

      {/* If November 30 has passed -> Victory Ceremony Banner */}
      {isPostNovember30 && (
        <div className="bg-gradient-to-r from-amber-950/60 via-yellow-950/40 to-amber-950/60 border-2 border-amber-500/80 rounded-2xl p-6 text-center space-y-4 shadow-2xl shadow-amber-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Crown className="w-36 h-36 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 text-neutral-950 font-stencil text-xs uppercase font-black">
            <Star className="w-4 h-4" /> VICTORY DAY // 30-DAY VETERAN CONFERRAL
          </div>

          <h2 className="text-2xl sm:text-3xl font-stencil text-amber-300 uppercase tracking-wider">
            {userHasSurvivingStatus 
              ? `HAIL TO THE VICTOR: ${userSoldier.rank} ${userSoldier.callsign}`
              : 'HONORING THE VALIANT SURVIVORS WHO CONQUERED NOVEMBER'}
          </h2>

          <p className="text-xs sm:text-sm font-mono-code text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            {userHasSurvivingStatus
              ? 'You stood against every urge, ignored every late-night screen, and completed 30 consecutive days of iron discipline. By decree of High Command, your Medal of Honor is pinned to your chest.'
              : userSoldier && userSoldier.status === 'FALLEN'
              ? 'Your soldier fell during combat operations and has received the Fallen Soldier Memorial ribbon. Surviving veterans are honored below.'
              : 'Enlist or check your profile to see your survival decoration.'}
          </p>

          {/* Quick Confetti Re-fire */}
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                playMedalFanfare();
                confetti({
                  particleCount: 100,
                  spread: 70,
                  origin: { y: 0.6 },
                  colors: ['#f59e0b', '#fbbf24', '#ffffff']
                });
              }}
              className="px-4 py-2 rounded bg-amber-500/20 border border-amber-500/60 hover:bg-amber-500/30 text-amber-300 text-xs font-mono-code font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Re-Sound Victory Fanfare
            </button>
            <button
              onClick={() => setSimulatedDay(2)}
              className="px-4 py-2 rounded bg-neutral-900 border border-neutral-750 hover:text-white text-neutral-400 text-xs font-mono-code uppercase transition-colors cursor-pointer"
            >
              Return to Active November 2
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Medals Catalog & Selected Medal Citation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Medals Showcase Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <h2 className="text-xs font-mono-code font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4" /> OPERATION CLEAN SLATE DECORATIONS ({MEDALS_CATALOG.length})
            </h2>
            <span className="text-[11px] font-mono-code text-neutral-500">SELECT TO INSPECT CITATION</span>
          </div>

          <div className="space-y-3">
            {MEDALS_CATALOG.map((medal) => {
              const isSelected = selectedMedal.id === medal.id;
              const isUnlocked = isPostNovember30 
                ? (userSoldier && userSoldier.status !== 'FALLEN')
                : (medal.id !== 'diamond-will-supreme');

              return (
                <div
                  key={medal.id}
                  onClick={() => {
                    playSaluteSound();
                    setSelectedMedal(medal);
                  }}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-4 ${
                    isSelected
                      ? 'bg-amber-950/30 border-amber-500/80 shadow-lg shadow-amber-950/40'
                      : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {/* Ribbon & Medal visual representation */}
                  <div className="flex flex-col items-center shrink-0">
                    {/* Ribbon Bar */}
                    <div className="w-12 h-4 rounded-xs flex overflow-hidden border border-neutral-900 shadow">
                      {medal.ribbonColors.map((c, i) => (
                        <div key={i} className="h-full flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>

                    {/* Medal Pendant */}
                    <div className={`w-10 h-10 -mt-1 rounded-full flex items-center justify-center border shadow-md ${
                      medal.tier === 'Supreme'
                        ? 'bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 border-amber-300 text-neutral-950'
                        : medal.tier === 'Gold'
                        ? 'bg-gradient-to-br from-yellow-400 to-amber-600 border-yellow-300 text-neutral-950'
                        : medal.tier === 'Silver'
                        ? 'bg-gradient-to-br from-slate-200 to-slate-400 border-white text-neutral-950'
                        : 'bg-gradient-to-br from-amber-700 to-neutral-800 border-amber-600 text-amber-200'
                    }`}>
                      {medal.tier === 'Supreme' ? (
                        <Crown className="w-5 h-5 text-neutral-950" />
                      ) : (
                        <Award className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Medal Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-stencil text-sm text-neutral-100 truncate">
                        {medal.title}
                      </span>
                      <span className={`text-[9px] font-mono-code font-bold px-1.5 py-0.2 rounded uppercase ${
                        medal.tier === 'Supreme'
                          ? 'bg-amber-500 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-300'
                      }`}>
                        {medal.tier}
                      </span>
                    </div>
                    <div className="text-xs font-mono-code text-amber-400/90 mt-0.5">
                      {medal.tagline}
                    </div>
                    <p className="text-[11px] font-mono-code text-neutral-400 mt-1 line-clamp-1">
                      {medal.criteria}
                    </p>
                  </div>

                  {/* Lock / Unlock Status */}
                  <div className="shrink-0 text-right">
                    {isPostNovember30 && userHasSurvivingStatus ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> AWARDED
                      </span>
                    ) : isPostNovember30 && userSoldier?.status === 'FALLEN' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-rose-400">
                        <Lock className="w-3.5 h-3.5 text-rose-400" /> FALLEN (KIA)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono-code text-neutral-500">
                        <Clock className="w-3.5 h-3.5" /> NOV 30
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Frontline Survivors Hall of Honor List */}
          <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h3 className="text-xs font-mono-code font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> ACTIVE SURVIVORS ROSTER ({survivors.length})
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400">
                {isPostNovember30 ? 'SURVIVED 30 DAYS' : 'CURRENTLY STANDING'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {survivors.map((s) => (
                <div key={s.id} className="p-2.5 rounded bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono-code font-bold text-neutral-200">
                      {s.rank} {s.callsign} {s.isUser && <span className="text-amber-400 font-normal">(YOU)</span>}
                    </div>
                    <div className="text-[10px] font-mono-code text-neutral-500">{s.battalion.split(' ')[1]}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono-code text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">
                      {isPostNovember30 ? 'MEDAL BESTOWED' : `DAY ${s.daysSurvived}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Printable / Shareable Official Medal of Honor Citation Certificate */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-500 font-bold">
              OFFICIAL PRESIDENTIAL CITATION & DIPLOMA
            </span>
            <button
              onClick={handlePrintCertificate}
              className="px-3 py-1.5 rounded bg-neutral-900 border border-neutral-750 hover:border-amber-500 text-neutral-300 hover:text-amber-300 text-xs font-mono-code flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print Certificate
            </button>
          </div>

          {/* Certificate Document with Formal Military Certificate Styling */}
          <div 
            id="printable-certificate"
            className="bg-neutral-950 border-4 border-double border-amber-500/70 rounded-2xl p-6 sm:p-8 space-y-6 text-center relative overflow-hidden shadow-2xl shadow-amber-950/40"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.05) 0%, transparent 80%)'
            }}
          >
            {/* Top Ornamental Seal */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/80 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
                <Crown className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono-code tracking-[0.25em] text-amber-500 font-bold uppercase">
                UNITED STATES DEPARTMENT OF OPERATION NO NUT NOVEMBER
              </div>
              <h3 className="text-xl sm:text-2xl font-stencil text-neutral-100 uppercase tracking-widest mt-1">
                CONFERRAL OF THE MEDAL OF HONOR
              </h3>
              <div className="text-xs font-mono-code text-neutral-400 uppercase mt-0.5">
                ESTABLISHED UNDER WAR DEPARTMENT GENERAL ORDERS // 2026
              </div>
            </div>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />

            {/* Recipient Soldier Info */}
            <div className="space-y-1">
              <div className="text-[11px] font-mono-code text-neutral-400 uppercase">THIS HIGHEST DECORATION IS BESTOWED UPON</div>
              <div className="text-2xl sm:text-3xl font-stencil text-amber-400 tracking-wider">
                {userSoldier ? `${userSoldier.rank} ${userSoldier.callsign}` : 'SOLDIER OF OPERATION CLEAN SLATE'}
              </div>
              <div className="text-xs font-mono-code text-neutral-300">
                {userSoldier ? userSoldier.battalion : '1st Armored Ironclads'} • SERIAL #{userSoldier?.serialNumber || 'NNN-2026-0001'}
              </div>
            </div>

            {/* The Medal Ribbon Representation */}
            <div className="py-2 flex flex-col items-center justify-center">
              <div className="w-20 h-5 rounded flex overflow-hidden border border-neutral-750 shadow-md">
                {selectedMedal.ribbonColors.map((color, i) => (
                  <div key={i} className="h-full flex-1" style={{ backgroundColor: color }} />
                ))}
              </div>
              <div className="text-xs font-mono-code font-bold text-amber-300 mt-2">
                {selectedMedal.title}
              </div>
            </div>

            {/* Official Military Citation Text */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-4 text-xs font-mono-code text-neutral-300 leading-relaxed text-justify sm:text-center italic">
              "{selectedMedal.citation}"
            </div>

            {/* Seal & Signatures Footer */}
            <div className="pt-4 border-t border-amber-900/40 grid grid-cols-2 gap-4 text-left items-end">
              <div>
                <div className="text-[10px] font-mono-code text-neutral-500 uppercase">CONFERRED AT:</div>
                <div className="text-xs font-mono-code font-bold text-neutral-200">
                  {isPostNovember30 ? '00:00 HOURS // DEC 01, 2026' : 'SCHEDULED: DEC 01, 2026'}
                </div>
                <div className="text-[9px] font-mono-code text-emerald-400">STATUS: OFFICIAL RECORD</div>
              </div>

              <div className="text-right">
                <div className="font-stencil text-sm text-amber-400 tracking-wider">GENERAL IRON WILL</div>
                <div className="text-[10px] font-mono-code text-neutral-400 uppercase">SUPREME COMMANDER OF CLEAN SLATE</div>
                <div className="text-[9px] font-mono-code text-neutral-600">SEAL #7749-DISCIPLINE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
