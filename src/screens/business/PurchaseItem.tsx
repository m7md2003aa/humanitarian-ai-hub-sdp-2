import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';

const paymentMethods = [
  { id: 'card', name: 'Credit Card', icon: 'card' },
  { id: 'paypal', name: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple', name: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google', name: 'Google Pay', icon: 'logo-google' },
];

export default function PurchaseItem({ navigation, route }: any) {
  const { item } = route.params;
  const insets = useSafeAreaInsets();
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const purchaseItem = useDonationStore(state => state.purchaseItem);

  const handlePurchase = async () => {
    const isFreeItem = !item.price || item.price === 0;

    if (!isFreeItem && !selectedPayment) {
      Alert.alert('Payment Method Required', 'Please select a payment method');
      return;
    }

    Alert.alert(
      isFreeItem ? 'Confirm Collection' : 'Confirm Purchase',
      isFreeItem
        ? `Collect ${item.title} for free?`
        : `Purchase ${item.title} for $${item.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isFreeItem ? 'Collect' : 'Purchase',
          onPress: async () => {
            setIsPurchasing(true);

            try {
              // Simulate payment processing (only if it's a paid item)
              if (!isFreeItem) {
                await new Promise(resolve => setTimeout(resolve, 2000));
              }

              // Mark item as purchased
              purchaseItem(item.id, user?.id || '');

              // Navigate to success screen
              navigation.replace('PurchaseSuccess', { item });
            } catch (error) {
              Alert.alert(
                isFreeItem ? 'Collection Failed' : 'Purchase Failed',
                'Please try again'
              );
              setIsPurchasing(false);
            }
          },
        },
      ]
    );
  };

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
          Purchase Item
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Item Preview */}
        <View className="px-5 pt-4">
          <GradientCard
            colors={['#F59E0B', '#EF4444']}
            delay={0}
            shadow="2xl"
          >
            <View className="items-center py-4">
              {item.images[0] ? (
                <Image
                  source={{ uri: item.images[0] }}
                  className="w-full h-48 rounded-xl mb-4"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-48 rounded-xl mb-4 bg-white/20 items-center justify-center">
                  <Ionicons name="image-outline" size={60} color="white" />
                </View>
              )}
              <Text className="text-white text-xl font-bold mb-2 text-center">
                {item.title}
              </Text>
              <Text className="text-white/80 text-sm text-center mb-4">
                {item.description || 'No description'}
              </Text>
              <View className="bg-white/20 px-4 py-2 rounded-full">
                <Text className="text-white font-bold text-lg">
                  {item.price && item.price > 0 ? `$${item.price}` : 'FREE'}
                </Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Item Details */}
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Item Details
          </Text>

          <Card shadow="lg" delay={100} style={{ marginBottom: 12 }}>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                Category
              </Text>
              <Text className="text-sm font-bold" style={{ color: colors.text }}>
                {item.category}
              </Text>
            </View>
            {item.clothType && (
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Type
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.text }}>
                  {item.clothType}
                </Text>
              </View>
            )}
            {item.size && (
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Size
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.text }}>
                  {item.size}
                </Text>
              </View>
            )}
            {item.color && (
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Color
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.text }}>
                  {item.color}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Payment Method - Only show if item has a price */}
        {item.price && item.price > 0 && (
          <View className="px-5 pt-4">
            <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              Payment Method
            </Text>

            {paymentMethods.map((method, index) => (
            <Card key={method.id} shadow="lg" delay={150 + index * 50} style={{ marginBottom: 12 }}>
              <Pressable
                onPress={() => setSelectedPayment(method.id)}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <Ionicons name={method.icon as any} size={24} color={colors.primary} />
                  </View>
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    {method.name}
                  </Text>
                </View>
                {selectedPayment === method.id && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </Pressable>
            </Card>
          ))}
        </View>
        )}

        {/* Purchase Summary */}
        <View className="px-5 pt-4">
          <Card shadow="lg" delay={350}>
            <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
              {item.price && item.price > 0 ? 'Purchase Summary' : 'Collection Summary'}
            </Text>
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Item {item.price && item.price > 0 ? 'Price' : 'Value'}
              </Text>
              <Text className="text-sm font-bold" style={{ color: colors.text }}>
                {item.price && item.price > 0 ? `$${item.price}` : 'FREE'}
              </Text>
            </View>
            {item.price && item.price > 0 && (
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  Processing Fee
                </Text>
                <Text className="text-sm font-bold" style={{ color: colors.text }}>
                  $0.00
                </Text>
              </View>
            )}
            <View className="h-px my-3" style={{ backgroundColor: colors.border }} />
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Total
              </Text>
              <Text className="text-xl font-bold" style={{ color: item.price && item.price > 0 ? colors.success : colors.primary }}>
                {item.price && item.price > 0 ? `$${item.price}` : 'FREE'}
              </Text>
            </View>
          </Card>
        </View>

        {/* Purchase Button */}
        <View className="px-5 pt-4">
          <Card shadow="lg" delay={400} style={{ padding: 0, overflow: 'hidden' }}>
            <Pressable onPress={handlePurchase} disabled={isPurchasing}>
              <LinearGradient
                colors={isPurchasing ? ['#9CA3AF', '#6B7280'] : ['#10B981', '#059669']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 px-4 flex-row items-center justify-center"
              >
                {isPurchasing ? (
                  <>
                    <Ionicons name="hourglass" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-3">
                      Processing...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons name={item.price && item.price > 0 ? "card" : "checkmark-circle"} size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-3">
                      {item.price && item.price > 0 ? 'Complete Purchase' : 'Collect Item'}
                    </Text>
                  </>
                )}
              </LinearGradient>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
