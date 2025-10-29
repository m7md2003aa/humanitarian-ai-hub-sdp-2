import React from 'react';
import { View, Text, Pressable, StyleSheet, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../state/settingsStore';
import { useNotificationStore } from '../state/notificationStore';
import { getThemeColors, spacing, typography, borderRadius } from '../utils/theme';
import { translations } from '../utils/i18n';

interface TopAppBarProps {
  showNotifications?: boolean;
  transparent?: boolean;
}

export default function TopAppBar({ showNotifications = true, transparent = false }: TopAppBarProps) {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const language = useSettingsStore(s => s.language);
  const theme = useSettingsStore(s => s.theme);
  const toggleLanguage = useSettingsStore(s => s.toggleLanguage);
  const colors = getThemeColors(theme);
  const notifications = useNotificationStore(s => s.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const t = translations[language];
  const isRTL = language === 'ar';
  
  const handleLanguageToggle = () => {
    toggleLanguage();
    // Force RTL layout change
    I18nManager.forceRTL(language === 'en');
    // Note: In production, you'd want to restart the app or use a proper RTL solution
  };
  
  const handleNotificationsPress = () => {
    if (navigation && showNotifications) {
      navigation.navigate('Notifications');
    }
  };

  return (
    <View 
      style={[
        styles.container,
        {
          paddingTop: insets.top + spacing.sm,
          backgroundColor: transparent ? 'transparent' : colors.surface,
          borderBottomColor: transparent ? 'transparent' : colors.border,
        },
      ]}
    >
      <View style={[styles.content, isRTL && styles.contentRTL]}>
        {/* Logo and Brand */}
        <View style={[styles.logoContainer, isRTL && styles.logoContainerRTL]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="heart" size={20} color="#FFFFFF" />
          </View>
          <Text style={[styles.brandText, { color: colors.text }]}>
            {t.appName}
          </Text>
        </View>

        {/* Actions */}
        <View style={[styles.actionsContainer, isRTL && styles.actionsContainerRTL]}>
          {/* Language Toggle */}
          <Pressable
            onPress={handleLanguageToggle}
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.surfaceHover },
              pressed && styles.pressed,
            ]}
            accessibilityLabel="Toggle language"
            accessibilityHint="Switch between English and Arabic"
          >
            <Text style={[styles.languageText, { color: colors.text }]}>
              {language === 'en' ? 'EN' : 'ع'}
            </Text>
          </Pressable>

          {/* Notifications */}
          {showNotifications && (
            <Pressable
              onPress={handleNotificationsPress}
              style={({ pressed }) => [
                styles.actionButton,
                { backgroundColor: colors.surfaceHover },
                pressed && styles.pressed,
              ]}
              accessibilityLabel="Notifications"
              accessibilityHint={`You have ${unreadCount} unread notifications`}
            >
              <Ionicons name="notifications-outline" size={20} color={colors.text} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.error }]}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoContainerRTL: {
    flexDirection: 'row-reverse',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionsContainerRTL: {
    flexDirection: 'row-reverse',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  languageText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
  },
});