import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, shadows, borderRadius, spacing } from '../utils/theme';

interface GradientCardProps {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
  style?: ViewStyle;
  delay?: number;
  shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const GradientCard: React.FC<GradientCardProps> = ({ 
  children, 
  colors, 
  style,
  delay = 0,
  shadow = 'lg',
}) => {
  const theme = useSettingsStore(s => s.theme);
  const themeColors = getThemeColors(theme);
  
  const gradientColors: [string, string, ...string[]] = colors || [themeColors.primaryGradient[0], themeColors.primaryGradient[1]];
  
  return (
    <Animated.View
      entering={FadeIn.delay(delay).duration(500).springify()}
      style={[
        styles.container,
        {
          ...shadows[shadow],
          shadowColor: themeColors.shadowColor,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
  },
});
