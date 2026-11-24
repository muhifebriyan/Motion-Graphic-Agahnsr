import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';
import type { StandingsRow } from '../../types/cuesheet';

interface StandingsTableProps {
  league: string;
  rows: StandingsRow[];
  theme: ThemeMode;
  durationInFrames: number;
}

export const StandingsTable: React.FC<StandingsTableProps> = ({
  league,
  rows,
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
        transform: `translateY(${interpolate(cardEnter, [0, 1], [36, 0])}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 30,
          padding: '24px 28px',
          boxShadow: '0 24px 54px rgba(15, 23, 42, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 12,
            borderBottom: '1.5px solid rgba(15, 23, 42, 0.08)',
          }}
        >
          <span
            style={{
              fontSize: 21,
              fontWeight: 800,
              color: brand.primary,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            {league}
          </span>
          <div
            style={{
              display: 'flex',
              gap: 32,
              fontSize: 18,
              fontWeight: 700,
              color: brand.inkMuted,
            }}
          >
            <span>MAIN</span>
            <span>POIN</span>
          </div>
        </div>

        {rows.map((row, idx) => {
          const rowSpring = spring({
            frame: Math.max(0, frame - idx * 4),
            fps,
            config: SPRING_SMOOTH,
          });
          const moveSymbol =
            row.move === 'up' ? '▲' : row.move === 'down' ? '▼' : '';
          const moveColor =
            row.move === 'up'
              ? row.highlight
                ? '#86EFAC'
                : brand.positive
              : brand.negative;

          return (
            <div
              key={row.team}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '13px 16px',
                borderRadius: 16,
                backgroundColor: row.highlight ? brand.primary : '#F8FAFC',
                opacity: rowSpring,
                transform: `translateX(${interpolate(rowSpring, [0, 1], [-16, 0])}px)`,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span
                  style={{
                    width: 28,
                    fontSize: 24,
                    fontWeight: 800,
                    color: row.highlight ? brand.secondary : brand.inkMuted,
                  }}
                >
                  {row.pos}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: row.highlight ? 800 : 700,
                    color: row.highlight ? '#FFFFFF' : brand.inkPrimary,
                  }}
                >
                  {row.team}
                </span>
                {moveSymbol && (
                  <span
                    style={{
                      fontSize: 19,
                      fontWeight: 800,
                      color: moveColor,
                    }}
                  >
                    {moveSymbol}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: 38, alignItems: 'center' }}>
                <span
                  style={{
                    width: 34,
                    textAlign: 'right',
                    fontSize: 23,
                    fontWeight: 600,
                    color: row.highlight
                      ? 'rgba(255,255,255,0.85)'
                      : brand.inkMuted,
                  }}
                >
                  {row.played}
                </span>
                <span
                  style={{
                    width: 40,
                    textAlign: 'right',
                    fontSize: 26,
                    fontWeight: 800,
                    color: row.highlight ? brand.secondary : brand.inkPrimary,
                  }}
                >
                  {row.pts}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
