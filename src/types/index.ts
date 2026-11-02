export type SoldierRank = 
  | 'Recruit'
  | 'Private'
  | 'Corporal'
  | 'Sergeant'
  | 'Staff Sergeant'
  | 'Master Sergeant'
  | 'Lieutenant'
  | 'Captain'
  | 'Major'
  | 'Colonel'
  | 'General of Iron Will';

export type SoldierStatus = 'ACTIVE' | 'FALLEN' | 'VICTORIOUS';

export type BattalionName = 
  | '1st Armored Ironclads'
  | '3rd Cold Shower Commandos'
  | '7th Midnight Watchdogs'
  | '12th Zen Monks Division'
  | '82nd Airborne Push-Up Corps'
  | 'Ghost Recon 404 Vanguard';

export interface Soldier {
  id: string;
  callsign: string;
  name: string;
  rank: SoldierRank;
  battalion: BattalionName;
  motto: string;
  enlistedAt: string;
  status: SoldierStatus;
  daysSurvived: number;
  salutesReceived: number;
  isUser: boolean;
  avatarIcon: string;
  bloodType: string;
  serialNumber: string;
  dailyCheckIns: string[];
  casualtyReport?: CasualtyReport;
  medalsAwarded: string[];
}

export interface CasualtyReport {
  id: string;
  soldierId: string;
  soldierCallsign: string;
  soldierRank: SoldierRank;
  soldierBattalion: BattalionName;
  dayOfFailure: number;
  timestamp: string;
  whatTrigger: string;
  whatDescription: string;
  whyRootCause: string;
  howTacticalSequence: string;
  lastWords: string;
  regretLevel: number; // 1 - 10
  salutes: number;
  userSaluted?: boolean;
}

export interface Medal {
  id: string;
  title: string;
  tier: 'Supreme' | 'Gold' | 'Silver' | 'Bronze' | 'Special';
  ribbonColors: string[];
  icon: string;
  tagline: string;
  citation: string;
  description: string;
  criteria: string;
}

export interface DailyCheckInLog {
  date: string;
  dayNumber: number;
  fortitudeRating: number;
  notes: string;
  completedColdShower: boolean;
  completedPushups: boolean;
}

export interface IntelStatistic {
  category: string;
  percentage: number;
  count: number;
  severity: 'HIGH' | 'CRITICAL' | 'MODERATE';
  icon: string;
}
