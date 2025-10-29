import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, borderRadius, spacing, typography, shadows } from '../utils/theme';

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
  index: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RoleCard({ icon, title, description, color, onPress, index }: RoleCardProps) {
  const theme = useSettingsStore(s => s.theme);
  const language = useSettingsStore(s => s.language);
  const colors = getThemeColors(theme);
  const isRTL = language === 'ar';
  
  const scale = useSharedValue(1);
  const elevation = useSharedValue(4);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    elevation: elevation.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
    elevation.value = withSpring(2);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    elevation.value = withSpring(4);
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 100).duration(500).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        animatedStyle,
        { 
          backgroundColor: colors.surface,
          borderColor: colors.border,
          ...shadows.md,
          shadowColor: colors.shadowColor,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}: ${description}`}
    >
      {/* Icon Container */}
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Arrow Indicator */}
      <View style={[styles.arrowContainer, isRTL && styles.arrowContainerRTL]}>
        <Ionicons 
          name={isRTL ? "arrow-back" : "arrow-forward"} 
          size={20} 
          color={color} 
        />
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 160,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  content: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.regular,
    lineHeight: typography.fontSize.sm * typography.lineHeight.normal,
  },
  arrowContainer: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  arrowContainerRTL: {
    alignSelf: 'flex-end',
  },
});