import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  OffthreadVideo,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { DepthGlowTitle } from '../components/core/DepthGlowTitle';
import { DynamicCaptions } from '../components/core/DynamicCaptions';
import { EditorialBackdrop } from '../components/core/EditorialBackdrop';
import { FloatingChecklist } from '../components/core/FloatingChecklist';
import { GlowingArcTimeline } from '../components/core/GlowingArcTimeline';
import { HookTitle } from '../components/core/HookTitle';
import { KineticBackdrop } from '../components/core/KineticBackdrop';
import { MediaCard } from '../components/core/MediaCard';
import { OutroCTA } from '../components/core/OutroCTA';
import { PointListCard } from '../components/core/PointListCard';
import { SleekCursorCaptions } from '../components/core/SleekCursorCaptions';
import { SpotlightLensCutaway } from '../components/core/SpotlightLensCutaway';
import { ThoughtCallout } from '../components/core/ThoughtCallout';
import { VectorPropsLayer } from '../components/core/VectorPropsLayer';
import { WhipBlurTransition } from '../components/core/WhipBlurTransition';
import { GoalTimeline } from '../components/football/GoalTimeline';
import { PlayerCutoutCard } from '../components/football/PlayerCutoutCard';
import { ScoreboardCard } from '../components/football/ScoreboardCard';
import { StandingsTable } from '../components/football/StandingsTable';
import { getBrandTheme, SPRING_STAGE } from '../theme/brand';
import type {
  CameraZoomSegment,
  CueItem,
  CueSheet,
  StageSegment,
} from '../types/cuesheet';

const computeStageState = (
  frame: number,
  fps: number,
  segments: StageSegment[],
) => {
  let maxProgress = 0;
  let activeSegment: StageSegment | undefined;

  for (const seg of segments) {
    const startFrame = Math.round(seg.startSec * fps);
    const endFrame = Math.round(seg.endSec * fps);
    const fadeOutFrames = 14;

    if (frame >= startFrame && frame <= endFrame + fadeOutFrames) {
      const enter = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: SPRING_STAGE,
      });
      const exit =
        frame > endFrame
          ? 1 -
            spring({
              frame: frame - endFrame,
              fps,
              config: SPRING_STAGE,
            })
          : 1;
      const p = Math.max(0, Math.min(1, enter * exit));
      if (p > maxProgress) {
        maxProgress = p;
        activeSegment = seg;
      }
    }
  }

  return { progress: maxProgress, segment: activeSegment };
};

const computeCameraZoom = (
  frame: number,
  fps: number,
  zooms: CameraZoomSegment[],
) => {
  let zoom = 1;
  for (const z of zooms) {
    const startFrame = Math.round(z.startSec * fps);
    const endFrame = Math.round(z.endSec * fps);
    const fadeOut = 12;
    if (frame >= startFrame && frame <= endFrame + fadeOut) {
      const enter = spring({
        frame: Math.max(0, frame - startFrame),
        fps,
        config: SPRING_STAGE,
      });
      const exit =
        frame > endFrame
          ? 1 - spring({ frame: frame - endFrame, fps, config: SPRING_STAGE })
          : 1;
      const target = z.scale ?? 1.07;
      zoom = Math.max(zoom, 1 + (target - 1) * enter * exit);
    }
  }
  return zoom;
};

const getCueSfx = (cue: CueItem): { file: string; volume: number } | null => {
  switch (cue.type) {
    case 'DepthGlowTitle':
    case 'ScoreboardCard':
    case 'PlayerCutoutCard':
    case 'ThoughtCallout':
      return { file: 'sfx/pop.wav', volume: 0.30 };
    case 'FloatingChecklist':
    case 'GlowingArcTimeline':
    case 'GoalTimeline':
    case 'PointListCard':
      return { file: 'sfx/tick.wav', volume: 0.25 };
    case 'SpotlightLensCutaway':
    case 'MediaCard':
      return { file: 'sfx/whoosh.wav', volume: 0.35 };
    case 'OutroCTA':
      return { file: 'sfx/chime.wav', volume: 0.28 };
    case 'VectorPropsLayer':
      return cue.propType === 'check-badge'
        ? { file: 'sfx/chime.wav', volume: 0.28 }
        : { file: 'sfx/pop.wav', volume: 0.26 };
    default:
      return null;
  }
};

export const AgahVideoComposition: React.FC<{ cuesheet: CueSheet }> = ({
  cuesheet,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(cuesheet.theme);

  const { progress: stageProgress, segment: activeStage } = computeStageState(
    frame,
    fps,
    cuesheet.stageSegments ?? [],
  );
  const cameraZoom = computeCameraZoom(frame, fps, cuesheet.cameraZooms ?? []);

  const isDimmedMode = activeStage?.mode === 'dimmed';
  const isEditorialStage = activeStage && !isDimmedMode;

  const targetScale = isDimmedMode ? 1 : (activeStage?.subjectScale ?? 1.0);
  const targetOffsetY = isDimmedMode ? 0 : (activeStage?.subjectOffsetY ?? 540);

  const subjectScale =
    interpolate(stageProgress, [0, 1], [1, targetScale]) * cameraZoom;
  const subjectOffsetY = interpolate(stageProgress, [0, 1], [0, targetOffsetY]);

  const enableSfx = cuesheet.enableSfx ?? true;
  const captionStyle = cuesheet.captionStyle ?? 'sleek';

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Layer 0: Base raw video (master audio + synced camera zoom) */}
      <AbsoluteFill
        style={{
          transform: `scale(${cameraZoom})`,
          transformOrigin: '50% 42%',
        }}
      >
        <OffthreadVideo
          src={staticFile(cuesheet.videoSrc)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {/* Layer 1A: Dark Dimmed Depth Overlay (reference style behind head) */}
      {isDimmedMode && stageProgress > 0.005 && (
        <AbsoluteFill
          style={{
            zIndex: 10,
            opacity: stageProgress,
            backgroundColor: brand.dimmedOverlay,
            backgroundImage:
              'radial-gradient(circle at 50% 25%, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.45) 100%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Layer 1B: Editorial Light-Grey Studio Backdrop (stage mode) */}
      {isEditorialStage && (
        <EditorialBackdrop
          theme={cuesheet.theme}
          opacity={stageProgress}
          label={activeStage?.backdropLabel}
        />
      )}

      {/* Layer 2: Midground Motion Graphics (BEHIND the subject!) */}
      <AbsoluteFill style={{ zIndex: 20, pointerEvents: 'none' }}>
        {cuesheet.cues.map((cue, idx) => {
          if (
            cue.type === 'HookTitle' ||
            cue.type === 'FloatingChecklist' ||
            cue.type === 'SpotlightLensCutaway' ||
            (cue.type === 'GlowingArcTimeline' && cue.layer === 'front')
          ) {
            return null;
          }
          const from = Math.round(cue.startSec * fps);
          const durationInFrames = Math.max(
            1,
            Math.round((cue.endSec - cue.startSec) * fps),
          );

          return (
            <Sequence
              key={`mid-${cue.type}-${idx}`}
              from={from}
              durationInFrames={durationInFrames}
            >
              {cue.type === 'DepthGlowTitle' && (
                <DepthGlowTitle
                  text={cue.text}
                  eyebrow={cue.eyebrow}
                  accentText={cue.accentText}
                  yOffset={cue.yOffset}
                  sparkle={cue.sparkle}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'GlowingArcTimeline' && (
                <GlowingArcTimeline
                  nodes={cue.nodes}
                  yOffset={cue.yOffset}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'VectorPropsLayer' && (
                <VectorPropsLayer
                  propType={cue.propType}
                  labels={cue.labels}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'KineticBackdrop' && (
                <KineticBackdrop
                  headline={cue.headline}
                  subline={cue.subline}
                  eyebrow={cue.eyebrow}
                  accentWord={cue.accentWord}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'ThoughtCallout' && (
                <ThoughtCallout
                  quote={cue.quote}
                  tag={cue.tag}
                  highlightWord={cue.highlightWord}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'PointListCard' && (
                <PointListCard
                  title={cue.title}
                  points={cue.points}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'MediaCard' && (
                <MediaCard
                  src={cue.src}
                  title={cue.title}
                  subtitle={cue.subtitle}
                  badge={cue.badge}
                  scoreBadge={cue.scoreBadge}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'OutroCTA' && (
                <OutroCTA
                  punchline={cue.punchline}
                  ctaText={cue.ctaText}
                  handle={cue.handle}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'ScoreboardCard' && (
                <ScoreboardCard
                  league={cue.league}
                  status={cue.status}
                  homeTeam={cue.homeTeam}
                  awayTeam={cue.awayTeam}
                  initialScore={cue.initialScore}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'PlayerCutoutCard' && (
                <PlayerCutoutCard
                  players={cue.players}
                  subtitle={cue.subtitle}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'GoalTimeline' && (
                <GoalTimeline
                  title={cue.title}
                  events={cue.events}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
              {cue.type === 'StandingsTable' && (
                <StandingsTable
                  league={cue.league}
                  rows={cue.rows}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              )}
            </Sequence>
          );
        })}
      </AbsoluteFill>

      {/* Layer 3: Foreground Subject Cutout (active in dimmed OR editorial stage mode) */}
      {cuesheet.subjectVideoSrc && stageProgress > 0.005 && (
        <AbsoluteFill
          style={{
            zIndex: 30,
            pointerEvents: 'none',
            transform: `translateY(${subjectOffsetY}px) scale(${subjectScale})`,
            transformOrigin: isDimmedMode ? '50% 42%' : '50% 85%',
            filter: isEditorialStage
              ? `drop-shadow(0 18px 28px rgba(15, 23, 42, ${(0.24 * stageProgress).toFixed(2)}))`
              : 'none',
          }}
        >
          <OffthreadVideo
            transparent
            muted
            src={staticFile(cuesheet.subjectVideoSrc)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </AbsoluteFill>
      )}

      {/* Layer 4: Front Overlays & Full-Screen Cutaways */}
      <AbsoluteFill style={{ zIndex: 40, pointerEvents: 'none' }}>
        {cuesheet.cues.map((cue, idx) => {
          const from = Math.round(cue.startSec * fps);
          const durationInFrames = Math.max(
            1,
            Math.round((cue.endSec - cue.startSec) * fps),
          );

          if (cue.type === 'HookTitle') {
            return (
              <Sequence
                key={`front-hook-${idx}`}
                from={from}
                durationInFrames={durationInFrames}
              >
                <HookTitle
                  text={cue.text}
                  eyebrow={cue.eyebrow}
                  variant={cue.variant}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              </Sequence>
            );
          }

          if (cue.type === 'FloatingChecklist') {
            return (
              <Sequence
                key={`front-check-${idx}`}
                from={from}
                durationInFrames={durationInFrames}
              >
                <FloatingChecklist
                  items={cue.items}
                  position={cue.position}
                  staggerFrames={cue.staggerFrames}
                  darkText={cue.darkText}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              </Sequence>
            );
          }

          if (cue.type === 'GlowingArcTimeline' && cue.layer === 'front') {
            return (
              <Sequence
                key={`front-arc-${idx}`}
                from={from}
                durationInFrames={durationInFrames}
              >
                <GlowingArcTimeline
                  nodes={cue.nodes}
                  yOffset={cue.yOffset}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              </Sequence>
            );
          }

          if (cue.type === 'SpotlightLensCutaway') {
            return (
              <Sequence
                key={`front-lens-${idx}`}
                from={from}
                durationInFrames={durationInFrames}
              >
                <SpotlightLensCutaway
                  headline={cue.headline}
                  backgroundTerms={cue.backgroundTerms}
                  focusSteps={cue.focusSteps}
                  theme={cuesheet.theme}
                  durationInFrames={durationInFrames}
                />
              </Sequence>
            );
          }

          return null;
        })}
      </AbsoluteFill>

      {/* Layer 4B: Captions (default: reference SleekCursorCaptions) */}
      {captionStyle === 'sleek' ? (
        <SleekCursorCaptions
          captions={cuesheet.captions}
          theme={cuesheet.theme}
        />
      ) : (
        <DynamicCaptions
          captions={cuesheet.captions}
          theme={cuesheet.theme}
        />
      )}

      {/* Layer 5: Whip-Blur Transitions */}
      {(cuesheet.transitions ?? []).map((tr, idx) => {
        const from = Math.max(0, Math.round(tr.atSec * fps) - 4);
        return (
          <Sequence key={`whip-${idx}`} from={from} durationInFrames={8}>
            <WhipBlurTransition theme={cuesheet.theme} durationInFrames={8} />
            {enableSfx && (
              <Audio src={staticFile('sfx/whoosh.wav')} volume={0.38} />
            )}
          </Sequence>
        );
      })}

      {/* Audio Layer: Synced Micro-SFX for Cues */}
      {enableSfx &&
        cuesheet.cues.map((cue, idx) => {
          const sfx = getCueSfx(cue);
          if (!sfx) return null;
          const from = Math.round(cue.startSec * fps);
          return (
            <Sequence
              key={`sfx-${idx}`}
              from={from}
              durationInFrames={Math.round(fps * 1.2)}
            >
              <Audio src={staticFile(sfx.file)} volume={sfx.volume} />
            </Sequence>
          );
        })}
    </AbsoluteFill>
  );
};
