import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, Modal, RefreshControl } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { sendNotification } from '../../state/notificationStore';

export default function ItemVerification() {
  const insets = useSafeAreaInsets();
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'reclassify'>('approve');
  const [newCategory, setNewCategory] = useState<'clothing' | 'other'>('clothing');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAllDonations, setShowAllDonations] = useState(false);
  
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allDonations = useDonationStore(state => state.donations);
  const updateDonationStatus = useDonationStore(state => state.updateDonationStatus);

  const pendingDonations = allDonations
    .filter(d => d.status === 'uploaded')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Show all donations when toggle is on
  const displayDonations = showAllDonations 
    ? allDonations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : pendingDonations;

  // Log for debugging
  useEffect(() => {
    console.log('=== DONATION DEBUG ===');
    console.log('Total donations in store:', allDonations.length);
    console.log('Pending donations (status=uploaded):', pendingDonations.length);
    console.log('All donations with details:');
    allDonations.forEach((d, i) => {
      console.log(`  ${i + 1}. ID: ${d.id}, Status: "${d.status}", Title: "${d.title}"`);
    });
    console.log('=====================');
  }, [allDonations, pendingDonations]);

  const selectedDonationData = displayDonations.find(d => d.id === selectedDonation);

  const handleApprovePress = (donationId: string) => {
    setSelectedDonation(donationId);
    setActionType('approve');
    setShowActionModal(true);
  };

  const handleRejectPress = (donationId: string) => {
    setSelectedDonation(donationId);
    setActionType('reject');
    setRejectionReason('');
    setShowActionModal(true);
  };

  const handleReclassifyPress = (donationId: string) => {
    const donation = pendingDonations.find(d => d.id === donationId);
    setSelectedDonation(donationId);
    setActionType('reclassify');
    setNewCategory(donation?.category || 'clothing');
    setShowActionModal(true);
  };

  const handleConfirmAction = () => {
    if (!selectedDonation) return;

    const donation = displayDonations.find(d => d.id === selectedDonation);
    if (!donation) return;

    if (actionType === 'approve') {
      // Update donation status to verified
      updateDonationStatus(selectedDonation, 'verified', 'Approved by admin');

      // Create a listing so it appears in guest/beneficiary feeds
      const { addListing } = useDonationStore.getState();
      addListing({
        donorId: donation.donorId,
        title: donation.title,
        description: donation.description,
        category: donation.category,
        clothType: donation.clothType,
        size: donation.size,
        color: donation.color,
        images: donation.images,
        credits: donation.value || 10, // Use the donation value as credits
        isAvailable: true,
      });

      console.log('✅ Donation approved and listing created:', donation.title);

      sendNotification(
        donation.donorId,
        'donation_approved',
        'Donation Approved! 🎉',
        `Your donation "${donation.title}" has been approved and is now available for beneficiaries.`,
        { donationId: selectedDonation }
      );
    } else if (actionType === 'reject') {
      // Mark as rejected with reason in adminNotes
      updateDonationStatus(selectedDonation, 'uploaded', `REJECTED: ${rejectionReason || 'Does not meet guidelines'}`);

      console.log('❌ Donation rejected:', donation.title, 'Reason:', rejectionReason);

      sendNotification(
        donation.donorId,
        'donation_rejected',
        'Donation Not Approved',
        `Your donation "${donation.title}" could not be approved. ${rejectionReason || 'Please check the guidelines.'}`,
        { donationId: selectedDonation }
      );
    } else if (actionType === 'reclassify') {
      // Update the donation category
      const { donations } = useDonationStore.getState();
      const updatedDonations = donations.map(d =>
        d.id === selectedDonation ? { ...d, category: newCategory } : d
      );
      useDonationStore.setState({ donations: updatedDonations });

      // Update status to verified and create listing
      updateDonationStatus(selectedDonation, 'verified', `Reclassified to ${newCategory} and approved`);

      const { addListing } = useDonationStore.getState();
      const updatedDonation = updatedDonations.find(d => d.id === selectedDonation);
      if (updatedDonation) {
        addListing({
          donorId: updatedDonation.donorId,
          title: updatedDonation.title,
          description: updatedDonation.description,
          category: newCategory,
          clothType: updatedDonation.clothType,
          size: updatedDonation.size,
          color: updatedDonation.color,
          images: updatedDonation.images,
          credits: updatedDonation.value || 10,
          isAvailable: true,
        });
      }

      console.log('🔄 Donation reclassified and approved:', donation.title, 'New category:', newCategory);

      sendNotification(
        donation.donorId,
        'donation_approved',
        'Donation Reclassified & Approved! 🎉',
        `Your donation "${donation.title}" has been reclassified to ${newCategory} and approved.`,
        { donationId: selectedDonation }
      );
    }

    setShowActionModal(false);
    setSelectedDonation(null);
    setRejectionReason('');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh - the store is already reactive
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsRefreshing(false);
  };

  const handleImagePress = (imageUri: string) => {
    setSelectedImage(imageUri);
    setShowImageModal(true);
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header */}
        <View className="px-5 pt-4 pb-4" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Text className="text-2xl font-bold mb-2" style={{ color: colors.text }}>
            Item Verification
          </Text>
          <View className="flex-row items-center flex-wrap gap-2 mb-3">
            <View 
              className="px-3 py-1.5 rounded-full flex-row items-center"
              style={{ backgroundColor: colors.primary + '15' }}
            >
              <Ionicons name="time" size={16} color={colors.primary} />
              <Text className="font-bold text-sm ml-1" style={{ color: colors.primary }}>
                {pendingDonations.length} Pending
              </Text>
            </View>
            <Pressable
              onPress={() => setShowAllDonations(!showAllDonations)}
              className="px-3 py-1.5 rounded-full flex-row items-center"
              style={{ backgroundColor: showAllDonations ? colors.success + '15' : colors.surfaceHover }}
            >
              <Ionicons 
                name="list" 
                size={16} 
                color={showAllDonations ? colors.success : colors.textSecondary} 
              />
              <Text 
                className="font-bold text-sm ml-1" 
                style={{ color: showAllDonations ? colors.success : colors.textSecondary }}
              >
                {allDonations.length} Total
              </Text>
            </Pressable>
          </View>
          
          {/* Toggle Info */}
          {showAllDonations && (
            <View 
              className="px-3 py-2 rounded-lg flex-row items-center"
              style={{ backgroundColor: colors.info + '15' }}
            >
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text className="text-xs ml-2 flex-1" style={{ color: colors.info }}>
                Showing all donations. Tap "Total" to show only pending.
              </Text>
            </View>
          )}
        </View>

        {/* Pending Items */}
        <View className="px-5 pt-4">
          {displayDonations.length > 0 ? (
            <View className="gap-3">
              {displayDonations.map((donation, index) => (
                <Card key={donation.id} shadow="lg" delay={index * 50}>
                  {/* Status Badge */}
                  <View className="flex-row items-center justify-between mb-3">
                    <View 
                      className="px-3 py-1.5 rounded-full flex-row items-center"
                      style={{ 
                        backgroundColor: donation.status === 'uploaded' 
                          ? '#F59E0B' + '15'
                          : donation.status === 'verified' 
                          ? colors.success + '15'
                          : colors.error + '15'
                      }}
                    >
                      <Ionicons 
                        name={
                          donation.status === 'uploaded' ? 'time' :
                          donation.status === 'verified' ? 'checkmark-circle' :
                          'alert-circle'
                        }
                        size={14} 
                        color={
                          donation.status === 'uploaded' ? '#F59E0B' :
                          donation.status === 'verified' ? colors.success :
                          colors.error
                        }
                      />
                      <Text 
                        className="text-xs font-bold ml-1 capitalize"
                        style={{ 
                          color: donation.status === 'uploaded' ? '#F59E0B' :
                          donation.status === 'verified' ? colors.success :
                          colors.error
                        }}
                      >
                        {donation.status}
                      </Text>
                    </View>
                    
                    {/* Fix Status Button - only show if status is wrong */}
                    {donation.status !== 'uploaded' && donation.status !== 'verified' && (
                      <Pressable
                        onPress={() => {
                          updateDonationStatus(donation.id, 'uploaded', 'Status fixed by admin');
                        }}
                        className="px-3 py-1.5 rounded-lg flex-row items-center"
                        style={{ backgroundColor: colors.primary + '15' }}
                      >
                        <Ionicons name="build" size={14} color={colors.primary} />
                        <Text className="text-xs font-bold ml-1" style={{ color: colors.primary }}>
                          Fix Status
                        </Text>
                      </Pressable>
                    )}
                  </View>
                  
                  {/* Image */}
                  {donation.images && donation.images[0] ? (
                    <Pressable onPress={() => handleImagePress(donation.images[0])}>
                      <Image
                        source={{ uri: donation.images[0] }}
                        className="w-full h-48 rounded-xl mb-3"
                        resizeMode="cover"
                      />
                      {/* Zoom Icon Overlay */}
                      <View 
                        className="absolute top-2 right-2 w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                      >
                        <Ionicons name="expand" size={20} color="white" />
                      </View>
                    </Pressable>
                  ) : (
                    <View 
                      className="w-full h-48 rounded-xl mb-3 items-center justify-center"
                      style={{ backgroundColor: colors.surfaceHover }}
                    >
                      <Ionicons name="image-outline" size={64} color={colors.textTertiary} />
                    </View>
                  )}

                  {/* Content */}
                  <View className="mb-3">
                    <Text className="font-bold text-xl mb-2" style={{ color: colors.text }}>
                      {donation.title}
                    </Text>
                    
                    {donation.description && (
                      <Text className="text-base mb-3" style={{ color: colors.textSecondary }}>
                        {donation.description}
                      </Text>
                    )}

                    {/* Info Grid */}
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View 
                        className="px-3 py-2 rounded-lg flex-row items-center"
                        style={{ backgroundColor: colors.surfaceHover }}
                      >
                        <Ionicons name="pricetag" size={16} color={colors.textSecondary} />
                        <Text className="text-sm font-medium ml-1" style={{ color: colors.text }}>
                          {donation.category}
                        </Text>
                      </View>

                      {donation.value && (
                        <View 
                          className="px-3 py-2 rounded-lg flex-row items-center"
                          style={{ backgroundColor: colors.surfaceHover }}
                        >
                          <Ionicons name="star" size={16} color="#F59E0B" />
                          <Text className="text-sm font-medium ml-1" style={{ color: colors.text }}>
                            {donation.value} credits
                          </Text>
                        </View>
                      )}

                      <View 
                        className="px-3 py-2 rounded-lg flex-row items-center"
                        style={{ backgroundColor: colors.surfaceHover }}
                      >
                        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                        <Text className="text-sm font-medium ml-1" style={{ color: colors.text }}>
                          {new Date(donation.createdAt).toLocaleDateString()}
                        </Text>
                      </View>

                      {donation.aiConfidence && (
                        <View 
                          className="px-3 py-2 rounded-lg flex-row items-center"
                          style={{ backgroundColor: '#3B82F6' + '15' }}
                        >
                          <Ionicons name="analytics" size={16} color="#3B82F6" />
                          <Text className="text-sm font-bold ml-1" style={{ color: '#3B82F6' }}>
                            AI: {Math.round(donation.aiConfidence * 100)}%
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handleRejectPress(donation.id)}
                      className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                      style={{ backgroundColor: colors.error + '15' }}
                    >
                      <Ionicons name="close" size={18} color={colors.error} />
                      <Text className="font-bold text-sm ml-1" style={{ color: colors.error }}>
                        Reject
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleReclassifyPress(donation.id)}
                      className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                      style={{ backgroundColor: '#F59E0B' + '15' }}
                    >
                      <Ionicons name="repeat" size={18} color="#F59E0B" />
                      <Text className="font-bold text-sm ml-1" style={{ color: '#F59E0B' }}>
                        Reclassify
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => handleApprovePress(donation.id)}
                      className="flex-1 py-3 rounded-xl"
                    >
                      <LinearGradient
                        colors={['#10B981', '#059669']}
                        className="flex-row items-center justify-center h-full rounded-xl"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name="checkmark" size={18} color="white" />
                        <Text className="text-white font-bold text-sm ml-1">
                          Approve
                        </Text>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Card shadow="lg" delay={0}>
              <View className="py-8 items-center">
                <View 
                  className="w-20 h-20 rounded-full items-center justify-center mb-4"
                  style={{ backgroundColor: colors.success + '15' }}
                >
                  <Ionicons name="checkmark-done" size={40} color={colors.success} />
                </View>
                <Text className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                  All Caught Up!
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  No items pending verification at the moment
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Action Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showActionModal}
        onRequestClose={() => setShowActionModal(false)}
      >
        <Pressable 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setShowActionModal(false)}
        >
          <Pressable 
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedDonationData && (
              <>
                <View className="items-center mb-4">
                  <View 
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ 
                      backgroundColor: actionType === 'approve' 
                        ? colors.success + '15' 
                        : actionType === 'reject' 
                        ? colors.error + '15' 
                        : '#F59E0B' + '15' 
                    }}
                  >
                    <Ionicons 
                      name={actionType === 'approve' ? 'checkmark' : actionType === 'reject' ? 'close' : 'repeat'} 
                      size={32} 
                      color={actionType === 'approve' ? colors.success : actionType === 'reject' ? colors.error : '#F59E0B'} 
                    />
                  </View>
                  <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                    {actionType === 'approve' ? 'Approve Donation?' : actionType === 'reject' ? 'Reject Donation?' : 'Reclassify Donation?'}
                  </Text>
                  <Text className="text-center mb-1" style={{ color: colors.textSecondary }}>
                    {selectedDonationData.title}
                  </Text>
                </View>

                {actionType === 'reject' && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Reason for rejection:
                    </Text>
                    <TextInput
                      className="p-4 rounded-xl text-base"
                      style={{ 
                        backgroundColor: colors.surfaceHover,
                        color: colors.text,
                        minHeight: 100,
                        textAlignVertical: 'top'
                      }}
                      placeholder="Enter reason..."
                      placeholderTextColor={colors.textTertiary}
                      value={rejectionReason}
                      onChangeText={setRejectionReason}
                      multiline
                    />
                  </View>
                )}

                {actionType === 'reclassify' && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Select new category:
                    </Text>
                    <View className="flex-row gap-3">
                      <Pressable
                        onPress={() => setNewCategory('clothing')}
                        className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                        style={{ 
                          backgroundColor: newCategory === 'clothing' ? '#3B82F6' : colors.surfaceHover 
                        }}
                      >
                        <Ionicons 
                          name="shirt" 
                          size={20} 
                          color={newCategory === 'clothing' ? 'white' : colors.text} 
                        />
                        <Text 
                          className="font-bold ml-2"
                          style={{ color: newCategory === 'clothing' ? 'white' : colors.text }}
                        >
                          Clothing
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setNewCategory('other')}
                        className="flex-1 py-3 rounded-xl flex-row items-center justify-center"
                        style={{ 
                          backgroundColor: newCategory === 'other' ? '#3B82F6' : colors.surfaceHover 
                        }}
                      >
                        <Ionicons 
                          name="cube" 
                          size={20} 
                          color={newCategory === 'other' ? 'white' : colors.text} 
                        />
                        <Text 
                          className="font-bold ml-2"
                          style={{ color: newCategory === 'other' ? 'white' : colors.text }}
                        >
                          Other
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                )}

                <View className="gap-3">
                  <Pressable
                    onPress={handleConfirmAction}
                    className="py-4 rounded-xl"
                    style={{ 
                      backgroundColor: actionType === 'approve' 
                        ? colors.success 
                        : actionType === 'reject' 
                        ? colors.error 
                        : '#F59E0B' 
                    }}
                  >
                    <Text className="text-white font-bold text-center text-lg">
                      Confirm {actionType === 'approve' ? 'Approval' : actionType === 'reject' ? 'Rejection' : 'Reclassification'}
                    </Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={() => setShowActionModal(false)}
                    className="py-4 rounded-xl"
                    style={{ backgroundColor: colors.surfaceHover }}
                  >
                    <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

      {/* Full Screen Image Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showImageModal}
        onRequestClose={() => setShowImageModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black"
          onPress={() => setShowImageModal(false)}
        >
          <SafeAreaView className="flex-1">
            {/* Close Button */}
            <View className="absolute top-0 left-0 right-0 z-10 flex-row justify-between items-center px-5 pt-4">
              <Pressable
                onPress={() => setShowImageModal(false)}
                className="w-12 h-12 rounded-full items-center justify-center"
                style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
              >
                <Ionicons name="close" size={28} color="white" />
              </Pressable>
              
              <Text className="text-white text-sm font-medium">
                Tap to close
              </Text>
            </View>

            {/* Full Screen Image */}
            <View className="flex-1 items-center justify-center">
              {selectedImage && (
                <Pressable 
                  onPress={() => setShowImageModal(false)}
                  className="w-full h-full"
                >
                  <Image
                    source={{ uri: selectedImage }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </Pressable>
              )}
            </View>
          </SafeAreaView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
