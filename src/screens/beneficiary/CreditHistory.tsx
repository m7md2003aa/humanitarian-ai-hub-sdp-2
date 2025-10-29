import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { useCreditBalance } from '../../hooks/useCredits';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';

export default function CreditHistory() {
  const insets = useSafeAreaInsets();
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allTransactions = useDonationStore(state => state.transactions);
  const initializeUserCredits = useDonationStore(state => state.initializeUserCredits);
  
  // Use Supabase-backed credit balance (single source of truth)
  const { credits: userCredits, isLoading: creditsLoading, refreshCredits } = useCreditBalance(user?.id);

  React.useEffect(() => {
    if (user?.id) {
      initializeUserCredits(user.id);
    }
  }, [user?.id, initializeUserCredits]);
  
  const userTransactions = allTransactions
    .filter(t => t.beneficiaryId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const totalEarned = userTransactions
    .filter(t => t.type === 'earned')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSpent = userTransactions
    .filter(t => t.type === 'spent')
    .reduce((sum, t) => sum + t.amount, 0);

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
        refreshControl={
          <RefreshControl
            refreshing={creditsLoading}
            onRefresh={refreshCredits}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Hero Credit Card */}
        <View className="px-5 pt-4 pb-3">
          <GradientCard
            colors={['#10B981', '#06B6D4']}
            delay={0}
            shadow="2xl"
          >
            <View className="items-center py-4">
              <View className="w-16 h-16 rounded-full bg-white/20 items-center justify-center mb-4">
                <Ionicons name="wallet" size={32} color="white" />
              </View>
              <Text className="text-white/80 text-sm font-medium mb-1">
                Available Credits
              </Text>
              <Text className="text-white text-5xl font-bold mb-4">
                {userCredits}
              </Text>
              
              {/* Stats Row */}
              <View className="flex-row items-center justify-around w-full pt-4 border-t border-white/20">
                <View className="items-center flex-1">
                  <Text className="text-white text-2xl font-bold mb-1">
                    +{totalEarned}
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    Total Earned
                  </Text>
                </View>
                <View className="w-px h-12 bg-white/20" />
                <View className="items-center flex-1">
                  <Text className="text-white text-2xl font-bold mb-1">
                    -{totalSpent}
                  </Text>
                  <Text className="text-white/80 text-xs font-medium">
                    Total Spent
                  </Text>
                </View>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Transaction History */}
        <View className="px-5">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Transaction History
          </Text>
          
          {userTransactions.length > 0 ? (
            <View className="gap-3">
              {userTransactions.map((transaction, index) => {
                const isEarned = transaction.type === 'earned';
                
                return (
                  <Card key={transaction.id} shadow="lg" delay={100 + index * 50}>
                    <View className="flex-row items-center">
                      <LinearGradient
                        colors={isEarned ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
                        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons
                          name={isEarned ? 'arrow-down' : 'arrow-up'}
                          size={24}
                          color="white"
                        />
                      </LinearGradient>
                      
                      <View className="flex-1 mr-3">
                        <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                          {transaction.description}
                        </Text>
                        <View className="flex-row items-center">
                          <Ionicons 
                            name="calendar-outline" 
                            size={12} 
                            color={colors.textTertiary} 
                          />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </Text>
                          <Text className="text-xs mx-1" style={{ color: colors.textTertiary }}>
                            •
                          </Text>
                          <Ionicons 
                            name="time-outline" 
                            size={12} 
                            color={colors.textTertiary} 
                          />
                          <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                            {new Date(transaction.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="items-end">
                        <Text 
                          className="text-2xl font-bold mb-1"
                          style={{ color: isEarned ? colors.success : colors.error }}
                        >
                          {isEarned ? '+' : '-'}{transaction.amount}
                        </Text>
                        <Text className="text-xs" style={{ color: colors.textTertiary }}>
                          credits
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card shadow="lg" delay={100}>
              <View className="py-8 items-center">
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.surfaceHover }}
                >
                  <Ionicons name="receipt-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  No Transactions Yet
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  Start browsing items to earn and spend credits
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
