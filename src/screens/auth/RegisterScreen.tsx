import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/authStore';
import { cn } from '../../utils/cn';

const roles = [
  { id: 'donor', label: 'Donor', icon: 'heart-outline', color: 'bg-blue-100', textColor: 'text-blue-600' },
  { id: 'beneficiary', label: 'Beneficiary', icon: 'people-outline', color: 'bg-green-100', textColor: 'text-green-600' },
  { id: 'business', label: 'Business', icon: 'business-outline', color: 'bg-yellow-100', textColor: 'text-yellow-600' },
];

export default function RegisterScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState('donor');
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    const success = await register(email, password, name, selectedRole);
    if (!success) {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="items-center my-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="person-add-outline" size={32} color="#3B82F6" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2">
              Join Our Community
            </Text>
            <Text className="text-gray-600 text-center">
              Create an account to start making a difference
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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

            <View>
              <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-3 font-medium">Account Type</Text>
              <View className="space-y-3">
                {roles.map((role) => (
                  <Pressable
                    key={role.id}
                    onPress={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex-row items-center p-4 rounded-lg border-2",
                      selectedRole === role.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    )}
                  >
                    <View className={cn("w-10 h-10 rounded-full items-center justify-center mr-3", role.color)}>
                      <Ionicons name={role.icon as any} size={20} color="#6B7280" />
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-900">{role.label}</Text>
                      <Text className="text-sm text-gray-600">
                        {role.id === 'donor' && 'Donate items to help others'}
                        {role.id === 'beneficiary' && 'Receive items using credits'}
                        {role.id === 'business' && 'Share surplus goods with community'}
                      </Text>
                    </View>
                    {selectedRole === role.id && (
                      <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            <Pressable
              onPress={handleRegister}
              disabled={isLoading}
              className={cn(
                "bg-blue-600 rounded-lg py-4 items-center mt-6",
                isLoading && "opacity-50"
              )}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </Pressable>

            <View className="flex-row justify-center mt-6 mb-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}