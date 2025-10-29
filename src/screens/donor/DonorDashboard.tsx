import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '../../state/authStore';
import { useDonationStore } from '../../state/donationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors, spacing, typography, borderRadius } from '../../utils/theme';
import { Card } from '../../components/Card';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Soft, professional color palette for calm, trustworthy design
const softPalette = {
  softBlue: ['#60a5fa', '#93c5fd'] as const,        // Stats - calming blue
  softTeal: ['#5eead4', '#99f6e4'] as const,        // Stats - refreshing teal
  softLilac: ['#c4b5fd', '#ddd6fe'] as const,       // Stats - gentle purple
  softEmerald: ['#6ee7b7', '#a7f3d0'] as const,     // Stats - success green
  softAmber: ['#fcd34d', '#fde68a'] as const,       // Accent - warm gold
  neutralTeal: ['#67e8f9', '#a5f3fc'] as const,     // Primary CTA - professional
};

// Pro tips for donors
const donationTips = [
  {
    icon: 'sunny' as const,
    title: 'Good Lighting',
    description: 'Take photos in natural light for best results. Avoid dark or shadowy areas.',
  },
  {
    icon: 'shirt' as const,
    title: 'Clean Items',
    description: 'Ensure items are clean, folded, and in good condition before donating.',
  },
  {
    icon: 'resize' as const,
    title: 'Size Details',
    description: 'Include accurate size information (S, M, L, XL) to help beneficiaries.',
  },
  {
    icon: 'layers' as const,
    title: 'Multiple Angles',
    description: 'Take 2-3 photos from different angles to show the item clearly.',
  },
  {
    icon: 'pricetag' as const,
    title: 'Clear Descriptions',
    description: 'Write a brief, honest description including condition and any defects.',
  },
];

export default function DonorDashboard({ navigation }: any) {
  const user = useAuthStore(s => s.user);
  const theme = useSettingsStore(s => s.theme);
  const toggleTheme = useSettingsStore(s => s.toggleTheme);
  const colors = getThemeColors(theme);
  const allDonations = useDonationStore(s => s.donations);
  
  // State for modals and loading
  const [showTipsPanel, setShowTipsPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const donations = allDonations.filter(d => d.donorId === (user?.id || ''));
  
  const stats = {
    total: donations.length,
    pending: donations.filter(d => d.status === 'uploaded').length,
    listed: donations.filter(d => d.status === 'verified' || d.status === 'listed').length,
    received: donations.filter(d => d.status === 'received').length,
  };

  const recentDonations = donations.slice(0, 5);
  
  // Gentle pulse animation for donate button (very subtle)
  const pulseScale = useSharedValue(1);
  
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.01, { duration: 2000 }),
        withTiming(1, { duration: 2000 })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Friend';

  // Navigation handlers
  const handleStatCardPress = (filter: string) => {
    navigation.navigate('History', { filter });
  };

  const handleDonatePress = () => {
    navigation.navigate('Upload');
  };

  const handleNotificationsPress = () => {
    navigation.navigate('Notifications');
  };

  const handleTipPress = () => {
    setShowTipsPanel(true);
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.background }} 
      edges={['top']}
      accessibilityLabel="Donor Dashboard"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header with profile and notifications */}
        <Animated.View 
          entering={FadeIn.duration(400)}
          style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: borderRadius.full,
                backgroundColor: colors.primary + '20',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 20 }}>👤</Text>
            </View>
            <View>
              <Text style={{ fontSize: typography.fontSize.xs, color: colors.textSecondary }}>
                {getGreeting()}
              </Text>
              <Text style={{ 
                fontSize: typography.fontSize.lg, 
                fontWeight: typography.fontWeight.bold, 
                color: colors.text 
              }}>
                {firstName} 👋
              </Text>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <Pressable
              onPress={handleNotificationsPress}
              accessibilityLabel="View notifications"
              accessibilityRole="button"
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <View 
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#ef4444',
                }}
              />
            </Pressable>
            
            <Pressable
              onPress={toggleTheme}
              accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              accessibilityRole="button"
              disabled={isLoading}
              style={({ pressed }) => [
                {
                  width: 44,
                  height: 44,
                  borderRadius: borderRadius.full,
                  backgroundColor: colors.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons 
                name={theme === 'dark' ? 'sunny' : 'moon'} 
                size={22} 
                color={colors.text} 
              />
            </Pressable>
          </View>
        </Animated.View>

        {/* Impact Overview Stats */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <Animated.Text 
            entering={FadeInRight.delay(200).duration(600)}
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.text,
              marginBottom: spacing.md,
            }}
          >
            Your Impact 💫
          </Animated.Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            <StatCard
              icon="gift"
              count={stats.total}
              label="Total Donations"
              gradient={softPalette.softBlue}
              delay={300}
              onPress={() => handleStatCardPress('all')}
              accessibilityLabel={`Total donations: ${stats.total}. Tap to view all donations`}
            />
            <StatCard
              icon="time-outline"
              count={stats.pending}
              label="Pending Review"
              gradient={softPalette.softAmber}
              delay={400}
              onPress={() => handleStatCardPress('uploaded')}
              accessibilityLabel={`Pending review: ${stats.pending}. Tap to view pending items`}
            />
            <StatCard
              icon="list"
              count={stats.listed}
              label="Listed Items"
              gradient={softPalette.softLilac}
              delay={500}
              onPress={() => handleStatCardPress('verified')}
              accessibilityLabel={`Listed items: ${stats.listed}. Tap to view active listings`}
            />
            <StatCard
              icon="checkmark-circle"
              count={stats.received}
              label="Received"
              gradient={softPalette.softEmerald}
              delay={600}
              onPress={() => handleStatCardPress('received')}
              accessibilityLabel={`Items received: ${stats.received}. Tap to view received items`}
            />
          </View>
        </View>

        {/* Main Donate Action - Prominent CTA */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(600).springify()}
          style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}
        >
          <AnimatedPressable
            onPress={handleDonatePress}
            disabled={isLoading}
            accessibilityLabel="Donate an item - Take photo or upload to start"
            accessibilityRole="button"
            accessibilityHint="Opens donation upload screen"
            style={[
              pulseStyle,
              { opacity: isLoading ? 0.6 : 1 },
            ]}
          >
            <LinearGradient
              colors={['#67e8f9', '#a5f3fc']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: borderRadius['2xl'],
                padding: spacing.xl,
                shadowColor: '#06b6d4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: borderRadius.xl,
                    backgroundColor: 'rgba(14,165,233,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="camera" size={32} color="#0369a1" />
                </View>
                
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: '#0c4a6e',
                    marginBottom: spacing.xs,
                  }}>
                    Donate an Item
                  </Text>
                  <Text style={{
                    fontSize: typography.fontSize.sm,
                    color: '#075985',
                  }}>
                    Take a photo or upload to start
                  </Text>
                </View>
                
                <Ionicons name="arrow-forward-circle" size={36} color="#0369a1" />
              </View>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>

        {/* Pro Tips Carousel */}
        <View style={{ marginBottom: spacing.xl }}>
          <Animated.Text 
            entering={FadeInRight.delay(800).duration(600)}
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.text,
              paddingHorizontal: spacing.lg,
              marginBottom: spacing.md,
            }}
          >
            Pro Tips 💡
          </Animated.Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          >
            <TipCard
              icon="sunny"
              tip="Use clear lighting for photos"
              gradient={softPalette.softAmber}
              delay={900}
              onPress={handleTipPress}
            />
            <TipCard
              icon="shirt"
              tip="Items should be clean & folded"
              gradient={softPalette.softTeal}
              delay={1000}
              onPress={handleTipPress}
            />
            <TipCard
              icon="resize"
              tip="Add size details clearly"
              gradient={softPalette.softLilac}
              delay={1100}
              onPress={handleTipPress}
            />
            <TipCard
              icon="layers"
              tip="Include multiple angles"
              gradient={softPalette.softBlue}
              delay={1200}
              onPress={handleTipPress}
            />
          </ScrollView>
        </View>

        {/* Recent Donations */}
        <View style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: spacing.md,
          }}>
            <Animated.Text 
              entering={FadeInRight.delay(1300).duration(600)}
              style={{
                fontSize: typography.fontSize.xl,
                fontWeight: typography.fontWeight.bold,
                color: colors.text,
              }}
            >
              Recent Donations
            </Animated.Text>
            
            {recentDonations.length > 0 && (
              <Pressable 
                onPress={() => navigation.navigate('History')}
                accessibilityLabel="View all donations"
                accessibilityRole="button"
              >
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.primary,
                }}>
                  View All
                </Text>
              </Pressable>
            )}
          </View>

          {recentDonations.length > 0 ? (
            <View style={{ gap: spacing.md }}>
              {recentDonations.map((donation, index) => (
                <DonationCard
                  key={donation.id}
                  donation={donation}
                  colors={colors}
                  delay={1400 + index * 100}
                />
              ))}
            </View>
          ) : (
            <EmptyState navigation={navigation} colors={colors} />
          )}
        </View>

        {/* Help & Support Quick Access */}
        <Animated.View
          entering={FadeInDown.delay(1800).duration(600).springify()}
          style={{ paddingHorizontal: spacing.lg, marginBottom: spacing.xl }}
        >
          <Card shadow="md">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: borderRadius.xl,
                  backgroundColor: colors.info + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="help-circle" size={28} color={colors.info} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: typography.fontSize.base,
                  fontWeight: typography.fontWeight.semibold,
                  color: colors.text,
                  marginBottom: spacing.xs,
                }}>
                  Need Help?
                </Text>
                <Text style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.textSecondary,
                }}>
                  Contact support anytime
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      {/* Floating Quick Donate Button */}
      <Animated.View
        entering={FadeIn.delay(2000).duration(800)}
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          shadowColor: '#0ea5e9',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 6,
        }}
      >
        <Pressable
          onPress={handleDonatePress}
          disabled={isLoading}
          accessibilityLabel="Quick donate"
          accessibilityRole="button"
          accessibilityHint="Opens donation upload screen"
          style={({ pressed }) => [
            {
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: '#0ea5e9',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.8 : isLoading ? 0.6 : 1,
            },
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Ionicons name="add" size={32} color="#ffffff" />
          )}
        </Pressable>
      </Animated.View>

      {/* Tips Panel Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTipsPanel}
        onRequestClose={() => setShowTipsPanel(false)}
      >
        <Pressable 
          style={{ 
            flex: 1, 
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setShowTipsPanel(false)}
        >
          <Animated.View
            entering={SlideInDown.duration(300).springify()}
            exiting={SlideOutDown.duration(200)}
          >
            <Pressable 
              style={{
                backgroundColor: colors.surface,
                borderTopLeftRadius: borderRadius['3xl'],
                borderTopRightRadius: borderRadius['3xl'],
                paddingHorizontal: spacing.lg,
                paddingTop: spacing.lg,
                paddingBottom: spacing.xl + 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
              onPress={(e) => e.stopPropagation()}
            >
              {/* Handle Bar */}
              <View style={{
                width: 40,
                height: 4,
                backgroundColor: colors.border,
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: spacing.lg,
              }} />

              {/* Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: spacing.lg,
              }}>
                <Text style={{
                  fontSize: typography.fontSize['2xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.text,
                }}>
                  Pro Tips 💡
                </Text>
                <Pressable
                  onPress={() => setShowTipsPanel(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.surfaceHover,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close" size={20} color={colors.text} />
                </Pressable>
              </View>

              {/* Tips List */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 400 }}
                contentContainerStyle={{ gap: spacing.md }}
              >
                {donationTips.map((tip, index) => (
                  <Animated.View
                    key={index}
                    entering={FadeInDown.delay(index * 50).duration(400)}
                  >
                    <View style={{
                      flexDirection: 'row',
                      padding: spacing.md,
                      backgroundColor: colors.surfaceHover,
                      borderRadius: borderRadius.xl,
                      gap: spacing.md,
                    }}>
                      <View style={{
                        width: 44,
                        height: 44,
                        borderRadius: borderRadius.lg,
                        backgroundColor: colors.primary + '20',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Ionicons name={tip.icon} size={24} color={colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{
                          fontSize: typography.fontSize.base,
                          fontWeight: typography.fontWeight.bold,
                          color: colors.text,
                          marginBottom: spacing.xs,
                        }}>
                          {tip.title}
                        </Text>
                        <Text style={{
                          fontSize: typography.fontSize.sm,
                          color: colors.textSecondary,
                          lineHeight: typography.fontSize.sm * 1.4,
                        }}>
                          {tip.description}
                        </Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// Animated Stat Card Component with soft, flat design
function StatCard({ icon, count, label, gradient, delay, onPress, accessibilityLabel }: any) {
  const scale = useSharedValue(0.9);
  const theme = useSettingsStore(s => s.theme);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Extract base color from gradient
  const baseColor = gradient[0];

  return (
    <Animated.View 
      entering={FadeInDown.delay(delay).duration(800).springify()}
      style={[
        animatedStyle,
        { width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2 }
      ]}
    >
      <Pressable
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        style={({ pressed }) => [
          {
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View
          style={{
            padding: spacing.lg,
            borderRadius: borderRadius['2xl'],
            backgroundColor: theme === 'dark' ? baseColor + '20' : baseColor + '15',
            borderWidth: 1,
            borderColor: theme === 'dark' ? baseColor + '40' : baseColor + '25',
            minHeight: 140,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: borderRadius.xl,
              backgroundColor: theme === 'dark' ? baseColor + '30' : baseColor + '25',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.md,
            }}
          >
            <Ionicons name={icon} size={24} color={baseColor} />
          </View>
          
          <Text style={{
            fontSize: 36,
            fontWeight: typography.fontWeight.extrabold,
            color: baseColor,
            marginBottom: spacing.xs,
          }}>
            {count}
          </Text>
          
          <Text style={{
            fontSize: typography.fontSize.xs,
            color: baseColor,
            fontWeight: typography.fontWeight.semibold,
            opacity: 0.8,
          }}>
            {label}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Tip Card Component with soft, professional design
function TipCard({ icon, tip, gradient, delay, onPress }: any) {
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const baseColor = gradient[0];
  
  return (
    <Animated.View 
      entering={FadeInRight.delay(delay).duration(800).springify()}
      style={{ width: SCREEN_WIDTH * 0.7 }}
    >
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Tip: ${tip}`}
        style={({ pressed }) => [
          {
            borderRadius: borderRadius.xl,
            padding: spacing.lg,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: theme === 'dark' ? baseColor + '30' : baseColor + '20',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: borderRadius.lg,
              backgroundColor: theme === 'dark' ? baseColor + '25' : baseColor + '20',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={22} color={baseColor} />
          </View>
          <Text style={{
            flex: 1,
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.semibold,
            color: colors.text,
          }}>
            {tip}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Donation Card Component
function DonationCard({ donation, colors, delay }: any) {
  const theme = useSettingsStore(s => s.theme);
  
  const statusColors: any = {
    uploaded: { bg: '#fef3c7', text: '#f59e0b', icon: 'time-outline' },
    verified: { bg: '#dbeafe', text: '#3b82f6', icon: 'checkmark-circle' },
    listed: { bg: '#ede9fe', text: '#8b5cf6', icon: 'list' },
    allocated: { bg: '#d1fae5', text: '#10b981', icon: 'person-add' },
    received: { bg: '#d1fae5', text: '#10b981', icon: 'checkmark-done-circle' },
  };

  const status = statusColors[donation.status] || statusColors.uploaded;

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(600).springify()}>
      <Card shadow="md">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: borderRadius.xl,
              backgroundColor: colors.primary + '15',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="gift" size={28} color={colors.primary} />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.semibold,
              color: colors.text,
              marginBottom: spacing.xs,
            }} numberOfLines={1}>
              {donation.title}
            </Text>
            <Text style={{
              fontSize: typography.fontSize.sm,
              color: colors.textSecondary,
            }}>
              {new Date(donation.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Text>
          </View>
          
          <View
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: borderRadius.lg,
              backgroundColor: theme === 'dark' ? status.text + '30' : status.bg,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs,
            }}
          >
            <Ionicons name={status.icon} size={14} color={status.text} />
            <Text style={{
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              color: status.text,
              textTransform: 'capitalize',
            }}>
              {donation.status}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

// Empty State Component
function EmptyState({ navigation, colors }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(1500).duration(600).springify()}>
      <Card shadow="md">
        <View style={{ alignItems: 'center', paddingVertical: spacing['2xl'] }}>
          <View
            style={{
              width: 120,
              height: 120,
              borderRadius: borderRadius.full,
              backgroundColor: colors.primary + '15',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <Ionicons name="gift-outline" size={56} color={colors.primary} />
          </View>
          
          <Text style={{
            fontSize: typography.fontSize.xl,
            fontWeight: typography.fontWeight.bold,
            color: colors.text,
            marginBottom: spacing.sm,
            textAlign: 'center',
          }}>
            Start Your Giving Journey
          </Text>
          
          <Text style={{
            fontSize: typography.fontSize.base,
            color: colors.textSecondary,
            textAlign: 'center',
            marginBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
            lineHeight: typography.fontSize.base * 1.5,
          }}>
            Your first donation can change someone{"'"}s life. Every item matters.
          </Text>
          
          <Pressable
            onPress={() => navigation.navigate('Upload')}
            style={{
              paddingHorizontal: spacing['2xl'],
              paddingVertical: spacing.md,
              borderRadius: borderRadius.xl,
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{
              fontSize: typography.fontSize.base,
              fontWeight: typography.fontWeight.bold,
              color: '#ffffff',
            }}>
              Upload First Item
            </Text>
          </Pressable>
        </View>
      </Card>
    </Animated.View>
  );
}
