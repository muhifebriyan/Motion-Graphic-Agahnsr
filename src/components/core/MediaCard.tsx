import React from 'react';
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';

interface MediaCardProps {
  src?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  scoreBadge?: string;
  theme: ThemeMode;
  durationInFrames: number;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  src,
  title,
  subtitle,
  badge,
  scoreBadge,
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

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 30,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: enter * exitOpacity,
        transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px) scale(${interpolate(enter, [0, 1], [0.95, 1])})`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 24px 54px rgba(15, 23, 42, 0.12)',
        }}
      >
        {src && (
          <Img
            src={staticFile(src)}
            style={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              display: 'block',
            }}
          />
        )}

        <div
          style={{
            padding: '28px 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {badge && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: brand.softTint,
                  color: brand.primary,
                  fontSize: 19,
                  fontWeight: 800,
                  letterSpacing: '0.07em',
                  textTransform: 'uppercase',
                  padding: '6px 14px',
                  borderRadius: 999,
                }}
              >
                {badge}
              </div>
            )}
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: brand.inkPrimary,
                lineHeight: 1.18,
                letterSpacing: '-0.02em',
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: brand.inkMuted,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {scoreBadge && (
            <div
              style={{
                backgroundColor: brand.primary,
                color: '#FFFFFF',
                fontSize: 48,
                fontWeight: 800,
                fontVariantNumeric: 'tabular-nums',
                padding: '18px 26px',
                borderRadius: 20,
                flexShrink: 0,
                boxShadow: '0 12px 26px rgba(0, 82, 204, 0.25)',
              }}
            >
              {scoreBadge}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
