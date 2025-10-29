import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

export default function PrivacyScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);

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
          Privacy & Security
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Data & Privacy
          </Text>

          <Card shadow="lg" delay={0} style={{ marginBottom: 12 }}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  Data Collection
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  We collect minimal data to improve your experience
                </Text>
              </View>
              <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
            </View>
          </Card>

          <Card shadow="lg" delay={50} style={{ marginBottom: 12 }}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  Location Services
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Used to find nearby items and donors
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </Card>

          <Card shadow="lg" delay={100} style={{ marginBottom: 12 }}>
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  Analytics
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Help us improve the app
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </Card>

          <Text className="text-lg font-bold mb-3 mt-4" style={{ color: colors.text }}>
            Account Security
          </Text>

          <Card shadow="lg" delay={150} style={{ marginBottom: 12 }}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                    Change Password
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Update your account password
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <Card shadow="lg" delay={200} style={{ marginBottom: 12 }}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                    Two-Factor Authentication
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Add an extra layer of security
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <Card shadow="lg" delay={250}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1 text-red-500">
                    Delete Account
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Permanently delete your account and data
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#EF4444" />
              </View>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
