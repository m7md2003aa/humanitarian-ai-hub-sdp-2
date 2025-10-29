import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { Card } from '../../components/Card';

const faqs = [
  {
    question: 'How do I donate items?',
    answer: 'Simply upload photos of your items, and our AI will help classify them. After admin verification, they\'ll be available for beneficiaries.',
  },
  {
    question: 'How does the credit system work?',
    answer: 'Beneficiaries earn credits through various activities and can use them to claim donated items.',
  },
  {
    question: 'How long does verification take?',
    answer: 'Most donations are verified within 24-48 hours by our admin team.',
  },
  {
    question: 'Can I cancel a donation?',
    answer: 'Yes, you can cancel donations before they are verified by contacting support.',
  },
];

export default function HelpCenterScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const theme = useSettingsStore(s => s.theme);
  const colors = getThemeColors(theme);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }} edges={['top']}>
      {/* Header */}
      <View className="px-5 pt-4 pb-4 flex-row items-center" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Pressable
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: colors.surfaceHover }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          Help Center
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="px-5 pt-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Frequently Asked Questions
          </Text>

          {faqs.map((faq, index) => (
            <Card key={index} shadow="lg" delay={index * 50} style={{ marginBottom: 12 }}>
              <View className="mb-2">
                <Text className="font-bold text-base mb-2" style={{ color: colors.text }}>
                  {faq.question}
                </Text>
                <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
                  {faq.answer}
                </Text>
              </View>
            </Card>
          ))}

          <Text className="text-lg font-bold mb-3 mt-4" style={{ color: colors.text }}>
            Contact Support
          </Text>

          <Card shadow="lg" delay={200} style={{ marginBottom: 12 }}>
            <Pressable>
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="mail" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                    Email Support
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    support@vibecode.app
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>

          <Card shadow="lg" delay={250}>
            <Pressable>
              <View className="flex-row items-center">
                <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: colors.primary + '15' }}>
                  <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                    Live Chat
                  </Text>
                  <Text className="text-sm" style={{ color: colors.textSecondary }}>
                    Chat with our support team
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
              </View>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
