export type Screen = 'splash' | 'main-menu' | 'settings' | 'scorekeeper' | 'database' | 'stats' | 'ecosystem' | 'my-profile' | 'people-directory' | 'team-profile' | 'roster-builder' | 'free-agency' | 'calendar' | 'lineup-builder';

export interface Team {
  id: string;
  clubId: string;
  divisionId: string;
  seasonId: string;
  parentTeamId?: string;
  name?: string;
}

export interface Roster {
  id: string;
  personId: string;
  teamId: string;
  seasonId: string;
}

export interface User {
  id: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Player' | 'Fan';
  personId?: string;
}

export interface Person {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  birthdate?: string;
  email?: string;
  phone?: string;
}

export interface PersonJob {
  id: string;
  personId: string;
  clubId: string;
  title: string;
  role: string; // e.g. Coach, Manager
}

export interface PlayerProfile {
  id: string;
  personId: string;
  height?: string;
  weight?: string;
  handedness?: 'Left' | 'Right';
  status?: string; // e.g. Active, Free Agent
}

export interface PlayerEquipment {
  id: string;
  personId: string;
  stickBrand?: string;
  skateBrand?: string;
  helmetBrand?: string;
}

export interface Player {
  id: string;
  number: string;
  name: string;
  position?: string;
}

export interface ScheduledGame {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location?: string;
  competition?: string;
  matchType?: string;
  homeRoster?: Player[];
  awayRoster?: Player[];
}

export interface EcosystemEvent {
  id: string;
  venueId?: string;
  seasonId?: string;
  phaseId?: string;
  eventType: 'Game' | 'Practice' | 'Event';
  homeTeamId?: string;
  awayTeamId?: string;
  tournamentMode?: boolean;
  date: string;
  time: string;
}

export interface RSVP {
  eventId: string;
  personId: string;
  status: 'Attending' | 'Not Attending' | 'Maybe';
}

export interface Lineup {
  eventId: string;
  personId: string;
  teamId: string;
  unitType: 'Even Strength' | 'PK1' | 'PK2' | 'PP1' | 'PP2' | 'Starting Goalie' | 'Backup Goalie' | string;
}

export interface GameSettings {
  periodLength: number; // in seconds
  trackIcing: boolean;
  trackOffside: boolean;
  trackSOG: boolean;

  officialGame: boolean;
  gameType: string;
  attendance: number;
  ticketsSold: number;

  liveGame: boolean;
  teamSelection: string;
  allowFillInPlayers: boolean;

  gameClock: boolean;
  clockPauseBehavior: string;
  autoStopAtPeriodEnd: string;
  periodFormat: string;
  shootout: boolean;
  soRules: string;

  trackSOGLocation: boolean;
  trackFOW: boolean;
  faceoffLocation: boolean;
  goalscorer: boolean;
  assists: string;

  trackPenalties: boolean;
  penaltyClock: string;
  durationTypes: string;

  officialsMode: string;
  linesmenMode: string;
  venueMode: string;
  capacity: number;
  avgPrice: number;

  haptics: boolean;
  stayAwake: boolean;
  autosave: boolean;
  localStorageEnabled: boolean;
  autogenerateCSV: boolean;
}

export interface GameConfig {
  homeTeam: string;
  awayTeam: string;
  homeColor?: string;
  awayColor?: string;
  homeLogo?: string;
  awayLogo?: string;
  homeRoster?: Player[];
  awayRoster?: Player[];
  date?: string;
  time?: string;
  location?: string;
  competition?: string;
  matchType?: string;
  officials?: string[];
  linesmen?: string[];
  initialScoreHome?: number;
  initialScoreAway?: number;
  initialSogHome?: number;
  initialSogAway?: number;
  initialPeriod?: number;
  settings: GameSettings;
}

export type EventType = 'shot' | 'goal' | 'penalty' | 'faceoff' | 'icing' | 'offside';

export interface GameEvent {
  id: string;
  type: EventType;
  team: string;
  time: string;
  text: string;
  x?: number;
  y?: number;
  isHistorical?: boolean;
  isUndone?: boolean;
  scorer?: string;
  assist1?: string;
  assist2?: string;
  penaltyReason?: string;
  penaltyMinutes?: number;
  period?: string;
  clockTime?: string;
  situation?: string;
  player?: string;
}

export interface ActivePenalty {
  id: string;
  eventId?: string;
  team: string;
  player: string;
  reason: string;
  minutes: number;
  secondsRemaining: number;
}

export interface GameState {
  isRunning: boolean;
  period: number;
  timeRemaining: number;
  stoppageTime: number;
  sogHome: number;
  sogAway: number;
  scoreHome: number;
  scoreAway: number;
  events: GameEvent[];
  activePenalties?: ActivePenalty[];
}
