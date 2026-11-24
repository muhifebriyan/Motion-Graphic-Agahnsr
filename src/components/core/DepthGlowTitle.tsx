import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';

interface DepthGlowTitleProps {
  text: string;
  eyebrow?: string;
  accentText?: string;
  yOffset?: number;
  sparkle?: boolean;
  theme: ThemeMode;
  durationInFrames: number;
}

export const DepthGlowTitle: React.FC<DepthGlowTitleProps> = ({
  text,
  eyebrow,
  accentText,
  yOffset = 310,
  sparkle = true,
  theme,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const enter = spring({ frame, fps, config: SPRING_SNAPPY });
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - 7, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const blurPx = interpolate(enter, [0, 1], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(enter, [0, 1], [1.14, 1]);
  const translateY = interpolate(enter, [0, 1], [-24, 0]);

  // Curved light slash sweep animation
  const slashProgress = interpolate(frame, [4, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: yOffset,
        left: 36,
        right: 36,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity: enter * exitOpacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        filter: `blur(${blurPx.toFixed(1)}px)`,
        fontFamily: FONT_FAMILY,
        pointerEvents: 'none',
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontSize: 38,
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.92)',
            letterSpacing: '-0.01em',
            marginBottom: 4,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.55)',
          }}
        >
          {eyebrow}
        </div>
      )}

      <div style={{ position: 'relative', display: 'inline-block' }}>
        <div
          style={{
            fontSize: text.length > 10 ? 112 : 148,
            fontWeight: 800,
            lineHeight: 0.96,
            letterSpacing: '-0.04em',
            background: `linear-gradient(95deg, #FFFFFF 32%, ${brand.primary} 85%, ${brand.gradientEnd} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 28px ${brand.glowColor}) drop-shadow(0 8px 24px rgba(0,0,0,0.55))`,
          }}
        >
          {text}
        </div>

        {/* Subtle glowing arc accent like in referensi-style-remotion.mp4 */}
        {sparkle && (
          <svg
            width="140"
            height="120"
            viewBox="0 0 140 120"
            style={{
              position: 'absolute',
              right: -54,
              top: -26,
              opacity: slashProgress * exitOpacity,
              filter: `drop-shadow(0 0 12px ${brand.primary})`,
            }}
          >
            <path
              d="M 20 15 Q 100 35 110 105"
              fill="none"
              stroke={brand.gradientEnd}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="150"
              strokeDashoffset={150 * (1 - slashProgress)}
            />
          </svg>
        )}
      </div>

      {accentText && (
        <div
          style={{
            marginTop: 14,
            fontSize: 34,
            fontWeight: 700,
            color: brand.secondary,
            textShadow: '0 4px 18px rgba(0, 0, 0, 0.65)',
          }}
        >
          {accentText}
        </div>
      )}
    </div>
  );
};
