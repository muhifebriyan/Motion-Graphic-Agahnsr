import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { getBrandTheme, type ThemeMode } from '../../theme/brand';

interface WhipBlurTransitionProps {
  theme: ThemeMode;
  durationInFrames?: number;
}

export const WhipBlurTransition: React.FC<WhipBlurTransitionProps> = ({
  theme,
  durationInFrames = 8,
}) => {
  const frame = useCurrentFrame();
  const brand = getBrandTheme(theme);
  const mid = durationInFrames / 2;

  const intensity = interpolate(
    frame,
    [0, mid, durationInFrames],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        zIndex: 60,
        pointerEvents: 'none',
        backdropFilter: `blur(${(intensity * 18).toFixed(1)}px)`,
        background: `radial-gradient(circle at 50% 50%, ${brand.glowColor}, rgba(255,255,255,0.18))`,
        opacity: intensity * 0.65,
      }}
    />
  );
};
