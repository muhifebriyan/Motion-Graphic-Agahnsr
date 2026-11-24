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

interface SleekCursorCaptionsProps {
  captions: CaptionSegment[];
  theme: ThemeMode;
}

export const SleekCursorCaptions: React.FC<SleekCursorCaptionsProps> = ({
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
    1,
    Math.max(
      0,
      (currentSec - active.startSec) /
        Math.max(0.18, active.endSec - active.startSec),
    ),
  );
  const visibleCount = Math.max(1, Math.ceil(progress * words.length));
  const highlightLower = active.highlight?.toLowerCase();
  const cursorVisible = Math.floor(frame / 6) % 2 === 0;

  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 45,
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
          alignItems: 'center',
          gap: '4px 10px',
          maxWidth: '94%',
          transform: `translateY(${(1 - pop) * 10}px)`,
          opacity: pop,
        }}
      >
        {words.slice(0, visibleCount).map((word, idx) => {
          const isLastVisible = idx === visibleCount - 1;
          const isKeyHighlight =
            highlightLower &&
            word.toLowerCase().replace(/[^a-z0-9]/gi, '').includes(highlightLower);

          return (
            <span
              key={`${active.startSec}-${idx}`}
              style={{
                fontSize: 42,
                fontWeight: 800,
                lineHeight: 1.24,
                letterSpacing: '-0.02em',
                color: isKeyHighlight
                  ? brand.primary
                  : '#FFFFFF',
                textShadow: isKeyHighlight
                  ? `0 4px 20px rgba(0,0,0,0.85), 0 0 22px ${brand.glowColor}`
                  : '0 4px 18px rgba(0, 0, 0, 0.90), 0 1px 4px rgba(0, 0, 0, 0.95)',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              {word}
              {isLastVisible && (
                <span
                  style={{
                    display: 'inline-block',
                    width: 8,
                    height: 40,
                    marginLeft: 6,
                    borderRadius: 3,
                    backgroundColor: brand.primary,
                    opacity: cursorVisible ? 1 : 0.35,
                    boxShadow: `0 0 14px ${brand.glowColor}`,
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
