import React from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, shadows, borderRadius, spacing } from '../utils/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  shadow?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  animated?: boolean;
  delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Card: React.FC<CardProps> = ({ 
  children, 
  onPress, 
  style,
  shadow = 'lg',
  animated = true,
  delay = 0,
}) => {
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      ...shadows[shadow],
      shadowColor: colors.shadowColor,
    },
    style,
  ];
  
  if (onPress) {
    return (
      <AnimatedPressable
        entering={animated ? FadeInDown.delay(delay).duration(600).springify() : undefined}
        onPress={onPress}
        style={({ pressed }) => [
          ...cardStyle,
          pressed && styles.pressed
        ]}
      >
        {children}
      </AnimatedPressable>
    );
  }
  
  return (
    <Animated.View 
      entering={animated ? FadeInDown.delay(delay).duration(600).springify() : undefined}
      style={cardStyle}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
