import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';

interface ThoughtCalloutProps {
  quote: string;
  tag?: string;
  highlightWord?: string;
  theme: ThemeMode;
  durationInFrames: number;
}

export const ThoughtCallout: React.FC<ThoughtCalloutProps> = ({
  quote,
  tag,
  highlightWord,
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

  const translateY = interpolate(enter, [0, 1], [36, 0]);
  const highlightLower = highlightWord?.toLowerCase();

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 30,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: enter * exitOpacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderLeft: `10px solid ${brand.primary}`,
          borderRadius: 28,
          padding: '32px 34px',
          boxShadow: '0 24px 54px rgba(15, 23, 42, 0.10)',
        }}
      >
        {tag && (
          <div
            style={{
              display: 'inline-block',
              backgroundColor: brand.softTint,
              color: brand.primary,
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              borderRadius: 999,
              marginBottom: 16,
            }}
          >
            {tag}
          </div>
        )}
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            lineHeight: 1.24,
            letterSpacing: '-0.02em',
            color: brand.inkPrimary,
          }}
        >
          {quote.split(' ').map((word, idx) => {
            const match =
              highlightLower &&
              word.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(highlightLower);
            return (
              <span
                key={idx}
                style={{
                  color: match ? brand.primary : brand.inkPrimary,
                  backgroundColor: match ? brand.softTint : 'transparent',
                  padding: match ? '0 8px' : '0',
                  borderRadius: 10,
                }}
              >
                {word}{' '}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
