import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  SPRING_SNAPPY,
  type ThemeMode,
} from '../../theme/brand';
import type { CaptionSegment } from '../../types/cuesheet';

interface DynamicCaptionsProps {
  captions: CaptionSegment[];
  theme: ThemeMode;
}

export const DynamicCaptions: React.FC<DynamicCaptionsProps> = ({
  captions,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const brand = getBrandTheme(theme);

  const currentSec = frame / fps;
  const active = captions.find(
    (c) => currentSec >= c.startSec && currentSec < c.endSec,
  );

  if (!active) return null;

  const localFrame = Math.max(0, frame - Math.round(active.startSec * fps));
  const pop = spring({ frame: localFrame, fps, config: SPRING_SNAPPY });

  const words = active.text.split(' ');
  const progress = Math.min(
    0.999,
    Math.max(
      0,
      (currentSec - active.startSec) /
        Math.max(0.15, active.endSec - active.startSec),
    ),
  );
  const activeWordIdx = Math.floor(progress * words.length);
  const highlightLower = active.highlight?.toLowerCase();

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 40,
        left: SAFE_ZONE.left,
        right: SAFE_ZONE.right,
        bottom: SAFE_ZONE.bottom,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '4px 10px',
          backgroundColor: brand.darkSurface,
          padding: '12px 22px',
          borderRadius: 20,
          border: '1px solid rgba(255, 255, 255, 0.14)',
          boxShadow: '0 12px 30px rgba(15, 23, 42, 0.35)',
          transform: `scale(${0.92 + pop * 0.08})`,
        }}
      >
        {words.map((word, idx) => {
          const isCurrent = idx === activeWordIdx;
          const isKeyHighlight =
            highlightLower &&
            word.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(highlightLower);

          return (
            <span
              key={`${active.startSec}-${idx}`}
              style={{
                fontSize: 36,
                fontWeight: 800,
                lineHeight: 1.2,
                letterSpacing: '-0.015em',
                color: isKeyHighlight
                  ? brand.secondary
                  : isCurrent
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.80)',
                backgroundColor: isCurrent ? brand.primary : 'transparent',
                padding: isCurrent ? '2px 9px' : '2px 2px',
                borderRadius: 9,
                transform: isCurrent ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
