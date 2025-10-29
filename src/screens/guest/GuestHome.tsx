import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDonationStore } from '../../state/donationStore';
import { ItemCategory } from '../../types/donations';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';
import { LinearGradient } from 'expo-linear-gradient';

const categories: { id: ItemCategory; label: string; icon: string }[] = [
  { id: 'clothing', label: 'Clothing', icon: 'shirt' },
  { id: 'other', label: 'Other', icon: 'cube' },
];

export default function GuestHome({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const allListings = useDonationStore(state => state.listings);

  const availableListings = allListings.filter(l => l.isAvailable);
  const listings = selectedCategory === 'all' 
    ? availableListings 
    : availableListings.filter(l => l.category === selectedCategory);

  const handleSignIn = () => {
    setShowSignInModal(false);
    navigation.navigate('Landing');
  };

  const handleActionAttempt = () => {
    setShowSignInModal(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Hero Header */}
        <View className="px-5 pt-4 pb-3">
          <GradientCard
            colors={['#3B82F6', '#8B5CF6']}
            delay={0}
            shadow="2xl"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white/80 text-sm font-medium mb-1">
                  Welcome Guest
                </Text>
                <Text className="text-white text-2xl font-bold mb-2">
                  Browse Items
                </Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                  <Text className="text-white/90 text-xs font-medium">
                    Sign in to claim items
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleSignIn}
                className="bg-white/20 px-4 py-2.5 rounded-xl"
              >
                <Text className="text-white font-bold text-sm">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </GradientCard>
        </View>

        {/* Info Banner */}
        <View className="px-5 mb-4">
          <Card shadow="lg" delay={100}>
            <View className="flex-row items-center">
              <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mr-3">
                <Ionicons name="information-circle" size={24} color="#3B82F6" />
              </View>
              <Text className="flex-1 text-gray-700 text-sm">
                Browsing as guest. Sign in to claim items and track donations!
              </Text>
            </View>
          </Card>
        </View>

        {/* Category Filter */}
        <View className="mb-4">
          <Text className="text-gray-900 text-lg font-bold px-5 mb-3">
            Categories
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingHorizontal: 20 }}
            className="gap-3"
          >
            <Pressable
              onPress={() => setSelectedCategory('all')}
              className={`px-5 py-3 rounded-xl mr-3 ${
                selectedCategory === 'all' ? '' : 'bg-white'
              }`}
            >
              {selectedCategory === 'all' ? (
                <LinearGradient
                  colors={['#3B82F6', '#8B5CF6']}
                  className="absolute inset-0 rounded-xl"
                />
              ) : null}
              <Text 
                className={`font-bold text-sm ${
                  selectedCategory === 'all' ? 'text-white' : 'text-gray-700'
                }`}
              >
                All Items
              </Text>
            </Pressable>
            {categories.map((category) => (
              <Pressable
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                className={`px-5 py-3 rounded-xl mr-3 flex-row items-center ${
                  selectedCategory === category.id ? '' : 'bg-white'
                }`}
              >
                {selectedCategory === category.id ? (
                  <LinearGradient
                    colors={['#3B82F6', '#8B5CF6']}
                    className="absolute inset-0 rounded-xl"
                  />
                ) : null}
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? 'white' : '#374151'}
                />
                <Text 
                  className={`font-bold text-sm ml-2 ${
                    selectedCategory === category.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {category.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Items Grid */}
        <View className="px-5">
          {listings.length > 0 ? (
            <View className="gap-3">
              {listings.map((item, index) => (
                <Card key={item.id} shadow="lg" delay={200 + index * 50}>
                  <Pressable onPress={handleActionAttempt}>
                    {item.images[0] && (
                      <Image
                        source={{ uri: item.images[0] }}
                        className="w-full h-48 rounded-lg mb-3"
                        resizeMode="cover"
                      />
                    )}
                    <View className="flex-row items-start justify-between mb-2">
                      <Text className="text-gray-900 font-bold text-base flex-1 mr-2">
                        {item.title}
                      </Text>
                      <View className="bg-purple-500/10 px-3 py-1.5 rounded-full">
                        <Text className="text-purple-700 text-xs font-bold">
                          {item.credits} credits
                        </Text>
                      </View>
                    </View>
                    
                    <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
                      {item.description}
                    </Text>
                    
                    <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                      <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-lg bg-gray-100 items-center justify-center mr-2">
                          <Ionicons
                            name={categories.find(c => c.id === item.category)?.icon as any || 'cube'}
                            size={16}
                            color="#6B7280"
                          />
                        </View>
                        <Text className="text-gray-600 text-sm capitalize">
                          {item.category}
                        </Text>
                      </View>
                      
                      <Pressable
                        onPress={handleActionAttempt}
                        className="bg-gray-900 px-4 py-2 rounded-lg"
                      >
                        <Text className="font-bold text-white text-sm">
                          View Details
                        </Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={200}>
              <View className="py-8 items-center">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="search" size={40} color="#9CA3AF" />
                </View>
                <Text className="text-gray-900 font-bold text-base mb-1">
                  No Items Found
                </Text>
                <Text className="text-gray-500 text-sm text-center">
                  {selectedCategory === 'all' 
                    ? 'Check back later for new donations'
                    : `No ${selectedCategory} items available right now`
                  }
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Sign In Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showSignInModal}
        onRequestClose={() => setShowSignInModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/50 items-center justify-center px-5"
          onPress={() => setShowSignInModal(false)}
        >
          <Pressable 
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-blue-500/10 items-center justify-center mb-3">
                <Ionicons name="lock-closed" size={32} color="#3B82F6" />
              </View>
              <Text className="text-gray-900 font-bold text-xl mb-2">
                Sign In Required
              </Text>
              <Text className="text-gray-600 text-sm text-center">
                Please sign in to claim items and access full features.
              </Text>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={handleSignIn}
                className="bg-blue-600 py-3.5 rounded-xl"
              >
                <Text className="text-white font-bold text-center text-base">
                  Sign In Now
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setShowSignInModal(false)}
                className="bg-gray-100 py-3.5 rounded-xl"
              >
                <Text className="text-gray-700 font-bold text-center text-base">
                  Continue Browsing
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}