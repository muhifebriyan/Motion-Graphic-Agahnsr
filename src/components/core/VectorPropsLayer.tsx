import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface VectorPropsLayerProps {
  propType: 'questions' | 'gears' | 'check-badge' | 'sparkles';
  labels?: string[];
  theme: ThemeMode;
  durationInFrames: number;
}

const QUESTION_POSITIONS = [
  { x: 640, y: 240, size: 78, rot: -12, delay: 0 },
  { x: 760, y: 310, size: 112, rot: 10, delay: 4 },
  { x: 850, y: 220, size: 94, rot: -6, delay: 8 },
  { x: 200, y: 390, size: 72, rot: -18, delay: 6 },
  { x: 780, y: 480, size: 86, rot: 14, delay: 10 },
];

export const VectorPropsLayer: React.FC<VectorPropsLayerProps> = ({
  propType,
  labels = [],
  theme,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  if (propType === 'questions') {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: exitOpacity,
          fontFamily: FONT_FAMILY,
          pointerEvents: 'none',
        }}
      >
        {QUESTION_POSITIONS.map((q, idx) => {
          const pop = spring({
            frame: Math.max(0, frame - q.delay),
            fps,
            config: SPRING_SNAPPY,
          });
          const floatY = Math.sin((frame + idx * 11) * 0.12) * 10;
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: q.x,
                top: q.y + floatY,
                fontSize: q.size,
                fontWeight: 800,
                color: idx % 2 === 0 ? brand.inkPrimary : brand.primary,
                opacity: pop * 0.85,
                transform: `rotate(${q.rot}deg) scale(${pop})`,
                textShadow: '0 8px 20px rgba(0,0,0,0.22)',
              }}
            >
              ?
            </div>
          );
        })}
      </div>
    );
  }

  if (propType === 'check-badge') {
    const pop = spring({ frame, fps, config: SPRING_SNAPPY });
    const draw = interpolate(frame, [4, 16], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return (
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: '50%',
          transform: `translateX(-50%) scale(${pop})`,
          opacity: pop * exitOpacity,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: 150,
            height: 150,
            borderRadius: 999,
            backgroundColor: brand.softTint,
            border: `4px solid ${brand.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 14px 40px ${brand.glowColor}`,
          }}
        >
          <svg width="84" height="84" viewBox="0 0 84 84">
            <path
              d="M 18 44 L 35 61 L 66 24"
              fill="none"
              stroke={brand.primary}
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="95"
              strokeDashoffset={95 * (1 - draw)}
            />
          </svg>
        </div>
      </div>
    );
  }

  if (propType === 'gears') {
    const pop = spring({ frame, fps, config: SPRING_SNAPPY });
    const rotA = frame * 2.2;
    const rotB = -frame * 3.0;
    return (
      <div
        style={{
          position: 'absolute',
          left: 72,
          top: 760,
          opacity: pop * exitOpacity,
          transform: `scale(${pop})`,
          fontFamily: FONT_FAMILY,
          pointerEvents: 'none',
        }}
      >
        <svg width="320" height="240" viewBox="0 0 320 240">
          {/* Primary gear */}
          <g transform={`translate(95 110) rotate(${rotA})`}>
            <circle cx="0" cy="0" r="56" fill={brand.primary} />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <rect
                key={deg}
                x="-12"
                y="-74"
                width="24"
                height="24"
                rx="6"
                fill={brand.primary}
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="24" fill="#FFFFFF" />
          </g>

          {/* Interlocking secondary gear */}
          <g transform={`translate(215 162) rotate(${rotB})`}>
            <circle cx="0" cy="0" r="40" fill={brand.gradientEnd} />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <rect
                key={deg}
                x="-10"
                y="-54"
                width="20"
                height="18"
                rx="5"
                fill={brand.gradientEnd}
                transform={`rotate(${deg})`}
              />
            ))}
            <circle cx="0" cy="0" r="16" fill="#FFFFFF" />
          </g>
        </svg>

        {labels.length > 0 && (
          <div
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            {labels.map((label, idx) => {
              const lp = spring({
                frame: Math.max(0, frame - idx * 12),
                fps,
                config: SPRING_SNAPPY,
              });
              return (
                <div
                  key={label}
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: '#FFFFFF',
                    opacity: lp,
                    transform: `translateX(${interpolate(lp, [0, 1], [-18, 0])}px)`,
                    textShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  }}
                >
                  {label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Sparkles
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        opacity: exitOpacity,
        pointerEvents: 'none',
      }}
    >
      {[
        { x: 160, y: 420, s: 44, d: 0 },
        { x: 860, y: 380, s: 52, d: 5 },
        { x: 820, y: 690, s: 36, d: 10 },
      ].map((sp, idx) => {
        const p = spring({
          frame: Math.max(0, frame - sp.d),
          fps,
          config: SPRING_SNAPPY,
        });
        return (
          <svg
            key={idx}
            width={sp.s}
            height={sp.s}
            viewBox="0 0 40 40"
            style={{
              position: 'absolute',
              left: sp.x,
              top: sp.y,
              opacity: p,
              transform: `scale(${p}) rotate(${frame * 2}deg)`,
              filter: `drop-shadow(0 0 12px ${brand.glowColor})`,
            }}
          >
            <path
              d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z"
              fill={brand.primary}
            />
          </svg>
        );
      })}
    </div>
  );
};
