import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface FloatingChecklistProps {
  items: string[];
  position?: 'top-left' | 'top-right';
  staggerFrames?: number;
  darkText?: boolean;
  theme: ThemeMode;
  durationInFrames: number;
}

export const FloatingChecklist: React.FC<FloatingChecklistProps> = ({
  items,
  position = 'top-left',
  staggerFrames = 14,
  darkText = false,
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

  const isRight = position === 'top-right';

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.top + 30,
        left: isRight ? undefined : SAFE_ZONE.left,
        right: isRight ? SAFE_ZONE.right : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: isRight ? 'flex-end' : 'flex-start',
        gap: 14,
        opacity: exitOpacity,
        fontFamily: FONT_FAMILY,
        pointerEvents: 'none',
      }}
    >
      {items.map((item, idx) => {
        const localFrame = Math.max(0, frame - idx * staggerFrames);
        const pop = spring({
          frame: localFrame,
          fps,
          config: SPRING_SNAPPY,
        });
        const checkDraw = interpolate(localFrame, [4, 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={item}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              opacity: pop,
              transform: `translateY(${interpolate(pop, [0, 1], [18, 0])}px)`,
            }}
          >
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: darkText ? brand.inkPrimary : '#FFFFFF',
                textShadow: darkText
                  ? '0 2px 10px rgba(255,255,255,0.6)'
                  : '0 4px 20px rgba(0, 0, 0, 0.65)',
              }}
            >
              {item}
            </span>
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              style={{
                filter: `drop-shadow(0 0 10px ${brand.glowColor})`,
              }}
            >
              <path
                d="M 7 20 L 16 29 L 32 10"
                fill="none"
                stroke={brand.primary}
                strokeWidth="5.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="45"
                strokeDashoffset={45 * (1 - checkDraw)}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
