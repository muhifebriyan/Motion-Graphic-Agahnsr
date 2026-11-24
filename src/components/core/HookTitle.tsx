import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface HookTitleProps {
  text: string;
  eyebrow?: string;
  variant?: 'pill' | 'bold';
  theme: ThemeMode;
  durationInFrames: number;
}

export const HookTitle: React.FC<HookTitleProps> = ({
  text,
  eyebrow,
  variant = 'pill',
  theme,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const enter = spring({ frame, fps, config: SPRING_SNAPPY });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const scale = interpolate(enter, [0, 1], [0.82, 1]);
  const translateY = interpolate(enter, [0, 1], [28, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 76,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 8,
        opacity: enter * exitOpacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transformOrigin: 'left center',
        fontFamily: FONT_FAMILY,
      }}
    >
      {eyebrow && (
        <div
          style={{
            backgroundColor: brand.primary,
            color: brand.textPrimary,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 18px',
            borderRadius: 999,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.28)',
          }}
        >
          {eyebrow}
        </div>
      )}

      <div
        style={
          variant === 'pill'
            ? {
                backgroundColor: brand.pillBg,
                color: brand.pillText,
                fontSize: 48,
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                padding: '18px 30px',
                borderRadius: 24,
                boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
                borderLeft: `10px solid ${brand.primary}`,
              }
            : {
                color: brand.textPrimary,
                fontSize: 58,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                textShadow: '0 6px 24px rgba(0, 0, 0, 0.75)',
              }
        }
      >
        {text}
      </div>
    </div>
  );
};
