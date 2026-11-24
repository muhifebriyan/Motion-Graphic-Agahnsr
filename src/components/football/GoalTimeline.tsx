import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SMOOTH,
  type ThemeMode,
} from '../../theme/brand';
import type { GoalTimelineEvent } from '../../types/cuesheet';

interface GoalTimelineProps {
  title?: string;
  events: GoalTimelineEvent[];
  theme: ThemeMode;
  durationInFrames: number;
}

export const GoalTimeline: React.FC<GoalTimelineProps> = ({
  title = 'MOMEN PENTING',
  events,
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
        transform: `translateY(${interpolate(cardEnter, [0, 1], [34, 0])}px)`,
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          backgroundColor: brand.cardBg,
          border: `1.5px solid ${brand.cardBorder}`,
          borderRadius: 30,
          padding: '28px 30px',
          boxShadow: '0 24px 54px rgba(15, 23, 42, 0.10)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: brand.primary,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {events.map((ev, idx) => {
            const delayFrames = Math.round((ev.delaySec ?? idx * 1.2) * fps);
            const itemSpring = spring({
              frame: Math.max(0, frame - delayFrames),
              fps,
              config: SPRING_SMOOTH,
            });
            const badgeColor =
              ev.type === 'goal'
                ? brand.primary
                : ev.type === 'sub'
                  ? brand.positive
                  : brand.negative;

            return (
              <div
                key={`${ev.minute}-${ev.player}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 18,
                  opacity: itemSpring,
                  transform: `translateX(${interpolate(itemSpring, [0, 1], [-22, 0])}px)`,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid rgba(15, 23, 42, 0.06)',
                  padding: '16px 18px',
                  borderRadius: 18,
                }}
              >
                <div
                  style={{
                    minWidth: 82,
                    textAlign: 'center',
                    backgroundColor: badgeColor,
                    color: '#FFFFFF',
                    fontSize: 26,
                    fontWeight: 800,
                    fontVariantNumeric: 'tabular-nums',
                    padding: '10px 14px',
                    borderRadius: 14,
                  }}
                >
                  {ev.minute}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <div
                    style={{
                      fontSize: 30,
                      fontWeight: 800,
                      color: brand.inkPrimary,
                    }}
                  >
                    {ev.player}
                  </div>
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight: 600,
                      color: brand.inkMuted,
                    }}
                  >
                    {ev.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
