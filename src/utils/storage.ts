import { Soldier, CasualtyReport, Medal, BattalionName, SoldierRank } from '../types';
import { INITIAL_SOLDIERS, INITIAL_CASUALTY_REPORTS, MEDALS_CATALOG } from './mockData';

const STORAGE_KEY_SOLDIERS = 'nnn_soldiers_v2';
const STORAGE_KEY_USER_ID = 'nnn_user_soldier_id';
const STORAGE_KEY_CASUALTIES = 'nnn_casualties_v2';
const STORAGE_KEY_SIMULATED_DAY = 'nnn_simulated_day';
const STORAGE_KEY_SALUTED_IDS = 'nnn_saluted_reports';

export function getSimulatedDay(): number {
  if (typeof window === 'undefined') return 2;
  const saved = localStorage.getItem(STORAGE_KEY_SIMULATED_DAY);
  if (saved !== null) {
    return parseInt(saved, 10);
  }
  // Default to day 2 of November
  return 2;
}

export function setSimulatedDay(day: number): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SIMULATED_DAY, day.toString());
}

export function getAllSoldiers(): Soldier[] {
  if (typeof window === 'undefined') return INITIAL_SOLDIERS;
  const raw = localStorage.getItem(STORAGE_KEY_SOLDIERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_SOLDIERS, JSON.stringify(INITIAL_SOLDIERS));
    return INITIAL_SOLDIERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_SOLDIERS;
  }
}

export function saveAllSoldiers(soldiers: Soldier[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_SOLDIERS, JSON.stringify(soldiers));
}

export function getAllCasualtyReports(): CasualtyReport[] {
  if (typeof window === 'undefined') return INITIAL_CASUALTY_REPORTS;
  const raw = localStorage.getItem(STORAGE_KEY_CASUALTIES);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY_CASUALTIES, JSON.stringify(INITIAL_CASUALTY_REPORTS));
    return INITIAL_CASUALTY_REPORTS;
  }
  try {
    const list: CasualtyReport[] = JSON.parse(raw);
    const saluted = getSalutedReportIds();
    return list.map(r => ({
      ...r,
      userSaluted: saluted.includes(r.id)
    }));
  } catch {
    return INITIAL_CASUALTY_REPORTS;
  }
}

export function saveAllCasualtyReports(reports: CasualtyReport[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY_CASUALTIES, JSON.stringify(reports));
}

export function getUserSoldier(): Soldier | null {
  const userId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_USER_ID) : null;
  if (!userId) return null;
  const soldiers = getAllSoldiers();
  return soldiers.find(s => s.id === userId && s.isUser) || null;
}

export function enlistUser(data: {
  callsign: string;
  name: string;
  rank: SoldierRank;
  battalion: BattalionName;
  motto: string;
  bloodType: string;
  avatarIcon: string;
}): Soldier {
  const currentDay = getSimulatedDay();
  const serialSuffix = Math.floor(1000 + Math.random() * 9000);
  const newSoldier: Soldier = {
    id: `user-soldier-${Date.now()}`,
    callsign: data.callsign.trim() || 'GhostViper',
    name: data.name.trim() || 'Operative',
    rank: data.rank || 'Private',
    battalion: data.battalion || '1st Armored Ironclads',
    motto: data.motto.trim() || 'Never back down, never surrender.',
    enlistedAt: new Date().toISOString(),
    status: currentDay > 30 ? 'VICTORIOUS' : 'ACTIVE',
    daysSurvived: Math.min(currentDay, 30),
    salutesReceived: 0,
    isUser: true,
    avatarIcon: data.avatarIcon || 'Shield',
    bloodType: data.bloodType || 'Caffeine Positive',
    serialNumber: `NNN-2026-${serialSuffix}`,
    dailyCheckIns: [new Date().toISOString().split('T')[0]],
    medalsAwarded: currentDay > 30 ? ['diamond-will-supreme', 'immaculate-roll-call', 'brotherhood-sentinel'] : []
  };

  const soldiers = getAllSoldiers();
  // Remove any previous user soldier
  const filtered = soldiers.filter(s => !s.isUser);
  filtered.unshift(newSoldier);
  saveAllSoldiers(filtered);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_USER_ID, newSoldier.id);
  }

  return newSoldier;
}

export function checkInSoldier(soldierId: string): { success: boolean; message: string; soldier?: Soldier } {
  const soldiers = getAllSoldiers();
  const index = soldiers.findIndex(s => s.id === soldierId);
  if (index === -1) return { success: false, message: 'Soldier not found in roster.' };

  const soldier = soldiers[index];
  if (soldier.status === 'FALLEN') {
    return { success: false, message: 'Soldier has fallen in action. Cannot check in.' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (soldier.dailyCheckIns.includes(todayStr)) {
    return { success: false, message: 'Already completed morning roll call for today! Standing guard.' };
  }

  soldier.dailyCheckIns.push(todayStr);
  const simulatedDay = getSimulatedDay();
  soldier.daysSurvived = Math.min(30, Math.max(soldier.daysSurvived, simulatedDay));

  // Check if eligible for check-in medal
  if (soldier.dailyCheckIns.length >= 3 && !soldier.medalsAwarded.includes('immaculate-roll-call')) {
    soldier.medalsAwarded.push('immaculate-roll-call');
  }

  soldiers[index] = soldier;
  saveAllSoldiers(soldiers);
  return { success: true, message: 'Roll call confirmed! Fortitude intact. Carry on soldier!', soldier };
}

export function submitCasualtyDebrief(params: {
  soldierId: string;
  whatTrigger: string;
  whatDescription: string;
  whyRootCause: string;
  howTacticalSequence: string;
  lastWords: string;
  regretLevel: number;
}): { success: boolean; report: CasualtyReport } {
  const soldiers = getAllSoldiers();
  const soldierIndex = soldiers.findIndex(s => s.id === params.soldierId);
  const simulatedDay = getSimulatedDay();

  let soldierCallsign = 'Unknown Soldier';
  let soldierRank: SoldierRank = 'Private';
  let soldierBattalion: BattalionName = '1st Armored Ironclads';

  if (soldierIndex !== -1) {
    soldiers[soldierIndex].status = 'FALLEN';
    soldierCallsign = soldiers[soldierIndex].callsign;
    soldierRank = soldiers[soldierIndex].rank;
    soldierBattalion = soldiers[soldierIndex].battalion;
    saveAllSoldiers(soldiers);
  }

  const newReport: CasualtyReport = {
    id: `cas-${Date.now()}`,
    soldierId: params.soldierId,
    soldierCallsign,
    soldierRank,
    soldierBattalion,
    dayOfFailure: Math.min(30, Math.max(1, simulatedDay)),
    timestamp: new Date().toISOString(),
    whatTrigger: params.whatTrigger,
    whatDescription: params.whatDescription,
    whyRootCause: params.whyRootCause,
    howTacticalSequence: params.howTacticalSequence,
    lastWords: params.lastWords || 'Remember me, brothers. Keep fighting.',
    regretLevel: params.regretLevel,
    salutes: 1
  };

  const reports = getAllCasualtyReports();
  reports.unshift(newReport);
  saveAllCasualtyReports(reports);

  return { success: true, report: newReport };
}

export function getSalutedReportIds(): string[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEY_SALUTED_IDS);
  return raw ? JSON.parse(raw) : [];
}

export function saluteCasualty(reportId: string): { success: boolean; newCount: number } {
  const saluted = getSalutedReportIds();
  const reports = getAllCasualtyReports();
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) return { success: false, newCount: 0 };

  const already = saluted.includes(reportId);
  if (already) {
    // Un-salute or already counted
    reports[index].salutes = Math.max(0, reports[index].salutes - 1);
    const updated = saluted.filter(id => id !== reportId);
    localStorage.setItem(STORAGE_KEY_SALUTED_IDS, JSON.stringify(updated));
    saveAllCasualtyReports(reports);
    return { success: true, newCount: reports[index].salutes };
  } else {
    reports[index].salutes += 1;
    saluted.push(reportId);
    localStorage.setItem(STORAGE_KEY_SALUTED_IDS, JSON.stringify(saluted));
    saveAllCasualtyReports(reports);

    // If user salutes 3+ comrades, award brotherhood medal
    const user = getUserSoldier();
    if (user && saluted.length >= 3 && !user.medalsAwarded.includes('brotherhood-sentinel')) {
      user.medalsAwarded.push('brotherhood-sentinel');
      const all = getAllSoldiers();
      const uIdx = all.findIndex(s => s.id === user.id);
      if (uIdx !== -1) {
        all[uIdx] = user;
        saveAllSoldiers(all);
      }
    }

    return { success: true, newCount: reports[index].salutes };
  }
}

export function awardMedalToUser(medalId: string): boolean {
  const user = getUserSoldier();
  if (!user) return false;
  if (user.medalsAwarded.includes(medalId)) return true;

  user.medalsAwarded.push(medalId);
  const soldiers = getAllSoldiers();
  const index = soldiers.findIndex(s => s.id === user.id);
  if (index !== -1) {
    soldiers[index] = user;
    saveAllSoldiers(soldiers);
  }
  return true;
}

export function getEligibleMedals(soldier: Soldier, simulatedDay: number): Medal[] {
  return MEDALS_CATALOG.filter(medal => {
    if (medal.id === 'diamond-will-supreme') {
      // Awarded after Nov 30 (day >= 31) and soldier is not fallen!
      return simulatedDay >= 31 && soldier.status !== 'FALLEN';
    }
    if (medal.id === 'titanium-iron-grip') {
      return simulatedDay >= 15 && soldier.daysSurvived >= 15;
    }
    if (medal.id === 'immaculate-roll-call') {
      return soldier.dailyCheckIns.length >= 2;
    }
    if (medal.id === 'brotherhood-sentinel') {
      return soldier.medalsAwarded.includes('brotherhood-sentinel') || getSalutedReportIds().length >= 3;
    }
    if (medal.id === 'cold-shower-commando') {
      return soldier.medalsAwarded.includes('cold-shower-commando');
    }
    return false;
  });
}
