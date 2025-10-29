import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSettingsStore } from '../../state/settingsStore';
import { getThemeColors } from '../../utils/theme';
import { translations } from '../../utils/i18n';

import TopAppBar from '../../components/TopAppBar';
import HeroSection from '../../components/HeroSection';
import RoleCard from '../../components/RoleCard';
import MetricsChips from '../../components/MetricsChips';
import StorySection from '../../components/StorySection';
import Footer from '../../components/Footer';
import AuthModal from '../../components/AuthModal';

export default function LandingScreen({ navigation }: any) {
  const theme = useSettingsStore(s => s.theme);
  const language = useSettingsStore(s => s.language);
  const setLastRole = useSettingsStore(s => s.setLastRole);
  const colors = getThemeColors(theme);
  const t = translations[language];
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleGetStarted = () => {
    setLastRole(null);
    bottomSheetRef.current?.expand();
  };

  const handleExploreGuest = () => {
    navigation.navigate('GuestHome');
  };

  const handleRolePress = (roleId: string) => {
    setLastRole(roleId);
    bottomSheetRef.current?.expand();
  };

  const roleCards = [
    {
      icon: 'heart' as const,
      title: t.donorTitle,
      description: t.donorDesc,
      color: colors.donor,
      role: 'donor',
    },
    {
      icon: 'people' as const,
      title: t.beneficiaryTitle,
      description: t.beneficiaryDesc,
      color: colors.beneficiary,
      role: 'beneficiary',
    },
    {
      icon: 'business' as const,
      title: t.businessTitle,
      description: t.businessDesc,
      color: colors.business,
      role: 'business',
    },
    {
      icon: 'shield-checkmark' as const,
      title: t.adminTitle,
      description: t.adminDesc,
      color: colors.admin,
      role: 'admin',
    },
  ];

  return (
    <GestureHandlerRootView style={styles.root}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TopAppBar showNotifications={false} transparent />
        
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <HeroSection
            onGetStarted={handleGetStarted}
            onExploreGuest={handleExploreGuest}
            scrollY={scrollY}
          />

          {/* Role Cards Section */}
          <View style={styles.roleCardsSection}>
            <View style={styles.roleCardsGrid}>
              {roleCards.map((card, index) => (
                <RoleCard
                  key={card.role}
                  icon={card.icon}
                  title={card.title}
                  description={card.description}
                  color={card.color}
                  onPress={() => handleRolePress(card.role)}
                  index={index}
                />
              ))}
            </View>
          </View>

          {/* Metrics Chips */}
          <MetricsChips />

          {/* Story Section */}
          <StorySection />

          {/* Footer */}
          <Footer />
        </Animated.ScrollView>

        {/* Auth Modal */}
        <AuthModal bottomSheetRef={bottomSheetRef} />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  roleCardsSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  roleCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },
});