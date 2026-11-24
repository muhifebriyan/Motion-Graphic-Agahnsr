import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface KineticBackdropProps {
  headline: string;
  subline?: string;
  eyebrow?: string;
  accentWord?: string;
  theme: ThemeMode;
  durationInFrames: number;
}

export const KineticBackdrop: React.FC<KineticBackdropProps> = ({
  headline,
  subline,
  eyebrow,
  accentWord,
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

  const accentLower = accentWord?.toLowerCase();

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 40,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        opacity: enter * exitOpacity,
        transform: `translateY(${interpolate(enter, [0, 1], [44, 0])}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      {eyebrow && (
        <div
          style={{
            alignSelf: 'flex-start',
            backgroundColor: brand.softTint,
            color: brand.primary,
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '8px 18px',
            borderRadius: 999,
          }}
        >
          {eyebrow}
        </div>
      )}

      <div
        style={{
          fontSize: 82,
          fontWeight: 800,
          lineHeight: 1.04,
          letterSpacing: '-0.035em',
          color: brand.inkPrimary,
        }}
      >
        {headline.split(' ').map((word, idx) => {
          const isAccent =
            accentLower &&
            word.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(accentLower);
          return (
            <span
              key={idx}
              style={{
                color: isAccent ? brand.primary : brand.inkPrimary,
              }}
            >
              {word}{' '}
            </span>
          );
        })}
      </div>

      {subline && (
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            lineHeight: 1.32,
            color: brand.inkMuted,
            maxWidth: '92%',
          }}
        >
          {subline}
        </div>
      )}
    </div>
  );
};
