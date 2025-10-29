import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAuthStore } from '../state/authStore';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors } from '../utils/theme';
import { cn } from '../utils/cn';
import { TestAccountsInfo } from './TestAccountsInfo';

interface AuthModalProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  preselectedRole?: string;
}

// Donor, Beneficiary, and Business are selectable during sign up
// Admin cannot be created client-side
const signUpRoles = [
  { id: 'donor', label: 'Donor', description: 'Upload & track your donations' },
  { id: 'beneficiary', label: 'Beneficiary', description: 'Redeem credits for essentials' },
  { id: 'business', label: 'Business', description: 'List surplus or discounted goods' },
];

export default function AuthModal({ bottomSheetRef, preselectedRole }: AuthModalProps) {
  const theme = useSettingsStore(state => state.theme);
  const colors = getThemeColors(theme);
  const { login, register, isLoading } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState(preselectedRole || 'donor');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      bottomSheetRef.current?.close();
      // Clear form
      setEmail('');
      setPassword('');
    } else {
      Alert.alert(
        'Login Failed', 
        'Invalid email or password. Please check your credentials or create a new account.',
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Sign Up Instead', onPress: () => setActiveTab('signup') }
        ]
      );
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    const success = await register(email, password, name, selectedRole);
    if (success) {
      Alert.alert(
        'Account Created! 🎉',
        `Welcome to Humanitarian AI Hub, ${name}! Your account has been created successfully.`,
        [
          {
            text: 'Get Started',
            onPress: () => bottomSheetRef.current?.close()
          }
        ]
      );
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } else {
      Alert.alert(
        'Registration Failed', 
        'This email may already be registered. Please try signing in or use a different email.',
        [
          { text: 'Try Again', style: 'cancel' },
          { text: 'Sign In Instead', onPress: () => setActiveTab('signin') }
        ]
      );
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['90%']}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.surface }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Close Button */}
        <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: 8 }}>
          <Pressable
            onPress={() => bottomSheetRef.current?.close()}
            style={{
              alignSelf: 'flex-end',
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.surfaceHover,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
        </View>
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Tabs */}
            <View className="flex-row mb-6 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <Pressable
                onPress={() => setActiveTab('signin')}
                className={cn(
                  "flex-1 py-3 rounded-full items-center",
                  activeTab === 'signin' && "bg-white dark:bg-gray-700"
                )}
              >
                <Text 
                  className="font-semibold"
                  style={{ color: activeTab === 'signin' ? colors.primary : colors.textSecondary }}
                >
                  Sign In
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab('signup')}
                className={cn(
                  "flex-1 py-3 rounded-full items-center",
                  activeTab === 'signup' && "bg-white dark:bg-gray-700"
                )}
              >
                <Text 
                  className="font-semibold"
                  style={{ color: activeTab === 'signup' ? colors.primary : colors.textSecondary }}
                >
                  Sign Up
                </Text>
              </Pressable>
            </View>

            {activeTab === 'signin' ? (
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onSubmit={handleSignIn}
                isLoading={isLoading}
                colors={colors}
              />
            ) : (
              <SignUpForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                onSubmit={handleSignUp}
                isLoading={isLoading}
                colors={colors}
              />
            )}

            {/* Test Accounts - Sign In Only */}
            {activeTab === 'signin' && (
              <TestAccountsInfo 
                onSelectEmail={(email) => {
                  setEmail(email);
                  setPassword('test123');
                }}
              />
            )}

            {/* Security Note */}
            <Text 
              className="text-xs text-center mb-8"
              style={{ color: colors.textSecondary }}
            >
              🔒 We never share your data. Encrypted via Supabase.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </BottomSheetView>
    </BottomSheet>
  );
}

// Sign In Form Component
function SignInForm({ email, setEmail, password, setPassword, showPassword, setShowPassword, onSubmit, isLoading, colors }: any) {
  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Email
        </Text>
        <TextInput
          className="border rounded-xl px-4 py-3"
          style={{ borderColor: colors.border, color: colors.text }}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Password
        </Text>
        <View className="relative">
          <TextInput
            className="border rounded-xl px-4 py-3 pr-12"
            style={{ borderColor: colors.border, color: colors.text }}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <Pressable onPress={() => Alert.alert('Coming Soon', 'Password reset feature coming soon')}>
        <Text className="text-sm text-right" style={{ color: colors.primary }}>
          Forgot Password?
        </Text>
      </Pressable>

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        className="rounded-xl py-4 items-center mt-6"
        style={{ backgroundColor: colors.primary, opacity: isLoading ? 0.5 : 1 }}
      >
        <Text className="text-white font-semibold text-lg">
          {isLoading ? 'Signing In...' : 'Continue with Email'}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => Alert.alert('Coming Soon', 'Google Sign-In coming soon')}
        className="border rounded-xl py-4 items-center flex-row justify-center"
        style={{ borderColor: colors.border }}
      >
        <Ionicons name="logo-google" size={20} color={colors.text} style={{ marginRight: 8 }} />
        <Text className="font-semibold" style={{ color: colors.text }}>
          Continue with Google
        </Text>
      </Pressable>
    </View>
  );
}

// Sign Up Form Component
function SignUpForm({ name, setName, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, selectedRole, setSelectedRole, onSubmit, isLoading, colors }: any) {
  return (
    <View className="space-y-4">
      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Full Name
        </Text>
        <TextInput
          className="border rounded-xl px-4 py-3"
          style={{ borderColor: colors.border, color: colors.text }}
          placeholder="Enter your full name"
          placeholderTextColor={colors.textSecondary}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </View>

      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Email
        </Text>
        <TextInput
          className="border rounded-xl px-4 py-3"
          style={{ borderColor: colors.border, color: colors.text }}
          placeholder="Enter your email"
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
      </View>

      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Password
        </Text>
        <View className="relative">
          <TextInput
            className="border rounded-xl px-4 py-3 pr-12"
            style={{ borderColor: colors.border, color: colors.text }}
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>
      </View>

      <View>
        <Text className="text-sm font-medium mb-2" style={{ color: colors.text }}>
          Confirm Password
        </Text>
        <TextInput
          className="border rounded-xl px-4 py-3"
          style={{ borderColor: colors.border, color: colors.text }}
          placeholder="Confirm your password"
          placeholderTextColor={colors.textSecondary}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword}
        />
      </View>

      <View>
        <Text className="text-sm font-medium mb-3" style={{ color: colors.text }}>
          Account Type
        </Text>
        <View className="space-y-2">
          {signUpRoles.map((role) => (
            <Pressable
              key={role.id}
              onPress={() => setSelectedRole(role.id)}
              className="flex-row items-center p-3 rounded-xl border"
              style={{ 
                borderColor: selectedRole === role.id ? colors.primary : colors.border,
                backgroundColor: selectedRole === role.id ? `${colors.primary}10` : 'transparent'
              }}
            >
              <View className="flex-1">
                <Text className="font-medium" style={{ color: colors.text }}>
                  {role.label}
                </Text>
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {role.description}
                </Text>
              </View>
              {selectedRole === role.id && (
                <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        className="rounded-xl py-4 items-center mt-6"
        style={{ backgroundColor: colors.primary, opacity: isLoading ? 0.5 : 1 }}
      >
        <Text className="text-white font-semibold text-lg">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </Pressable>
    </View>
  );
}