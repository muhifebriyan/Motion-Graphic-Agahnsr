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
import type { ScoreboardTeam } from '../../types/cuesheet';

interface ScoreboardCardProps {
  league: string;
  status: string;
  homeTeam: ScoreboardTeam;
  awayTeam: ScoreboardTeam;
  initialScore?: [number, number];
  theme: ThemeMode;
  durationInFrames: number;
}

const ClubBadge: React.FC<{ team: ScoreboardTeam }> = ({ team }) => {
  if (team.logoSrc) {
    return (
      <Img
        src={staticFile(team.logoSrc)}
        style={{ width: 84, height: 84, objectFit: 'contain' }}
      />
    );
  }
  return (
    <div
      style={{
        width: 84,
        height: 84,
        borderRadius: 24,
        backgroundColor: team.color,
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.18)',
      }}
    >
      {team.short}
    </div>
  );
};

export const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  league,
  status,
  homeTeam,
  awayTeam,
  initialScore,
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

  const showFinal = !initialScore || frame > Math.round(fps * 1.4);
  const homeScore = showFinal ? homeTeam.score : initialScore[0];
  const awayScore = showFinal ? awayTeam.score : initialScore[1];

  return (
    <div
      style={{
        position: 'absolute',
        top: SAFE_ZONE.stageTop + 30,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        opacity: enter * exitOpacity,
        transform: `translateY(${interpolate(enter, [0, 1], [36, 0])}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 32,
          padding: '28px 32px 34px',
          boxShadow: '0 24px 56px rgba(15, 23, 42, 0.10)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1.5px solid rgba(15, 23, 42, 0.08)',
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: brand.inkMuted,
              letterSpacing: '0.03em',
            }}
          >
            {league}
          </span>
          <span
            style={{
              backgroundColor: brand.softTint,
              color: brand.primary,
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '6px 16px',
              borderRadius: 999,
            }}
          >
            {status}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <ClubBadge team={homeTeam} />
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: brand.inkPrimary,
                textAlign: 'center',
              }}
            >
              {homeTeam.name}
            </div>
            {homeTeam.rankDelta && (
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: brand.positive,
                }}
              >
                {homeTeam.rankDelta}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 18,
              fontSize: 84,
              fontWeight: 800,
              fontVariantNumeric: 'tabular-nums',
              color: brand.inkPrimary,
            }}
          >
            <span style={{ color: brand.primary }}>{homeScore}</span>
            <span style={{ fontSize: 44, color: brand.inkMuted }}>–</span>
            <span>{awayScore}</span>
          </div>

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <ClubBadge team={awayTeam} />
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: brand.inkPrimary,
                textAlign: 'center',
              }}
            >
              {awayTeam.name}
            </div>
            {awayTeam.rankDelta && (
              <div
                style={{
                  fontSize: 19,
                  fontWeight: 800,
                  color: brand.negative,
                }}
              >
                {awayTeam.rankDelta}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
