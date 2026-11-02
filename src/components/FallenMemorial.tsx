import React, { useState } from 'react';
import { 
  Skull, 
  Heart, 
  MessageSquare, 
  AlertTriangle, 
  ShieldAlert, 
  Filter, 
  Search, 
  Flame, 
  Calendar,
  Sparkles,
  BarChart3,
  ThumbsUp
} from 'lucide-react';
import { CasualtyReport, Soldier } from '../types';
import { saluteCasualty } from '../utils/storage';
import { playSaluteSound, playBugleTaps } from '../utils/audio';
import { INTEL_STATISTICS } from '../utils/mockData';

interface FallenMemorialProps {
  casualtyReports: CasualtyReport[];
  userSoldier: Soldier | null;
  onRefreshData: () => void;
  onOpenCasualtyModal: () => void;
}

export const FallenMemorial: React.FC<FallenMemorialProps> = ({
  casualtyReports,
  userSoldier,
  onRefreshData,
  onOpenCasualtyModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<'recent' | 'salutes' | 'regret'>('recent');
  const [salutingId, setSalutingId] = useState<string | null>(null);

  const handleSalute = (reportId: string) => {
    playSaluteSound();
    setSalutingId(reportId);
    saluteCasualty(reportId);
    setTimeout(() => {
      onRefreshData();
      setSalutingId(null);
    }, 150);
  };

  // Filter & Sort
  const filteredReports = casualtyReports
    .filter((report) => {
      const matchesSearch = 
        report.soldierCallsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.whatDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.whyRootCause.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.lastWords.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedFilter === 'ALL') return true;
      return report.whatTrigger.toLowerCase().includes(selectedFilter.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'salutes') return b.salutes - a.salutes;
      if (sortBy === 'regret') return b.regretLevel - a.regretLevel;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const totalCasualties = casualtyReports.length;
  const totalSalutes = casualtyReports.reduce((acc, r) => acc + r.salutes, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Memorial Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono-code font-bold uppercase tracking-widest">
          <Skull className="w-3.5 h-3.5" /> MEMORIAL OF THE FALLEN // COURT MARTIAL ARCHIVES
        </div>
        <h1 className="text-3xl sm:text-4xl font-stencil uppercase tracking-wide text-neutral-100 flex items-center justify-center gap-3">
          <span>THE WALL OF CASUALTIES</span>
        </h1>
        <p className="text-sm font-mono-code text-neutral-400 max-w-2xl mx-auto">
          Every brother listed here fell in battle. Read their tactical debriefs (What, Why, and How), learn from their lapses, and pay respects with a crisp salute.
        </p>

        {/* Action button to report failure */}
        {userSoldier && userSoldier.status === 'ACTIVE' && (
          <div className="pt-2">
            <button
              onClick={onOpenCasualtyModal}
              className="px-4 py-2 rounded-lg bg-rose-950/70 border border-rose-700 text-rose-300 font-mono-code text-xs font-bold uppercase hover:bg-rose-900 transition-colors inline-flex items-center gap-2 shadow-lg shadow-rose-950/40 cursor-pointer"
            >
              <Skull className="w-4 h-4 text-rose-400" />
              Did You Fall? Submit Your Tactical Confession
            </button>
          </div>
        )}
      </div>

      {/* Top Threat Intel & Memorial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-neutral-900/90 border border-rose-900/40 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 shrink-0">
            <Skull className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono-code text-neutral-400 uppercase">TOTAL FALLEN RECORDED</div>
            <div className="text-2xl font-stencil text-rose-400">{totalCasualties} SOLDIERS</div>
            <div className="text-[11px] font-mono-code text-neutral-500">Perimeter surrendered</div>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-950/50 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono-code text-neutral-400 uppercase">RESPECTS PAID (SALUTES)</div>
            <div className="text-2xl font-stencil text-amber-400">{totalSalutes} o7 SALUTES</div>
            <div className="text-[11px] font-mono-code text-neutral-500">Frontline brotherhood intact</div>
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-neutral-950 border border-neutral-750 flex items-center justify-center text-rose-400 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono-code text-neutral-400 uppercase">DEADLIEST LETHAL SECTOR</div>
            <div className="text-sm font-mono-code font-bold text-rose-300">23:00 - 03:00 HOURS</div>
            <div className="text-[11px] font-mono-code text-neutral-500">Late night bedroom phone trap</div>
          </div>
        </div>
      </div>

      {/* Tactical Threat Intelligence Chart */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h2 className="text-xs font-mono-code font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-500" /> TACTICAL THREAT INTELLIGENCE (TOP CAUSES OF FAILURE)
          </h2>
          <span className="text-[10px] font-mono-code text-neutral-500">BASED ON AAR DEBRIEFS</span>
        </div>

        <div className="space-y-3">
          {INTEL_STATISTICS.map((item) => (
            <div key={item.category} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono-code">
                <span className="text-neutral-300 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    item.severity === 'CRITICAL' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  {item.category}
                </span>
                <span className="text-neutral-400 font-bold">{item.percentage}% of casualties</span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    item.severity === 'CRITICAL' ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-amber-600 to-amber-400'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-neutral-900/60 border border-neutral-800 p-3 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fallen soldier, trigger, excuse..."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 font-mono-code focus:border-rose-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-lg p-1 text-xs font-mono-code">
            <span className="text-neutral-500 px-1 text-[11px]">SORT:</span>
            <button
              onClick={() => setSortBy('recent')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortBy === 'recent' ? 'bg-neutral-800 text-rose-400 font-bold' : 'text-neutral-400'
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setSortBy('salutes')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortBy === 'salutes' ? 'bg-neutral-800 text-amber-400 font-bold' : 'text-neutral-400'
              }`}
            >
              Most Saluted
            </button>
            <button
              onClick={() => setSortBy('regret')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortBy === 'regret' ? 'bg-neutral-800 text-rose-400 font-bold' : 'text-neutral-400'
              }`}
            >
              Highest Regret
            </button>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="space-y-6">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-2">
            <Skull className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="text-sm font-mono-code text-neutral-400 uppercase font-bold">NO CASUALTIES FOUND</h3>
            <p className="text-xs text-neutral-500 font-mono-code">Try adjusting your search criteria.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report.id}
              className="bg-neutral-900/90 border border-neutral-800 hover:border-rose-900/60 transition-all rounded-xl overflow-hidden shadow-xl"
            >
              {/* Card Header: Fallen Soldier Details */}
              <div className="bg-neutral-950/80 border-b border-neutral-800/80 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-rose-950/60 border border-rose-800/80 flex items-center justify-center text-rose-400 font-bold">
                    <Skull className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-stencil text-base text-neutral-100 tracking-wide">
                        {report.soldierRank} {report.soldierCallsign}
                      </span>
                      <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800/60 font-bold">
                        FALLEN DAY {report.dayOfFailure}
                      </span>
                    </div>
                    <div className="text-xs font-mono-code text-neutral-500">
                      Battalion: {report.soldierBattalion}
                    </div>
                  </div>
                </div>

                {/* Right: Regret Meter & Salute CTA */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-mono-code text-neutral-500 uppercase">REGRET RATING</div>
                    <div className="text-xs font-mono-code font-bold text-rose-400">
                      {report.regretLevel}/10 {report.regretLevel >= 9 ? '🔥 MAX' : ''}
                    </div>
                  </div>

                  {/* Press F to Pay Respects / Salute Button */}
                  <button
                    onClick={() => handleSalute(report.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono-code font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer ${
                      report.userSaluted
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/20'
                        : 'bg-neutral-950 border-neutral-750 text-neutral-300 hover:border-amber-500/60 hover:text-amber-400'
                    }`}
                    title="Press to salute fallen brother (Plays sound & logs honor)"
                  >
                    <span>o7</span>
                    <span>SALUTE</span>
                    <span className="bg-neutral-900/80 px-1.5 py-0.5 rounded text-[11px] text-amber-400 font-mono-code">
                      {report.salutes}
                    </span>
                  </button>
                </div>
              </div>

              {/* Card Body: What, Why, How Tactical Breakdown */}
              <div className="p-5 space-y-4">
                {/* WHAT */}
                <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-lg p-3.5 space-y-1">
                  <div className="text-[10px] font-mono-code text-rose-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                    1. WHAT CAUSED THE BREACH: {report.whatTrigger}
                  </div>
                  <p className="text-xs font-mono-code text-neutral-200 leading-relaxed">
                    "{report.whatDescription}"
                  </p>
                </div>

                {/* WHY */}
                <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-lg p-3.5 space-y-1">
                  <div className="text-[10px] font-mono-code text-amber-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    2. WHY DID DISCIPLINE COLLAPSE (ROOT CAUSE):
                  </div>
                  <p className="text-xs font-mono-code text-neutral-300 leading-relaxed">
                    "{report.whyRootCause}"
                  </p>
                </div>

                {/* HOW */}
                <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-lg p-3.5 space-y-1">
                  <div className="text-[10px] font-mono-code text-sky-400 uppercase tracking-widest font-black flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-sky-400" />
                    3. HOW IT WENT DOWN (TACTICAL TIMELINE):
                  </div>
                  <p className="text-xs font-mono-code text-neutral-300 leading-relaxed">
                    {report.howTacticalSequence}
                  </p>
                </div>

                {/* LAST WORDS */}
                <div className="border-t border-neutral-800/80 pt-3 flex items-start gap-2 text-xs font-mono-code text-neutral-400 italic">
                  <MessageSquare className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-neutral-300 not-italic">Last words to surviving brothers: </strong>
                    "{report.lastWords}"
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
