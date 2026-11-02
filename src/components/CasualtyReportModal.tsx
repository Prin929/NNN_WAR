import React, { useState } from 'react';
import { 
  Skull, 
  AlertTriangle, 
  X, 
  Send, 
  HelpCircle, 
  FileText, 
  ArrowRight,
  Flame,
  Volume2
} from 'lucide-react';
import { Soldier } from '../types';
import { submitCasualtyDebrief } from '../utils/storage';
import { playBugleTaps } from '../utils/audio';

interface CasualtyReportModalProps {
  userSoldier: Soldier | null;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: () => void;
}

const COMMON_TRIGGERS = [
  'Instagram Reels / TikTok FYP Thirst Trap Ambush',
  'Late-Night "Are You Awake?" Ex/DM Message',
  'Sunday Afternoon Warm Blanket & Unchecked Boredom',
  'Anime Beach / Hot Springs Episode Fan Service',
  'Bathroom Phone Stagnation with Unrestricted Wi-Fi',
  'Twitter/X Uncensored Explore Feed Misclick',
  'Post-Workout Shower Mental Lapse',
  'Late-Night Gaming Discord NSFW Channel Trap',
  'Sheer Failure of Willpower & Discipline'
];

export const CasualtyReportModal: React.FC<CasualtyReportModalProps> = ({
  userSoldier,
  isOpen,
  onClose,
  onReportSubmitted
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [whatTrigger, setWhatTrigger] = useState(COMMON_TRIGGERS[0]);
  const [whatDescription, setWhatDescription] = useState('');
  const [whyRootCause, setWhyRootCause] = useState('');
  const [howTacticalSequence, setHowTacticalSequence] = useState('');
  const [lastWords, setLastWords] = useState('');
  const [regretLevel, setRegretLevel] = useState(9);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatDescription.trim() || !whyRootCause.trim() || !howTacticalSequence.trim()) {
      return;
    }

    setIsSubmitting(true);
    // Play solemn Taps Bugle
    playBugleTaps();

    submitCasualtyDebrief({
      soldierId: userSoldier?.id || 'anonymous-soldier',
      whatTrigger,
      whatDescription,
      whyRootCause,
      howTacticalSequence,
      lastWords: lastWords.trim() || 'Do not make my mistake, brothers. Stand firm.',
      regretLevel
    });

    setTimeout(() => {
      setIsSubmitting(false);
      onReportSubmitted();
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-neutral-900 border-2 border-rose-900/80 rounded-2xl shadow-2xl shadow-rose-950/60 overflow-hidden text-neutral-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-rose-950/60 border-b border-rose-900/60 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-rose-900/60 border border-rose-600/80 flex items-center justify-center text-rose-300">
              <Skull className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-[10px] font-mono-code text-rose-400 uppercase tracking-widest font-bold">
                INCIDENT REPORT // FORM NNN-KIA-2026
              </div>
              <h2 className="text-lg font-stencil uppercase tracking-wide text-white">
                AFTER-ACTION CASUALTY DEBRIEF
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-rose-950/30 border-b border-rose-900/30 px-6 py-2 flex items-center gap-2 text-xs font-mono-code text-rose-300">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>
            HONESTY REQUIRED: Detail exactly <strong>WHAT</strong>, <strong>WHY</strong>, and <strong>HOW</strong> you fell so surviving troops can reinforce their perimeter.
          </span>
        </div>

        {/* Multi-step progress tabs */}
        <div className="grid grid-cols-4 border-b border-neutral-800 bg-neutral-950/40 text-center text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2 px-1 border-b-2 transition-all ${
              step === 1 ? 'border-rose-500 text-rose-400 font-bold bg-rose-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            1. WHAT
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2 px-1 border-b-2 transition-all ${
              step === 2 ? 'border-rose-500 text-rose-400 font-bold bg-rose-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            2. WHY
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-2 px-1 border-b-2 transition-all ${
              step === 3 ? 'border-rose-500 text-rose-400 font-bold bg-rose-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            3. HOW
          </button>
          <button
            type="button"
            onClick={() => setStep(4)}
            className={`py-2 px-1 border-b-2 transition-all ${
              step === 4 ? 'border-rose-500 text-rose-400 font-bold bg-rose-950/20' : 'border-transparent text-neutral-400'
            }`}
          >
            4. LAST WORDS
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-bold mb-1">
                  TACTICAL TRIGGER CATEGORY
                </label>
                <select
                  value={whatTrigger}
                  onChange={(e) => setWhatTrigger(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-rose-500 focus:outline-none"
                >
                  {COMMON_TRIGGERS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-bold mb-1">
                  WHAT HAPPENED? (THE INCIDENT DETAILS) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={whatDescription}
                  onChange={(e) => setWhatDescription(e.target.value)}
                  placeholder="Describe the exact scene. What app was open? What time was it? What visual or thought breached the citadel?"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-rose-500 focus:outline-none placeholder:text-neutral-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  Next: State WHY <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-mono-code text-neutral-300 font-bold">
                    WHY DID DISCIPLINE COLLAPSE? (ROOT CAUSE) <span className="text-rose-500">*</span>
                  </label>
                </div>
                <p className="text-[11px] text-neutral-400 mb-2 font-mono-code">
                  What mental excuse or vulnerability made you abandon your vow? (e.g., "I told myself 'just one peek won't hurt'", loneliness, sleep deprivation, alcohol, skipped workout).
                </p>
                <textarea
                  required
                  rows={4}
                  value={whyRootCause}
                  onChange={(e) => setWhyRootCause(e.target.value)}
                  placeholder="The lie I told myself was... The emotional state that lowered my guard was..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-rose-500 focus:outline-none placeholder:text-neutral-600"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-2 text-xs font-mono-code text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  Next: State HOW <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-bold mb-1">
                  HOW DID IT GO DOWN? (TACTICAL PLAY-BY-PLAY) <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-neutral-400 mb-2 font-mono-code">
                  Break down the chronological collapse: From initial impulse to perimeter collapse.
                </p>
                <textarea
                  required
                  rows={4}
                  value={howTacticalSequence}
                  onChange={(e) => setHowTacticalSequence(e.target.value)}
                  placeholder="Phase 1: Laid in bed browsing -> Phase 2: Trigger appeared -> Phase 3: Brain rationalized failure -> Phase 4: Full perimeter surrender."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-rose-500 focus:outline-none placeholder:text-neutral-600"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-3 py-2 text-xs font-mono-code text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono-code font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                >
                  Next: Last Words & Regret <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono-code text-neutral-300 font-bold mb-1">
                  LAST WORDS TO SURVIVING BROTHERS IN TRENCHES
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={lastWords}
                  onChange={(e) => setLastWords(e.target.value)}
                  placeholder="e.g. Leave your phone in the kitchen! Do your pushups! Avenge me!"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 font-mono-code focus:border-rose-500 focus:outline-none placeholder:text-neutral-600"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-mono-code text-neutral-300 font-bold">
                    REGRET / PAIN LEVEL: {regretLevel} / 10
                  </label>
                  <span className="text-[11px] font-mono-code text-rose-400 font-semibold">
                    {regretLevel >= 9 ? 'EXISTENTIAL AGONY' : regretLevel >= 7 ? 'DEEP DISHONOR' : 'MILD REMORSE'}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={regretLevel}
                  onChange={(e) => setRegretLevel(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Solemn tribute notice */}
              <div className="bg-neutral-950 border border-neutral-800 p-3 rounded text-xs font-mono-code text-neutral-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Upon submission, "Taps" bugle will sound. Your name will be permanently engraved on the Wall of the Fallen.</span>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-3 py-2 text-xs font-mono-code text-neutral-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-600 hover:to-rose-800 text-white font-stencil font-bold text-sm uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-rose-950/80 cursor-pointer transition-all"
                >
                  <Skull className="w-4 h-4 text-rose-300" />
                  {isSubmitting ? 'ENGRAVING CASUALTY...' : 'CONFESS & SURRENDER STATUS (KIA)'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
