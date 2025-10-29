import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { ItemCategory, ClothType } from '../../types/donations';
import { Card } from '../../components/Card';

const categories: { id: ItemCategory | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: 'grid' },
  { id: 'clothing', label: 'Clothing', icon: 'shirt' },
  { id: 'other', label: 'Other', icon: 'cube' },
];

export default function BusinessMarketplace({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allListings = useDonationStore(state => state.listings);

  // Show all available listings (both donated and priced items)
  const availableListings = allListings.filter(l =>
    l.isAvailable &&
    l.businessId !== user?.id // Don't show own listings
  );

  const filteredListings = availableListings.filter(listing => {
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemPress = (item: any) => {
    navigation.navigate('PurchaseItem', { item });
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Marketplace
        </Text>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          Purchase discounted items for your business
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Search Bar */}
        <View className="px-5 pt-4 pb-3">
          <View className="flex-row items-center px-4 py-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
            <Ionicons name="search" size={20} color={colors.textTertiary} />
            <TextInput
              className="flex-1 ml-3 text-base"
              style={{ color: colors.text }}
              placeholder="Search items..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Category Filter */}
        <View className="px-5 pb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row gap-2"
          >
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className="py-2 px-4 rounded-xl flex-row items-center"
                style={{
                  backgroundColor: selectedCategory === category.id
                    ? colors.primary
                    : colors.surfaceHover,
                  marginRight: 8,
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? 'white' : colors.text}
                />
                <Text
                  className="font-medium ml-2"
                  style={{
                    color: selectedCategory === category.id ? 'white' : colors.text
                  }}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Items Grid */}
        <View className="px-5">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold" style={{ color: colors.text }}>
              Available Items
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              {filteredListings.length} items
            </Text>
          </View>

          {filteredListings.length === 0 ? (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="cart-outline" size={40} color="#9CA3AF" />
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                  No Items Available
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                  Check back later for new items
                </Text>
              </View>
            </Card>
          ) : (
            <View className="flex-row flex-wrap gap-3">
              {filteredListings.map((listing, index) => (
                <Pressable
                  key={listing.id}
                  onPress={() => handleItemPress(listing)}
                  className="flex-1 min-w-[45%] max-w-[48%]"
                >
                  <Card shadow="lg" delay={index * 50}>
                    {/* Image */}
                    {listing.images[0] ? (
                      <Image
                        source={{ uri: listing.images[0] }}
                        className="w-full h-32 rounded-lg mb-3"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="w-full h-32 rounded-lg mb-3 items-center justify-center" style={{ backgroundColor: colors.surfaceHover }}>
                        <Ionicons name="image-outline" size={40} color={colors.textTertiary} />
                      </View>
                    )}

                    {/* Details */}
                    <Text className="font-bold text-sm mb-1" style={{ color: colors.text }} numberOfLines={2}>
                      {listing.title}
                    </Text>

                    <Text className="text-xs mb-2" style={{ color: colors.textSecondary }} numberOfLines={1}>
                      {listing.category}
                    </Text>

                    {/* Price */}
                    <View className="flex-row items-center justify-between">
                      <View>
                        <Text className="text-xs" style={{ color: colors.textTertiary }}>
                          {listing.price && listing.price > 0 ? 'Price' : 'Free Item'}
                        </Text>
                        <Text className="text-lg font-bold" style={{ color: listing.price && listing.price > 0 ? colors.success : colors.primary }}>
                          {listing.price && listing.price > 0 ? `$${listing.price}` : 'Donate'}
                        </Text>
                      </View>
                      <View className={`rounded-full px-3 py-1.5 ${listing.price && listing.price > 0 ? 'bg-blue-500' : 'bg-green-500'}`}>
                        <Text className="text-white text-xs font-bold">
                          {listing.price && listing.price > 0 ? 'Buy Now' : 'Get Free'}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
