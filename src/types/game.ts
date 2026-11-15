export type ContextCategory = 'enunciato' | 'mappa' | 'architettura' | 'sport';

export type PlayerRole = 'player1' | 'player2';

export interface ErrorOption {
  id: string;
  text: string;
}

export interface PresetLabValues {
  a: number;
  b: number;
  unit: string;
  labelA: string;
  labelB: string;
  labelC: string;
  mode?: 'hypotenuse' | 'leg';
}

export interface ScenarioModule {
  id: string;
  index: number;
  title: string;
  aiParagraph: string;
  suspiciousSnippets: string[];
  errorClaimOptions: ErrorOption[];
  correctErrorClaimId: string;
  correctionOptions: ErrorOption[];
  correctCorrectionId: string;
  manualRefId: string;
  positiveHint: string;
  encouragementOnMiss: string;
  explanationOnDefuse: string;
  presetLabValues?: PresetLabValues;
}

export interface ScenarioDiagramConfig {
  type: 'triangle' | 'city_map' | 'ladder_ramp' | 'sports_screen';
  caption: string;
  sampleA: number;
  sampleB: number;
  unit: string;
}

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  context: ContextCategory;
  difficulty: 'Base' | 'Intermedio' | 'Sfida';
  isAiGenerated?: boolean;
  briefingForPlayer1: string;
  briefingForPlayer2: string;
  diagramConfig: ScenarioDiagramConfig;
  modules: ScenarioModule[];
}

export interface VerificationFeedback {
  type: 'success' | 'miss' | 'hint';
  moduleId: string;
  title: string;
  message: string;
  pointsDelta?: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  criteria: string;
}

export type RoomPhase = 'lobby' | 'playing' | 'round_summary';

export interface GameRoomState {
  roomCode: string;
  scenarioId: string;
  scenario: Scenario;
  round: 1 | 2;
  phase: RoomPhase;
  timeLeft: number; // seconds, starts at 300 (5 minutes)
  durationSeconds: number;
  lives: number;
  maxLives: number;
  score: number;
  streak: number;
  defusedModuleIds: string[];
  hintedModuleIds: string[];
  attemptsByModule: Record<string, number>;
  roleAssignments: {
    seatA: PlayerRole;
    seatB: PlayerRole;
  };
  connectedSeats: {
    player1Connected: boolean;
    player2Connected: boolean;
  };
  lastFeedback: VerificationFeedback | null;
  unlockedBadges: string[];
}

export interface PairMatchRecord {
  id: string;
  dateLabel: string;
  pairName: string;
  scenarioTitle: string;
  score: number;
  defusedCount: number;
  livesLeft: number;
  round: number;
}
