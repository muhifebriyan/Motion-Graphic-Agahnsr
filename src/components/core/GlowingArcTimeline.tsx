import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';
import type { GlowingArcNode } from '../../types/cuesheet';

interface GlowingArcTimelineProps {
  nodes: GlowingArcNode[];
  yOffset?: number;
  theme: ThemeMode;
  durationInFrames: number;
}

export const GlowingArcTimeline: React.FC<GlowingArcTimelineProps> = ({
  nodes,
  yOffset = 780,
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

  const drawProgress = interpolate(frame, [0, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const width = 960;
  const height = 220;

  // Quadratic bezier curve across the screen (M 40,140 Q 480,30 920,140)
  const getPointOnArc = (t: number) => {
    const p0 = { x: 80, y: 145 };
    const p1 = { x: 480, y: 35 };
    const p2 = { x: 880, y: 145 };
    const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
    const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
    return { x, y };
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: yOffset,
        left: 60,
        width,
        height,
        opacity: exitOpacity,
        pointerEvents: 'none',
        fontFamily: FONT_FAMILY,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="50%" stopColor={brand.gradientEnd} stopOpacity="1" />
            <stop offset="100%" stopColor={brand.primary} stopOpacity="1" />
          </linearGradient>
        </defs>

        <path
          d="M 80 145 Q 480 35 880 145"
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="900"
          strokeDashoffset={900 * (1 - drawProgress)}
          style={{
            filter: `drop-shadow(0 0 14px ${brand.glowColor})`,
          }}
        />
      </svg>

      {nodes.map((node, idx) => {
        const t =
          nodes.length === 1 ? 0.5 : 0.14 + (idx / (nodes.length - 1)) * 0.72;
        const pt = getPointOnArc(t);
        const delay = Math.round(6 + idx * 14);
        const pop = spring({
          frame: Math.max(0, frame - delay),
          fps,
          config: SPRING_SNAPPY,
        });

        return (
          <div
            key={`${node.label}-${idx}`}
            style={{
              position: 'absolute',
              left: pt.x,
              top: pt.y,
              transform: `translate(-50%, -50%) scale(${pop})`,
              opacity: pop,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                bottom: 24,
                whiteSpace: 'nowrap',
                fontSize: 32,
                fontWeight: 800,
                color: '#FFFFFF',
                textShadow: `0 4px 18px rgba(0,0,0,0.8), 0 0 16px ${brand.glowColor}`,
              }}
            >
              {node.label}
            </div>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                backgroundColor: '#FFFFFF',
                border: `4px solid ${brand.primary}`,
                boxShadow: `0 0 22px 6px ${brand.glowColor}`,
              }}
            />
            {node.sublabel && (
              <div
                style={{
                  position: 'absolute',
                  top: 24,
                  whiteSpace: 'nowrap',
                  fontSize: 22,
                  fontWeight: 700,
                  color: brand.secondary,
                  textShadow: '0 2px 12px rgba(0,0,0,0.85)',
                }}
              >
                {node.sublabel}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
