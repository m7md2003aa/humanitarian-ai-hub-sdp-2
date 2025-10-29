import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Image as RNImage } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { ItemCategory } from '../../types/donations';
import { Card } from '../../components/Card';

const categories: { id: ItemCategory; label: string; icon: string }[] = [
  { id: 'clothing', label: 'Clothing', icon: 'shirt' },
  { id: 'other', label: 'Other', icon: 'cube' },
];

export default function ItemUpload({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'photo' | 'details' | 'success'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [credits, setCredits] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('clothing');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isUploading, setIsUploading] = useState(false);
  
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const addListing = useDonationStore(state => state.addListing);

  const takePicture = async () => {
    if (!cameraRef.current) return;
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      setCapturedImage(photo.uri);
      setShowCamera(false);
    } catch (error) {
      console.error('Failed to take picture:', error);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCapturedImage(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setShowCamera(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !capturedImage || !credits.trim()) return;
    
    setIsUploading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate upload
      
      addListing({
        businessId: user?.id || '',
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        images: [capturedImage],
        credits: parseInt(credits, 10) || 0,
        price: price ? parseFloat(price) : undefined,
        location: location.trim() || undefined,
        isAvailable: true,
      });
      
      setStep('success');
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setLocation('');
    setPrice('');
    setCredits('');
    setSelectedCategory('clothing');
    setCapturedImage(null);
    setStep('photo');
  };

  if (showCamera) {
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
        >
          <SafeAreaView className="flex-1">
            <View className="flex-1 justify-between p-5">
              {/* Top Controls */}
              <View className="flex-row justify-between">
                <Pressable
                  onPress={() => setShowCamera(false)}
                  className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                >
                  <Ionicons name="close" size={28} color="white" />
                </Pressable>
                
                <Pressable
                  onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
                  className="w-12 h-12 rounded-full bg-black/50 items-center justify-center"
                >
                  <Ionicons name="camera-reverse" size={28} color="white" />
                </Pressable>
              </View>

              {/* Capture Button */}
              <View className="items-center pb-8">
                <Pressable
                  onPress={takePicture}
                  className="w-20 h-20 rounded-full bg-white items-center justify-center"
                  style={{ borderWidth: 4, borderColor: 'rgba(255,255,255,0.5)' }}
                >
                  <View className="w-16 h-16 rounded-full bg-white" />
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </CameraView>
      </View>
    );
  }

  if (step === 'success') {
    return (
      <SafeAreaView 
        className="flex-1" 
        style={{ backgroundColor: colors.background }}
        edges={['top']}
      >
        <View className="flex-1 items-center justify-center px-5">
          <View 
            className="w-24 h-24 rounded-full items-center justify-center mb-6"
            style={{ backgroundColor: colors.success + '15' }}
          >
            <Ionicons name="checkmark-circle" size={80} color={colors.success} />
          </View>
          
          <Text className="text-3xl font-bold mb-3 text-center" style={{ color: colors.text }}>
            Item Listed!
          </Text>
          
          <Text className="text-base text-center mb-8" style={{ color: colors.textSecondary }}>
            Your discounted item is now available for beneficiaries to claim using credits.
          </Text>
          
          <View className="w-full gap-3">
            <Pressable
              onPress={() => {
                resetForm();
                navigation.goBack();
              }}
              className="py-4 rounded-xl"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-white font-bold text-center text-lg">
                Done
              </Text>
            </Pressable>
            
            <Pressable
              onPress={resetForm}
              className="py-4 rounded-xl"
              style={{ backgroundColor: colors.surfaceHover }}
            >
              <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                Upload Another
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      className="flex-1" 
      style={{ backgroundColor: colors.background }}
      edges={['top']}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        >
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
                List Discounted Item
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Step {step === 'photo' ? '1' : '2'} of 2
              </Text>
            </View>
          </View>

          {step === 'photo' ? (
            <View className="px-5 pt-4">
              {/* Photo Section */}
              <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
                Add Photo
              </Text>
              
              {capturedImage ? (
                <Card shadow="lg" delay={0}>
                  <RNImage
                    source={{ uri: capturedImage }}
                    className="w-full h-64 rounded-xl mb-3"
                    resizeMode="cover"
                  />
                  <Pressable
                    onPress={() => setCapturedImage(null)}
                    className="py-3 rounded-lg"
                    style={{ backgroundColor: colors.error + '15' }}
                  >
                    <View className="flex-row items-center justify-center">
                      <Ionicons name="trash" size={20} color={colors.error} />
                      <Text className="font-bold ml-2" style={{ color: colors.error }}>
                        Remove Photo
                      </Text>
                    </View>
                  </Pressable>
                </Card>
              ) : (
                <View className="gap-3">
                  <Card shadow="lg" delay={0}>
                    <Pressable
                      onPress={openCamera}
                      className="py-6 items-center"
                    >
                      <View 
                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: colors.primary + '15' }}
                      >
                        <Ionicons name="camera" size={32} color={colors.primary} />
                      </View>
                      <Text className="font-bold text-base" style={{ color: colors.text }}>
                        Take Photo
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        Use your camera to capture the item
                      </Text>
                    </Pressable>
                  </Card>

                  <Card shadow="lg" delay={50}>
                    <Pressable
                      onPress={pickFromGallery}
                      className="py-6 items-center"
                    >
                      <View 
                        className="w-16 h-16 rounded-full items-center justify-center mb-3"
                        style={{ backgroundColor: colors.primary + '15' }}
                      >
                        <Ionicons name="images" size={32} color={colors.primary} />
                      </View>
                      <Text className="font-bold text-base" style={{ color: colors.text }}>
                        Choose from Gallery
                      </Text>
                      <Text className="text-sm" style={{ color: colors.textSecondary }}>
                        Select an existing photo
                      </Text>
                    </Pressable>
                  </Card>
                </View>
              )}

              {capturedImage && (
                <Pressable
                  onPress={() => setStep('details')}
                  className="mt-4 py-4 rounded-xl"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text className="text-white font-bold text-center text-lg">
                    Continue
                  </Text>
                </Pressable>
              )}
            </View>
          ) : (
            <View className="px-5 pt-4">
              {/* Details Section */}
              <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
                Item Details
              </Text>

              {/* Title */}
              <Card shadow="lg" delay={0} style={{ marginBottom: 12 }}>
                <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Title *
                </Text>
                <TextInput
                  className="p-4 rounded-xl text-base"
                  style={{ 
                    backgroundColor: colors.surfaceHover,
                    color: colors.text,
                  }}
                  placeholder="e.g., Discounted Grocery Bundle"
                  placeholderTextColor={colors.textTertiary}
                  value={title}
                  onChangeText={setTitle}
                />
              </Card>

              {/* Description */}
              <Card shadow="lg" delay={50} style={{ marginBottom: 12 }}>
                <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Description
                </Text>
                <TextInput
                  className="p-4 rounded-xl text-base"
                  style={{ 
                    backgroundColor: colors.surfaceHover,
                    color: colors.text,
                    minHeight: 100,
                    textAlignVertical: 'top'
                  }}
                  placeholder="Describe what's included..."
                  placeholderTextColor={colors.textTertiary}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                />
              </Card>

              {/* Category */}
              <Card shadow="lg" delay={100} style={{ marginBottom: 12 }}>
                <Text className="text-sm font-medium mb-3" style={{ color: colors.text }}>
                  Category *
                </Text>
                <View className="flex-row gap-3">
                  {categories.map((category) => (
                    <Pressable
                      key={category.id}
                      onPress={() => setSelectedCategory(category.id)}
                      className="flex-1 py-4 rounded-xl flex-row items-center justify-center"
                      style={{ 
                        backgroundColor: selectedCategory === category.id 
                          ? colors.primary 
                          : colors.surfaceHover 
                      }}
                    >
                      <Ionicons
                        name={category.icon as any}
                        size={20}
                        color={selectedCategory === category.id ? 'white' : colors.text}
                      />
                      <Text 
                        className="font-bold ml-2"
                        style={{ 
                          color: selectedCategory === category.id ? 'white' : colors.text 
                        }}
                      >
                        {category.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </Card>

              {/* Pricing */}
              <Card shadow="lg" delay={150} style={{ marginBottom: 12 }}>
                <Text className="text-sm font-medium mb-3" style={{ color: colors.text }}>
                  Pricing
                </Text>
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                      Retail Price ($)
                    </Text>
                    <TextInput
                      className="p-4 rounded-xl text-base"
                      style={{ 
                        backgroundColor: colors.surfaceHover,
                        color: colors.text,
                      }}
                      placeholder="25.00"
                      placeholderTextColor={colors.textTertiary}
                      value={price}
                      onChangeText={setPrice}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs mb-2" style={{ color: colors.textSecondary }}>
                      Credit Cost *
                    </Text>
                    <TextInput
                      className="p-4 rounded-xl text-base"
                      style={{ 
                        backgroundColor: colors.surfaceHover,
                        color: colors.text,
                      }}
                      placeholder="15"
                      placeholderTextColor={colors.textTertiary}
                      value={credits}
                      onChangeText={setCredits}
                      keyboardType="number-pad"
                    />
                  </View>
                </View>
                <Text className="text-xs mt-2" style={{ color: colors.textTertiary }}>
                  Beneficiaries will pay credits to claim this item
                </Text>
              </Card>

              {/* Location */}
              <Card shadow="lg" delay={200} style={{ marginBottom: 12 }}>
                <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                  Pickup Location
                </Text>
                <TextInput
                  className="p-4 rounded-xl text-base"
                  style={{ 
                    backgroundColor: colors.surfaceHover,
                    color: colors.text,
                  }}
                  placeholder="e.g., 123 Main St, City"
                  placeholderTextColor={colors.textTertiary}
                  value={location}
                  onChangeText={setLocation}
                />
              </Card>

              {/* Submit Button */}
              <View className="gap-3 mt-4">
                <Pressable
                  onPress={handleSubmit}
                  disabled={!title.trim() || !credits.trim() || isUploading}
                  className="py-4 rounded-xl"
                  style={{ 
                    backgroundColor: !title.trim() || !credits.trim() || isUploading 
                      ? colors.border 
                      : colors.primary 
                  }}
                >
                  <Text className="text-white font-bold text-center text-lg">
                    {isUploading ? 'Listing...' : 'List Item'}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => setStep('photo')}
                  className="py-4 rounded-xl"
                  style={{ backgroundColor: colors.surfaceHover }}
                >
                  <Text className="font-bold text-center text-base" style={{ color: colors.text }}>
                    Back
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
