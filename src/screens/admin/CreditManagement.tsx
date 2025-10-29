import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { useDonationStore } from '../../state/donationStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

export default function CreditManagement() {
  const insets = useSafeAreaInsets();
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAmount, setBulkAmount] = useState('');
  
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const transactions = useDonationStore(state => state.transactions);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalCreditsCirculated = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = transactions.filter(t => t.type === 'earned').reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions.filter(t => t.type === 'spent').reduce((sum, t) => sum + t.amount, 0);

  const handleBulkGrant = () => {
    const amount = parseInt(bulkAmount);
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // TODO: Implement bulk credit granting to all beneficiaries
    setShowBulkModal(false);
    setBulkAmount('');
  };

  const exportTransactions = () => {
    // TODO: Implement CSV/PDF export
    alert('Export feature coming soon!');
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned': return 'arrow-down';
      case 'spent': return 'arrow-up';
      case 'adjusted': return 'swap-horizontal';
      default: return 'cash';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned': return '#10B981';
      case 'spent': return '#EF4444';
      case 'adjusted': return '#F59E0B';
      default: return colors.primary;
    }
  };

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
            Credit Management
          </Text>
          
          {/* Stats Summary */}
          <View className="flex-row gap-3 mb-3">
            <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
              <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                Total Circulated
              </Text>
              <Text className="text-xl font-bold" style={{ color: colors.text }}>
                {totalCreditsCirculated}
              </Text>
            </View>
            <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
              <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                Total Earned
              </Text>
              <Text className="text-xl font-bold" style={{ color: '#10B981' }}>
                {totalEarned}
              </Text>
            </View>
            <View className="flex-1 p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
              <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
                Total Spent
              </Text>
              <Text className="text-xl font-bold" style={{ color: '#EF4444' }}>
                {totalSpent}
              </Text>
            </View>
          </View>
        </View>

        {/* Bulk Actions */}
        <View className="px-5 pt-4 pb-3">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Bulk Actions
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setShowBulkModal(true)}
              className="flex-1 p-4 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: colors.success + '15' }}
            >
              <Ionicons name="people" size={20} color={colors.success} />
              <Text className="font-bold ml-2" style={{ color: colors.success }}>
                Grant to All
              </Text>
            </Pressable>

            <Pressable
              onPress={exportTransactions}
              className="flex-1 p-4 rounded-xl flex-row items-center justify-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <Ionicons name="download" size={20} color={colors.primary} />
              <Text className="font-bold ml-2" style={{ color: colors.primary }}>
                Export CSV
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Transaction Log */}
        <View className="px-5 pt-2">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Transaction Log
          </Text>
          
          {sortedTransactions.length > 0 ? (
            <View className="gap-3">
              {sortedTransactions.map((transaction, index) => {
                const txColor = getTransactionColor(transaction.type);
                const txIcon = getTransactionIcon(transaction.type);
                
                return (
                  <Card key={transaction.id} shadow="md" delay={index * 30}>
                    <View className="flex-row items-center">
                      <View 
                        className="w-10 h-10 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: txColor + '15' }}
                      >
                        <Ionicons name={txIcon as any} size={20} color={txColor} />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="font-bold text-sm mb-1" style={{ color: colors.text }}>
                          {transaction.description}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-xs" style={{ color: colors.textSecondary }}>
                            {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                            {new Date(transaction.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                          <View 
                            className="px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: txColor + '15' }}
                          >
                            <Text className="text-xs font-bold" style={{ color: txColor }}>
                              {transaction.type}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      <Text 
                        className="text-lg font-bold"
                        style={{ color: transaction.type === 'spent' ? '#EF4444' : '#10B981' }}
                      >
                        {transaction.type === 'spent' ? '-' : '+'}{transaction.amount}
                      </Text>
                    </View>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.surfaceHover }}
                >
                  <Ionicons name="receipt-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                  No Transactions Yet
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  Credit transactions will appear here
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bulk Grant Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBulkModal}
        onRequestClose={() => setShowBulkModal(false)}
      >
        <Pressable 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowBulkModal(false)}
        >
          <Pressable 
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View 
                className="w-16 h-16 rounded-full items-center justify-center mb-3"
                style={{ backgroundColor: colors.success + '15' }}
              >
                <Ionicons name="people" size={32} color={colors.success} />
              </View>
              <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                Grant Credits to All Beneficiaries
              </Text>
              <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                This will add credits to all active beneficiary accounts
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                Enter amount to grant:
              </Text>
              <TextInput
                className="p-4 rounded-xl text-base text-center"
                style={{ 
                  backgroundColor: colors.surfaceHover,
                  color: colors.text,
                }}
                placeholder="e.g., 50"
                placeholderTextColor={colors.textTertiary}
                value={bulkAmount}
                onChangeText={setBulkAmount}
                keyboardType="numeric"
              />
            </View>

            <View className="gap-3">
              <Pressable
                onPress={handleBulkGrant}
                className="py-4 rounded-xl"
                style={{ backgroundColor: colors.success }}
              >
                <Text className="text-white font-bold text-center text-lg">
                  Confirm Bulk Grant
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setShowBulkModal(false)}
                className="py-4 rounded-xl"
                style={{ backgroundColor: colors.surfaceHover }}
              >
                <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                  Cancel
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
