import type { ThemeMode } from '../theme/brand';

export interface CaptionSegment {
  startSec: number;
  endSec: number;
  text: string;
  highlight?: string;
}

export interface StageSegment {
  startSec: number;
  endSec: number;
  mode?: 'stage' | 'dimmed';
  subjectScale?: number;
  subjectOffsetY?: number;
  backdropLabel?: string;
}

export interface CameraZoomSegment {
  startSec: number;
  endSec: number;
  scale?: number;
}

export interface WhipTransitionCue {
  atSec: number;
  direction?: 'left' | 'right' | 'zoom';
}

export interface HookTitleCue {
  type: 'HookTitle';
  startSec: number;
  endSec: number;
  text: string;
  eyebrow?: string;
  variant?: 'pill' | 'bold';
}

export interface DepthGlowTitleCue {
  type: 'DepthGlowTitle';
  startSec: number;
  endSec: number;
  text: string;
  eyebrow?: string;
  accentText?: string;
  yOffset?: number;
  sparkle?: boolean;
}

export interface FloatingChecklistCue {
  type: 'FloatingChecklist';
  startSec: number;
  endSec: number;
  items: string[];
  position?: 'top-left' | 'top-right';
  staggerFrames?: number;
  darkText?: boolean;
}

export interface GlowingArcNode {
  label: string;
  sublabel?: string;
}

export interface GlowingArcTimelineCue {
  type: 'GlowingArcTimeline';
  startSec: number;
  endSec: number;
  nodes: GlowingArcNode[];
  layer?: 'behind' | 'front';
  yOffset?: number;
}

export interface SpotlightLensCutawayCue {
  type: 'SpotlightLensCutaway';
  startSec: number;
  endSec: number;
  headline: string;
  backgroundTerms: string[];
  focusSteps: string[];
}

export interface VectorPropsLayerCue {
  type: 'VectorPropsLayer';
  startSec: number;
  endSec: number;
  propType: 'questions' | 'gears' | 'check-badge' | 'sparkles';
  labels?: string[];
}

export interface KineticBackdropCue {
  type: 'KineticBackdrop';
  startSec: number;
  endSec: number;
  headline: string;
  subline?: string;
  eyebrow?: string;
  accentWord?: string;
}

export interface ThoughtCalloutCue {
  type: 'ThoughtCallout';
  startSec: number;
  endSec: number;
  quote: string;
  tag?: string;
  highlightWord?: string;
}

export interface PointListCardCue {
  type: 'PointListCard';
  startSec: number;
  endSec: number;
  title?: string;
  points: string[];
}

export interface MediaCardCue {
  type: 'MediaCard';
  startSec: number;
  endSec: number;
  src?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  scoreBadge?: string;
}

export interface OutroCTACue {
  type: 'OutroCTA';
  startSec: number;
  endSec: number;
  punchline: string;
  ctaText: string;
  handle?: string;
}

export interface ScoreboardTeam {
  name: string;
  short: string;
  score: number;
  color: string;
  rankDelta?: string;
  logoSrc?: string;
}

export interface ScoreboardCardCue {
  type: 'ScoreboardCard';
  startSec: number;
  endSec: number;
  league: string;
  status: string;
  homeTeam: ScoreboardTeam;
  awayTeam: ScoreboardTeam;
  initialScore?: [number, number];
}

export interface PlayerItem {
  name: string;
  role?: string;
  badge?: string;
  number?: string;
  imageSrc?: string;
  accentColor?: string;
}

export interface PlayerCutoutCardCue {
  type: 'PlayerCutoutCard';
  startSec: number;
  endSec: number;
  players: PlayerItem[];
  subtitle?: string;
}

export interface GoalTimelineEvent {
  minute: string;
  player: string;
  detail: string;
  type: 'goal' | 'sub' | 'concede';
  delaySec?: number;
}

export interface GoalTimelineCue {
  type: 'GoalTimeline';
  startSec: number;
  endSec: number;
  title?: string;
  events: GoalTimelineEvent[];
}

export interface StandingsRow {
  pos: number;
  team: string;
  played: number;
  pts: number;
  highlight?: boolean;
  move?: 'up' | 'down' | 'same';
}

export interface StandingsTableCue {
  type: 'StandingsTable';
  startSec: number;
  endSec: number;
  league: string;
  rows: StandingsRow[];
}

export type CueItem =
  | HookTitleCue
  | DepthGlowTitleCue
  | FloatingChecklistCue
  | GlowingArcTimelineCue
  | SpotlightLensCutawayCue
  | VectorPropsLayerCue
  | KineticBackdropCue
  | ThoughtCalloutCue
  | PointListCardCue
  | MediaCardCue
  | OutroCTACue
  | ScoreboardCardCue
  | PlayerCutoutCardCue
  | GoalTimelineCue
  | StandingsTableCue;

export interface CueSheet {
  id: string;
  title: string;
  videoSrc: string;
  subjectVideoSrc?: string;
  fps: number;
  durationInSeconds: number;
  theme: ThemeMode;
  enableSfx?: boolean;
  captionStyle?: 'sleek' | 'pill';
  stageSegments?: StageSegment[];
  cameraZooms?: CameraZoomSegment[];
  transitions?: WhipTransitionCue[];
  captions: CaptionSegment[];
  cues: CueItem[];
}
