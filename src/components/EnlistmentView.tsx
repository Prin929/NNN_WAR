import React, { useState } from 'react';
import { 
  Shield, 
  Flame, 
  Snowflake, 
  Zap, 
  Eye, 
  Crown, 
  Award, 
  CheckCircle2, 
  UserPlus, 
  RotateCcw, 
  Share2, 
  Printer, 
  AlertOctagon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Soldier, SoldierRank, BattalionName } from '../types';
import { enlistUser } from '../utils/storage';
import { playSaluteSound, playRadioClick } from '../utils/audio';

interface EnlistmentViewProps {
  userSoldier: Soldier | null;
  onEnlisted: (soldier: Soldier) => void;
  onGoToHQ: () => void;
  onOpenCasualtyModal: () => void;
}

const RANKS: SoldierRank[] = [
  'Recruit',
  'Private',
  'Corporal',
  'Sergeant',
  'Staff Sergeant',
  'Lieutenant',
  'Captain',
  'Major',
  'Colonel',
  'General of Iron Will'
];

const BATTALIONS: { name: BattalionName; desc: string; specialty: string }[] = [
  {
    name: '1st Armored Ironclads',
    desc: 'Heavy defense perimeter. Phone locked in another room before 10 PM.',
    specialty: 'Device Lockdown & Safe Storage'
  },
  {
    name: '3rd Cold Shower Commandos',
    desc: 'Rapid thermal shock troopers. When urges strike, deploy sub-zero water.',
    specialty: 'Glacial Hydrotherapy'
  },
  {
    name: '7th Midnight Watchdogs',
    desc: 'Nocturnal sentinels trained to detect algorithmic thirst traps between 11 PM and 4 AM.',
    specialty: 'Night Patrol & Bluelight Defense'
  },
  {
    name: '12th Zen Monks Division',
    desc: 'Mindfulness and meditative stoicism. Observe urges without attaching reaction.',
    specialty: 'Mental Fortitude & Breathing'
  },
  {
    name: '82nd Airborne Push-Up Corps',
    desc: 'Whenever temptation flares, immediately drop and hammer out 30 push-ups.',
    specialty: 'Kinetic Energy Redirection'
  },
  {
    name: 'Ghost Recon 404 Vanguard',
    desc: 'Deep stealth operatives. DNS blocklists, greyscale phone screens, social media blackouts.',
    specialty: 'Digital Countermeasures'
  }
];

const EMBLEMS = [
  { id: 'Shield', label: 'Shield', icon: Shield },
  { id: 'Flame', label: 'Flame', icon: Flame },
  { id: 'Snowflake', label: 'Glacier', icon: Snowflake },
  { id: 'Zap', label: 'Lightning', icon: Zap },
  { id: 'Eye', label: 'Vigilance', icon: Eye },
  { id: 'Crown', label: 'Sovereign', icon: Crown }
];

const BLOOD_TYPES = [
  'Caffeine Positive (O+)',
  'Sub-Zero Ice Water',
  'Black Coffee Unfiltered',
  '100% Whey Isolate',
  'Matcha Green Tea',
  'Pure Stoic Willpower'
];

export const EnlistmentView: React.FC<EnlistmentViewProps> = ({
  userSoldier,
  onEnlisted,
  onGoToHQ,
  onOpenCasualtyModal
}) => {
  const [callsign, setCallsign] = useState('');
  const [name, setName] = useState('');
  const [rank, setRank] = useState<SoldierRank>('Private');
  const [battalion, setBattalion] = useState<BattalionName>('1st Armored Ironclads');
  const [motto, setMotto] = useState('Discipline equals absolute freedom.');
  const [bloodType, setBloodType] = useState('Caffeine Positive (O+)');
  const [avatarIcon, setAvatarIcon] = useState('Shield');
  const [rubberSilencer, setRubberSilencer] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callsign.trim()) return;

    playSaluteSound();
    const newSoldier = enlistUser({
      callsign,
      name: name || callsign,
      rank,
      battalion,
      motto,
      bloodType,
      avatarIcon
    });

    onEnlisted(newSoldier);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const currentDisplaySoldier = userSoldier || {
    callsign: callsign || 'RECRUIT_CALLSIGN',
    name: name || 'OPERATIVE NAME',
    rank: rank,
    battalion: battalion,
    motto: motto || 'Standing strong in the trenches.',
    bloodType: bloodType,
    avatarIcon: avatarIcon,
    serialNumber: 'NNN-2026-####',
    status: 'ACTIVE',
    daysSurvived: 2,
    enlistedAt: new Date().toISOString()
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono-code font-bold uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" /> DEPARTMENT OF FRONTLINE ENLISTMENT
        </div>
        <h1 className="text-3xl sm:text-4xl font-stencil uppercase tracking-wide text-neutral-100">
          {userSoldier ? 'SOLDIER SERVICE RECORD & DOG TAG' : 'ENLIST FOR OPERATION CLEAN SLATE'}
        </h1>
        <p className="text-sm font-mono-code text-neutral-400 max-w-2xl mx-auto">
          {userSoldier 
            ? 'Your official military dossier is recorded in the operational database. Guard your perimeter.'
            : 'Swear the oath of November. Receive your custom military dog tag, join a combat battalion, and prepare for the 30-day trial of iron will.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form or Enlisted Dossier Actions */}
        <div className="lg:col-span-7 space-y-6">
          {!userSoldier ? (
            <form onSubmit={handleSubmit} className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-5">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <h2 className="text-sm font-mono-code font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> ENLISTMENT QUESTIONNAIRE
                </h2>
                <span className="text-[11px] font-mono-code text-neutral-500">MANDATORY RECRUITMENT</span>
              </div>

              {/* Callsign & Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                    TACTICAL CALLSIGN <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    placeholder="e.g. IronGhost, SubZero, TrenchViper"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                    SOLDIER NAME / ALIAS
                  </label>
                  <input
                    type="text"
                    maxLength={30}
                    placeholder="e.g. Marcus Cole"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-600"
                  />
                </div>
              </div>

              {/* Rank & Blood Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                    MILITARY RANK
                  </label>
                  <select
                    value={rank}
                    onChange={(e) => setRank(e.target.value as SoldierRank)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {RANKS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                    FUEL / BLOOD TYPE
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {BLOOD_TYPES.map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Battalion Selection */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                  CHOOSE COMBAT BATTALION
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {BATTALIONS.map((b) => (
                    <div
                      key={b.name}
                      onClick={() => setBattalion(b.name)}
                      className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                        battalion === b.name
                          ? 'bg-amber-950/30 border-amber-500/80 text-amber-200'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-mono-code text-xs font-bold text-neutral-200 flex items-center justify-between">
                        <span>{b.name}</span>
                        {battalion === b.name && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-snug">{b.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Battle Cry / Motto */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                  BATTLE CRY / MOTTO
                </label>
                <input
                  type="text"
                  maxLength={60}
                  value={motto}
                  onChange={(e) => setMotto(e.target.value)}
                  placeholder="e.g. Pain is temporary, clean slate is eternal."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 placeholder:text-neutral-600"
                />
              </div>

              {/* Emblem / Avatar */}
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-semibold mb-1">
                  INSIGNIA EMBLEM
                </label>
                <div className="flex flex-wrap gap-2">
                  {EMBLEMS.map(({ id, label, icon: IconComp }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setAvatarIcon(id)}
                      className={`px-3 py-1.5 rounded border text-xs font-mono-code flex items-center gap-1.5 transition-all ${
                        avatarIcon === id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rubber Silencer toggle */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-xs font-mono-code text-neutral-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rubberSilencer}
                    onChange={(e) => setRubberSilencer(e.target.checked)}
                    className="rounded bg-neutral-900 border-neutral-700 text-amber-500 focus:ring-0"
                  />
                  Equip Tactical Rubber Dog Tag Silencer (Stealth Mode)
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-stencil font-black text-lg tracking-wider uppercase shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Shield className="w-5 h-5 text-neutral-950" />
                SWEAR OATH & ENLIST IN TRENCHES
              </button>
            </form>
          ) : (
            /* Already Enlisted Service Record Dashboard */
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-6">
              <div className="border-b border-neutral-800 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono-code text-amber-500 tracking-wider uppercase font-semibold">
                    ACTIVE SERVICE DOSSIER
                  </span>
                  <h2 className="text-xl font-stencil text-neutral-100 flex items-center gap-2">
                    {userSoldier.rank} {userSoldier.callsign}
                  </h2>
                </div>
                <div className={`px-2.5 py-1 rounded text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  userSoldier.status === 'ACTIVE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : userSoldier.status === 'VICTORIOUS'
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                }`}>
                  {userSoldier.status === 'ACTIVE' && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                  {userSoldier.status === 'ACTIVE' ? 'ACTIVE IN TRENCHES' : userSoldier.status === 'VICTORIOUS' ? 'MEDAL OF HONOR RECIPIENT' : 'KILLED IN ACTION (KIA)'}
                </div>
              </div>

              {/* Combat Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-lg text-center">
                  <div className="text-[10px] font-mono-code text-neutral-500 uppercase">DAYS SURVIVED</div>
                  <div className="text-2xl font-stencil text-amber-400">{userSoldier.daysSurvived} / 30</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-lg text-center">
                  <div className="text-[10px] font-mono-code text-neutral-500 uppercase">BATTALION</div>
                  <div className="text-xs font-mono-code font-bold text-neutral-200 mt-1 truncate">{userSoldier.battalion.split(' ')[1]}</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-lg text-center">
                  <div className="text-[10px] font-mono-code text-neutral-500 uppercase">MORNING CALLS</div>
                  <div className="text-2xl font-stencil text-emerald-400">{userSoldier.dailyCheckIns.length}</div>
                </div>
                <div className="bg-neutral-950 border border-neutral-800/80 p-3 rounded-lg text-center">
                  <div className="text-[10px] font-mono-code text-neutral-500 uppercase">MEDALS EARNED</div>
                  <div className="text-2xl font-stencil text-yellow-400">{userSoldier.medalsAwarded.length}</div>
                </div>
              </div>

              {/* Motto quote */}
              <div className="bg-amber-950/20 border-l-2 border-amber-500 p-3 rounded-r text-xs font-mono-code text-amber-300 italic">
                "{userSoldier.motto}"
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={onGoToHQ}
                  className="flex-1 min-w-[140px] py-2.5 px-4 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 font-mono-code font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  Return to HQ War Room
                  <ChevronRight className="w-4 h-4" />
                </button>

                {userSoldier.status === 'ACTIVE' && (
                  <button
                    onClick={onOpenCasualtyModal}
                    className="py-2.5 px-4 rounded-lg bg-rose-950/50 border border-rose-800 hover:bg-rose-900 text-rose-300 font-mono-code font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    Report Casualty (I Failed)
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="py-2.5 px-4 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono-code text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  {copiedLink ? 'Link Copied!' : 'Share Dossier'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: High-Fidelity 3D-styled Military Dog Tag & ID Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-center">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-amber-500 font-bold">
              OFFICIAL MILITARY IDENTIFICATION & DOG TAG
            </span>
          </div>

          {/* Dog Tag Chain & Plate Mockup */}
          <div className="relative flex flex-col items-center">
            {/* Metal Ball Chain Visual */}
            <div className="w-1.5 h-12 bg-gradient-to-b from-neutral-600 via-neutral-300 to-neutral-500 rounded-full shadow-sm mb-1 flex flex-col items-center justify-between">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 border border-neutral-600 -mt-1 shadow" />
              <div className="w-2 h-2 rounded-full bg-neutral-400 -mb-1 shadow" />
            </div>

            {/* Brushed Metal Dog Tag */}
            <div 
              className={`w-full max-w-sm rounded-[24px] p-5 shadow-2xl transition-all relative overflow-hidden ${
                rubberSilencer 
                  ? 'border-[5px] border-neutral-900 bg-gradient-to-br from-neutral-300 via-neutral-400 to-neutral-300 text-neutral-900 shadow-neutral-950/80 ring-1 ring-neutral-700' 
                  : 'border border-neutral-400 bg-gradient-to-br from-neutral-200 via-neutral-300 to-neutral-400 text-neutral-900'
              }`}
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4), transparent 60%)'
              }}
            >
              {/* Authentic Tag Notch on Left */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-6 bg-neutral-950 rounded-r-full shadow-inner" />

              {/* Tag Chain Hole */}
              <div className="w-4 h-4 rounded-full bg-neutral-950 border border-neutral-500 shadow-inner mx-auto mb-3" />

              {/* Stamped Text with Authentic Inset Effect */}
              <div 
                className="font-mono-code text-xs uppercase font-extrabold tracking-wider space-y-1.5 text-neutral-900 select-all"
                style={{
                  textShadow: '0.5px 0.5px 0px rgba(255,255,255,0.8), -0.5px -0.5px 0px rgba(0,0,0,0.4)'
                }}
              >
                <div className="flex justify-between items-center border-b border-neutral-500/30 pb-1">
                  <span>US-NNN COMMAND</span>
                  <span className="text-[10px] tracking-normal font-bold bg-neutral-900/10 px-1 rounded">2026-OPS</span>
                </div>

                <div className="pt-1">
                  <div className="text-[10px] text-neutral-600 font-bold">CALLSIGN:</div>
                  <div className="text-base font-black tracking-widest text-neutral-950">{currentDisplaySoldier.callsign}</div>
                </div>

                <div>
                  <div className="text-[10px] text-neutral-600 font-bold">RANK & NAME:</div>
                  <div className="text-xs font-bold text-neutral-950">{currentDisplaySoldier.rank} - {currentDisplaySoldier.name}</div>
                </div>

                <div>
                  <div className="text-[10px] text-neutral-600 font-bold">BATTALION:</div>
                  <div className="text-[11px] font-bold text-neutral-900 truncate">{currentDisplaySoldier.battalion}</div>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1">
                  <div>
                    <div className="text-[9px] text-neutral-600 font-bold">BLOOD/FUEL:</div>
                    <div className="text-[10px] font-bold">{currentDisplaySoldier.bloodType.split(' ')[0]}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-neutral-600 font-bold">SERIAL NO:</div>
                    <div className="text-[10px] font-bold">{currentDisplaySoldier.serialNumber}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-500/30 flex items-center justify-between text-[9px] text-neutral-700">
                  <span>STATUS: {currentDisplaySoldier.status}</span>
                  <span>MEDAL ELIGIBLE: NOV 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Enlistment Lore Card */}
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4 text-xs font-mono-code text-neutral-400 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Sparkles className="w-4 h-4" /> THE SACRED OATH OF NOVEMBER
            </div>
            <p className="text-[11px] leading-relaxed">
              "I solemnly swear to defend my perimeter, ignore algorithmic sirens in the dead of night, take cold showers without hesitation, and keep my rifle clean. Should I fall, I will submit my after-action report with complete truth. If I stand on November 30, I will proudly wear the Medal of Honor."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
