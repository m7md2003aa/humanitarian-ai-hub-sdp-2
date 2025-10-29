import React from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors } from '../utils/theme';

export default function Footer() {
  const theme = useSettingsStore(state => state.theme);
  const colors = getThemeColors(theme);

  const links = [
    { label: 'About', url: '#' },
    { label: 'Privacy', url: '#' },
    { label: 'Terms', url: '#' },
    { label: 'Contact', url: '#' },
  ];

  const handleLinkPress = (url: string) => {
    if (url !== '#') {
      Linking.openURL(url);
    }
  };

  return (
    <View className="px-6 py-10 items-center">
      {/* Links */}
      <View className="flex-row flex-wrap justify-center mb-4">
        {links.map((link, index) => (
          <React.Fragment key={index}>
            <Pressable onPress={() => handleLinkPress(link.url)}>
              <Text 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                {link.label}
              </Text>
            </Pressable>
            {index < links.length - 1 && (
              <Text 
                className="text-sm mx-2"
                style={{ color: colors.border }}
              >
                •
              </Text>
            )}
          </React.Fragment>
        ))}
      </View>

      {/* Version Info */}
      <Text 
        className="text-xs"
        style={{ color: colors.textSecondary, opacity: 0.6 }}
      >
        v1.0.0 • Build 2025.01
      </Text>

      {/* Security Note with Icon */}
      <View className="flex-row items-center justify-center mt-3">
        <Ionicons name="lock-closed" size={14} color={colors.success} />
        <Text 
          className="text-xs text-center ml-1"
          style={{ color: colors.textSecondary, opacity: 0.8 }}
        >
          Encrypted & secure via Supabase
        </Text>
      </View>
    </View>
  );
}