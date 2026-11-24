import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';

interface PointListCardProps {
  title?: string;
  points: string[];
  staggerFrames?: number;
  theme: ThemeMode;
  durationInFrames: number;
}

export const PointListCard: React.FC<PointListCardProps> = ({
  title,
  points,
  staggerFrames = 14,
  theme,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const cardEnter = spring({ frame, fps, config: SPRING_SMOOTH });
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
        top: SAFE_ZONE.stageTop + 10,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: cardEnter * exitOpacity,
        transform: `translateY(${interpolate(cardEnter, [0, 1], [32, 0])}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 28,
          padding: '28px 30px',
          boxShadow: '0 24px 54px rgba(15, 23, 42, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {title && (
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: brand.primary,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            {title}
          </div>
        )}
        {points.map((point, idx) => {
          const itemSpring = spring({
            frame: Math.max(0, frame - idx * staggerFrames),
            fps,
            config: SPRING_SMOOTH,
          });
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                opacity: itemSpring,
                transform: `translateX(${interpolate(itemSpring, [0, 1], [-18, 0])}px)`,
                backgroundColor: '#F8FAFC',
                padding: '14px 18px',
                borderRadius: 16,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  backgroundColor: brand.primary,
                  color: '#FFFFFF',
                  fontSize: 22,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </div>
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: brand.inkPrimary,
                  lineHeight: 1.25,
                }}
              >
                {point}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
