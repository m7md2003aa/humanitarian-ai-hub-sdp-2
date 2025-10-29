import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Image as RNImage, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { ItemCategory, ClothType } from '../../types/donations';
import { Card } from '../../components/Card';
import { uploadDonationImage } from '../../utils/imageUpload';
import { isSupabaseConfigured } from '../../api/supabase';
import { classifyImage } from '../../utils/aiClassification';

// UUID validation function
function isValidUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

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

export default function DonationUpload({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<'photo' | 'details' | 'success'>('photo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('clothing');
  const [selectedClothType, setSelectedClothType] = useState<ClothType | null>(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facing, setFacing] = useState<CameraType>('back');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiDetails, setAiDetails] = useState<{
    size?: string;
    color?: string;
    clothType?: string;
  } | null>(null);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const addDonation = useDonationStore(state => state.addDonation);

  const analyzeCapturedImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      console.log('🔍 Analyzing image with Gemini...');
      const result = await classifyImage(imageUri);

      console.log('✅ AI Classification Result:', result);

      // Auto-fill the form with AI results
      if (result.title) {
        setTitle(result.title);
      }

      setSelectedCategory(result.category);

      // Set cloth type from AI - normalize to match our ClothType enum
      if (result.clothType) {
        const normalizedClothType = clothTypes.find(
          type => type.toLowerCase() === result.clothType?.toLowerCase()
        );
        if (normalizedClothType) {
          setSelectedClothType(normalizedClothType);
        } else {
          setSelectedClothType('Other');
        }
      }

      // Set size and color
      if (result.size) {
        setSize(result.size);
      }
      if (result.color) {
        setColor(result.color);
      }

      // Store detailed classification for display
      setAiDetails({
        size: result.size,
        color: result.color,
        clothType: result.clothType,
      });

    } catch (error) {
      console.error('❌ Error analyzing image:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      setCapturedImage(photo.uri);
      setShowCamera(false);

      // Automatically analyze the image with AI
      await analyzeCapturedImage(photo.uri);
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

      // Automatically analyze the image with AI
      await analyzeCapturedImage(result.assets[0].uri);
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
    if (!title.trim() || !capturedImage) return;
    
    setIsUploading(true);
    
    try {
      let finalImageUrl = capturedImage; // Default to local URI
      
      // Try to upload to Supabase if user has valid UUID (real user, not mock)
      if (user?.id && isValidUUID(user.id) && isSupabaseConfigured()) {
        console.log('Uploading image to Supabase...');
        const uploadedUrl = await uploadDonationImage(
          user.id,
          capturedImage,
          `donation_${Date.now()}.jpg`
        );
        
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
          console.log('✅ Image uploaded to Supabase:', uploadedUrl);
        } else {
          console.warn('⚠️ Supabase upload failed, using local image');
        }
      } else {
        console.log('Using local image (mock user or Supabase not configured)');
      }
      
      // Simulate upload delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addDonation({
        donorId: user?.id || '',
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        clothType: selectedClothType || undefined,
        size: size.trim() || undefined,
        color: color.trim() || undefined,
        images: [finalImageUrl], // Use Supabase URL or local fallback
        status: 'uploaded',
        value: 10, // Default credit value, will be adjusted by admin during verification
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
    setSelectedCategory('clothing');
    setSelectedClothType(null);
    setSize('');
    setColor('');
    setCapturedImage(null);
    setAiDetails(null);
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
            Donation Uploaded!
          </Text>
          
          <Text className="text-base text-center mb-8" style={{ color: colors.textSecondary }}>
            Your donation has been submitted and is pending verification by our admin team.
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
                Upload Donation
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

                  {/* AI Analyzing Indicator */}
                  {isAnalyzing && (
                    <View
                      className="py-3 px-4 rounded-lg mb-3 flex-row items-center"
                      style={{ backgroundColor: colors.primary + '15' }}
                    >
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text className="ml-3 font-medium" style={{ color: colors.primary }}>
                        AI is analyzing your image...
                      </Text>
                    </View>
                  )}

                  {/* AI Results Display */}
                  {aiDetails && !isAnalyzing && (
                    <View
                      className="py-3 px-4 rounded-lg mb-3"
                      style={{ backgroundColor: colors.success + '15' }}
                    >
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                        <Text className="ml-2 font-bold" style={{ color: colors.success }}>
                          AI Analysis Complete
                        </Text>
                      </View>
                      {aiDetails.clothType && (
                        <Text className="text-sm" style={{ color: colors.text }}>
                          • Type: {aiDetails.clothType}
                        </Text>
                      )}
                      {aiDetails.color && (
                        <Text className="text-sm" style={{ color: colors.text }}>
                          • Color: {aiDetails.color}
                        </Text>
                      )}
                      {aiDetails.size && (
                        <Text className="text-sm" style={{ color: colors.text }}>
                          • Size: {aiDetails.size}
                        </Text>
                      )}
                    </View>
                  )}

                  <Pressable
                    onPress={() => {
                      setCapturedImage(null);
                      setAiDetails(null);
                      setTitle('');
                      setDescription('');
                      setSelectedClothType(null);
                      setSize('');
                      setColor('');
                    }}
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
                  disabled={isAnalyzing}
                  className="mt-4 py-4 rounded-xl"
                  style={{
                    backgroundColor: isAnalyzing ? colors.border : colors.primary,
                  }}
                >
                  <Text className="text-white font-bold text-center text-lg">
                    {isAnalyzing ? 'Analyzing...' : 'Continue'}
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
                  placeholder="e.g., Winter Jacket"
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
                  placeholder="Describe the condition and details..."
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

              {/* Cloth Type */}
              {selectedCategory === 'clothing' && (
                <Card shadow="lg" delay={150} style={{ marginBottom: 12 }}>
                  <Text className="text-sm font-medium mb-3" style={{ color: colors.text }}>
                    Cloth Type *
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row gap-2"
                  >
                    {clothTypes.map((type) => (
                      <Pressable
                        key={type}
                        onPress={() => setSelectedClothType(type)}
                        className="py-3 px-4 rounded-xl"
                        style={{
                          backgroundColor: selectedClothType === type
                            ? colors.primary
                            : colors.surfaceHover,
                          marginRight: 8,
                        }}
                      >
                        <Text
                          className="font-medium"
                          style={{
                            color: selectedClothType === type ? 'white' : colors.text
                          }}
                        >
                          {type}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </Card>
              )}

              {/* Size and Color */}
              <View className="flex-row gap-3" style={{ marginBottom: 12 }}>
                <Card shadow="lg" delay={200} style={{ flex: 1 }}>
                  <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Size
                  </Text>
                  <TextInput
                    className="p-4 rounded-xl text-base"
                    style={{
                      backgroundColor: colors.surfaceHover,
                      color: colors.text,
                    }}
                    placeholder="e.g., Medium"
                    placeholderTextColor={colors.textTertiary}
                    value={size}
                    onChangeText={setSize}
                  />
                </Card>

                <Card shadow="lg" delay={220} style={{ flex: 1 }}>
                  <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                    Color
                  </Text>
                  <TextInput
                    className="p-4 rounded-xl text-base"
                    style={{
                      backgroundColor: colors.surfaceHover,
                      color: colors.text,
                    }}
                    placeholder="e.g., Blue"
                    placeholderTextColor={colors.textTertiary}
                    value={color}
                    onChangeText={setColor}
                  />
                </Card>
              </View>

              {/* Submit Button */}
              <View className="gap-3 mt-4">
                <Pressable
                  onPress={handleSubmit}
                  disabled={!title.trim() || isUploading || (selectedCategory === 'clothing' && !selectedClothType)}
                  className="py-4 rounded-xl"
                  style={{
                    backgroundColor: !title.trim() || isUploading || (selectedCategory === 'clothing' && !selectedClothType)
                      ? colors.border
                      : colors.primary
                  }}
                >
                  <Text className="text-white font-bold text-center text-lg">
                    {isUploading ? 'Uploading...' : 'Submit Donation'}
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
