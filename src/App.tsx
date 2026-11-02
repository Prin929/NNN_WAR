import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  CommandHQ 
} from './components/CommandHQ';
import { 
  EnlistmentView 
} from './components/EnlistmentView';
import { 
  FallenMemorial 
} from './components/FallenMemorial';
import { 
  MedalsVault 
} from './components/MedalsVault';
import { 
  CasualtyReportModal 
} from './components/CasualtyReportModal';
import { 
  TemptationDefusal 
} from './components/TemptationDefusal';
import { 
  Soldier, 
  CasualtyReport 
} from './types';
import { 
  getUserSoldier, 
  getAllSoldiers, 
  getAllCasualtyReports, 
  getSimulatedDay, 
  setSimulatedDay as saveSimulatedDay 
} from './utils/storage';
import { 
  Shield, 
  Skull, 
  Award, 
  Flame, 
  Heart 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hq' | 'enlist' | 'memorial' | 'medals' | 'panic'>('hq');
  const [userSoldier, setUserSoldier] = useState<Soldier | null>(null);
  const [soldiers, setSoldiers] = useState<Soldier[]>([]);
  const [casualtyReports, setCasualtyReports] = useState<CasualtyReport[]>([]);
  const [simulatedDay, setSimulatedDayState] = useState<number>(2);

  // Modals
  const [isCasualtyModalOpen, setIsCasualtyModalOpen] = useState(false);
  const [isPanicModalOpen, setIsPanicModalOpen] = useState(false);

  const loadData = () => {
    setUserSoldier(getUserSoldier());
    setSoldiers(getAllSoldiers());
    setCasualtyReports(getAllCasualtyReports());
    setSimulatedDayState(getSimulatedDay());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSetSimulatedDay = (day: number) => {
    saveSimulatedDay(day);
    setSimulatedDayState(day);
    loadData();
  };

  const handleEnlisted = (soldier: Soldier) => {
    setUserSoldier(soldier);
    loadData();
    setActiveTab('hq');
  };

  const handleCasualtySubmitted = () => {
    loadData();
    setActiveTab('memorial');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-mono-code scanline-bg relative selection:bg-amber-500/30 selection:text-amber-200">
      {/* Tactical Ambient Glow Overlays */}
      <div className="fixed inset-0 pointer-events-none camo-gradient opacity-30 z-0" />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'panic') {
            setIsPanicModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        userSoldier={userSoldier}
        simulatedDay={simulatedDay}
        setSimulatedDay={handleSetSimulatedDay}
        onOpenCasualtyModal={() => setIsCasualtyModalOpen(true)}
        onOpenPanicProtocol={() => setIsPanicModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10 pb-16">
        {activeTab === 'hq' && (
          <CommandHQ
            userSoldier={userSoldier}
            soldiers={soldiers}
            casualtyReports={casualtyReports}
            simulatedDay={simulatedDay}
            setSimulatedDay={handleSetSimulatedDay}
            onGoToEnlist={() => setActiveTab('enlist')}
            onGoToMemorial={() => setActiveTab('memorial')}
            onGoToMedals={() => setActiveTab('medals')}
            onOpenCasualtyModal={() => setIsCasualtyModalOpen(true)}
            onOpenPanicProtocol={() => setIsPanicModalOpen(true)}
            onRefreshData={loadData}
          />
        )}

        {activeTab === 'enlist' && (
          <EnlistmentView
            userSoldier={userSoldier}
            onEnlisted={handleEnlisted}
            onGoToHQ={() => setActiveTab('hq')}
            onOpenCasualtyModal={() => setIsCasualtyModalOpen(true)}
          />
        )}

        {activeTab === 'memorial' && (
          <FallenMemorial
            casualtyReports={casualtyReports}
            userSoldier={userSoldier}
            onRefreshData={loadData}
            onOpenCasualtyModal={() => setIsCasualtyModalOpen(true)}
          />
        )}

        {activeTab === 'medals' && (
          <MedalsVault
            userSoldier={userSoldier}
            soldiers={soldiers}
            simulatedDay={simulatedDay}
            setSimulatedDay={handleSetSimulatedDay}
            onRefreshData={loadData}
          />
        )}
      </main>

      {/* Interactive Modals */}
      <CasualtyReportModal
        userSoldier={userSoldier}
        isOpen={isCasualtyModalOpen}
        onClose={() => setIsCasualtyModalOpen(false)}
        onReportSubmitted={handleCasualtySubmitted}
      />

      <TemptationDefusal
        isOpen={isPanicModalOpen}
        onClose={() => setIsPanicModalOpen(false)}
      />

      {/* Military Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/95 py-6 px-4 relative z-10 text-xs font-mono-code text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-neutral-400">
            <Shield className="w-4 h-4 text-amber-500" />
            <span className="font-stencil text-amber-400 font-bold uppercase tracking-wider">
              OPERATION CLEAN SLATE // NNN COMMAND
            </span>
            <span className="text-neutral-600">|</span>
            <span className="text-[11px]">DISCIPLINE CITADEL 2026</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-500">
            <span>SURVIVE PAST NOV 30</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">MEDALS OF HONOR GUARANTEED</span>
            <span>•</span>
            <span className="text-rose-400 font-bold">HONOR THE FALLEN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
