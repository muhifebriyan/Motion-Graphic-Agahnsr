import { loadFont } from '@remotion/google-fonts/PlusJakartaSans';

const { fontFamily } = loadFont('normal', {
  weights: ['500', '600', '700', '800'],
  subsets: ['latin'],
});

export const FONT_FAMILY = fontFamily;

export type ThemeMode = 'persib' | 'football' | 'personal';

export interface BrandTheme {
  mode: ThemeMode;
  primary: string;
  secondary: string;
  gradientEnd: string;
  glowColor: string;
  softTint: string;
  stageBg: string;
  stageDot: string;
  dimmedOverlay: string;
  cardBg: string;
  cardBorder: string;
  inkPrimary: string;
  inkMuted: string;
  darkSurface: string;
  pillBg: string;
  pillText: string;
  textPrimary: string;
  textMuted: string;
  positive: string;
  negative: string;
}

const BASE_EDITORIAL = {
  stageBg: '#E8EAEE',
  stageDot: '#CBD5E1',
  dimmedOverlay: 'rgba(8, 12, 22, 0.62)',
  cardBg: '#FFFFFF',
  cardBorder: 'rgba(15, 23, 42, 0.10)',
  inkPrimary: '#0F172A',
  inkMuted: '#475569',
  darkSurface: 'rgba(15, 23, 42, 0.90)',
  pillBg: '#FFFFFF',
  pillText: '#0F172A',
  textPrimary: '#FFFFFF',
  textMuted: '#CBD5E1',
  positive: '#16A34A',
  negative: '#DC2626',
};

const THEMES: Record<ThemeMode, BrandTheme> = {
  persib: {
    ...BASE_EDITORIAL,
    mode: 'persib',
    primary: '#2563EB',
    secondary: '#FACC15',
    gradientEnd: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    softTint: '#DBEAFE',
  },
  football: {
    ...BASE_EDITORIAL,
    mode: 'football',
    primary: '#16A34A',
    secondary: '#FACC15',
    gradientEnd: '#4ADE80',
    glowColor: 'rgba(74, 222, 128, 0.55)',
    softTint: '#DCFCE7',
  },
  personal: {
    ...BASE_EDITORIAL,
    mode: 'personal',
    primary: '#FF6B35',
    secondary: '#FDBA74',
    gradientEnd: '#FF8C5A',
    glowColor: 'rgba(255, 107, 53, 0.55)',
    softTint: '#FFEDD5',
  },
};

export const getBrandTheme = (mode: ThemeMode): BrandTheme => THEMES[mode];

export const SAFE_ZONE = {
  top: 130,
  stageTop: 175,
  bottom: 175,
  left: 56,
  right: 108,
};

export const SPRING_SNAPPY = { damping: 14, stiffness: 240, mass: 0.65 };
export const SPRING_SMOOTH = { damping: 18, stiffness: 150, mass: 0.9 };
export const SPRING_STAGE = { damping: 17, stiffness: 135, mass: 0.95 };
