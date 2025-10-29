import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
];

export default function LanguageScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 flex-row items-center" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: colors.surfaceHover }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Language
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="px-5 pt-4">
          <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
            Select your preferred language
          </Text>

          {languages.map((lang, index) => (
            <Card key={lang.code} shadow="lg" delay={index * 50} style={{ marginBottom: 12 }}>
              <Pressable onPress={() => setSelectedLanguage(lang.code)}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                      {lang.nativeName}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textSecondary }}>
                      {lang.name}
                    </Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  )}
                </View>
              </Pressable>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
