import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

const statusConfig = {
  uploaded: { label: 'Pending Review', color: '#F59E0B', icon: 'time' },
  verified: { label: 'Verified', color: '#3B82F6', icon: 'checkmark-circle' },
  listed: { label: 'Listed', color: '#8B5CF6', icon: 'list' },
  allocated: { label: 'Allocated', color: '#06B6D4', icon: 'person' },
  received: { label: 'Received', color: '#10B981', icon: 'checkmark-done' },
  rejected: { label: 'Rejected', color: '#EF4444', icon: 'close-circle' },
};

export default function DonationHistory({ route }: any) {
  const insets = useSafeAreaInsets();
  const initialFilter = route?.params?.filter || 'all';
  const [filterStatus, setFilterStatus] = useState<string>(initialFilter);
  
  // Update filter when route params change
  useEffect(() => {
    if (route?.params?.filter) {
      setFilterStatus(route.params.filter);
    }
  }, [route?.params?.filter]);
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allDonations = useDonationStore(state => state.donations);
  
  const userDonations = allDonations
    .filter(donation => donation.donorId === (user?.id || ''))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredDonations = filterStatus === 'all' 
    ? userDonations 
    : userDonations.filter(d => d.status === filterStatus);

  const stats = {
    total: userDonations.length,
    pending: userDonations.filter(d => d.status === 'uploaded').length,
    verified: userDonations.filter(d => d.status === 'verified' || d.status === 'listed').length,
    completed: userDonations.filter(d => d.status === 'received').length,
  };

  const filterOptions = [
    { id: 'all', label: 'All', count: stats.total },
    { id: 'uploaded', label: 'Pending', count: stats.pending },
    { id: 'verified', label: 'Active', count: stats.verified },
    { id: 'received', label: 'Completed', count: stats.completed },
  ];

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
        stickyHeaderIndices={[0]}
      >
        {/* Sticky Header */}
        <View style={{ backgroundColor: colors.surface }}>
          <View className="px-5 pt-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
              Donation History
            </Text>
            
            {/* Stats Row */}
            <View className="flex-row gap-2 mb-3">
              <View className="flex-1">
                <View className="p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
                  <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                    {stats.total}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    Total
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
                  <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                    {stats.completed}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    Completed
                  </Text>
                </View>
              </View>
              <View className="flex-1">
                <View className="p-3 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
                  <Text className="text-2xl font-bold mb-1" style={{ color: colors.text }}>
                    {stats.pending}
                  </Text>
                  <Text className="text-xs" style={{ color: colors.textSecondary }}>
                    Pending
                  </Text>
                </View>
              </View>
            </View>

            {/* Filter Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {filterOptions.map((option) => (
                <Pressable
                  key={option.id}
                  onPress={() => setFilterStatus(option.id)}
                  className="px-4 py-2 rounded-full flex-row items-center"
                  style={{ 
                    backgroundColor: filterStatus === option.id ? colors.primary : colors.surfaceHover 
                  }}
                >
                  <Text 
                    className="font-bold text-sm"
                    style={{ color: filterStatus === option.id ? 'white' : colors.text }}
                  >
                    {option.label}
                  </Text>
                  {option.count > 0 && (
                    <View 
                      className="ml-2 px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: filterStatus === option.id ? 'rgba(255,255,255,0.3)' : colors.border }}
                    >
                      <Text 
                        className="text-xs font-bold"
                        style={{ color: filterStatus === option.id ? 'white' : colors.textSecondary }}
                      >
                        {option.count}
                      </Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Donations List */}
        <View className="px-5 pt-4">
          {filteredDonations.length > 0 ? (
            <View className="gap-3">
              {filteredDonations.map((donation, index) => {
                const statusInfo = statusConfig[donation.status as keyof typeof statusConfig] || statusConfig.uploaded;
                
                return (
                  <Card key={donation.id} shadow="lg" delay={index * 50}>
                    <View className="flex-row">
                      {/* Image */}
                      {donation.images && donation.images[0] ? (
                        <Image
                          source={{ uri: donation.images[0] }}
                          className="w-20 h-20 rounded-xl mr-3"
                          resizeMode="cover"
                        />
                      ) : (
                        <View 
                          className="w-20 h-20 rounded-xl mr-3 items-center justify-center"
                          style={{ backgroundColor: colors.surfaceHover }}
                        >
                          <Ionicons name="image-outline" size={32} color={colors.textTertiary} />
                        </View>
                      )}
                      
                      {/* Content */}
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-2">
                          <Text className="flex-1 font-bold text-base mr-2" style={{ color: colors.text }}>
                            {donation.title}
                          </Text>
                          <View 
                            className="px-2 py-1 rounded-full flex-row items-center"
                            style={{ backgroundColor: statusInfo.color + '15' }}
                          >
                            <Ionicons 
                              name={statusInfo.icon as any} 
                              size={12} 
                              color={statusInfo.color} 
                            />
                            <Text 
                              className="text-xs font-bold ml-1"
                              style={{ color: statusInfo.color }}
                            >
                              {statusInfo.label}
                            </Text>
                          </View>
                        </View>
                        
                        {donation.description && (
                          <Text 
                            className="text-sm mb-2" 
                            numberOfLines={2}
                            style={{ color: colors.textSecondary }}
                          >
                            {donation.description}
                          </Text>
                        )}
                        
                        <View className="flex-row items-center gap-3">
                          <View className="flex-row items-center">
                            <Ionicons name="pricetag" size={12} color={colors.textTertiary} />
                            <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                              {donation.category}
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="calendar-outline" size={12} color={colors.textTertiary} />
                            <Text className="text-xs ml-1" style={{ color: colors.textSecondary }}>
                              {new Date(donation.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                          {donation.value && (
                            <View className="flex-row items-center">
                              <Ionicons name="star" size={12} color="#F59E0B" />
                              <Text className="text-xs ml-1 font-semibold" style={{ color: colors.textSecondary }}>
                                {donation.value} credits
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
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
                  <Ionicons name="gift-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  {filterStatus === 'all' ? 'No Donations Yet' : 'No Donations Found'}
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  {filterStatus === 'all' 
                    ? 'Start making a difference by uploading your first donation!'
                    : `No ${filterOptions.find(f => f.id === filterStatus)?.label.toLowerCase()} donations`
                  }
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
