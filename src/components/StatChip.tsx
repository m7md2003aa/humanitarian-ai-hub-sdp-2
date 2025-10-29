import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, borderRadius, typography, spacing } from '../utils/theme';
import { Card } from './Card';

interface StatChipProps {
  label: string;
  value: string | number;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  mini?: boolean;
}

export const StatChip: React.FC<StatChipProps> = ({ 
  label,
  value,
  icon,
  color,
  trend,
  trendValue,
  mini = false,
}) => {
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  
  const iconColor = color || colors.primary;
  
  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend) {
      case 'up':
        return <Ionicons name="trending-up" size={12} color={colors.success} />;
      case 'down':
        return <Ionicons name="trending-down" size={12} color={colors.error} />;
      case 'neutral':
        return <Ionicons name="remove" size={12} color={colors.textTertiary} />;
    }
  };
  
  if (mini) {
    return (
      <View style={[styles.miniContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={icon} size={16} color={iconColor} />
          </View>
        )}
        <View style={styles.miniContent}>
          <Text style={[styles.miniValue, { color: colors.text }]}>{value}</Text>
          <Text style={[styles.miniLabel, { color: colors.textSecondary }]}>{label}</Text>
        </View>
      </View>
    );
  }
  
  return (
    <Card shadow="sm" style={styles.container}>
      <View style={styles.header}>
        {icon && (
          <View style={[styles.iconContainerLarge, { backgroundColor: iconColor + '15' }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
        )}
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
      
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        {trend && trendValue && (
          <View style={styles.trendContainer}>
            {getTrendIcon()}
            <Text style={[styles.trendText, { color: colors.textTertiary }]}>{trendValue}</Text>
          </View>
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 140,
  },
  header: {
    marginBottom: spacing.sm,
  },
  iconContainerLarge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  value: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.bold,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  
  // Mini variant
  miniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniContent: {
    flex: 1,
  },
  miniValue: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  miniLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
});
