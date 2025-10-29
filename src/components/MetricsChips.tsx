import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, spacing, typography, borderRadius } from '../utils/theme';
import { translations } from '../utils/i18n';
import { getSystemStats } from '../utils/stats';

export default function MetricsChips() {
  const theme = useSettingsStore(s => s.theme);
  const language = useSettingsStore(s => s.language);
  const colors = getThemeColors(theme);
  const t = translations[language];
  const stats = getSystemStats();
  const isRTL = language === 'ar';

  const metrics = [
    { 
      label: t.totalDonations, 
      value: stats.formattedDonations,
      icon: 'gift' as const,
      color: '#0ea5e9',
    },
    { 
      label: t.itemsListed, 
      value: stats.formattedAllocations,
      icon: 'list' as const,
      color: '#8b5cf6',
    },
    { 
      label: t.itemsReceived, 
      value: stats.formattedVerifiedRate,
      icon: 'checkmark-circle' as const,
      color: '#10b981',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        directionalLockEnabled
      >
        <View style={[styles.chipsContainer, isRTL && styles.chipsContainerRTL]}>
          {metrics.map((metric, index) => (
            <MetricChip
              key={index}
              label={metric.label}
              value={metric.value}
              icon={metric.icon}
              color={metric.color}
              colors={colors}
              index={index}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

interface MetricChipProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  colors: any;
  index: number;
}

function MetricChip({ label, value, icon, color, colors, index }: MetricChipProps) {
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 100).duration(500).springify()}
      style={[
        styles.chip,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={[styles.iconBadge, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={[styles.value, { color: color }]}>
        {value}
      </Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipsContainerRTL: {
    flexDirection: 'row-reverse',
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    minWidth: 120,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});