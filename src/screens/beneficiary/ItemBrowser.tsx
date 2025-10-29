import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Modal, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { useCreditBalance, useCreditOperations } from '../../hooks/useCredits';
import { getThemeColors } from '../../utils/theme';
import { ItemCategory, ClothType } from '../../types/donations';
import { sendNotification } from '../../state/notificationStore';
import { Card } from '../../components/Card';

const categories: { id: ItemCategory; label: string; icon: string }[] = [
  { id: 'clothing', label: 'Clothing', icon: 'shirt' },
  { id: 'other', label: 'Other', icon: 'cube' },
];

const clothTypes: ClothType[] = [
  'T-Shirt',
  'Shirt',
  'Pants',
  'Jeans',
  'Jacket',
  'Coat',
  'Dress',
  'Skirt',
  'Sweater',
  'Hoodie',
  'Shorts',
  'Shoes',
  'Socks',
  'Underwear',
  'Accessories',
  'Other',
];

export default function ItemBrowser() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedClothType, setSelectedClothType] = useState<ClothType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allListings = useDonationStore(state => state.listings);
  const { initializeUserCredits } = useDonationStore();
  
  // Use Supabase-backed credit balance and operations
  const { credits: userCredits, isLoading: creditsLoading, refreshCredits } = useCreditBalance(user?.id);
  const { spendCredits } = useCreditOperations(user?.id);
  
  useEffect(() => {
    if (user?.id) {
      initializeUserCredits(user.id);
      refreshCredits(); // Fetch from Supabase on mount
    }
  }, [user?.id]);
  
  const availableListings = allListings.filter(l => l.isAvailable);
  const filteredListings = availableListings.filter(listing => {
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    const matchesClothType = selectedClothType === 'all' || listing.clothType === selectedClothType;
    const matchesSearch = !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesClothType && matchesSearch;
  });

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setShowClaimModal(true);
  };

  const handleClaimConfirm = async () => {
    if (!selectedItem || !user?.id) return;

    const creditsRequired = selectedItem.credits;
    
    if (userCredits < creditsRequired) {
      setShowClaimModal(false);
      return;
    }

    setIsClaiming(true);
    
    try {
      // Spend credits via Supabase
      const result = await spendCredits(creditsRequired);
      
      if (result.success) {
        // Add transaction to local store
        const { addTransaction } = useDonationStore.getState();
        addTransaction({
          beneficiaryId: user.id,
          amount: creditsRequired,
          type: 'spent',
          itemId: selectedItem.id,
          description: `Claimed: ${selectedItem.title}`,
        });
        
        // Mark listing as unavailable
        const { listings } = useDonationStore.getState();
        useDonationStore.setState({
          listings: listings.map(l =>
            l.id === selectedItem.id ? { ...l, isAvailable: false } : l
          )
        });
        
        // Send notification to donor
        if (selectedItem.donorId) {
          sendNotification(
            selectedItem.donorId,
            'item_claimed',
            'Your Item Was Claimed!',
            `A beneficiary has claimed your donation: "${selectedItem.title}". Your kindness is making a difference!`,
            { listingId: selectedItem.id }
          );
        }
        
        // Send notification to beneficiary
        sendNotification(
          user.id,
          'item_claimed',
          'Item Claimed Successfully!',
          `You have successfully claimed "${selectedItem.title}". Please check for pickup instructions.`,
          { listingId: selectedItem.id }
        );
        
        // Refresh credit balance from Supabase
        await refreshCredits();
      }
    } catch (error) {
      console.error('Error claiming item:', error);
    } finally {
      setIsClaiming(false);
      setShowClaimModal(false);
      setSelectedItem(null);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCredits();
    setIsRefreshing(false);
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
        stickyHeaderIndices={[0]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Sticky Header */}
        <View style={{ backgroundColor: colors.surface }}>
          <View className="px-5 pt-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text className="text-2xl font-bold mb-3" style={{ color: colors.text }}>
              Browse Items
            </Text>
            
            {/* Credits Badge */}
            <View className="flex-row items-center mb-3">
              <LinearGradient
                colors={['#10B981', '#059669']}
                className="px-4 py-2 rounded-full flex-row items-center"
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="wallet" size={18} color="white" />
                <Text className="text-white font-bold ml-2">
                  {userCredits} credits available
                </Text>
              </LinearGradient>
            </View>
            
            {/* Search Bar */}
            <View className="flex-row items-center px-4 py-3 rounded-xl mb-3" style={{ backgroundColor: colors.surfaceHover }}>
              <Ionicons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="Search items..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={{ color: colors.text }}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                </Pressable>
              )}
            </View>

            {/* Category Filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <Pressable
                onPress={() => {
                  setSelectedCategory('all');
                  setSelectedClothType('all');
                }}
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: selectedCategory === 'all' ? colors.primary : colors.surfaceHover
                }}
              >
                <Text
                  className="font-bold text-sm"
                  style={{ color: selectedCategory === 'all' ? 'white' : colors.text }}
                >
                  All Items
                </Text>
              </Pressable>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => {
                    setSelectedCategory(category.id);
                    if (category.id !== 'clothing') {
                      setSelectedClothType('all');
                    }
                  }}
                  className="px-4 py-2 rounded-full flex-row items-center"
                  style={{
                    backgroundColor: selectedCategory === category.id ? colors.primary : colors.surfaceHover
                  }}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={selectedCategory === category.id ? 'white' : colors.text}
                  />
                  <Text
                    className="font-bold text-sm ml-1"
                    style={{ color: selectedCategory === category.id ? 'white' : colors.text }}
                  >
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Cloth Type Filters - Only show when clothing category is selected */}
            {(selectedCategory === 'clothing' || selectedCategory === 'all') && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, marginTop: 8 }}
              >
                <Pressable
                  onPress={() => setSelectedClothType('all')}
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: selectedClothType === 'all' ? colors.success : colors.surfaceHover
                  }}
                >
                  <Text
                    className="font-bold text-sm"
                    style={{ color: selectedClothType === 'all' ? 'white' : colors.text }}
                  >
                    All Types
                  </Text>
                </Pressable>
                {clothTypes.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setSelectedClothType(type)}
                    className="px-4 py-2 rounded-full"
                    style={{
                      backgroundColor: selectedClothType === type ? colors.success : colors.surfaceHover
                    }}
                  >
                    <Text
                      className="font-bold text-sm"
                      style={{ color: selectedClothType === type ? 'white' : colors.text }}
                    >
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* Items Grid */}
        <View className="px-5 pt-4">
          {filteredListings.length > 0 ? (
            <View className="gap-3">
              {filteredListings.map((item, index) => {
                const canAfford = userCredits >= item.credits;
                
                return (
                  <Card key={item.id} shadow="lg" delay={index * 50}>
                    <Pressable onPress={() => handleItemPress(item)}>
                      {item.images && item.images[0] && (
                        <Image
                          source={{ uri: item.images[0] }}
                          className="w-full h-48 rounded-xl mb-3"
                          resizeMode="cover"
                        />
                      )}
                      
                      <View className="flex-row items-start justify-between mb-2">
                        <Text className="flex-1 font-bold text-lg mr-2" style={{ color: colors.text }}>
                          {item.title}
                        </Text>
                        <View 
                          className="px-3 py-1.5 rounded-full"
                          style={{ backgroundColor: canAfford ? colors.success + '15' : colors.error + '15' }}
                        >
                          <Text 
                            className="text-xs font-bold"
                            style={{ color: canAfford ? colors.success : colors.error }}
                          >
                            {item.credits} credits
                          </Text>
                        </View>
                      </View>
                      
                      {item.description && (
                        <Text className="text-sm mb-3" numberOfLines={2} style={{ color: colors.textSecondary }}>
                          {item.description}
                        </Text>
                      )}
                      
                      <View className="flex-row items-center justify-between pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
                        <View className="flex-row items-center">
                          <View 
                            className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                            style={{ backgroundColor: colors.primary + '15' }}
                          >
                            <Ionicons
                              name={categories.find(c => c.id === item.category)?.icon as any || 'cube'}
                              size={16}
                              color={colors.primary}
                            />
                          </View>
                          <View>
                            <Text className="text-xs capitalize" style={{ color: colors.textSecondary }}>
                              {item.category}
                            </Text>
                            <Text className="text-xs" style={{ color: colors.textTertiary }}>
                              Posted {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                          </View>
                        </View>
                        
                        <View 
                          className="px-4 py-2 rounded-lg"
                          style={{ backgroundColor: canAfford ? colors.primary : colors.border }}
                        >
                          <Text 
                            className="font-bold text-sm"
                            style={{ color: canAfford ? 'white' : colors.textTertiary }}
                          >
                            {canAfford ? 'View Details' : 'Not enough credits'}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  </Card>
                );
              })}
            </View>
          ) : (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.border }}
                >
                  <Ionicons name="search" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  No Items Found
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  {searchQuery 
                    ? `No results for "${searchQuery}"`
                    : selectedCategory === 'all' 
                      ? 'Check back later for new donations'
                      : `No ${selectedCategory} items available right now`
                  }
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Claim Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showClaimModal}
        onRequestClose={() => setShowClaimModal(false)}
      >
        <Pressable 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowClaimModal(false)}
        >
          <Pressable 
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedItem && (
              <>
                {selectedItem.images && selectedItem.images[0] && (
                  <Image
                    source={{ uri: selectedItem.images[0] }}
                    className="w-full h-64 rounded-2xl mb-4"
                    resizeMode="cover"
                  />
                )}
                
                <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
                  {selectedItem.title}
                </Text>
                
                {selectedItem.description && (
                  <Text className="text-base mb-4" style={{ color: colors.textSecondary }}>
                    {selectedItem.description}
                  </Text>
                )}
                
                <View className="flex-row items-center justify-between mb-6 p-4 rounded-xl" style={{ backgroundColor: colors.surfaceHover }}>
                  <View>
                    <Text className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                      Cost
                    </Text>
                    <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                      {selectedItem.credits} credits
                    </Text>
                  </View>
                  <View>
                    <Text className="text-sm mb-1 text-right" style={{ color: colors.textSecondary }}>
                      You have
                    </Text>
                    <Text className="text-2xl font-bold" style={{ color: colors.success }}>
                      {userCredits} credits
                    </Text>
                  </View>
                </View>
                
                {userCredits >= selectedItem.credits ? (
                  <View className="gap-3">
                    <Pressable
                      onPress={handleClaimConfirm}
                      disabled={isClaiming}
                      className="py-4 rounded-xl flex-row items-center justify-center"
                      style={{ 
                        backgroundColor: isClaiming ? colors.border : colors.primary,
                        opacity: isClaiming ? 0.7 : 1,
                      }}
                    >
                      {isClaiming ? (
                        <>
                          <Ionicons name="hourglass" size={20} color="white" />
                          <Text className="text-white font-bold text-lg ml-2">
                            Claiming...
                          </Text>
                        </>
                      ) : (
                        <Text className="text-white font-bold text-lg">
                          Claim Item
                        </Text>
                      )}
                    </Pressable>
                    
                    <Pressable
                      onPress={() => setShowClaimModal(false)}
                      disabled={isClaiming}
                      className="py-4 rounded-xl"
                      style={{ 
                        backgroundColor: colors.surfaceHover,
                        opacity: isClaiming ? 0.5 : 1,
                      }}
                    >
                      <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                        Cancel
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  <View className="gap-3">
                    <View className="p-4 rounded-xl flex-row items-center" style={{ backgroundColor: colors.error + '15' }}>
                      <Ionicons name="alert-circle" size={24} color={colors.error} />
                      <Text className="flex-1 ml-3" style={{ color: colors.error }}>
                        You need {selectedItem.credits - userCredits} more credits to claim this item
                      </Text>
                    </View>
                    
                    <Pressable
                      onPress={() => setShowClaimModal(false)}
                      className="py-4 rounded-xl"
                      style={{ backgroundColor: colors.surfaceHover }}
                    >
                      <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                        Close
                      </Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
