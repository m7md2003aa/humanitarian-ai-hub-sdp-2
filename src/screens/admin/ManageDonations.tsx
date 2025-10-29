import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { Donation } from '../../types/donations';

export default function ManageDonations({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const donations = useDonationStore(state => state.donations);
  const updateDonationValue = useDonationStore(state => state.updateDonationValue);
  const removeDonationImage = useDonationStore(state => state.removeDonationImage);
  const listings = useDonationStore(state => state.listings);
  const updateListingCredits = useDonationStore(state => state.updateListingCredits);
  const removeListingImage = useDonationStore(state => state.removeListingImage);

  const [editingDonation, setEditingDonation] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleEditCredits = (donation: Donation) => {
    setEditingDonation(donation.id);
    setEditValue(donation.value.toString());
  };

  const handleSaveCredits = (donationId: string) => {
    const newValue = parseInt(editValue);
    if (isNaN(newValue) || newValue < 0) {
      Alert.alert('Invalid Value', 'Please enter a valid positive number');
      return;
    }
    updateDonationValue(donationId, newValue);
    setEditingDonation(null);
  };

  const handleRemoveDonation = (donationId: string, title: string) => {
    Alert.alert(
      'Delete Donation',
      `Are you sure you want to delete "${title}"? This will remove it completely.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const deleteDonation = useDonationStore.getState().deleteDonation;
            deleteDonation(donationId);
          },
        },
      ]
    );
  };

  const handleEditListingCredits = (listingId: string, currentCredits: number) => {
    Alert.prompt(
      'Edit Credits',
      'Enter new credit value',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: (value) => {
            const newCredits = parseInt(value || '0');
            if (!isNaN(newCredits) && newCredits >= 0) {
              updateListingCredits(listingId, newCredits);
            }
          },
        },
      ],
      'plain-text',
      currentCredits.toString()
    );
  };

  const handleRemoveListing = (listingId: string, title: string) => {
    Alert.alert(
      'Delete Listing',
      `Are you sure you want to delete "${title}"? This will remove it completely.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const deleteListing = useDonationStore.getState().deleteListing;
            deleteListing(listingId);
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
        <View>
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            Manage Donations
          </Text>
          <Text className="text-sm" style={{ color: colors.textSecondary }}>
            Remove images and edit credits
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        {/* Donations Section */}
        <View className="px-5 pt-4">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            All Donations ({donations.length})
          </Text>

          {donations.length === 0 ? (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="gift-outline" size={40} color="#9CA3AF" />
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                  No Donations Yet
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                  Donations will appear here once uploaded
                </Text>
              </View>
            </Card>
          ) : (
            <View className="gap-3">
              {donations.map((donation, index) => (
                <Card key={donation.id} shadow="lg" delay={index * 50}>
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text style={{ color: colors.text }} className="font-bold text-base flex-1">
                        {donation.title}
                      </Text>
                      <View className="bg-gray-100 px-2 py-1 rounded">
                        <Text className="text-gray-700 text-xs font-medium">
                          {donation.status}
                        </Text>
                      </View>
                    </View>

                    {/* Credits Section */}
                    <View className="flex-row items-center gap-2 mb-3">
                      {editingDonation === donation.id ? (
                        <View className="flex-row items-center gap-2 flex-1">
                          <TextInput
                            className="flex-1 p-2 rounded-lg text-base font-bold"
                            style={{
                              backgroundColor: colors.surfaceHover,
                              color: colors.text,
                            }}
                            keyboardType="number-pad"
                            value={editValue}
                            onChangeText={setEditValue}
                            autoFocus
                          />
                          <Pressable
                            onPress={() => handleSaveCredits(donation.id)}
                            className="bg-green-500 px-3 py-2 rounded-lg"
                          >
                            <Ionicons name="checkmark" size={20} color="white" />
                          </Pressable>
                          <Pressable
                            onPress={() => setEditingDonation(null)}
                            className="bg-gray-500 px-3 py-2 rounded-lg"
                          >
                            <Ionicons name="close" size={20} color="white" />
                          </Pressable>
                        </View>
                      ) : (
                        <>
                          <View className="bg-amber-500/10 px-3 py-1.5 rounded-lg flex-1">
                            <Text className="text-amber-700 text-sm font-bold">
                              {donation.value} credits
                            </Text>
                          </View>
                          <Pressable
                            onPress={() => handleEditCredits(donation)}
                            className="bg-blue-500 px-3 py-1.5 rounded-lg"
                          >
                            <View className="flex-row items-center">
                              <Ionicons name="pencil" size={14} color="white" />
                              <Text className="text-white text-xs font-bold ml-1">
                                Edit
                              </Text>
                            </View>
                          </Pressable>
                        </>
                      )}
                    </View>

                    {/* Images Section */}
                    {donation.images.length > 0 ? (
                      <View className="gap-2">
                        <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                          Images ({donation.images.length})
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className="flex-row gap-2">
                            {donation.images.map((imageUri, imgIndex) => (
                              <View key={imgIndex} className="relative">
                                <Image
                                  source={{ uri: imageUri }}
                                  className="w-24 h-24 rounded-lg"
                                  resizeMode="cover"
                                />
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                        <Pressable
                          onPress={() => handleRemoveDonation(donation.id, donation.title)}
                          className="mt-2 py-2 px-4 bg-red-500 rounded-lg"
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="trash" size={16} color="white" />
                            <Text className="text-white font-bold ml-2 text-sm">
                              Delete Donation
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    ) : (
                      <View className="py-4 items-center border border-dashed rounded-lg" style={{ borderColor: colors.border }}>
                        <Ionicons name="image-outline" size={24} color={colors.textTertiary} />
                        <Text style={{ color: colors.textTertiary }} className="text-xs mt-1">
                          No images
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Metadata */}
                  <View className="flex-row items-center gap-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="pricetag-outline" size={12} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {donation.category}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>

        {/* Listings Section */}
        <View className="px-5 pt-6">
          <Text style={{ color: colors.text }} className="text-lg font-bold mb-3">
            All Listings ({listings.length})
          </Text>

          {listings.length === 0 ? (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View className="w-20 h-20 rounded-full bg-gray-100 items-center justify-center mb-4">
                  <Ionicons name="list-outline" size={40} color="#9CA3AF" />
                </View>
                <Text style={{ color: colors.text }} className="font-bold text-base mb-1">
                  No Listings Yet
                </Text>
                <Text style={{ color: colors.textSecondary }} className="text-sm text-center">
                  Listings will appear here once created
                </Text>
              </View>
            </Card>
          ) : (
            <View className="gap-3">
              {listings.map((listing, index) => (
                <Card key={listing.id} shadow="lg" delay={index * 50}>
                  <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text style={{ color: colors.text }} className="font-bold text-base flex-1">
                        {listing.title}
                      </Text>
                      <View className={`px-2 py-1 rounded ${listing.isAvailable ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Text className={`text-xs font-medium ${listing.isAvailable ? 'text-green-700' : 'text-gray-700'}`}>
                          {listing.isAvailable ? 'Available' : 'Claimed'}
                        </Text>
                      </View>
                    </View>

                    {/* Credits Section */}
                    <View className="flex-row items-center gap-2 mb-3">
                      <View className="bg-purple-500/10 px-3 py-1.5 rounded-lg flex-1">
                        <Text className="text-purple-700 text-sm font-bold">
                          {listing.credits} credits
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleEditListingCredits(listing.id, listing.credits)}
                        className="bg-blue-500 px-3 py-1.5 rounded-lg"
                      >
                        <View className="flex-row items-center">
                          <Ionicons name="pencil" size={14} color="white" />
                          <Text className="text-white text-xs font-bold ml-1">
                            Edit
                          </Text>
                        </View>
                      </Pressable>
                    </View>

                    {/* Images Section */}
                    {listing.images.length > 0 ? (
                      <View className="gap-2">
                        <Text style={{ color: colors.textSecondary }} className="text-xs font-medium">
                          Images ({listing.images.length})
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View className="flex-row gap-2">
                            {listing.images.map((imageUri, imgIndex) => (
                              <View key={imgIndex} className="relative">
                                <Image
                                  source={{ uri: imageUri }}
                                  className="w-24 h-24 rounded-lg"
                                  resizeMode="cover"
                                />
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                        <Pressable
                          onPress={() => handleRemoveListing(listing.id, listing.title)}
                          className="mt-2 py-2 px-4 bg-red-500 rounded-lg"
                        >
                          <View className="flex-row items-center justify-center">
                            <Ionicons name="trash" size={16} color="white" />
                            <Text className="text-white font-bold ml-2 text-sm">
                              Delete Listing
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                    ) : (
                      <View className="py-4 items-center border border-dashed rounded-lg" style={{ borderColor: colors.border }}>
                        <Ionicons name="image-outline" size={24} color={colors.textTertiary} />
                        <Text style={{ color: colors.textTertiary }} className="text-xs mt-1">
                          No images
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Metadata */}
                  <View className="flex-row items-center gap-3 pt-3 border-t" style={{ borderTopColor: colors.border }}>
                    <View className="flex-row items-center">
                      <Ionicons name="calendar-outline" size={12} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="pricetag-outline" size={12} color="#9CA3AF" />
                      <Text className="text-gray-500 text-xs ml-1">
                        {listing.category}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
