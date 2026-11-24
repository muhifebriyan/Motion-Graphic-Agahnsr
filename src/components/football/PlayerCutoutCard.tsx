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
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';
import type { PlayerItem } from '../../types/cuesheet';

interface PlayerCutoutCardProps {
  players: PlayerItem[];
  subtitle?: string;
  theme: ThemeMode;
  durationInFrames: number;
}

export const PlayerCutoutCard: React.FC<PlayerCutoutCardProps> = ({
  players,
  subtitle,
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

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 20,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: exitOpacity,
        fontFamily: FONT_FAMILY,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
      }}
    >
      {subtitle && (
        <div
          style={{
            alignSelf: 'flex-start',
            backgroundColor: brand.primary,
            color: '#FFFFFF',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            padding: '8px 18px',
            borderRadius: 999,
            boxShadow: '0 8px 20px rgba(0, 82, 204, 0.20)',
          }}
        >
          {subtitle}
        </div>
      )}

      <div style={{ display: 'flex', gap: 18 }}>
        {players.map((player, idx) => {
          const delay = idx * Math.round(fps * 0.9);
          const pop = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: SPRING_SNAPPY,
          });
          const accent = player.accentColor ?? brand.primary;
          const initials = player.name
            .split(' ')
            .map((p) => p[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          return (
            <div
              key={player.name}
              style={{
                flex: 1,
                backgroundColor: brand.cardBg,
                border: `2px solid ${brand.cardBorder}`,
                borderTop: `8px solid ${accent}`,
                borderRadius: 28,
                padding: '26px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                opacity: pop,
                transform: `translateY(${interpolate(pop, [0, 1], [34, 0])}px) scale(${interpolate(pop, [0, 1], [0.92, 1])})`,
                boxShadow: '0 22px 48px rgba(15, 23, 42, 0.10)',
              }}
            >
              {player.imageSrc ? (
                <Img
                  src={staticFile(player.imageSrc)}
                  style={{
                    width: 128,
                    height: 128,
                    borderRadius: 24,
                    objectFit: 'cover',
                    border: `3px solid ${accent}`,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 26,
                    background: `linear-gradient(135deg, ${accent}, #1E3A8A)`,
                    color: '#FFFFFF',
                    fontSize: 36,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 24px rgba(0, 82, 204, 0.24)',
                  }}
                >
                  {player.number ? `#${player.number}` : initials}
                </div>
              )}

              <div
                style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: brand.inkPrimary,
                  textAlign: 'center',
                  lineHeight: 1.15,
                }}
              >
                {player.name}
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {player.badge && (
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontSize: 17,
                      fontWeight: 800,
                      padding: '5px 14px',
                      borderRadius: 999,
                    }}
                  >
                    {player.badge}
                  </span>
                )}
                {player.role && (
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: brand.inkMuted,
                    }}
                  >
                    {player.role}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
