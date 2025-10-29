import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle, 
  interpolate,
  Extrapolation,
  SharedValue,
  FadeInDown,
} from 'react-native-reanimated';
import { useSettingsStore } from '../state/settingsStore';
import { getThemeColors, spacing, typography } from '../utils/theme';
import { translations } from '../utils/i18n';
import { Button } from './Button';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const HERO_HEIGHT = SCREEN_HEIGHT * 0.55;

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreGuest: () => void;
  scrollY: SharedValue<number>;
}

export default function HeroSection({ onGetStarted, onExploreGuest, scrollY }: HeroSectionProps) {
  const theme = useSettingsStore(s => s.theme);
  const language = useSettingsStore(s => s.language);
  const colors = getThemeColors(theme);
  const t = translations[language];
  const isRTL = language === 'ar';

  const imageStyle = useAnimatedStyle(() => {
    const parallax = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT],
      [0, -HERO_HEIGHT * 0.3],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY: parallax }],
    };
  });

  const overlayOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HERO_HEIGHT / 2],
      [0.4, 0.7],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <View style={[styles.container, { height: HERO_HEIGHT }]}>
      {/* Background Image with Parallax */}
      <Animated.View style={[styles.imageContainer, imageStyle]}>
        <Image
          source={require('../../assets/hero-volunteer.jpg')}
          style={styles.image}
          contentFit="cover"
          alt="Volunteer with humanitarian mission"
        />
      </Animated.View>

      {/* Gradient Overlay - 45-55% darkness for text readability */}
      <Animated.View style={[styles.gradientContainer, overlayOpacity]}>
        <LinearGradient
          colors={
            theme === 'dark'
              ? ['rgba(17, 24, 39, 0.15)', 'rgba(17, 24, 39, 0.85)']
              : ['rgba(0, 0, 0, 0.15)', 'rgba(0, 0, 0, 0.6)']
          }
          style={styles.gradient}
        />
      </Animated.View>

      {/* Content */}
      <Animated.View 
        entering={FadeInDown.duration(800).delay(200)}
        style={[styles.content, isRTL && styles.contentRTL]}
      >
        <Text style={[styles.headline, isRTL && styles.textRTL]}>
          {t.heroHeadline}
        </Text>
        
        <Text style={[styles.subheadline, isRTL && styles.textRTL]}>
          {t.heroSubheadline}
        </Text>

        {/* CTA Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title={t.getStarted}
            onPress={onGetStarted}
            variant="primary"
            size="lg"
            fullWidth
          />
          
          <View style={{ height: spacing.sm }} />
          
          <Button
            title={t.exploreAsGuest}
            onPress={onExploreGuest}
            variant="outline"
            size="lg"
            fullWidth
            style={{ borderColor: '#FFFFFF', borderWidth: 2 }}
            textStyle={{ color: '#FFFFFF' }}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  image: {
    width: '100%',
    height: '120%',
  },
  gradientContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contentRTL: {
    alignItems: 'flex-end',
  },
  headline: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheadline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.xl,
    opacity: 0.95,
    lineHeight: typography.fontSize.base * typography.lineHeight.relaxed,
    paddingHorizontal: spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  textRTL: {
    textAlign: 'right',
  },
  buttonContainer: {
    width: '100%',
  },
});