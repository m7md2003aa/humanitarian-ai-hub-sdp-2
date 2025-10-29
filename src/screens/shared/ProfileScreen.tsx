import React from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../state/authStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { GradientCard } from '../../components/GradientCard';

const getRoleGradient = (role: string): [string, string] => {
  switch (role) {
    case 'donor':
      return ['#3B82F6', '#8B5CF6'];
    case 'beneficiary':
      return ['#10B981', '#06B6D4'];
    case 'business':
      return ['#F59E0B', '#EF4444'];
    case 'admin':
      return ['#EF4444', '#EC4899'];
    default:
      return ['#3B82F6', '#8B5CF6'];
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'donor':
      return 'heart';
    case 'beneficiary':
      return 'people';
    case 'business':
      return 'storefront';
    case 'admin':
      return 'shield-checkmark';
    default:
      return 'person';
  }
};

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuthStore();
  const theme = useSettingsStore(s => s.theme);
  const toggleTheme = useSettingsStore(s => s.toggleTheme);
  const colors = getThemeColors(theme);
  
  const roleGradient: [string, string] = user ? getRoleGradient(user.role) : ['#3B82F6', '#8B5CF6'];
  const roleIcon = user ? getRoleIcon(user.role) : 'person';

  const handleLogout = async () => {
    await logout();
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
        {/* Hero Profile Card */}
        <View className="px-5 pt-4 pb-3">
          <GradientCard
            colors={roleGradient}
            delay={0}
            shadow="2xl"
          >
            <View className="items-center py-4">
              {/* Avatar */}
              <View className="w-24 h-24 rounded-full bg-white/20 items-center justify-center mb-4 border-4 border-white/30">
                <Ionicons name={roleIcon as any} size={48} color="white" />
              </View>
              
              {/* User Info */}
              <Text className="text-white text-2xl font-bold mb-1">
                {user?.name}
              </Text>
              <Text className="text-white/80 text-sm mb-3">
                {user?.email}
              </Text>
              
              {/* Role Badge */}
              <View className="bg-white/20 px-4 py-2 rounded-full">
                <Text className="text-white font-bold text-sm">
                  {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
                </Text>
              </View>
            </View>
          </GradientCard>
        </View>

        {/* Account Stats (for specific roles) */}
        {user?.role === 'beneficiary' && user.credits !== undefined && (
          <View className="px-5 mb-4">
            <Card shadow="lg" delay={100}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-xl bg-green-500/10 items-center justify-center mr-3">
                    <Ionicons name="wallet" size={24} color="#10B981" />
                  </View>
                  <View>
                    <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Available Credits
                    </Text>
                    <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                      {user.credits}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Card>
          </View>
        )}

        {user?.role === 'business' && user.businessVerified !== undefined && (
          <View className="px-5 mb-4">
            <Card shadow="lg" delay={100}>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-xl items-center justify-center mr-3 ${
                    user.businessVerified ? 'bg-green-500/10' : 'bg-amber-500/10'
                  }`}>
                    <Ionicons 
                      name={user.businessVerified ? "checkmark-circle" : "time"} 
                      size={24} 
                      color={user.businessVerified ? "#10B981" : "#F59E0B"} 
                    />
                  </View>
                  <View>
                    <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      Business Status
                    </Text>
                    <Text className="text-lg font-bold" style={{ color: colors.text }}>
                      {user.businessVerified ? 'Verified' : 'Pending Verification'}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Card>
          </View>
        )}

        {/* Settings Section */}
        <View className="px-5 mb-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Settings
          </Text>

          {/* Dark Mode Toggle */}
          <Card shadow="lg" delay={200} style={{ marginBottom: 12 }}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons 
                    name={theme === 'dark' ? "moon" : "sunny"} 
                    size={24} 
                    color={colors.primary} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Dark Mode
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="white"
              />
            </View>
          </Card>

          {/* Notifications */}
          <Card shadow="lg" delay={250} style={{ marginBottom: 12 }}>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('Notifications')}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="notifications" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Notifications
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Manage notification settings
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Card>

          {/* Privacy */}
          <Card shadow="lg" delay={300} style={{ marginBottom: 12 }}>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('Privacy')}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="lock-closed" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Privacy
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Privacy and security settings
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Card>

          {/* Language */}
          <Card shadow="lg" delay={350}>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('Language')}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="language" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Language
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    English
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Card>
        </View>

        {/* Support Section */}
        <View className="px-5 mb-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Support
          </Text>

          <Card shadow="lg" delay={400} style={{ marginBottom: 12 }}>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('HelpCenter')}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="help-circle" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    Help Center
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    FAQs and support
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Card>

          <Card shadow="lg" delay={450}>
            <Pressable
              className="flex-row items-center justify-between"
              onPress={() => navigation.navigate('About')}
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="information-circle" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base" style={{ color: colors.text }}>
                    About
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Version 1.0.0
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
            </Pressable>
          </Card>
        </View>

        {/* Logout Button */}
        <View className="px-5 mb-4">
          <Card shadow="lg" delay={500} style={{ padding: 0, overflow: 'hidden' }}>
            <Pressable onPress={handleLogout}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 px-4 flex-row items-center justify-center"
              >
                <Ionicons name="log-out" size={24} color="white" />
                <Text className="text-white font-bold text-lg ml-3">
                  Sign Out
                </Text>
              </LinearGradient>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}