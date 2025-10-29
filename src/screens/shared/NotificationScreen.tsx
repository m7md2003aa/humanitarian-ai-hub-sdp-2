import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '../../state/authStore';
import { useNotificationStore } from '../../state/notificationStore';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'donation_approved': return 'checkmark-circle';
    case 'donation_rejected': return 'close-circle';
    case 'item_available': return 'gift';
    case 'credits_added': return 'wallet';
    case 'item_claimed': return 'people';
    case 'system': return 'information-circle';
    default: return 'notifications';
  }
};

const getNotificationColor = (type: string): [string, string] => {
  switch (type) {
    case 'donation_approved': return ['#10B981', '#059669'];
    case 'donation_rejected': return ['#EF4444', '#DC2626'];
    case 'item_available': return ['#3B82F6', '#2563EB'];
    case 'credits_added': return ['#F59E0B', '#D97706'];
    case 'item_claimed': return ['#8B5CF6', '#7C3AED'];
    case 'system': return ['#6B7280', '#4B5563'];
    default: return ['#6B7280', '#4B5563'];
  }
};

export default function NotificationScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const user = useAuthStore(state => state.user);
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const allNotifications = useNotificationStore(state => state.notifications);
  const { markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  
  const userNotifications = allNotifications
    .filter(notification => notification.userId === (user?.id || ''))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
  const filteredNotifications = filter === 'unread' 
    ? userNotifications.filter(n => !n.isRead)
    : userNotifications;
    
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationPress = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(notificationId);
    }
  };

  const handleClearAll = () => {
    if (user?.id) {
      clearNotifications(user.id);
    }
  };

  const handleMarkAllRead = () => {
    if (user?.id) {
      markAllAsRead(user.id);
    }
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
      >
        {/* Sticky Header */}
        <View style={{ backgroundColor: colors.surface }}>
          <View className="px-5 pt-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <Text className="text-sm mt-1" style={{ color: colors.textSecondary }}>
                    {unreadCount} unread
                  </Text>
                )}
              </View>
              
              <View className="flex-row gap-2">
                {userNotifications.length > 0 && unreadCount > 0 && (
                  <Pressable
                    onPress={handleMarkAllRead}
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.primary + '15' }}
                  >
                    <Ionicons name="checkmark-done" size={20} color={colors.primary} />
                  </Pressable>
                )}
                {userNotifications.length > 0 && (
                  <Pressable
                    onPress={handleClearAll}
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.error + '15' }}
                  >
                    <Ionicons name="trash" size={20} color={colors.error} />
                  </Pressable>
                )}
              </View>
            </View>
            
            {/* Filter Tabs */}
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setFilter('all')}
                className="flex-1 py-2 rounded-lg"
                style={{ 
                  backgroundColor: filter === 'all' ? colors.primary : colors.surfaceHover 
                }}
              >
                <Text 
                  className="font-bold text-sm text-center"
                  style={{ color: filter === 'all' ? 'white' : colors.text }}
                >
                  All ({userNotifications.length})
                </Text>
              </Pressable>
              
              <Pressable
                onPress={() => setFilter('unread')}
                className="flex-1 py-2 rounded-lg"
                style={{ 
                  backgroundColor: filter === 'unread' ? colors.primary : colors.surfaceHover 
                }}
              >
                <Text 
                  className="font-bold text-sm text-center"
                  style={{ color: filter === 'unread' ? 'white' : colors.text }}
                >
                  Unread ({unreadCount})
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Notifications List */}
        <View className="px-5 pt-4">
          {filteredNotifications.length > 0 ? (
            <View className="gap-3">
              {filteredNotifications.map((notification, index) => {
                const notificationColors = getNotificationColor(notification.type);
                const icon = getNotificationIcon(notification.type);
                
                return (
                  <Card key={notification.id} shadow="lg" delay={index * 30}>
                    <Pressable 
                      onPress={() => handleNotificationPress(notification.id, notification.isRead)}
                      className="flex-row items-start"
                    >
                      <LinearGradient
                        colors={notificationColors}
                        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Ionicons name={icon as any} size={24} color="white" />
                      </LinearGradient>
                      
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between mb-1">
                          <Text className="flex-1 font-bold text-base mr-2" style={{ color: colors.text }}>
                            {notification.title}
                          </Text>
                          {!notification.isRead && (
                            <View 
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: colors.primary }}
                            />
                          )}
                        </View>
                        
                        <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>
                          {notification.message}
                        </Text>
                        
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                          <Text className="text-xs ml-1" style={{ color: colors.textTertiary }}>
                            {new Date(notification.createdAt).toLocaleDateString()} at{' '}
                            {new Date(notification.createdAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
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
                  style={{ backgroundColor: colors.surfaceHover }}
                >
                  <Ionicons name="notifications-off-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                  {filter === 'unread' ? 'No Unread Notifications' : 'No Notifications'}
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  {filter === 'unread' 
                    ? 'You are all caught up!'
                    : 'You will see notifications here when you have them'
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
