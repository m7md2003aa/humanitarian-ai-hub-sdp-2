import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TestAccount {
  role: string;
  email: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}

const testAccounts: TestAccount[] = [
  {
    role: 'Donor',
    email: 'donor@test.com',
    icon: 'heart',
    color: '#3B82F6',
    description: 'Upload donations, track impact',
  },
  {
    role: 'Beneficiary',
    email: 'beneficiary@test.com',
    icon: 'people',
    color: '#10B981',
    description: 'Browse items, claim with credits',
  },
  {
    role: 'Business',
    email: 'business@test.com',
    icon: 'storefront',
    color: '#F59E0B',
    description: 'Upload surplus, track metrics',
  },
  {
    role: 'Admin',
    email: 'admin@test.com',
    icon: 'shield-checkmark',
    color: '#EF4444',
    description: 'Verify donations, manage system',
  },
];

interface TestAccountsInfoProps {
  onSelectEmail: (email: string) => void;
}

export const TestAccountsInfo: React.FC<TestAccountsInfoProps> = ({ onSelectEmail }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="mb-4">
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className="bg-blue-50 p-4 rounded-xl flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1">
          <View className="w-10 h-10 rounded-xl bg-blue-500/10 items-center justify-center mr-3">
            <Ionicons name="flask" size={20} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Text className="text-blue-900 font-bold text-sm mb-0.5">
              Test Accounts
            </Text>
            <Text className="text-blue-700 text-xs">
              {isExpanded ? 'Tap to hide' : 'Tap to view test credentials'}
            </Text>
          </View>
        </View>
        <Ionicons 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#3B82F6" 
        />
      </Pressable>

      {isExpanded && (
        <View className="mt-3 gap-2">
          {testAccounts.map((account) => (
            <Pressable
              key={account.email}
              onPress={() => {
                onSelectEmail(account.email);
                setIsExpanded(false);
              }}
              className="bg-white border border-gray-200 rounded-xl p-3"
            >
              <View className="flex-row items-center">
                <View 
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: `${account.color}15` }}
                >
                  <Ionicons 
                    name={account.icon} 
                    size={20} 
                    color={account.color} 
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-bold text-sm mb-0.5">
                    {account.role}
                  </Text>
                  <Text className="text-gray-600 text-xs mb-1">
                    {account.email}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {account.description}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </View>
            </Pressable>
          ))}
          
          <View className="bg-amber-50 p-3 rounded-xl mt-1">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={16} color="#F59E0B" style={{ marginTop: 2, marginRight: 8 }} />
              <Text className="text-amber-800 text-xs flex-1">
                <Text className="font-bold">Password:</Text> Use any password (e.g., "test123"). Mock auth accepts anything!
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
