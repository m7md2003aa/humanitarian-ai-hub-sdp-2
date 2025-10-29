import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';

export default function AboutScreen({ navigation }: any) {
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
          About
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="px-5 pt-4">
          <GradientCard
            colors={['#3B82F6', '#8B5CF6']}
            delay={0}
            shadow="2xl"
          >
            <View className="items-center py-6">
              <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-4">
                <Ionicons name="heart" size={40} color="white" />
              </View>
              <Text className="text-white text-2xl font-bold mb-2">
                Vibecode
              </Text>
              <Text className="text-white/80 text-sm mb-4">
                Version 1.0.0
              </Text>
              <Text className="text-white/90 text-center text-sm">
                Making charity accessible through AI and community
              </Text>
            </View>
          </GradientCard>

          <Text className="text-lg font-bold mb-3 mt-6" style={{ color: colors.text }}>
            Our Mission
          </Text>

          <Card shadow="lg" delay={100} style={{ marginBottom: 12 }}>
            <Text className="text-sm leading-6" style={{ color: colors.textSecondary }}>
              Vibecode connects donors with those in need through a seamless, AI-powered platform.
              We believe in making charity simple, transparent, and impactful for everyone.
            </Text>
          </Card>

          <Text className="text-lg font-bold mb-3 mt-4" style={{ color: colors.text }}>
            Features
          </Text>

          <Card shadow="lg" delay={150} style={{ marginBottom: 12 }}>
            <View className="flex-row items-start mb-3">
              <Ionicons name="camera" size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  AI-Powered Classification
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Automatically categorize donations using advanced AI
                </Text>
              </View>
            </View>
          </Card>

          <Card shadow="lg" delay={200} style={{ marginBottom: 12 }}>
            <View className="flex-row items-start mb-3">
              <Ionicons name="wallet" size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  Credit System
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Fair distribution through a transparent credit system
                </Text>
              </View>
            </View>
          </Card>

          <Card shadow="lg" delay={250} style={{ marginBottom: 12 }}>
            <View className="flex-row items-start mb-3">
              <Ionicons name="shield-checkmark" size={20} color={colors.primary} style={{ marginRight: 12, marginTop: 2 }} />
              <View className="flex-1">
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  Verified Donations
                </Text>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  All donations are verified by our admin team
                </Text>
              </View>
            </View>
          </Card>

          <Text className="text-lg font-bold mb-3 mt-4" style={{ color: colors.text }}>
            Legal
          </Text>

          <Card shadow="lg" delay={300} style={{ marginBottom: 12 }}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-base" style={{ color: colors.text }}>
                  Terms of Service
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <Card shadow="lg" delay={350} style={{ marginBottom: 12 }}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-base" style={{ color: colors.text }}>
                  Privacy Policy
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <Card shadow="lg" delay={400}>
            <Pressable>
              <View className="flex-row items-center justify-between">
                <Text className="font-bold text-base" style={{ color: colors.text }}>
                  Licenses
                </Text>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <View className="items-center mt-6 mb-4">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Made with ❤️ by Vibecode Team
            </Text>
            <Text className="text-xs mt-2" style={{ color: colors.textTertiary }}>
              © 2025 Vibecode. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
