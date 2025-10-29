import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, TextInput, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeIn, 
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useSharedValue,
} from 'react-native-reanimated';
import { useAuthStore } from '../../state/authStore';
import { useSettingsStore } from '../../state/settingsStore';
import { useDonationStore } from '../../state/donationStore';
import { useCreditBalance } from '../../hooks/useCredits';
import { getThemeColors, spacing, typography, borderRadius } from '../../utils/theme';
import { Card } from '../../components/Card';
import { supabase, isSupabaseConfigured } from '../../api/supabase';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Clothing subcategories with beautiful icons
const clothingSubcategories = [
  { id: 'kandora', label: 'Kandora', icon: '👔', iconImage: require('../../../assets/subcategory-icons/kandora.jpg'), description: 'Traditional wear', color: '#8B5CF6' },
  { id: 'ghutra', label: 'Ghutra', icon: '🧣', iconImage: require('../../../assets/subcategory-icons/ghutra.jpg'), description: 'Headwear', color: '#EC4899' },
  { id: 'jacket', label: 'Jacket', icon: '🧥', description: 'Outerwear', color: '#F59E0B' },
  { id: 'tshirt', label: 'T-Shirt', icon: '👕', description: 'Casual wear', color: '#10B981' },
  { id: 'pants', label: 'Pants', icon: '👖', description: 'Bottoms', color: '#3B82F6' },
  { id: 'shoes', label: 'Shoes', icon: '👞', description: 'Footwear', color: '#EF4444' },
];

const categories = [
  { id: 'all', label: 'All Items', icon: 'apps-outline', gradient: ['#667eea', '#764ba2'] },
  { id: 'clothes', label: 'Clothes', icon: 'shirt-outline', gradient: ['#f093fb', '#f5576c'] },
  { id: 'other', label: 'Other', icon: 'cube-outline', gradient: ['#4facfe', '#00f2fe'] },
];

export default function BeneficiaryDashboard({ navigation }: any) {
  const user = useAuthStore(s => s.user);
  const theme = useSettingsStore(s => s.theme);
  const toggleTheme = useSettingsStore(s => s.toggleTheme);
  const colors = getThemeColors(theme);
  const initializeUserCredits = useDonationStore(s => s.initializeUserCredits);
  
  // Use Supabase-backed credit balance with real-time sync
  const { credits, isLoading: creditsLoading, refreshCredits } = useCreditBalance(user?.id);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterSize, setFilterSize] = useState<string | null>(null);
  const [filterGender, setFilterGender] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      initializeUserCredits(user.id);
      refreshCredits(); // Fetch from Supabase on mount
    }
    fetchDonations();
  }, [user?.id]);

  const fetchDonations = async () => {
    if (!isSupabaseConfigured()) {
      // Use mock data if Supabase not configured
      setDonations([
        {
          id: '1',
          title: 'White Kandora',
          description: 'Brand new traditional kandora, size L',
          category: 'clothes',
          subcategory: 'kandora',
          images: [],
          credits: 15,
          size: 'L',
          gender: 'male',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Cotton Ghutra',
          description: 'White and red ghutra, excellent condition',
          category: 'clothes',
          subcategory: 'ghutra',
          images: [],
          credits: 8,
          gender: 'male',
          created_at: new Date().toISOString(),
        },
      ]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .in('status', ['verified', 'listed'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    if (categoryId === 'clothes') {
      setShowSubcategories(true);
    } else {
      setShowSubcategories(false);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryPress = (subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId === selectedSubcategory ? null : subcategoryId);
  };

  const filteredDonations = donations.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || item.subcategory === selectedSubcategory;
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = !filterSize || item.size === filterSize;
    const matchesGender = !filterGender || item.gender === filterGender;
    
    return matchesCategory && matchesSubcategory && matchesSearch && matchesSize && matchesGender;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      refreshCredits(),
      fetchDonations(),
    ]);
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Dark Mode Toggle */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
        <View style={{ flex: 1 }} />
        <Pressable 
          onPress={toggleTheme}
          style={{
            width: 44,
            height: 44,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.surfaceHover,
          }}
        >
          <Ionicons 
            name={theme === 'dark' ? 'sunny' : 'moon'} 
            size={22} 
            color={colors.text} 
          />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Hero Credit Card */}
        <Animated.View 
          entering={FadeInDown.duration(700).springify()}
          style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, marginBottom: spacing.xl }}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2'] as const}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: borderRadius['2xl'],
              padding: spacing.xl,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.8)', fontWeight: typography.fontWeight.medium, marginBottom: spacing.xs }}>
                  Your Credits
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginVertical: spacing.sm }}>
                  <Text style={{ fontSize: 48, color: '#FFFFFF', fontWeight: typography.fontWeight.extrabold }}>
                    {credits}
                  </Text>
                  <View style={{ width: 32, height: 32, borderRadius: borderRadius.full, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="diamond" size={20} color="#FFD700" />
                  </View>
                </View>
                <Text style={{ fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.9)' }}>
                  Available to spend
                </Text>
              </View>
              <View style={{ width: 80, height: 80, borderRadius: borderRadius.xl, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="wallet" size={40} color="#fff" />
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(600).springify()}
          style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.xl,
            borderWidth: 1,
            gap: spacing.sm,
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              style={{ flex: 1, fontSize: typography.fontSize.base, paddingVertical: spacing.xs, color: colors.text }}
              placeholder="Search for items..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </Animated.View>

        {/* Category Pills */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(600)}
          style={{ marginBottom: spacing.lg }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
          >
            {categories.map((category, index) => {
              const isSelected = selectedCategory === category.id;
              
              return (
                <AnimatedPressable
                  key={category.id}
                  entering={FadeInDown.delay(300 + index * 100).duration(600).springify()}
                  onPress={() => handleCategoryPress(category.id)}
                  style={{
                    borderRadius: borderRadius.full,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isSelected ? 'transparent' : colors.border,
                  }}
                >
                  {isSelected ? (
                    <LinearGradient
                      colors={category.gradient as [string, string]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        gap: spacing.xs,
                      }}
                    >
                      <Ionicons name={category.icon as any} size={20} color="#fff" />
                      <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: '#fff' }}>
                        {category.label}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: spacing.lg,
                        paddingVertical: spacing.md,
                        gap: spacing.xs,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <Ionicons name={category.icon as any} size={20} color={colors.textSecondary} />
                      <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.text }}>
                        {category.label}
                      </Text>
                    </View>
                  )}
                </AnimatedPressable>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Subcategories Carousel (Clothes) */}
        {showSubcategories && (
          <Animated.View 
            entering={FadeIn.delay(100).duration(400)} 
            exiting={FadeOut.duration(200)}
            style={{ marginBottom: spacing.lg }}
          >
            <Animated.View entering={FadeIn.delay(100)} exiting={FadeOut}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, marginBottom: spacing.md }}>
                <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text }}>
                  Choose a type ✨
                </Text>
                <View style={{ flexDirection: 'row', gap: spacing.xs }}>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: selectedSubcategory ? colors.primary : colors.textTertiary }} />
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textTertiary + '50' }} />
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textTertiary + '50' }} />
                </View>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={SCREEN_WIDTH * 0.75 + spacing.md}
                decelerationRate="fast"
                contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
              >
                {clothingSubcategories.map((sub, index) => {
                  const isSelected = selectedSubcategory === sub.id;
                  
                  return (
                    <AnimatedPressable
                      key={sub.id}
                      entering={SlideInDown.delay(index * 80).springify()}
                      exiting={SlideOutDown}
                      onPress={() => handleSubcategoryPress(sub.id)}
                      style={{
                        width: SCREEN_WIDTH * 0.75,
                        borderRadius: borderRadius['2xl'],
                        overflow: 'hidden',
                        borderWidth: isSelected ? 4 : 2,
                        borderColor: isSelected ? sub.color : colors.border,
                        backgroundColor: colors.surface,
                        shadowColor: isSelected ? sub.color : '#000',
                        shadowOffset: { width: 0, height: isSelected ? 12 : 6 },
                        shadowOpacity: isSelected ? 0.5 : 0.15,
                        shadowRadius: isSelected ? 20 : 10,
                        elevation: isSelected ? 12 : 6,
                        transform: [{ scale: isSelected ? 1.02 : 1 }],
                      }}
                    >
                      {/* Gradient Background Overlay */}
                      <LinearGradient
                        colors={isSelected ? [sub.color + '20', sub.color + '05'] : ['transparent', 'transparent']}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      />
                      
                      <View style={{
                        padding: spacing.lg,
                        alignItems: 'center',
                        minHeight: 200,
                        justifyContent: 'center',
                      }}>
                        {/* Icon/Image Section */}
                        <View style={{
                          width: 100,
                          height: 100,
                          borderRadius: borderRadius['2xl'],
                          backgroundColor: sub.color + '15',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: spacing.md,
                          borderWidth: 2,
                          borderColor: isSelected ? sub.color + '40' : 'transparent',
                        }}>
                          {sub.iconImage ? (
                            <Image 
                              source={sub.iconImage}
                              style={{ 
                                width: 80, 
                                height: 80,
                              }}
                              resizeMode="contain"
                            />
                          ) : (
                            <Text style={{ fontSize: 56 }}>
                              {sub.icon}
                            </Text>
                          )}
                        </View>
                        
                        {/* Text Section */}
                        <Text style={{
                          fontSize: typography.fontSize.xl,
                          fontWeight: typography.fontWeight.bold,
                          color: isSelected ? sub.color : colors.text,
                          textAlign: 'center',
                          marginBottom: spacing.xs,
                        }}>
                          {sub.label}
                        </Text>
                        
                        <Text style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.textSecondary,
                          textAlign: 'center',
                          marginBottom: spacing.md,
                        }}>
                          {sub.description}
                        </Text>
                        
                        {/* Selection Indicator */}
                        {isSelected && (
                          <Animated.View 
                            entering={FadeIn.duration(200)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: spacing.xs,
                              paddingHorizontal: spacing.md,
                              paddingVertical: spacing.sm,
                              borderRadius: borderRadius.full,
                              backgroundColor: sub.color + '20',
                            }}
                          >
                            <View style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: sub.color,
                            }} />
                            <Text style={{
                              fontSize: typography.fontSize.xs,
                              fontWeight: typography.fontWeight.bold,
                              color: sub.color,
                            }}>
                              Selected
                            </Text>
                          </Animated.View>
                        )}
                      </View>
                    </AnimatedPressable>
                  );
                })}
              </ScrollView>
              
              {/* Scroll Hint */}
              <View style={{ 
                alignItems: 'center', 
                marginTop: spacing.md,
                flexDirection: 'row',
                justifyContent: 'center',
                gap: spacing.sm,
              }}>
                <Ionicons name="chevron-back" size={16} color={colors.textTertiary} />
                <Text style={{ 
                  fontSize: typography.fontSize.xs, 
                  color: colors.textTertiary,
                }}>
                  Swipe to see more
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
              </View>
            </Animated.View>
          </Animated.View>
        )}

        {/* Filters (when subcategory selected) */}
        {selectedSubcategory && (
          <Animated.View 
            entering={FadeInDown.duration(400).springify()}
            exiting={FadeOut}
            style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}
          >
            <Text style={{ fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.text, marginBottom: spacing.sm }}>
              Filters
            </Text>
            <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm }}>
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <Pressable
                  key={size}
                  onPress={() => setFilterSize(filterSize === size ? null : size)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    backgroundColor: filterSize === size ? colors.primary : colors.surfaceHover,
                    borderWidth: 1,
                    borderColor: filterSize === size ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: filterSize === size ? '#fff' : colors.text,
                  }}>
                    {size}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {['male', 'female', 'unisex'].map(gender => (
                <Pressable
                  key={gender}
                  onPress={() => setFilterGender(filterGender === gender ? null : gender)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: borderRadius.full,
                    backgroundColor: filterGender === gender ? colors.primary : colors.surfaceHover,
                    borderWidth: 1,
                    borderColor: filterGender === gender ? colors.primary : colors.border,
                  }}
                >
                  <Text style={{
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.semibold,
                    color: filterGender === gender ? '#fff' : colors.text,
                    textTransform: 'capitalize',
                  }}>
                    {gender}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Items Section */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.lg }}>
          <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.text, marginBottom: spacing.xs }}>
            {selectedSubcategory 
              ? `${clothingSubcategories.find(s => s.id === selectedSubcategory)?.label} Items`
              : 'Available Items'}
          </Text>
          <Text style={{ fontSize: typography.fontSize.sm, color: colors.textSecondary, marginBottom: spacing.md }}>
            {filteredDonations.length} items found
          </Text>
        </View>

        {/* Items Grid */}
        <View style={{ paddingHorizontal: spacing.lg, flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {filteredDonations.length > 0 ? (
            filteredDonations.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                credits={credits}
                colors={colors}
                delay={500 + index * 50}
                selectedSubcategory={selectedSubcategory}
              />
            ))
          ) : (
            <Card shadow="md" delay={500} style={{ width: '100%' }}>
              <View style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
                <View style={{
                  width: 96,
                  height: 96,
                  borderRadius: borderRadius.full,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: spacing.lg,
                  backgroundColor: colors.primary + '20',
                }}>
                  <Ionicons name="cube-outline" size={48} color={colors.primary} />
                </View>
                <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, marginBottom: spacing.sm, color: colors.text }}>
                  No Items Found
                </Text>
                <Text style={{ fontSize: typography.fontSize.base, textAlign: 'center', color: colors.textSecondary }}>
                  {searchQuery 
                    ? 'Try adjusting your search or filters'
                    : selectedSubcategory
                    ? `No ${clothingSubcategories.find(s => s.id === selectedSubcategory)?.label.toLowerCase()} items available yet`
                    : 'Check back soon for new donations'}
                </Text>
              </View>
            </Card>
          )}
        </View>

        {/* Info Card */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(600).springify()}
          style={{ paddingHorizontal: spacing.lg, marginTop: spacing.xl }}
        >
          <Card shadow="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: borderRadius.md,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.info + '20',
              }}>
                <Ionicons name="information-circle" size={24} color={colors.info} />
              </View>
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.text }}>
                How It Works
              </Text>
            </View>
            <Text style={{ fontSize: typography.fontSize.base, lineHeight: typography.fontSize.base * 1.5, color: colors.textSecondary }}>
              Browse verified donations and use your credits to claim items you need. All items are quality-checked. Tap on a category to explore, select subcategories, and filter by size or gender to find the perfect match!
            </Text>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ItemCard({ item, credits, colors, delay, selectedSubcategory }: any) {
  const canAfford = (item.credits || 10) <= credits;
  const subcategoryData = clothingSubcategories.find(s => s.id === selectedSubcategory);

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(600).springify()}
      style={{ width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2 }}
    >
      <Pressable
        style={{
          borderRadius: borderRadius.xl,
          overflow: 'hidden',
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 2,
          borderColor: canAfford && subcategoryData ? subcategoryData.color + '30' : colors.border,
        }}
      >
        {/* Image Placeholder */}
        <View style={{
          width: '100%',
          height: 140,
          backgroundColor: subcategoryData ? subcategoryData.color + '20' : colors.primary + '15',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {item.images && item.images[0] ? (
            <Image source={{ uri: item.images[0] }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          ) : subcategoryData?.iconImage ? (
            <Image source={subcategoryData.iconImage} style={{ width: 80, height: 80 }} resizeMode="contain" />
          ) : (
            <Text style={{ fontSize: 48 }}>
              {subcategoryData?.icon || '🎁'}
            </Text>
          )}
        </View>

        <View style={{ padding: spacing.md }}>
          <Text style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text,
            marginBottom: spacing.xs,
            minHeight: 40,
          }} numberOfLines={2}>
            {item.title}
          </Text>
          
          {item.size && (
            <Text style={{ fontSize: typography.fontSize.xs, color: colors.textSecondary, marginBottom: spacing.xs }}>
              Size: {item.size}
            </Text>
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
              borderRadius: borderRadius.full,
              gap: spacing.xs,
              backgroundColor: canAfford ? colors.success + '20' : colors.error + '20',
            }}>
              <Ionicons 
                name="diamond" 
                size={14} 
                color={canAfford ? colors.success : colors.error} 
              />
              <Text style={{
                fontSize: typography.fontSize.sm,
                fontWeight: typography.fontWeight.bold,
                color: canAfford ? colors.success : colors.error,
              }}>
                {item.credits || 10}
              </Text>
            </View>

            {canAfford && (
              <View style={{
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
                borderRadius: borderRadius.md,
                backgroundColor: subcategoryData?.color || colors.primary,
              }}>
                <Text style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  color: '#fff',
                }}>
                  Claim
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
