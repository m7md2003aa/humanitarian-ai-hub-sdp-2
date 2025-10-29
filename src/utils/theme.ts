export type ThemeType = 'light' | 'dark';

export interface ThemeColors {
  // Primary Colors with gradients
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryGradient: string[];
  
  // Accent with gradients
  accent: string;
  accentLight: string;
  accentGradient: string[];
  
  // Backgrounds with glassmorphism
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceHover: string;
  glass: string;
  
  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Borders
  border: string;
  borderLight: string;
  borderFocus: string;
  
  // Status with gradients
  error: string;
  errorGradient: string[];
  success: string;
  successGradient: string[];
  warning: string;
  warningGradient: string[];
  info: string;
  infoGradient: string[];
  
  // Role Colors with gradients
  donor: string;
  donorGradient: string[];
  beneficiary: string;
  beneficiaryGradient: string[];
  business: string;
  businessGradient: string[];
  admin: string;
  adminGradient: string[];
  
  // Overlay colors
  overlay: string;
  overlayLight: string;
  
  // Shadows
  shadowColor: string;
  glowColor: string;
}

export const lightTheme: ThemeColors = {
  // Primary - Vibrant Blue
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryGradient: ['#3B82F6', '#2563EB'],
  
  // Accent - Fresh Green
  accent: '#10B981',
  accentLight: '#34D399',
  accentGradient: ['#10B981', '#059669'],
  
  // Backgrounds - Soft & Airy
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceHover: '#F8FAFC',
  glass: 'rgba(255, 255, 255, 0.7)',
  
  // Text - High Contrast
  text: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Borders - Subtle
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#3B82F6',
  
  // Status with gradients
  error: '#EF4444',
  errorGradient: ['#EF4444', '#DC2626'],
  success: '#10B981',
  successGradient: ['#10B981', '#059669'],
  warning: '#F59E0B',
  warningGradient: ['#F59E0B', '#D97706'],
  info: '#3B82F6',
  infoGradient: ['#3B82F6', '#2563EB'],
  
  // Role Colors with beautiful gradients
  donor: '#3B82F6',
  donorGradient: ['#3B82F6', '#8B5CF6'],
  beneficiary: '#10B981',
  beneficiaryGradient: ['#10B981', '#06B6D4'],
  business: '#F59E0B',
  businessGradient: ['#F59E0B', '#EF4444'],
  admin: '#EF4444',
  adminGradient: ['#EF4444', '#EC4899'],
  
  // Overlays
  overlay: 'rgba(15, 23, 42, 0.5)',
  overlayLight: 'rgba(15, 23, 42, 0.3)',
  
  // Shadows & Glow
  shadowColor: '#000000',
  glowColor: '#3B82F6',
};

export const darkTheme: ThemeColors = {
  // Primary - Bright Blue
  primary: '#60A5FA',
  primaryLight: '#93C5FD',
  primaryDark: '#3B82F6',
  primaryGradient: ['#60A5FA', '#3B82F6'],
  
  // Accent - Bright Green
  accent: '#34D399',
  accentLight: '#6EE7B7',
  accentGradient: ['#34D399', '#10B981'],
  
  // Backgrounds - Rich Dark
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  surface: '#1E293B',
  surfaceElevated: '#334155',
  surfaceHover: '#334155',
  glass: 'rgba(30, 41, 59, 0.7)',
  
  // Text - Soft White
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textTertiary: '#94A3B8',
  textInverse: '#0F172A',
  
  // Borders - Subtle
  border: '#334155',
  borderLight: '#475569',
  borderFocus: '#60A5FA',
  
  // Status with gradients
  error: '#F87171',
  errorGradient: ['#F87171', '#EF4444'],
  success: '#34D399',
  successGradient: ['#34D399', '#10B981'],
  warning: '#FBBF24',
  warningGradient: ['#FBBF24', '#F59E0B'],
  info: '#60A5FA',
  infoGradient: ['#60A5FA', '#3B82F6'],
  
  // Role Colors with beautiful gradients
  donor: '#60A5FA',
  donorGradient: ['#60A5FA', '#A78BFA'],
  beneficiary: '#34D399',
  beneficiaryGradient: ['#34D399', '#22D3EE'],
  business: '#FBBF24',
  businessGradient: ['#FBBF24', '#F87171'],
  admin: '#F87171',
  adminGradient: ['#F87171', '#F472B6'],
  
  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  
  // Shadows & Glow
  shadowColor: '#000000',
  glowColor: '#60A5FA',
};

export const getThemeColors = (theme: ThemeType): ThemeColors => {
  return theme === 'light' ? lightTheme : darkTheme;
};

// Enhanced Typography with more weights
export const typography = {
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Enhanced Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
  '4xl': 64,
  '5xl': 96,
};

// Enhanced Border Radius
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Enhanced Shadows with more variants
export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  '2xl': {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
};

// Animation timings
export const animations = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'spring',
  },
};