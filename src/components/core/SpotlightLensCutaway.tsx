import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';

interface SpotlightLensCutawayProps {
  headline: string;
  backgroundTerms: string[];
  focusSteps: string[];
  theme: ThemeMode;
  durationInFrames: number;
}

// Deterministic scattered bubble positions for clean visual density
const BUBBLE_LAYOUT = [
  { x: 16, y: 24, r: 92 },
  { x: 52, y: 20, r: 78 },
  { x: 82, y: 28, r: 88 },
  { x: 24, y: 42, r: 108 },
  { x: 74, y: 45, r: 100 },
  { x: 18, y: 62, r: 84 },
  { x: 48, y: 66, r: 94 },
  { x: 80, y: 64, r: 86 },
  { x: 28, y: 78, r: 96 },
  { x: 68, y: 80, r: 92 },
];

export const SpotlightLensCutaway: React.FC<SpotlightLensCutawayProps> = ({
  headline,
  backgroundTerms,
  focusSteps,
  theme,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const enter = spring({ frame, fps, config: SPRING_SMOOTH });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const steps = focusSteps.length > 0 ? focusSteps : ['FOKUS'];
  const stepDuration = Math.max(1, durationInFrames / steps.length);
  const activeStepIdx = Math.min(
    steps.length - 1,
    Math.floor(frame / stepDuration),
  );
  const activeWord = steps[activeStepIdx];
  const isFinalStep = activeStepIdx === steps.length - 1;

  // Lens glides smoothly from left-center to dead-center
  const lensX = interpolate(
    frame,
    [0, durationInFrames * 0.55, durationInFrames],
    [-110, 0, 20],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const lensY = interpolate(
    frame,
    [0, durationInFrames * 0.55, durationInFrames],
    [-40, 20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#07090F',
        opacity: enter * exitOpacity,
        fontFamily: FONT_FAMILY,
        overflow: 'hidden',
      }}
    >
      {/* Background scattered conceptual bubbles */}
      {BUBBLE_LAYOUT.map((b, idx) => {
        const term = backgroundTerms[idx % Math.max(1, backgroundTerms.length)] ?? '';
        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: `${b.x}%`,
              top: `${b.y}%`,
              width: b.r * 2,
              height: b.r * 2,
              transform: 'translate(-50%, -50%)',
              borderRadius: 999,
              border: '1.5px solid rgba(255, 255, 255, 0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255, 255, 255, 0.28)',
              fontSize: 24,
              fontWeight: 600,
              textAlign: 'center',
              padding: 12,
            }}
          >
            {term}
          </div>
        );
      })}

      {/* Top headline */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 64,
          right: 64,
          textAlign: 'center',
          fontSize: 42,
          fontWeight: 800,
          color: '#FFFFFF',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}
      >
        {headline}
      </div>

      {/* Animated Magnifying Glass Spotlight */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(calc(-50% + ${lensX}px), calc(-50% + ${lensY}px))`,
        }}
      >
        <div
          style={{
            width: 390,
            height: 390,
            borderRadius: 999,
            backgroundColor: 'rgba(10, 14, 24, 0.88)',
            border: '7px solid #FFFFFF',
            boxShadow: isFinalStep
              ? `0 0 65px ${brand.glowColor}, inset 0 0 36px ${brand.glowColor}`
              : '0 0 36px rgba(255,255,255,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 28,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontSize: activeWord.length <= 4 ? 120 : 62,
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: isFinalStep ? brand.primary : '#FFFFFF',
              textShadow: isFinalStep
                ? `0 0 32px ${brand.glowColor}`
                : 'none',
            }}
          >
            {activeWord}
          </span>
        </div>

        {/* Magnifying glass handle */}
        <div
          style={{
            position: 'absolute',
            right: -36,
            bottom: -115,
            width: 24,
            height: 170,
            borderRadius: 999,
            backgroundColor: '#FFFFFF',
            transform: 'rotate(-36deg)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
