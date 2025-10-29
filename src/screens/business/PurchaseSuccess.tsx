import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { GradientCard } from '../../components/GradientCard';

export default function PurchaseSuccess({ navigation, route }: any) {
  const { item } = route.params;
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 items-center justify-center px-5">
        {/* Success Animation */}
        <View className="w-32 h-32 rounded-full items-center justify-center mb-6" style={{ backgroundColor: colors.success + '15' }}>
          <Ionicons name="checkmark-circle" size={100} color={colors.success} />
        </View>

        {/* Success Message */}
        <Text className="text-3xl font-bold mb-3 text-center" style={{ color: colors.text }}>
          {item.price && item.price > 0 ? 'Purchase Successful!' : 'Item Collected!'}
        </Text>

        <Text className="text-base text-center mb-8" style={{ color: colors.textSecondary }}>
          {item.price && item.price > 0
            ? `You have successfully purchased ${item.title} for $${item.price}`
            : `You have successfully collected ${item.title} for free`}
        </Text>

        {/* Purchase Details */}
        <View className="w-full mb-6">
          <GradientCard
            colors={['#10B981', '#059669']}
            delay={0}
            shadow="2xl"
          >
            <View className="py-4">
              <Text className="text-white text-center text-lg font-bold mb-4">
                {item.price && item.price > 0 ? 'Purchase Details' : 'Collection Details'}
              </Text>
              <View className="flex-row items-center justify-between mb-2 px-2">
                <Text className="text-white/80 text-sm">
                  Item
                </Text>
                <Text className="text-white font-bold text-sm">
                  {item.title}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mb-2 px-2">
                <Text className="text-white/80 text-sm">
                  {item.price && item.price > 0 ? 'Amount Paid' : 'Value'}
                </Text>
                <Text className="text-white font-bold text-sm">
                  {item.price && item.price > 0 ? `$${item.price}` : 'FREE'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between px-2">
                <Text className="text-white/80 text-sm">
                  {item.price && item.price > 0 ? 'Transaction Date' : 'Collection Date'}
                </Text>
                <Text className="text-white font-bold text-sm">
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Action Buttons */}
        <View className="w-full gap-3">
          <Pressable
            onPress={() => navigation.navigate('Main')}
            className="w-full"
          >
            <LinearGradient
              colors={['#F59E0B', '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 rounded-xl"
            >
              <Text className="text-white font-bold text-center text-lg">
                Back to Dashboard
              </Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Marketplace')}
            className="py-4 rounded-xl"
            style={{ backgroundColor: colors.surfaceHover }}
          >
            <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
              Browse More Items
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
