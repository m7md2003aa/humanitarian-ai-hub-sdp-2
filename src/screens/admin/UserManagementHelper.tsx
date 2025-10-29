import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/Card';

interface Props {
  colors: any;
  onDismiss: () => void;
}

export function UserManagementHelper({ colors, onDismiss }: Props) {
  return (
    <Card shadow="lg" delay={0}>
      <View className="flex-row items-start">
        <View 
          className="w-10 h-10 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: '#F59E0B' + '15' }}
        >
          <Ionicons name="information-circle" size={24} color="#F59E0B" />
        </View>
        
        <View className="flex-1">
          <Text className="font-bold text-base mb-2" style={{ color: colors.text }}>
            Using Local Data Mode
          </Text>
          <Text className="text-sm mb-3" style={{ color: colors.textSecondary }}>
            Only users who logged in on THIS device appear here. To see all users from your database:
          </Text>
          
          <View className="gap-2 mb-3">
            <View className="flex-row items-start">
              <Text className="font-bold mr-2" style={{ color: colors.primary }}>1.</Text>
              <Text className="flex-1 text-sm" style={{ color: colors.textSecondary }}>
                Run <Text className="font-bold">QUICK_SUPABASE_FIX.sql</Text> in Supabase SQL Editor
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="font-bold mr-2" style={{ color: colors.primary }}>2.</Text>
              <Text className="flex-1 text-sm" style={{ color: colors.textSecondary }}>
                Logout and login again as admin
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="font-bold mr-2" style={{ color: colors.primary }}>3.</Text>
              <Text className="flex-1 text-sm" style={{ color: colors.textSecondary }}>
                Users will sync from Supabase automatically
              </Text>
            </View>
          </View>
          
          <Pressable
            onPress={onDismiss}
            className="self-start px-4 py-2 rounded-lg"
            style={{ backgroundColor: colors.surfaceHover }}
          >
            <Text className="text-sm font-medium" style={{ color: colors.text }}>
              Got it
            </Text>
          </Pressable>
        </View>
      </View>
    </Card>
  );
}
