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

export default function AdminDashboard({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const toggleTheme = useSettingsStore(s => s.toggleTheme);
  const colors = getThemeColors(theme);
  const donations = useDonationStore(state => state.donations);
  const listings = useDonationStore(state => state.listings);
  const transactions = useDonationStore(state => state.transactions);

  const stats = {
    totalDonations: donations.length,
    pendingVerification: donations.filter(d => d.status === 'uploaded').length,
    totalListings: listings.length,
    totalCreditsCirculated: transactions.reduce((sum, t) => sum + t.amount, 0),
    activeBeneficiaries: new Set(transactions.map(t => t.beneficiaryId)).size,
    activeDonors: new Set(donations.map(d => d.donorId)).size,
  };

  const recentDonations = donations
    .filter(d => d.status === 'uploaded')
    .slice(0, 5);

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
        {/* Hero Header - Compact */}
        <View className="px-5 pt-2 pb-3">
          <GradientCard
            colors={['#EF4444', '#EC4899']}
            delay={0}
            shadow="2xl"
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-1">
                <Text className="text-white/80 text-xs font-medium mb-1">
                  Admin
                </Text>
                <Text className="text-white text-lg font-bold">
                  {user?.name}
                </Text>
              </View>
              <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                <Ionicons name="shield-checkmark" size={24} color="white" />
              </View>
            </View>
            
            <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-white/20">
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                <Text className="text-white/90 text-xs font-medium">
                  System Operational
                </Text>
              </View>
              <Text className="text-white/70 text-xs">
                98% AI Accuracy
              </Text>
            </View>
          </GradientCard>
        </View>

        {/* Key Metrics Grid */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            System Overview
          </Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={100}>
                <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mb-3">
                  <Ionicons name="gift" size={20} color="#3B82F6" />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.totalDonations}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Total Donations
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={150}>
                <View className="w-10 h-10 rounded-xl bg-amber-500/10 items-center justify-center mb-3">
                  <Ionicons name="time" size={20} color="#F59E0B" />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.pendingVerification}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Pending Review
                </Text>
                {stats.pendingVerification > 0 && (
                  <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500" />
                )}
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={200}>
                <View className="w-10 h-10 rounded-xl bg-green-500/10 items-center justify-center mb-3">
                  <Ionicons name="people" size={20} color="#10B981" />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.activeBeneficiaries}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Active Users
                </Text>
              </Card>
            </View>

            <View className="flex-1 min-w-[45%]">
              <Card shadow="lg" delay={250}>
                <View className="w-10 h-10 rounded-xl bg-purple-500/10 items-center justify-center mb-3">
                  <Ionicons name="wallet" size={20} color="#8B5CF6" />
                </View>
                <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                  {stats.totalCreditsCirculated}
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                  Credits in System
                </Text>
              </Card>
            </View>
          </View>
        </View>

        {/* Quick Actions - Admin Style */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            Admin Actions
          </Text>
          <View className="gap-3">
            <Card shadow="lg" delay={300} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable 
                className="flex-row items-center p-4"
                onPress={() => navigation.navigate('Verify')}
              >
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="checkmark-circle" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Verify Donations
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    {stats.pendingVerification} items pending verification
                  </Text>
                </View>
                {stats.pendingVerification > 0 && (
                  <View className="bg-red-500 px-2 py-1 rounded-full mr-2">
                    <Text className="text-white text-xs font-bold">
                      {stats.pendingVerification}
                    </Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={350} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable 
                className="flex-row items-center p-4"
                onPress={() => navigation.navigate('Users')}
              >
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="people" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Manage Users
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Handle user accounts and permissions
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={400} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable 
                className="flex-row items-center p-4"
                onPress={() => navigation.navigate('CreditManagement')}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="wallet" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Credit Management
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Adjust user credits and allocations
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={450} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable
                className="flex-row items-center p-4"
                onPress={() => navigation.navigate('Analytics')}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="bar-chart" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Analytics
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    View system usage and trends
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </Card>

            <Card shadow="lg" delay={500} style={{ padding: 0, overflow: 'hidden' }}>
              <Pressable
                className="flex-row items-center p-4"
                onPress={() => navigation.navigate('ManageDonations')}
              >
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  className="w-12 h-12 rounded-xl items-center justify-center"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="images" size={24} color="white" />
                </LinearGradient>
                <View className="ml-4 flex-1">
                  <Text style={{ color: colors.text }} className="font-bold text-base mb-0.5">
                    Manage Donations
                  </Text>
                  <Text style={{ color: colors.textSecondary }} className="text-sm">
                    Edit credits and remove images
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            </Card>
          </View>
        </View>

        {/* Pending Verifications */}
        <View className="px-5 mb-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            Pending Verifications
          </Text>
          {recentDonations.length > 0 ? (
            <View className="gap-3">
              {recentDonations.map((donation, index) => (
                <Card key={donation.id} shadow="lg" delay={500 + index * 50}>
                  <View className="mb-3">
                    <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                      {donation.title}
                    </Text>
                    <View className="flex-row items-center gap-2 mb-2">
                      <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-gray-700 text-xs font-medium">
                          {donation.category}
                        </Text>
                      </View>
                      <View className="bg-amber-500/10 px-2 py-1 rounded">
                        <Text className="text-amber-700 text-xs font-bold">
                          {donation.value} credits
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                        <Text className="text-gray-500 text-xs ml-1">
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      {donation.aiConfidence && (
                        <View className="flex-row items-center">
                          <Ionicons name="analytics-outline" size={12} color="#3B82F6" />
                          <Text className="text-gray-500 text-xs ml-1">
                            AI: {Math.round(donation.aiConfidence * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <View className="flex-row gap-2">
                    <Pressable className="flex-1 bg-green-500 py-2.5 rounded-lg flex-row items-center justify-center">
                      <Ionicons name="checkmark" size={18} color="white" />
                      <Text className="text-white font-bold text-sm ml-1">
                        Approve
                      </Text>
                    </Pressable>
                    <Pressable className="flex-1 bg-red-500 py-2.5 rounded-lg flex-row items-center justify-center">
                      <Ionicons name="close" size={18} color="white" />
                      <Text className="text-white font-bold text-sm ml-1">
                        Reject
                      </Text>
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={500}>
              <View className="py-4 items-center">
                <View className="w-20 h-20 rounded-full bg-green-100 items-center justify-center mb-4">
                  <Ionicons name="checkmark-circle" size={40} color="#10B981" />
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                  All Caught Up!
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                  No donations pending verification
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* System Health Banner */}
        <View className="px-5 mb-4">
          <GradientCard
            colors={['#3B82F6', '#8B5CF6']}
            delay={700}
            shadow="2xl"
          >
            <View className="items-center py-2">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Ionicons name="pulse" size={32} color="white" />
              </View>
              <Text className="text-white text-xl font-bold mb-4">
                System Health
              </Text>
              <View className="flex-row justify-around w-full">
                <View className="items-center">
                  <Text className="text-white text-2xl font-bold mb-1">
                    {stats.activeDonors}
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    Active Donors
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-2xl font-bold mb-1">
                    {stats.totalListings}
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    Total Items
                  </Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-2xl font-bold mb-1">
                    98%
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    AI Accuracy
                  </Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}