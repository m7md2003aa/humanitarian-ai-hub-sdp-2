import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientCard } from '../../components/GradientCard';
import { Card } from '../../components/Card';
import { getThemeColors } from '../../utils/theme';

export default function BusinessDashboard() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const toggleTheme = useSettingsStore(s => s.toggleTheme);
  const colors = getThemeColors(theme);
  const allListings = useDonationStore(state => state.listings);
  
  // Compute filtered listings in component
  const listings = allListings.filter(listing => 
    listing.isAvailable && listing.businessId === user?.id
  );

  const stats = {
    totalListings: listings.length,
    itemsDonated: listings.filter(l => !l.price).length,
    itemsSold: listings.filter(l => l.price && l.price > 0).length,
    communityImpact: listings.reduce((sum, l) => sum + l.credits, 0),
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      {/* Dark Mode Toggle - Top Right */}
      <View className="flex-row items-center px-5 py-2">
        <View className="flex-1" />
        <Pressable 
          onPress={toggleTheme}
          className="w-11 h-11 rounded-full items-center justify-center"
          style={{ backgroundColor: colors.surfaceHover, shadowColor: colors.shadowColor, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }}
        >
          <Ionicons 
            name={theme === 'dark' ? 'sunny' : 'moon'} 
            size={22} 
            color={colors.text} 
          />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Hero Header */}
        <View className="px-5 pt-4 pb-3">
          <GradientCard
            colors={['#F59E0B', '#EF4444']}
            delay={0}
            shadow="2xl"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-1">
                <Text className="text-white/80 text-sm font-medium mb-1">
                  Welcome back
                </Text>
                <Text className="text-white text-2xl font-bold">
                  {user?.name}
                </Text>
              </View>
              <View className="w-14 h-14 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="storefront" size={28} color="white" />
              </View>
            </View>
            
            <View className="flex-row items-center">
              <View className={`px-3 py-1.5 rounded-full ${
                user?.businessVerified 
                  ? 'bg-green-500/30' 
                  : 'bg-yellow-500/30'
              }`}>
                <View className="flex-row items-center">
                  <Ionicons 
                    name={user?.businessVerified ? "checkmark-circle" : "time"} 
                    size={14} 
                    color="white" 
                  />
                  <Text className="text-white text-xs font-semibold ml-1">
                    {user?.businessVerified ? 'Verified Business' : 'Pending Verification'}
                  </Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Stats Grid */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            Business Impact
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={100}>
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: colors.primary + '20' }}>
                  <Ionicons name="list" size={20} color={colors.primary} />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.totalListings}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Total Listings
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={150}>
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: colors.success + '20' }}>
                  <Ionicons name="gift" size={20} color={colors.success} />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.itemsDonated}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Items Donated
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={200}>
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: colors.warning + '20' }}>
                  <Ionicons name="cash" size={20} color={colors.warning} />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.itemsSold}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Items Sold
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={250}>
                <View className="w-10 h-10 rounded-xl items-center justify-center mb-3" style={{ backgroundColor: '#8B5CF6' + '20' }}>
                  <Ionicons name="heart" size={20} color="#8B5CF6" />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.communityImpact}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Credits Given
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            Quick Actions
          </Text>
          <View className="gap-3">
            <Card shadow="lg" delay={300} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable className="flex-row items-center p-4">
                <LinearGradient
                  colors={['#F59E0B', '#EF4444']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="add-circle" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Upload Surplus Items
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Share excess inventory with community
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={350} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable className="flex-row items-center p-4">
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="gift" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Donate Items
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Free donations to help those in need
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={400} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable className="flex-row items-center p-4">
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="pricetag" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Discounted Sales
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Offer items at reduced prices
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </Pressable>
            </Card>
          </View>
        </View>

        {/* Recent Listings */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            Recent Listings
          </Text>
          {listings.length > 0 ? (
            <View className="gap-3">
              {listings.slice(0, 3).map((listing, index) => (
                <Card key={listing.id} shadow="lg" delay={450 + index * 50}>
                  <View className="flex-row items-start justify-between">
                    <View className="flex-1 mr-3">
                      <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                        {listing.title}
                      </Text>
                      <Text style={{ color: colors.textSecondary }} className="text-sm mb-2">
                        {listing.category}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                        <Text style={{ color: colors.textTertiary }} className="text-xs ml-1">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <View className="items-end">
                      <View className="px-3 py-1.5 rounded-full mb-2" style={{ 
                        backgroundColor: listing.price ? colors.warning + '20' : colors.success + '20' 
                      }}>
                        <Text style={{ 
                          color: listing.price ? colors.warning : colors.success 
                        }} className="text-xs font-bold">
                          {listing.price ? `$${listing.price}` : 'Free'}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={12} color={colors.warning} />
                        <Text style={{ color: colors.text }} className="text-xs font-semibold ml-1">
                          {listing.credits} credits
                        </Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={450}>
              <View className="py-4 items-center">
                <View className="w-20 h-20 rounded-full items-center justify-center mb-4" style={{ backgroundColor: colors.surfaceHover }}>
                  <Ionicons name="storefront-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                  No Listings Yet
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                  Start by uploading surplus items to help your community!
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Community Impact Banner */}
        <View className="px-5 mb-4">
          <GradientCard
            colors={['#F59E0B', '#EF4444']}
            delay={600}
            shadow="2xl"
          >
            <View className="items-center py-2">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Ionicons name="people" size={32} color="white" />
              </View>
              <Text className="text-white text-xl font-bold mb-2">
                Community Impact
              </Text>
              <Text className="text-white/90 text-center text-sm leading-5">
                Your business has helped provide{" "}
                <Text className="font-bold">{stats.communityImpact} credits</Text>
                {" "}worth of items to community members in need.
              </Text>
            </View>
          </GradientCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}