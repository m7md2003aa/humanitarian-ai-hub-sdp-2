import React, { useState, useRef } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors } from '../utils/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH * 0.85;

export default function StorySection() {
  const theme = useSettingsStore(state => state.theme);
  const colors = getThemeColors(theme);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const images = [
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&q=80',
    'https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?w=800&q=80',
  ];

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / IMAGE_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View className="px-6 py-12">
      <Text 
        className="text-2xl font-bold mb-6"
        style={{ color: colors.text }}
      >
        Why It Matters
      </Text>

      <View className="mb-6">
        <Text 
          className="text-base leading-7 mb-4"
          style={{ color: colors.textSecondary }}
        >
          Our AI-powered platform ensures every donation reaches those who need it most. We verify items instantly, allocate credits fairly, and provide complete transparency from donor to beneficiary.
        </Text>
        <Text 
          className="text-base leading-7"
          style={{ color: colors.textSecondary }}
        >
          Join thousands making a real impact through technology-enabled humanitarian giving.
        </Text>
      </View>

      {/* Image Carousel */}
      <View>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          snapToInterval={IMAGE_WIDTH}
          decelerationRate="fast"
        >
          {images.map((uri, index) => (
            <View key={index} style={{ width: IMAGE_WIDTH, paddingRight: 16 }}>
              <Image
                source={{ uri }}
                style={{ 
                  width: IMAGE_WIDTH - 16, 
                  height: 200, 
                  borderRadius: 20 
                }}
                contentFit="cover"
              />
            </View>
          ))}
        </ScrollView>

        {/* Pagination Dots */}
        <View className="flex-row justify-center mt-4">
          {images.map((_, index) => (
            <View
              key={index}
              className="w-2 h-2 rounded-full mx-1"
              style={{
                backgroundColor: index === activeIndex ? colors.primary : colors.border,
              }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}