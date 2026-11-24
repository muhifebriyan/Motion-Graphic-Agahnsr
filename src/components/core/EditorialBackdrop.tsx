import React from 'react';
import { AbsoluteFill } from 'remotion';
import {
  FONT_FAMILY,
  getBrandTheme,
  SAFE_ZONE,
  type ThemeMode,
} from '../../theme/brand';

interface EditorialBackdropProps {
  theme: ThemeMode;
  opacity: number;
  label?: string;
}

export const EditorialBackdrop: React.FC<EditorialBackdropProps> = ({
  theme,
  opacity,
  label,
}) => {
  if (opacity <= 0.005) return null;
  const brand = getBrandTheme(theme);

  return (
    <AbsoluteFill
      style={{
        zIndex: 10,
        opacity,
        backgroundColor: brand.stageBg,
        backgroundImage: `radial-gradient(${brand.stageDot} 2px, transparent 2px)`,
        backgroundSize: '36px 36px',
        pointerEvents: 'none',
        fontFamily: FONT_FAMILY,
      }}
    >
      {/* Subtle studio top light & soft bottom grounding gradient */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.68) 0%, rgba(232,234,238,0.1) 58%, rgba(148,163,184,0.22) 100%)',
        }}
      />

      {label && (
        <div
          style={{
            position: 'absolute',
            top: 84,
            left: SAFE_ZONE.left,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            backgroundColor: '#FFFFFF',
            border: `1.5px solid ${brand.cardBorder}`,
            borderRadius: 999,
            padding: '8px 18px',
            boxShadow: '0 6px 18px rgba(15, 23, 42, 0.06)',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 999,
              backgroundColor: brand.primary,
            }}
          />
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: brand.inkPrimary,
            }}
          >
            {label}
          </span>
        </div>
      )}
    </AbsoluteFill>
  );
};
