import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { cn } from '../../utils/cn';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      Alert.alert('Error', 'Invalid credentials');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-6 justify-center">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="heart-outline" size={32} color="#3B82F6" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Humanitarian AI Hub
            </Text>
            <Text className="text-gray-600 text-center">
              Connecting donors, beneficiaries, and businesses through AI-powered giving
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="relative">
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3 pr-12 text-gray-900"
                  placeholder="Enter your password"
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
                    color="#6B7280"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={isLoading}
              className={cn(
                "bg-blue-600 rounded-lg py-4 items-center mt-6",
                isLoading && "opacity-50"
              )}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Don't have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text className="text-blue-600 font-semibold">Sign Up</Text>
              </Pressable>
            </View>

            <View className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Text className="text-sm text-gray-600 font-medium mb-2">Quick Login (Demo):</Text>
              <Text className="text-xs text-gray-500">
                donor@test.com - Donor account{'\n'}
                beneficiary@test.com - Beneficiary account{'\n'}
                business@test.com - Business account{'\n'}
                admin@test.com - Admin account
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}