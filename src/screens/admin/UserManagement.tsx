import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { useUsersStore } from '../../state/usersStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';
import { sendNotification } from '../../state/notificationStore';
import { supabase, isSupabaseConfigured } from '../../api/supabase';
import { User } from '../../types/user';
import { UserManagementHelper } from './UserManagementHelper';

export default function UserManagement() {
  const insets = useSafeAreaInsets();
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'credits' | 'suspend' | 'activate'>('credits');
  const [creditAmount, setCreditAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [supabaseUsers, setSupabaseUsers] = useState<User[]>([]);
  const [showHelper, setShowHelper] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);
  const localUsers = useUsersStore(state => state.getAllUsers());
  const updateLocalUser = useUsersStore(state => state.updateUser);

  // Fetch users from Supabase on mount
  useEffect(() => {
    fetchUsers();
    
    // Show migration helper if using local data with few users
    if (localUsers.length <= 1 && isSupabaseConfigured()) {
      setShowHelper(true);
    }
  }, []);

  const fetchUsers = async () => {
    if (!isSupabaseConfigured()) {
      return; // Use local users only
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If RLS error, silently fallback to local users
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.log('📝 Note: Using local user storage. To enable Supabase sync, run fix-supabase-rls-v2.sql in your Supabase SQL Editor.');
        } else {
          // Log other errors
          console.error('Error fetching users:', error);
        }
        return;
      }

      if (data) {
        const users: User[] = data.map(u => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: new Date(u.created_at),
          credits: u.credits,
          businessVerified: u.business_status === 'approved',
          profileImage: u.avatar_url,
          accountStatus: u.account_status || 'active',
          suspendedAt: u.suspended_at ? new Date(u.suspended_at) : undefined,
        }));
        setSupabaseUsers(users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use Supabase users if available, otherwise use local users
  const allUsers = supabaseUsers.length > 0 ? supabaseUsers : localUsers;

  const filteredUsers = filterRole === 'all' 
    ? allUsers 
    : allUsers.filter(u => u.role === filterRole);

  const roleFilters = [
    { id: 'all', label: 'All Users', icon: 'people' },
    { id: 'donor', label: 'Donors', icon: 'heart' },
    { id: 'beneficiary', label: 'Beneficiaries', icon: 'person' },
    { id: 'business', label: 'Businesses', icon: 'storefront' },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor': return '#3B82F6';
      case 'beneficiary': return '#10B981';
      case 'business': return '#F59E0B';
      case 'admin': return '#EF4444';
      default: return colors.primary;
    }
  };

  const handleGrantCredits = (user: User) => {
    setSelectedUser(user);
    setActionType('credits');
    setCreditAmount('');
    setErrorMessage('');
    setShowActionModal(true);
  };

  const handleSuspendUser = (user: User) => {
    setSelectedUser(user);
    setActionType('suspend');
    setErrorMessage('');
    setShowActionModal(true);
  };

  const handleActivateUser = (user: User) => {
    setSelectedUser(user);
    setActionType('activate');
    setErrorMessage('');
    setShowActionModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedUser) return;

    setErrorMessage(''); // Clear any previous errors
    
    try {
      if (actionType === 'credits') {
        const amount = parseInt(creditAmount);
        if (isNaN(amount) || amount === 0) {
          return;
        }

        // Calculate new credits
        const newCredits = (selectedUser.credits || 0) + amount;

        // Update Supabase first
        if (isSupabaseConfigured()) {
          const { error } = await supabase
            .from('users')
            .update({ credits: newCredits })
            .eq('id', selectedUser.id);
          
          if (error) {
            console.error('Error updating credits:', error);
            return;
          }
        }

        // Update local store
        updateLocalUser(selectedUser.id, { credits: newCredits });

        // Refresh users list from database
        await fetchUsers();

        sendNotification(
          selectedUser.id,
          'credits_added',
          'Credits Updated! 💰',
          `You have been ${amount > 0 ? 'granted' : 'revoked'} ${Math.abs(amount)} credits by an admin.`,
          { amount }
        );
      } else if (actionType === 'suspend') {
        // Update Supabase to set account status
        if (isSupabaseConfigured()) {
          const { error } = await supabase
            .from('users')
            .update({ 
              account_status: 'suspended',
              suspended_at: new Date().toISOString()
            })
            .eq('id', selectedUser.id);
          
          if (error) {
            // Check if column doesn't exist
            if (error.code === 'PGRST204' || error.message?.includes('account_status') || error.code === '42703') {
              setErrorMessage('⚠️ Database Setup Required\n\nThe suspend feature needs a database update. Please run the SQL script:\n\nADD_ACCOUNT_STATUS_COLUMN.sql\n\nin your Supabase SQL Editor.');
              return;
            } else {
              setErrorMessage(`Error: ${error.message || 'Failed to suspend user'}`);
              return;
            }
          }
        }

        // Refresh users list
        await fetchUsers();
        
        sendNotification(
          selectedUser.id,
          'system',
          'Account Suspended',
          "Your account has been suspended. Please contact support for more information.",
          {}
        );
      } else if (actionType === 'activate') {
        // Update Supabase to set account status
        if (isSupabaseConfigured()) {
          const { error } = await supabase
            .from('users')
            .update({ 
              account_status: 'active',
              suspended_at: null
            })
            .eq('id', selectedUser.id);
          
          if (error) {
            // Check if column doesn't exist
            if (error.code === 'PGRST204' || error.message?.includes('account_status') || error.code === '42703') {
              setErrorMessage('⚠️ Database Setup Required\n\nThe suspend feature needs a database update. Please run the SQL script:\n\nADD_ACCOUNT_STATUS_COLUMN.sql\n\nin your Supabase SQL Editor.');
              return;
            } else {
              setErrorMessage(`Error: ${error.message || 'Failed to activate user'}`);
              return;
            }
          }
        }

        // Refresh users list
        await fetchUsers();
        
        sendNotification(
          selectedUser.id,
          'system',
          'Account Reactivated! 🎉',
          "Your account has been reactivated. Welcome back!",
          {}
        );
      }
    } catch (error) {
      console.error('Error performing action:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      return;
    }

    setShowActionModal(false);
    setSelectedUser(null);
    setCreditAmount('');
    setErrorMessage('');
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
              <Text className="text-2xl font-bold" style={{ color: colors.text }}>
                User Management
              </Text>
              {loading && <ActivityIndicator size="small" color={colors.primary} />}
            </View>
            
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-sm" style={{ color: colors.textSecondary }}>
                  {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
                </Text>
                <Text className="text-xs mt-0.5" style={{ color: colors.textTertiary }}>
                  {supabaseUsers.length > 0 ? '🟢 Supabase connected' : '🟡 Using local data'}
                </Text>
              </View>
              <Pressable 
                onPress={fetchUsers}
                className="px-3 py-1.5 rounded-lg flex-row items-center"
                style={{ backgroundColor: colors.surfaceHover }}
                disabled={loading}
              >
                <Ionicons name="refresh" size={14} color={colors.text} />
                <Text className="text-xs font-medium ml-1" style={{ color: colors.text }}>
                  Refresh
                </Text>
              </Pressable>
            </View>
            
            {/* Filter Tabs */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {roleFilters.map((filter) => (
                <Pressable
                  key={filter.id}
                  onPress={() => setFilterRole(filter.id)}
                  className="px-4 py-2 rounded-full flex-row items-center"
                  style={{ 
                    backgroundColor: filterRole === filter.id ? colors.primary : colors.surfaceHover 
                  }}
                >
                  <Ionicons
                    name={filter.icon as any}
                    size={16}
                    color={filterRole === filter.id ? 'white' : colors.text}
                  />
                  <Text 
                    className="font-bold text-sm ml-2"
                    style={{ color: filterRole === filter.id ? 'white' : colors.text }}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Users List */}
        <View className="px-5 pt-4">
          {/* Helper Banner */}
          {showHelper && supabaseUsers.length === 0 && localUsers.length <= 1 && (
            <View className="mb-4">
              <UserManagementHelper 
                colors={colors} 
                onDismiss={() => setShowHelper(false)} 
              />
            </View>
          )}
          
          {filteredUsers.length > 0 ? (
            <View className="gap-3">
              {filteredUsers.map((user, index) => {
                const roleColor = getRoleColor(user.role);
                const isSuspended = user.accountStatus === 'suspended';
                
                return (
                  <Card key={user.id} shadow="lg" delay={index * 50}>
                    <View className="flex-row items-center mb-3">
                      <View 
                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                        style={{ backgroundColor: roleColor + '15' }}
                      >
                        <Ionicons 
                          name={user.role === 'donor' ? 'heart' : user.role === 'business' ? 'storefront' : user.role === 'admin' ? 'shield' : 'person'} 
                          size={24} 
                          color={roleColor} 
                        />
                      </View>
                      
                      <View className="flex-1">
                        <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                          {user.name}
                        </Text>
                        <Text className="text-sm mb-1" style={{ color: colors.textSecondary }}>
                          {user.email}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <View 
                            className="px-2 py-1 rounded-full"
                            style={{ backgroundColor: roleColor + '15' }}
                          >
                            <Text className="text-xs font-bold" style={{ color: roleColor }}>
                              {user.role}
                            </Text>
                          </View>
                          {user.role === 'beneficiary' && user.credits !== undefined && (
                            <View 
                              className="px-2 py-1 rounded-full flex-row items-center"
                              style={{ backgroundColor: colors.success + '15' }}
                            >
                              <Ionicons name="wallet" size={10} color={colors.success} />
                              <Text className="text-xs font-bold ml-1" style={{ color: colors.success }}>
                                {user.credits}
                              </Text>
                            </View>
                          )}
                          {isSuspended && (
                            <View 
                              className="px-2 py-1 rounded-full flex-row items-center"
                              style={{ backgroundColor: colors.error + '15' }}
                            >
                              <Ionicons name="ban" size={10} color={colors.error} />
                              <Text className="text-xs font-bold ml-1" style={{ color: colors.error }}>
                                Suspended
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    {user.role !== 'admin' && (
                      <View className="flex-row gap-2">
                        {user.role === 'beneficiary' && (
                          <Pressable
                            onPress={() => handleGrantCredits(user)}
                            className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
                            style={{ backgroundColor: colors.success + '15' }}
                          >
                            <Ionicons name="wallet" size={16} color={colors.success} />
                            <Text className="font-bold text-xs ml-1" style={{ color: colors.success }}>
                              Credits
                            </Text>
                          </Pressable>
                        )}
                        
                        {isSuspended ? (
                          <Pressable
                            onPress={() => handleActivateUser(user)}
                            className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
                            style={{ backgroundColor: '#10B981' + '15' }}
                          >
                            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                            <Text className="font-bold text-xs ml-1" style={{ color: '#10B981' }}>
                              Activate
                            </Text>
                          </Pressable>
                        ) : (
                          <Pressable
                            onPress={() => handleSuspendUser(user)}
                            className="flex-1 py-2.5 rounded-lg flex-row items-center justify-center"
                            style={{ backgroundColor: colors.error + '15' }}
                          >
                            <Ionicons name="ban" size={16} color={colors.error} />
                            <Text className="font-bold text-xs ml-1" style={{ color: colors.error }}>
                              Suspend
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    )}
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
                  <Ionicons name="people-outline" size={40} color={colors.textTertiary} />
                </View>
                <Text className="font-bold text-lg mb-1" style={{ color: colors.text }}>
                  No Users Found
                </Text>
                <Text className="text-sm text-center" style={{ color: colors.textSecondary }}>
                  {filterRole === 'all' 
                    ? 'No users registered yet' 
                    : `No ${filterRole}s found`}
                </Text>
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Action Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showActionModal}
        onRequestClose={() => setShowActionModal(false)}
      >
        <Pressable 
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => {
            setShowActionModal(false);
            setErrorMessage('');
          }}
        >
          <Pressable 
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedUser && (
              <>
                <View className="items-center mb-4">
                  <View 
                    className="w-16 h-16 rounded-full items-center justify-center mb-3"
                    style={{ 
                      backgroundColor: actionType === 'credits' 
                        ? colors.success + '15' 
                        : actionType === 'suspend' 
                        ? colors.error + '15' 
                        : colors.success + '15' 
                    }}
                  >
                    <Ionicons 
                      name={
                        actionType === 'credits' ? 'wallet' : 
                        actionType === 'suspend' ? 'ban' : 
                        'checkmark-circle'
                      } 
                      size={32} 
                      color={
                        actionType === 'credits' ? colors.success : 
                        actionType === 'suspend' ? colors.error : 
                        colors.success
                      } 
                    />
                  </View>
                  <Text className="text-xl font-bold mb-2" style={{ color: colors.text }}>
                    {actionType === 'credits' ? 'Adjust Credits' : 
                     actionType === 'suspend' ? 'Suspend User' : 
                     'Activate User'}
                  </Text>
                  <Text className="text-center mb-1" style={{ color: colors.textSecondary }}>
                    {selectedUser.name}
                  </Text>
                  {actionType === 'credits' && (
                    <Text className="text-sm" style={{ color: colors.textTertiary }}>
                      Current balance: {selectedUser.credits || 0} credits
                    </Text>
                  )}
                </View>

                {actionType === 'credits' && (
                  <View className="mb-4">
                    <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
                      Enter amount (use negative to revoke):
                    </Text>
                    <TextInput
                      className="p-4 rounded-xl text-base text-center"
                      style={{ 
                        backgroundColor: colors.surfaceHover,
                        color: colors.text,
                      }}
                      placeholder="+50 or -20"
                      placeholderTextColor={colors.textTertiary}
                      value={creditAmount}
                      onChangeText={setCreditAmount}
                      keyboardType="numbers-and-punctuation"
                      returnKeyType="done"
                      onSubmitEditing={handleConfirmAction}
                      blurOnSubmit={true}
                      autoFocus={true}
                    />
                  </View>
                )}

                {actionType === 'suspend' && (
                  <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.error + '10' }}>
                    <Text className="text-sm text-center" style={{ color: colors.error }}>
                      This will prevent the user from accessing their account. They will be notified via email.
                    </Text>
                  </View>
                )}

                {actionType === 'activate' && (
                  <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.success + '10' }}>
                    <Text className="text-sm text-center" style={{ color: colors.success }}>
                      This will restore full access to the user account. They will be notified via email.
                    </Text>
                  </View>
                )}

                {/* Error Message Display */}
                {errorMessage !== '' && (
                  <View className="mb-4 p-4 rounded-xl" style={{ backgroundColor: colors.error + '15', borderWidth: 1, borderColor: colors.error }}>
                    <View className="flex-row items-start">
                      <Ionicons name="alert-circle" size={20} color={colors.error} style={{ marginRight: 8, marginTop: 2 }} />
                      <Text className="text-sm flex-1" style={{ color: colors.error, lineHeight: 20 }}>
                        {errorMessage}
                      </Text>
                    </View>
                  </View>
                )}

                <View className="gap-3">
                  <Pressable
                    onPress={handleConfirmAction}
                    className="py-4 rounded-xl"
                    style={{ 
                      backgroundColor: 
                        actionType === 'credits' ? colors.success : 
                        actionType === 'suspend' ? colors.error : 
                        colors.success
                    }}
                  >
                    <Text className="text-white font-bold text-center text-lg">
                      Confirm {actionType === 'credits' ? 'Adjustment' : actionType === 'suspend' ? 'Suspension' : 'Activation'}
                    </Text>
                  </Pressable>
                  
                  <Pressable
                    onPress={() => {
                      setShowActionModal(false);
                      setErrorMessage('');
                    }}
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
    </SafeAreaView>
  );
}
