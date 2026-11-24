import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface OutroCTAProps {
  punchline: string;
  ctaText: string;
  handle?: string;
  theme: ThemeMode;
  durationInFrames: number;
}

export const OutroCTA: React.FC<OutroCTAProps> = ({
  punchline,
  ctaText,
  handle,
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

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 40,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: enter * exitOpacity,
        transform: `translateY(${interpolate(enter, [0, 1], [32, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          color: brand.inkPrimary,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 30,
          padding: '32px 34px',
          boxShadow: '0 24px 56px rgba(15, 23, 42, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          borderTop: `10px solid ${brand.primary}`,
        }}
      >
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            lineHeight: 1.18,
            letterSpacing: '-0.025em',
          }}
        >
          {punchline}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div
            style={{
              backgroundColor: brand.primary,
              color: '#FFFFFF',
              fontSize: 22,
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: 999,
            }}
          >
            {ctaText}
          </div>
          {handle && (
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: brand.inkMuted,
              }}
            >
              {handle}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
