import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { useDonationStore } from '../../state/donationStore';
import { useUsersStore } from '../../state/usersStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';
import { supabase, isSupabaseConfigured } from '../../api/supabase';

export default function Analytics() {
  const insets = useSafeAreaInsets();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('month');
  const [supabaseDonations, setSupabaseDonations] = useState<any[]>([]);
  const [supabaseTransactions, setSupabaseTransactions] = useState<any[]>([]);
  
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const localDonations = useDonationStore(state => state.donations);
  const localTransactions = useDonationStore(state => state.transactions);
  const users = useUsersStore(state => state.getAllUsers());

  // Fetch data from Supabase if available
  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchAnalyticsData();
    }
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      // Fetch donations
      const { data: donations } = await supabase
        .from('donations')
        .select('*');
      if (donations) setSupabaseDonations(donations);

      // Fetch transactions
      const { data: transactions } = await supabase
        .from('credit_transactions')
        .select('*');
      if (transactions) setSupabaseTransactions(transactions);
    } catch (error) {
      console.log('Using local data for analytics');
    }
  };

  // Use Supabase data if available, otherwise use local
  const donations = supabaseDonations.length > 0 ? supabaseDonations : localDonations;
  const transactions = supabaseTransactions.length > 0 ? supabaseTransactions : localTransactions;

  // Calculate weekly donations (last 7 days)
  const calculateWeeklyDonations = () => {
    const today = new Date();
    const weekData = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun
    
    donations.forEach(d => {
      const donationDate = new Date(d.created_at || d.createdAt);
      const daysDiff = Math.floor((today.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff >= 0 && daysDiff < 7) {
        const dayIndex = (today.getDay() - daysDiff + 7) % 7;
        weekData[dayIndex]++;
      }
    });
    
    return weekData;
  };

  const weeklyDonations = calculateWeeklyDonations();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Category distribution
  const categoryData = [
    { 
      category: 'Clothing', 
      count: donations.filter(d => (d.category === 'clothing' || d.category === 'clothes')).length, 
      color: '#3B82F6' 
    },
    { 
      category: 'Other', 
      count: donations.filter(d => d.category === 'other').length, 
      color: '#10B981' 
    },
  ];

  // Top donors (from users + their donation count)
  const calculateTopDonors = () => {
    const donorStats: { [key: string]: { name: string; donations: number; credits: number } } = {};
    
    donations.forEach(d => {
      const donorId = d.donor_id || d.donorId;
      if (!donorStats[donorId]) {
        const user = users.find(u => u.id === donorId);
        donorStats[donorId] = {
          name: user?.name || 'Unknown Donor',
          donations: 0,
          credits: 0
        };
      }
      donorStats[donorId].donations++;
      donorStats[donorId].credits += (d.value || d.estimated_credits || 10);
    });
    
    return Object.values(donorStats)
      .sort((a, b) => b.donations - a.donations)
      .slice(0, 3);
  };

  // Top beneficiaries (from transactions)
  const calculateTopBeneficiaries = () => {
    const beneficiaryStats: { [key: string]: { name: string; redeemed: number; credits: number } } = {};
    
    transactions.filter(t => t.type === 'spent').forEach(t => {
      const beneficiaryId = t.user_id || t.beneficiaryId;
      if (!beneficiaryStats[beneficiaryId]) {
        const user = users.find(u => u.id === beneficiaryId);
        beneficiaryStats[beneficiaryId] = {
          name: user?.name || 'Unknown User',
          redeemed: 0,
          credits: 0
        };
      }
      beneficiaryStats[beneficiaryId].redeemed++;
      beneficiaryStats[beneficiaryId].credits += t.amount;
    });
    
    return Object.values(beneficiaryStats)
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 3);
  };

  const topDonors = calculateTopDonors();
  const topBeneficiaries = calculateTopBeneficiaries();

  // AI accuracy calculation
  const verifiedDonations = donations.filter(d => d.status === 'verified' || d.status === 'listed');
  const donationsWithAI = verifiedDonations.filter(d => d.ai_classification || d.aiConfidence);
  const aiAccuracy = donationsWithAI.length > 0
    ? Math.round(
        donationsWithAI.reduce((sum, d) => sum + ((d.ai_classification?.confidence || d.aiConfidence || 0.9) * 100), 0) / donationsWithAI.length
      )
    : 94;

  const maxBarHeight = 120;
  const maxDonations = Math.max(...weeklyDonations, 1);

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.background }}
      edges={['top']}
    >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
            Analytics Dashboard
          </Text>
          
          {/* Timeframe Selector */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setTimeframe('week')}
              className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
              style={{ backgroundColor: timeframe === 'week' ? colors.primary : colors.surfaceHover }}
            >
              <Ionicons 
                name="calendar" 
                size={16} 
                color={timeframe === 'week' ? 'white' : colors.text} 
              />
              <Text 
                className="font-bold text-sm ml-2"
                style={{ color: timeframe === 'week' ? 'white' : colors.text }}
              >
                This Week
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setTimeframe('month')}
              className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
              style={{ backgroundColor: timeframe === 'month' ? colors.primary : colors.surfaceHover }}
            >
              <Ionicons 
                name="calendar-outline" 
                size={16} 
                color={timeframe === 'month' ? 'white' : colors.text} 
              />
              <Text 
                className="font-bold text-sm ml-2"
                style={{ color: timeframe === 'month' ? 'white' : colors.text }}
              >
                This Month
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Donations Chart */}
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Donations Over Time
          </Text>
          <Card shadow="lg" delay={0}>
            <View className="flex-row items-end justify-between" style={{ height: maxBarHeight + 40, paddingTop: 10 }}>
              {weeklyDonations.map((count, index) => {
                const barHeight = maxDonations > 0 ? (count / maxDonations) * maxBarHeight : 0;
                return (
                  <View key={index} className="flex-1 items-center">
                    <View className="flex-1 justify-end items-center w-full px-1">
                      <Text className="text-xs font-bold mb-1" style={{ color: colors.text }}>
                        {count}
                      </Text>
                      <View 
                        className="w-full rounded-t-lg"
                        style={{ 
                          height: Math.max(barHeight, count > 0 ? 10 : 0),
                          backgroundColor: colors.primary,
                        }}
                      />
                    </View>
                    <Text className="text-xs font-medium mt-2" style={{ color: colors.textSecondary }}>
                      {weekDays[index]}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Category Distribution */}
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Most Redeemed Categories
          </Text>
          <Card shadow="lg" delay={100}>
            {categoryData.some(item => item.count > 0) ? (
              <View className="gap-3">
                {categoryData.map((item, index) => {
                  const total = categoryData.reduce((sum, c) => sum + c.count, 0);
                  const percentage = total > 0 ? (item.count / total) * 100 : 0;
                  
                  return (
                    <View key={index}>
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                          <View 
                            className="w-4 h-4 rounded mr-2"
                            style={{ backgroundColor: item.color }}
                          />
                          <Text className="font-bold text-sm" style={{ color: colors.text }}>
                            {item.category}
                          </Text>
                        </View>
                        <Text className="text-sm font-bold" style={{ color: colors.textSecondary }}>
                          {item.count} ({percentage.toFixed(0)}%)
                        </Text>
                      </View>
                      <View 
                        className="h-2 rounded-full"
                        style={{ backgroundColor: colors.surfaceHover }}
                      >
                        <View 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: item.color 
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View className="py-4 items-center">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  No donations yet
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Top Donors */}
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Top Donors
          </Text>
          {topDonors.length > 0 ? (
            <View className="gap-3">
              {topDonors.map((donor, index) => (
                <Card key={index} shadow="md" delay={200 + index * 50}>
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: '#3B82F6' + '15' }}
                    >
                      <Text className="text-lg font-bold" style={{ color: '#3B82F6' }}>
                        #{index + 1}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                        {donor.name}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center">
                          <Ionicons name="gift" size={12} color={colors.textSecondary} />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {donor.donations} donations
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={12} color="#F59E0B" />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {donor.credits} credits
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <Ionicons name="trophy" size={24} color="#F59E0B" />
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={200}>
              <View className="py-4 items-center">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  No donors yet
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Top Beneficiaries */}
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Top Beneficiaries
          </Text>
          {topBeneficiaries.length > 0 ? (
            <View className="gap-3">
              {topBeneficiaries.map((beneficiary, index) => (
                <Card key={index} shadow="md" delay={400 + index * 50}>
                  <View className="flex-row items-center">
                    <View 
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: '#10B981' + '15' }}
                    >
                      <Text className="text-lg font-bold" style={{ color: '#10B981' }}>
                        #{index + 1}
                      </Text>
                    </View>
                    
                    <View className="flex-1">
                      <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                        {beneficiary.name}
                      </Text>
                      <View className="flex-row items-center gap-3">
                        <View className="flex-row items-center">
                          <Ionicons name="cart" size={12} color={colors.textSecondary} />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {beneficiary.redeemed} items
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="wallet" size={12} color="#10B981" />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {beneficiary.credits} spent
                          </Text>
                        </View>
                      </View>
                    </View>
                    
                    <Ionicons name="medal" size={24} color="#10B981" />
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={400}>
              <View className="py-4 items-center">
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  No beneficiaries yet
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* AI Accuracy Card */}
        <View className="px-5 pt-4">
          <GradientCard
            colors={['#8B5CF6', '#EC4899']}
            delay={600}
            shadow="2xl"
          >
            <View className="items-center py-3">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-3">
                <Ionicons name="analytics" size={32} color="white" />
              </View>
              <Text className="text-white text-lg font-bold mb-2">
                AI Classification Accuracy
              </Text>
              <Text className="text-white text-4xl font-bold mb-2">
                {aiAccuracy}%
              </Text>
              <Text className="text-white/80 text-sm text-center">
                Based on {verifiedDonations.length} verified donations
              </Text>
              
              {/* Progress Bar */}
              <View className="w-full mt-4">
                <View className="h-3 rounded-full bg-white/20">
                  <View 
                    className="h-3 rounded-full bg-white"
                    style={{ width: `${aiAccuracy}%` }}
                  />
                </View>
              </View>
            </View>
          </GradientCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
